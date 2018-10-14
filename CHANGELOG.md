# Changelog

<a name="0.0.1"></a>
## 0.0.1 (2018-10-14)

### Added

- :sparkles: Implements parse commit function ([195b594](https://github.com/frinyvonnick/gitmoji-changelog/commit/195b59431dde83a4cff26be5c3ab362d97a9604e))
- :sparkles: add edge cases for commit parsing ([cb35644](https://github.com/frinyvonnick/gitmoji-changelog/commit/cb35644a640cfe3cb2c246345fe25202d814c436))
- :sparkles: implements changelog generation to json ([44e401d](https://github.com/frinyvonnick/gitmoji-changelog/commit/44e401db08cc828fcc8c19b027350ac9d310773e))
- :sparkles: Handle when no repository found ([c912efd](https://github.com/frinyvonnick/gitmoji-changelog/commit/c912efd73b9b286711d468ccb73bf1a03bd6f848))
- :sparkles: Generate changelog JSON file ([86ca3ea](https://github.com/frinyvonnick/gitmoji-changelog/commit/86ca3eaefb18fd9c9b6bb4256ed2f6fa711aef59))
- :sparkles: Generate markdown first draft function ([10c6d3e](https://github.com/frinyvonnick/gitmoji-changelog/commit/10c6d3e20b82f5a0f6ce5cd372899e6519bc2412))
- :sparkles: Convert changelog to markdown ([b165f69](https://github.com/frinyvonnick/gitmoji-changelog/commit/b165f695f4c1a49ff16a5f03918545bfb36cf367))
- :sparkles: Implement format option ([#5](https://github.com/frinyvonnick/gitmoji-changelog/issues/5)) ([9b7287d](https://github.com/frinyvonnick/gitmoji-changelog/commit/9b7287d167637b7a02387cea135d1d7d44a90695))
- :sparkles: Generate changelog for the next release ([#8](https://github.com/frinyvonnick/gitmoji-changelog/issues/8)) ([2d783e4](https://github.com/frinyvonnick/gitmoji-changelog/commit/2d783e44e7d4b84a993237e27b95a5d27532426b))
- :sparkles: Use handlebars templating to generate markdown ([#10](https://github.com/frinyvonnick/gitmoji-changelog/issues/10)) ([141d160](https://github.com/frinyvonnick/gitmoji-changelog/commit/141d1601fd1fa3b278db05acbc8f47e2bb239bbf))
- :sparkles: Group commits by changelog types ([#11](https://github.com/frinyvonnick/gitmoji-changelog/issues/11)) ([7b8b49b](https://github.com/frinyvonnick/gitmoji-changelog/commit/7b8b49b366d3d51f0cc75f4ffb67efcd633cca16))
- :sparkles: Support commit&#x27;s URL and issues autolink in changelog ([#16](https://github.com/frinyvonnick/gitmoji-changelog/issues/16)) ([871f164](https://github.com/frinyvonnick/gitmoji-changelog/commit/871f16499acee400863a94976e2520a4bdbc6cea))
- :sparkles: Add tag&#x27;s date on version ([#22](https://github.com/frinyvonnick/gitmoji-changelog/issues/22)) ([ab3d9c6](https://github.com/frinyvonnick/gitmoji-changelog/commit/ab3d9c600e307dd0db16bc7abcbdf8a8a2c83ff5))
- :sparkles: Add logger ([#21](https://github.com/frinyvonnick/gitmoji-changelog/issues/21)) ([93887ca](https://github.com/frinyvonnick/gitmoji-changelog/commit/93887ca1f2e59263a31b3b700507aa1e9853118c))
- :sparkles: write process to generate incremental markdown file ([f86030c](https://github.com/frinyvonnick/gitmoji-changelog/commit/f86030c2b43f71d709eae9920be53dcfa91d34a4))
- :sparkles: write incremental markdown ([2c148a6](https://github.com/frinyvonnick/gitmoji-changelog/commit/2c148a696eede21e2a35740bb25ac34db87e2371))
- :sparkles: add incremental markdown ([11b71e6](https://github.com/frinyvonnick/gitmoji-changelog/commit/11b71e686c563e3cbfdfbd4ad5d076c174c82c2a))
- :sparkles: order releases by reverse semver versions ([2df2bbf](https://github.com/frinyvonnick/gitmoji-changelog/commit/2df2bbffc5218a9eb1556be61a8a401f2cc74799))
- :sparkles: add cli commands to manage init and update ([0b20404](https://github.com/frinyvonnick/gitmoji-changelog/commit/0b20404c2d537b117f600376924e3fff4959ac50))
- :sparkles: Sort commits by emoji and date ([#24](https://github.com/frinyvonnick/gitmoji-changelog/issues/24)) ([08b2af3](https://github.com/frinyvonnick/gitmoji-changelog/commit/08b2af3241a13f6ebae9c24a3a51ef10b60f2879))
- :tada: intialize cli project ([0b4f394](https://github.com/frinyvonnick/gitmoji-changelog/commit/0b4f39408e675f368c9562bd7645ac74abcd2293))
- :tada: Intialize markdown project ([a4a12bb](https://github.com/frinyvonnick/gitmoji-changelog/commit/a4a12bb4f7133e7e5e40436da4c884f135abf03d))
- :white_check_mark: fix tests ([80425f9](https://github.com/frinyvonnick/gitmoji-changelog/commit/80425f9009ab6ffc5e738cb6270f38189f34f28b))
- :white_check_mark: add tests when no commits available ([90903c6](https://github.com/frinyvonnick/gitmoji-changelog/commit/90903c61233418aeb12515c11b7f269e85bc9afc))
- :white_check_mark: add (bad) test for incremental writing ([60a0340](https://github.com/frinyvonnick/gitmoji-changelog/commit/60a034027315884f33b30d803e67faab049629f7))

### Changed

- :lipstick: Update the documentation ([#19](https://github.com/frinyvonnick/gitmoji-changelog/issues/19)) ([2ae9819](https://github.com/frinyvonnick/gitmoji-changelog/commit/2ae98191c6cd221115162789188ea4ebdaf91c2f))
- :recycle: remove babel to use native node 10 ([#3](https://github.com/frinyvonnick/gitmoji-changelog/issues/3)) ([6edd0c4](https://github.com/frinyvonnick/gitmoji-changelog/commit/6edd0c48591e935f3bcd7e73d48733e623f779d9))
- :recycle: split functions to generate changelog ([2df5b8e](https://github.com/frinyvonnick/gitmoji-changelog/commit/2df5b8e229aabf59a1e06664326faaa73871bb86))
- :truck: move parse functions into parser.js ([e29f239](https://github.com/frinyvonnick/gitmoji-changelog/commit/e29f239dee8dc393caee9d320371e54a37eb90ae))
- :wrench: Add package.json ([34c8f53](https://github.com/frinyvonnick/gitmoji-changelog/commit/34c8f53a58487a6368016de09989465cd2a96786))
- :wrench: Set up tests ([656c8bb](https://github.com/frinyvonnick/gitmoji-changelog/commit/656c8bbb506fc8f9064df1fc7aa64e2f1869751e))
- :wrench: Add lint ([9faf008](https://github.com/frinyvonnick/gitmoji-changelog/commit/9faf008d457d777afe0fa3443c34af510c1098fa))
- :wrench: Add build script ([efbc04d](https://github.com/frinyvonnick/gitmoji-changelog/commit/efbc04d902ac201b128a8e02692b778eff109b12))
- :wrench: Fix main script in core module ([7f091a3](https://github.com/frinyvonnick/gitmoji-changelog/commit/7f091a3900605ee9bc44e793ddbb10a7272112fa))

### Removed

- :fire: remove parsing multiple commit ([73207b7](https://github.com/frinyvonnick/gitmoji-changelog/commit/73207b70d85ad2371def0ec9045e5a6ea46fee8c))

### Fixed

- :bug: Fix gitmoji mapping ([#20](https://github.com/frinyvonnick/gitmoji-changelog/issues/20)) ([9561914](https://github.com/frinyvonnick/gitmoji-changelog/commit/95619149e7ce7d26dcb4f1837a8c8bf351b1cb1c))
- :bug: set date for release except &#x27;next&#x27; ([1b970cb](https://github.com/frinyvonnick/gitmoji-changelog/commit/1b970cb79b397f27844b41a615372f263d220e33))
- :green_heart: Set up travis configuration ([dda9b28](https://github.com/frinyvonnick/gitmoji-changelog/commit/dda9b287989c1ca2e9513c4a5a4a3d1b6749e816))
- :green_heart: Ignore node_modules in linter ([802c0f7](https://github.com/frinyvonnick/gitmoji-changelog/commit/802c0f7dc29508876c6b4d178bbcc8274ee308b5))

### Miscellaneous

- :memo: Add README.md ([c177349](https://github.com/frinyvonnick/gitmoji-changelog/commit/c177349386dfd87ab41c58f8a317b0962a511207))
- :memo: Update roadmap ([02cec25](https://github.com/frinyvonnick/gitmoji-changelog/commit/02cec25ce329d68a02d1669913495108d93e2285))
- :memo: Update setup and usage parts ([42c5a65](https://github.com/frinyvonnick/gitmoji-changelog/commit/42c5a65daa3587d7260058a79de832a9037b6ccd))
- :memo: Update roadmap ([eea3814](https://github.com/frinyvonnick/gitmoji-changelog/commit/eea38147f18e5fd8eecbbcd055ce3473495a720a))
- :memo: update changelog ([86ccd51](https://github.com/frinyvonnick/gitmoji-changelog/commit/86ccd51322126db85e4b4181577504ce595e047a))
- :memo: update documentation ([ab81a29](https://github.com/frinyvonnick/gitmoji-changelog/commit/ab81a294dc069bf84461d174eed414d4c7e9671a))
- :memo: update readme ([759a384](https://github.com/frinyvonnick/gitmoji-changelog/commit/759a384f40b34a91c8649abd017815ee264b5139))
- :memo: update readme ([bc5b2d5](https://github.com/frinyvonnick/gitmoji-changelog/commit/bc5b2d51f42a99b56c613cc7d06525596b9d7a72))
- :memo: update workflow ([498d8f4](https://github.com/frinyvonnick/gitmoji-changelog/commit/498d8f4624bba225d33e74379a2171e8e7119bd2))
- :memo: add reference to package documentations ([fa79f1d](https://github.com/frinyvonnick/gitmoji-changelog/commit/fa79f1d4c2b790b1fe084db6c22e87f3978b2710))
- Merge remote-tracking branch &#x27;origin/master&#x27; into feat/init-and-update ([1847cf1](https://github.com/frinyvonnick/gitmoji-changelog/commit/1847cf1a2c2ee6256cd4c014cb8f109d53546a2c))
- :memo: add changelog edition in workflow ([2e68a78](https://github.com/frinyvonnick/gitmoji-changelog/commit/2e68a78152e62515924768b1049fd7731562a313))
- :package: Build dist file ([acba6f7](https://github.com/frinyvonnick/gitmoji-changelog/commit/acba6f776196d8312c470ccefce8be81bafd8d52))
- :package: Fix build ([a1526b3](https://github.com/frinyvonnick/gitmoji-changelog/commit/a1526b38e164b8471954e3dd0c658e10595ee966))
- Initial commit ([a60d98d](https://github.com/frinyvonnick/gitmoji-changelog/commit/a60d98def5bcbbef74a19db9e8f43af7a6ff6865))
- :ok_hand: pair prog with Y ([96df4a1](https://github.com/frinyvonnick/gitmoji-changelog/commit/96df4a16102358fd1d437220f171a942e78a37ab))


