const { generateChangelog } = require('@gitmoji-changelog/core')
const { convert } = require('@gitmoji-changelog/markdown')
const fs = require('fs')

async function main({ format } = {}) {
  try {
    const changelog = await generateChangelog()

    switch (format) {
      case 'json':
        fs.writeFileSync('./CHANGELOG.json', JSON.stringify(changelog))
        break
      case 'markdown':
      default: {
        fs.writeFileSync('./CHANGELOG.md', convert(changelog))
      }
    }
  } catch (e) {
    console.error('Cannot find a git repository in current path.')
  }
}

module.exports = { main }
