/* eslint-disable global-require */
const gitRawCommits = require('git-raw-commits')

const { changelog } = require('./index')

describe('changelog', () => {
  beforeAll(() => {
    gitRawCommits.mockImplementation(() => {
      const stream = require('stream')
      const readable = new stream.Readable()
      readable.push(`
c40ee8669ba7ea5151adc2942fa8a7fc98d9e23f
2018-08-28T10:06:00+02:00
:sparkles: Upgrade brand new feature
Waouh this is awesome 2
`)
      readable.push(null)
      readable.emit('close')
      return readable
    })
  })

  it('should generate changelog in json format', async () => {
    const result = await changelog()

    expect(result).toEqual(JSON.stringify([
      {
        hash: 'c40ee8669ba7ea5151adc2942fa8a7fc98d9e23f',
        date: '2018-08-28T10:06:00+02:00',
        subject: ':sparkles: Upgrade brand new feature',
        body: 'Waouh this is awesome 2',
      },
    ]))
  })
})

jest.mock('git-raw-commits')
