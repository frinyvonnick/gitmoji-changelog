# Develop and contribute

## Setup

```sh
git clone git@github.com:frinyvonnick/gitmoji-changelog.git

cd gitmoji-changelog && yarn
```

We are using lerna and yarn workspaces to split the library in modules:
- [gitmoji-changelog-cli](https://github.com/frinyvonnick/gitmoji-changelog/tree/master/packages/gitmoji-changelog-cli) - the full-featured command line interface
- [gitmoji-changelog-core](https://github.com/frinyvonnick/gitmoji-changelog/tree/master/packages/gitmoji-changelog-core) - the core lib generating changelog
- [gitmoji-changelog-markdown](https://github.com/frinyvonnick/gitmoji-changelog/tree/master/packages/gitmoji-changelog-markdown) - the markdown changelog file writer

## Usage locally

```sh
node [path-to-gitmoji-changelog-folder]/packages/gitmoji-changelog-cli/src/index.js
```

## Run unit tests

```sh
yarn test
# or
yarn test --watch
```

## Run e2e tests

```sh
yarn test:e2e
```

## Run linter

We are using [airbnb-base](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base) as linter:

```sh
yarn lint
```


