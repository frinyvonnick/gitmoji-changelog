const pomParser = require('pom-parser')

module.exports = async () => {
  try {
    const opts = {
      filePath: 'pom.xml',
    }
    const pomPromise = new Promise((resolve, reject) => {
      pomParser.parse(opts, (err, pomResponse) => {
        if (err) {
          reject(err)
          return
        }

        resolve(pomResponse.pomObject)
      })
    })

    const {
      project: {
        groupid, artifactid, version, description,
      },
    } = await pomPromise
    return {
      name: `${groupid}.${artifactid}`,
      version: version,
      description: description,
    }
  } catch (e) {
    return null
  }
}
