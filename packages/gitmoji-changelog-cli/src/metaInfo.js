const gitRemoteOriginUrl = require('git-remote-origin-url')
const hostedGitInfo = require('hosted-git-info')

const { isEmpty } = require('lodash')

// get git repository info
async function getRepoInfo() {
  try {
    const url = await gitRemoteOriginUrl()
    const repo = hostedGitInfo.fromUrl(url)

    if (isEmpty(repo)) return null

    return {
      type: repo.type,
      domain: repo.domain,
      user: repo.user,
      project: repo.project,
      url: repo.browse(),
      bugsUrl: repo.bugs(),
    }
  } catch (e) {
    return null
  }
}

module.exports = {
  getRepoInfo,
}
