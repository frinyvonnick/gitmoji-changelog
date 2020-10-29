const toml = require('toml')
const fs = require('fs')

module.exports = async () => {
  try {
    const cargoPromise = new Promise((resolve, reject) => {
      try {
        resolve(toml.parse(fs.readFileSync('Cargo.toml', 'utf-8')))
      } catch (err) {
        reject(err)
      }
    })

    const {
      package: {
        name,
        version,
        description,
      },
    } = await cargoPromise
    return {
      name: name,
      version: version,
      description: description,
    }
  } catch (e) {
    return null
  }
}
