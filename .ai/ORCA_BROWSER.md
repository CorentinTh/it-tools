# Orca Browser Runbook

This runbook is the source of truth for interactive review of IT Tools in the
browser embedded inside Orca. It prevents two recurring mistakes: controlling
the wrong browser surface and reviewing an old production artifact or PWA
cache as though it were the current source tree.

## 1. Select the correct browser surface

Use the `orca-cli` skill for Orca's embedded browser. Load the version-matched
guide before issuing browser commands:

```sh
orca skills get orca-cli
orca status --json
orca tab list --json
```

If Orca is not running, start it with `orca open --json`. Reuse the user's
existing tab when one is already open. Record its `browserPageId` and pass
`--page <browserPageId>` when multiple browser tabs could make the active tab
ambiguous.

If `orca status --json` reports `ready` but the next browser command returns
`runtime_unavailable`, check status again and retry `orca open --json` once.
When the runtime exits a second time, record the exact app version/error and
stop issuing Orca commands. Do not guess a different Orca binary or silently
switch to preview. Continue only with deterministic tests against the verified
Vite dev URL and report that manual embedded-browser acceptance remains
unavailable. On 2026-08-15 and 2026-08-16, Orca 1.4.177 reproduced this exact
status-to-browser-command exit twice; the affected slices used the verified
`127.0.0.1:8091` Vite dev server and deterministic Chromium fallback gates.

Do not use the generic in-app-browser connector for this surface. Use Computer
Use only for external browser windows, webviews, or Orca desktop chrome rather
than the embedded browser content.

## 2. Start the correct application server

Create or reuse a dedicated non-agent Orca terminal for the application. Read
the terminal list and terminal contents before sending input; never type shell
commands into a Codex/Claude/other agent terminal.

For current-source UI development:

```sh
pnpm dev
```

The repository fixes this server at `http://127.0.0.1:8091` with
`strictPort: true`, `Cache-Control: no-store`, and
`X-IT-Tools-Mode: development`. Orca's own development runtime uses port 5173,
so do not use Vite's default port for IT Tools. Do not substitute `localhost`
for `127.0.0.1`: they are different browser origins with independent service
workers and caches.

When Vite's optimized-dependency cache itself is suspect, stop the existing IT
Tools dev process and use:

```sh
pnpm dev:fresh
```

This is the same source-served server with Vite `--force`; it is not a
production rebuild and does not read `dist/`.

Navigate the existing browser tab with:

```sh
orca goto --url http://127.0.0.1:8091/ --json
orca wait --load networkidle --json
orca snapshot --json
```

Use production preview only after an intentional fresh build:

```sh
pnpm build
pnpm preview
```

Preview is fixed at `http://127.0.0.1:5050` and must never reuse the 8091 dev
origin. `vite preview` serves `dist/`; it does not compile the current source. The
repository's `dist/` is machine-local, may predate the checked-out source, and
must never be used as a current-source baseline without rebuilding it. When in
doubt, compare timestamps and search both `src/` and `dist/` for the disputed
token or behavior.

## 3. Detect a stale PWA response

Switching processes is not enough when a previously installed Workbox service
worker still controls a reused origin. Typical
symptoms are old theme colors, missing recently added routes, hashed production
scripts while Vite dev is running, or UI behavior that disagrees with source.

Inspect the page before clearing anything:

```sh
orca eval --expression "(async()=>({href:location.href,controller:navigator.serviceWorker.controller?.scriptURL||null,registrations:(await navigator.serviceWorker.getRegistrations()).map(r=>({scope:r.scope,active:r.active?.scriptURL})),caches:await caches.keys(),scripts:[...document.scripts].map(s=>s.src).filter(Boolean)}))()" --json
```

For a current dev page, the response includes
`X-IT-Tools-Mode: development`, the expected script list includes
`/@vite/client` and `/src/main.ts`, and no service worker should control the
page. A hashed script
such as `/assets/index-<hash>.js` plus a Workbox cache proves that the tab is
still receiving a production artifact.

The current dev entry does not call `registerSW()`. Once source-served dev code
loads, it unregisters only the root IT Tools `sw.js`, deletes only
`workbox-precache-*`, `it-tools-lazy-assets-*`, and `figlet-fonts-*` caches, and
reloads a controlled page at most once. It never clears local/session tool
content or unrelated cache names. This prevents recurrence but cannot execute
when an old service worker never lets the new dev entry load.

If stale state is confirmed before the new dev entry can load, remove only the
root IT Tools registration and application-owned caches on that origin:

```sh
orca eval --expression "(async()=>({unregistered:await Promise.all((await navigator.serviceWorker.getRegistrations()).filter(r=>r.scope===location.origin+'/'&&[r.active,r.waiting,r.installing].some(w=>w&&new URL(w.scriptURL).pathname==='/sw.js')).map(r=>r.unregister())),deleted:await Promise.all((await caches.keys()).filter(k=>['workbox-precache-','it-tools-lazy-assets-','figlet-fonts-'].some(p=>k.startsWith(p))).map(k=>caches.delete(k)))}))()" --json
orca reload --json
```

Do not broadly clear all browser data, unrelated origins, local storage, or
tool content. After reload, repeat the inspection and verify the relevant
computed style or behavior rather than relying on the reload result alone.

When Orca browser control is unavailable, keep manual acceptance explicitly
open and run the deterministic fallback against the live dev server:

```sh
pnpm test:dev-runtime
```

It asserts the development response header, `/@vite/client`, `/src/main.ts`, no
controller or Workbox registration, deletion of an IT Tools cache, and
preservation of an unrelated cache.

## 4. Review loop

Use Orca's snapshot/interact/re-snapshot workflow:

```sh
orca snapshot --json
orca click --element @e3 --json
orca snapshot --json
```

Element references are scoped to one tab and become stale after navigation,
tab switching, or DOM-changing interaction. Prefer semantic operations such as
`click`, `fill`, `check`, `select`, `keypress`, and explicit waits. Use
`orca eval` for bounded diagnostics such as URLs, accessibility attributes,
computed styles, element geometry, service-worker state, or loaded scripts.

Screenshots are a visual review aid; snapshots and computed state provide the
repeatable evidence. The CLI returns screenshot image data in JSON, so agents
should forward it to their image-viewing surface instead of printing the raw
base64 payload into the conversation.

## 5. IT Tools verification checklist

Before claiming that a current-source UI change is visible:

1. Confirm the expected branch and dirty state.
2. Confirm exactly one IT Tools server is listening: `pnpm dev` on 8091, or a
   fresh build followed by `pnpm preview` on 5050.
3. Confirm the browser tab URL and `browserPageId`.
4. Confirm `X-IT-Tools-Mode: development` plus dev scripts `/@vite/client` and
   `/src/main.ts`.
5. Confirm there is no stale service-worker controller.
6. Inspect the relevant computed token or control state.
7. Capture the representative light/dark and responsive states required by the
   change.
8. Keep Playwright deterministic regression coverage separate from the manual
   Orca review.

## 6. Runtime fallback record

On 2026-08-16 Orca 1.4.177 again reported `ready` after `orca open --json`, then
the next embedded-browser command failed with `runtime_unavailable`. This is
the third reproduction of the same runtime exit. Per this runbook, the current
source was verified through the strict 8091 Vite-dev server and deterministic
Playwright coverage; no preview artifact or alternate browser surface was used.
