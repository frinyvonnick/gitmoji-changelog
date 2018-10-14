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
const mapping = require('./mapping')
const logger = require('./logger')

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

  return mapping
    .map(({ group, label }) => ({
      group,
      label,
      commits: commits
        .filter(commit => commit.group === group)
        .sort((first, second) => {
          if (!first.emoji) return -1

          const emojiCriteria = first.emoji.localeCompare(second.emoji)
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

async function generateChanges({ from, to, version }) {
  const commits = await getCommits(from, to)
  const lastCommitDate = getLastCommitDate(commits)

  return {
    version,
    date: version !== 'next' ? lastCommitDate : undefined,
    groups: makeGroups(commits),
  }
}

async function generateTagsChanges(tags) {
  let previousTag = ''

  return Promise.all(tags.map(async tag => {
    const changes = await generateChanges({
      from: previousTag,
      to: tag,
      version: sanitizeVersion(tag),
    })
    previousTag = tag
    return changes
  })).then((changes) => {
    return changes.sort((c1, c2) => semverCompare(c1.version, c2.version)).reverse()
  })
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
    changes = await generateTagsChanges(tags)
  }

  if (mode !== 'init' && version) {
    const lastChanges = await generateChanges({
      from: lastTag,
      version: version,
    })
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
