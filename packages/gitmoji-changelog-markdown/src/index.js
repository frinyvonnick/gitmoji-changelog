const fs = require('fs')
const path = require('path')
const handlebars = require('handlebars')
const readline = require('linebyline')
const { update } = require('immutadot')
const { isEmpty } = require('lodash')

const MARKDOWN_TEMPLATE = path.join(__dirname, 'template.md')

function buildMarkdownFile(changelog = {}, options = {}) {
  if (options.mode === 'init') {
    return markdownFromScratch(changelog, options)
  }
  return markdownIncremental(changelog, options)
}

function toMarkdown({ meta, changes }) {
  const template = fs.readFileSync(MARKDOWN_TEMPLATE, 'utf-8')

  const compileTemplate = handlebars.compile(template)

  const changelog = update(changes, '[:].groups[:].commits[:]', commit => ({
    ...commit,
    hash: getShortHash(commit.hash, meta.repository),
    subject: autolink(commit.subject, meta.repository),
    message: autolink(commit.message, meta.repository),
    body: autolink(commit.body, meta.repository),
  }))
    .sort((r1, r2) => r1.version < r2.version) // TODO sort must be done in core

  return compileTemplate({ changelog })
}

function markdownFromScratch({ meta, changes }, options) {
  const output = toMarkdown({ meta, changes })
  return Promise.resolve(fs.writeFileSync(options.output, output))
}

function markdownIncremental({ meta, changes }, options) {
  const { lastTag } = meta

  const currentFile = options.output
  const tempFile = `${currentFile}.tmp`

  if (!fs.existsSync(currentFile)) {
    throw new Error(`${currentFile} doesn't exists, please execute "gitmoji-changelog init" to build it from scratch.`)
  }

  // write file for next version (<FILENAME>.tmp)
  const writer = fs.createWriteStream(tempFile, { encoding: 'utf-8' })
  const nextVersionOuput = toMarkdown({ meta, changes })
  writer.write(nextVersionOuput)

  // read original file until last tags and add it to the end
  let incrementalWriting = false
  return new Promise(resolve => {
    const stream = readline(currentFile) // TODO find a better lib than 'readline'
    stream.on('line', (line) => {
      if (line.startsWith(`<a name="${lastTag}"></a>`)) {
        incrementalWriting = true
      }
      if (incrementalWriting) {
        writer.write(`${line}\n`)
      }
    }).on('end', () => {
      writer.end()
      resolve()
    })
  }).then(() => {
    // replace changelog file by the new one
    fs.renameSync(tempFile, currentFile)
  })
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
  buildMarkdownFile,
  getShortHash,
  autolink,
}
