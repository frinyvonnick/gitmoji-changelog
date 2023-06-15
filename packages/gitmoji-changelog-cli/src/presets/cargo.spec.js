const fs = require('fs')

const loadProjectInfo = require('./cargo.js')

describe('getPackageInfo', () => {
  it('should extract metadata from a Cargo.toml that is a crate', async () => {
    // Reference content from https://doc.rust-lang.org/cargo/reference/manifest.html#the-package-section
    fs.readFileSync.mockReturnValue(`
      [package]
      name = "hello_world" # the name of the package
      version = "0.1.0"    # the current version, obeying semver
      authors = ["Alice <a@example.com>", "Bob <b@example.com>"]
      description = "A sample project"
    `)

    const result = await loadProjectInfo()

    expect(result).toEqual({
      name: 'hello_world',
      version: '0.1.0',
      description: 'A sample project',
    })
  })

  it('should extract metadata from a Cargo.toml with missing description', async () => {
    fs.readFileSync.mockReturnValue(`
      [package]
      name = "no-description" # the name of the package
      version = "0.0.1"    # the current version, obeying semver
    `)

    const result = await loadProjectInfo()

    expect(result).toEqual({
      name: 'no-description',
      version: '0.0.1',
      description: '',
    })
  })

  it('should extract metadata from a Cargo.toml that is a workspace', async () => {
    // Reference content from https://doc.rust-lang.org/cargo/reference/workspaces.html#the-package-table
    fs.readFileSync.mockReturnValue(`
      [workspace]
      members = ["bar"]

      [workspace.package]
      name = "hello_world"
      version = "1.2.3"
      authors = ["Nice Folks"]
      description = "A short description of my package"
      documentation = "https://example.com/bar"
    `)

    const result = await loadProjectInfo()

    expect(result).toEqual({
      name: 'hello_world',
      version: '1.2.3',
      description: 'A short description of my package',
    })
  })
})


jest.mock('fs')
