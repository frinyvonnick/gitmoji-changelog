# gitmoji-changelog

## Description

This library generates changelog for repositories using [gitmoji](https://gitmoji.carloscuesta.me/) commits convention.

## Usage

**Prerequisites:**
- use [gitmoji](https://gitmoji.carloscuesta.me/) for commits convention
- use [semver](https://semver.org/) for versions convention

**Workflow:**
1. Make changes and commit
  ```
  git commit . -m ":sparkles: my awesome feature"
  ```
2. Bump version in package.json
3. Run `gitmoji-changelog`
4. Commit `package.json` and `changelog` files
5. Tag and push

### CLI

```bash
gitmoji-changelog
```

### API

**// TODO**

## Setup

Install the lib in your PATH : 

```bash
npm install -g gitmoji-changelog
```

## Mapping

When a commit is done with a gitmoji, the following mapping is used to group them : 

| Categorie | Gitmoji |
|---|---|
| Added | :sparkles: :tada: :white_check_mark: :bookmark: :construction_worker: :charts_with_upwards_trend: :heavy_plus_sign: :loud_sound: |
| Changed | :art: :zap: :lipstick: :rotating_light: :arrow_down: :arrow_up: :pushpin: :recycle: :wrench: :rewind: :alien: :truck: :boom: :bento: :wheelchair: :speech_ballon: :card_file_box: :children_crossing: :building_construction: :iphone: |
| Removed | :fire: :heavy_minus_sign: :mute: |
| Fixed | :bug: :ambulance: :apple: :penguin: :checkered_flag: :robot: :green_apple: :green_heart: :pencil2: |
| Security | :lock: |


> See [mapping.js](packages/gitmoji-changelog-core/src/mapping.js) for more details

## Roadmap

### MVP

**Core:**
- [x] Transform raw commits in json structure
- [x] Write changelog file
- [x] Generate changelog for the next release
- [x] Add templating system for changelog in markdown (#7)
- [ ] Sort commits by emojis type and date (order defined in mapping file)
- [ ] Add tag's date on version

**Templating:**
- [x] Group commits by changelog types (#2)
- [ ] Improve markdown template: use emojis in changelog type headings
- [ ] Improve markdown template: keep tags hierarchy (semver)
- [ ] Support Github commit links

### Coming next

- [ ] Handle incremental writing of changelog files
- [ ] Generate changelog between two tags
- [ ] CLI options (output file, from, to)
- [ ] Add a middleware system to custom commits organization (#6)
- [ ] Support Bitbucket, Gitlab, ... commit links
- [ ] Generate Github release with changelog
- [ ] Generate Bitbucket, Gitlab, ... relase with changelog
- [ ] Manage monorepo (package.json path option in cli)
- [ ] Manage scope (middleware ?)
- [ ] Generate other file formats (ASCIIdoc...)
