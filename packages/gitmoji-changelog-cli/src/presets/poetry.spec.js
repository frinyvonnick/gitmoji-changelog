const fs = require('fs')

const loadProjectInfo = require('./poetry.js')

describe('getPackageInfo', () => {
  it('should extract info from pyproject.toml', async () =>{
    fs.readFileSync.mockReturnValue(`
      [tool.poetry]
      name = "poetry-package-name"
      version = "0.1.0"
      description = "Description of the poetry package"
    `)

    const result = await loadProjectInfo()

    expect(result).toEqual({
      name: 'poetry-package-name',
      version: '0.1.0',
      description: 'Description of the poetry package',
    })
  })
})


jest.mock('fs')
