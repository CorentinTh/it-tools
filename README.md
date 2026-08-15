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

The supported development baseline is Node.js 24.18.0 and pnpm 9.11.0, pinned
in `.nvmrc` and `package.json`.

### Install dependencies

```sh
nvm use
corepack enable
pnpm install --frozen-lockfile
```

### Start the development server

```sh
pnpm dev
```

The source-served development URL is `http://127.0.0.1:8091`. It is kept on a
different origin from production preview (`http://127.0.0.1:5050`) so an old
PWA service worker cannot masquerade as the current source tree. If Vite's
optimized-dependency cache is suspect, stop the server and run
`pnpm dev:fresh`; use `pnpm test:dev-runtime` to verify the browser contract.

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
docker run -d --name it-tools --restart unless-stopped --read-only --tmpfs /tmp:rw,noexec,nosuid,size=16m --cap-drop=ALL -p 8080:8080 it-tools:2.1.0
```

Open `http://localhost:8080` in a browser.

The container runs unprivileged and listens on port `8080` by default. Set
`NGINX_PORT` to another unprivileged port and publish the same container port
when a different internal port is required.

## Creating a tool

Generate the initial files with:

```sh
pnpm run script:create:tool my-tool-name
```

Then register the tool in the appropriate category and implement its transformation and tests.

## Generated OUI vendor data

MAC Address Lookup uses the lockfile-pinned `oui-data` package only at build
time. Its 34,503 records are committed in one deterministic compact artifact
and loaded inside a route-local Web Worker. Every lookup therefore uses the
same hashed worker URL: the entered MAC prefix is never encoded in a network
request. Regenerate and verify the artifact after an intentional source-version
change:

```sh
pnpm generate:oui-data
pnpm test:oui-data
```

`pnpm build` also fails when the committed compact artifact or source metadata
is stale.

## Issues and contributions

Bug reports and feature requests for this fork belong in the [64mb/it-tools issue tracker](https://github.com/64mb/it-tools/issues).

Changes should preserve client-side processing, lazy-loaded tool routes, strict TypeScript checks, and the privacy of tool input. See [`AGENTS.md`](AGENTS.md) for repository-specific engineering rules.

## Attribution

This fork is based on the original [IT Tools project](https://github.com/CorentinTh/it-tools) by Corentin Thomasset and its contributors. Their work remains acknowledged under the project's license and Git history.

The enhanced fork and its current changes are maintained at [64mb/it-tools](https://github.com/64mb/it-tools).

## License

This project is distributed under the [GNU General Public License v3.0](LICENSE).
