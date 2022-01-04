![gitmoji-changelog logo](https://raw.githubusercontent.com/frinyvonnick/gitmoji-changelog/master/misc/logo.png)

<p>
  <img src="https://img.shields.io/npm/v/gitmoji-changelog" />
  <a href="https://gitmoji.carloscuesta.me">
    <img src="https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg" alt="Gitmoji">
  </a>
  <a href="https://twitter.com/YvonnickFrin">
    <img alt="Twitter: YvonnickFrin" src="https://img.shields.io/twitter/follow/YvonnickFrin.svg?style=social" target="_blank" />
  </a>
</p>

> Generate changelog for repositories using [gitmoji](https://gitmoji.carloscuesta.me/) commits convention.


![gitmoji-changelog usage example](https://raw.githubusercontent.com/frinyvonnick/gitmoji-changelog/master/misc/example.gif)

## 🚀 Usage

Make sure you have [npx](https://www.npmjs.com/package/npx) installed (`npx` is shipped by default since npm `5.2.0`)

Run the following command at the root of your project and answer questions. `gitmoji-changelog` uses a [preset system](https://docs.gitmoji-changelog.dev/#/?id=%e2%9a%99%ef%b8%8f-presets) to handle different type of project. The preset used by default is the Node.js one that look for project's information in the `package.json` file.

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

It exists a generic preset that works for every kind of project. It looks for information in a `.gitmoji-changelogrc` file at the root of your project. This file must contain three mandatory properties: `name`, `description` and `version`.

.gitmoji-changelogrc:
```json
{
  "project": {
    "name": "gitmoji-changelog",
    "description": "A changelog generator for gitmoji 😜",
    "version": "2.0.1"
  }
}
```

You can change the preset used by `gitmoji-changelog` with the preset option.

```sh
npx gitmoji-changelog --preset generic
```

## 📖 Documentation

:point_right: The full documentation is available [here](https://docs.gitmoji-changelog.dev).

## ✍ Author

👤 **Yvonnick FRIN (https://yvonnickfrin.dev)**

* Twitter: [@YvonnickFrin](https://twitter.com/YvonnickFrin)
* Github: [@frinyvonnick](https://github.com/frinyvonnick)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/frinyvonnick/gitmoji-changelog/issues). You can also take a look at our [contributing guide](CONTRIBUTING.md).

## 🙏 Show your support

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
    <td align="center"><a href="https://yvonnickfrin.dev"><img src="https://avatars0.githubusercontent.com/u/13099512?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Yvonnick FRIN</b></sub></a><br /><a href="https://github.com/frinyvonnick/gitmoji-changelog/commits?author=frinyvonnick" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/bpetetot"><img src="https://avatars3.githubusercontent.com/u/516360?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Benjamin Petetot</b></sub></a><br /><a href="https://github.com/frinyvonnick/gitmoji-changelog/commits?author=bpetetot" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/fabienjuif"><img src="https://avatars0.githubusercontent.com/u/17828231?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Fabien JUIF</b></sub></a><br /><a href="https://github.com/frinyvonnick/gitmoji-changelog/commits?author=fabienjuif" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/bgauduch"><img src="https://avatars0.githubusercontent.com/u/5585755?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Baptiste Gauduchon</b></sub></a><br /><a href="https://github.com/frinyvonnick/gitmoji-changelog/commits?author=bgauduch" title="Code">💻</a></td>
    <td align="center"><a href="https://www.franck-abgrall.me/"><img src="https://avatars3.githubusercontent.com/u/9840435?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Franck Abgrall</b></sub></a><br /><a href="https://github.com/frinyvonnick/gitmoji-changelog/commits?author=kefranabg" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/quentinncl"><img src="https://avatars0.githubusercontent.com/u/12430277?v=4?s=100" width="100px;" alt=""/><br /><sub><b>quentinncl</b></sub></a><br /><a href="https://github.com/frinyvonnick/gitmoji-changelog/commits?author=quentinncl" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/lhauspie"><img src="https://avatars1.githubusercontent.com/u/25682509?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Logan HAUSPIE</b></sub></a><br /><a href="https://github.com/frinyvonnick/gitmoji-changelog/commits?author=lhauspie" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://www.geekeries.fun"><img src="https://avatars3.githubusercontent.com/u/7294764?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Guillaume Membré</b></sub></a><br /><a href="https://github.com/frinyvonnick/gitmoji-changelog/commits?author=gmembre-zenika" title="Code">💻</a></td>
    <td align="center"><a href="http://yann-bertrand.fr/"><img src="https://avatars0.githubusercontent.com/u/5855339?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Yann Bertrand</b></sub></a><br /><a href="https://github.com/frinyvonnick/gitmoji-changelog/commits?author=yannbertrand" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/snikic"><img src="https://avatars3.githubusercontent.com/u/2975674?v=4?s=100" width="100px;" alt=""/><br /><sub><b>s n</b></sub></a><br /><a href="https://github.com/frinyvonnick/gitmoji-changelog/commits?author=snikic" title="Code">💻</a></td>
    <td align="center"><a href="https://mathieutu.dev"><img src="https://avatars3.githubusercontent.com/u/11351322?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Mathieu TUDISCO</b></sub></a><br /><a href="https://github.com/frinyvonnick/gitmoji-changelog/commits?author=mathieutu" title="Code">💻</a></td>
    <td align="center"><a href="http://charlyx.dev"><img src="https://avatars2.githubusercontent.com/u/481446?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Charles-Henri GUERIN</b></sub></a><br /><a href="https://github.com/frinyvonnick/gitmoji-changelog/commits?author=charlyx" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/FBerthelot"><img src="https://avatars1.githubusercontent.com/u/6927852?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Florent Berthelot</b></sub></a><br /><a href="https://github.com/frinyvonnick/gitmoji-changelog/commits?author=FBerthelot" title="Code">💻</a></td>
    <td align="center"><a href="http://gillespie59.github.io/"><img src="https://avatars2.githubusercontent.com/u/555768?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Emmanuel DEMEY</b></sub></a><br /><a href="https://github.com/frinyvonnick/gitmoji-changelog/commits?author=EmmanuelDemey" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://christopherkade.com"><img src="https://avatars3.githubusercontent.com/u/15229355?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Christopher Kade</b></sub></a><br /><a href="#blog-christopherkade" title="Blogposts">📝</a></td>
    <td align="center"><a href="http://numcom.herokuapp.com/"><img src="https://avatars0.githubusercontent.com/u/863788?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Rodion Martynov</b></sub></a><br /><a href="https://github.com/frinyvonnick/gitmoji-changelog/commits?author=rudym" title="Documentation">📖</a></td>
    <td align="center"><a href="http://danieltamkin.com"><img src="https://avatars1.githubusercontent.com/u/9532762?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Daniel Tamkin</b></sub></a><br /><a href="https://github.com/frinyvonnick/gitmoji-changelog/commits?author=DanielTamkin" title="Documentation">📖</a></td>
    <td align="center"><a href="http://endormi.io"><img src="https://avatars3.githubusercontent.com/u/39559256?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Erno Salo</b></sub></a><br /><a href="https://github.com/frinyvonnick/gitmoji-changelog/commits?author=endormi" title="Documentation">📖</a></td>
    <td align="center"><a href="http://markdid.it"><img src="https://avatars3.githubusercontent.com/u/6841110?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Mark Lyck</b></sub></a><br /><a href="https://github.com/frinyvonnick/gitmoji-changelog/commits?author=MarkLyck" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/horaklukas"><img src="https://avatars.githubusercontent.com/u/996088?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Lukáš Horák</b></sub></a><br /><a href="https://github.com/frinyvonnick/gitmoji-changelog/commits?author=horaklukas" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/juwit"><img src="https://avatars.githubusercontent.com/u/7531844?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Julien WITTOUCK</b></sub></a><br /><a href="https://github.com/frinyvonnick/gitmoji-changelog/commits?author=juwit" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## 📝 License

Copyright © 2020 [Yvonnick FRIN (https://github.com/frinyvonnick)](https://github.com/frinyvonnick).<br />
This project is [MIT](https://github.com/frinyvonnick/gitmoji-changelog/blob/master/LICENSE) licensed.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
