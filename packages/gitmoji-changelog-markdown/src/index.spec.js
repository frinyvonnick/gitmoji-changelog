import { convert } from './index'

describe('Markdown converter', () => {
  it('should convert json changelog into markdown', () => {
    const json = [
      {
        hash: 'c40ee8669ba7ea5151adc2942fa8a7fc98d9e23f',
        date: '2018-08-28T10:06:00+02:00',
        subject: ':sparkles: Upgrade brand new feature',
        body: 'Waouh this is awesome 2',
      },
    ]

    expect(convert(JSON.stringify(json))).toEqual(`# Changelog

- ${json[0].subject} (${json[0].hash})
`)
  })
})
