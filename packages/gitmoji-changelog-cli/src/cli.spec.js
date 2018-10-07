const { generateChangelog, logger } = require('@gitmoji-changelog/core')
const { main } = require('./cli')

console.error = jest.fn()

describe('cli', () => {
  it('should throw an error if changelog generation fails', async () => {
    generateChangelog.mockImplementationOnce(() => {
      throw new Error()
    })

    logger.error = jest.fn()

    await main()

    expect(logger.error).toHaveBeenCalled()
  })
})

jest.mock('@gitmoji-changelog/core', () => ({
  generateChangelog: jest.fn(),
  logger: {
    error: jest.fn(),
    success: jest.fn(),
    info: jest.fn(),
  },
}))
