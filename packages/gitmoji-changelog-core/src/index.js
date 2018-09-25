const gitRawCommits = require('git-raw-commits')
const gitSemverTags = require('git-semver-tags')
const through = require('through2')
const concat = require('concat-stream')
const { promisify } = require('util')

const { parseCommit } = require('./parser')
const { getGitInfo } = require('./gitInfo')
const mapping = require('./mapping')

const gitSemverTagsAsync = promisify(gitSemverTags)

const COMMIT_FORMAT = '%n%H%n%cI%n%s%n%b'

async function getCommits(from, to) {
  const gitInfo = await getGitInfo()

  return new Promise((resolve) => {
    gitRawCommits({
      format: COMMIT_FORMAT,
      from,
      to,
    }).pipe(through.obj((data, enc, next) => {
      next(null, parseCommit(data.toString(), gitInfo))
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
  let previousTag = ''
  const tags = await gitSemverTagsAsync()

  const result = await Promise.all(tags.map(async tag => {
    const commits = await getCommits(previousTag, tag)

    previousTag = tag
    return {
      version: tag,
      groups: makeGroups(commits),
    }
  }))

  const commits = await getCommits(previousTag)
  result.push({
    version: 'next',
    groups: makeGroups(commits),
  })

  return result
}

module.exports = {
  generateChangelog,
}
