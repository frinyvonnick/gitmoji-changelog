const readPkgUp = require('read-pkg-up')

module.exports = async () => {
  try {
    const packageInfo = await readPkgUp()

    if (!packageInfo.packageJson) throw Error('Empty package.json')

    return {
      name: packageInfo.packageJson.name,
      version: packageInfo.packageJson.version,
      description: packageInfo.packageJson.description,
    }
  } catch (e) {
    return null
  }
}
