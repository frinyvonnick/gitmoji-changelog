const splitLines = require('split-lines')

function parseCommit(commit) {
  const lines = splitLines(commit)
  const [hash, date, subject, ...body] = lines.splice(1, lines.length - 2)

  return {
    hash,
    date,
    subject,
    body: body.join('\n'),
  }
}

module.exports = {
  parseCommit,
}
