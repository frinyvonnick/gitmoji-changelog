const yaml = require('yaml')
const fs = require('fs')

module.exports = async () => {
  try {
    const chartYamlPromise = new Promise((resolve, reject) => {
      try {
        resolve(yaml.parse(fs.readFileSync('Chart.yaml', 'utf-8')))
      } catch (err) {
        reject(err)
      }
    })

    const {
      name,
      version,
      description,
    } = await chartYamlPromise
    return {
      name: name,
      version: version,
      description: description,
    }
  } catch (e) {
    return null
  }
}
