#! /usr/bin/env node
import fs from 'fs'
import { changelog } from '@gitmoji-changelog/core'

export async function main() {
  try {
    const changes = await changelog()
    fs.writeFileSync('./CHANGELOG.json', changes)
  } catch (e) {
    console.error('Cannot find a git repository in current path.')
  }
}

main()
