/* eslint-disable global-require */
const gitRawCommits = require('git-raw-commits')
const gitSemverTags = require('git-semver-tags')

const { generateChangelog } = require('./index')

const TAIL = ''
const HEAD = ''

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
  author: 'John Doe',
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
  author: 'John Doe',
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
  author: 'John Doe',
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
  author: 'John Doe',
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
  author: 'John Doe',
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
  it('should generate changelog for next release on init', async () => {
    mockGroup([sparklesCommit])

    gitSemverTags.mockImplementation(cb => cb(null, []))

    const { changes } = await generateChangelog(TAIL, 'next')

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

  it('should generate changelog using custom commit mapping', async () => {
    mockGroup([sparklesCommit, lipstickCommit])

    gitSemverTags.mockImplementation(cb => cb(null, []))

    const customConfiguration = {
      commitMapping: [
        { group: 'added', label: 'Added', emojis: ['sparkles'] },
        { group: 'style', label: 'Style', emojis: ['lipstick'] },
      ],
    }

    const { changes } = await generateChangelog(TAIL, 'next', { customConfiguration })

    expect(changes).toEqual([
      {
        version: 'next',
        groups: [
          {
            group: 'added',
            label: 'Added',
            commits: expect.arrayContaining([expect.objectContaining(sparklesCommit)]),
          },
          {
            group: 'style',
            label: 'Style',
            commits: expect.arrayContaining([expect.objectContaining({ ...lipstickCommit, group: 'style' })]),
          },
        ],
      },
    ])
  })

  it('should generate changelog for next release', async () => {
    mockGroup([sparklesCommit])

    gitSemverTags.mockImplementation(cb => cb(null, []))

    const { changes } = await generateChangelog('v1.0.0', 'next')

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
    mockGroup([recycleCommit, secondRecycleCommit, lipstickCommit, secondLipstickCommit])
    mockGroup([sparklesCommit])

    gitSemverTags.mockImplementation(cb => cb(null, ['v1.0.0']))

    const { changes } = await generateChangelog(TAIL, HEAD)

    expect(changes).toEqual([
      {
        version: 'next',
        groups: [
          {
            group: 'changed',
            label: 'Changed',
            commits: [
              expect.objectContaining({ subject: secondRecycleCommit.subject }),
              expect.objectContaining({ subject: secondLipstickCommit.subject }),
              expect.objectContaining({ subject: lipstickCommit.subject }),
              expect.objectContaining({ subject: recycleCommit.subject }),
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
            commits: [
              expect.objectContaining({ subject: sparklesCommit.subject }),
            ],
          },
        ],
      },
    ])
  })

  it('should generate a changelog with only next since lastVersion is provided to v1.0.0', async () => {
    mockGroup([recycleCommit, secondRecycleCommit, lipstickCommit, secondLipstickCommit])

    gitSemverTags.mockImplementation(cb => cb(null, ['v1.0.0']))

    const { changes } = await generateChangelog('v1.0.0', 'next')

    expect(changes).toEqual([
      {
        version: 'next',
        groups: [
          {
            group: 'changed',
            label: 'Changed',
            commits: [
              expect.objectContaining({ subject: secondRecycleCommit.subject }),
              expect.objectContaining({ subject: secondLipstickCommit.subject }),
              expect.objectContaining({ subject: lipstickCommit.subject }),
              expect.objectContaining({ subject: recycleCommit.subject }),
            ],
          },
        ],
      },
    ])
  })

  it('should group similar commits', async () => {
    mockGroup([])
    mockGroup([recycleCommit, secondRecycleCommit, lipstickCommit, secondLipstickCommit])

    gitSemverTags.mockImplementation(cb => cb(null, ['v1.0.0']))

    const { changes } = await generateChangelog(TAIL, HEAD, { groupSimilarCommits: true })

    expect(changes[0].groups[0].commits).toEqual([
      secondRecycleCommit,
      {
        ...lipstickCommit,
        siblings: [secondLipstickCommit],
      },
      recycleCommit,
    ])
  })

  it('should filter some commits out', async () => {
    gitRawCommits.mockReset()
    mockGroup([uselessCommit, lipstickCommit])

    gitSemverTags.mockImplementation(cb => cb(null, []))

    const { changes } = await generateChangelog(TAIL, HEAD)

    expect(changes).toEqual([
      expect.objectContaining({
        groups: [
          expect.objectContaining({
            commits: [lipstickCommit],
          }),
        ],
      }),
    ])
  })

  it('should throw an error if no commits', async () => {
    mockNoCommits()

    gitSemverTags.mockImplementation(cb => cb(null, []))

    let message = false
    try {
      await generateChangelog('v1.0.0', 'next')
    } catch (e) {
      message = e.message
    }
    expect(message).toBeTruthy()
  })

  it('should get previous tag in from', async () => {
    mockGroup([])
    mockGroup([])
    mockGroup([])

    gitSemverTags.mockImplementation(cb => cb(null, ['v1.0.1', 'v1.0.0']))

    await generateChangelog(TAIL, HEAD)

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

    const { changes } = await generateChangelog(TAIL, HEAD)

    // inputs has 4 group (4 versions)
    // but output should only has 3, since the 3rd is empty
    expect(changes).toHaveLength(3)
  })

  it('should sort commits by date', async () => {
    mockGroup([
      { date: '2019-02-02T00:00:00+00:00', body: '3' },
      { date: '2019-02-01T01:01:00+00:00', body: '7' },
      { date: '2019-02-03T00:00:00+00:00', body: '2' },
      { date: '2019-02-04T00:00:00+00:00', body: '1' },
      { date: '2019-02-01T01:01:01+01:01', body: '4' },
      { date: '2019-02-01T00:00:00+00:00', body: '9' },
      { date: '2019-02-01T01:01:01+01:00', body: '5' },
      { date: '2019-02-01T01:00:00+00:00', body: '8' },
      { date: '2019-02-01T01:01:01+00:00', body: '6' },
    ])

    gitSemverTags.mockImplementation(cb => cb(null, []))

    const { changes } = await generateChangelog(TAIL, HEAD)

    expect(changes[0].groups[0].commits.map(({ date, body }) => ({ date, body })))
      .toEqual([
        { date: '2019-02-04T00:00:00+00:00', body: '1' },
        { date: '2019-02-03T00:00:00+00:00', body: '2' },
        { date: '2019-02-02T00:00:00+00:00', body: '3' },
        { date: '2019-02-01T01:01:01+01:01', body: '4' },
        { date: '2019-02-01T01:01:01+01:00', body: '5' },
        { date: '2019-02-01T01:01:01+00:00', body: '6' },
        { date: '2019-02-01T01:01:00+00:00', body: '7' },
        { date: '2019-02-01T01:00:00+00:00', body: '8' },
        { date: '2019-02-01T00:00:00+00:00', body: '9' },
      ])
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
        hash, author, date, subject, body,
      } = commit
      readable.push(`\n${hash}\n${author}\n${date}\n${subject}\n${body}\n`)
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
