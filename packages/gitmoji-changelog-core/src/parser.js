import splitLines from 'split-lines'

export function parseCommit(commit) {
  const lines = splitLines(commit)
  const [hash, date, subject, ...body] = lines.splice(0, lines.length - 1)

  return {
    hash,
    date,
    subject,
    body: body.join('\n'),
  }
}
