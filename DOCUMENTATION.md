# Documentation

## Usage

Make sure you have [npx](https://www.npmjs.com/package/npx) installed (`npx` is shipped by default since npm `5.2.0`)

Run the following command at the root of your project and answer questions.

with npx:
```sh
npx gitmoji-changelog
```

with npm:
```sh
npm install -g gitmoji-changelog

cd my-project
gitmoji-changelog
```

## Behavior

If `CHANGELOG.md` file doesn't exist, it will generate all previous changelog based on semver tags of your repo.

If `CHANGELOG.md` file already exists, _this will not overwrite any previous changelog_, it will generate a changelog based on commits since the last semver tag that match.

All available commands and parameters can be listed using: `gitmoji-changelog --help`

**Here an example output:** [CHANGELOG.md](https://github.com/frinyvonnick/gitmoji-changelog/blob/master/CHANGELOG.md)

_By default when you generate your changelog with `gitmoji-changelog`, the following mapping is used to group commits: [groupMapping.js](packages/gitmoji-changelog-core/src/groupMapping.js)_

## Workflow

Here the recommended workflow to generate your changelog file using `gitmoji-changelog`:

**Important:** Before generating, be sure to have all tags locally (e.g. `git fetch origin`)

1. Make changes and commit: `git commit -m ":sparkles: my awesome feature"`
2. Bump version (ex: `1.0.0`) in `package.json` using [semver](https://semver.org/) convention
3. Run `gitmoji-changelog`, then the file `CHANGELOG.md` is created or updated with all changes
4. You can freely edit the new release in the changelog file, it will not be overwrite with the next generation
5. Commit `package.json` and `CHANGELOG.md` file
6. Tag your release: `git tag -a v1.0.0 -m "v1.0.0"` (or create a Github release)
7. Push to the remote `git push`

## Presets 

`gitmoji-changelog` use presets to get project meta data useful for its smooth operation. Here is the list of available presets:

- node (default preset)

You didn't the preset you need in the list? Consider adding it. Presets are stored in a [presets](packages/gitmoji-changelog-cli/presets) folder in the `cli` package.

### Add a preset

A preset need to export a function. When called this function must return three mandatory information about the project in which the cli has been called. The name of the project, a short description of it and its current version.

Let's dissect the `node` preset to see how it works. First of all the module must export a function. In case something went wrong return `null`. The cli will tell the user a problem occured.

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
