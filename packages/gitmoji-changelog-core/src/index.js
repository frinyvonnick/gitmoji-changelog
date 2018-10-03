const gitRawCommits = require('git-raw-commits')
const gitSemverTags = require('git-semver-tags')
const through = require('through2')
const concat = require('concat-stream')
const { promisify } = require('util')

const { parseCommit } = require('./parser')
const { getRepoInfo } = require('./repoInfo')
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
  const meta = {
    repository: await getRepoInfo(),
  }

  logger.info(meta.repository.project)
  logger.info(meta.repository.version) // @todo get package.json from another function
  logger.info(meta.repository.url)

  let previousTag = ''
  const tags = await gitSemverTagsAsync()

  const changes = await Promise.all(tags.map(async tag => {
    const commits = await getCommits(previousTag, tag)

    previousTag = tag
    return {
      version: tag,
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

module.exports = {
  generateChangelog,
  logger,
}
