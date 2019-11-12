const fs = require('fs')
const { get } = require('lodash')
const path = require('path')
const { set } = require('immutadot')
const libnpm = require('libnpm')
const semver = require('semver')
const semverCompare = require('semver-compare')
const rc = require('rc')

const { generateChangelog, logger } = require('@gitmoji-changelog/core')
const { buildMarkdownFile, getLatestVersion } = require('@gitmoji-changelog/markdown')
const envinfo = require('envinfo')
const newGithubIssueUrl = require('new-github-issue-url')
const table = require('markdown-table')
const clipboardy = require('clipboardy')

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
    if (!fs.existsSync(path.join(__dirname, 'presets', `${options.preset}.js`))) {
      throw Error(`The preset ${options.preset} doesn't exist`)
    }
    // eslint-disable-next-line global-require
    const loadProjectInfo = require(`./presets/${options.preset}.js`)
    projectInfo = await loadProjectInfo()

    if (!projectInfo) {
      throw Error(`Cannot retrieve configuration for preset ${options.preset}.`)
    }

    if (!projectInfo.version) {
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
    const repository = await getRepositoryInfo()
    await handleUnexpectedErrors(options, projectInfo, repository, e)
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

async function handleUnexpectedErrors(options, projectInfo, repository, e) {
  const envInfo = await envinfo.run(
    {
      System: ['OS'],
      Binaries: ['Node', 'Yarn', 'npm'],
    },
    { markdown: true }
  )

  const copyToClipboard =
    // Clipboard is not accessible when on a linux tty
    process.platform === 'linux' && !process.env.DISPLAY
      ? false
      : true


  const issueBody = `${envInfo}

## Stack trace

\`\`\`
${e.stack}
\`\`\`

## CLI options

${table([
  ['Option', 'Value'],
  ...Object.entries(options),
])}

## Project info

${table([
  ['Key', 'Value'],
  ...Object.entries(projectInfo),
])}

## Repository info

${table([
  ['Key', 'Value'],
  ...Object.entries(repository),
])}`

  const url = newGithubIssueUrl({
    user: 'frinyvonnick',
    repo: 'gitmoji-changelog',
    body: 'Thank you for reporting your issue :+1:\n\nThe bug report is in your clipboard, please paste it here.',
  })
  if (copyToClipboard) {
    clipboardy.writeSync(issueBody)
    logger.error(`Whoops, something went wrong, please click on the following link to create an issue \n${url}. A bug report has been copied into your clipboard.`)
  } else {
    logger.error(`Whoops, something went wrong, please click on the following link to create an issue \n${url}. Add the following bug report into the issue to give use some context.\n\n${issueBody}`)
  }
}

module.exports = { main }
