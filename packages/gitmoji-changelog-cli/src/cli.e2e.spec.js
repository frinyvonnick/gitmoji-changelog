const os = require('os')
const fs = require('fs')
const { removeSync } = require('fs-extra')
const path = require('path')
const simpleGit = require('simple-git/promise')
const util = require('util')
const execFile = util.promisify(require('child_process').execFile)

expect.extend({
  includes(str, items) {
    const pass = items.every(item => str.includes(item))
    return {
      pass,
      message: () => pass ? '' : '',
    }
  },
})

describe('generate changelog', () => {
  let testDir
  let repo

  beforeAll(async () => {
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

  afterAll(() => {
    removeSync(testDir)
  })

  it('should generate changelog even if user doesn\'t call cli at each tag', async () => {
    await newVersion('1.0.0')
    await gitmojiChangelog()

    expect(getChangelog()).toMatch(/1.0.0/)

    await newVersion('1.0.1')
    await newVersion('1.0.2')
    await gitmojiChangelog()

    expect(getChangelog()).includes(['1.0.0', '1.0.1', '1.0.2'])
  })

  async function newVersion(version) {
    fs.writeFileSync(path.join(testDir, version))
    bumpVersion(version)
    await repo.add('.')
    await repo.commit(`Commit ${version}`)
    await repo.addTag(`v${version}`)
  }

  function gitmojiChangelog() {
    return execFile('node', [path.join(__dirname, 'index.js')], { cwd: testDir })
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
