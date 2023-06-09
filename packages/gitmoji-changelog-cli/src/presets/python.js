const toml = require('toml')
const fs = require('fs')

module.exports = async () => {
  try {
    const pyprojectPromise = new Promise((resolve, reject) => {
      try {
        resolve(toml.parse(fs.readFileSync('pyproject.toml', 'utf-8')))
      } catch (err) {
        reject(err)
      }
    })

    const projectFile = await pyprojectPromise
    const name = recursiveKeySearch('name', projectFile)[0]
    const version = recursiveKeySearch('version', projectFile)[0]
    let description = recursiveKeySearch('description', projectFile)[0]

    if (!name) {
      throw new Error('Could not find name metadata in pyproject.toml')
    }
    if (!version) {
      throw new Error('Could not find version metadata in pyproject.toml')
    }
    if (!description) {
      description = ''
    }

    return {
      name,
      version,
      description,
    }
  } catch (e) {
    return null
  }
}


function recursiveKeySearch(key, data) {
  // https://codereview.stackexchange.com/a/143914
  if (data === null) {
    return []
  }

  if (data !== Object(data)) {
    return []
  }

  let results = []

  if (data.constructor === Array) {
    for (let i = 0, len = data.length; i < len; i += 1) {
      results = results.concat(recursiveKeySearch(key, data[i]))
    }
    return results
  }

  for (let i = 0; i < Object.keys(data).length; i += 1) {
    const dataKey = Object.keys(data)[i]
    if (key === dataKey) {
      results.push(data[key])
    }
    results = results.concat(recursiveKeySearch(key, data[dataKey]))
  }

  return results
}
