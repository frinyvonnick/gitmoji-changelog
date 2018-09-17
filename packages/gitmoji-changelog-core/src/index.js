const gitRawCommits = require('git-raw-commits')
const gitSemverTags = require('git-semver-tags')
const through = require('through2')
const concat = require('concat-stream')
const { promisify } = require('util')

const { parseCommit } = require('./parser')

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

async function generateChangelog() {
  let previousTag = ''
  const tags = await gitSemverTagsAsync()

  const result = await Promise.all(tags.map(async tag => {
    const commits = await getCommits(previousTag, tag)
    previousTag = tag
    return {
      version: tag,
      commits,
    }
  }))

  result.push({
    version: 'next',
    commits: await getCommits(previousTag),
  })

  return result
}

module.exports = {
  generateChangelog,
}
