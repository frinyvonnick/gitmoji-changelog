import gitRawCommits from 'git-raw-commits'
import through from 'through2'
import concat from 'concat-stream'

import { parseCommit } from './parser'

const COMMIT_FORMAT = '%n%H%n%cI%n%s%n%b'

export function changelog() {
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

export * from './parser'
