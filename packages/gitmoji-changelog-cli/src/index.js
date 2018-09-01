#! /usr/bin/env node

const fs = require('fs')
const { changelog } = require('@gitmoji-changelog/core')
const { convert } = require('@gitmoji-changelog/markdown')

async function main() {
  try {
    const changes = await changelog()
    fs.writeFileSync('./CHANGELOG.md', convert(changes))
  } catch (e) {
    console.error('Cannot find a git repository in current path.')
  }
}

main()

module.exports = {
  main,
}
