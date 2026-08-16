# Performance Contract

## Current baseline

The generated registry contains 133 lazy routes. The last accepted pre-icon
regression build measured a 678,871-byte raw / 185,180-byte gzip shell and a
53-file, 931,633-byte raw / 305,466-byte gzip Workbox payload. Restoring unique
tool icons must be remeasured; the executable ceiling remains authoritative.

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
