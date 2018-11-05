const fs = require('fs')
const { promisify } = require('util')
const libnpm = require('libnpm')
const semver = require('semver')
const semverCompare = require('semver-compare')
const { head } = require('lodash')
const gitSemverTags = require('git-semver-tags')
const gitSemverTagsAsync = promisify(gitSemverTags)

const {
  sanitizeVersion,
  getPackageInfo,
  generateChangelog,
  logger,
} = require('@gitmoji-changelog/core')
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

  if (options.groupSimilarCommits) {
    logger.warn('⚗️  You are using a beta feature - may not working as expected')
    logger.warn('Feel free to open issues or PR into gitmoji-changelog')
    logger.warn('\t> https://github.com/frinyvonnick/gitmoji-changelog')
  }

  try {
    const tags = await gitSemverTagsAsync()
    const lastTag = head(tags)

    const from = options.mode === 'init' ? '' : lastTag
    const packageInfo = await getPackageInfo()

    let to = options.release === 'from-package' ? packageInfo.to : options.release
    if (to && to !== 'next') {
      if (!semver.valid(to)) {
        throw new Error(`${to} is not a valid semver to.`)
      }

      to = sanitizeVersion(to)
    }

    const changelog = await generateChangelog({ ...options, from, to })

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
