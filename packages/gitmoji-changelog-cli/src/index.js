#! /usr/bin/env node
const fs = require('fs')
const yargs = require('yargs')
const { noop } = require('lodash')

const { homepage } = require('../package.json')
const { main } = require('./cli')

function getOutputFile({ output, format }) {
  if (output) {
    return output
  }
  if (format === 'json') {
    return './CHANGELOG.json'
  }
  return './CHANGELOG.md'
}

yargs
  .usage('Usage: $0 <command> [options]')
  .command('$0 [release]', 'Generate changelog', (command) => {
    command.positional('release', {
      desc: 'Next version (from-package, next)',
      default: 'from-package',
    })
  }, (argv) => {
    const output = getOutputFile(argv)
    const existsOuput = fs.existsSync(output)
    main({
      ...argv,
      mode: existsOuput ? 'update' : 'init',
      output,
    })
  })
  .command('init', 'Initialize changelog from tags', noop, (argv) => {
    main({
      ...argv,
      mode: 'init',
      output: getOutputFile(argv),
    })
  })
  .command('update [release]', 'Update changelog with a new version', (command) => {
    command.positional('release', {
      desc: 'Next version (from-package, next)',
      default: 'from-package',
    })
  }, (argv) => {
    main({
      ...argv,
      mode: 'update',
      output: getOutputFile(argv),
    })
  })
  .option('format', {
    default: 'markdown',
    desc: 'changelog format (markdown, json)',
  })
  .option('output', {
    desc: 'output changelog file',
  })
  .help('help')
  .epilog(`For more information visit: ${homepage}`)
  .parse()
