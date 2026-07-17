# IT Tools

> This repository is an independently maintained and enhanced fork of [CorentinTh/it-tools](https://github.com/CorentinTh/it-tools).

The current fork is developed at [64mb/it-tools](https://github.com/64mb/it-tools). It builds on the original project while adding local improvements, updated styling, and additional deployment options.

IT Tools is a client-side collection of utilities for developers, DevOps engineers, and other IT professionals. Tool inputs are processed locally in the browser; the application has no backend and can be deployed as static files.

## Project lineage

- **Original project:** [CorentinTh/it-tools](https://github.com/CorentinTh/it-tools), created by Corentin Thomasset and its contributors.
- **Enhanced fork:** [64mb/it-tools](https://github.com/64mb/it-tools), independently maintained and developed from the original codebase.

## Technology stack

- Vue 3 and TypeScript
- Vite
- Naive UI and UnoCSS
- Pinia and Vue Router
- Vitest and Playwright
- PWA/Workbox support
- nginx for the container image

Third-party dependencies are listed in [`package.json`](package.json).

## Development

The project uses the pnpm version pinned in `package.json`.

### Install dependencies

```sh
corepack enable
pnpm install --frozen-lockfile
```

### Start the development server

```sh
pnpm dev
```

### Run validation

```sh
pnpm lint
pnpm typecheck
pnpm exec vitest run --environment jsdom
pnpm build
```

### Run end-to-end tests

Install browser binaries compatible with the pinned Playwright version, then run:

```sh
pnpm test:e2e --project=chromium --reporter=line
```

## Builds

### Standard static/PWA build

```sh
pnpm build
```

The production files are written to `dist/` and can be served by any static web server with SPA fallback enabled.

## Self-hosting with Docker

Build the image from the current source:

```sh
docker build -t it-tools:2.1.0 .
docker run -d --name it-tools --restart unless-stopped -p 8080:80 it-tools:2.1.0
```

Open `http://localhost:8080` in a browser.

## Creating a tool

Generate the initial files with:

```sh
pnpm run script:create:tool my-tool-name
```

Then register the tool in the appropriate category and implement its transformation and tests.

## Issues and contributions

Bug reports and feature requests for this fork belong in the [64mb/it-tools issue tracker](https://github.com/64mb/it-tools/issues).

Changes should preserve client-side processing, lazy-loaded tool routes, strict TypeScript checks, and the privacy of tool input. See [`AGENTS.md`](AGENTS.md) for repository-specific engineering rules.

## Attribution

This fork is based on the original [IT Tools project](https://github.com/CorentinTh/it-tools) by Corentin Thomasset and its contributors. Their work remains acknowledged under the project's license and Git history.

The enhanced fork and its current changes are maintained at [64mb/it-tools](https://github.com/64mb/it-tools).

## License

This project is distributed under the [GNU General Public License v3.0](LICENSE).
