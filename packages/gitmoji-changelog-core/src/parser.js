const splitLines = require('split-lines')
const mapping = require('./mapping')

function parseSubject(subject) {
  if (!subject) return {}
  const matches = subject.match(/:(\w*):(.*)/)
  if (!matches) return {}
  const [, emoji, message] = matches

  return {
    emoji,
    message: message.trim(),
  }
}

function getCommitGroup(emoji) {
  let group = 'misc'

  mapping.forEach(type => {
    if (type.emojis.includes(emoji)) {
      group = type.group
    }
  })

  return group
}

function parseCommit(commit) {
  const lines = splitLines(commit)
  const [hash, date, subject, ...body] = lines.splice(1, lines.length - 2)
  const { emoji, message } = parseSubject(subject)
  const group = getCommitGroup(emoji)

  return {
    hash,
    date,
    subject,
    emoji,
    message,
    group,
    body: body.join('\n'),
  }
}

module.exports = {
  parseCommit,
  getCommitGroup,
}
