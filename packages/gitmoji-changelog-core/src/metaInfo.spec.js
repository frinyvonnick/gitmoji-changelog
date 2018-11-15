/* eslint-disable global-require */
const gitRemoteOriginUrl = require('git-remote-origin-url')
const { setRepositoryInfo } = require('./metaInfo')

describe('setRepositoryInfo', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should extract github repo info', async () => {
    gitRemoteOriginUrl.mockImplementationOnce(() => Promise.resolve('git+https://github.com/frinyvonnick/gitmoji-changelog.git'))

    const context = {
      repository: {},
    }

    await setRepositoryInfo(context)()

    expect(context.repository).toEqual({
      type: 'github',
      domain: 'github.com',
      user: 'frinyvonnick',
      project: 'gitmoji-changelog',
      originUrl: 'git+https://github.com/frinyvonnick/gitmoji-changelog.git',
      url: 'https://github.com/frinyvonnick/gitmoji-changelog',
      bugsUrl: 'https://github.com/frinyvonnick/gitmoji-changelog/issues',
    })
  })

  it('should not set repository info if not git origin url found', async () => {
    gitRemoteOriginUrl.mockImplementationOnce(() => Promise.resolve(null))

    const context = {
      repository: {},
    }

    await setRepositoryInfo(context)()

    expect(context.repository).toEqual({})
  })

  it('should extract gitlab repo info', async () => {
    gitRemoteOriginUrl.mockImplementationOnce(() => Promise.resolve('git+https://gitlab.com/gitlab-user/gitlab-project.git'))

    const context = {
      repository: {},
    }

    await setRepositoryInfo(context)()

    expect(context.repository).toEqual({
      type: 'gitlab',
      domain: 'gitlab.com',
      user: 'gitlab-user',
      project: 'gitlab-project',
      originUrl: 'git+https://gitlab.com/gitlab-user/gitlab-project.git',
      url: 'https://gitlab.com/gitlab-user/gitlab-project',
      bugsUrl: 'https://gitlab.com/gitlab-user/gitlab-project/issues',
    })
  })

  it('should extract bitbucket repo info', async () => {
    gitRemoteOriginUrl.mockImplementationOnce(() => Promise.resolve('https://username@bitbucket.org/bitbucket-account/bitbucket-project.git'))

    const context = {
      repository: {},
    }

    await setRepositoryInfo(context)()

    expect(context.repository).toEqual({
      type: 'bitbucket',
      domain: 'bitbucket.org',
      user: 'bitbucket-account',
      project: 'bitbucket-project',
      originUrl: 'https://username@bitbucket.org/bitbucket-account/bitbucket-project.git',
      url: 'https://bitbucket.org/bitbucket-account/bitbucket-project',
      bugsUrl: undefined,
    })
  })
})

jest.mock('git-remote-origin-url')
