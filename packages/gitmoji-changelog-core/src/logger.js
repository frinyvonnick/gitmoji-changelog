const { Signale } = require('signale')

const options = {
  disabled: false,
  interactive: false,
  stream: process.stdout,
}

const signale = new Signale(options)

module.exports = signale
