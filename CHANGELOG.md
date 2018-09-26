# Changelog

## next

### Added

- :white_check_mark: add gitlab and bitbucket tests ([0203483](https://github.com/frinyvonnick/gitmoji-changelog/commit/0203483f17111a30be879797c398bb87df86e9ab))
- :sparkles: Add autolink to issues and PRs in commit subject and body ([#17](https://github.com/frinyvonnick/gitmoji-changelog/issues/17)) ([43449fc](https://github.com/frinyvonnick/gitmoji-changelog/commit/43449fc628facf06fe453c8f940b7a0887372820))
- :sparkles: support commit url in changelog ([02c72b0](https://github.com/frinyvonnick/gitmoji-changelog/commit/02c72b0214a8b3219bc69969321de6ba0b663b26))
- :sparkles: Group commits by changelog types ([#11](https://github.com/frinyvonnick/gitmoji-changelog/issues/11)) ([7b8b49b](https://github.com/frinyvonnick/gitmoji-changelog/commit/7b8b49b366d3d51f0cc75f4ffb67efcd633cca16))
- :sparkles: Use handlebars templating to generate markdown ([#10](https://github.com/frinyvonnick/gitmoji-changelog/issues/10)) ([141d160](https://github.com/frinyvonnick/gitmoji-changelog/commit/141d1601fd1fa3b278db05acbc8f47e2bb239bbf))
- :sparkles: Generate changelog for the next release ([#8](https://github.com/frinyvonnick/gitmoji-changelog/issues/8)) ([2d783e4](https://github.com/frinyvonnick/gitmoji-changelog/commit/2d783e44e7d4b84a993237e27b95a5d27532426b))
- :sparkles: Implement format option ([#5](https://github.com/frinyvonnick/gitmoji-changelog/issues/5)) ([9b7287d](https://github.com/frinyvonnick/gitmoji-changelog/commit/9b7287d167637b7a02387cea135d1d7d44a90695))
- :sparkles: Convert changelog to markdown ([b165f69](https://github.com/frinyvonnick/gitmoji-changelog/commit/b165f695f4c1a49ff16a5f03918545bfb36cf367))
- :sparkles: Generate markdown first draft function ([10c6d3e](https://github.com/frinyvonnick/gitmoji-changelog/commit/10c6d3e20b82f5a0f6ce5cd372899e6519bc2412))
- :tada: Intialize markdown project ([a4a12bb](https://github.com/frinyvonnick/gitmoji-changelog/commit/a4a12bb4f7133e7e5e40436da4c884f135abf03d))
- :sparkles: Generate changelog JSON file ([86ca3ea](https://github.com/frinyvonnick/gitmoji-changelog/commit/86ca3eaefb18fd9c9b6bb4256ed2f6fa711aef59))
- :sparkles: Handle when no repository found ([c912efd](https://github.com/frinyvonnick/gitmoji-changelog/commit/c912efd73b9b286711d468ccb73bf1a03bd6f848))
- :tada: intialize cli project ([0b4f394](https://github.com/frinyvonnick/gitmoji-changelog/commit/0b4f39408e675f368c9562bd7645ac74abcd2293))
- :sparkles: implements changelog generation to json ([44e401d](https://github.com/frinyvonnick/gitmoji-changelog/commit/44e401db08cc828fcc8c19b027350ac9d310773e))
- :sparkles: add edge cases for commit parsing ([cb35644](https://github.com/frinyvonnick/gitmoji-changelog/commit/cb35644a640cfe3cb2c246345fe25202d814c436))
- :sparkles: Implements parse commit function ([195b594](https://github.com/frinyvonnick/gitmoji-changelog/commit/195b59431dde83a4cff26be5c3ab362d97a9604e))

### Changed

- :recycle: remove babel to use native node 10 ([#3](https://github.com/frinyvonnick/gitmoji-changelog/issues/3)) ([6edd0c4](https://github.com/frinyvonnick/gitmoji-changelog/commit/6edd0c48591e935f3bcd7e73d48733e623f779d9))
- :truck: move parse functions into parser.js ([e29f239](https://github.com/frinyvonnick/gitmoji-changelog/commit/e29f239dee8dc393caee9d320371e54a37eb90ae))
- :wrench: Fix main script in core module ([7f091a3](https://github.com/frinyvonnick/gitmoji-changelog/commit/7f091a3900605ee9bc44e793ddbb10a7272112fa))
- :wrench: Add build script ([efbc04d](https://github.com/frinyvonnick/gitmoji-changelog/commit/efbc04d902ac201b128a8e02692b778eff109b12))
- :wrench: Add lint ([9faf008](https://github.com/frinyvonnick/gitmoji-changelog/commit/9faf008d457d777afe0fa3443c34af510c1098fa))
- :wrench: Set up tests ([656c8bb](https://github.com/frinyvonnick/gitmoji-changelog/commit/656c8bbb506fc8f9064df1fc7aa64e2f1869751e))
- :wrench: Add package.json ([34c8f53](https://github.com/frinyvonnick/gitmoji-changelog/commit/34c8f53a58487a6368016de09989465cd2a96786))

### Removed

- :fire: remove parsing multiple commit ([73207b7](https://github.com/frinyvonnick/gitmoji-changelog/commit/73207b70d85ad2371def0ec9045e5a6ea46fee8c))

### Fixed

- :green_heart: Ignore node_modules in linter ([802c0f7](https://github.com/frinyvonnick/gitmoji-changelog/commit/802c0f7dc29508876c6b4d178bbcc8274ee308b5))
- :green_heart: Set up travis configuration ([dda9b28](https://github.com/frinyvonnick/gitmoji-changelog/commit/dda9b287989c1ca2e9513c4a5a4a3d1b6749e816))

### Miscellaneous

- :refactor: rename meta.repoInfo to meta.repository ([8f97208](https://github.com/frinyvonnick/gitmoji-changelog/commit/8f9720891e7a970a3dca1954ed4f0a570daaee05))
- :refactor: clean some code ([7af3086](https://github.com/frinyvonnick/gitmoji-changelog/commit/7af3086dfbc5d514434d990855d191ca81988bf1))
- :memo: Update roadmap ([02cec25](https://github.com/frinyvonnick/gitmoji-changelog/commit/02cec25ce329d68a02d1669913495108d93e2285))
- :memo: Add README.md ([c177349](https://github.com/frinyvonnick/gitmoji-changelog/commit/c177349386dfd87ab41c58f8a317b0962a511207))
- :package: Fix build ([a1526b3](https://github.com/frinyvonnick/gitmoji-changelog/commit/a1526b38e164b8471954e3dd0c658e10595ee966))
- :package: Build dist file ([acba6f7](https://github.com/frinyvonnick/gitmoji-changelog/commit/acba6f776196d8312c470ccefce8be81bafd8d52))
- Initial commit ([a60d98d](https://github.com/frinyvonnick/gitmoji-changelog/commit/a60d98def5bcbbef74a19db9e8f43af7a6ff6865))


