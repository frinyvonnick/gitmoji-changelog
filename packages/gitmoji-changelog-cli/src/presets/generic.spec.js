const rc = require('rc')

const loadProjectInfo = require('./generic.js')

describe('getPackageInfo', () => {
  it('should extract github repo info from configuration file', async () => {
    rc.mockImplementationOnce(() => ({
      project: {
        name: 'gitmoji-changelog',
        version: '0.0.1',
        description: 'Gitmoji Changelog CLI',
      },
      configs: [],
    }))

    const result = await loadProjectInfo()

    expect(result).toEqual({
      name: 'gitmoji-changelog',
      version: '0.0.1',
      description: 'Gitmoji Changelog CLI',
    })
  })
})

jest.mock('rc')
