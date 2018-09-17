# gitmoji-changelog

## Description

This library generates changelog for repositories using [gitmoji](https://gitmoji.carloscuesta.me/) commits convention.

## Usage

**Prerequisites:**
- use [gitmoji](https://gitmoji.carloscuesta.me/) for commits convention
- use [semver](https://semver.org/) for versions convention

**Workflow:**
1. Make changes and commit
2. Bump version in package.json
3. `gitmoji-changelog`
4. Commit package.json and changelog files
5. Tag and push

### CLI

```bash
gitmoji-changelog
```

### API

**// TODO**

## Roadmap

### MVP

**Core:**
- [x] Transform raw commits in json structure
- [x] Write changelog file
- [ ] Handle incremental writing of changelog files
- [ ] Generate changelog for the next release
- [ ] Add templating system for changelog in markdown (#7)

**Templating:**
- [ ] Group commits by changelog types (#2)
- [ ] Improve markdown template: use emojis in changelog type headings
- [ ] Improve markdown template: keep tags hierarchy (semver)
- [ ] Support Github commit links

### Coming next

- [ ] Generate changelog between two tags
- [ ] CLI options (output file, from, to)
- [ ] Add a middleware system to custom commits organization (#6)
- [ ] Support Bitbucket, Gitlab, ... commit links
- [ ] Generate Github release with changelog
- [ ] Generate Bitbucket, Gitlab, ... relase with changelog
- [ ] Manage monorepo (package.json path option in cli)
- [ ] Manage scope (middleware ?)
- [ ] Generate other file formats (ASCIIdoc...)
