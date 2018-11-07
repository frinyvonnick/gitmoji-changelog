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
              lipstickCommit,
              secondLipstickCommit,
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

  it('should group similar commits', async () => {
    mockGroups()

    gitSemverTags.mockImplementation(cb => cb(null, ['v1.0.0']))

    const { changes } = await generateChangelog({ mode: 'init', groupSimilarCommits: true })

    expect(changes[0].groups[0].commits).toEqual([
      {
        ...lipstickCommit,
        siblings: [secondLipstickCommit],
      },
      recycleCommit,
      secondRecycleCommit,
    ])
  })

  it('should filter some commits out', async () => {
    gitRawCommits.mockReset()
    mockGroup([uselessCommit, lipstickCommit])

    gitSemverTags.mockImplementation(cb => cb(null, []))

    const { changes } = await generateChangelog({ mode: 'init' })

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

  describe('Handle prerelease versions like alpha, beta, rc...', () => {
    describe('For init mode', () => {
      it('should merge commits of previous prerelease if there is a matching release', async () => {
        mockGroup([sparklesCommit]) // v1.0.0-alpha
        mockGroup([recycleCommit]) // v1.0.0-beta
        mockGroup([lipstickCommit]) // v1.0.0
        mockGroup([]) // next version

        gitSemverTags.mockImplementation(cb => cb(null, ['v1.0.0-alpha', 'v1.0.0-beta', 'v1.0.0']))

        const { changes } = await generateChangelog({ mode: 'init', mergePrerelease: true })

        // the project has 3 tags (2 prerelease and 1 release)
        // output should only has 1, since 3rd one is the final release of the 2 other prereleases
        expect(changes).toHaveLength(1)
        expect(changes[0].version).toBe('1.0.0')
        // TODO check merged commits count
      })

      it('should not merge commits of previous prerelease if no matching release found', async () => {
        mockGroup([sparklesCommit]) // v1.0.0
        mockGroup([recycleCommit]) // v1.1.0-alpha
        mockGroup([lipstickCommit]) // v1.1.0-beta
        mockGroup([]) // next version

        gitSemverTags.mockImplementation(cb => cb(null, ['v1.0.0', 'v1.1.0-alpha', 'v1.1.0-beta']))

        const { changes } = await generateChangelog({ mode: 'init', mergePrerelease: true })

        // the project has 3 tags (1 release, 2 higher prereleases)
        // output should has 3, since the final release is not released yet
        expect(changes).toHaveLength(3)
        expect(changes[0].version).toBe('1.0.0')
        expect(changes[1].version).toBe('1.1.0-alpha')
        expect(changes[2].version).toBe('1.1.0-beta')
        // TODO check merged commits count
      })

      it('what should we do if an unexpected release was done after prereleases', async () => {
        mockGroup([sparklesCommit]) // v1.0.0-alpha
        mockGroup([recycleCommit]) // v1.0.0-beta
        mockGroup([lipstickCommit]) // v2.0.0
        mockGroup([]) // next version

        gitSemverTags.mockImplementation(cb => cb(null, ['v1.0.0-alpha', 'v1.0.0-beta', 'v2.0.0']))

        const { changes } = await generateChangelog({ mode: 'init', mergePrerelease: true })

        // the project has 3 tags (2 prerelease and 1 unexpected release)
        // What happens in that case ?
        //  expect(changes).toHaveLength(1) merged
        // or
        //  expect(changes).toHaveLength(3) not merged
        // I think the second one is better
      })
    })

    describe('For update mode', () => {
      it('should merge previous prerelease commits with the final release commits', async () => {
        mockGroup([sparklesCommit]) // v1.0.0-alpha
        mockGroup([recycleCommit]) // v1.0.0-beta
        mockGroup([lipstickCommit]) // v1.0.0

        gitSemverTags.mockImplementation(cb => cb(null, ['v1.0.0-alpha', 'v1.0.0-beta']))

        const { changes } = await generateChangelog({ mode: 'update', release: '1.0.0', mergePrerelease: true })

        // the project has 2 prerelease tags
        // output should has 1 release with commits of previous prerelease and the new one
        expect(changes).toHaveLength(1)
        expect(changes[0].version).toBe('1.0.0')
        // TODO check merged commits count
      })

      it('should not merge previous prerelease commits with the new prerelease commits', async () => {
        mockGroup([sparklesCommit]) // v1.0.0-alpha
        mockGroup([recycleCommit]) // v1.0.0-beta

        gitSemverTags.mockImplementation(cb => cb(null, ['v1.0.0-alpha']))

        const { changes } = await generateChangelog({ mode: 'update', release: '1.0.0-beta', mergePrerelease: true })

        // the project has already 1 prerelease tags
        // output should has 2 prerelease with commits
        expect(changes).toHaveLength(2)
        expect(changes[0].version).toBe('1.0.0-alpha')
        expect(changes[1].version).toBe('1.0.0-beta')
        // TODO check merged commits count
      })
    })
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

function mockGroups() {
  mockGroup([sparklesCommit])
  mockGroup([recycleCommit, secondRecycleCommit, lipstickCommit, secondLipstickCommit])
}
