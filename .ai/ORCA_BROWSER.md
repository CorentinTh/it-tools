# Orca Browser Runbook

Use the `orca-cli` skill for Orca's embedded browser. Reuse the user's existing
tab, obtain its `browserPageId` with `orca tab list --json`, and pass `--page`
when the active page is ambiguous. Do not substitute the generic browser
connector. Computer Use is only for browser windows or Orca chrome outside the
embedded page.

## Current-source server

Run `pnpm dev` in a dedicated non-agent Orca terminal. It serves strict
`http://127.0.0.1:8091` with `Cache-Control: no-store` and
`X-IT-Tools-Mode: development`. Use `pnpm dev:fresh` only when Vite's optimized
dependency cache is suspect. It adds `--force`; it does not read `dist/`.

Production review requires `pnpm build && pnpm preview` and uses strict
`http://127.0.0.1:5050`. Preview serves `dist/`; never use it as evidence for
current source without a fresh build. `localhost` and `127.0.0.1` are different
origins with independent caches and service workers.

## Navigation and stale-cache diagnosis

```sh
orca goto --url http://127.0.0.1:8091/ --json
orca wait --load networkidle --json
orca snapshot --json
```

Dev must load `/@vite/client` and `/src/main.ts`, expose the development header,
and have no service-worker controller. Hashed `/assets/index-*.js` or a Workbox
controller means the tab is showing a production artifact.

Inspect before clearing:

```sh
orca eval --expression "(async()=>({href:location.href,controller:navigator.serviceWorker.controller?.scriptURL||null,registrations:(await navigator.serviceWorker.getRegistrations()).map(r=>({scope:r.scope,active:r.active?.scriptURL})),caches:await caches.keys(),scripts:[...document.scripts].map(s=>s.src).filter(Boolean)}))()" --json
```

If stale IT Tools state blocks dev, unregister only the root registration whose
worker pathname is `/sw.js`; delete only caches prefixed with
`workbox-precache-`, `it-tools-lazy-assets-`, or `figlet-fonts-`; then reload.
Never clear all browser data, storage, unrelated caches, or other origins. The
source-dev runtime performs this narrow cleanup automatically when it can load.

Use snapshot, semantic interaction, and a new snapshot for review. Element
references expire after navigation or DOM changes. Verify computed styles and
accessible state in addition to screenshots.

If Orca reports `runtime_unavailable` after one status/open retry, stop guessing
alternate surfaces. Keep manual acceptance open and run `pnpm test:dev-runtime`
against the verified 8091 server; report the Orca runtime failure explicitly.
