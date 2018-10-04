const gitRawCommits = require('git-raw-commits')
const gitSemverTags = require('git-semver-tags')
const through = require('through2')
const concat = require('concat-stream')
const { last } = require('lodash')
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
  return mapping
    .map(({ group, label }) => ({
      group,
      label,
      commits: commits.filter(commit => commit.group === group),
    }))
    .filter(group => group.commits.length)
}

async function generateChanges(from, to) {
  const commits = await getCommits(from, to)
  const lastCommitDate = getLastCommitDate(commits)

  return {
    version: to,
    date: lastCommitDate,
    groups: makeGroups(commits),
  }
}

async function generateTagsChanges(tags) {
  let previousTag = ''

  return Promise.all(tags.map(async tag => {
    const changes = await generateChanges(previousTag, tag)
    previousTag = tag
    return changes
  }))
}

async function generateChangelog(options = {}) {
  const { mode = 'full', version = 'next' } = options

  const packageInfo = await getPackageInfo()
  const repository = await getRepoInfo(packageInfo)

  const meta = {
    package: packageInfo,
    repository,
  }

  let changes = []

  const tags = await gitSemverTagsAsync()

  if (mode === 'full') {
    changes = await generateTagsChanges(tags)
  }

  if (version) {
    const lastTag = last(tags)
    const lastChanges = await generateChanges(lastTag)
    lastChanges.version = version
    changes.push(lastChanges)
  }

  return {
    meta,
    changes,
  }
}

function getLastCommitDate(commits) {
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
