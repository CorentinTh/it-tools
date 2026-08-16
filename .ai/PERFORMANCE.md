# Performance Contract

## Current baseline

The generated registry contains 133 lazy routes. The accepted normal build on
2026-08-17 measured a 687,421-byte raw / 186,417-byte gzip main entry, a
716,733-byte raw / 192,710-byte gzip shell including the document, and a
53-file, 970,294-byte raw / 313,252-byte gzip Workbox payload. All 426 build
budget checks passed with unique tool icons preserved.

The accepted standalone artifact contains 126 tools in one HTML file. It is
7,587,222 bytes (7.24 MiB); the JSON upload envelope `{ "html": ... }` is
7,589,273 bytes. Both are below the strict 10 MiB limit. The build fails if
either measurement exceeds that limit and always removes its intermediate
directory to prevent stale-build reuse.

Production large-result fixtures for SQL, JSON-to-CSV, JSON Minify, and List
Converter publish bounded previews while Copy/Blob download retains the full
bounded result. The accepted runs observed no Long Task at or above 50 ms.
Emoji search is worker-backed and virtualized. Monaco remains accepted for Text
Diff: the smaller CodeMirror spike lost focus, undo, and history when publishing
async diff results.

## Gates

`.ai/baselines/build-budgets.json` is the sole detailed budget source. It
enforces shell and Workbox totals, a 500 kB default dynamic-entry ceiling, and
narrow rationale-backed exceptions for unavoidable route-owned assets. Generate
fresh measurements with:

```sh
pnpm build
pnpm build:stats
pnpm build:stats:check
pnpm build:standalone
pnpm test:standalone
```

Never update a budget merely to make a failure pass. Record the before/after
raw and gzip sizes, cold-route/result-ready timing, longest observed task, and
PWA impact. New shell work must keep parsers, datasets, tool components, and
heavy editors out of the initial graph.

## Responsiveness rules

- Do not synchronously parse or transform large input on every keystroke.
- Use explicit action above the tool's documented live threshold.
- Bound input, output, amplification, time, messages, and worker lifecycle.
- Show a bounded DOM preview for large results; copy/download the full result.
- Dispose workers, editors, media, observers, timers, and object URLs.
