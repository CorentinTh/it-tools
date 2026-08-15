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

Do not use the generic in-app-browser connector for this surface. Use Computer
Use only for external browser windows, webviews, or Orca desktop chrome rather
than the embedded browser content.

## 2. Start the correct application server

Create or reuse a dedicated non-agent Orca terminal for the application. Read
the terminal list and terminal contents before sending input; never type shell
commands into a Codex/Claude/other agent terminal.

For current-source UI development:

```sh
pnpm dev --host 127.0.0.1 --port 8080
```

Navigate the existing browser tab with:

```sh
orca goto --url http://localhost:8080/ --json
orca wait --load networkidle --json
orca snapshot --json
```

Use production preview only after an intentional fresh build:

```sh
pnpm build
pnpm exec vite preview --host 127.0.0.1 --port 8080
```

`vite preview` serves `dist/`; it does not compile the current source. The
repository's `dist/` is machine-local, may predate the checked-out source, and
must never be used as a current-source baseline without rebuilding it. When in
doubt, compare timestamps and search both `src/` and `dist/` for the disputed
token or behavior.

## 3. Detect a stale PWA response

Switching from preview to the dev server is not enough when a previously
installed Workbox service worker still controls `localhost:8080`. Typical
symptoms are old theme colors, missing recently added routes, hashed production
scripts while Vite dev is running, or UI behavior that disagrees with source.

Inspect the page before clearing anything:

```sh
orca eval --expression "(async()=>({href:location.href,controller:navigator.serviceWorker.controller?.scriptURL||null,registrations:(await navigator.serviceWorker.getRegistrations()).map(r=>({scope:r.scope,active:r.active?.scriptURL})),caches:await caches.keys(),scripts:[...document.scripts].map(s=>s.src).filter(Boolean)}))()" --json
```

For a current dev page, the expected script list includes `/@vite/client` and
`/src/main.ts`, and no service worker should control the page. A hashed script
such as `/assets/index-<hash>.js` plus a Workbox cache proves that the tab is
still receiving a production artifact.

If stale state is confirmed, remove only registrations and caches belonging to
the current localhost origin:

```sh
orca eval --expression "(async()=>({unregistered:await Promise.all((await navigator.serviceWorker.getRegistrations()).filter(r=>r.scope===location.origin+'/').map(r=>r.unregister())),deleted:await Promise.all((await caches.keys()).filter(k=>k.includes(location.origin)).map(k=>caches.delete(k)))}))()" --json
orca reload --json
```

Do not broadly clear all browser data, unrelated origins, local storage, or
tool content. After reload, repeat the inspection and verify the relevant
computed style or behavior rather than relying on the reload result alone.

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
2. Confirm the dedicated Orca terminal is running `pnpm dev`, or rebuild before
   using preview.
3. Confirm the browser tab URL and `browserPageId`.
4. Confirm dev scripts are `/@vite/client` and `/src/main.ts`.
5. Confirm there is no stale service-worker controller.
6. Inspect the relevant computed token or control state.
7. Capture the representative light/dark and responsive states required by the
   change.
8. Keep Playwright deterministic regression coverage separate from the manual
   Orca review.
