#! /usr/bin/env node
const fs = require('fs')
const yargs = require('yargs')
const { noop } = require('lodash')

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

const execute = mode => argv => main({
  ...argv,
  mode,
  output: getOutputFile(argv),
})

yargs
  .usage('Usage: $0 [options]')

  .command('$0', 'Generate changelog', noop, (argv) => {
    const output = getOutputFile(argv)
    const existsOuput = fs.existsSync(output)
    const mode = existsOuput ? 'update' : 'init'
    execute(mode)(argv)
  })

  .option('release', { desc: 'Next release name', default: 'next' })
  .option('format', { desc: 'Output format', default: 'markdown', choices: ['markdown', 'json'] })
  .option('output', { desc: 'Output file name', default: 'CHANGELOG.md' })

  .help('help')
  .parse()
