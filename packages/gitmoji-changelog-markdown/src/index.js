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

function mapCommit(meta, options) {
  const { author } = options

  return commit => ({
    ...commit,
    hash: getShortHash(commit.hash, meta.repository),
    subject: autolink(commit.subject, meta.repository),
    message: autolink(commit.message, meta.repository),
    body: autolink(commit.body, meta.repository),
    author: author ? commit.author : null,
    siblings: commit.siblings.map(mapCommit(meta, options)),
  })
}

function toMarkdown({ meta, changes }, options) {
  const template = fs.readFileSync(MARKDOWN_TEMPLATE, 'utf-8')
  const compileTemplate = handlebars.compile(template)
  const changelog = update(changes, '[:].groups[:].commits[:]', mapCommit(meta, options))

  return compileTemplate({ changelog })
}

function markdownFromScratch({ meta, changes }, options) {
  return promisify(fs.writeFile)(options.output, `# Changelog\n\n${toMarkdown({ meta, changes }, options)}`)
}

function markdownIncremental({ meta, changes }, options) {
  const { lastVersion } = meta
  const { output } = options

  const tempFile = `${output}.tmp`

  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(output, { encoding: 'utf-8' })
    const writeStream = fs.createWriteStream(tempFile, { encoding: 'utf-8' })

    let previousNextFound = false
    let previousVersionFound = false
    let nextVersionWritten = false

    readStream
      .pipe(new Transform({
        transform(chunk, encoding, callback) {
          const string = chunk.toString()

          callback(
            null,
            string.split('\n')
              .reduce(
                (content, nextLine, index, array) => {
                  previousVersionFound = matchVersionBreakpoint(nextLine, lastVersion)
                  previousNextFound = previousNextFound || matchVersionBreakpoint(nextLine)

                  // Remove old release (next version)
                  if (previousNextFound && !previousVersionFound && !nextVersionWritten) {
                    return content
                  }

                  // Rewrite the release (next version)
                  if (previousVersionFound && !nextVersionWritten) {
                    nextVersionWritten = true
                    return `${content}${toMarkdown({ meta, changes }, options)}${nextLine}\n`
                  }

                  // Just push the line without changing anything
                  if (index !== array.length - 1) {
                    return `${content}${nextLine}\n`
                  }
                  return `${content}${nextLine}`
                },
                '',
              )
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

function matchVersionBreakpoint(tested, version = '.*') {
  const regex = new RegExp(`<a name="${version}"></a>`)
  return regex.test(tested)
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
  matchVersionBreakpoint,
  getShortHash,
  autolink,
}
