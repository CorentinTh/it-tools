# Local-Fork Engineering Roadmap

## Objective

Develop this fork forward as an independent product while selectively adapting useful upstream behavior, tests, and ideas. The current local branch is the source of truth. A clean upstream commit is not, by itself, a reason to merge or cherry-pick it.

The recommended next milestone is **P0 Stabilization and Performance Safety**: restore a green quality baseline, remove critical security exposure, fix the confirmed Text Diff leak, and move unbounded bcrypt/regex work off the main thread before adding new tools.

## Audit work completed

- [x] Inventory the complete repository structure, runtime flow, tool registry, state, build system, PWA, CI, release, and Docker paths.
- [x] Inventory 86 tools across 10 categories, 416 TypeScript/Vue files, 67 runtime dependencies, and 43 development dependencies.
- [x] Compare the local branch, local `main`, and upstream `main` without modifying local history.
- [x] Export all upstream issues to `.ai/issues/issues.json`.
- [x] Export all upstream pull requests to `.ai/prs/pull-requests.json`.
- [x] Validate 710 unique issues and 997 unique pull requests with descriptions and canonical URLs.
- [x] Analyze the complete upstream backlog into `.ai/FEATURES.md` and `.ai/FIXES.md`.
- [x] Run a second-pass gap review of every upstream item not cited in the first audit and validate promising closed reports against current local source.
- [x] Run unit tests: 138/138 passed across 33 files.
- [x] Run Chromium E2E tests: 61/61 passed across the current suite.
- [x] Run production build and inspect its 267-record manifest and 270-file Workbox precache.
- [x] Run lint and typecheck to establish the current red baseline.
- [x] Run dependency audit and classify direct/runtime versus development/transitive exposure.
- [x] Reproduce focused correctness failures in Regex, Temperature, URL, JSON, Base64 File, and command-palette paths.
- [x] Profile shell and heavy routes under normal and 4x CPU conditions.
- [x] Profile 100 kB/1 MB JSON and YAML input behavior.
- [x] Confirm the Text Diff memory leak through repeated SPA navigation and forced garbage collection.
- [x] Document architecture, fixes, feature candidates, performance opportunities, and contributor rules in English.

## Non-negotiable integration rules

- [ ] Do not merge upstream `main` wholesale.
- [ ] Do not cherry-pick an upstream PR unless it is explicitly approved in the table below and a manual adaptation would be riskier.
- [ ] Treat upstream code as a specification and source of fixtures; reimplement against the current local architecture by default.
- [ ] Preserve intentional local removals: sponsor UI, demo routes, issue templates, and unused locales must not return through conflict resolution.
- [ ] Preserve useful local persistence, but add size, privacy, migration, and clear/reset rules before expanding it.
- [ ] Put each intentional upstream adaptation in its own local change with regression tests and a rollback path.
- [ ] Recheck the current upstream diff and security advisories at implementation time; this audit is a snapshot, not a permanent version pin.
- [ ] Require a measured reason for adding a heavy dependency, another icon system, a remote API, or eager route code.

## Milestone 0 — freeze the baseline and make CI trustworthy

### 0.1 Quality baseline

- [ ] Remove the nine ESLint errors caused by stale local imports in Navbar Buttons, Base Layout, and Home.
- [ ] Resolve the six UnoCSS ordering warnings or explicitly document any accepted exception.
- [ ] Fix both nullable editor accesses reported by `pnpm typecheck`.
- [ ] Align `pnpm build` and `pnpm typecheck` on one canonical TypeScript project so one cannot hide errors from the other.
- [ ] Make `pnpm lint`, `pnpm typecheck`, unit tests, Chromium E2E, and production build green before functional refactoring.
- [ ] Add a frozen-lockfile install to every CI/release job.
- [ ] Add a route smoke test for all 86 tools that fails on page errors, chunk-load errors, and unexpected console errors.
- [ ] Add Firefox and WebKit smoke coverage after the Chromium baseline is stable.

### 0.2 Reproducible toolchain

- [ ] Select one currently supported Node LTS and align `.nvmrc`, `package.json#engines`, tsconfig, CI, Docker, and contributor documentation.
- [ ] Use Corepack with `pnpm@9.11.0` or an intentionally upgraded single version; never install an unpinned latest pnpm in Docker.
- [ ] Move build-only and type-only packages out of runtime dependencies.
- [ ] Document Bun or remove the unpinned `bun:Glob` locale-script dependency.
- [ ] Add deterministic `build:stats` and upstream-export scripts so future snapshots are reproducible.

### 0.3 Measurement guardrails

- [ ] Commit a machine-readable bundle baseline: shell size, route closures, Workbox inventory, and dynamic-import counts.
- [ ] Add long-task, DOM-count, and repeated-navigation Chromium probes for the critical routes.
- [ ] Adopt the initial budgets in `.ai/PERFORMANCE.md`, then ratchet them after each improvement.
- [ ] Capture build time, transformed modules, and peak RSS on the standard CI runner.

## Milestone 1 — P0 security and platform stabilization

### 1.1 Dependency remediation

- [ ] Triage the 125 unique advisories by reachability and browser/runtime path.
- [ ] Upgrade the direct critical `crypto-js` path first and add encryption/decryption compatibility fixtures.
- [ ] Upgrade `yaml`, DOMPurify, vue-i18n, node-forge, Lodash, Vite, and other direct vulnerable dependencies in small compatible groups.
- [ ] Upgrade Vitest/build dependencies separately from runtime packages.
- [ ] Do not copy an upstream lockfile; select currently patched versions and regenerate the local lockfile.
- [ ] Run unit/E2E/fixture suites, `pnpm audit`, and a production bundle diff after every group.
- [ ] Record accepted residual advisories with reachability and expiry dates.

### 1.2 Container and static delivery

- [ ] Select a currently fully patched nginx image using official advisories; pin tag and digest.
- [ ] Pin the Node build image by supported version and digest.
- [ ] Run nginx as non-root and verify OpenShift/Kubernetes arbitrary-UID behavior.
- [ ] Support a read-only root filesystem with explicit writable temp/cache locations.
- [ ] Add a health check, container smoke test, Trivy/Grype scan, SBOM, and provenance.
- [ ] Enable verified gzip/Brotli or precompressed assets.
- [ ] Add one-year immutable caching for hashed assets and revalidation/no-cache for HTML, service worker, and manifest.
- [ ] Add baseline security headers compatible with local-only tools and required workers.
- [ ] Support a configurable non-root internal listen port and test both direct Docker publishing and reverse-proxy deployment.
- [ ] Verify base/subpath deployments and never return `index.html` for a missing hashed asset.

### 1.3 Persistence and privacy

- [ ] Classify stored values as settings, ordinary content, sensitive content, or secrets.
- [ ] Persist settings immediately, debounce bounded ordinary content, and make large content opt-in through IndexedDB.
- [ ] Never persist private keys, OTP secrets, passwords, uploaded files, or cryptographic plaintext by default.
- [ ] Add per-tool and global clear/reset controls.
- [ ] Handle storage denial, corruption, schema migration, and quota exhaustion without losing the UI.
- [ ] Document the local-processing and persistence boundary in the product UI.

### 1.4 Secure randomness

- [ ] Replace `Math.random` in Token Generator and TOTP secret generation with `crypto.getRandomValues` plus rejection sampling to avoid modulo bias.
- [ ] Restore the missing `N` and `n` characters in the default token alphabets.
- [ ] Audit every use of shared random helpers and classify it as security-sensitive or presentation-only; security-sensitive callers must use the Web Crypto path.
- [ ] Add deterministic alphabet/length/empty-input tests and statistical sanity tests that can detect permanently missing characters without becoming flaky.
- [ ] Keep generated tokens and OTP secrets ephemeral and never persist or log them.

## Milestone 2 — P0/P1 confirmed correctness and responsiveness

### 2.1 Text Diff

- [ ] Compare a lightweight diff editor with a minimal Monaco editor-only build and record the payload/UX decision.
- [ ] Configure a real worker if Monaco remains; eliminate the main-thread fallback warning.
- [ ] Remove unused language/mode chunks from the manifest and PWA cache.
- [ ] Dispose content listeners, original/modified models, editor, and worker on unmount.
- [ ] Throttle/limit persisted diff content and handle quota errors.
- [ ] Add repeated SPA open/close memory tests and large-text interaction fixtures.
- [ ] Meet the route payload and heap budgets in `.ai/PERFORMANCE.md`.

### 2.2 Shared worker/task abstraction

- [ ] Implement a typed worker task protocol with job IDs, progress, cancellation, timeout, and structured errors.
- [ ] Terminate and replace workers for operations that cannot be interrupted safely.
- [ ] Add shared byte, nesting-depth, output-count, and elapsed-time limits.
- [ ] Ensure stale async results can never overwrite a newer input.
- [ ] Keep copy/download actions usable during and after degraded large-output rendering.

### 2.3 Bcrypt

- [ ] Replace reactive `hashSync`/`compareSync` with explicit cancellable worker actions.
- [ ] Select a practical rounds range from measured time budgets; remove the maximum of 100.
- [ ] Validate null/empty rounds and hashes without making the card disappear.
- [ ] Show running, elapsed, timeout, cancelled, success, and error states.
- [ ] Add fixtures for rounds boundaries, rapid input changes, malformed hashes, and cancellation.

### 2.4 Regex Tester

- [ ] Fix unmatched positional and named optional captures.
- [ ] Move matching, RandExp generation, and SVG rendering into bounded workers/tasks.
- [ ] Limit pattern/input/match/output/diagram sizes and add a catastrophic-backtracking fixture.
- [ ] Debounce query/storage synchronization and async diagram rendering.
- [ ] Cancel work on route leave and verify the previous tool cannot remain visible.

### 2.5 Large structured/text input

- [ ] Add a shared plain-text or virtualized output mode above a measured threshold.
- [ ] Parse JSON/YAML once per change and reuse the result for validation and formatting.
- [ ] Move large JSON/YAML/TOML/XML/SQL/Markdown processing into workers where supported.
- [ ] Add 100 kB, 1 MB, deep, malformed, and oversized fixtures.
- [ ] Ensure a 1 MB result stays below 5,000 DOM nodes and creates no >50 ms main-thread task.
- [ ] Apply the same bounded output policy to regex matches, generated lists, diff trees, and table tools.

### 2.6 Small confirmed fixes

- [ ] Correct Base64 File MIME lookup and raw Base64 preview/download data-URI handling.
- [ ] Round Temperature Converter correctly around floating-point boundaries and reject values below absolute zero for every scale.
- [ ] Preserve repeated URL query values and display fragments.
- [ ] Add named RFC3986/RFC5987/form URL encoding modes instead of presenting `encodeURIComponent` as the only standard.
- [ ] Choose and document a lossless large-integer strategy for JSON/YAML.
- [ ] Reset/clamp command-palette selection and guard Enter on an empty result.
- [ ] Escape CSV quotes as `""` and quote comma/newline/quote fields correctly.
- [ ] Return zero words for whitespace-only Text Statistics input and compute all statistics in one bounded pass.
- [ ] Revoke Camera Recorder object URLs on delete/unmount and bound retained media.
- [ ] Fix `TextareaCopyable` element tracking and autosize/follow-height behavior.
- [ ] Enforce every `TextareaCopyable.copyPlacement` value, especially `none`, without duplicate buttons.
- [ ] Stop emitting the obsolete top-level Compose `version` field.
- [ ] Correct the PWA manifest language to English.
- [ ] Apply the UnoCSS native `size` exclusion and remove the local size workaround.

## Milestone 3 — P1 high-impact performance

### 3.1 PWA and network

- [ ] Precache only the shell and critical static assets.
- [ ] Runtime-cache content-hashed lazy chunks after first use.
- [ ] Add an optional explicit full-offline download flow if required.
- [ ] Provide an offline-unavailable state rather than a blank tool.
- [ ] Keep the mandatory precache below 1 MB raw.
- [ ] Add container tests for compression, immutable caching, SW update, and stale-cache cleanup.

### 3.2 Emoji Picker

- [ ] Virtualize or page the 1,870 emoji cards and category groups.
- [ ] Keep initial DOM below 2,000 nodes.
- [ ] Keep search cancellable, keyboard accessible, and virtualized.
- [ ] Load secondary metadata only when needed.
- [ ] Refresh `unicode-emoji-json` and `emojilib` against the current Unicode Emoji release after reviewing compatibility, licenses, and bundle impact.
- [ ] Record the Unicode Emoji/data-source version and generation date so the catalog can be updated reproducibly.
- [ ] Normalize full code-point sequences instead of assuming one code point; cover ZWJ families/professions, flags, keycaps, variation selectors, and skin-tone modifiers.
- [ ] Add fixtures for newly introduced emoji and aliases/keywords that were missing from the previous dataset.
- [ ] Verify that the updated catalog does not regress initial payload, DOM count, search latency, or offline-cache budgets.
- [ ] Verify the 4x CPU route task is below 200 ms.

### 3.3 MAC Address Lookup

- [ ] Generate and benchmark compact sorted, binary, and partitioned forms of the 34,503-entry OUI database.
- [ ] Load only the prefix bucket needed for a typical lookup.
- [ ] Decode/search off the main thread if the chosen format requires material work.
- [ ] Make database generation reproducible and record source/version metadata.
- [ ] Target a typical route payload below 250 kB gzip.

### 3.4 Shell and Home

- [ ] Generate lightweight tool descriptors and a route/component map.
- [ ] Consolidate four icon mechanisms into direct virtual icons or a generated sprite.
- [ ] Remove full CommonJS Lodash from shared shell paths.
- [ ] Precompute/remove runtime `isNew` date logic.
- [ ] Lazily initialize drag-and-drop and command-palette search.
- [ ] Progressively render or virtualize the Home tool grid.
- [ ] Reduce shell JavaScript to 200 kB gzip or less and Home 4x CPU work below 300 ms.

### 3.5 Quick Search / Command Palette

Current status: tool `keywords` are already indexed by Fuse, but the canonical path/stable tool ID is not indexed and the visible result set is truncated to five entries per category.

- [ ] Define a stable, locale-independent `id` for every tool, or formally use the normalized route path as that ID.
- [ ] Index exact tool ID, normalized path, display name, category, description, aliases, and the existing keyword list.
- [ ] Rank exact ID/path/name matches first, then prefix matches, then keyword matches, and only then fuzzy description matches.
- [ ] Normalize leading slashes, spaces, hyphens, underscores, and common aliases so queries such as `jsondiff`, `json-diff`, and `/json-diff` resolve consistently.
- [ ] Audit every tool descriptor for useful English keywords and add tests proving keyword-only queries return the expected tool.
- [ ] Show more than five results per category and add an accessible **Show all results** flow instead of silently discarding matches.
- [ ] Use a configurable global/category limit and virtualize the expanded list if necessary so more results do not recreate the Emoji Picker rendering problem.
- [ ] Rebuild search options reactively when tool metadata changes instead of retaining a one-time snapshot.
- [ ] Reset/clamp keyboard selection whenever the query/result list changes and guard Enter on an empty result.
- [ ] Add keyboard, screen-reader, exact-ranking, keyword, ID/path, no-result, and large-result Playwright tests.
- [ ] Measure first-open index construction and search latency; initialize during idle time or first use without increasing the application shell.

### 3.6 Reactive computation cleanup

- [ ] Replace `computedRefreshable`/`computedRefreshableAsync` with a single-execution, cancellable abstraction.
- [ ] Prove one generation per dependency change/refresh for UUID, ULID, token, MAC, lorem, OTP, port, and RSA.
- [ ] Debounce and order QR/Wi-Fi QR generation.
- [ ] Format WYSIWYG HTML on idle/debounce or explicit action for large content.
- [ ] Reduce Math Evaluator to a configured math build and bound expression complexity.
- [ ] Compute JSON Diff status in one traversal and virtualize/lazily expand the tree.
- [ ] Use one streaming pass for Text Statistics and worker mode for very large text.

## Milestone 4 — P2 build, CI, and developer throughput

- [ ] Replace icon package barrels and Monaco root imports; compare module counts after each experiment.
- [ ] Narrow auto-component scanning to reusable component directories.
- [ ] Remove unused packages, stale imports, demos, and duplicate parser/render libraries where behavior permits.
- [ ] Build the production artifact once and reuse it in all E2E shards.
- [ ] Fix the Playwright cache key to use `devDependencies['@playwright/test']`.
- [ ] Reuse the tested artifact for release packaging and container content where provenance remains verifiable.
- [ ] Use BuildKit cache mounts and `pnpm fetch` for Docker dependency layers.
- [ ] Share architecture-independent build output across multi-architecture images.
- [ ] Target a warm production build below 20 seconds on the audit runner.

## Milestone 5 — selected feature development

Do not start broad feature work until Milestones 0–2 are green. Then select one small product slice from `.ai/FEATURES.md` and require performance/security budgets from design time.

Recommended first feature candidates:

- [ ] NanoID Generator with secure browser randomness, length/quantity controls, optional custom alphabet, collision/entropy guidance, copy/download actions, and strict output limits. Use open [PR #1138](https://github.com/CorentinTh/it-tools/pull/1138) only as a requirements reference; implement locally and lazy-load any dependency.
- [ ] CLI Command Editor with lossless POSIX/PowerShell quoting and option round trips.
- [ ] Modern identifier workspace: UUID v6/v7 and format normalization plus Mongo ObjectID/Snowflake inspection.
- [ ] DevOps config workspace: Dockerfile lint, Compose validation/`.env` extraction, nginx formatting, and properties/YAML conversion.
- [ ] JSON Schema validation and structured error paths.
- [ ] JSON schema/code generation plugins, JSON size analysis, and RFC 6902 path generation on one lossless parsed model.
- [ ] Local file hashing with streaming/chunked workers.
- [ ] Local file identification, hex conversion, and CRC calculation with streaming workers.
- [ ] SAML decoder and LDAP/FILETIME timestamp support with explicit verification/timezone semantics.
- [ ] URL safety workspace with strict encoding, tracker removal, defang/refang, UTM, and text-fragment modes.
- [ ] Developer text workspace with stacktrace formatting, smart replace, folder tree, Markdown TOC, and paste-as-Markdown.
- [ ] QR/barcode decoding from local images.
- [ ] Certificate/CSR inspection with no network dependency.
- [ ] JSON repair and optional jq-like querying with strict resource limits.
- [ ] Docker command conversion improvements and fixtures.
- [ ] IPv6 expansion and network calculator correctness.
- [ ] Passphrase/Argon2/AES-GCM features only after the crypto dependency and worker foundation is complete.

Features to defer unless the product boundary changes explicitly:

- [ ] REST backend, authentication, accounts, or cloud persistence.
- [ ] API-dependent GeoIP/DNS/SSL features that weaken offline/local-only behavior.
- [ ] OTP-secret persistence.
- [ ] Bulk restoration of removed locales or sponsor UI.
- [ ] Heavy AI/file-processing tools without explicit bundle, privacy, and memory designs.

## Explicit upstream adaptations

Every row is an explicit candidate to adapt manually. It is **not** approval to cherry-pick the source commit.

| Upstream source | Local intent | Required local adaptation |
|---|---|---|
| Merged [PR #1552](https://github.com/CorentinTh/it-tools/pull/1552) | Fix native input `size`/UnoCSS collision | Apply the one-line preset behavior manually, restore the intended input size, and add a component regression test |
| Open [PR #1802](https://github.com/CorentinTh/it-tools/pull/1802) plus targeted security PRs | Dependency remediation intent | Select current compatible patched versions; do not import its old lockfile or version set |
| Open [PR #1796](https://github.com/CorentinTh/it-tools/pull/1796) | Patch nginx/container exposure | Use official current advisories, pin tag+digest, scan, and do not repeat the PR's overstated severity |
| Open [PR #1152](https://github.com/CorentinTh/it-tools/pull/1152) | Bcrypt async states, cancellation, practical limits | Implement with a dedicated worker and local time budgets; reuse its scenarios as fixtures |
| Open [PR #1391](https://github.com/CorentinTh/it-tools/pull/1391) | Optional regex captures | Reimplement null-safe positional/named indices and add worker/timeout coverage |
| Closed [PR #873](https://github.com/CorentinTh/it-tools/pull/873) | Repeated URL query parameters | Preserve all values and add fragment, encoding, and repeated-key fixtures |
| Open [PR #1491](https://github.com/CorentinTh/it-tools/pull/1491) | Temperature rounding | Adapt the numeric rule with positive/negative boundary tests |
| Open [PR #1153](https://github.com/CorentinTh/it-tools/pull/1153) | Temperature physical limits | Reimplement per-scale absolute-zero bounds and test exact/below-boundary values |
| Open [PR #1138](https://github.com/CorentinTh/it-tools/pull/1138) | NanoID Generator requirements | Implement a local lazy tool with Web Crypto-backed randomness, stable route/keywords, bounded quantity/length/alphabet controls, and statistical/property fixtures; do not copy the PR component |
| Open [PR #913](https://github.com/CorentinTh/it-tools/pull/913) | Token Generator usability | Reuse multi-token, numeric length, denied-character, and settings requirements only; replace its randomness with the local Web Crypto design |
| Open [PR #1441](https://github.com/CorentinTh/it-tools/pull/1441), [PR #1149](https://github.com/CorentinTh/it-tools/pull/1149), and [PR #742](https://github.com/CorentinTh/it-tools/pull/742) | UUID v6/v7 and normalization | Update the UUID library intentionally, add RFC/version fixtures, and integrate formats into one identifier workspace |
| Open [PR #1602](https://github.com/CorentinTh/it-tools/pull/1602) | CLI Command Editor requirements | Design a tested shell AST first; preserve quoting, repeated flags, `--`, pipes, redirection, and platform modes rather than copying its parser |
| Open [PR #1474](https://github.com/CorentinTh/it-tools/pull/1474) | URL encoding standards | Adapt named RFC3986/RFC5987 modes with authoritative fixtures and keep the current component local |
| Open [PR #1479](https://github.com/CorentinTh/it-tools/pull/1479) and [PR #1439](https://github.com/CorentinTh/it-tools/pull/1439) | WPA3 Wi-Fi QR and raw-content copy | Verify payloads against the current Wi-Fi QR specification and test transition/WPA3-only scanning before exposing them |
| Open [PR #901](https://github.com/CorentinTh/it-tools/pull/901) | Integer Base input conventions | Adapt prefix/suffix fixtures and case-insensitive bases <=36 without changing case-sensitive base 37–64 behavior |
| Open [PR #964](https://github.com/CorentinTh/it-tools/pull/964) | Chmod input and special bits | Add octal/symbolic parsing plus setuid/setgid/sticky/mask fixtures to the existing model |
| Open [PR #1643](https://github.com/CorentinTh/it-tools/pull/1643) and [PR #1542](https://github.com/CorentinTh/it-tools/pull/1542) | Escaped JSON mode | Reuse its extensive scenarios but implement an explicit non-destructive mode on the parse-once/large-input foundation |
| Open [PR #1169](https://github.com/CorentinTh/it-tools/pull/1169) and [PR #846](https://github.com/CorentinTh/it-tools/pull/846) | Shared output actions | Add bounded download support and correctly implement all copy placements in current shared components |
| Open [PR #1670](https://github.com/CorentinTh/it-tools/pull/1670) and [PR #427](https://github.com/CorentinTh/it-tools/pull/427) | Configurable container listen port | Adapt to the selected non-root nginx image with runtime templating and container tests |
| Open [PR #1452](https://github.com/CorentinTh/it-tools/pull/1452), [PR #965](https://github.com/CorentinTh/it-tools/pull/965), [PR #1014](https://github.com/CorentinTh/it-tools/pull/1014), and issue [#1828](https://github.com/CorentinTh/it-tools/issues/1828) | DevOps config workspace | Extract schemas/fixtures and build route-local lint/format/env plugins without merging the separate UIs |
| Open [PR #1016](https://github.com/CorentinTh/it-tools/pull/1016), [PR #1263](https://github.com/CorentinTh/it-tools/pull/1263), and [PR #1140](https://github.com/CorentinTh/it-tools/pull/1140) | File inspection workspace | Reimplement as streaming worker tasks with magic-byte, hex, CRC, cancellation, and memory fixtures |
| Open [PR #1307](https://github.com/CorentinTh/it-tools/pull/1307), [PR #1290](https://github.com/CorentinTh/it-tools/pull/1290), and [PR #1020](https://github.com/CorentinTh/it-tools/pull/1020) | Developer text workflows | Share the lightweight editor/output foundation and adapt format-specific fixtures, not entire components |
| Issues [#1801](https://github.com/CorentinTh/it-tools/issues/1801) and [#1806](https://github.com/CorentinTh/it-tools/issues/1806) | SAML and enterprise timestamps | Implement local decode-only SAML with sanitized XML and extend Date-Time with explicit FILETIME/LDAP epoch semantics |
| Open [PR #1740](https://github.com/CorentinTh/it-tools/pull/1740) and [PR #1813](https://github.com/CorentinTh/it-tools/pull/1813) | Favicon/app icon generation | Consolidate both proposals, use bounded Canvas/Blob processing, revoke URLs, and validate ZIP/manifest contents |
| Open [PR #1166](https://github.com/CorentinTh/it-tools/pull/1166) and [PR #1323](https://github.com/CorentinTh/it-tools/pull/1323) | JSON schema/codegen/size requirements | Add plugins on the lossless parse-once worker model instead of creating more independent parsers |
| Open [PR #1085](https://github.com/CorentinTh/it-tools/pull/1085) and [PR #1087](https://github.com/CorentinTh/it-tools/pull/1087) | Unicode/code-point correctness | Reimplement with `TextEncoder`/code points and non-BMP fixtures across related text tools |
| Open [PR #1434](https://github.com/CorentinTh/it-tools/pull/1434) | Large-integer preservation | Use its fixtures while selecting one coherent JSON/YAML policy for this fork |
| Open [PR #1651](https://github.com/CorentinTh/it-tools/pull/1651) | Resilient ASCII font loading | Bundle a default font first, then adapt HTTPS cache/fallback behavior with cancellation |
| Open [PR #1170](https://github.com/CorentinTh/it-tools/pull/1170) | All-tool smoke coverage | Expand it to all 86 routes, console/page errors, chunk failures, and local persistence isolation |
| Closed [PR #1374](https://github.com/CorentinTh/it-tools/pull/1374) | Emoji bounded rendering | Benchmark pagination versus virtualization and preserve accessibility; do not copy presentation wholesale |
| Closed [PR #1373](https://github.com/CorentinTh/it-tools/pull/1373) | Icon inventory/consolidation | Reuse mapping research only; prefer direct virtual modules/sprite over another large barrel |
| Open [PR #1443](https://github.com/CorentinTh/it-tools/pull/1443) | Generated registry/scaffolding ideas | Adapt generation to the local descriptor/category/i18n model and include deterministic validation |
| Open [PR #1743](https://github.com/CorentinTh/it-tools/pull/1743) | Mobile menu and accessibility behavior | Port behavior and test cases into current custom components, not its full component diff |
| Closed [PR #1064](https://github.com/CorentinTh/it-tools/pull/1064) and open [PR #1640](https://github.com/CorentinTh/it-tools/pull/1640) | Autosize/follow-height fixes | Reimplement around exposed DOM refs and ResizeObserver lifecycle with UUID/JSON/YAML fixtures |
| Open [PR #845](https://github.com/CorentinTh/it-tools/pull/845) | Docker command parser correctness | Extract quoted-value/command fixtures and adapt to current `composerize-ts` behavior |
| Open [PR #967](https://github.com/CorentinTh/it-tools/pull/967) | PDF signature compatibility | Reuse representative certificate fixtures; preserve local-only parsing and graceful unsupported states |
| Open [PR #1288](https://github.com/CorentinTh/it-tools/pull/1288) and [PR #1302](https://github.com/CorentinTh/it-tools/pull/1302) | List conversion/sort behavior | Adapt tests and explicit “no sort” semantics without importing unrelated UI changes |
| Open [PR #903](https://github.com/CorentinTh/it-tools/pull/903) | Timestamp unit handling | Adapt explicit seconds/ms/µs/ns detection with UTC and boundary fixtures |

### Upstream commits currently ahead of local `main`

| Commit/PR | Decision |
|---|---|
| `a4ab7db` / #1552 | Adapt the UnoCSS configuration manually as listed above |
| `07eea0f` / #1553 | Do not transfer; sponsor removal is already superseded locally |
| `0de73e8` / #1664 | Do not transfer; it reintroduces sponsor material intentionally removed locally |
| `d505845` / #1733 | Do not transfer; README sponsor churn has no local product value |

## Definition of done for each implementation slice

- [ ] The change is based on the current local branch and contains no unrelated upstream history.
- [ ] The originating issue/PR fixtures are recorded in local tests.
- [ ] Invalid, Unicode, large, deep, stale-async, cancellation, and route-leave cases are covered where relevant.
- [ ] Lint, canonical typecheck, unit tests, all-route smoke, affected E2E, and production build pass.
- [ ] Bundle/PWA/container diffs are reviewed when dependencies or delivery change.
- [ ] No new console error, worker fallback, object URL, model, event listener, timer, or storage leak is introduced.
- [ ] Security/privacy behavior and persisted values are documented.
- [ ] Measured before/after results are added to the change description.
- [ ] `.ai/TODO.md`, `.ai/FIXES.md`, or `.ai/PERFORMANCE.md` is updated when the finding is resolved or disproved.

## Decision required before implementation

The recommended first approved slice is:

1. restore green lint/typecheck and add route/bundle baselines;
2. replace insecure Token/TOTP randomness and restore the complete alphabets;
3. fix the Text Diff leak, worker warning, and import shape;
4. replace reactive bcrypt/regex work with cancellable worker flows;
5. add large-output fallback for JSON/YAML;
6. update the first critical dependency group.

This slice addresses confirmed risk and creates the measurement foundation needed for every later optimization.
