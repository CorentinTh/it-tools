# Toolbox

Useful tools for developers and people working in IT. [Try it!](https://toolbox.destan.workers.dev)

Toolbox is a fork of [IT-Tools](https://github.com/CorentinTh/it-tools) by [Corentin Thomasset](https://corentin.tech).

## Functionalities and roadmap

Please check the [issues](https://github.com/destan/toolbox/issues) to see if some feature listed to be implemented.

You have an idea of a tool? Submit a [feature request](https://github.com/destan/toolbox/issues/new/choose)!

## Self host

Build and run the Docker image:

```sh
docker build -t toolbox .
docker run -d --name toolbox --restart unless-stopped -p 8080:80 toolbox
```

### Build variables

The build reads these optional environment variables:

| Variable          | Default                                                                       | Purpose                                                                    |
| ----------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `VITE_APP_ENV`    | The Vite mode: `production` for `pnpm build`, `development` for `pnpm dev`    | Shows development-only pages, such as the UI library, when `development`. |
| `VITE_COMMIT_SHA` | `WORKERS_CI_COMMIT_SHA`, which Cloudflare Workers Builds sets                 | Links the footer version to the built commit.                              |

## Contribute

### Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) with the following extensions:

- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur)
- [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [i18n Ally](https://marketplace.visualstudio.com/items?itemName=lokalise.i18n-ally)

with the following settings:

```json
{
  "editor.formatOnSave": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "i18n-ally.localesPaths": ["locales", "src/tools/*/locales"],
  "i18n-ally.keystyle": "nested"
}
```

### Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

### Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm test
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```

### Create a new tool

To create a new tool, there is a script that generate the boilerplate of the new tool, simply run:

```sh
pnpm run script:create:tool my-tool-name
```

It will create a directory in `src/tools` with the correct files, and a the import in `src/tools/index.ts`. You will just need to add the imported tool in the proper category and develop the tool.

## Credits

Toolbox is a fork of [IT-Tools](https://github.com/CorentinTh/it-tools), coded with ❤️ by [Corentin Thomasset](https://corentin.tech) and the [IT-Tools contributors](https://github.com/CorentinTh/it-tools/graphs/contributors).

[destan](https://github.com/destan) maintains this fork.

This project is continuously deployed using [Cloudflare](https://www.cloudflare.com).

## License

This project is under the [GNU GPLv3](LICENSE).
