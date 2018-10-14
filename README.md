# gitmoji-changelog

> Generate changelog for repositories using [gitmoji](https://gitmoji.carloscuesta.me/) commits convention.

:construction: **PROJECT IN DEVELOPMENT - NOT PUBLISHED IN NODE REGISTRY YET** :construction:

**Prerequisites:**
- use [gitmoji](https://gitmoji.carloscuesta.me/) for commits convention
- use [semver](https://semver.org/) for versions and tags convention

## Quick start

```bash
npm install -g gitmoji-changelog
cd my-project
gitmoji-changelog
```

If `CHANGELOG.md` file doesn't exist, it will generate all previous changelog based on semver tags of your repo.

If `CHANGELOG.md` file already exists yhis will not overwrite any previous changelog. It will generate a changelog based on commits since the last semver tag that match.

All available commands and parameters can be listed using CLI: `gitmoji-changelog --help`

**Here an example output:** [CHANGELOG.md](https://github.com/frinyvonnick/gitmoji-changelog/blob/master/CHANGELOG.md)

## Workflow

Here the recommended workflow to generate your changelog file using `gitmoji-changelog`:

1. Make changes and commit: `git commit -m ":sparkles: my awesome feature"`
2. Bump version (ex: `1.0.0`) in `package.json` using [semver](https://semver.org/) convention
3. Run `gitmoji-changelog`, then the file `CHANGELOG.md` is created or updated with all changes
4. Commit `package.json` and `CHANGELOG.md` file
5. Push it to the remote (optional)
6. Tag your release: `git tag -a v1.0.0 -m "v1.0.0"` (or create a github release)

## Customize your changelog

By default when a commit is done with a gitmoji, the following mapping is used to group commits :
> [mapping.js](packages/gitmoji-changelog-core/src/mapping.js).

*// TODO: override the default mapping with it's own.*

## Usage

### CLI

*// TODO: explain CLI functions*

### API

*// TODO: explain API reference*

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

### Roadmap - Coming next

- [ ] CLI options (output file, from, to)
- [ ] Override mapping to customize changelog
- [ ] Improve markdown template: keep tags hierarchy (semver)
- [ ] Add a middleware system to have an advanced custom commits (#6)
- [ ] Generate Github, Bitbucket, Gitlab release with changelog
- [ ] Manage monorepo
- [ ] Manage scope
- [ ] Generate other file formats (ASCIIdoc...)
