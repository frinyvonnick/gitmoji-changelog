const fs = require('fs')
const path = require('path')
const handlebars = require('handlebars')
const { update } = require('immutadot')
const { isEmpty } = require('lodash')

const MARKDOWN_TEMPLATE = path.join(__dirname, 'template.md')

function convert({ meta, changes } = {}, { mode = 'init' } = {}) {
  if (mode === 'init') {
    // generate from scratch
    return markdownFromScratch({ meta, changes })
  }
  const { lastTag } = meta
  return console.log(lastTag)
  // check if file exists else throw error

  // write file for next version (<FILENAME>.tmp)

  // read original file util last tags (<FILENAME>)

  // write the rest of the file to the new one (<FILENAME>.tmp)

  // rename <FILENAME>.tmp to <FILENAME>
}

function markdownFromScratch({ meta, changes }) {
  const template = fs.readFileSync(MARKDOWN_TEMPLATE, 'utf-8')

  const generateMarkdown = handlebars.compile(template)

  const changelog = update(changes, '[:].groups[:].commits[:]', commit => ({
    ...commit,
    hash: getShortHash(commit.hash, meta.repository),
    subject: autolink(commit.subject, meta.repository),
    message: autolink(commit.message, meta.repository),
    body: autolink(commit.body, meta.repository),
  }))

  return generateMarkdown({ changelog })
}

function getShortHash(hash, repository) {
  if (!hash) return null

  const shortHash = hash.slice(0, 7)

  if (isEmpty(repository) || !repository.url) return shortHash

  return `[${shortHash}](${repository.url}/commit/${hash})`
}

const ISSUE_REGEXP = /#{1}(\d+)/gm

function autolink(message, repository) {
  if (!message) return null

  if (isEmpty(repository) || !repository.bugsUrl) return message

  const matches = message.match(ISSUE_REGEXP)
  if (!matches) return message

  return message.replace(ISSUE_REGEXP, `[#$1](${repository.bugsUrl}/$1)`)
}

module.exports = {
  convert,
  getShortHash,
  autolink,
}
