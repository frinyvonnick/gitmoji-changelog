const pomParser = require('pom-parser')

module.exports = async () => {
  try {

    var opts = {
      filePath: "pom.xml",
    };
    const pomPromise = new Promise(function (resolve, reject) {
      pomParser.parse(opts, function(err, pomResponse) {
        if (err) {
          reject(err)
          return
        }

        resolve(pomResponse.pomObject)
      });
    })

    const { project : { groupid, artifactid, version, description } } = await pomPromise
    return {
      name: `${groupid}.${artifactid}`,
      version: version,
      description: description,
    }
  } catch (e) {
    return null
  }
}
