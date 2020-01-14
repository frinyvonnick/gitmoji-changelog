
const gitRawCommits = require('git-raw-commits')

const { promisify } = require('util')
const gitSemverTags = require('git-semver-tags')
const through = require('through2')
const concat = require('concat-stream')

const COMMIT_FORMAT = '%n%H%n%an%n%cI%n%s%n%b'

const { parseCommit } = require('./parser')

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

const getTags = promisify(gitSemverTags)

module.exports = {
  getTags,
  getCommits,
}