/* eslint-disable global-require */
const gitRawCommits = require('git-raw-commits')
const gitSemverTags = require('git-semver-tags')

const { generateChangelog } = require('./index')

const sparklesCommit = {
  hash: 'c40ee8669ba7ea5151adc2942fa8a7fc98d9e23a',
  date: '2018-08-28T10:06:00+02:00',
  subject: ':sparkles: Upgrade brand new feature',
  body: 'Waouh this is awesome 2',
}

const recycleCommit = {
  hash: 'c40ee8669ba7ea5151adc2942fa8a7fc98d9e23c',
  date: '2018-08-01T10:07:00+02:00',
  subject: ':recycle: Upgrade brand new feature',
  body: 'Waouh this is awesome 3',
}

const secondRecycleCommit = {
  hash: 'c40ee8669ba7ea5151adc2942fa8a7fc98d9e23d',
  date: '2018-08-30T10:07:00+02:00',
  subject: ':recycle: Upgrade another brand new feature',
  body: 'Waouh this is awesome 4',
}

const lipstickCommit = {
  hash: 'c40ee8669ba7ea5151adc2942fa8a7fc98d9e23e',
  date: '2018-08-10T10:07:00+02:00',
  subject: ':lipstick: Change graphics for a feature',
  body: 'Waouh this is awesome 5',
}

const secondLipstickCommit = {
  hash: 'c40ee8669ba7ea5151adc2942fa8a7fc98d9e23f',
  date: '2018-08-18T10:07:00+02:00',
  subject: ':lipstick: Change more graphics for a feature',
  body: 'Waouh this is awesome 6',
}

describe('changelog', () => {
  it('should generate changelog for next release', async () => {
    mockGroups()

    gitSemverTags.mockImplementation(cb => cb(null, []))

    const { changes } = await generateChangelog({ mode: 'incremental', release: 'next' })

    expect(changes).toEqual([
      {
        version: 'next',
        groups: [
          {
            group: 'added',
            label: 'Added',
            commits: expect.arrayContaining([
              expect.objectContaining(sparklesCommit),
            ]),
          },
        ],
      },
    ])
  })

  it('should generate changelog for all tags', async () => {
    mockGroups()

    gitSemverTags.mockImplementation(cb => cb(null, ['v1.0.0']))

    const { changes } = await generateChangelog({ mode: 'init' })

    expect(changes).toEqual([
      {
        version: '1.0.0',
        date: '2018-08-30',
        groups: [
          {
            group: 'changed',
            label: 'Changed',
            commits: [
              expect.objectContaining(lipstickCommit),
              expect.objectContaining(secondLipstickCommit),
              expect.objectContaining(recycleCommit),
              expect.objectContaining(secondRecycleCommit),
            ],
          },
        ],
      },
    ])
  })

  it('should throw an error if no commits', async () => {
    mockNoCommits()

    gitSemverTags.mockImplementation(cb => cb(null, []))

    let message = false
    try {
      await generateChangelog({ mode: 'incremental', release: 'next' })
    } catch (e) {
      message = e.message
    }
    expect(message).toBeTruthy()
  })
})

jest.mock('git-raw-commits')
jest.mock('git-semver-tags')

function mockGroup(commits) {
  gitRawCommits.mockImplementationOnce(() => {
    const stream = require('stream')
    const readable = new stream.Readable()
    commits.forEach(commit => {
      const {
        hash,
        date,
        subject,
        body,
      } = commit
      readable.push(`\n${hash}\n${date}\n${subject}\n${body}\n`)
    })
    readable.push(null)
    readable.emit('close')
    return readable
  })
}

function mockNoCommits() {
  gitRawCommits.mockReset()

  gitRawCommits.mockImplementationOnce(() => {
    const stream = require('stream')
    const readable = new stream.Readable()
    readable.push(null)
    readable.emit('close')
    return readable
  })
}

function mockGroups() {
  mockGroup([sparklesCommit])
  mockGroup([recycleCommit, secondRecycleCommit, lipstickCommit, secondLipstickCommit])
}
