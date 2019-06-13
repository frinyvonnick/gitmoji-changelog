# gitmoji-changelog

> Generate changelog for repositories using [gitmoji](https://gitmoji.carloscuesta.me/) commits convention.

**Prerequisites:**
- use [gitmoji](https://gitmoji.carloscuesta.me/) for commits convention
- use [semver](https://semver.org/) for versions and tags convention

## [2.0](https://github.com/frinyvonnick/gitmoji-changelog/milestone/2) is in alpha :tada:

gitmoji-changelog 2.0 in a nutshell:
- ✨ Add interactive option to manually select commits ([#81](https://github.com/frinyvonnick/gitmoji-changelog/issues/81)) [[d13ca2e](https://github.com/frinyvonnick/gitmoji-changelog/commit/d13ca2e1c77c3cd9694cde926442c303adb47fa3)]
- 🐛 Use last version from changelog file instead of previous git tag ([#82](https://github.com/frinyvonnick/gitmoji-changelog/issues/82)) [[d3c49d0](https://github.com/frinyvonnick/gitmoji-changelog/commit/d3c49d061cfbe2c271f9aa3739fae750dbf6327c)]
- 🐛 Fix dates sorting in commits ([#75](https://github.com/frinyvonnick/gitmoji-changelog/issues/75)) [[748e673](https://github.com/frinyvonnick/gitmoji-changelog/commit/748e6732a18f8bc5c529db12a558c0ffb458c8a1)]

Test it:

```shell
npm install -g gitmoji-changelog@alpha
```

## Quick start

```bash
npm install -g gitmoji-changelog

cd my-project

gitmoji-changelog
```

If `CHANGELOG.md` file doesn't exist, it will generate all previous changelog based on semver tags of your repo.

If `CHANGELOG.md` file already exists, _this will not overwrite any previous changelog_, it will generate a changelog based on commits since the last semver tag that match.

All available commands and parameters can be listed using: `gitmoji-changelog --help`

**Here an example output:** [CHANGELOG.md](https://github.com/frinyvonnick/gitmoji-changelog/blob/master/CHANGELOG.md)

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

## Customize your changelog

By default when you generate your changelog with `gitmoji-changelog`, the following mapping is used to group commits :
> [groupMapping.js](packages/gitmoji-changelog-core/src/groupMapping.js).

*// TODO: How to override the default mapping with it's own.*

## Usage

### CLI

Full CLI documentation in [gitmoji-changelog-cli package](https://github.com/frinyvonnick/gitmoji-changelog/tree/master/packages/gitmoji-changelog-cli#gitmoji-changelog-cli)

### API

Full API documentation in [gitmoji-changelog-core package](https://github.com/frinyvonnick/gitmoji-changelog/tree/master/packages/gitmoji-changelog-core#gitmoji-changelog-core)

## Develop and contribute

### Setup

```bash
git clone git@github.com:frinyvonnick/gitmoji-changelog.git

cd gitmoji-changelog && yarn
```

We are using lerna and yarn workspaces to split the library in modules:
- [gitmoji-changelog-cli](https://github.com/frinyvonnick/gitmoji-changelog/tree/master/packages/gitmoji-changelog-cli) - the full-featured command line interface
- [gitmoji-changelog-core](https://github.com/frinyvonnick/gitmoji-changelog/tree/master/packages/gitmoji-changelog-core) - the core lib generating changelog
- [gitmoji-changelog-markdown](https://github.com/frinyvonnick/gitmoji-changelog/tree/master/packages/gitmoji-changelog-markdown) - the markdown changelog file writer

**Execute it locally:**

```
node [path-to-gitmoji-changelog-folder]/packages/gitmoji-changelog-cli/src/index.js
```

**Execute tests:**

We are using [jest](https://jestjs.io/) to manage unit testing.

```bash
yarn test
# or
yarn test --watch
```

**Execute linter:**

We are using [airbnb-base](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base) as linter:

```bash
yarn lint
```
