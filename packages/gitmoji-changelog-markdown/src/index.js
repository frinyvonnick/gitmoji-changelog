const fs = require('fs')
const es = require('event-stream')
const path = require('path')
const handlebars = require('handlebars')
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

  return compileTemplate({ changelog })
}

function markdownFromScratch({ meta, changes }, options) {
  const output = toMarkdown({ meta, changes })
  return Promise.resolve(fs.writeFileSync(options.output, output))
}

function markdownIncremental({ meta, changes }, options) {
  const { lastVersion } = meta

  const currentFile = options.output
  const tempFile = `${currentFile}.tmp`

  if (!fs.existsSync(currentFile)) {
    throw new Error(`${currentFile} doesn't exists, please execute "gitmoji-changelog init" to build it from scratch.`)
  }

  // write file for next version
  const writer = fs.createWriteStream(tempFile, { encoding: 'utf-8' })
  writer.write(toMarkdown({ meta, changes }))

  // read original file until last tags and add it to the end
  let lastVersionFound = false
  return new Promise(resolve => {
    const stream = fs.createReadStream(currentFile)
      .pipe(es.split())
      .pipe(es.mapSync((line) => {
        stream.pause()

        if (line.startsWith(`<a name="${lastVersion}"></a>`)) {
          lastVersionFound = true
        }
        if (lastVersionFound) {
          writer.write(`${line}\n`)
        }

        stream.resume()
      }))
      .on('error', (err) => {
        throw new Error(err)
      })
      .on('end', () => {
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
