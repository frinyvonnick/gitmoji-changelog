const toml = require('toml')
const fs = require('fs')

module.exports = async () => {
  try {
    const poetryPromise = new Promise((resolve, reject) => {
      try {
        resolve(toml.parse(fs.readFileSync('pyproject.toml', 'utf-8')))
      } catch (err) {
        reject(err)
      }
    })

    const poetryInfo = await poetryPromise
    return {
      name: poetryInfo.tool.poetry.name,
      version: poetryInfo.tool.poetry.version,
      description: poetryInfo.tool.poetry.description,
    }
  } catch (e) {
    return null
  }
}
