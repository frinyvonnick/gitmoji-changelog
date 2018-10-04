const gitRawCommits = require('git-raw-commits')
const gitSemverTags = require('git-semver-tags')
const through = require('through2')
const concat = require('concat-stream')
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

async function generateChangelog() {
  const packageInfo = await getPackageInfo()
  const repository = await getRepoInfo(packageInfo)

  const meta = {
    package: packageInfo,
    repository,
  }

  let previousTag = ''
  const tags = await gitSemverTagsAsync()

  const changes = await Promise.all(tags.map(async tag => {
    const commits = await getCommits(previousTag, tag)
    const lastCommitDate = getLastCommitDate(commits)

    previousTag = tag
    return {
      version: tag,
      date: lastCommitDate,
      groups: makeGroups(commits),
    }
  }))

  const commits = await getCommits(previousTag)
  changes.push({
    version: 'next',
    groups: makeGroups(commits),
  })

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
