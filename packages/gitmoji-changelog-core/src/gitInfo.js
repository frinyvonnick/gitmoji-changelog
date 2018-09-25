const readPkgUp = require('read-pkg-up')
const getPkgRepo = require('get-pkg-repo')
const gitRemoteOriginUrl = require('git-remote-origin-url')
const normalizePackageData = require('normalize-package-data')
const { isEmpty } = require('lodash')

async function getGitInfo() {
  // get the closest package.json file
  let packageJson = {}
  try {
    const packageInfo = await readPkgUp()
    packageJson = packageInfo.pkg || {}
  } catch (e) {
    packageJson = {}
  }

  // if pkg not found or empty, get git remote origin
  if (!packageJson.repository || !packageJson.repository.url) {
    try {
      const url = await gitRemoteOriginUrl()
      packageJson.repository = { url }
      normalizePackageData(packageJson)
    } catch (e) {
      packageJson = {}
    }
  }

  // normalize and extract repo info from package.json info
  try {
    return getPkgRepo(packageJson)
  } catch (e) {
    return null
  }
}

function getHashUrl(hash, gitInfo) {
  if (!hash) return null

  if (isEmpty(gitInfo)) return null

  return `${gitInfo.browse()}/commit/${hash}`
}

function autolink(message, gitInfo) {
  if (!message) return null

  if (isEmpty(gitInfo)) return message

  const matches = message.match(/#{1}(\d+)/gm)
  if (!matches) return message

  return message.replace(/#{1}(\d+)/gm, `[#$1](${gitInfo.bugs()}/$1)`)
}

module.exports = {
  getGitInfo,
  getHashUrl,
  autolink,
}
