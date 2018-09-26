const fs = require('fs')
const path = require('path')
const handlebars = require('handlebars')
const { isEmpty } = require('lodash')

const MARKDOWN_TEMPLATE = path.join(__dirname, 'template.md')

function convert({ meta, changes }) {
  const template = fs.readFileSync(MARKDOWN_TEMPLATE, 'utf-8')

  const generateMarkdown = handlebars.compile(template)

  const changelog = changes.map(version => ({
    ...version,
    groups: version.groups.map(group => ({
      ...group,
      commits: group.commits.map(commit => ({
        ...commit,
        hash: getShortHash(commit.hash, meta.repoInfo),
        subject: autolink(commit.subject, meta.repoInfo),
        message: autolink(commit.message, meta.repoInfo),
        body: autolink(commit.body, meta.repoInfo),
      })),
    })),
  }))

  return generateMarkdown({ changelog })
}

function getShortHash(hash, repoInfo) {
  if (!hash) return null

  const shortHash = hash.slice(0, 7)

  if (isEmpty(repoInfo)) return shortHash

  return `[${shortHash}](${repoInfo.repoUrl}/commit/${hash})`
}

function autolink(message, repoInfo) {
  if (!message) return null

  if (isEmpty(repoInfo)) return message

  const matches = message.match(/#{1}(\d+)/gm)
  if (!matches) return message

  return message.replace(/#{1}(\d+)/gm, `[#$1](${repoInfo.bugsUrl}/$1)`)
}

module.exports = {
  convert,
  getShortHash,
  autolink,
}
