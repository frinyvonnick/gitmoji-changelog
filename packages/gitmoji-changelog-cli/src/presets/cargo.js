const toml = require('toml')
const fs = require('fs')

function configFromPackage(tomlEntry) {
  let config = {
    name: tomlEntry.name,
    version: tomlEntry.version,
    description: tomlEntry.description,
  }

  if (!config.name) {
    throw new Error('Could not find name metadata in Cargo.toml')
  }
  if (!config.version) {
    throw new Error('Could not find version metadata in Cargo.toml')
  }
  if (!config.description) {
    config.description = ''
  }

  return config
}

module.exports = async () => {
  try {
    const cargoPromise = new Promise((resolve, reject) => {
      try {
        resolve(toml.parse(fs.readFileSync('Cargo.toml', 'utf-8')))
      } catch (err) {
        reject(err)
      }
    })

    let cargoToml = await cargoPromise
    if (!cargoToml) {
      throw new Error('Cargo.toml is empty')
    }

    // Check if the package section exists, it means it's a Cargo.toml file
    if (cargoToml.package) {
      return configFromPackage(cargoToml.package)
    } if (cargoToml.workspace) {
      const workspace = cargoToml.workspace
      if (!workspace.package) {
        throw new Error("Cargo.toml workspace doesn't have a package section")
      }
      return configFromPackage(workspace.package)
    }
    throw Error("Cargo.toml doesn't have a package or workspace section")
  } catch (e) {
    return null
  }
}
