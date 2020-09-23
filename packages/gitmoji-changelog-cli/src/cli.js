const fs = require('fs')
const { get } = require('lodash')
const { set } = require('immutadot')
const libnpm = require('libnpm')
const semver = require('semver')
const semverCompare = require('semver-compare')
const rc = require('rc')

const { generateChangelog, logger } = require('@gitmoji-changelog/core')
const { buildMarkdownFile, getLatestVersion } = require('@gitmoji-changelog/markdown')

const issueReporter = require('issue-reporter')

const { executeInteractiveMode } = require('./interactiveMode')
const getRepositoryInfo = require('./repository')
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

  const customConfiguration = rc('gitmoji-changelog')
  if (customConfiguration.configs) {
    logger.info('Custom configuration found')
  } else {
    logger.info('No custom configuration found')
  }

  try {
    const latestVersion = await getGitmojiChangelogLatestVersion()
    if (semverCompare(latestVersion, pkg.version) > 0) {
      logger.warn(`You got an outdated version of gitmoji-changelog, please update! (yours: ${pkg.version}, latest: ${latestVersion})`)
      logger.warn('Just do the following npm command to update it:')
      logger.warn('\t> npm install -g gitmoji-changelog@latest')
    }
  } catch (e) { /* ignore error */ }

  let projectInfo
  try {
    logger.info(`use preset ${options.preset}`)

    // eslint-disable-next-line global-require
    const loadProjectInfo = require(`./presets/${options.preset}.js`)
    projectInfo = await loadProjectInfo()

    if (!projectInfo) {
      throw Error(`Cannot retrieve configuration for preset ${options.preset}.`)
    }

    if (!projectInfo.version && options.release === 'from-package') {
      throw Error('Cannot retrieve the version from your configuration. Check it or you can do "gitmoji-changelog <wanted version>".')
    }
  } catch (e) {
    logger.error(e)
    // Force quit if the requested preset doesn't exist
    return process.exit(0)
  }

  if (options.groupSimilarCommits) {
    logger.warn('⚗️  You are using a beta feature - may not working as expected')
    logger.warn('Feel free to open issues or PR into gitmoji-changelog')
    logger.warn('\t> https://github.com/frinyvonnick/gitmoji-changelog')
  }

  try {
    switch (options.format) {
      case 'json': {
        const changelog = await getChangelog(options, projectInfo)

        logMetaData(changelog)

        fs.writeFileSync(options.output, JSON.stringify(changelog))
        break
      }
      default: {
        const lastVersion = await getLatestVersion(options.output)
        const newOptions = set(options, 'meta.lastVersion', lastVersion)

        // Handle the case where changelog file exist but there isn't a previous version
        if (options.mode === 'update' && !lastVersion) {
          newOptions.mode = 'init'

          fs.unlinkSync(options.output)
        }

        const changelog = await getChangelog(newOptions, projectInfo)

        logMetaData(changelog)
        await buildMarkdownFile(changelog, newOptions)
      }
    }
    logger.success(`changelog updated into ${options.output}`)
  } catch (e) {
    if (e.name !== 'FunctionalError') {
      const repository = await getRepositoryInfo()
      await issueReporter({
        error: e,
        user: 'frinyvonnick',
        repo: 'gitmoji-changelog',
        sections: [
          {
            title: 'CLI options',
            content: options,
          },
          {
            title: 'Project info',
            content: projectInfo,
          },
          {
            title: 'Repository info',
            content: repository,
          },
        ],
      })
    } else {
      logger.error(e)
    }
  }

  // force quit (if the latest version request is pending, we don't wait for it)
  return process.exit(0)
}

async function getChangelog(options, projectInfo) {
  const repository = await getRepositoryInfo()

  const release = options.release === 'from-package' ? projectInfo.version : options.release

  if (!semver.valid(release)) {
    throw new Error(`${release} is not a valid semver version.`)
  }

  const enhancedOptions = {
    ...options,
    release,
  }

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

  changelog.meta.project = projectInfo
  changelog.meta.repository = repository

  return changelog
}

function logMetaData(changelog) {
  if (changelog.meta.project) {
    const { name, version } = changelog.meta.project
    logger.info(`${name} v${version}`)
  }
  if (changelog.meta.repository) {
    logger.info(changelog.meta.repository.url)
  }
}

module.exports = { main }
