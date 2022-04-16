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

## License

This project is under the [MIT license](LICENSE).
