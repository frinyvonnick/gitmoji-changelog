const fs = require('fs')
const semver = require('semver')
const gitRawCommits = require('git-raw-commits')
const gitSemverTags = require('git-semver-tags')
const semverCompare = require('semver-compare')
const through = require('through2')
const concat = require('concat-stream')
const { head, isEmpty } = require('lodash')
const { promisify } = require('util')

const { parseCommit } = require('./parser')
const { setRepositoryInfo } = require('./metaInfo')
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

const generateVersion = (context) => async (from, to, version) => {
  const {
    options: {
      groupSimilarCommits,
    },
  } = context

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
    date: to !== 'HEAD' ? getLastCommitDate(commits) : undefined,
    groups: makeGroups(commits),
  }
}

const generateVersions = (context) => async () => {
  const {
    options: { from, to },
    tags,
  } = context


  const indexFrom = tags.includes(from) ? tags.indexOf(from) : tags.length - 1
  const indexTo = tags.includes(to) ? tags.indexOf(to) : 0

  let versionsRange = tags.slice(indexTo, indexFrom - indexTo + 1)
  if (to === 'HEAD') {
    versionsRange = ['HEAD', ...versionsRange]
  }

  let firstTag = tags.includes(from) ? from : ''

  const changes = await Promise.all(
    versionsRange
      .reverse()
      .map(tag => {
        const params = {
          from: firstTag,
          to: tag,
          version: tag !== 'HEAD' ? sanitizeVersion(tag) : 'next',
        }
        firstTag = tag
        return params
      })
      .map(params => generateVersion(context)(params.from, params.to, params.version))
  )

  context.changes = changes.sort((c1, c2) => {
    if (c1.version === 'next') return -1
    if (c2.version === 'next') return 1
    return semverCompare(c2.version, c1.version)
  }).filter(({ groups }) => groups.length)
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

const setExist = (context) => () => {
  const {
    exists,
    options: {
      output,
    },
  } = context

  if (exists) return

  if (output) {
    context.exists = fs.existsSync(output)
  }
}

const setOutputFile = (context) => () => {
  const {
    options: {
      output,
      format,
    },
  } = context

  if (output) return

  if (format === 'json') {
    context.options.output = './CHANGELOG.json'
  }

  if (format === 'markdown') {
    context.options.output = './CHANGELOG.md'
  }
}

const setRelease = (context) => () => {
  const {
    options: {
      release,
    },
  } = context

  if (release === 'next') return

  if (!release) {
    context.options.release = 'next'
    return
  }

  if (!semver.valid(release)) {
    throw new Error(`${release} is not a valid semver version.`)
  }

  context.options.release = sanitizeVersion(release)
}

const setTags = (context) => async () => {
  const tags = await gitSemverTagsAsync()
  context.tags = tags
}

const setBounds = (context) => () => {
  const {
    exists,
    tags,
    options: { from, to },
  } = context

  if (!from && to) {
    return
  }

  if (from && !to) {
    context.options.to = 'HEAD'
    return
  }

  if (exists) {
    context.options.from = head(tags) || ''
    context.options.to = 'HEAD'
  } else {
    context.options.from = ''
    context.options.to = 'HEAD'
  }
}

const generateChangelog = async (options = {}) => {
  const context = { options }

  setRelease(context)()
  setOutputFile(context)()
  setExist(context)()
  await setTags(context)()
  setBounds(context)()
  await setRepositoryInfo(context)()

  await generateVersions(context)()

  return context
}

module.exports = {
  generateChangelog,
  logger,
}
