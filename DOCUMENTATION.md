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

