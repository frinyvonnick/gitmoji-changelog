![gitmoji-changelog logo](https://raw.githubusercontent.com/frinyvonnick/gitmoji-changelog/master/misc/logo.png)

<p>
  <img src="https://img.shields.io/npm/v/gitmoji-changelog/alpha.svg" />
  <a href="https://github.com/frinyvonnick/gitmoji-changelog#readme">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" target="_blank" />
  </a>
  <a href="https://github.com/frinyvonnick/gitmoji-changelog/graphs/commit-activity">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" target="_blank" />
  </a>
  <a href="https://github.com/frinyvonnick/gitmoji-changelog/blob/master/LICENSE">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" target="_blank" />
  </a>
</p>
<p>
  <a href="https://twitter.com/YvonnickFrin">
    <img alt="Twitter: YvonnickFrin" src="https://img.shields.io/twitter/follow/YvonnickFrin.svg?style=social" target="_blank" />
  </a>
  <a href="https://gitmoji.carloscuesta.me">
    <img src="https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg" alt="Gitmoji">
  </a>
  <a href="https://github.com/frinyvonnick/gitmoji-changelog">
    <img src="https://img.shields.io/badge/Changelog-gitmoji-brightgreen.svg" alt="gitmoji-changelog">
  </a>
</p>

[![Docker Build Status](https://img.shields.io/docker/cloud/build/yvonnick/gitmoji-changelog.svg)](https://hub.docker.com/r/yvonnick/gitmoji-changelog/)
[![](https://images.microbadger.com/badges/image/yvonnick/gitmoji-changelog.svg)](https://microbadger.com/images/yvonnick/gitmoji-changelog)
[![Docker Pulls](https://img.shields.io/docker/pulls/yvonnick/gitmoji-changelog.svg)](https://hub.docker.com/r/yvonnick/gitmoji-changelog/)

> Generate changelog for repositories using [gitmoji](https://gitmoji.carloscuesta.me/) commits convention.

### 🏠 [Homepage](https://github.com/frinyvonnick/gitmoji-changelog#readme)

## [2.0](https://github.com/frinyvonnick/gitmoji-changelog/milestone/2) is in alpha :tada:

gitmoji-changelog 2.0 in a nutshell:
- ✨ Add interactive option to manually select commits ([#81](https://github.com/frinyvonnick/gitmoji-changelog/issues/81)) [[d13ca2e](https://github.com/frinyvonnick/gitmoji-changelog/commit/d13ca2e1c77c3cd9694cde926442c303adb47fa3)]
- 🐛 Use last version from changelog file instead of previous git tag ([#82](https://github.com/frinyvonnick/gitmoji-changelog/issues/82)) [[d3c49d0](https://github.com/frinyvonnick/gitmoji-changelog/commit/d3c49d061cfbe2c271f9aa3739fae750dbf6327c)]
- 🐛 Fix dates sorting in commits ([#75](https://github.com/frinyvonnick/gitmoji-changelog/issues/75)) [[748e673](https://github.com/frinyvonnick/gitmoji-changelog/commit/748e6732a18f8bc5c529db12a558c0ffb458c8a1)]

Test it:

```shell
npm install -g gitmoji-changelog@alpha
```

## Supported tags and respective Dockerfile links

* [yvonnick/gitmoji-changelog:latest](https://github.com/frinyvonnick/gitmoji-changelog/blob/master/Dockerfile)

## Install

```sh
npm install -g gitmoji-changelog
```

## Usage

```sh
cd my-project
gitmoji-changelog
```

![gitmoji-changelog usage example](https://raw.githubusercontent.com/frinyvonnick/gitmoji-changelog/master/misc/example.gif)

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

## Develop and contribute

### Setup

```sh
git clone git@github.com:frinyvonnick/gitmoji-changelog.git

cd gitmoji-changelog && yarn
```

We are using lerna and yarn workspaces to split the library in modules:
- [gitmoji-changelog-cli](https://github.com/frinyvonnick/gitmoji-changelog/tree/master/packages/gitmoji-changelog-cli) - the full-featured command line interface
- [gitmoji-changelog-core](https://github.com/frinyvonnick/gitmoji-changelog/tree/master/packages/gitmoji-changelog-core) - the core lib generating changelog
- [gitmoji-changelog-markdown](https://github.com/frinyvonnick/gitmoji-changelog/tree/master/packages/gitmoji-changelog-markdown) - the markdown changelog file writer

### Usage locally

```sh
node [path-to-gitmoji-changelog-folder]/packages/gitmoji-changelog-cli/src/index.js
```

### Run tests

```sh
yarn test
# or
yarn test --watch
```

### Run linter

We are using [airbnb-base](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base) as linter:

```sh
yarn lint
```

### Using Docker image

Launch `gitmoji-changelog` using the [official Docker image](https://hub.docker.com/r/yvonnick/gitmoji-changelog):
```sh
docker container run -it -v $(pwd):/app --rm yvonnick/gitmoji-changelog:latest
```

> `/app` is the directory where gitmoji-changelog expect your project in the container.

You can also build the image locally and use it directly:
```sh
# build the image:
docker image build -t yvonnick/gitmoji-changelog:dev .
# use it:
docker container run -it -v $(pwd):/app --rm yvonnick/gitmoji-changelog:dev
```

## Author

👤 **Yvonnick FRIN (https://github.com/frinyvonnick)**

* Twitter: [@YvonnickFrin](https://twitter.com/YvonnickFrin)
* Github: [@frinyvonnick](https://github.com/frinyvonnick)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/frinyvonnick/gitmoji-changelog/issues).

## Show your support

Give a ⭐️ if this project helped you!

You also can add a badge in the README.md of your repository to promote `gitmoji-changelog`. All you need is to copy/past the code below:

```markdown
[![gitmoji-changelog](https://img.shields.io/badge/Changelog-gitmoji-brightgreen.svg)](https://github.com/frinyvonnick/gitmoji-changelog)
```

It will add this badge:  [![gitmoji-changelog](https://img.shields.io/badge/Changelog-gitmoji-brightgreen.svg)](https://github.com/frinyvonnick/gitmoji-changelog)


## 📝 License

Copyright © 2019 [Yvonnick FRIN (https://github.com/frinyvonnick)](https://github.com/frinyvonnick).<br />
This project is [MIT](https://github.com/frinyvonnick/gitmoji-changelog/blob/master/LICENSE) licensed.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
