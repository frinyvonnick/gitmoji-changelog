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
      message: () => pass ? 'It passes' : `Expected ${str} to includes ${items.join(', ')}`,
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

  describe('init', () => {
    it("should get a 1.0.0 version while initializing changelog by calling cli without arguments and having package.json's version set to 1.0.0", async () => {
      await makeChanges('file1')
      await commit(':sparkles: Add some file')
      await bumpVersion('1.0.0')
      gitmojiChangelog()
      await commit(':bookmark: Version 1.0.0')

      expect(getChangelog()).includes(['1.0.0'])
    })

    it("should get a 1.0.0 version while initializing changelog by calling cli with 1.0.0 and having package.json's version set to 0.0.1", async () => {
      await makeChanges('file1')
      await commit(':sparkles: Add some file')
      gitmojiChangelog('1.0.0')
      await commit(':bookmark: Version 1.0.0')

      expect(getChangelog()).includes(['1.0.0'])
    })
  })

  describe('update', () => {
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
  })

  async function makeChanges(fileName) {
    fs.writeFileSync(path.join(testDir, fileName))
  }

  async function commit(message) {
    await repo.add('.')
    await repo.commit(message)
  }

  async function tag(version) {
    await repo.addTag(`v${version}`)
  }

  function gitmojiChangelog(args = []) {
    return childProcess.execFileSync('node', [path.join(__dirname, 'index.js'), ...args], { cwd: testDir })
  }

  function getChangelog() {
    return fs.readFileSync(path.join(testDir, 'CHANGELOG.md')).toString('utf8')
  }

  function bumpVersion(to) {
    const pkg = path.join(testDir, 'package.json')
    // eslint-disable-next-line global-require
    const { version } = require(pkg)
    const content = fs.readFileSync(pkg).toString('utf8')
    const updatedContent = content.replace(version, to)
    fs.writeFileSync(pkg, updatedContent)
  }
})
