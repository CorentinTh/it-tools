# Architecture

## Product boundary

IT Tools is a client-only Vue 3 SPA/PWA. Tool input stays in the browser. The
production artifact is static `dist/` content served by nginx; there is no
application server, account system, cloud sync, or runtime API dependency for
the local catalog. Network-aware tools must disclose and strictly bound any
request they make.

## Source layout

- `src/tools/<tool>/` owns one routed tool. Its `index.ts` contains typed
  registry metadata, the public route, its individual icon, and a lazy Vue
  component import.
- `scripts/generate-tool-registry.mjs` statically generates `src/tools/index.ts`.
  It preserves individual tool icons without eagerly importing tool modules.
- `src/ui/` contains low-level `c-*` controls; `src/components/` contains shared
  application patterns; `src/utils/` and `src/composable/` contain browser and
  transformation infrastructure.
- `src/modules/pwa/` owns production registration and development cleanup.
- `.ai/baselines/build-budgets.json` is the executable artifact budget policy.

## Runtime contracts

All route components stay lazy. Heavy parsers, datasets, editors, crypto, and
workers stay route-owned and demand-loaded. Large or attacker-controlled work
uses explicit actions or bounded debounce, input/output limits, timeout,
cancellation, stale-result protection, and disposal on route teardown.

The common worker lifecycle is implemented by `src/utils/worker-protocol.ts`,
`src/utils/worker-task.ts`, and `src/utils/bounded-text-task.ts`. Workers validate
both request and response envelopes; replacement, cancellation, timeout, and
unmount terminate the physical worker.

Production caches the shell and demand-caches opened lazy assets. Development
does not register a service worker and removes only IT Tools-owned stale PWA
state. Storage and privacy rules are in `PERSISTENCE.md`.

## Delivery

The supported toolchain is Node 24, pnpm 9.11.0, Vite, Vitest, Playwright, and
Docker/nginx. CI uses the frozen lockfile, builds the static artifact, enforces
budgets, runs browser smoke, audits production dependencies, scans the runtime
image, and checks root plus reverse-proxy/subpath delivery.

The local fork is authoritative. Upstream material is research only and must
not be merged or adapted without an explicit approved record in `TODO.md`.
