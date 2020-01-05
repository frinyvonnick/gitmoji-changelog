const splitLines = require('split-lines')
const nodeEmoji = require('node-emoji')
const groupMapping = require('./groupMapping')
const rc = require('rc')

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

function getMergedGroupMapping() {
  const customConfiguration = rc('gitmoji-changelog')
  const customGroupMapping = customConfiguration ? customConfiguration.commitMapping : undefined
  if (!customGroupMapping) return groupMapping
  const newCategories = customGroupMapping.filter(cg => {
    return !groupMapping.some(g => g.group === cg.group)
  })

  const overridedCategories = groupMapping.map(group => {
    const customGroup = customGroupMapping.find(cg => cg.group === group.group)
    return customGroup || group
  })

  const miscellaneousIndex = overridedCategories.findIndex(g => g.group === 'misc')
  const miscellaneousCategory = overridedCategories.splice(miscellaneousIndex, 1)[0]

  return [
    ...overridedCategories,
    ...newCategories,
    miscellaneousCategory,
  ]
}

function getCommitGroup(emojiCode) {
  const group = getMergedGroupMapping()
    .find(({ emojis }) => emojis.includes(emojiCode))
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
  getMergedGroupMapping,
}
