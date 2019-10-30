/* eslint-disable global-require */
const gitRemoteOriginUrl = require('git-remote-origin-url')

const { getRepoInfo } = require('./metaInfo')

describe('getRepoInfo', () => {
  it('should return null if no git info found', async () => {
    gitRemoteOriginUrl.mockImplementationOnce(() => Promise.resolve(null))

    const result = await getRepoInfo()

    expect(result).toBeNull()
  })

  it('should extract GitHub info', async () => {
    gitRemoteOriginUrl.mockImplementationOnce(() => Promise.resolve('git+https://github.com/frinyvonnick/gitmoji-changelog.git'))

    const result = await getRepoInfo()

    expect(result).toEqual({
      type: 'github',
      domain: 'github.com',
      user: 'frinyvonnick',
      project: 'gitmoji-changelog',
      url: 'https://github.com/frinyvonnick/gitmoji-changelog',
      bugsUrl: 'https://github.com/frinyvonnick/gitmoji-changelog/issues',
    })
  })

  it('should extract gitlab repo info', async () => {
    gitRemoteOriginUrl.mockImplementationOnce(() => Promise.resolve('git+https://gitlab.com/gitlab-user/gitlab-project.git'))
    const result = await getRepoInfo()

    expect(result).toEqual({
      type: 'gitlab',
      domain: 'gitlab.com',
      user: 'gitlab-user',
      project: 'gitlab-project',
      url: 'https://gitlab.com/gitlab-user/gitlab-project',
      bugsUrl: 'https://gitlab.com/gitlab-user/gitlab-project/issues',
    })
  })

  it('should extract bitbucket repo info', async () => {
    gitRemoteOriginUrl.mockImplementationOnce(() => Promise.resolve('https://username@bitbucket.org/bitbucket-account/bitbucket-project.git'))
    const result = await getRepoInfo()

    expect(result).toEqual({
      type: 'bitbucket',
      domain: 'bitbucket.org',
      user: 'bitbucket-account',
      project: 'bitbucket-project',
      url: 'https://bitbucket.org/bitbucket-account/bitbucket-project',
      bugsUrl: undefined,
    })
  })
})

jest.mock('git-remote-origin-url')
