#! /usr/bin/env node

const yargs = require('yargs')
const { main } = require('./cli')

const args = yargs
  .option('format', {
    alias: 'f',
    default: 'markdown',
    description: 'changelog output format',
    choices: ['json', 'markdown'],
  })
  .parse()

main(args)
