const { generateChangelog, logger } = require('@gitmoji-changelog/core')
const { buildMarkdownFile } = require('@gitmoji-changelog/markdown')
const fs = require('fs')

async function main({ format, mode } = {}) {
  try {
    const changelog = await generateChangelog({ mode })

    logger.info(changelog.meta.package.name)
    logger.info('v%s', changelog.meta.package.version)
    logger.info(changelog.meta.repository.url)

    let output
    switch (format) {
      case 'json':
        output = './CHANGELOG.json'
        fs.writeFileSync(output, JSON.stringify(changelog))
        break
      default:
        output = './CHANGELOG.md'
        await buildMarkdownFile(changelog, { mode, output })
    }
    logger.success(`changelog updated into ${output}`)
  } catch (e) {
    logger.error(e)
  }
}

module.exports = { main }
