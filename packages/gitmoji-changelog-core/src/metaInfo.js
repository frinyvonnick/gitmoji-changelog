const getPkgRepo = require('get-pkg-repo')
const gitRemoteOriginUrl = require('git-remote-origin-url')
const { isEmpty } = require('lodash')

const setRepositoryInfo = (context) => async () => {
  try {
    const url = await gitRemoteOriginUrl()
    if (!url) return
    context.repository.originUrl = url
  } catch (e) {
    return
  }

  // extract repo info from package.json info
  try {
    const repo = getPkgRepo({
      repository: {
        url: context.repository.originUrl,
      },
    })

    if (isEmpty(repo)) return

    context.repository = {
      ...context.repository,
      type: repo.type,
      domain: repo.domain,
      user: repo.user,
      project: repo.project,
      url: repo.browse(),
      bugsUrl: repo.bugs(),
    }
  } catch (e) { /* ignore errors */ }
}

module.exports = {
  setRepositoryInfo,
}
