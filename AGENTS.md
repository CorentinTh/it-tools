# AGENTS.md

## Scope and product

These instructions apply to the whole repository.

IT Tools is a client-only Vue SPA/PWA. There is no application backend: tool inputs are processed in the browser, the production artifact is a static `dist/` directory, and the Docker image serves it with nginx.

The local fork is the source of truth. Do not merge, rebase, or cherry-pick upstream automatically. Upstream issues and pull requests are research material; any code or design intentionally adapted from upstream must be listed explicitly in `.ai/TODO.md` and approved before implementation.

## Repository map

- `src/tools/<tool>/`: one independently routed tool. Keep the route component lazy-loaded from its `index.ts`.
- `src/tools/index.ts`: central tool/category registry. Changes here affect the initial bundle.
- `src/ui/`: reusable low-level UI components.
- `src/components/`: application-level shared components.
- `src/layouts/`, `src/pages/`, `src/modules/`, `src/stores/`: shell, pages, cross-cutting modules, and Pinia state.
- `src/composable/`, `src/utils/`: shared browser logic and pure helpers.
- `locales/`: compiled i18n source. The current fork intentionally retains only English.
- `scripts/`: scaffolding and release scripts.
- `.github/workflows/`: CI, E2E, and release pipelines.
- `.ai/`: architecture, upstream snapshots, findings, and the approved work plan.

Read `.ai/ARCHITECTURE.md`, `.ai/FIXES.md`, `.ai/FEATURES.md`, `.ai/PERFORMANCE.md`, and `.ai/TODO.md` before broad changes.

## Toolchain and commands

Use the package manager pinned in `package.json` (`pnpm@9.11.0`) and install from the lockfile:

```sh
corepack enable
pnpm install --frozen-lockfile
```

The repository currently has inconsistent Node declarations (`.nvmrc`, CI, and Docker); do not silently choose a new baseline. Modernizing and aligning them is a planned task.

Run checks proportional to the change:

```sh
pnpm lint
pnpm typecheck
pnpm exec vitest run --environment jsdom
pnpm build
pnpm test:e2e --project=chromium --reporter=line
```

`pnpm test:unit` starts Vitest in its default mode and may watch locally; use the explicit `vitest run` command for a one-shot verification. Browser binaries must match the pinned Playwright version.

## Implementation rules

- Keep TypeScript strictness; do not hide failures with `any`, `@ts-ignore`, or broad casts when a real type can be expressed.
- Keep tool components lazy. Avoid importing heavy parsers, datasets, editors, or all icons from application-shell code.
- Prefer Web Platform APIs or small focused imports over whole-library imports. Do not add another overlapping formatter, icon family, date library, or utility library without measuring the bundle impact.
- Heavy or attacker-controlled work (regex, parsing large documents, hashing, crypto, diffing, PDF processing) must not run synchronously on every keystroke. Use explicit actions, debounce/cancellation, size limits, and Web Workers where appropriate.
- Dispose browser resources on unmount: editor instances/models, workers, media tracks, observers, timers, and object URLs.
- Preserve arbitrary-precision values when a tool claims lossless conversion. Add boundary tests for Unicode, empty input, large integers, malformed data, and large payloads.
- Keep UI text in English unless the localization strategy is deliberately restored. Reuse the existing custom `c-*` components and UnoCSS conventions.
- Keep generated declarations (`auto-imports.d.ts`, `components.d.ts`, `.eslintrc-auto-import.json`) generated; do not hand-edit them except to repair the generator workflow itself.

## Persistence and privacy

Treat tool content as potentially secret. Passwords, tokens, OTP secrets, private keys, JWTs, certificates, raw documents, diffs, and pasted configuration must not be persisted by default.

- Persist harmless preferences only, using a namespaced and versioned key.
- Content persistence must be opt-in, size-bounded, documented, and clearable.
- Do not write large text to synchronous `localStorage` on every input event; prefer throttling and IndexedDB for approved large state.
- Never send tool input to analytics, logs, CDNs, or third-party services without explicit product approval and visible disclosure.

## Testing and performance gates

- Every bug fix needs a regression test that fails before the fix.
- Pure transformations belong in unit-tested service/model files. Critical user flows and route loading belong in Playwright.
- New tools need at least a title/load smoke test plus tests for their core transformation.
- Do not accept a larger initial bundle or a chunk over 500 kB without a documented measurement and rationale.
- For performance work, record before/after raw and gzip sizes, cold-route timing, main-thread blocking time, and PWA cache impact.

## Operations and security

- Pin supported Node, pnpm, and container image versions consistently; prefer immutable image digests for releases.
- CI installs must use the frozen lockfile.
- Keep nginx compression, immutable caching for hashed assets, no-cache rules for `index.html`/service workers, SPA fallback, and security headers covered by tests.
- Run dependency and container scans for release changes. Triage exploitability rather than suppressing advisories wholesale.
- Do not run destructive Git commands or overwrite unrelated local-fork changes. Keep upstream adaptation isolated and reviewable.
