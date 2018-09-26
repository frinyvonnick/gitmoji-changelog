const { convert, autolink, getShortHash } = require('./index')

describe('Markdown converter', () => {
  it('should convert changelog into markdown', () => {
    const changelog = {
      meta: {
        repoInfo: {
          type: 'github',
          domain: 'github.com',
          user: 'frinyvonnick',
          project: 'gitmoji-changelog',
          repoUrl: 'https://github.com/frinyvonnick/gitmoji-changelog',
          bugsUrl: 'https://github.com/frinyvonnick/gitmoji-changelog/issues',
        },
      },
      changes: [
        {
          version: 'v1.0.0',
          groups: [
            {
              group: 'added',
              label: 'Added',
              commits: [
                {
                  hash: 'c40ee8669ba7ea5151adc2942fa8a7fc98d9e23f',
                  shortHash: 'c40ee86',
                  date: '2018-08-28T10:06:00+02:00',
                  subject: ':sparkles: Upgrade brand new feature',
                  body: 'Waouh this is awesome 2',
                },
              ],
            },
          ],
        },
        {
          version: 'next',
          groups: [
            {
              group: 'changed',
              label: 'Changed',
              commits: [
                {
                  hash: 'c40ee8669ba7ea5151adc2942fa8a7fc98d9e23c',
                  shortHash: 'c40ee86',
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

    expect(convert(changelog)).toEqual(`# Changelog

## v1.0.0

### Added

- :sparkles: Upgrade brand new feature ([c40ee86](https://github.com/frinyvonnick/gitmoji-changelog/commit/c40ee8669ba7ea5151adc2942fa8a7fc98d9e23f))


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
      repoUrl: 'https://github.com/frinyvonnick/gitmoji-changelog',
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
