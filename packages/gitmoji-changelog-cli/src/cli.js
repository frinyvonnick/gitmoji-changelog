const fs = require('fs')
const { get } = require('lodash')
const path = require('path')
const { set } = require('immutadot')
const libnpm = require('libnpm')
const semver = require('semver')
const semverCompare = require('semver-compare')
const { generateChangelog, logger } = require('@gitmoji-changelog/core')
const { buildMarkdownFile, getLatestVersion } = require('@gitmoji-changelog/markdown')
const { executeInteractiveMode } = require('./interactiveMode')

const { getRepoInfo } = require('./metaInfo')

const pkg = require('../package.json')

async function getGitmojiChangelogLatestVersion() {
  const watchdog = new Promise(resolve => setTimeout(resolve, 500, { version: pkg.version }))
  const request = libnpm.manifest('gitmoji-changelog@latest')

  const { version } = await Promise.race([watchdog, request])

  return version
}

async function main(options = {}) {
  logger.start(`gitmoji-changelog v${pkg.version}`)
  logger.info(`${options.mode} ${options.output}`)

  try {
    const latestVersion = await getGitmojiChangelogLatestVersion()
    if (semverCompare(latestVersion, pkg.version) > 0) {
      logger.warn(`You got an outdated version of gitmoji-changelog, please update! (yours: ${pkg.version}, latest: ${latestVersion})`)
      logger.warn('Just do the following npm command to update it:')
      logger.warn('\t> npm install -g gitmoji-changelog@latest')
    }
  } catch (e) { /* ignore error */ }

  let metaInfo
  try {
    logger.info(`load preset ${options.preset}`)
    if (!fs.existsSync(path.join(__dirname, 'presets', `${options.preset}.js`))) {
      throw Error(`The preset ${options.preset} doesn't exist`)
    }
    // eslint-disable-next-line global-require
    const loadMetaInfo = require(`./presets/${options.preset}.js`)
    metaInfo = await loadMetaInfo()
  } catch (e) {
    logger.error(e)
    // Force quit if the requested preset doesn't exist
    process.exit(0)
  }

  if (options.groupSimilarCommits) {
    logger.warn('⚗️  You are using a beta feature - may not working as expected')
    logger.warn('Feel free to open issues or PR into gitmoji-changelog')
    logger.warn('\t> https://github.com/frinyvonnick/gitmoji-changelog')
  }

  try {
    switch (options.format) {
      case 'json': {
        const changelog = await getChangelog(options, metaInfo)

        logMetaData(changelog)

        fs.writeFileSync(options.output, JSON.stringify(changelog))
        break
      }
      default: {
        const lastVersion = await getLatestVersion(options.output)
        const newOptions = set(options, 'meta.lastVersion', lastVersion)

        const changelog = await getChangelog(newOptions, metaInfo)

        logMetaData(changelog)

        await buildMarkdownFile(changelog, newOptions)
      }
    }
    logger.success(`changelog updated into ${options.output}`)
  } catch (e) {
    logger.error(e)
  }

  // force quit (if the latest version request is pending, we don't wait for it)
  process.exit(0)
}

async function getChangelog(options, metaInfo) {
  const repository = await getRepoInfo()

  const release = options.release === 'from-package' ? metaInfo.version : options.release

  if (!semver.valid(release)) {
    throw new Error(`${release} is not a valid semver version.`)
  }

  const enhancedOptions = {
    ...options,
    release,
  }

  // let changelog = await generateChangelog(enhancedOptions)
  let changelog
  if (options.mode === 'init') {
    changelog = await generateChangelog('', release, enhancedOptions)
  } else {
    const { meta } = options
    const lastVersion = get(meta, 'lastVersion')

    changelog = await generateChangelog(lastVersion, release, enhancedOptions)
  }

  if (options.interactive) {
    changelog = await executeInteractiveMode(changelog)
  }

  changelog.meta.package = metaInfo
  changelog.meta.repository = repository

  return changelog
}

function logMetaData(changelog) {
  if (changelog.meta.package) {
    const { name, version } = changelog.meta.package
    logger.info(`${name} v${version}`)
  }
  if (changelog.meta.repository) {
    logger.info(changelog.meta.repository.url)
  }
}

module.exports = { main }
