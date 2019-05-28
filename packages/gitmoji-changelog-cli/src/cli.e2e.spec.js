const os = require('os')
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

describe('E2E Cli', () => {
  let testDir

  beforeAll(() => {
    testDir = path.join(os.tmpdir(), 'gitmoji-changelog')
    if (fs.existsSync(testDir)) execSync(`rm -rf ${testDir}`)
    fs.mkdirSync(testDir)
    execTest('git init')
    execTest(`cp ${path.join(__dirname, '..', '..', '..', 'misc', 'package.sample.json')} ${path.join(testDir, 'package.json')}`)
  })

  afterAll(() => {
    execSync(`rm -rf ${testDir}`)
  })

  it('failing test', () => {
    execTest('touch 1')
    bumpVersion('0.0.1', '1.0.0')
    execTest('git add .')
    execTest('git commit -m "Premier commit"')
    execTest('git tag v1.0.0')
    execTest(`node ${path.join(__dirname, 'index.js')}`)

    execTest('touch 2')
    bumpVersion('1.0.0', '1.0.1')
    execTest('git add .')
    execTest('git commit -m "Deuxième commit"')
    execTest('git tag v1.0.1')

    execTest('touch 3')
    bumpVersion('1.0.1', '1.0.2')
    execTest('git add .')
    execTest('git commit -m "Troisième commit"')
    execTest('git tag v1.0.2')
    gitmojiChangelog()

    expect(execSync(`cat ${path.join(testDir, 'CHANGELOG.md')}`).toString('utf8')).toMatch(/1.0.1/)
  })

  function execTest(command) {
    return execSync(`cd ${testDir} && ${command}`).toString('utf8')
  }

  function gitmojiChangelog() {
    return execTest(`node ${path.join(__dirname, 'index.js')}`)
  }

  function bumpVersion(from, to) {
    const pkg = path.join(testDir, 'package.json')
    const content = fs.readFileSync(pkg).toString('utf8')
    const updatedContent = content.replace(from, to)
    fs.writeFileSync(pkg, updatedContent)
  }
})
