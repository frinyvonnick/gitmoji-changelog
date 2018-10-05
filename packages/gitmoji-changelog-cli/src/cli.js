const { generateChangelog, logger } = require('@gitmoji-changelog/core')
const { buildMarkdownFile } = require('@gitmoji-changelog/markdown')
const fs = require('fs')

async function main({ format, mode, release } = {}) {
  try {
    const changelog = await generateChangelog({ mode, release })

    if (changelog.meta.package) {
      const { name, version } = changelog.meta.package
      logger.info(`${name} v${version}`)
    }
    if (changelog.meta.repository) {
      logger.info(changelog.meta.repository.url)
    }

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
