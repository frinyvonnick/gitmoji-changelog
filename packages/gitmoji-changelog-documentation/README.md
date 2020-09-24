![gitmoji-changelog logo](https://raw.githubusercontent.com/frinyvonnick/gitmoji-changelog/master/misc/logo.png)

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

### Available commands

```sh
gitmoji-changelog [release]
gitmoji-changelog init
gitmoji-changelog update [release]
```

The first command listed above is the idiomatic usage of `gitmoji-changelog` (read the `How it works` for more information).

`release` argument is by default valued to `from-package`. It will retrieve the version from the selected `preset` (read `Presets` for more information). You can overwrite it with the tag you want to generate in the changelog.

### Options

| option                  | description                             | default value                      |
|-------------------------|-----------------------------------------|------------------------------------|
| --version               | display version                         |                                    |
| --format                | changelog format (markdown, json)       | markdown                           |
| --preset                | define preset mode                      | node                               |
| --output                | output file path                        | ./CHANGELOG.md or ./CHANGELOG.json |
| --group-similar-commits | [⚗️,- beta] try to group similar commits | false                              |
| --author                | add the author in changelog lines       | false                              |
| --interactive -i        | select commits manually                 | false                              |
| --help                  | display help                            |                                    |

### Example

**Here an example output:** [CHANGELOG.md](https://github.com/frinyvonnick/gitmoji-changelog/blob/master/CHANGELOG.md)

## How it works

### Behavior

`CHANGELOG.md` doesn't exist:

The CLI will generate all previous changelog based on semver tags of your repo.

`CHANGELOG.md` exists:

_All previous semvers tags remain unchanged_. The CLI will add each tag since the last semver tag found in the `CHANGELOG.md` file.

**By default when you generate your changelog with `gitmoji-changelog`, the following mapping is used to group commits: [groupMapping.js](packages/gitmoji-changelog-core/src/groupMapping.js)**

### Workflow

Here the recommended workflow to generate your changelog file using `gitmoji-changelog`:

**Important:** Before generating, be sure to have all tags locally (e.g. `git fetch origin`)

1. Make changes and commit: `git commit -m ":sparkles: my awesome feature"`
2. Bump version (ex: `1.0.0`) in `package.json` using [semver](https://semver.org/) convention
3. Run `gitmoji-changelog`, then the file `CHANGELOG.md` is created or updated with all changes
4. You can freely edit the new release in the changelog file, it will not be overwritten with the next generation
5. Commit `package.json` and `CHANGELOG.md` file
6. Tag your release: `git tag -a v1.0.0 -m "v1.0.0"` (or create a Github release)
7. Push to the remote `git push --follow-tags`

_This workflow is related to the `node` preset but can be adapted to your own technology._

## Presets

`gitmoji-changelog` use presets to get project metadata useful for its smooth operation. Here is the list of available presets:

- node (default preset)
- generic
- maven

Here is the [documentation](/PRESETS.md) about presets (how they works and how to create a new one).

## 🐳 Using Docker image

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

### Supported tags and respective Dockerfile links

* [yvonnick/gitmoji-changelog:latest](https://github.com/frinyvonnick/gitmoji-changelog/blob/master/Dockerfile)


## 🐥 Canary version

If you want to test the incoming release of gitmoji-changelog, you can use or install the canary version.
Be aware, it's a development in progress version, feel free to report any bugs plus give feedback.

with npx:
```sh
npx gitmoji-changelog@canary --version
```

with npm:
```sh
npm install -g gitmoji-changelog@canary
```

## 📝 License

Copyright © 2019 [Yvonnick FRIN (https://github.com/frinyvonnick)](https://github.com/frinyvonnick).<br />
This project is [MIT](https://github.com/frinyvonnick/gitmoji-changelog/blob/master/LICENSE) licensed.
