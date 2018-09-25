const splitLines = require('split-lines')
const mapping = require('./mapping')
const { getHashUrl, autolink } = require('./gitInfo')

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

function parseCommit(commit, gitInfo) {
  const lines = splitLines(commit)
  const [hash, date, subject, ...body] = lines.splice(1, lines.length - 2)
  const { emoji, message } = parseSubject(subject)
  const group = getCommitGroup(emoji)
  return {
    hash,
    shortHash: hash.slice(0, 7),
    urlHash: getHashUrl(hash, gitInfo),
    date,
    emoji,
    group,
    rawSubject: subject,
    subject: autolink(subject, gitInfo),
    message: autolink(message, gitInfo),
    rawBody: body.join('\n'),
    body: autolink(body.join('\n'), gitInfo),
  }
}

module.exports = {
  parseCommit,
  getCommitGroup,
}
