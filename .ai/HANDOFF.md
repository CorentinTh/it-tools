# Current Handoff

## State

The final approved product package is implemented. There is no remaining
feature plan. The application is a browser-only static SPA/PWA with 133 lazy
tool routes, generated from per-tool typed metadata. Unique tool icons are a
product requirement and are preserved by the registry generator.

The repository may be intentionally dirty; inspect `git status` and never
overwrite unrelated local-fork work. Do not merge, rebase, or cherry-pick
upstream automatically.

## Resume

```sh
corepack enable
pnpm install --frozen-lockfile
git status --short
node scripts/generate-tool-registry.mjs --check
pnpm lint
pnpm typecheck
pnpm exec vitest run --environment jsdom
pnpm build
pnpm build:stats:check
pnpm build:standalone
pnpm test:standalone
```

Use one-shot Vitest; `pnpm test:unit` is currently also one-shot but the explicit
command is unambiguous. Run browser/container/security checks in proportion to
the touched surface.

## Standalone/DataLens

The final artifact is `dist-standalone/it-tools.html`: one 7,587,222-byte file
with 126 tools and no runtime network resources. `pnpm test:standalone` rebuilds
it from current sources and runs Chromium, Firefox, and WebKit serially.

The DataLens regression test reproduces the supplied HTTPS iframe with
`sandbox="allow-scripts"`, opaque origin, COOP, the injected CSP including
`connect-src 'none'` and `worker-src 'none'`, and disabled downloads. It checks
all 126 menu labels, their SVG icons, denied `localStorage`, a worker-backed
conversion, `EXPORT`, `OPEN_URL`, and an empty runtime/network error set.

Do not switch the standalone sidebar back to Naive UI `NMenu`: its AMD render
produced empty `n-menu-item` elements in the real sandbox. The standalone-only
plain router-link menu is intentional; the normal application still uses
`NMenu`. Do not add intermediate-reuse flags to the build—the fresh build and
unconditional cleanup are part of the stale-cache defense.

## Invariants

- Inputs remain local and ephemeral unless a narrow feature explicitly says
  otherwise.
- Tool components, heavy dependencies, datasets, and workers remain lazy.
- Tool metadata lives in `src/tools/<tool>/index.ts`; regenerate, never manually
  edit `src/tools/index.ts`.
- Each tool retains its own icon. Do not replace tool icons with category icons.
- Worker tasks validate envelopes and enforce limits, timeout, cancellation,
  stale-result protection, and physical disposal.
- PWA installs the shell and demand-caches opened lazy assets.
- UI transformers are wide and vertical unless they are actual diff tools.
- `.ai/baselines/build-budgets.json` is executable policy, not historical prose.

## Browser review

Use the existing Orca embedded browser via the `orca-cli` skill and the exact
procedure in `ORCA_BROWSER.md`. Current-source review uses strict
`http://127.0.0.1:8091`; preview uses a freshly built `dist/` at port 5050. Do
not confuse the two or silently switch browser surfaces.
