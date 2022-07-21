![logo](.github/logo.png)

Useful tools for developer and people working in IT. [Have a look !](https://it-tools.tech).

## Functionalities and roadmap

Please check the [issues](https://github.com/CorentinTh/it-tools/issues) to see if some feature listed to be implemented.

You have an idea of a tool? Submit a [feature request](https://github.com/CorentinTh/it-tools/issues/new?assignees=corentinth&labels=&template=feature_request.md&title=)!

## Contribute

### Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.vscode-typescript-vue-plugin).

### Node version

Ensure you have the correct node/npm version

```sh
nvm use
```

### Project Setup

```sh
npm install
```

#### Compile and Hot-Reload for Development

```sh
npm run dev
```

#### Type-Check, Compile and Minify for Production

```sh
npm run build
```

#### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test
```

#### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### Create a new tool

To create a new tool, there is a script that generate the boilerplate of the new tool, simply run:

```sh
node scripts/create-tool.mjs my-tool-name
```

It will create a directory in `src/tools` with the correct files, and a the import in `src/tools/index.ts`. You will just need to add the inported tool in the proper category and develop the tool.

## Credits

Coded with ❤️ by [Corentin Thomasset](//corentin-thomasset.fr).

This project is continuously deployed using [vercel.com](https://vercel.com).



<a href="https://www.producthunt.com/posts/it-tools?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-it&#0045;tools" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=345793&theme=light" alt="IT&#0032;Tools - Collection&#0032;of&#0032;handy&#0032;online&#0032;tools&#0032;for&#0032;devs&#0044;&#0032;with&#0032;great&#0032;UX | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>
<a href="https://www.producthunt.com/posts/it-tools?utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-it&#0045;tools" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=345793&theme=light&period=daily" alt="IT&#0032;Tools - Collection&#0032;of&#0032;handy&#0032;online&#0032;tools&#0032;for&#0032;devs&#0044;&#0032;with&#0032;great&#0032;UX | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>


## License

This project is under the [GNU GPLv3](LICENSE).
