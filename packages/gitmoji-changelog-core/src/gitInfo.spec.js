/* eslint-disable global-require */
const readPkgUp = require('read-pkg-up')
const gitRemoteOriginUrl = require('git-remote-origin-url')

const { getGitInfo, autolink, getHashUrl } = require('./gitInfo')

describe('getGitInfo', () => {
  it('should extract repo info from package.json', async () => {
    readPkgUp.mockImplementationOnce(() => Promise.resolve({
      pkg: {
        repository: {
          type: 'git',
          url: 'git+https://github.com/frinyvonnick/gitmoji-changelog.git',
        },
      },
    }))

    const result = await getGitInfo()

    expect(result).toEqual(
      expect.objectContaining({
        type: 'github',
        domain: 'github.com',
        user: 'frinyvonnick',
        project: 'gitmoji-changelog',
      })
    )
  })

  it('should extract repo info from .git info if nothing in package.json', async () => {
    readPkgUp.mockImplementationOnce(() => Promise.resolve({}))
    gitRemoteOriginUrl.mockImplementationOnce(() => Promise.resolve('git+https://github.com/frinyvonnick/gitmoji-changelog.git'))

    const result = await getGitInfo()

    expect(result).toEqual(
      expect.objectContaining({
        type: 'github',
        domain: 'github.com',
        user: 'frinyvonnick',
        project: 'gitmoji-changelog',
      })
    )
  })

  it('should return null if no git info found', async () => {
    readPkgUp.mockImplementationOnce(() => Promise.resolve({}))
    gitRemoteOriginUrl.mockImplementationOnce(() => Promise.resolve(null))

    const result = await getGitInfo()

    expect(result).toBeNull()
  })
})


describe('getHashUrl', () => {
  it('should return null if no hash given', () => {
    const result = getHashUrl()
    expect(result).toBeNull()
  })

  it('should return null if no gitInfo given', () => {
    const result = getHashUrl('xxx')
    expect(result).toBeNull()
  })

  it('should return the url of a hash', () => {
    const result = getHashUrl('xxx', {
      browse: () => 'https://github.com/frinyvonnick/gitmoji-changelog',
    })
    expect(result).toBe('https://github.com/frinyvonnick/gitmoji-changelog/commit/xxx')
  })
})

describe('autolink', () => {
  it('should return null if no message given', () => {
    const result = autolink()
    expect(result).toBeNull()
  })

  it('should return the message if no gitInfo given', () => {
    const result = autolink('message without gitinfo')
    expect(result).toBe('message without gitinfo')
  })

  it('should return the message if nothing match', () => {
    const result = autolink('nothing match in this message')
    expect(result).toBe('nothing match in this message')
  })

  it('should autolink one hashtag issue in message', () => {
    const result = autolink(':bug: fix issue #123', {
      bugs: () => 'https://github.com/frinyvonnick/gitmoji-changelog/issues',
    })
    expect(result).toBe(':bug: fix issue [#123](https://github.com/frinyvonnick/gitmoji-changelog/issues/123)')
  })

  it('should autolink severals hashtag issues in message', () => {
    const result = autolink(':bug: fix issue #123 and #456', {
      bugs: () => 'https://github.com/frinyvonnick/gitmoji-changelog/issues',
    })
    expect(result).toBe(':bug: fix issue [#123](https://github.com/frinyvonnick/gitmoji-changelog/issues/123) and [#456](https://github.com/frinyvonnick/gitmoji-changelog/issues/456)')
  })
})

jest.mock('read-pkg-up')
jest.mock('git-remote-origin-url')
