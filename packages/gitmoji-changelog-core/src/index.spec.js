import { parse, parseCommit } from './index.js'

describe('commits parser', () => {
  it('should parse a single commit', () => {
    const commit = `c40ee8669ba7ea5151adc2942fa8a7fc98d9e23f
2018-08-28T10:06:00+02:00
:sparkles: Implements brand new feature
Waouh this is awesome
`
    expect(parseCommit(commit)).toEqual({
      hash: 'c40ee8669ba7ea5151adc2942fa8a7fc98d9e23f',
      date: '2018-08-28T10:06:00+02:00',
      subject: ':sparkles: Implements brand new feature',
      body: 'Waouh this is awesome\n',
    })
  })

  it('should multiple commits', () => {
    const commits = `-hash-
c40ee8669ba7ea5151adc2942fa8a7fc98d9e23f
2018-08-28T10:06:00+02:00
:sparkles: Implements brand new feature
Waouh this is awesome
`
    expect(parse(commits)).toEqual([
      {
        hash: 'c40ee8669ba7ea5151adc2942fa8a7fc98d9e23f',
        date: '2018-08-28T10:06:00+02:00',
        subject: ':sparkles: Implements brand new feature',
        body: 'Waouh this is awesome\n',
      },
    ])
  })
})
