const splitLines = require('split-lines')
const { invert } = require('lodash')
const groupMapping = require('./groupMapping')
const emojiMapping = require('./emojiMapping')

const emojiMappingInvert = invert(emojiMapping)

function parseSubject(subject) {
  if (!subject) return {}

  let emojiCode
  let message = subject

  const matches = subject.match(/:(\w*):(.*)/)
  if (matches) {
    // extract textual emoji
    [, emojiCode, message] = matches
  } else {
    // extract unicode emoji
    const emoji = subject.substr(0, 1)
    emojiCode = emojiMappingInvert[emoji]
    if (emojiCode) {
      message = subject.substr(1, subject.length)
    }
  }

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
