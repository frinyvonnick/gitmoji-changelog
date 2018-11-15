const { generateChangelog, logger } = require('@gitmoji-changelog/core')
const { manifest } = require('libnpm')
const { main } = require('./cli')

describe('cli', () => {
  const realExitFunction = process.exit
  beforeEach(() => {
    process.exit = jest.fn(() => {})
    jest.clearAllMocks()
  })
  afterEach(() => {
    process.exit = realExitFunction
  })

  it('should throw an error if changelog generation fails', async () => {
    generateChangelog.mockRejectedValue(new Error())

    await main()()

    expect(logger.error).toHaveBeenCalled()
  })

  it('should call process.exit explicitly so promises are not waited for', async () => {
    await main()()

    expect(process.exit).toHaveBeenCalledTimes(1)
  })

  describe('version control', () => {
    const findOutdatedMessage = () => logger.warn.mock.calls.find(([message]) => message.includes('outdated'))

    it('should print a warning about a new version', async () => {
      manifest.mockReturnValueOnce(Promise.resolve({ version: '2.0.0' }))
      await main()()

      expect(findOutdatedMessage()).toBeTruthy()
    })

    it('should NOT print a warning about a new version', async () => {
      // older version in npm registry
      manifest.mockReturnValueOnce(Promise.resolve({ version: '0.5.0' }))
      await main()()

      // same version in npm registry
      manifest.mockReturnValueOnce(Promise.resolve({ version: '1.0.0' }))
      await main()()

      expect(manifest).toHaveBeenCalledTimes(2)
      expect(findOutdatedMessage()).toBeFalsy()
    })

    it('should NOT print a warning about a new version when request took to much time', async () => {
      manifest.mockImplementationOnce(() => new Promise((resolve) => { setTimeout(resolve, 1000, { version: '2.0.0' }) }))
      await main()()

      expect(findOutdatedMessage()).toBeFalsy()
    })

    it('should NOT print a warning about a new version when request is on error', async () => {
      manifest.mockReturnValueOnce(Promise.reject(new Error('faked error (manifest)')))
      await main()()

      expect(findOutdatedMessage()).toBeFalsy()
    })
  })
})

jest.mock('@gitmoji-changelog/core', () => ({
  generateChangelog: jest.fn(),
  logger: {
    start: jest.fn(),
    error: jest.fn(),
    success: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  },
}))

jest.mock('../package.json', () => ({
  version: '1.0.0',
}))

jest.mock('libnpm', () => ({
  manifest: jest.fn(),
}))
