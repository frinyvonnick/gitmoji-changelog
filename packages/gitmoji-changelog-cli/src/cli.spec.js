const { generateChangelog, logger } = require('@gitmoji-changelog/core')
const { main } = require('./cli')

describe('cli', () => {
  it('should throw an error if changelog generation fails', async () => {
    generateChangelog.mockRejectedValue(new Error())

    await main()

    expect(logger.error).toHaveBeenCalled()
  })
})

jest.mock('@gitmoji-changelog/core', () => ({
  generateChangelog: jest.fn(),
  logger: {
    start: jest.fn(),
    error: jest.fn(),
    success: jest.fn(),
    info: jest.fn(),
  },
}))
