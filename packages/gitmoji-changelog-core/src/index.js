const semver = require('semver')
const gitRawCommits = require('git-raw-commits')
const gitSemverTags = require('git-semver-tags')
const semverCompare = require('semver-compare')
const through = require('through2')
const concat = require('concat-stream')
const { head, isEmpty, get } = require('lodash')
const { promisify } = require('util')

const { parseCommit } = require('./parser')
const { getPackageInfo, getRepoInfo } = require('./metaInfo')
const groupMapping = require('./groupMapping')
const logger = require('./logger')
const { groupSentencesByDistance } = require('./utils')

const gitSemverTagsAsync = promisify(gitSemverTags)

const COMMIT_FORMAT = '%n%H%n%an%n%cI%n%s%n%b'

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
async function generateChangelog(options = {}) {
  const {
    mode,
    release,
    groupSimilarCommits,
  } = options

  if (mode === 'init') {
    const packageInfo = await getPackageInfo()
    let requestedVersion = release === 'from-package' ? packageInfo.version : release

    let tags = [...await gitSemverTagsAsync(), '']

    const hasNext = tags.includes(`v${requestedVersion}`) || !requestedVersion

    const HEAD = ''
    let nextTag = HEAD
    const changes = await Promise.all(tags.map(async tag => {
      let version = sanitizeVersion(nextTag)
      if (!nextTag) {
        version = hasNext ? 'next' : requestedVersion
      }
      const from = tag
      const to = nextTag
      nextTag = tag
      return generateVersion({ from, to, version, groupSimilarCommits })
    }))
      .then(versions => versions.sort((c1, c2) => {
        if (c1.version === 'next') return -1
        if (c2.version === 'next') return 1
        return semverCompare(c2.version, c1.version)
      }))

    const repository = await getRepoInfo(packageInfo)

    return {
      meta: {
        package: packageInfo,
        repository,
        lastVersion: sanitizeVersion(requestedVersion),
      },
      changes: changes.filter(({ groups }) => groups.length),
    }
  }

  const packageInfo = await getPackageInfo()
  let requestedVersion = release === 'from-package' ? packageInfo.version : release

  const { meta } = options
  const lastVersion = meta && meta.lastVersion ? meta.lastVersion : undefined
  let tags = await gitSemverTagsAsync()
  const hasNext = tags.includes(`v${requestedVersion}`) || !requestedVersion
  const lastVersionIndex = tags.findIndex(tag => tag === lastVersion)
  tags.splice(lastVersionIndex)
  tags.push('')

  const HEAD = ''
  let nextTag = HEAD
  const changes = await Promise.all(tags.map(async tag => {
    let version = sanitizeVersion(nextTag)
    if (!nextTag) {
      version = hasNext ? 'next' : requestedVersion
    }
    const from = tag
    const to = nextTag
    nextTag = tag
    return generateVersion({ from, to, version, groupSimilarCommits })
  }))
    .then(versions => versions.sort((c1, c2) => {
      if (c1.version === 'next') return -1
      if (c2.version === 'next') return 1
      return semverCompare(c2.version, c1.version)
    }))

  const repository = await getRepoInfo(packageInfo)

  if (isEmpty(changes[0].groups)) {
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
