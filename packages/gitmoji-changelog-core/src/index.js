const semver = require('semver')
const gitRawCommits = require('git-raw-commits')
const gitSemverTags = require('git-semver-tags')
const semverCompare = require('semver-compare')
const through = require('through2')
const concat = require('concat-stream')
const { isEmpty } = require('lodash')
const { promisify } = require('util')

const { parseCommit } = require('./parser')
const groupMapping = require('./groupMapping')
const logger = require('./logger')
const { groupSentencesByDistance } = require('./utils')

const gitSemverTagsAsync = promisify(gitSemverTags)

const COMMIT_FORMAT = '%n%H%n%an%n%cI%n%s%n%b'
const HEAD = ''
const TAIL = ''

function getCommits(from, to, customConfiguration) {
  return new Promise((resolve) => {
    gitRawCommits({
      format: COMMIT_FORMAT,
      from,
      to,
    }).pipe(through.obj((data, enc, next) => {
      next(null, parseCommit(data.toString(), customConfiguration.commitMapping))
    })).pipe(concat(data => {
      resolve(data)
    }))
  })
}

function makeGroups(commits, customCommitMapping) {
  if (isEmpty(commits)) return []

  const mapCommits = (arr) => {
    return arr
      .map(({ group, label }) => ({
        group,
        label,
        commits: commits
          .filter(commit => commit.group === group)
          .sort((first, second) => second.date.localeCompare(first.date)),
      }))
      .filter(group => group.commits.length)
  }

  if (customCommitMapping) {
    return mapCommits(customCommitMapping)
  }
  return mapCommits(groupMapping)
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
    customConfiguration,
  } = options
  let commits = filterCommits(await getCommits(from, to, customConfiguration))

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
    groups: makeGroups(commits, customConfiguration.commitMapping),
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

function hasNextVersion(tags, release) {
  if (!release || release === 'next') return true
  return tags.some(tag => semver.eq(tag, release))
}

async function generateVersions({
  tags,
  hasNext,
  release,
  groupSimilarCommits,
  customConfiguration,
}) {
  let nextTag = HEAD
  const targetVersion = hasNext ? 'next' : sanitizeVersion(release)
  const changes = await Promise.all(tags.map(async tag => {
    const version = sanitizeVersion(nextTag) || targetVersion
    const from = tag
    const to = nextTag
    nextTag = tag
    return generateVersion({
      from, to, version, groupSimilarCommits, customConfiguration,
    })
  }))
    .then(versions => versions.sort(sortVersions))

  return changes
}

async function generateChangelog(from, to, { groupSimilarCommits, customConfiguration } = {}) {
  const gitTags = await gitSemverTagsAsync()
  let tagsToProcess = [...gitTags]
  const hasNext = hasNextVersion(gitTags, to)

  if (from === TAIL) {
    tagsToProcess = [...tagsToProcess, TAIL]
  } else {
    const fromIndex = tagsToProcess.findIndex(tag => semver.eq(tag, from))
    tagsToProcess.splice(fromIndex + 1)

    if (hasNext && isEmpty(tagsToProcess)) {
      tagsToProcess.push(HEAD)
    }
  }

  const changes = await generateVersions({
    tags: tagsToProcess,
    hasNext,
    release: to,
    groupSimilarCommits,
    customConfiguration,
  })

  if (from !== TAIL && changes.length === 1 && isEmpty(changes[0].groups)) {
    throw new Error('No changes found. You may need to fetch or pull the last changes.')
  }

  return {
    meta: {
      lastVersion: sanitizeVersion(from),
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
