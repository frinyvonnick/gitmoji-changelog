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
    emojiCode = matches[1]
    message = matches[2]
  } else {
    // extract unicode emoji
    const emojiUTF8 = emojiMappingInvert[subject.substr(0, 1)]
    if (emojiUTF8) {
      emojiCode = emojiUTF8
      message = subject.substr(1, subject.length)
    }

    const emojiUTF16 = emojiMappingInvert[subject.substr(0, 2)]
    if (emojiUTF16) {
      emojiCode = emojiUTF16
      message = subject.substr(2, subject.length)
    }

    console.log('extract unicode emoji', { emojiCode, message })
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
  const [hash, author, date, subject, ...body] = lines.splice(1, lines.length - 2)
  const { emoji, emojiCode, message } = parseSubject(subject)
  const group = getCommitGroup(emojiCode)

  return {
    hash,
    author,
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
