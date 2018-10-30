const splitLines = require('split-lines')
const nodeEmoji = require('node-emoji')
const groupMapping = require('./groupMapping')

function parseSubject(subject) {
  if (!subject) return {}

  let emojiCode
  let emoji
  let message = subject

  const unemojified = nodeEmoji.unemojify(subject)
  const matches = unemojified.match(/:(\w*):(.*)/)
  if (matches) {
    [, emojiCode, message] = matches

    if (nodeEmoji.hasEmoji(emojiCode)) {
      emoji = nodeEmoji.get(emojiCode)
    }
  }

  return {
    emojiCode,
    emoji,
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
