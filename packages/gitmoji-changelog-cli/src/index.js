#! /usr/bin/env node
import { changelog } from '@gitmoji-changelog/core'

export async function main() {
  try {
    await changelog()
  } catch (e) {
    console.error('Cannot find a git repository in current path.')
  }
}

main()
