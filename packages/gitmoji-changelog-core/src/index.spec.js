/* eslint-disable global-require */
const gitRawCommits = require('git-raw-commits')
const gitSemverTags = require('git-semver-tags')

const { generateChangelog } = require('./index')

const sparklesCommit = {
  hash: 'c40ee8669ba7ea5151adc2942fa8a7fc98d9e23a',
  date: '2018-08-28T10:06:00+02:00',
  subject: ':sparkles: Add a brand new feature',
  body: 'Waouh this is awesome 2',
  emoji: '✨',
  emojiCode: 'sparkles',
  group: 'added',
  message: 'Add a brand new feature',
  siblings: [],
}

const recycleCommit = {
  hash: 'c40ee8669ba7ea5151adc2942fa8a7fc98d9e23c',
  date: '2018-08-01T10:07:00+02:00',
  subject: ':recycle: Make some reworking on code',
  body: 'Waouh this is awesome 3',
  emoji: '♻️',
  emojiCode: 'recycle',
  group: 'changed',
  message: 'Make some reworking on code',
  siblings: [],
}

const secondRecycleCommit = {
  hash: 'c40ee8669ba7ea5151adc2942fa8a7fc98d9e23d',
  date: '2018-08-30T10:07:00+02:00',
  subject: ':recycle: Upgrade another brand new feature',
  body: 'Waouh this is awesome 4',
  emoji: '♻️',
  emojiCode: 'recycle',
  group: 'changed',
  message: 'Upgrade another brand new feature',
  siblings: [],
}

const lipstickCommit = {
  hash: 'c40ee8669ba7ea5151adc2942fa8a7fc98d9e23e',
  date: '2018-08-10T10:07:00+02:00',
  subject: ':lipstick: Change graphics for a feature',
  body: 'Waouh this is awesome 5',
  emoji: '💄',
  emojiCode: 'lipstick',
  group: 'changed',
  message: 'Change graphics for a feature',
  siblings: [],
}

const secondLipstickCommit = {
  hash: 'c40ee8669ba7ea5151adc2942fa8a7fc98d9e23f',
  date: '2018-08-18T10:07:00+02:00',
  subject: ':lipstick: Change more graphics for a feature',
  body: 'Waouh this is awesome 6',
  emoji: '💄',
  emojiCode: 'lipstick',
  group: 'changed',
  message: 'Change more graphics for a feature',
  siblings: [],
}

describe('changelog', () => {
  it('should generate changelog for next release', async () => {
    mockGroups()

    gitSemverTags.mockImplementation(cb => cb(null, []))

    const { changes } = await generateChangelog({ mode: 'update', release: 'next' })

    expect(changes).toEqual([
      {
        version: 'next',
        groups: [
          {
            group: 'added',
            label: 'Added',
            commits: expect.arrayContaining([expect.objectContaining(sparklesCommit)]),
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
        version: 'next',
        groups: [
          {
            group: 'changed',
            label: 'Changed',
            commits: [
              {
                ...lipstickCommit,
                siblings: [secondLipstickCommit],
              },
              recycleCommit,
              secondRecycleCommit,
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
            commits: [sparklesCommit],
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
      await generateChangelog({ mode: 'update', release: 'next' })
    } catch (e) {
      message = e.message
    }
    expect(message).toBeTruthy()
  })

  it('should get previous tag in from', async () => {
    mockGroups()
    mockGroup([sparklesCommit])

    gitSemverTags.mockImplementation(cb => cb(null, ['v1.0.1', 'v1.0.0']))

    await generateChangelog({ mode: 'init' })

    expect(gitRawCommits).toHaveBeenCalledWith(expect.objectContaining({ from: 'v1.0.1', to: '' }))
    expect(gitRawCommits).toHaveBeenCalledWith(
      expect.objectContaining({ from: 'v1.0.0', to: 'v1.0.1' })
    )
    expect(gitRawCommits).toHaveBeenCalledWith(expect.objectContaining({ from: '', to: 'v1.0.0' }))
  })

  it('should filter empty groups out', async () => {
    mockGroup([sparklesCommit])
    mockGroup([recycleCommit])
    mockGroup([]) // empty group
    mockGroup([lipstickCommit])

    gitSemverTags.mockImplementation(cb => cb(null, ['v1.0.0', '1.0.0', 'v1.1.1']))

    const { changes } = await generateChangelog({ mode: 'init' })

    // inputs has 4 group (4 versions)
    // but output should only has 3, since the 3rd is empty
    expect(changes).toHaveLength(3)
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
        hash, date, subject, body,
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
