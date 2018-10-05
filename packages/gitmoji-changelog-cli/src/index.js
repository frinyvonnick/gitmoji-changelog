#! /usr/bin/env node

const yargs = require('yargs')
const { logger } = require('@gitmoji-changelog/core')

const { version } = require('../package.json')
const { main } = require('./cli')

logger.start(`gitmoji-changelog v${version}`)

const args = yargs
  .option('mode', {
    alias: 'm',
    default: 'init',
    description: 'build from scratch or incremental changelog',
    choices: ['init', 'incremental'],
  })
  .option('release', {
    alias: 'r',
    default: 'from-package',
    description: 'next release version for the changelog from package.json or next release',
    choices: ['from-package', 'next'],
  })
  .option('format', {
    alias: 'f',
    default: 'markdown',
    description: 'changelog output format',
    choices: ['json', 'markdown'],
  })
  .parse()

main(args)
