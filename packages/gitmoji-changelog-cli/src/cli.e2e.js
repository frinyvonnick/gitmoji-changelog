const os = require('os')
const fs = require('fs')
const { removeSync } = require('fs-extra')
const path = require('path')
const simpleGit = require('simple-git/promise')
const childProcess = require('child_process')

expect.extend({
  includes(str, items) {
    const pass = items.every(item => str.includes(item))
    return {
      pass,
      message: () => pass
        ? `Expected ${str} to not includes ${items.join(', ')}`
        : `Expected ${str} to includes ${items.join(', ')}`,
    }
  },
})

expect.extend({
  toDisplayError(str) {
    const pass = str.includes('Error')
    return {
      pass,
      message: () => pass ? 'It passes' : `Expected ${str} to includes Error`,
    }
  },
})

describe('generate changelog', () => {
  let testDir
  let repo

  beforeEach(async () => {
    testDir = path.join(os.tmpdir(), 'gitmoji-changelog')
    if (fs.existsSync(testDir)) removeSync(testDir)
    fs.mkdirSync(testDir)
    repo = simpleGit(testDir)
    await repo.init()
    fs.copyFileSync(
      path.join(__dirname, '..', '..', '..', 'misc', 'package.sample.json'),
      path.join(testDir, 'package.json'),
    )
  })

  afterEach(() => {
    removeSync(testDir)
  })

  describe('presets', () => {
    it("should throw an error if the requested preset doesn't exist", () => {
      const output = gitmojiChangelog(['--preset=unknown'])

      expect(output.toString('utf8')).includes(["The preset unknown doesn't exist"])
    })

    it('should throw an Error if the preset could not find configuration', () => {
      fs.unlinkSync(path.join(testDir, 'package.json'))

      const output = gitmojiChangelog()

      expect(output.toString('utf8')).includes(['Cannot retrieve configuration'])
    })

    it('should throw an Error if the preset did not return a version', () => {
      const pkg = path.join(testDir, 'package.json')
      // eslint-disable-next-line global-require
      const content = JSON.parse(fs.readFileSync(pkg).toString('utf8'))
      delete content.version
      fs.writeFileSync(pkg, JSON.stringify(content))

      const output = gitmojiChangelog()

      expect(output.toString('utf8')).includes(['Cannot retrieve the version from your configuration'])
    })
  })

  describe('init', () => {
    it("should get a 1.0.0 version while initializing changelog by calling cli without arguments and having package.json's version set to 1.0.0", async () => {
      await makeChanges('file1')
      await commit(':sparkles: Add some file')
      await bumpVersion('1.0.0')
      gitmojiChangelog()
      await commit(':bookmark: Version 1.0.0')

      expect(getChangelog()).includes(['1.0.0'])
    })

    it('should use a custom commit mapping to create commit categories', async () => {
      makeCustomConfig({
        commitMapping: [
          { group: 'style', label: 'Style', emojis: ['lipstick'] },
          { group: 'changed', label: 'Changed', emojis: [] },
        ],
      })
      await makeChanges('file1')
      await commit(':sparkles: Add some file')
      await makeChanges('file2')
      await commit(':lipstick: Add some style file')
      await bumpVersion('1.0.0')
      gitmojiChangelog()
      await commit(':bookmark: Version 1.0.0')

      expect(getChangelog()).includes(['### Style'])
      expect(getChangelog()).not.includes(['### Changed'])
    })

    it("should get a 1.0.0 version while initializing changelog by calling cli with 1.0.0 and having package.json's version set to 0.0.1", async () => {
      await makeChanges('file1')
      await commit(':sparkles: Add some file')
      gitmojiChangelog('1.0.0')
      await commit(':bookmark: Version 1.0.0')

      expect(getChangelog()).includes(['1.0.0'])
    })

    it("should get a next version while initializing changelog by calling cli without arguments and having package.json's version set to 1.0.0", async () => {
      await makeChanges('file1')
      await commit(':sparkles: Add some file')
      await bumpVersion('1.0.0')
      await commit(':bookmark: Version 1.0.0')
      await tag('1.0.0')

      await makeChanges('file2')
      await commit(':sparkles: Add another file')
      gitmojiChangelog()

      expect(getChangelog()).includes(['1.0.0', 'next'])
    })

    it("should get two versions 1.0.0 and 2.0.0 while initializing changelog by calling cli without and having package.json's version set to 1.0.0", async () => {
      await makeChanges('file1')
      await commit(':sparkles: Add some file')
      await bumpVersion('1.0.0')
      await commit(':bookmark: Version 1.0.0')
      await tag('1.0.0')

      await makeChanges('file2')
      await commit(':sparkles: Add another file')
      await bumpVersion('2.0.0')
      gitmojiChangelog()
      await commit(':bookmark: Version 2.0.0')

      expect(getChangelog()).includes(['1.0.0', '2.0.0'])
    })
  })

  describe('update', () => {
    it("should get a 1.0.0 version while initializing changelog by calling cli without arguments two times and having package.json's version set to 1.0.0", async () => {
      await bumpVersion('1.0.0')
      await makeChanges('file1')
      await commit(':sparkles: Add some file')
      gitmojiChangelog()
      await makeChanges('file2')
      await commit(':sparkles: Add a second file')
      gitmojiChangelog()

      expect(getChangelog()).includes(['second file'])
    })

    it('should use a custom commit mapping to create commit categories', async () => {
      makeCustomConfig({
        commitMapping: [
          { group: 'style', label: 'Style', emojis: ['lipstick'] },
          { group: 'changed', label: 'Changed', emojis: [] },
        ],
      })
      await bumpVersion('1.0.0')
      await makeChanges('file1')
      await commit(':sparkles: Add some file')
      await makeChanges('file3')
      await commit(':lipstick: Add some file')
      gitmojiChangelog()
      await makeChanges('file2')
      await commit(':sparkles: Add a second file')
      await makeChanges('file4')
      await commit(':lipstick: Add some file')
      gitmojiChangelog()

      expect(getChangelog()).includes(['### Style'])
      expect(getChangelog()).not.includes(['### Changed'])
    })

    it("should get two versions 1.0.0 and next while updating changelog by calling cli without arguments and having package.json's version set to 1.0.0", async () => {
      await makeChanges('file1')
      await commit(':sparkles: Add some file')
      await bumpVersion('1.0.0')
      gitmojiChangelog()
      await commit(':bookmark: Version 1.0.0')
      await tag('1.0.0')

      await makeChanges('file2')
      await commit(':sparkles: Add another file')
      gitmojiChangelog()

      expect(getChangelog()).includes(['1.0.0', 'next'])
    })
    it("should get two versions 1.0.0 and 2.0.0 while updating changelog by calling cli without arguments and having package.json's version set to 2.0.0", async () => {
      await makeChanges('file1')
      await commit(':sparkles: Add some file')
      await bumpVersion('1.0.0')
      gitmojiChangelog()
      await commit(':bookmark: Version 1.0.0')
      await tag('1.0.0')

      await makeChanges('file2')
      await commit(':sparkles: Add another file')
      await bumpVersion('2.0.0')
      gitmojiChangelog()

      expect(getChangelog()).includes(['1.0.0', '2.0.0'])
    })

    it('should get two versions 1.0.0 and 2.0.0 while updating changelog after tagging a version 2.0.0', async () => {
      await makeChanges('file1')
      await commit(':sparkles: Add some file')
      await bumpVersion('1.0.0')
      gitmojiChangelog()
      await commit(':bookmark: Version 1.0.0')
      await tag('1.0.0')

      await makeChanges('file2')
      await commit(':sparkles: Add another file')
      await bumpVersion('2.0.0')
      await tag('2.0.0')
      gitmojiChangelog()

      expect(getChangelog()).includes(['1.0.0', '2.0.0'])
    })

    it('should get two versions 1.0.0-alpha.1 and 1.0.0-alpha.2 while updating changelog after tagging a version 1.0.0-alpha.2', async () => {
      await makeChanges('file1')
      await commit(':sparkles: Add some file')
      await bumpVersion('1.0.0-alpha.1')
      gitmojiChangelog()
      await commit(':bookmark: Version 1.0.0-alpha.1')
      await tag('1.0.0-alpha.1')

      await makeChanges('file2')
      await commit(':sparkles: Add another file')
      await bumpVersion('1.0.0-alpha.2')
      await tag('1.0.0-alpha.2')
      gitmojiChangelog()

      expect(getChangelog()).includes(['1.0.0-alpha.1', '1.0.0-alpha.2'])
    })

    it("should get two versions 1.0.0 and 2.0.0 while updating changelog by calling cli with 2.0.0 and having package.json's version set to 1.0.0", async () => {
      await makeChanges('file1')
      await commit(':sparkles: Add some file')
      await bumpVersion('1.0.0')
      gitmojiChangelog()
      await commit(':bookmark: Version 1.0.0')
      await tag('1.0.0')

      await makeChanges('file2')
      await commit(':sparkles: Add another file')
      gitmojiChangelog('2.0.0')

      expect(getChangelog()).includes(['1.0.0', '2.0.0'])
    })
    it('should get three versions 1.0.0, 2.0.0, 3.0.0 while updating changelog by calling cli without arguments and skipping two tags creation 2.0.0 and 3.0.0', async () => {
      await makeChanges('file1')
      await commit(':sparkles: Add some file')
      await bumpVersion('1.0.0')
      gitmojiChangelog()
      await commit(':bookmark: Version 1.0.0')
      await tag('1.0.0')

      await makeChanges('file2')
      await commit(':sparkles: Add another file')
      await bumpVersion('2.0.0')
      await commit(':bookmark: Version 2.0.0')
      await tag('2.0.0')

      await makeChanges('file3')
      await commit(':sparkles: Add a third file')
      await bumpVersion('3.0.0')
      gitmojiChangelog()
      await commit(':bookmark: Version 3.0.0')
      await tag('3.0.0')

      expect(getChangelog()).includes(['1.0.0', '2.0.0', '3.0.0'])
    })

    it('should get three versions 1.0.0, 2.0.0, 3.0.0 and next while updating changelog by calling cli without arguments and skipping two tags creation 2.0.0 and 3.0.0', async () => {
      await makeChanges('file1')
      await commit(':sparkles: Add some file')
      await bumpVersion('1.0.0')
      gitmojiChangelog()
      await commit(':bookmark: Version 1.0.0')
      await tag('1.0.0')

      await makeChanges('file2')
      await commit(':sparkles: Add another file')
      await bumpVersion('2.0.0')
      await commit(':bookmark: Version 2.0.0')
      await tag('2.0.0')

      await makeChanges('file3')
      await commit(':sparkles: Add a third file')
      await bumpVersion('3.0.0')
      await commit(':bookmark: Version 3.0.0')
      await tag('3.0.0')

      await makeChanges('file4')
      await commit(':sparkles: Add a fourth file')
      gitmojiChangelog()

      expect(getChangelog()).includes(['1.0.0', '2.0.0', '3.0.0', 'next'])
    })

    it('should get two versions 1.0.0, 2.0.0 and next while updating changelog by calling cli without arguments', async () => {
      await makeChanges('file1')
      await commit(':sparkles: Add some file')
      await bumpVersion('1.0.0')
      gitmojiChangelog()
      await commit(':bookmark: Version 1.0.0')
      await tag('1.0.0')

      await makeChanges('file2')
      await commit(':sparkles: Add another file')
      await bumpVersion('2.0.0')
      gitmojiChangelog()
      await commit(':bookmark: Version 2.0.0')
      await tag('2.0.0')

      await makeChanges('file4')
      await commit(':sparkles: Add a fourth file')
      gitmojiChangelog()

      expect(getChangelog()).includes(['1.0.0', '2.0.0', 'next'])
    })

    it('shouldn\'t generate changelog when gimoji-changelog if there isn\'t any changes', async () => {
      await makeChanges('file1')
      await commit(':sparkles: Add some file')
      await bumpVersion('1.0.0')
      gitmojiChangelog()
      await commit(':bookmark: Version 1.0.0')
      await tag('1.0.0')
      const output = gitmojiChangelog()

      expect(getChangelog()).includes(['1.0.0'])
      expect(output.toString('utf8')).toDisplayError()
    })

    it('should get two versions 1.0.0 and next after two generation while updating changelog by calling cli without arguments', async () => {
      await makeChanges('file1')
      await commit(':sparkles: Add some file')
      await bumpVersion('1.0.0')
      gitmojiChangelog()
      await commit(':bookmark: Version 1.0.0')
      await tag('1.0.0')

      await makeChanges('file2')
      await commit(':sparkles: Add another file')
      gitmojiChangelog()

      await makeChanges('file4')
      await commit(':sparkles: Add a fourth file')
      gitmojiChangelog()

      expect(getChangelog()).includes(['1.0.0', 'next'])
    })

    it('should get two versions 1.0.0 and 1.1.0 after three generations while updating changelog by calling cli with version 1.1.0', async () => {
      await makeChanges('file1')
      await commit(':sparkles: Add some file')
      await bumpVersion('1.0.0')
      gitmojiChangelog()
      await commit(':bookmark: Version 1.0.0')
      await tag('1.0.0')

      await makeChanges('file2')
      await commit(':sparkles: Add another file')
      gitmojiChangelog()

      await makeChanges('file4')
      await commit(':sparkles: Add a fourth file')
      gitmojiChangelog('1.1.0')

      expect(getChangelog()).includes(['1.0.0', '1.1.0'])
    })

    it('should get two versions 1.0.0 and next after three generations while updating changelog by calling cli without arguments', async () => {
      await makeChanges('file1')
      await commit(':sparkles: Add some file')
      await bumpVersion('1.0.0')
      gitmojiChangelog()
      await commit(':bookmark: Version 1.0.0')
      await tag('1.0.0')

      await makeChanges('file2')
      await commit(':sparkles: Add another file')
      gitmojiChangelog('1.1.0')
      gitmojiChangelog()

      expect(getChangelog()).not.includes(['1.1.0'])
      expect(getChangelog()).includes(['1.0.0', 'next'])
    })

    it('should get two versions 1.0.0 and 1.2.0 after three generations while updating changelog by calling cli without arguments', async () => {
      await makeChanges('file1')
      await commit(':sparkles: Add some file')
      await bumpVersion('1.0.0')
      gitmojiChangelog()
      await commit(':bookmark: Version 1.0.0')
      await tag('1.0.0')

      await makeChanges('file2')
      await commit(':sparkles: Add another file')
      gitmojiChangelog('1.1.0')
      gitmojiChangelog('1.2.0')

      expect(getChangelog()).not.includes(['1.1.0'])
      expect(getChangelog()).includes(['1.0.0', '1.2.0'])
    })

    it('should display an error if requested version isn\'t semver', async () => {
      const output = gitmojiChangelog('awesomeversion')

      expect(output.toString('utf8')).toDisplayError()
    })
  })

  async function makeChanges(fileName) {
    fs.writeFileSync(path.join(testDir, fileName))
  }

  async function makeCustomConfig(config) {
    fs.writeFileSync(path.join(testDir, '.gitmoji-changelogrc'), JSON.stringify(config, undefined, 2))
  }

  async function commit(message) {
    await repo.add('.')
    await repo.commit(message)
  }

  async function tag(version) {
    await repo.addTag(`v${version}`)
  }

  function gitmojiChangelog(args = []) {
    if (!Array.isArray(args)) {
      // eslint-disable-next-line no-param-reassign
      args = [args]
    }
    return childProcess.execFileSync('node', [path.join(__dirname, 'index.js'), ...args], { cwd: testDir })
  }

  function getChangelog() {
    return fs.readFileSync(path.join(testDir, 'CHANGELOG.md')).toString('utf8')
  }

  function bumpVersion(to) {
    const pkg = path.join(testDir, 'package.json')
    // eslint-disable-next-line global-require
    const content = fs.readFileSync(pkg).toString('utf8')
    const { version } = JSON.parse(content)
    const updatedContent = content.replace(version, to)
    fs.writeFileSync(pkg, updatedContent)
  }

  /*
   * This function is useful to print cli ouput when debugging tests
   */
  // eslint-disable-next-line no-unused-vars
  function logOutput(ouput) {
    console.log(ouput.toString('utf8'))
  }
})
