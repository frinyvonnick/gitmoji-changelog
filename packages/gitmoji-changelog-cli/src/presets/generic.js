const rc = require('rc')

module.exports = () => {
  try {
    const customConfiguration = rc('gitmoji-changelog')
    if (!customConfiguration.configs) throw Error('Configuration not found')

    return customConfiguration.project
  } catch (e) {
    return null
  }
}
