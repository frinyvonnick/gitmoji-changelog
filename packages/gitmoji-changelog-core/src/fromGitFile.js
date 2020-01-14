const gitRawCommits = require('git-raw-commits')
const splitLines = require('split-lines')
const { promisify } = require('util')
const gitSemverTags = require('git-semver-tags')
const through = require('through2')
const concat = require('concat-stream')

const COMMIT_FORMAT = '%n%H%n%an%n%cI%n%s%n%b'

function parseCommit(commit) {
  const lines = splitLines(commit)
  const [hash, author, date, subject, ...body] = lines.splice(
    1,
    lines.length - 2
  )
  return {
    hash, author, date, subject, body,
  }
}

function getCommits(from, to) {
  return new Promise(resolve => {
    gitRawCommits({
      format: COMMIT_FORMAT,
      from,
      to,
    })
      .pipe(
        through.obj((data, enc, next) => {
          next(null, parseCommit(data.toString()))
        })
      )
      .pipe(
        concat(data => {
          resolve(data)
        })
      )
  })
}

const getTags = promisify(gitSemverTags)

module.exports = {
  getTags,
  getCommits,
}
