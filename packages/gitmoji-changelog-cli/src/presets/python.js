const fs = require('fs')
const toml = require('smol-toml')
const ChildProcess = require('child_process')


class DynamicVersionError extends Error { }


module.exports = async (options = {}) => {
  try {
    const pyproject = toml.parse(fs.readFileSync('pyproject.toml', 'utf-8'))
    const meta = pyproject.project || (pyproject.tool && pyproject.tool.poetry)
    const dynamicFields = meta.dynamic || []

    const name = meta.name
    if (!name) {
      throw new Error('Could not find name metadata in pyproject.toml')
    }

    let version = meta.version
    const isDynamicVersion = dynamicFields.includes('version')
    if (isDynamicVersion) {
      if (options.versionCommand) {
        version = getDynamicVersion(options.versionCommand)
      } else {
        throw new DynamicVersionError(
          'Dynamic version detected. Please supply a command to obtain it, e.g.: \'gitmoji-changelog --preset python --version-command "python setup.py --version\'"'
        )
      }
    }
    if (!version) {
      throw new Error('Could not find version metadata (static or dynamic)')
    }

    let description = meta.description || ''
    const isDynamicDescription = dynamicFields.includes('description')
    if (isDynamicDescription) {
      let readme = meta.readme
      if (typeof readme === 'object') {
        readme = readme.file
      }

      description = getDescriptionFromReadme(readme) || ''
    }

    return {
      name,
      version,
      description,
    }
  } catch (e) {
    if (e instanceof DynamicVersionError) {
      throw e
    }

    return null
  }
}


function getDynamicVersion(command) {
  try {
    return ChildProcess.execSync(command, { encoding: 'utf-8' }).trim()
  } catch (e) {
    const { status, signal, stderr } = e
    const exitCode = (status !== null && status !== undefined) ? status : 'unknown'

    const details = [
      'Failed to retrieve package version with external command',
      `   cmd      : ${command}`,
      `   exit code: ${exitCode}${signal ? ` (signal: ${signal})` : ''}`,
    ]

    if (stderr && String(stderr).trim()) {
      details.push(`   stderr   : ${String(stderr).trim()}`)
    }

    throw new DynamicVersionError(details.join('\n'), { cause: e })
  }
}


function getDescriptionFromReadme(readmePath = 'README.md') {
  if (!fs.existsSync(readmePath)) {
    return ''
  }

  const content = fs.readFileSync(readmePath, 'utf-8').trim()

  const paragraphs = content.split(/\r?\n\r?\n/)
  const first = paragraphs.find(p => p.trim().length > 0)

  return first ? first.replace(/^#\s*/, '').trim() : null
}
