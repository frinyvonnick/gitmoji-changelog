const fs = require('fs')

const loadProjectInfo = require('./python.js')

describe('getPackageInfo', () => {
  it('should extract info from a pyproject.toml made by poetry', async () =>{
    // Note the TOML section is distinct for poetry
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

  it('should extract info from the PEP621 example pyproject.toml', async () =>{
    // [project] is the usual TOML section for the metadata 
    fs.readFileSync.mockReturnValue(`
      [project]
      name = "spam"
      version = "2020.0.0"
      description = "Lovely Spam! Wonderful Spam!"
      readme = "README.rst"
      requires-python = ">=3.8"
      license = {file = "LICENSE.txt"}
      keywords = ["egg", "bacon", "sausage", "tomatoes", "Lobster Thermidor"]
      authors = [
        {email = "hi@pradyunsg.me"},
        {name = "Tzu-Ping Chung"}
      ]
      maintainers = [
        {name = "Brett Cannon", email = "brett@python.org"}
      ]
      classifiers = [
        "Development Status :: 4 - Beta",
        "Programming Language :: Python"
      ]
      
      dependencies = [
        "httpx",
        "gidgethub[httpx]>4.0.0",
        "django>2.1; os_name != 'nt'",
        "django>2.0; os_name == 'nt'"
      ]
      
      [project.optional-dependencies]
      test = [
        "pytest < 5.0.0",
        "pytest-cov[all]"
      ]
      
      [project.urls]
      homepage = "example.com"
      documentation = "readthedocs.org"
      repository = "github.com"
      changelog = "github.com/me/spam/blob/master/CHANGELOG.md"
      
      [project.scripts]
      spam-cli = "spam:main_cli"
      
      [project.gui-scripts]
      spam-gui = "spam:main_gui"
      
      [project.entry-points."spam.magical"]
      tomatoes = "spam:main_tomatoes"
    `)

    const result = await loadProjectInfo()

    expect(result).toEqual({
      name: 'spam',
      version: '2020.0.0',
      description: 'Lovely Spam! Wonderful Spam!',
    })
  })
})


jest.mock('fs')