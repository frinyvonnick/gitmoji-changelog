const readPkgUp = require('read-pkg-up')

module.exports = async () => {
  try {
    const packageInfo = await readPkgUp()

    const data = packageInfo.pkg || packageInfo['package'] || packageInfo.packageJson;
    if (!data) throw Error('Empty package.json')

    return {
      name: data.name,
      version: data.version,
      description: data.description,
    }
  } catch (e) {
    return null
  }
}
