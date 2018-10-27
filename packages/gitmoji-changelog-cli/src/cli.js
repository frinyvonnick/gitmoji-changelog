const fs = require('fs')

const libnpm = require('libnpm')
const semverCompare = require('semver-compare')
const { generateChangelog, logger } = require('@gitmoji-changelog/core')
const { buildMarkdownFile } = require('@gitmoji-changelog/markdown')

const pkg = require('../package.json')

async function getLatestVersion() {
  const watchdog = new Promise(resolve => setTimeout(resolve, 500, { version: pkg.version }))
  const request = libnpm.manifest('gitmoji-changelog@latest')

  const { version } = await Promise.race([watchdog, request])

  return version
}

async function main(options = {}) {
  logger.start(`gitmoji-changelog v${pkg.version}`)
  logger.info(`${options.mode} ${options.output}`)

  try {
    const latestVersion = await getLatestVersion()
    if (semverCompare(latestVersion, pkg.version) > 0) {
      logger.warn(`You got an outdated version of gitmoji-changelog, please update! (yours: ${pkg.version}, latest: ${latestVersion})`)
      logger.warn('Just do the following npm command to update it:')
      logger.warn('\t> npm install -g gitmoji-changelog@latest')
    }
  } catch (e) { /* ignore error */ }

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
        fs.writeFileSync(options.output, JSON.stringify(changelog))
        break
      default:
        await buildMarkdownFile(changelog, options)
    }
    logger.success(`changelog updated into ${options.output}`)
  } catch (e) {
    logger.error(e)
  }

  // force quit (if the latest version request is pending, we don't wait for it)
  process.exit(0)
}

module.exports = { main }
