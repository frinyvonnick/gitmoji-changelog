const readPkgUp = require('read-pkg-up')

const { loadProjectInfo } = require('./node.js')

describe('getPackageInfo', () => {
  it('should extract github repo info from package.json', async () => {
    readPkgUp.mockImplementationOnce(() => Promise.resolve({
      pkg: {
        name: 'gitmoji-changelog',
        version: '0.0.1',
        description: 'Gitmoji Changelog CLI',
      },
    }))

    const result = await loadProjectInfo()

    expect(result).toEqual({
      name: 'gitmoji-changelog',
      version: '0.0.1',
      description: 'Gitmoji Changelog CLI',
    })
  })
})

jest.mock('read-pkg-up')
