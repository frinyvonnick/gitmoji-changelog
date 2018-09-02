const { changelog } = require('@gitmoji-changelog/core')
const { main } = require('./cli')

console.error = jest.fn()

describe('cli', () => {
  it('should throw an error if not a git project', async () => {
    changelog.mockImplementationOnce(() => {
      throw new Error()
    })

    await main()

    expect(console.error).toHaveBeenCalledWith('Cannot find a git repository in current path.')
  })
})

jest.mock('@gitmoji-changelog/core', () => ({
  changelog: jest.fn(),
}))
