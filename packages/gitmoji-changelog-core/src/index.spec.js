/* eslint-disable global-require */
const gitRawCommits = require('git-raw-commits')
const gitSemverTags = require('git-semver-tags')

const { generateChangelog } = require('./index')

const sparklesCommit = {
  hash: 'c40ee8669ba7ea5151adc2942fa8a7fc98d9e23f',
  date: '2018-08-28T10:06:00+02:00',
  subject: ':sparkles: Upgrade brand new feature',
  body: 'Waouh this is awesome 2',
}

const recycleCommit = {
  hash: 'c40ee8669ba7ea5151adc2942fa8a7fc98d9e23c',
  date: '2018-08-28T10:07:00+02:00',
  subject: ':recycle: Upgrade brand new feature',
  body: 'Waouh this is awesome 3',
}

describe('changelog', () => {
  beforeEach(() => {
    mockCommits()
  })

  it('should generate changelog in json format for next release', async () => {
    gitSemverTags.mockImplementation((cb) => cb(null, []))

    const { changes } = await generateChangelog()

    expect(changes).toEqual([
      {
        version: 'next',
        date: '2018-08-28',
        groups: [
          {
            group: 'changed',
            label: 'Changed',
            commits: [
              expect.objectContaining(recycleCommit),
            ],
          },
        ],
      },
    ])
  })

  it('should generate changelog in json format for all tags', async () => {
    gitSemverTags.mockImplementation((cb) => cb(null, ['v1.0.0']))

    const { changes } = await generateChangelog()

    expect(changes).toEqual([
      {
        version: 'v1.0.0',
        date: '2018-08-28',
        groups: [
          {
            group: 'added',
            label: 'Added',
            commits: [
              expect.objectContaining(sparklesCommit),
            ],
          },
        ],
      },
      {
        version: 'next',
        date: '2018-08-28',
        groups: [
          {
            group: 'changed',
            label: 'Changed',
            commits: [
              expect.objectContaining(recycleCommit),
            ],
          },
        ],
      },
    ])
  })
})

jest.mock('git-raw-commits')
jest.mock('git-semver-tags')

function mockCommits() {
  gitRawCommits.mockImplementationOnce(() => {
    const stream = require('stream')
    const readable = new stream.Readable()
    const {
      hash,
      date,
      subject,
      body,
    } = recycleCommit
    readable.push(`\n${hash}\n${date}\n${subject}\n${body}\n`)
    readable.push(null)
    readable.emit('close')
    return readable
  })
  gitRawCommits.mockImplementationOnce(() => {
    const stream = require('stream')
    const readable = new stream.Readable()
    const {
      hash,
      date,
      subject,
      body,
    } = sparklesCommit
    readable.push(`\n${hash}\n${date}\n${subject}\n${body}\n`)
    readable.push(null)
    readable.emit('close')
    return readable
  })
}
