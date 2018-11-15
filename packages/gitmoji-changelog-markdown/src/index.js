const { promisify } = require('util')
const fs = require('fs')
const path = require('path')
const { Transform } = require('stream')
const handlebars = require('handlebars')
const { update } = require('immutadot')

const MARKDOWN_TEMPLATE = path.join(__dirname, 'template.md')
const ISSUE_REGEXP = /#{1}(\d+)/gm

const getShortHash = (context) => (commit) => {
  const {
    repository: {
      originUrl,
    },
  } = context

  const {
    hash,
  } = commit

  if (!hash) return null

  const shortHash = hash.slice(0, 7)

  if (!originUrl) return shortHash

  return `[${shortHash}](${originUrl}/commit/${hash})`
}

const autolink = (context) => (string) => {
  const {
    repository: {
      bugsUrl,
    },
  } = context


  if (!string) return undefined
  return string.replace(ISSUE_REGEXP, `[#$1](${bugsUrl}/$1)`)
}

const matchVersionBreakpoint = () => (nextLine, lastVersion = '.*') => { // TODO:
  const regex = new RegExp(`<a name="${lastVersion}"></a>`)

  return regex.test(nextLine)
}

const mapCommit = (context) => (commit) => {
  const {
    options,
  } = context

  return {
    ...commit,
    message: autolink(context)(commit.message),
    subject: autolink(context)(commit.subject),
    body: autolink(context)(commit.body),
    hash: getShortHash(context)(commit),
    author: options.author ? commit.author : null,
    siblings: commit.siblings.map(mapCommit(context)),
  }
}

const toMarkdown = (context) => () => {
  const { changes } = context

  const template = fs.readFileSync(MARKDOWN_TEMPLATE, 'utf-8')
  const compileTemplate = handlebars.compile(template)

  const changelog = update(changes, '[:].groups[:].commits[:]', mapCommit(context))

  return compileTemplate({ changelog })
}

const markdownFromScratch = (context) => () => {
  const {
    options,
  } = context

  return promisify(fs.writeFile)(options.output, `# Changelog\n\n${toMarkdown(context)()}`)
}

const markdownIncremental = (context) => () => {
  const {
    options: {
      output,
    },
  } = context

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
                  previousVersionFound = matchVersionBreakpoint(context)(nextLine)
                  previousNextFound = previousNextFound || matchVersionBreakpoint(context)(nextLine)

                  // Remove old release (next version)
                  if (previousNextFound && !previousVersionFound && !nextVersionWritten) {
                    return content
                  }

                  // Rewrite the release (next version)
                  if (previousVersionFound && !nextVersionWritten) {
                    nextVersionWritten = true
                    return `${content}${toMarkdown(context)()}${nextLine}\n`
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

const buildMarkdownFile = (context) => () => {
  const {
    exists,
  } = context

  if (exists) {
    return markdownIncremental(context)()
  }
  return markdownFromScratch(context)()
}

module.exports = {
  buildMarkdownFile,
  matchVersionBreakpoint,
  getShortHash,
  autolink,
}
