const fs = require('fs')

const { generateChangelog, logger } = require('@gitmoji-changelog/core')
const { buildMarkdownFile } = require('@gitmoji-changelog/markdown')

const pkg = require('../package.json')

async function main(options = {}) {
  logger.start(`gitmoji-changelog v${pkg.version}`)
  logger.info(`${options.mode} ${options.output}`)

  try {
    const changelog = await generateChangelog(options)

    if (changelog.meta.package) {
      const { name, version } = changelog.meta.package
      logger.info(`${name} v${version}`)
    }
    if (changelog.meta.repository) {
      logger.info(changelog.meta.repository.url)
    }

    switch (options.format) {
      case 'json':
        fs.writeFileSync(options.ouptut, JSON.stringify(changelog))
        break
      default:
        await buildMarkdownFile(changelog, options)
    }
    logger.success(`changelog updated into ${options.output}`)
  } catch (e) {
    logger.error(e)
  }
}

module.exports = { main }
