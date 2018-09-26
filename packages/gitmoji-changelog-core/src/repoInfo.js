const readPkgUp = require('read-pkg-up')
const getPkgRepo = require('get-pkg-repo')
const gitRemoteOriginUrl = require('git-remote-origin-url')
const normalizePackageData = require('normalize-package-data')
const { isEmpty } = require('lodash')

async function getRepoInfo() {
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

  // extract repo info from package.json info
  try {
    const repoInfo = getPkgRepo(packageJson)

    if (isEmpty(repoInfo)) return null

    return {
      type: repoInfo.type,
      domain: repoInfo.domain,
      user: repoInfo.user,
      project: repoInfo.project,
      repoUrl: repoInfo.browse(),
      bugsUrl: repoInfo.bugs(),
    }
  } catch (e) {
    return null
  }
}

module.exports = {
  getRepoInfo,
}
