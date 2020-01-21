const express = require('express')
const path = require('path')
const os = require('os')
const fs = require('fs')
const childProcess = require('child_process')
const { removeSync } = require('fs-extra')
const simpleGit = require('simple-git/promise')
const cors = require('cors')

const app = express()
const port = process.env.PORT

app.use(cors())

app.get('/', async (req, res) => {
  const { repository } = req.query
  const tempDir = path.join(os.tmpdir(), 'gitmoji-changelog')
  if (fs.existsSync(tempDir)) removeSync(tempDir)
  fs.mkdirSync(tempDir)

  const simpleGitInstance = simpleGit(tempDir)

  await simpleGitInstance.clone(repository)

  const cwd = path.join(tempDir, repository.split('/').pop().slice(0, -4))
  childProcess.execSync(path.join(__dirname, '..', 'node_modules/.bin/gitmoji-changelog'), { cwd })

  const output = fs.readFileSync(path.join(cwd, 'CHANGELOG.md'))
  removeSync(tempDir)

  res.send(output.toString('utf8'))
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
