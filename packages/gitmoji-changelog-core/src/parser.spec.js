const { getMergedGroupMapping, parseCommit } = require('./parser.js')

const sparklesCommit = {
  hash: 'c40ee8669ba7ea5151adc2942fa8a7fc98d9e23f',
  author: 'John Doe',
  date: '2018-08-28T10:06:00+02:00',
  subject: ':sparkles: Upgrade brand new feature',
  body: 'Waouh this is awesome 2',
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
    const {
      hash,
      author,
      date,
      subject,
      body,
    } = sparklesCommit
    const commit = `\n${hash}\n${author}\n${date}\n${subject}\n${body}\n`

    expect(parseCommit(commit)).toEqual(expect.objectContaining(sparklesCommit))
  })

  it('should parse a unicode emoji', () => {
    const {
      hash,
      author,
      date,
      body,
    } = sparklesCommit
    const commit = `\n${hash}\n${author}\n${date}\n✨ Upgrade brand new feature\n${body}\n`
    const parsed = parseCommit(commit)
    expect(parsed.emoji).toEqual('✨')
    expect(parsed.emojiCode).toEqual('sparkles')
    expect(parsed.message).toEqual('Upgrade brand new feature')
  })

  it('should parse a single commit without a body', () => {
    const {
      hash,
      author,
      date,
      subject,
    } = sparklesCommit
    const commit = `\n${hash}\n${author}\n${date}\n${subject}\n\n`

    expect(parseCommit(commit)).toEqual(expect.objectContaining({
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
    const commit = `\n${hash}\n${author}\n${date}\n\n`

    expect(parseCommit(commit)).toEqual(expect.objectContaining({
      ...sparklesCommit,
      subject: '',
      body: '',
    }))
  })

  it('should add the group to a commit', () => {
    const {
      hash,
      author,
      date,
      subject,
      body,
    } = sparklesCommit
    const commit = `\n${hash}\n${author}\n${date}\n${subject}\n${body}\n`

    expect(parseCommit(commit)).toEqual(expect.objectContaining({ group: 'added' }))
  })

  it('should handle custom commit mapping', () => {
    const {
      hash,
      author,
      date,
      subject,
      body,
    } = sparklesCommit
    const commit = `\n${hash}\n${author}\n${date}\n${subject}\n${body}\n`
    const customCommitMapping = [
      { group: 'added', emojis: [] },
      { group: 'custom', emojis: ['sparkles'] },
    ]

    expect(parseCommit(commit, customCommitMapping)).toEqual(expect.objectContaining({ group: 'custom' }))
  })
})
