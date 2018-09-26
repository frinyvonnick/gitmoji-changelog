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
        hash: getShortHash(commit.hash, meta.repository),
        subject: autolink(commit.subject, meta.repository),
        message: autolink(commit.message, meta.repository),
        body: autolink(commit.body, meta.repository),
      })),
    })),
  }))

  return generateMarkdown({ changelog })
}

function getShortHash(hash, repository) {
  if (!hash) return null

  const shortHash = hash.slice(0, 7)

  if (isEmpty(repository)) return shortHash

  return `[${shortHash}](${repository.url}/commit/${hash})`
}

const ISSUE_REGEXP = /#{1}(\d+)/gm

function autolink(message, repository) {
  if (!message) return null

  if (isEmpty(repository)) return message

  const matches = message.match(ISSUE_REGEXP)
  if (!matches) return message

  return message.replace(ISSUE_REGEXP, `[#$1](${repository.bugsUrl}/$1)`)
}

module.exports = {
  convert,
  getShortHash,
  autolink,
}
