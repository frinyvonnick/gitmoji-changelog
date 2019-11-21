# Changelog

<a name="0.0.1"></a>
## 0.0.1 (2019-11-19)

### Added

- 👷‍♂️ Add exact option to canary version ([#147](https://github.com/frinyvonnick/gitmoji-changelog/issues/147)) [[84c7086](https://github.com/frinyvonnick/gitmoji-changelog/commit/84c7086b94190d9259749262e997be8617e10345)] (by Benjamin Petetot)
- 👷‍♂️ Publish Canary version on master push ([#141](https://github.com/frinyvonnick/gitmoji-changelog/issues/141)) [[84ab6f1](https://github.com/frinyvonnick/gitmoji-changelog/commit/84ab6f17a40831ca780f3ce60420ac3268624918)] (by Benjamin Petetot)
- 👷‍♂️ Setup GitHub CI ([#140](https://github.com/frinyvonnick/gitmoji-changelog/issues/140)) [[a7f1228](https://github.com/frinyvonnick/gitmoji-changelog/commit/a7f1228ed313bbd507686e6cdcac5d9a5a8be46b)] (by Benjamin Petetot)

### Fixed

- 🐛 Fix bug preventing generating changelog when previous version doesn&#x27;t exist ([#145](https://github.com/frinyvonnick/gitmoji-changelog/issues/145)) [[4f04f45](https://github.com/frinyvonnick/gitmoji-changelog/commit/4f04f453af9c3fd82b388b082aa59b9a6f1d5374)] (by Yvonnick FRIN)

<a name="2.0.0"></a>
## 2.0.0 (2019-10-31)

### Added

- ✨ Add a presets system to be independent from the package.json ([#128](https://github.com/frinyvonnick/gitmoji-changelog/issues/128)) [[24cead9](https://github.com/frinyvonnick/gitmoji-changelog/commit/24cead964ef3e9c1b5b7df9d53bfe357298a9191)] (by Yvonnick FRIN)
- ✨ Add interactive option to manually select commits ([#81](https://github.com/frinyvonnick/gitmoji-changelog/issues/81)) [[d13ca2e](https://github.com/frinyvonnick/gitmoji-changelog/commit/d13ca2e1c77c3cd9694cde926442c303adb47fa3)] (by Franck Abgrall)

### Changed

- ♻️ Change core function parameters from &quot;mode&quot; to &quot;from&quot; and &quot;to&quot; ([#127](https://github.com/frinyvonnick/gitmoji-changelog/issues/127)) [[42af500](https://github.com/frinyvonnick/gitmoji-changelog/commit/42af500df1b9b9d738bf9d47674537b50dd90870)] (by Yvonnick FRIN)
- 🔧 Add editor config file ([#124](https://github.com/frinyvonnick/gitmoji-changelog/issues/124)) [[6c763a2](https://github.com/frinyvonnick/gitmoji-changelog/commit/6c763a2be93908232ffda7ca9d88499d38809c99)] (by quentinncl)

### Removed

- 🔥 Remove some badges [[6d27a32](https://github.com/frinyvonnick/gitmoji-changelog/commit/6d27a32b900a1d1462f39a92d09b5ab1407be25b)] (by Yvonnick FRIN)

### Fixed

- 🐛 Handle pre-release as latest version in markdown ([#126](https://github.com/frinyvonnick/gitmoji-changelog/issues/126)) [[d22699b](https://github.com/frinyvonnick/gitmoji-changelog/commit/d22699b6226cb03f634b22f65f0f825f980dc666)] (by Yvonnick FRIN)
- 🐛 Fix updating changelog after tagging a version ([#115](https://github.com/frinyvonnick/gitmoji-changelog/issues/115)) [[8df6705](https://github.com/frinyvonnick/gitmoji-changelog/commit/8df6705bc369bbec16cc2dc1ff08c0ae55c20da3)] (by Yvonnick FRIN)
- 🐛 Use last version from changelog file instead of previous git tag ([#82](https://github.com/frinyvonnick/gitmoji-changelog/issues/82)) [[d3c49d0](https://github.com/frinyvonnick/gitmoji-changelog/commit/d3c49d061cfbe2c271f9aa3739fae750dbf6327c)] (by Franck Abgrall)
- 🐛 Fix dates sorting in commits ([#75](https://github.com/frinyvonnick/gitmoji-changelog/issues/75)) [[748e673](https://github.com/frinyvonnick/gitmoji-changelog/commit/748e6732a18f8bc5c529db12a558c0ffb458c8a1)] (by Mathieu TUDISCO)

### Miscellaneous

- 📝 Add npx instruction on README ([#123](https://github.com/frinyvonnick/gitmoji-changelog/issues/123)) [[ffcbef5](https://github.com/frinyvonnick/gitmoji-changelog/commit/ffcbef55efd4558335f913d1c38411229a330a58)] (by quentinncl)
- 📝 Add contributors to README ([#125](https://github.com/frinyvonnick/gitmoji-changelog/issues/125)) [[7580ff9](https://github.com/frinyvonnick/gitmoji-changelog/commit/7580ff9c6598b92aa3375836ce0b568e8378c65f)] (by Franck Abgrall)
- 📝 Create CODE_OF_CONDUCT.md file [[51c1314](https://github.com/frinyvonnick/gitmoji-changelog/commit/51c1314fb0f6b2770bf2fdbdffc1912b8e06bbf7)] (by Yvonnick FRIN)
- 📝 Propose to add badge to our users ([#103](https://github.com/frinyvonnick/gitmoji-changelog/issues/103)) [[f5981cb](https://github.com/frinyvonnick/gitmoji-changelog/commit/f5981cbeb102c8b6d36427c64f5e4f31932a938a)] (by Florent Berthelot)
- 🐳 Add dependency in markdown package to fix docker image [[804a780](https://github.com/frinyvonnick/gitmoji-changelog/commit/804a780a957e2ae6364001331cd8ed818a9580a1)] (by FRIN Yvonnick)
- 🐳 Improve Dockerfile and update docker image usage ([#109](https://github.com/frinyvonnick/gitmoji-changelog/issues/109)) [[55e24c2](https://github.com/frinyvonnick/gitmoji-changelog/commit/55e24c2bf8ae3ad2fd238b8480862498aa1a134e)] (by Baptiste Gauduchon)
- 📝 Add docker usage section ([#99](https://github.com/frinyvonnick/gitmoji-changelog/issues/99)) [[53c96bc](https://github.com/frinyvonnick/gitmoji-changelog/commit/53c96bcd8c66f7a05e38739a1bde82585a3fee86)] (by Baptiste Gauduchon)
- 🐳 Fix dependencies versions in Dockerfile ([#97](https://github.com/frinyvonnick/gitmoji-changelog/issues/97)) [[719541d](https://github.com/frinyvonnick/gitmoji-changelog/commit/719541dd414b62bba59178259a0830626ec70b2e)] (by Baptiste Gauduchon)
- 📦 Add .npmignore file ([#73](https://github.com/frinyvonnick/gitmoji-changelog/issues/73)) [[b0a243f](https://github.com/frinyvonnick/gitmoji-changelog/commit/b0a243ffbfe5a84de4a8173f4aa79f19acc32b95)] (by Emmanuel DEMEY)
- 🐳 Optimize context and image size [[a692310](https://github.com/frinyvonnick/gitmoji-changelog/commit/a692310da45654da5485622a189cc0e350684d0c)] (by Fabien JUIF)

<a name="1.1.0"></a>
## 1.1.0 (2018-11-10)

### Added

- ✨ Check CLI version ([#52](https://github.com/frinyvonnick/gitmoji-changelog/issues/52)) [[18ead38](https://github.com/frinyvonnick/gitmoji-changelog/commit/18ead387032beda06f8097fbc3e8ad65d7268d42)] (by Fabien JUIF)
- ✨ Do not override the top of the existing file ([#53](https://github.com/frinyvonnick/gitmoji-changelog/issues/53)) [[15edd6c](https://github.com/frinyvonnick/gitmoji-changelog/commit/15edd6cd49f672861e9b8195798d23746a39a7c1)] (by Fabien JUIF)
- ✨ Add a breaking changes section ([#62](https://github.com/frinyvonnick/gitmoji-changelog/issues/62)) [[2a9904b](https://github.com/frinyvonnick/gitmoji-changelog/commit/2a9904b26843bb6721e2984049eb75d0914d4104)] (by Logan HAUSPIE)
- ✨ Filter bookmark commit out ([#54](https://github.com/frinyvonnick/gitmoji-changelog/issues/54)) [[7858140](https://github.com/frinyvonnick/gitmoji-changelog/commit/78581402cde9f6ce4c3de6f558629a08941e9d0a)] (by Fabien JUIF)
- ✨ Add the author in changelog lines ([#56](https://github.com/frinyvonnick/gitmoji-changelog/issues/56)) [[979da30](https://github.com/frinyvonnick/gitmoji-changelog/commit/979da30f5e52385b99bd4a58e1a946793bd1196d)] (by Benjamin Petetot)

### Fixed

- 🐛 Remove empty versions ([#51](https://github.com/frinyvonnick/gitmoji-changelog/issues/51)) [[64ac5a7](https://github.com/frinyvonnick/gitmoji-changelog/commit/64ac5a72fe78877625a8b3cb77183a227a5fb881)] (by Fabien JUIF)
- 🐛 Parse unicode emoji in commit ([#49](https://github.com/frinyvonnick/gitmoji-changelog/issues/49)) [[4d52747](https://github.com/frinyvonnick/gitmoji-changelog/commit/4d52747a585e46f118d39b4b1df199b41888b9c2)] (by Benjamin Petetot)
- 🐛 Fix duplication with incremental update ([#60](https://github.com/frinyvonnick/gitmoji-changelog/issues/60)) [[c4ffc59](https://github.com/frinyvonnick/gitmoji-changelog/commit/c4ffc59c708452a5b9ed0d86f88031442ec44b82)] (by Benjamin Petetot)
- 🐛 Fix emojies not identified in some commits ([#65](https://github.com/frinyvonnick/gitmoji-changelog/issues/65)) [[6a3b1b6](https://github.com/frinyvonnick/gitmoji-changelog/commit/6a3b1b642cb05c376079f4ad4a00a92445808722)] (by Benjamin Petetot)

### Miscellaneous

- ⚗ Group similar commits together ([#50](https://github.com/frinyvonnick/gitmoji-changelog/issues/50)) [[06c8f3c](https://github.com/frinyvonnick/gitmoji-changelog/commit/06c8f3c5d9a28bbf2606cbe54b96f8932110fb10)] (by Fabien JUIF)
- 🐳 Init dockerfile ([#61](https://github.com/frinyvonnick/gitmoji-changelog/issues/61)) [[afa7021](https://github.com/frinyvonnick/gitmoji-changelog/commit/afa70219878d39623f8337d479547a2cbadc4c4b)] (by Logan HAUSPIE) & ([#69](https://github.com/frinyvonnick/gitmoji-changelog/issues/69)) [[36c0e06](https://github.com/frinyvonnick/gitmoji-changelog/commit/36c0e061429e93b5ba6cb898f15ea874e4a60e67)] (by Charles-Henri GUERIN)


<a name="1.0.1"></a>
## 1.0.1 (2018-10-25)

### Fixed

- 🐛 Prevent having right commits by version ([#30](https://github.com/frinyvonnick/gitmoji-changelog/issues/30)) ([de06319](https://github.com/frinyvonnick/gitmoji-changelog/commit/de063192baefebad16e05ce79061d815888a442f))
- 🐛 Get correct commit ranges from tags ([#32](https://github.com/frinyvonnick/gitmoji-changelog/issues/32)) ([573a2d0](https://github.com/frinyvonnick/gitmoji-changelog/commit/573a2d0b583b426d358c388af0ba1dc48a4e0ddf))


<a name="1.0.0"></a>
## 1.0.0 (2018-10-25)

### Added

- ✨ Generate full and partial changelog ([#23](https://github.com/frinyvonnick/gitmoji-changelog/issues/23)) ([e7c934a](https://github.com/frinyvonnick/gitmoji-changelog/commit/e7c934a1372344935ddd3739e32a9732d48dc0b8))
- ✨ Group commits by emojis group ([#11](https://github.com/frinyvonnick/gitmoji-changelog/issues/11)) ([7b8b49b](https://github.com/frinyvonnick/gitmoji-changelog/commit/7b8b49b366d3d51f0cc75f4ffb67efcd633cca16))
- ✨ Sort commits by emoji and date ([#24](https://github.com/frinyvonnick/gitmoji-changelog/issues/24)) ([08b2af3](https://github.com/frinyvonnick/gitmoji-changelog/commit/08b2af3241a13f6ebae9c24a3a51ef10b60f2879))
- ✨ Support commit&#x27;s URL and issues autolink in changelog ([#16](https://github.com/frinyvonnick/gitmoji-changelog/issues/16)) ([871f164](https://github.com/frinyvonnick/gitmoji-changelog/commit/871f16499acee400863a94976e2520a4bdbc6cea))
- ✨ Add tag&#x27;s date on version ([#22](https://github.com/frinyvonnick/gitmoji-changelog/issues/22)) ([ab3d9c6](https://github.com/frinyvonnick/gitmoji-changelog/commit/ab3d9c600e307dd0db16bc7abcbdf8a8a2c83ff5))
- ✨ Generate changelog JSON file ([86ca3ea](https://github.com/frinyvonnick/gitmoji-changelog/commit/86ca3eaefb18fd9c9b6bb4256ed2f6fa711aef59))
- ✨ Generate changelog markdown file ([b165f69](https://github.com/frinyvonnick/gitmoji-changelog/commit/b165f695f4c1a49ff16a5f03918545bfb36cf367))

