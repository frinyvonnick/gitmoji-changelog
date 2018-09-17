/* eslint-disable global-require */
const gitRawCommits = require('git-raw-commits')
const gitSemverTags = require('git-semver-tags')

const { generateChangelog } = require('./index')

describe('changelog', () => {
  beforeEach(() => {
    gitRawCommits.mockImplementationOnce(() => {
      const stream = require('stream')
      const readable = new stream.Readable()
      readable.push(`
c40ee8669ba7ea5151adc2942fa8a7fc98d9e23c
2018-08-28T10:07:00+02:00
:sparkles: Upgrade brand new feature
Waouh this is awesome 3
`)
      readable.push(null)
      readable.emit('close')
      return readable
    })
    gitRawCommits.mockImplementationOnce(() => {
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

  it('should generate changelog in json format for next release', async () => {
    gitSemverTags.mockImplementation((cb) => cb(null, []))

    const result = await generateChangelog()

    expect(result).toEqual([
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
    ])
  })

  it('should generate changelog in json format for all tags', async () => {
    gitSemverTags.mockImplementation((cb) => cb(null, ['v1.0.0']))

    const result = await generateChangelog()

    expect(result).toEqual([
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
    ])
  })
})

jest.mock('git-raw-commits')
jest.mock('git-semver-tags')
