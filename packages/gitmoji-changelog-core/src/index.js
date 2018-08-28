'use strict'

const gitRawCommits = require('git-raw-commits')
const through = require('through2')
const concat = require('concat-stream')

const { parseCommit } = require('./parser')

const COMMIT_FORMAT = '%n%H%n%cI%n%s%n%b'

function changelog() {
  return new Promise((resolve) => {
    gitRawCommits({
      format: COMMIT_FORMAT,
    }).pipe(through.obj((data, enc, next) => {
      next(null, parseCommit(data.toString()))
    })).pipe(concat(data => {
      resolve(JSON.stringify(data))
    }))
  })
}

module.exports = {
  changelog,
}
