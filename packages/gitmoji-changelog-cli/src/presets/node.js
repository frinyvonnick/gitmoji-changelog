const readPkgUp = require('read-pkg-up')

module.exports = async () => {
  try {
    const packageInfo = await readPkgUp()

    const packageJson = packageInfo.pkg || packageInfo.packageJson

    if (!packageJson) throw Error('Empty package.json')

    return {
      name: packageJson.name,
      version: packageJson.version,
      description: packageJson.description,
    }
  } catch (e) {
    return null
  }
}
