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

/**
 * @param {Object} context
 * @param {Object} context.options
 * @param {String} context.options.from
 * @param {String} context.options.to
 * @param {String} context.options.release
 * @param {String} context.options.format
 * @param {String} context.options.output
 * @param {Boolean} context.options.author
 * @param {Boolean} context.options.groupSimilarCommits
 * @param {Object} context.repository
 * @param {String} context.repository.url
 * @param {String} context.repository.originUrl
 * @param {String} context.repository.bugsUrl
 * @param {String[]} context.tags
 * @param {Object} context.changes
 * @param {Boolean} context.exists
 */
const main = (options = {}) => async () => {
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

  if (options.groupSimilarCommits) {
    logger.warn('⚗️  You are using a beta feature - may not working as expected')
    logger.warn('Feel free to open issues or PR into gitmoji-changelog')
    logger.warn('\t> https://github.com/frinyvonnick/gitmoji-changelog')
  }

  try {
    const context = await generateChangelog(options)
    const {
      changes,
      repository,
    } = context

    if (repository) {
      logger.info(repository.url)
    }

    switch (options.format) {
      case 'json':
        fs.writeFileSync(options.output, JSON.stringify(changes))
        break
      default:
        await buildMarkdownFile(context)() // TODO: change buildMarkdownFile
    }
    logger.success(`changelog updated into ${options.output}`)
  } catch (e) {
    logger.error(e)
  }

  // force quit (if the latest version request is pending, we don't wait for it)
  process.exit(0)
}

module.exports = { main }
