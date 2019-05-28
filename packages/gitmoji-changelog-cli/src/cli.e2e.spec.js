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
    execTest('git add .')
    execTest('git commit -m "Premier commit"')
    execTest('git tag v1.0.0')
    execTest(`node ${path.join(__dirname, 'index.js')}`)

    execTest('touch 2')
    execTest('git add .')
    execTest('git commit -m "Deuxième commit"')
    execTest('git tag v1.0.1')

    execTest('touch 3')
    execTest('git add .')
    execTest('git commit -m "Troisième commit"')
    execTest('git tag v1.0.2')
    execTest(`node ${path.join(__dirname, 'index.js')}`)

    expect(execSync(`cat ${path.join(testDir, 'CHANGELOG.md')}`).toString('utf8')).toMatch(/1.0.1/)
  })

  function execTest(command) {
    return execSync(`cd ${testDir} && ${command}`).toString('utf8')
  }
})
