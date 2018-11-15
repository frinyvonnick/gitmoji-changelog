#! /usr/bin/env node
const yargs = require('yargs')
const { noop } = require('lodash')

const { homepage } = require('../package.json')
const { main } = require('./cli')

yargs
  .usage('Usage: $0 <command> [options]')

  .command('$0 [release]', 'Generate changelog', (command) => {
    command.positional('release', {
      desc: 'Next release version',
      default: 'next',
    })
  }, options => main({ options })())

  .option('from', { desc: 'previous tag' })
  .option('to', { desc: 'next tag', default: 'HEAD' })  
  .option('format', { desc: 'changelog format (markdown, json)', default: 'markdown'})
  .option('output', { desc: 'output changelog file' })
  .option('group-similar-commits', { desc: '[⚗️  - beta] try to group similar commits', default: false })
  .option('author', { desc: 'add the author in changelog lines', default: false })

  .help('help')
  .epilog(`For more information visit: ${homepage}`)
  .parse()
