#! /usr/bin/env node
import fs from 'fs'
import { changelog } from '@gitmoji-changelog/core'
import { convert } from '@gitmoji-changelog/markdown'

export async function main() {
  try {
    const changes = await changelog()
    fs.writeFileSync('./CHANGELOG.md', convert(changes))
  } catch (e) {
    console.error('Cannot find a git repository in current path.')
  }
}

main()
