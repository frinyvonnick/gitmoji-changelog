const { convert } = require('./index')

describe('Markdown converter', () => {
  it('should convert changelog into markdown', () => {
    const changelog = [
      {
        version: 'v1.0.0',
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
    ]

    expect(convert(changelog)).toEqual(`# Changelog

## v1.0.0

### Added

- :sparkles: Upgrade brand new feature (c40ee8669ba7ea5151adc2942fa8a7fc98d9e23f)


## next

### Changed

- :recycle: Upgrade brand new feature (c40ee8669ba7ea5151adc2942fa8a7fc98d9e23c)


`)
  })
})
