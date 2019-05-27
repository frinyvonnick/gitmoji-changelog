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
  const { mode, release, groupSimilarCommits } = options

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
  const lastTag = get(options, 'meta.lastVersion', head(tags))

  if (mode === 'init') {
    changes = await generateVersions({ tags, groupSimilarCommits })
  } else {
    if (lastTag === head(tags)) {
      const lastChanges = await generateVersion({
        groupSimilarCommits,
        from: lastTag,
        version,
      })

      if (isEmpty(lastChanges.groups)) {
        throw new Error('No changes found. You may need to fetch or pull the last changes.')
      }

      changes.push(lastChanges)
      return changes
    }

    const lastTagIndex = tags.findIndex(tag => tag === lastTag)
    const missingTags = tags.splice(lastTagIndex)

    const lastChanges = generateVersions({ tags: missingTags, groupSimilarCommits })
    return [
      ...changes,
      ...lastChanges,
    ]
  }

  const repository = await getRepoInfo(packageInfo)

  return {
    meta: {
      package: packageInfo,
      repository,
      lastVersion: sanitizeVersion(lastTag),
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
