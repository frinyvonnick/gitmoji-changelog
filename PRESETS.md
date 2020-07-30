# Presets

`gitmoji-changelog` use presets to get project metadata useful for its smooth operation. Here is the list of available presets:

- node (default preset)
- generic
- maven

Didn't see the preset you need in the list? Consider adding it. Presets are stored in a [presets](packages/gitmoji-changelog-cli/src/presets) folder in the `cli` package.

## Existing presets

### Node

The node preset looks for a `package.json` file.

```json
{
  "name": "project-name",
  "version": "0.0.1",
  "description": "Some description",
}
```

### Generic

The generic preset looks a `gitmoji-changelogrc` file.

```json
{
  "project": {
    "name": "yvonnickfrin.dev",
    "description": "My blog",
    "version": "1.1.0"
  }
}
```

It must contain all mandatory properties in a `project` property. The `gitmoji-changelogrc` file can contain other configuration properties like a custom commit categorization.

### Maven

The maven preset looks for 4 properties in you `pom.xml`:

- groupid
- artifactid
- version
- description

## Add a preset

A preset need to export a function. When called this function must return three mandatory information about the project in which the cli has been called. The name of the project, a short description of it and its current version.

Let's dissect the `node` preset to see how it works. First of all the module must export a function. In case something went wrong return `null`. The cli will tell the user a problem occurred.

```js
module.exports = () => {
  return null
}
```

There is a package called `read-pkg-up` to get the first `package.json` in the parent folder structure. It returns its content as a JavaScript object. If we can't find a `package.json` or it is empty we return `null`.

```js
const readPkgUp = require('read-pkg-up')

module.exports = async () => {
  try {
    const packageInfo = await readPkgUp()

    if (!packageInfo.pkg) {
      throw Error('Empty package.json')
    }
  } catch (e) {
    return null
  }
}
```

If everything went fine we return the three mandatory information (name, description, version).

```js
const readPkgUp = require('read-pkg-up')

module.exports = async () => {
  try {
    const packageInfo = await readPkgUp()

    if (!packageInfo.pkg) {
      throw Error('Empty package.json')
    }

    return {
      name: packageInfo.pkg.name,
      description: packageInfo.pkg.description,
      version: packageInfo.pkg.version,
    }
  } catch (e) {
    return null
  }
}
```

That's it. Feel free to open an issue to ask for a new preset or open a pull request to add one.

All preset needs at least 3 pieces of informations to work:

- A project name
- A current version
- A description

They have their own way to get these.

