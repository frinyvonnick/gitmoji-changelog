const { parseCommit } = require('./parser.js')

const sparklesCommit = {
  hash: 'c40ee8669ba7ea5151adc2942fa8a7fc98d9e23f',
  date: '2018-08-28T10:06:00+02:00',
  subject: ':sparkles: Upgrade brand new feature',
  body: 'Waouh this is awesome 2',
}


describe('commits parser', () => {
  it('should parse a single commit', () => {
    const {
      hash,
      date,
      subject,
      body,
    } = sparklesCommit
    const commit = `\n${hash}\n${date}\n${subject}\n${body}\n`

    expect(parseCommit(commit)).toEqual(expect.objectContaining(sparklesCommit))
  })

  it('should parse a single commit without a body', () => {
    const {
      hash,
      date,
      subject,
    } = sparklesCommit
    const commit = `\n${hash}\n${date}\n${subject}\n\n`

    expect(parseCommit(commit)).toEqual(expect.objectContaining({
      ...sparklesCommit,
      body: null,
    }))
  })

  it('should parse a single commit without a subject', () => {
    const {
      hash,
      date,
    } = sparklesCommit
    const commit = `\n${hash}\n${date}\n\n`

    expect(parseCommit(commit)).toEqual(expect.objectContaining({
      ...sparklesCommit,
      subject: null,
      body: null,
    }))
  })

  it('should add the group to a commit', () => {
    const {
      hash,
      date,
      subject,
      body,
    } = sparklesCommit
    const commit = `\n${hash}\n${date}\n${subject}\n${body}\n`

    expect(parseCommit(commit)).toEqual(expect.objectContaining({ group: 'added' }))
  })
})
