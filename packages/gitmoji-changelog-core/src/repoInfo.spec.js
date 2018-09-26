/* eslint-disable global-require */
const readPkgUp = require('read-pkg-up')
const gitRemoteOriginUrl = require('git-remote-origin-url')

const { getRepoInfo } = require('./repoInfo')

describe('getRepoInfo', () => {
  it('should extract repo info from package.json', async () => {
    readPkgUp.mockImplementationOnce(() => Promise.resolve({
      pkg: {
        repository: {
          type: 'git',
          url: 'git+https://github.com/frinyvonnick/gitmoji-changelog.git',
        },
      },
    }))

    const result = await getRepoInfo()

    expect(result).toEqual({
      type: 'github',
      domain: 'github.com',
      user: 'frinyvonnick',
      project: 'gitmoji-changelog',
      repoUrl: 'https://github.com/frinyvonnick/gitmoji-changelog',
      bugsUrl: 'https://github.com/frinyvonnick/gitmoji-changelog/issues',
    })
  })

  it('should extract repo info from .git info if nothing in package.json', async () => {
    readPkgUp.mockImplementationOnce(() => Promise.resolve({}))
    gitRemoteOriginUrl.mockImplementationOnce(() => Promise.resolve('git+https://github.com/frinyvonnick/gitmoji-changelog.git'))

    const result = await getRepoInfo()

    expect(result).toEqual({
      type: 'github',
      domain: 'github.com',
      user: 'frinyvonnick',
      project: 'gitmoji-changelog',
      repoUrl: 'https://github.com/frinyvonnick/gitmoji-changelog',
      bugsUrl: 'https://github.com/frinyvonnick/gitmoji-changelog/issues',
    })
  })

  it('should return null if no git info found', async () => {
    readPkgUp.mockImplementationOnce(() => Promise.resolve({}))
    gitRemoteOriginUrl.mockImplementationOnce(() => Promise.resolve(null))

    const result = await getRepoInfo()

    expect(result).toBeNull()
  })
})

jest.mock('read-pkg-up')
jest.mock('git-remote-origin-url')
