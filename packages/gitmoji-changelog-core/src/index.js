import {
  flow,
  split,
  compact,
  map,
} from 'lodash/fp'
import splitLines from 'split-lines'

export function parseCommit(commit) {
  const [hash, date, subject, ...body] = splitLines(commit)

  return {
    hash,
    date,
    subject,
    body: body.join('\n'),
  }
}

export function parse(commits) {
  return flow(
    split('-hash-\n'),
    compact,
    map(parseCommit),
  )(commits)
}
