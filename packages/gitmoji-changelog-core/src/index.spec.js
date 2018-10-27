/* eslint-disable global-require */
const gitRawCommits = require('git-raw-commits')
const gitSemverTags = require('git-semver-tags')

const { generateChangelog } = require('./index')

const uselessCommit = {
  hash: '460b79497ae7e791bc8ba8475bda8f0b93630dd3',
  date: '2018-09-14T21:00:18+02:00',
  subject: ':bookmark: Bump version to 1.9.2',
  body: 'Yes!',
  emoji: '🔖',
  emojiCode: 'bookmark',
  group: 'useless',
  message: 'Bump version to 1.9.2',
}

const sparklesCommit = {
  hash: 'c40ee8669ba7ea5151adc2942fa8a7fc98d9e23a',
  date: '2018-08-28T10:06:00+02:00',
  subject: ':sparkles: Upgrade brand new feature',
  body: 'Waouh this is awesome 2',
  emoji: '✨',
  emojiCode: 'sparkles',
  group: 'added',
  message: 'Upgrade brand new feature',
}

const recycleCommit = {
  hash: 'c40ee8669ba7ea5151adc2942fa8a7fc98d9e23c',
  date: '2018-08-01T10:07:00+02:00',
  subject: ':recycle: Upgrade brand new feature',
  body: 'Waouh this is awesome 3',
  emoji: '♻️',
  emojiCode: 'recycle',
  group: 'changed',
  message: 'Upgrade brand new feature',
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
            commits: [lipstickCommit, secondLipstickCommit, recycleCommit, secondRecycleCommit],
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

  it('should filter some commits out', async () => {
    mockGroup([uselessCommit, lipstickCommit])

    gitSemverTags.mockImplementation(cb => cb(null, []))

    const { changes } = await generateChangelog({ mode: 'init' })

    expect(changes).toHaveLength(1)
    expect(changes[0].groups).toHaveLength(1)
    expect(changes[0].groups[0].commits).toHaveLength(1)
    expect(changes[0].groups[0].commits[0]).toEqual(lipstickCommit)
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
