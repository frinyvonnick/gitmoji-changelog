/* eslint-disable global-require */
const readPkgUp = require('read-pkg-up')
const gitRemoteOriginUrl = require('git-remote-origin-url')

const { getPackageInfo, getRepoInfo } = require('./metaInfo')

describe('getPackageInfo', () => {
  it('should extract github repo info from package.json', async () => {
    readPkgUp.mockImplementationOnce(() => Promise.resolve({
      pkg: {
        name: 'gitmoji-changelog',
        version: '0.0.1',
        repository: {
          type: 'git',
          url: 'git+https://github.com/frinyvonnick/gitmoji-changelog.git',
        },
      },
    }))

    const result = await getPackageInfo()

    expect(result).toEqual({
      name: 'gitmoji-changelog',
      version: '0.0.1',
      repository: {
        type: 'git',
        url: 'git+https://github.com/frinyvonnick/gitmoji-changelog.git',
      },
    })
  })
})

describe('getRepoInfo', () => {
  it('should extract github repo info from package.json', async () => {
    const result = await getRepoInfo({
      repository: {
        type: 'git',
        url: 'git+https://github.com/frinyvonnick/gitmoji-changelog.git',
      },
    })

    expect(result).toEqual({
      type: 'github',
      domain: 'github.com',
      user: 'frinyvonnick',
      project: 'gitmoji-changelog',
      url: 'https://github.com/frinyvonnick/gitmoji-changelog',
      bugsUrl: 'https://github.com/frinyvonnick/gitmoji-changelog/issues',
    })
  })

  it('should extract repo info from .git info if nothing in package.json', async () => {
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

  it('should return null if no git info found', async () => {
    gitRemoteOriginUrl.mockImplementationOnce(() => Promise.resolve(null))

    const result = await getRepoInfo()

    expect(result).toBeNull()
  })

  it('should extract gitlab repo info from package.json', async () => {
    const result = await getRepoInfo({
      repository: {
        type: 'git',
        url: 'git+https://gitlab.com/gitlab-user/gitlab-project.git',
      },
    })

    expect(result).toEqual({
      type: 'gitlab',
      domain: 'gitlab.com',
      user: 'gitlab-user',
      project: 'gitlab-project',
      url: 'https://gitlab.com/gitlab-user/gitlab-project',
      bugsUrl: 'https://gitlab.com/gitlab-user/gitlab-project/issues',
    })
  })

  it('should extract bitbucket repo info from package.json', async () => {
    const result = await getRepoInfo({
      repository: {
        type: 'git',
        url: 'https://username@bitbucket.org/bitbucket-account/bitbucket-project.git',
      },
    })

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

jest.mock('read-pkg-up')
jest.mock('git-remote-origin-url')
