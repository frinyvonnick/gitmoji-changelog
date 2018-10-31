const splitLines = require('split-lines')
const nodeEmoji = require('node-emoji')
const groupMapping = require('./groupMapping')

function parseSubject(subject) {
  if (!subject) return {}

  const unemojified = nodeEmoji.unemojify(subject)

  const matches = unemojified.match(/:(\w*):(.*)/)

  if (matches) {
    const [, emojiCode, message] = matches

    if (nodeEmoji.hasEmoji(emojiCode)) {
      return {
        emojiCode,
        emoji: nodeEmoji.get(emojiCode),
        message: nodeEmoji.emojify(message.trim()),
      }
    }
  }

  return {
    message: subject,
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
    siblings: [],
    body: body.join('\n'),
  }
}

module.exports = {
  parseCommit,
  getCommitGroup,
}
