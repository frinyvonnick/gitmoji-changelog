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
        .sort((first, second) => {
          if (!first.emojiCode) return -1

          const emojiCriteria = first.emojiCode.localeCompare(second.emojiCode)
          if (emojiCriteria !== 0) return emojiCriteria
          return first.date.localeCompare(second.date)
        }),
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

  return {
    version,
    date: version !== 'next' ? getLastCommitDate(commits) : undefined,
    groups: makeGroups(commits),
  }
}

async function generateVersions({ tags, groupSimilarCommits }) {
  let nextTag = ''

  return Promise.all(
    [...tags, '']
      .map(tag => {
        const params = {
          groupSimilarCommits,
          from: tag,
          to: nextTag,
          version: nextTag ? sanitizeVersion(nextTag) : 'next',
        }
        nextTag = tag
        return params
      })
      .map(generateVersion)
  )
    .then(versions => versions.sort((c1, c2) => {
      if (c1.version === 'next') return -1
      if (c2.version === 'next') return 1
      return semverCompare(c2.version, c1.version)
    }))
}

async function generateChangelog(options = {}) {
  const { from, to, groupSimilarCommits } = options

  let changes = []

  const tags = await gitSemverTagsAsync()

  if (from === '') {
    changes = await generateVersions({ tags, groupSimilarCommits })
  } else {
    const lastChanges = await generateVersion({
      groupSimilarCommits,
      from,
      to,
    })

    changes.push(lastChanges)
  }

  const packageInfo = await getPackageInfo()
  const repository = await getRepoInfo(packageInfo)

  const filteredChanges = changes.filter(({ groups }) => groups.length)

  if (isEmpty(filteredChanges)) {
    throw new Error('No changes found. You may need to fetch or pull the last changes.')
  }

  return {
    meta: {
      package: packageInfo,
      repository,
      lastVersion: from,
    },
    changes: filteredChanges,
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
  getPackageInfo,
  sanitizeVersion,
}
