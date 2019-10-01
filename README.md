![gitmoji-changelog logo](https://raw.githubusercontent.com/frinyvonnick/gitmoji-changelog/master/misc/logo.png)

<p>
  <img src="https://img.shields.io/npm/v/gitmoji-changelog/alpha.svg" />
  <a href="https://github.com/frinyvonnick/gitmoji-changelog/blob/master/LICENSE">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" target="_blank" />
  </a>
  <a href="https://gitmoji.carloscuesta.me">
    <img src="https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg" alt="Gitmoji">
  </a>
  <a href="https://github.com/frinyvonnick/gitmoji-changelog">
    <img src="https://img.shields.io/badge/Changelog-gitmoji-brightgreen.svg" alt="gitmoji-changelog">
  </a>
  <a href="https://twitter.com/YvonnickFrin">
    <img alt="Twitter: YvonnickFrin" src="https://img.shields.io/twitter/follow/YvonnickFrin.svg?style=social" target="_blank" />
  </a>
</p>

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


## 🚀 Usage (with npx)

Make sure you have [npx](https://www.npmjs.com/package/npx) installed (`npx` is shipped by default since npm `5.2.0`)

Run the following command at the root of your project and answer questions:
```sh
npx gitmoji-changelog
```

## 🚀 Usage (with npm)

```sh
npm install -g gitmoji-changelog

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


## ✨ Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://yvonnickfrin.dev"><img src="https://avatars0.githubusercontent.com/u/13099512?v=4" width="100px;" alt="Yvonnick FRIN"/><br /><sub><b>Yvonnick FRIN</b></sub></a><br /><a href="https://github.com/frinyvonnick/gitmoji-changelog/commits?author=frinyvonnick" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/bpetetot"><img src="https://avatars3.githubusercontent.com/u/516360?v=4" width="100px;" alt="Benjamin Petetot"/><br /><sub><b>Benjamin Petetot</b></sub></a><br /><a href="https://github.com/frinyvonnick/gitmoji-changelog/commits?author=bpetetot" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/fabienjuif"><img src="https://avatars0.githubusercontent.com/u/17828231?v=4" width="100px;" alt="Fabien JUIF"/><br /><sub><b>Fabien JUIF</b></sub></a><br /><a href="https://github.com/frinyvonnick/gitmoji-changelog/commits?author=fabienjuif" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/bgauduch"><img src="https://avatars0.githubusercontent.com/u/5585755?v=4" width="100px;" alt="Baptiste Gauduchon"/><br /><sub><b>Baptiste Gauduchon</b></sub></a><br /><a href="https://github.com/frinyvonnick/gitmoji-changelog/commits?author=bgauduch" title="Code">💻</a></td>
    <td align="center"><a href="https://www.franck-abgrall.me/"><img src="https://avatars3.githubusercontent.com/u/9840435?v=4" width="100px;" alt="Franck Abgrall"/><br /><sub><b>Franck Abgrall</b></sub></a><br /><a href="https://github.com/frinyvonnick/gitmoji-changelog/commits?author=kefranabg" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/quentinncl"><img src="https://avatars0.githubusercontent.com/u/12430277?v=4" width="100px;" alt="quentinncl"/><br /><sub><b>quentinncl</b></sub></a><br /><a href="https://github.com/frinyvonnick/gitmoji-changelog/commits?author=quentinncl" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/lhauspie"><img src="https://avatars1.githubusercontent.com/u/25682509?v=4" width="100px;" alt="Logan HAUSPIE"/><br /><sub><b>Logan HAUSPIE</b></sub></a><br /><a href="https://github.com/frinyvonnick/gitmoji-changelog/commits?author=lhauspie" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://www.geekeries.fun"><img src="https://avatars3.githubusercontent.com/u/7294764?v=4" width="100px;" alt="Guillaume Membré"/><br /><sub><b>Guillaume Membré</b></sub></a><br /><a href="https://github.com/frinyvonnick/gitmoji-changelog/commits?author=gmembre-zenika" title="Code">💻</a></td>
    <td align="center"><a href="http://yann-bertrand.fr/"><img src="https://avatars0.githubusercontent.com/u/5855339?v=4" width="100px;" alt="Yann Bertrand"/><br /><sub><b>Yann Bertrand</b></sub></a><br /><a href="https://github.com/frinyvonnick/gitmoji-changelog/commits?author=yannbertrand" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/snikic"><img src="https://avatars3.githubusercontent.com/u/2975674?v=4" width="100px;" alt="s n"/><br /><sub><b>s n</b></sub></a><br /><a href="https://github.com/frinyvonnick/gitmoji-changelog/commits?author=snikic" title="Code">💻</a></td>
    <td align="center"><a href="https://mathieutu.dev"><img src="https://avatars3.githubusercontent.com/u/11351322?v=4" width="100px;" alt="Mathieu TUDISCO"/><br /><sub><b>Mathieu TUDISCO</b></sub></a><br /><a href="https://github.com/frinyvonnick/gitmoji-changelog/commits?author=mathieutu" title="Code">💻</a></td>
    <td align="center"><a href="http://charlyx.dev"><img src="https://avatars2.githubusercontent.com/u/481446?v=4" width="100px;" alt="Charles-Henri GUERIN"/><br /><sub><b>Charles-Henri GUERIN</b></sub></a><br /><a href="https://github.com/frinyvonnick/gitmoji-changelog/commits?author=charlyx" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/FBerthelot"><img src="https://avatars1.githubusercontent.com/u/6927852?v=4" width="100px;" alt="Florent Berthelot"/><br /><sub><b>Florent Berthelot</b></sub></a><br /><a href="https://github.com/frinyvonnick/gitmoji-changelog/commits?author=FBerthelot" title="Code">💻</a></td>
    <td align="center"><a href="http://gillespie59.github.io/"><img src="https://avatars2.githubusercontent.com/u/555768?v=4" width="100px;" alt="Emmanuel DEMEY"/><br /><sub><b>Emmanuel DEMEY</b></sub></a><br /><a href="https://github.com/frinyvonnick/gitmoji-changelog/commits?author=EmmanuelDemey" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## 📝 License

Copyright © 2019 [Yvonnick FRIN (https://github.com/frinyvonnick)](https://github.com/frinyvonnick).<br />
This project is [MIT](https://github.com/frinyvonnick/gitmoji-changelog/blob/master/LICENSE) licensed.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
