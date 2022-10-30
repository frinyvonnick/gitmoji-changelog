const { getMergedGroupMapping, parseCommit } = require('./parser.js')
const rc = require('rc')

const sparklesCommit = {
  hash: 'c40ee8669ba7ea5151adc2942fa8a7fc98d9e23f',
  author: 'John Doe',
  date: '2018-08-28T10:06:00+02:00',
  subject: ':sparkles: Upgrade brand new feature',
  body: 'Waouh this is awesome 2',
}

const sparklesCommitSkipClInSubject = {
  ...sparklesCommit,
  subject: ':sparkles: Upgrade brand new feature [skip cl]',
}

const sparklesCommitSkipClInBody = {
  ...sparklesCommit,
  body: 'Waouh this is awesome 2 [skip cl]',
}

const sparklesCommitSkipChangelogInSubject = {
  ...sparklesCommit,
  subject: ':sparkles: Upgrade brand new feature [skip changelog]',
}

const sparklesCommitSkipChangelogInBody = {
  ...sparklesCommit,
  body: 'Waouh this is awesome 2 [skip changelog]',
}

describe('group mapping', () => {
  it('should place miscellaneous category at the end', () => {
    const mergeGroupMapping = getMergedGroupMapping([
      { group: 'added', emojis: [] },
      { group: 'custom', emojis: ['sparkles'] },
    ])

    expect(mergeGroupMapping.pop()).toEqual(expect.objectContaining({ group: 'misc' }))
  })
})

describe('commits parser', () => {
  it('should parse a single commit', () => {
    expect(parseCommit(sparklesCommit)).toEqual(expect.objectContaining(sparklesCommit))
  })

  it('should parse a unicode emoji', () => {
    const parsed = parseCommit({
      ...sparklesCommit,
      subject: '✨ Upgrade brand new feature',
    })
    expect(parsed.emoji).toEqual('✨')
    expect(parsed.emojiCode).toEqual('sparkles')
    expect(parsed.message).toEqual('Upgrade brand new feature')
  })

  it('should parse a single commit without a body', () => {
    const parsed = parseCommit({
      ...sparklesCommit,
      body: '',
    })

    expect(parseCommit(parsed)).toEqual(expect.objectContaining({
      ...sparklesCommit,
      body: '',
    }))
  })

  it('should parse a single commit without a subject', () => {
    const {
      hash,
      author,
      date,
    } = sparklesCommit
    expect(parseCommit({
      hash,
      author,
      date,
    })).toEqual(expect.objectContaining({
      ...sparklesCommit,
      subject: '',
      body: '',
    }))
  })

  it('should add the group to a commit', () => {
    expect(parseCommit(sparklesCommit)).toEqual(expect.objectContaining({ group: 'added' }))
  })

  it('should handle custom commit mapping', () => {
    const customConfiguration = {
      commitMapping: [
        { group: 'added', emojis: [] },
        { group: 'custom', emojis: ['sparkles'] },
      ],
    }
    rc.mockImplementation(() => customConfiguration)

    expect(parseCommit(sparklesCommit)).toEqual(expect.objectContaining({ group: 'custom' }))
  })

  it('should handle skip cl in subject', () => {
    const customConfiguration = {
      useSkipChangelog: true,
    }
    rc.mockImplementation(() => customConfiguration)

    expect(parseCommit(sparklesCommitSkipClInSubject)).toEqual(expect.objectContaining({ group: 'useless' }))
  })

  it('should handle skip cl in body', () => {
    const customConfiguration = {
      useSkipChangelog: true,
    }
    rc.mockImplementation(() => customConfiguration)

    expect(parseCommit(sparklesCommitSkipClInBody)).toEqual(expect.objectContaining({ group: 'useless' }))
  })

  it('should handle skip changelog in subject', () => {
    const customConfiguration = {
      useSkipChangelog: true,
    }
    rc.mockImplementation(() => customConfiguration)

    expect(parseCommit(sparklesCommitSkipChangelogInSubject)).toEqual(expect.objectContaining({ group: 'useless' }))
  })

  it('should handle skip changelog in body', () => {
    const customConfiguration = {
      useSkipChangelog: true,
    }
    rc.mockImplementation(() => customConfiguration)

    expect(parseCommit(sparklesCommitSkipChangelogInBody)).toEqual(expect.objectContaining({ group: 'useless' }))
  })

  it('should handle disable skip changelog', () => {
    const customConfiguration = {
      useSkipChangelog: false,
    }
    rc.mockImplementation(() => customConfiguration)

    expect(parseCommit(sparklesCommitSkipChangelogInBody)).toEqual(expect.objectContaining({ group: 'added' }))
  })
})

jest.mock('rc')
