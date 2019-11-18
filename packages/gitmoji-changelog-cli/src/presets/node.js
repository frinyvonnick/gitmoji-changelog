const readPkgUp = require('read-pkg-up')
const pkgUp = require('pkg-up')
const fs = require('fs')

module.exports = {
  loadProjectInfo: async () => {
    try {
      const packageInfo = await readPkgUp()

      if (!packageInfo.pkg) throw Error('Empty package.json')

      return {
        name: packageInfo.pkg.name,
        version: packageInfo.pkg.version,
        description: packageInfo.pkg.description,
      }
    } catch (e) {
      return null
    }
  },
  addChangelogScript: async () => {
    const targetPkgPath = await pkgUp()
    const targetPkg = JSON.parse(fs.readFileSync(targetPkgPath))
    targetPkg.scripts.changelog = 'npx gitmoji-changelog'
    fs.writeFileSync(targetPkgPath, JSON.stringify(targetPkg, undefined, 2))
  },
}
