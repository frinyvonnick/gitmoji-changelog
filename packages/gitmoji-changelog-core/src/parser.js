const splitLines = require('split-lines')
const groupMapping = require('./groupMapping')
const emojiMapping = require('./emojiMapping')

function parseSubject(subject) {
  if (!subject) return {}

  const matches = subject.match(/:(\w*):(.*)/)
  if (!matches) return { message: subject }

  const [, emojiCode, message] = matches

  return {
    emojiCode,
    emoji: emojiMapping[emojiCode] || '¿',
    message: message.trim(),
  }
}

function getCommitGroup(emojiCode) {
  const group = groupMapping.find(({ emojis }) => emojis.includes(emojiCode))
  if (!group) return 'misc'
  return group.group
}

function parseCommit(commit) {
  const lines = splitLines(commit)
  const [hash, date, subject, ...body] = lines.splice(1, lines.length - 2)
  const { emoji, emojiCode, message } = parseSubject(subject)
  const group = getCommitGroup(emojiCode)

  return {
    hash,
    date,
    subject,
    emojiCode,
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
