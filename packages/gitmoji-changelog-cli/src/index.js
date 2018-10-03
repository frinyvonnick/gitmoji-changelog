#! /usr/bin/env node

const yargs = require('yargs')
const { main } = require('./cli')
const { logger } = require('@gitmoji-changelog/core')

logger.start('gitmoji-changelog v0.1.1\n')

const args = yargs
  .option('format', {
    alias: 'f',
    default: 'markdown',
    description: 'changelog output format',
    choices: ['json', 'markdown'],
  })
  .parse()

main(args)
