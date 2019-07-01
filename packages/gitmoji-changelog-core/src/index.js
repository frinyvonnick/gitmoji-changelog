const semver = require('semver')
const gitRawCommits = require('git-raw-commits')
const gitSemverTags = require('git-semver-tags')
const semverCompare = require('semver-compare')
const through = require('through2')
const concat = require('concat-stream')
const { isEmpty } = require('lodash')
const { promisify } = require('util')

const { parseCommit } = require('./parser')
const { getPackageInfo, getRepoInfo } = require('./metaInfo')
const groupMapping = require('./groupMapping')
const logger = require('./logger')
const { groupSentencesByDistance } = require('./utils')

const gitSemverTagsAsync = promisify(gitSemverTags)

const COMMIT_FORMAT = '%n%H%n%an%n%cI%n%s%n%b'
const HEAD = ''
const START = ''

function getCommits(from, to) {
  return new Promise((resolve) => {
    gitRawCommits({
      format: COMMIT_FORMAT,
      from,
      to,
    }).pipe(through.obj((data, enc, next) => {
      next(null, parseCommit(data.toString()))
    })).pipe(concat(data => {
      resolve(data)
    }))
  })
}

function makeGroups(commits) {
  if (isEmpty(commits)) return []

  return groupMapping
    .map(({ group, label }) => ({
      group,
      label,
      commits: commits
        .filter(commit => commit.group === group)
        .sort((first, second) => second.date.localeCompare(first.date)),
    }))
    .filter(group => group.commits.length)
}

function sanitizeVersion(version) {
  return semver.valid(version, {
    loose: false,
    includePrerelease: true,
  })
}

function filterCommits(commits) {
  return commits
    .filter(commit => commit.group !== 'useless')
}

async function generateVersion(options) {
  const {
    from,
    to,
    version,
    groupSimilarCommits,
  } = options
  let commits = filterCommits(await getCommits(from, to))

  if (groupSimilarCommits) {
    commits = groupSentencesByDistance(commits.map(commit => commit.message))
      .map(indexes => indexes.map(index => commits[index]))
      .map(([first, ...siblings]) => ({
        ...first,
        siblings,
      }))
  }

  const result = {
    version,
    groups: makeGroups(commits),
  }

  if (version !== 'next') {
    result.date = getLastCommitDate(commits)
  }

  return result
}

function sortVersions(c1, c2) {
  if (c1.version === 'next') return -1
  if (c2.version === 'next') return 1
  return semverCompare(c2.version, c1.version)
}

function hasNextVersion(tags, requestedVersion) {
  return tags.includes(`v${requestedVersion}`) || !requestedVersion || requestedVersion === 'next'
}

async function generateVersions({
  tags,
  hasNext,
  requestedVersion,
  groupSimilarCommits,
}) {
  let nextTag = HEAD
  const changes = await Promise.all(tags.map(async tag => {
    let version = sanitizeVersion(nextTag)
    if (!nextTag) {
      version = hasNext ? 'next' : requestedVersion
    }
    const from = tag
    const to = nextTag
    nextTag = tag
    return generateVersion({
      from, to, version, groupSimilarCommits,
    })
  }))
    .then(versions => versions.sort(sortVersions))

  return changes
}

async function generateChangelog(options = {}) {
  const {
    mode,
    release,
    groupSimilarCommits,
  } = options

  const packageInfo = await getPackageInfo()
  const repository = await getRepoInfo(packageInfo)
  let requestedVersion = release === 'from-package' ? packageInfo.version : release

  const gitTags = await gitSemverTagsAsync()
  let tagsToProcess = [...gitTags]
  const hasNext = hasNextVersion(gitTags, requestedVersion)
  let lastVersion

  if (mode === 'init') {
    lastVersion = requestedVersion
    tagsToProcess = [...tagsToProcess, START]
  } else {
    const { meta } = options
    lastVersion = meta && meta.lastVersion ? meta.lastVersion : undefined

    if (lastVersion !== undefined) {
      const lastVersionIndex = tagsToProcess.findIndex(tag => tag === lastVersion)
      tagsToProcess.splice(lastVersionIndex + 1)
    }

    if (hasNext && isEmpty(tagsToProcess)) {
      tagsToProcess.push('')
    }
  }

  const changes = await generateVersions({
    tags: tagsToProcess,
    hasNext,
    requestedVersion,
    groupSimilarCommits,
  })

  if (mode === 'update' && isEmpty(changes[0].groups)) {
    throw new Error('No changes found. You may need to fetch or pull the last changes.')
  }

  return {
    meta: {
      package: packageInfo,
      repository,
      lastVersion: sanitizeVersion(lastVersion),
    },
    changes: changes.filter(({ groups }) => groups.length),
  }
}

function getLastCommitDate(commits) {
  if (isEmpty(commits)) return null

  return commits
    .map((commit) => new Date(commit.date))
    .reduce((lastCommitDate, currentCommitDate) => {
      if (currentCommitDate > lastCommitDate) {
        return currentCommitDate
      }
      return lastCommitDate
    })
    .toISOString().split('T')[0]
}

module.exports = {
  generateChangelog,
  logger,
}
