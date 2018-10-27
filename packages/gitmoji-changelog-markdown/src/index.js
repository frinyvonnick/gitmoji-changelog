const { promisify } = require('util')
const fs = require('fs')
const path = require('path')
const { Transform } = require('stream')
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
  return promisify(fs.writeFile)(options.output, `# Changelog\n\n${toMarkdown({ meta, changes })}`)
}

function markdownIncremental({ meta, changes }, options) {
  const { lastVersion } = meta
  const { output, release } = options

  const tempFile = `${output}.tmp`

  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(output, { encoding: 'utf-8' })
    const writeStream = fs.createWriteStream(tempFile, { encoding: 'utf-8' })

    // start from currentFile
    readStream
      .pipe(new Transform({
        transform(chunk, encoding, callback) {
          const string = chunk.toString()

          // if the release (the next) is already in file, we do nothing
          if (string.includes(`<a name="${release}"></a>`)) {
            callback(null, chunk)
            return
          }

          // in others cases, we try to put the new changes after the header
          callback(
            null,
            string.split('\n')
              .map((line) => {
                if (line.startsWith(`<a name="${lastVersion}"></a>`)) {
                  return `${toMarkdown({ meta, changes })}${line}`
                }

                return line
              })
              .join('\n')
          )
        },
      }))
      .pipe(writeStream)
      .on('error', reject)
      .on('close', () => {
        fs.rename(tempFile, output, resolve)
      })
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
