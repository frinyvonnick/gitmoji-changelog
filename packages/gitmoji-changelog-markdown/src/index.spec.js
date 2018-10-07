/* eslint-disable global-require */
const fs = require('fs')

const { buildMarkdownFile, autolink, getShortHash } = require('./index')

describe('Markdown converter', () => {
  it('should generate full changelog into markdown from scratch', async () => {
    fs.writeFileSync = jest.fn()

    const changelog = {
      meta: {
        repository: {
          type: 'github',
          domain: 'github.com',
          user: 'frinyvonnick',
          project: 'gitmoji-changelog',
          url: 'https://github.com/frinyvonnick/gitmoji-changelog',
          bugsUrl: 'https://github.com/frinyvonnick/gitmoji-changelog/issues',
        },
      },
      changes: [
        {
          version: 'next',
          groups: [
            {
              group: 'changed',
              label: 'Changed',
              commits: [
                {
                  hash: 'c40ee8669ba7ea5151adc2942fa8a7fc98d9e23c',
                  date: '2018-08-28T10:07:00+02:00',
                  subject: ':recycle: Upgrade brand new feature',
                  body: 'Waouh this is awesome 3',
                },
              ],
            },
          ],
        },
        {
          version: '1.0.0',
          date: '2018-08-28',
          groups: [
            {
              group: 'added',
              label: 'Added',
              commits: [
                {
                  hash: 'c40ee8669ba7ea5151adc2942fa8a7fc98d9e23f',
                  date: '2018-08-28T10:06:00+02:00',
                  subject: ':sparkles: Upgrade brand new feature',
                  body: 'Waouh this is awesome 2',
                },
              ],
            },
          ],
        },
      ],
    }

    await buildMarkdownFile(changelog, { mode: 'init', output: './CHANGELOG.md' })

    expect(fs.writeFileSync.mock.calls[0].length).toBe(2)
    expect(fs.writeFileSync.mock.calls[0][0]).toBe('./CHANGELOG.md')
    expect(fs.writeFileSync.mock.calls[0][1]).toEqual(`# Changelog

<a name="next"></a>
## next

### Changed

- :recycle: Upgrade brand new feature ([c40ee86](https://github.com/frinyvonnick/gitmoji-changelog/commit/c40ee8669ba7ea5151adc2942fa8a7fc98d9e23c))


<a name="1.0.0"></a>
## 1.0.0 - 2018-08-28

### Added

- :sparkles: Upgrade brand new feature ([c40ee86](https://github.com/frinyvonnick/gitmoji-changelog/commit/c40ee8669ba7ea5151adc2942fa8a7fc98d9e23f))


`)
  })

  // FIXME: should find a better way to mock fs
  it.skip('should generate incremental markdown changelog', async () => {
    fs.createWriteStream = jest.fn(() => ({
      write: jest.fn(),
      end: jest.fn(),
    }))
    fs.renameSync = jest.fn()

    const changelog = {
      meta: {
        repository: {
          type: 'github',
          domain: 'github.com',
          user: 'frinyvonnick',
          project: 'gitmoji-changelog',
          url: 'https://github.com/frinyvonnick/gitmoji-changelog',
          bugsUrl: 'https://github.com/frinyvonnick/gitmoji-changelog/issues',
        },
      },
      changes: [
        {
          version: 'next',
          groups: [
            {
              group: 'changed',
              label: 'Changed',
              commits: [
                {
                  hash: 'c40ee8669ba7ea5151adc2942fa8a7fc98d9e23c',
                  date: '2018-08-28T10:07:00+02:00',
                  subject: ':recycle: Upgrade brand new feature',
                  body: 'Waouh this is awesome 3',
                },
              ],
            },
          ],
        },
      ],
    }

    await buildMarkdownFile(changelog, { mode: 'incremental', output: './CHANGELOG.md' })

    const writer = fs.createWriteStream.mock.results[0].value.write

    expect(writer.mock.calls.length).toBe(1)
    expect(writer.mock.calls[0][0]).toBe(`# Changelog

<a name="next"></a>
## next

### Changed

- :recycle: Upgrade brand new feature ([c40ee86](https://github.com/frinyvonnick/gitmoji-changelog/commit/c40ee8669ba7ea5151adc2942fa8a7fc98d9e23c))


`)
  })
})

describe('getHashUrl', () => {
  it('should return null if no hash given', () => {
    const result = getShortHash()
    expect(result).toBeNull()
  })

  it('should return short hash if no gitInfo given', () => {
    const result = getShortHash('xxxxxxxxxxxxxxxxx')
    expect(result).toBe('xxxxxxx')
  })

  it('should return short hash markdown with repo url', () => {
    const result = getShortHash('xxxxxxxxxxxxxxxxx', {
      url: 'https://github.com/frinyvonnick/gitmoji-changelog',
    })
    expect(result).toBe('[xxxxxxx](https://github.com/frinyvonnick/gitmoji-changelog/commit/xxxxxxxxxxxxxxxxx)')
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

  it('should autolink with markdown one hashtag issue in message', () => {
    const result = autolink(':bug: fix issue #123', {
      bugsUrl: 'https://github.com/frinyvonnick/gitmoji-changelog/issues',
    })
    expect(result).toBe(':bug: fix issue [#123](https://github.com/frinyvonnick/gitmoji-changelog/issues/123)')
  })

  it('should autolink with markdown severals hashtag issues in message', () => {
    const result = autolink(':bug: fix issue #123 and #456', {
      bugsUrl: 'https://github.com/frinyvonnick/gitmoji-changelog/issues',
    })
    expect(result).toBe(':bug: fix issue [#123](https://github.com/frinyvonnick/gitmoji-changelog/issues/123) and [#456](https://github.com/frinyvonnick/gitmoji-changelog/issues/456)')
  })
})
