const semver = require('semver')
const gitRawCommits = require('git-raw-commits')
const gitSemverTags = require('git-semver-tags')
const semverCompare = require('semver-compare')
const through = require('through2')
const concat = require('concat-stream')
const { head, isEmpty } = require('lodash')
const { promisify } = require('util')

const { parseCommit } = require('./parser')
const { getPackageInfo, getRepoInfo } = require('./metaInfo')
const groupMapping = require('./groupMapping')
const logger = require('./logger')
const { groupSentencesByDistance } = require('./utils')

const gitSemverTagsAsync = promisify(gitSemverTags)

const COMMIT_FORMAT = '%n%H%n%cI%n%s%n%b'

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

function groupCommitsByMessagesDistance(commits = []) {
  const distanceGroups = groupSentencesByDistance(commits.map(commit => commit.message))

  return distanceGroups.map(([first, ...siblings]) => ({
    ...commits[first],
    siblings: siblings.map(index => commits[index]),
  }))
}

async function generateVersion({ from, to, version }) {
  const commits = groupCommitsByMessagesDistance(await getCommits(from, to))
  const lastCommitDate = getLastCommitDate(commits)

  return {
    version,
    date: version !== 'next' ? lastCommitDate : undefined,
    groups: makeGroups(commits),
  }
}

async function generateVersions(tags) {
  let nextTag = ''

  return Promise.all(
    [...tags, '']
      .map(tag => {
        const params = {
          from: tag,
          to: nextTag,
          version: nextTag ? sanitizeVersion(nextTag) : 'next',
        }
        nextTag = tag
        return params
      })
      .map(generateVersion)
  )
    .then(changes => changes.sort((c1, c2) => {
      if (c1.version === 'next') return -1
      if (c2.version === 'next') return 1
      return semverCompare(c2.version, c1.version)
    }))
}

async function generateChangelog(options = {}) {
  const { mode, release } = options

  const packageInfo = await getPackageInfo()

  let version = release === 'from-package' ? packageInfo.version : release
  if (version && version !== 'next') {
    if (!semver.valid(version)) {
      throw new Error(`${version} is not a valid semver version.`)
    }

    version = sanitizeVersion(version)
  }

  let changes = []

  const tags = await gitSemverTagsAsync()
  const lastTag = head(tags)

  if (mode === 'init') {
    changes = await generateVersions(tags)
  } else {
    const lastChanges = await generateVersion({
      from: lastTag,
      version,
    })

    if (isEmpty(lastChanges.groups)) {
      throw new Error('No changes found. You may need to fetch or pull the last changes.')
    }

    changes.push(lastChanges)
  }

  const repository = await getRepoInfo(packageInfo)

  return {
    meta: {
      package: packageInfo,
      repository,
      lastVersion: sanitizeVersion(lastTag),
    },
    changes,
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
