const { convert } = require('./index')

describe('Markdown converter', () => {
  it('should convert changelog into markdown', () => {
    const changelog = [
      {
        version: 'v1.0.0',
        commits: [
          {
            hash: 'c40ee8669ba7ea5151adc2942fa8a7fc98d9e23f',
            date: '2018-08-28T10:06:00+02:00',
            subject: ':sparkles: Upgrade brand new feature',
            body: 'Waouh this is awesome 2',
          },
        ],
      },
      {
        version: 'next',
        commits: [
          {
            hash: 'c40ee8669ba7ea5151adc2942fa8a7fc98d9e23c',
            date: '2018-08-28T10:07:00+02:00',
            subject: ':sparkles: Upgrade brand new feature',
            body: 'Waouh this is awesome 3',
          },
        ],
      },
    ]

    expect(convert(changelog)).toEqual(`# Changelog

## v1.0.0

- :sparkles: Upgrade brand new feature (c40ee8669ba7ea5151adc2942fa8a7fc98d9e23f)

## next

- :sparkles: Upgrade brand new feature (c40ee8669ba7ea5151adc2942fa8a7fc98d9e23c)

`)
  })
})
