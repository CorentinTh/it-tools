# Local-Fork Engineering Roadmap

## Objective

Develop this fork forward as an independent product while selectively adapting useful upstream behavior, tests, and ideas. The current local branch is the source of truth. A clean upstream commit is not, by itself, a reason to merge or cherry-pick it.

The active milestone combines **P0 Correctness and Performance Safety** with
bounded Milestone 5 product slices: keep the quality baseline green, resolve
locally reproduced defects, move remaining large structured work off the main
thread, and deliver small features against explicit privacy/output/bundle
budgets. The first feature/structured-data slice (NanoID plus strict JSON
numeric-lexeme and YAML integer-preserving Prettify) is complete. Dependency/base-image vulnerability remediation
remains a separate deferred security track.

The latest autonomous DevOps/JSON/crypto-authoring wave is complete: bounded
structured-data-to-`.env` extraction, RFC 6902 JSON Patch, explicit HMAC key
representations, a precise legacy-encryption capability boundary, and the
Token Generator UX closure are delivered inside existing lazy routes with
explicit privacy, size, lifecycle, output, and bundle boundaries.

The following existing-route interoperability wave is also implementation-
complete: exact Integer Base notation/case semantics, shared bounded downloads
across 17 transformation/authoring paths, canonical URL-state Home filtering,
keyboard favorite reordering, and removal of the eager `vuedraggable`/
`sortablejs` shell dependency. Mandatory Workbox headroom is restored from
2,160 B to 110,057 B under unchanged ceilings. All local gates, 5/5 targeted
source-dev scenarios, and the fresh all-123-route source-dev smoke pass.

The next measured feature goal is also complete: lazy local Argon2id `v=19`
hash/verify uses pinned `hash-wasm@4.12.0` only in a disposable route-owned
worker, Web Crypto salts, RFC 9106 memory-constrained defaults, strict PHC and
resource bounds, ephemeral sensitive values, and independent compatibility plus
source-dev privacy/cancel coverage. The current 124-route checkpoint passes all
gates and retains 108,890 B of mandatory Workbox raw headroom.

The following measured feature goal is complete as well: Markdown Diff uses no
new editor or diff dependency, runs bounded line/word source alignment in a
disposable worker, and exposes equal peer inputs plus optional last-successful
previews with raw HTML, links, and images disabled and a static DOMPurify
allow-list. DOMPurify is pinned at patched `3.4.13`. The current 125-route
checkpoint passes all gates and retains 107,841 B of mandatory Workbox raw
headroom.

The next measured feature goal is complete: DNS-over-HTTPS Query performs one
explicit bounded RFC 8484 binary POST to a fixed two-mode Cloudflare resolver
allow-list, never places the query in URL/storage/analytics/application logs,
and prominently discloses that the resolver still sees the name/type, client IP,
and ordinary transport metadata. Strict DNS wire, response, output, timeout,
replacement, cancellation, and disposal checks are covered. The current
126-route checkpoint passes all gates and retains 106,939 B of mandatory
Workbox raw headroom; PR #1371 supplied requirements only and no upstream code
was copied.

The following measured feature goal is complete: Mermaid Diagram Renderer/
Exporter loads exact patched `mermaid@10.9.8` only after an explicit action and
accepts only Flowchart, Sequence, Class, State, and ER input under fixed strict
configuration. Frontmatter/init, HTML, click/link/style directives, URLs, and
unsupported families are rejected before loading the engine. Sanitized bounded
SVG is shown only in a scriptless network-denying sandbox and exported as SVG or
allocation-bounded PNG. Content remains ephemeral; late work is invalidated on
cancel/edit/clear/unmount, with the synchronous DOM residual explicitly
disclosed. The current 127-route checkpoint passes all gates and retains
104,916 B of mandatory Workbox raw headroom. Registry audit also moved shared
`lodash`/`lodash-es` to patched `4.18.1`; no upstream implementation code was
copied.

The following measured feature goal is complete: Parquet Reader uses exact
dependency-free `hyparquet@1.28.2` only inside one lazy disposable worker to
inspect a local file and decode a selected bounded page. PAR1/footer/schema/
row-group/column metadata, offsets, nesting, chunk sizes, aggregate reads,
preview cells, JSON/CSV output, runtime, replacement, cancellation, and unmount
are independently bounded. The first release supports UNCOMPRESSED and SNAPPY;
unsupported codecs remain inspectable, while encrypted/external layouts are
rejected. Content is ephemeral and has no URL/storage/network/analytics/log
path. The current 128-route checkpoint passes all gates and retains 103,226 B
of mandatory Workbox raw headroom. `parquet-wasm`/Arrow, DuckDB-Wasm, optional
compressors, whole-file export, and XLSX were measured or considered but remain
separate decisions. PR #1529 supplied requirements only; no upstream code was
copied.

The separate XLSX feasibility gate is now complete and approved only the
delivered narrow reader. General spreadsheet/ZIP packages were rejected after
license/package/memory review. Exact `saxen@11.1.1`, native raw-DEFLATE, and a
repository-owned ZIP/OPC boundary now provide macro-free metadata and one
200-row/32-column page in a disposable worker. ZIP64, encryption, macros,
unsafe/ambiguous paths, external fetches, formulas, style/date interpretation,
whole-workbook export, and non-UTF-8 XML remain outside scope. The current
129-route checkpoint passes all gates and retains 101,558 B of mandatory
Workbox raw headroom. See `.ai/experiments/XLSX_READER_DESIGN.md`.

**Priority update — 2026-08-15:** the catalog-wide interface-consistency
foundation and route rollout are complete under `.ai/UI_CONSISTENCY.md`.
The deterministic screenshot/state suite now covers all five core archetypes
plus true diff: explicit-task loading/disabled controls, mobile-dark errors,
dense long-value/results, live-transformer error/stale output, local-file empty/
disabled/legacy guidance, aligned diff output, and mobile-dark reference search.
QR/Wi-Fi QR ordering, bounded WYSIWYG formatting, bounded JSON Diff alignment,
the Math/SQL/XML/Markdown/Text Statistics worker slice, all JSON/YAML/TOML/XML
converter pairs, and Docker Run-to-Compose isolation are complete. New work
must use the accepted field/control/action/layout and bounded-task contracts.

For a new machine or AI session, read `.ai/HANDOFF.md` first. See
`.ai/PROGRESS.md` for the live journal, verified
commands, measurements, risks, and next gates. In checklist text, `IN PROGRESS`
means implementation exists but the full Definition of Done is not yet met.

## Audit work completed

- [x] Inventory the complete repository structure, runtime flow, tool registry, state, build system, PWA, CI, release, and Docker paths.
- [x] Inventory the original 86 tools across 10 categories, 416 TypeScript/Vue files, 67 runtime dependencies, and 43 development dependencies; local NanoID, JSON Schema Validator, and File Hash delivery brings the current registry to 89 tools.
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
- [x] Inventory shared controls and all tool SFCs for field, choice, width, action, responsive, accessibility, and visual-test consistency; record the active migration plan in `.ai/UI_CONSISTENCY.md`.

## Priority UX slice — interface consistency

- [x] Capture the representative Vite-dev live baseline in Orca and maintain an executable all-route desktop/light plus mobile/dark responsive/theme/semantics matrix (125 routes at the current checkpoint).
- [x] Define shared spacing, control-height, radius, focus, content-width, field-width, and the initial responsive layout tokens.
- [x] Add one `c-field` contract for labels, descriptions, required/optional state, validation, and stable feedback space.
- [x] Add an accessible full-width `c-input-number` bridge that puts identity/ARIA state on the native input; adopt it in Percentage, UUID, and ULID before the remaining numeric-control rollout.
- [x] Repair `c-input-text`, `c-select`, `c-file-upload`, `c-buttons-select`, and `c-button` behavior and accessibility with failing regressions first.
- [x] Define checkbox, switch, segmented/radio, numeric, and slider semantics through tested route-level adapters.
- [x] Add a global executable guard that prevents direct Naive switches, checkboxes, color pickers, fixed input groups, form items, and number inputs from entering migrated route code; the completed RSA repair removes the final temporary exception.
- [x] Add shared tool section, action bar, and status/result placement primitives without owning tool business logic.
- [x] Migrate and visually accept the representative pilot routes listed in `.ai/UI_CONSISTENCY.md`; the broader all-route light/dark screenshot matrix remains a separate hardening gate.
- [x] Apply the wide always-vertical editor contract to the shared transformer family and direct JSON/YAML/SQL/Docker plus text-conversion routes; only true diff tools may place editors side by side.
- [x] Unify UUID/ULID/NanoID around NanoID's options -> output -> actions structure and verify the family in Orca dev.
- [x] Migrate the first dense/form/numeric slice: List Converter, Wi-Fi QR, and Percentage Calculator, with shared field/layout contracts and Vite-dev DOM/behavior acceptance.
- [x] Migrate Regex Tester to the wide explicit-task pattern with a labelled six-checkbox group and responsive keyboard/E2E coverage.
- [x] Migrate Token, Random Port, MAC Address, IPv6 ULA, and Lorem Ipsum to the accepted generator rhythm; add explicit primary Generate actions where missing.
- [x] Remove direct Naive switch/number/form wrappers and literal 100 px option widths from JSON, YAML, and XML formatters.
- [x] Remove direct `n-switch` usage from every tool route and add a global source ratchet; all 23 route-level switches now use `CSwitch`.
- [x] Complete the numeric/form/catalog control wave: migrate Bcrypt, ASCII Art, ETA, Integer Base, Roman Numeral, Temperature, BIP39, Benchmark Builder, Chmod, Hash Text, Keycode, Open Graph, Date-time, IPv4, OTP, URL Parser, Case Converter, HTML Entities, Markdown, SafeLink, QR, Wi-Fi QR, SVG Placeholder, Color Converter, and RSA. Direct Naive checkbox/switch/color/input-group/form-item/number-input usage and literal label widths are zero.
- [x] Roll out the accepted patterns to the remaining routes by live-transformer, explicit-task, generator, local-file, and reference/catalog archetype.
- [x] Add the first deterministic screenshot baselines for explicit-task loading/disabled controls, mobile dark validation errors, and dense-form long-value/result layout. Semantic assertions run on every platform; the pixel references are Darwin Chromium baselines.
- [x] Expand deterministic baselines across the five core archetypes plus true diff, including long-value, disabled, error, loading, empty, legacy-guidance, and result combinations. Seven Darwin Chromium pixel references retain cross-platform semantic assertions.
- [x] Document only justified editor/media/table exceptions and reject new literal label widths or mixed field systems through executable source ratchets.

### Targeted correctness backlog discovered during UI review

- [x] Reproduce and repair RSA Key Pair Generator failures: replace the
  arbitrary `+/- 8` bit spinner and reactive regeneration on every size change
  with an explicit supported-key-size choice plus an explicit `Generate`
  action. Keep the previous pair while a new request runs, expose loading and
  bounded static errors, define the practical browser-supported size policy,
  and add component/service/browser regressions for presets, repeated actions,
  failure, cancellation, and unmount. The accepted 2,048/3,072/4,096-bit policy
  uses Web Crypto in a route-owned terminate-and-replace worker, so cancellation,
  timeout, replacement, and unmount physically stop the owned task.

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

- [x] Remove the current ESLint errors caused by stale local imports (the implementation-day baseline was 6 errors; the older audit recorded 9).
- [x] Resolve the current UnoCSS ordering warnings (3 at implementation start; the native `size` collision remains a separate item).
- [x] Fix both nullable editor accesses reported by `pnpm typecheck`.
- [x] Align `pnpm build` and `pnpm typecheck` on canonical application/test plus Vite-config checks so one cannot hide errors from the other.
- [x] Make `pnpm lint`, `pnpm typecheck`, unit tests, Chromium E2E, and production build green; the current checkpoint is 1243/1243 unit across 213 files, 324/324 artifact checks, all 120 registry routes, and 3/3 targeted scenarios for the latest bounded storage/privacy/crypto wave. The earlier isolated performance/full functional matrices remain historical evidence.
- [x] Add a frozen-lockfile install to every CI/release job.
- [x] Add a Chromium route smoke test for all registered tools (120 at the current 2026-08-16 checkpoint) that fails on page errors, chunk-load errors, unexpected console errors, and Monaco worker fallback warnings.
- [ ] Add Firefox and WebKit smoke coverage after the Chromium baseline is stable.

### 0.2 Reproducible toolchain

- [x] Select Node 24.18.0 and align `.nvmrc`, `package.json#engines`, tsconfig, CI, Docker, and contributor documentation; keep the remaining `@types/node` upgrade in its controlled dependency group.
- [x] Use Corepack with the package-manager-pinned `pnpm@9.11.0`; never install an unpinned latest pnpm in Docker.
- [x] Separate local dev (`127.0.0.1:8091`) from preview (`127.0.0.1:5050`), enforce strict ports/no-store dev responses, add `dev:fresh`, automatically evict only stale IT Tools PWA state in development, and prebundle worker/lazy-route dependencies (`jsonc-parser` and Monaco included) with unit and Chromium smoke coverage.
- [x] Move build-only and type-only packages out of runtime dependencies.
- [ ] Document Bun or remove the unpinned `bun:Glob` locale-script dependency.
- [x] Add deterministic schema-v4 `build:stats` generation and regression tests; literal route-owned workers are included in closures and fail closed when missing, malformed, or unrelated.
- [ ] Add a reproducible upstream-export script before refreshing the research snapshot.

### 0.3 Measurement guardrails

- [x] Generate and maintain a machine-readable bundle baseline with shell size, route closures, Workbox inventory, dynamic-import counts, and stable membership digests.
- [x] Add repeated-navigation heap/DOM/listener Chromium probes for Text Diff and the shared Home/tool layout.
- [ ] Extend long-task and DOM-count Chromium probes to the remaining critical routes.
- [x] Enforce initial no-regression shell, Workbox, default dynamic-route, and reviewed heavy-route ceilings in CI/release; keep aspirational product targets separate and ratchet ceilings after improvements.
- [ ] Capture build time, transformed modules, and peak RSS on the standard CI runner.

## Milestone 1 — platform, persistence, and deferred security work

### 1.1 Dependency remediation — DEFERRED SECURITY TRACK

These items remain recorded, but are intentionally outside the current
project-correctness slice. Do not add advisory suppressions or spend current
implementation time on unrelated base-image/transitive CVEs.

- [ ] Triage the 125 unique advisories by reachability and browser/runtime path.
- [ ] Upgrade the direct critical `crypto-js` path first and add encryption/decryption compatibility fixtures.
- [x] Upgrade and exactly pin DOMPurify to patched `3.4.13`; preserve existing component tests plus the Markdown Diff no-active-content preview regression.
- [ ] Upgrade `yaml`, vue-i18n, Vite, and other direct vulnerable dependencies in small compatible groups; `lodash` and transitive `lodash-es` are now pinned at patched `4.18.1`, and direct RSA use of `node-forge` is removed while its transitive PDF path remains in the reachability audit.
- [ ] Upgrade Vitest/build dependencies separately from runtime packages.
- [ ] Do not copy an upstream lockfile; select currently patched versions and regenerate the local lockfile.
- [ ] Run unit/E2E/fixture suites, `pnpm audit`, and a production bundle diff after every group.
- [ ] Record accepted residual advisories with reachability and expiry dates.

### 1.2 Container and static delivery

- [ ] Select and verify a currently patched nginx image as part of the deferred security track; the delivery image is already pinned by tag and digest for reproducibility.
- [x] Pin the Node build image by supported version and digest.
- [x] Run nginx as non-root and verify both the image UID and an arbitrary runtime UID under a read-only root filesystem.
- [x] Support a read-only root filesystem with explicit writable temp/cache locations.
- [x] Add a health check and automated container smoke test.
- [x] Declare release SBOM and provenance generation.
- [ ] Add a vulnerability scan gate only when the deferred security track is resumed.
- [x] Enable and verify gzip; Brotli/precompressed assets remain an optional later optimization.
- [x] Add and smoke-test one-year immutable caching for hashed assets plus revalidation/no-cache for HTML, service worker, and manifest.
- [x] Add baseline security headers compatible with local-only tools and required workers.
- [x] Support a configurable non-root internal listen port and test direct Docker publishing on default and alternate ports.
- [ ] Add reverse-proxy deployment acceptance coverage.
- [x] Never return `index.html` for a missing static/hashed asset.
- [ ] Verify a real base/subpath deployment end to end.

### 1.3 Persistence and privacy

- [x] Classify stored values as settings, ordinary content, sensitive content, or secrets; maintain the inventory in `.ai/PERSISTENCE.md`.
- [ ] Persist settings immediately, debounce bounded ordinary content, and make large content opt-in through IndexedDB.
- [x] Never persist private keys, OTP secrets, passwords, uploaded files, or cryptographic plaintext by default; the complete current storage-call inventory has no such key.
- [x] Add per-tool and global clear/reset controls: Text Diff owns its content reset, and About clears only managed IT Tools keys while preserving unrelated same-origin data.
- [ ] Handle storage denial, corruption, schema migration, and quota exhaustion without losing the UI.
- [x] Document the local-processing and persistence boundary in the About UI, including Text Diff opt-in behavior and secret/content defaults.
- [x] Keep tool content out of URL/history and analytics by default: Regex accepts an explicit incoming `?regex=` value but never writes editor changes back, while custom events/pageviews use path-only URLs and sanitize referrer credentials/query/hash.

### 1.4 Secure randomness

- [x] Replace `Math.random` in Token Generator and TOTP secret generation with `crypto.getRandomValues` plus rejection sampling to avoid modulo bias.
- [x] Restore the missing `N` and `n` characters in the default token alphabets.
- [x] Audit every shared/direct randomness caller in `.ai/RANDOMNESS.md`; Token/TOTP, UUID v1/v4, and ULID use reviewed Web Crypto paths, while the remaining `Math.random` callers are explicitly presentation-only. UUID v1's former pseudo-random node/clock data is regression-tested out.
- [x] Add deterministic alphabet, Unicode, length, empty-input, rejection, and permanently-missing-character coverage without flaky statistical assertions.
- [x] Keep generated tokens and OTP secrets ephemeral and verify non-persistence in Chromium.

## Milestone 2 — P0/P1 confirmed correctness and responsiveness

### 2.1 Text Diff

- [x] Compare a lightweight diff editor with the minimal Monaco build and record the payload/UX decision in `.ai/experiments/TEXT_DIFF_EDITOR_COMPARISON.md`: import pruning cannot meet budget; a worker-backed CodeMirror spike is the only measured candidate and must pass parity/adversarial gates before migration.
- [x] Configure a real worker and eliminate the main-thread fallback warning.
- [x] Remove unused language/mode chunks from the manifest and PWA cache.
- [x] Dispose content listeners, original/modified models, editor, and worker on unmount, including multi-owner worker-environment restoration.
- [x] Make persisted diff content opt-in, debounced, versioned, size-bounded, clearable, and resilient to corruption/quota errors.
- [x] Add a repeated SPA open/close forced-GC memory test; ten cycles retain +2.46 MiB with zero workers.
- [x] Add a large-text interaction fixture: two 1 MiB models complete in the real Monaco worker with default-off storage and responsive UI actions.
- [x] Meet the Text Diff heap budget in `.ai/PERFORMANCE.md`.
- [x] Close the Text Diff payload decision. The worker-backed CodeMirror spike meets the size/isolation target but loses focus, undo, and history when async diff results rebuild public `MergeView`; retain repaired Monaco as a documented parity-driven exception to the original `<350 kB` target.

### 2.2 Shared worker/task abstraction

- [x] **DONE:** extract the proven JSON/YAML one-shot terminate-and-replace transport with typed envelopes, validated job IDs, timeout, cancellation, stale-result protection, and deterministic disposal while preserving route-owned literal worker URLs; 96 focused regressions pass without changing either public client API.
- [ ] Consolidate the local Bcrypt/Regex typed protocols into one shared worker task abstraction with job IDs, progress, cancellation, timeout, and structured errors.
- [x] Terminate and replace Bcrypt/Regex workers for operations that cannot be interrupted safely.
- [ ] Add shared byte, nesting-depth, output-count, and elapsed-time limits.
- [ ] Ensure stale async results can never overwrite a newer input.
- [x] Keep copy actions usable during and after degraded large-output rendering.
- [ ] Add a shared bounded download policy for degraded large-output rendering.
- [x] **DONE:** harden the compatible transport increment with deterministic `messageerror` settlement, strict non-array record guards in legacy JSON/YAML/Bcrypt protocols, and static bounded/sanitized OUI error text; File Hash adds exact-key envelopes and exercises progress/replacement/cancellation/timeout/disposal. Envelope/job-ID parsing before full payload decode remains a separately measured follow-up where the structured-clone boundary makes it meaningful.
- [ ] Decide and document the worker-output byte-metadata trust boundary: current production workers compute exact UTF-8 bytes while the main thread intentionally performs only O(1) plausibility checks to avoid rescanning multi-megabyte output.

### 2.3 Bcrypt

- [x] Replace reactive `hashSync`/`compareSync` with explicit cancellable worker actions.
- [x] Select a practical rounds range from measured time budgets; remove the maximum of 100.
- [x] Validate null/empty rounds and hashes without making the card disappear.
- [x] Show running, elapsed, timeout, cancelled, success, and error states.
- [x] Add fixtures for rounds boundaries, rapid input changes, malformed hashes, and cancellation.

### 2.4 Regex Tester

- [x] Fix unmatched positional and named optional captures while preserving aligned undefined capture/group metadata.
- [x] Preserve zero-width matches and advance global matches by Unicode code point without an infinite loop.
- [x] Move matching and RandExp generation into separate terminate-and-replace workers with job IDs, a 1.2-second deadline, cancellation, and stale-result guards.
- [x] Preflight RandExp's AST before generation with cumulative length/depth/node/capture bounds and lexical capture numbering so nested repetition/backreference amplification cannot allocate before the output check.
- [x] Replace reactive SVG rendering with a single-flight explicit on-demand task and bound its pattern, detached-DOM node count, output bytes, and stale result.
- [ ] Move SVG rendering off the main thread only after selecting a DOM-free or isolated renderer; the current `@regexper/render` dependency requires `document`.
- [x] Limit pattern/input/match/capture/result/sample/diagram sizes and cover catastrophic backtracking with a live main-thread heartbeat.
- [x] Accept an explicit incoming `?regex=` value without writing edited content back to URL/history, remove regex content storage, and make diagram rendering explicit rather than input-reactive.
- [x] Cancel work on route leave/unmount and verify Home and tool-to-tool navigation remove the previous tool DOM.

### 2.5 Large structured/text input

- [x] Add a shared bounded plain-text output mode above 100,000 UTF-8 bytes while preserving full copy access; the 1 MiB fixtures render a UTF-8-safe 100,000-byte preview in one readonly `<textarea>` with zero descendants while keeping the complete output in memory for Copy.
- [x] Parse YAML Prettify once per bounded worker job and reuse the single document for validation and formatting.
- [x] Parse strict JSON Prettify once per bounded worker job and preserve original integer, decimal, exponent, and negative-zero lexemes through formatting and decoded-key sorting.
- [x] Parse JSON-to-TOML/YAML, YAML-to-JSON/TOML, and TOML-to-JSON/YAML once per bounded worker task and reuse the source-family result path for validation and transformation.
- [x] Move YAML Prettify into a terminate-and-replace worker with job IDs, stale-result protection, cancellation, a five-second deadline, and byte/depth/node/alias limits.
- [x] Move JSON Prettify into the same bounded terminate-and-replace lifecycle, with worker-only exact UTF-8 accounting so a 1 MiB transfer does not rescan the whole string on the main thread.
- [x] Move large TOML and remaining JSON/YAML converter processing into three source-family workers; move XML-to-JSON/JSON-to-XML into one XML-family worker. XML Formatter, SQL, and Markdown retain route-owned bounded worker tasks.
- [x] Move Docker Run-to-Compose parsing, obsolete-version cleanup, and categorized-message production into a strict bounded worker; retain existing composerize semantics and replace base64 download construction with a Blob URL.
- [x] Add YAML Prettify malformed, oversized, depth/node/alias/output-limit unit fixtures and a 1 MiB responsive Chromium fixture; 31 focused checks include pre-serialization scalar-alias, deep-sequence indentation, escaped-line, and boundary-space amplification while retaining valid 90,000-node and 1 MiB inputs.
- [x] Add equivalent strict JSON malformed, duplicate-key, Unicode, depth/node/input/output, cancellation/stale/timeout/crash/disposal, and 1 MiB browser fixtures.
- [ ] Add the equivalent 100 kB, 1 MB, deep, malformed, and oversized fixtures to the remaining structured-input tools.
- [x] Keep shared 1 MiB result markup below 5,000 nodes; JSON/YAML use one readonly preview `<textarea>` with zero descendants.
- [x] Prove the measured JSON/YAML 1 MiB Prettify paths create no `>=50 ms` main-thread Long Task in the sequential production Chromium fixtures; final isolated measurements are JSON 197 ms format-ready and YAML 203 ms, both with 0.0 ms observed longest task. YAML also passes 10/10 repeated runs after prior discarded-browser-context garbage is collected before the interaction window, without excluding current formatting work.
- [ ] Prove the same `<50 ms` Long Task gate for the remaining structured-input tools and under the slower-device profile.
- [ ] Apply the same bounded output policy to regex matches, generated lists, diff trees, and table tools.

### 2.6 Small confirmed fixes

- [x] Correct Base64 File MIME lookup and raw Base64 preview/download data-URI handling.
- [x] Round Temperature Converter correctly around floating-point boundaries and reject values below absolute zero for every scale.
- [x] Preserve repeated URL query values and display fragments.
- [x] Add named RFC3986/RFC5987/form URL encoding modes instead of presenting `encodeURIComponent` as the only standard.
- [x] Choose and document the bounded lossless strategy for Prettify: strict JSON preserves numeric lexemes, YAML preserves integer values with `BigInt`, and legacy JSON5 remains an explicit non-lossless compatibility mode. YAML floats and converters remain outside this contract.
- [x] Reset/clamp command-palette selection and guard Enter on an empty result.
- [x] Escape CSV quotes as `""` and quote comma/newline/quote fields correctly.
- [x] Return zero words for whitespace-only Text Statistics input, compute character/word/line/UTF-8 byte statistics in one O(n), O(1)-space pass, and run it in a debounced/explicit route-owned worker with a 4 MiB hard input bound.
- [x] Revoke Camera Recorder object URLs on delete/unmount; cap recordings at 5 minutes/64 MiB, screenshots at 16 MiB, raw canvas allocation at 16,777,216 pixels/64 MiB, and aggregate retained media at 128 MiB; keep capture single-flight and ignore late callbacks after unmount in addition to the 12/4 item limits.
- [x] Fix `TextareaCopyable` late element tracking and pass the exposed input wrapper from JSON/YAML/SQL viewers.
- [x] Enforce every `TextareaCopyable.copyPlacement` value (`top-right`, `bottom-right`, `outside`, `none`) without duplicate buttons.
- [x] Stop emitting the obsolete top-level Compose `version` field.
- [x] Correct the PWA manifest language to English (already resolved in the local fork before this implementation slice; audit item was stale).
- [x] Replace ASCII Art's runtime `unpkg.com` font dependency with versioned same-origin, on-demand assets and cancellation-safe rendering.
- [x] Apply the UnoCSS native `size` exclusion and remove the local size workaround.
- [x] Close the mobile menu immediately on small screens, after route changes, and on Escape; keep hidden navigation inert at both breakpoints, restore focus to an `aria-expanded` toggle, and separate transient mobile state from the persisted desktop collapse preference.
- [x] Give shared `c-button` safe native form-button defaults and disabled semantics; physically remove disabled href/router targets while exposing link role/`aria-disabled` and removing them from tab order.

## Milestone 3 — P1 high-impact performance

### 3.1 PWA and network

- [x] Precache only the shell, Workbox client runtime, and critical static assets; the generated inventory is nine required entries.
- [x] Runtime-cache content-hashed lazy chunks after first use with a bounded/versioned CacheFirst policy.
- [x] Verify a previously opened lazy tool reloads offline after clearing the HTTP cache; document, shell, Workbox client runtime, and lazy chunks are served by the service worker.
- [ ] Add an optional explicit full-offline download flow if required.
- [x] Provide an offline-unavailable state rather than a blank tool: hide the prior route, keep query/hash only in memory, verify origin reachability, and retry through a fresh query-free document so sticky failed imports recover without leaking tool content into access logs.
- [x] Keep the mandatory precache below 1 MB raw; current artifact is 989,535 B raw / 333,261 B gzip across nine entries and both limits are executable CI/release gates.
- [x] Cover compression, immutable hashed-asset caching, and HTML/SW/manifest revalidation in the container smoke test.
- [ ] Add browser acceptance for service-worker update/rollback and stale-cache cleanup.

### 3.2 Emoji Picker

- [x] Page the 1,870 emoji cards and category groups in bounded increments of 60.
- [x] Keep initial DOM below 2,000 nodes; the production Chromium fixture measures 60 cards / 1,731 elements.
- [x] Use keyboard-native copy controls, preserve full-catalog search and Fuse relevance order in one paged result grid, and keep result rendering bounded.
- [ ] Make the synchronous Fuse search cancellable/worker-backed or prove the current bounded catalog remains safe under the slower-device profile.
- [x] Load secondary `emojilib` keyword metadata only after search begins.
- [ ] Refresh `unicode-emoji-json` and `emojilib` against the current Unicode Emoji release after reviewing compatibility, licenses, and bundle impact.
- [ ] Record the Unicode Emoji/data-source version and generation date so the catalog can be updated reproducibly.
- [x] Preserve complete UTF-16/code-point sequences and cover ZWJ family plus regional-indicator flag copying without truncation.
- [ ] Extend sequence fixtures to professions, keycaps, variation selectors, and skin-tone modifiers.
- [ ] Add fixtures for newly introduced emoji and aliases/keywords that were missing from the previous dataset.
- [ ] Verify that the updated catalog does not regress initial payload, DOM count, search latency, or offline-cache budgets.
- [ ] Verify the 4x CPU route task is below 200 ms.

### 3.3 MAC Address Lookup

- [x] Generate and benchmark compact dictionary, varint, binary, and 112-bucket forms of the 34,503-entry OUI database; record the decision in `.ai/experiments/OUI_DATA_FORMAT_COMPARISON.md`.
- [x] Reject input-selected prefix buckets after integration review because their URLs disclose the entered prefix to access logs; use one prefix-independent fixed hashed worker URL instead.
- [x] Decode and binary-search the compact database off the main thread in one route-local worker reused across lookups and disposed on SPA route leave.
- [x] Make database generation reproducible and record schema, source/version/license, counts, limits, and source/artifact SHA-256 metadata; CI/build fail when generated data is stale.
- [ ] Target a typical route payload below 250 kB gzip (privacy-safe fixed-worker closure is 1,937,384 B raw / 770,467 B gzip; reducing exact vendor coverage is an explicit future product trade-off).

### 3.4 Shell and Home

- [ ] Generate lightweight tool descriptors and a route/component map.
- [ ] Consolidate four icon mechanisms into direct virtual icons or a generated sprite.
- [ ] Remove full CommonJS Lodash from shared shell paths.
- [ ] Precompute/remove runtime `isNew` date logic.
- [ ] Lazily initialize drag-and-drop and command-palette search.
- [ ] Progressively render or virtualize the Home tool grid.
- [ ] Reduce shell JavaScript to 200 kB gzip or less and Home 4x CPU work below 300 ms.

### 3.5 Quick Search / Command Palette

Current status: deterministic exact title, keyword, and normalized path ranking now precedes bounded Fuse results. The compact view keeps five entries per category, while an accessible **Show all results** action exposes the complete bounded catalog and preserves keyboard selection. Stable locale-independent IDs, alias normalization, a full keyword audit, and measured first-open latency remain open.

- [ ] Define a stable, locale-independent `id` for every tool, or formally use the normalized route path as that ID.
- [x] Index and rank exact normalized path, display title, and existing keyword list before fuzzy title/description/keyword/path matches.
- [x] Rank exact path/title/keyword matches first, then title/keyword prefixes and path containment, and only then bounded Fuse matches with deterministic tie-breaking.
- [ ] Normalize leading slashes, spaces, hyphens, underscores, and common aliases so queries such as `jsondiff`, `json-diff`, and `/json-diff` resolve consistently.
- [ ] Audit every tool descriptor for useful English keywords and add tests proving keyword-only queries return the expected tool.
- [x] Keep the compact five-per-category view and add an accessible **Show all results** flow instead of silently discarding matches.
- [x] Keep the complete expanded list bounded by the 123-tool registry; virtualization is unnecessary at the accepted catalog size and must be reconsidered if that bound changes materially.
- [x] Rebuild search options reactively when tool metadata changes instead of retaining a one-time snapshot.
- [x] Reset/clamp keyboard selection whenever the query/result list changes and guard Enter on an empty result.
- [ ] Add the remaining screen-reader, stable-ID/alias, no-result, and measured large-result Playwright cases; exact title/keyword/path ranking, Show all, and keyboard-safe selection have unit/browser coverage.
- [ ] Measure first-open index construction and search latency; initialize during idle time or first use without increasing the application shell.

### 3.6 Reactive computation cleanup

- [x] Replace `computedRefreshable`/`computedRefreshableAsync` with a single-execution abstraction using explicit dependencies, throttling, stale-job guards, AbortSignal cancellation, and scope disposal.
- [x] Prove one generation per dependency change/refresh for UUID, ULID, token, MAC, lorem, OTP, and port; focused invocation/cancellation coverage exercises all seven remaining refreshable callers. RSA now uses a separate explicit worker task and never generates from a dependency change.
- [x] Debounce and order QR/Wi-Fi QR generation with a 150 ms pause, stale-result guards, a 4,096-byte UTF-8 preflight, scope disposal, and immediate clearing when required Wi-Fi fields become incomplete.
- [x] Format WYSIWYG HTML in a terminate-and-replace worker: 250 ms idle formatting below 64 KiB, explicit action above that threshold, a 1 MiB input ceiling, bounded output, stale-result guards, teardown, and an eight-second deadline.
- [x] Reduce Math Evaluator to the number-only `mathjs` entry and move debounced/explicit evaluation into a route-owned terminate-and-replace worker with 8 KiB input, 64 KiB output, and a two-second deadline.
- [x] Bound JSON Diff at 1 MiB per document, depth 128, 100,000 total input/output nodes, and 250,000 LCS cells; parse once in a route-owned worker, align unique `id`/`key`/`name` arrays or primitive LCS sequences, retain positional fallback, and lazily render 200-row batches.
- [x] Use one streaming pass for Text Statistics and route-owned worker mode for large text.

## Milestone 4 — P2 build, CI, and developer throughput

- [ ] Replace icon package barrels and Monaco root imports; compare module counts after each experiment.
- [ ] Narrow auto-component scanning to reusable component directories.
- [ ] Remove unused packages, stale imports, demos, and duplicate parser/render libraries where behavior permits.
- [ ] Build the production artifact once and reuse it in all E2E shards.
- [x] Fix the Playwright browser cache identity to use the resolved lockfile plus Playwright config rather than the stale runtime-dependency lookup.
- [ ] Reuse the tested artifact for release packaging and container content where provenance remains verifiable.
- [x] Use BuildKit cache mounts and `pnpm fetch` for Docker dependency layers.
- [ ] Share architecture-independent build output across multi-architecture images.
- [ ] Target a warm production build below 20 seconds on the audit runner; the current local build is 19.86 seconds, but standard-runner telemetry is still required before closing this gate.

## Milestone 5 — selected feature development

Do not start broad feature work until Milestones 0–2 are green. Then select one small product slice from `.ai/FEATURES.md` and require performance/security budgets from design time.

Recommended first feature candidates:

- [x] **DONE:** NanoID Generator with Web Crypto rejection sampling, length/quantity controls, validated NFC Unicode custom alphabets, exact/approximated collision and entropy guidance, copy/download/clear actions, strict 100,000-symbol / 512-KiB output limits, session-only privacy, lazy routing, and a 23,225 B raw / 8,916 B gzip additional closure. Open [PR #1138](https://github.com/CorentinTh/it-tools/pull/1138) supplied approved requirements research only; no upstream component code or generator dependency was copied.
- [x] **DONE:** CLI Command Editor with bounded POSIX/PowerShell tokenization, exact unchanged-source round trips, safe re-quoting after edits, repeated flags, `--`, pipes/redirection, and no command execution.
- [x] **DONE:** Modern identifier workspace in the existing UUID route: Web Crypto UUID v6/v7, canonical normalization and timestamp/version/variant inspection, plus Mongo ObjectID and exact BigInt Snowflake inspection.
- [x] **DONE:** DevOps config workspace with bounded worker-owned Dockerfile lint, Compose validation/normalization, nginx formatting, properties/YAML conversion, and JSON/YAML/TOML subtree extraction to deterministic shell-safe `.env` assignments. Exact JSON Pointer/prefix validation, collision diagnostics, and non-execution/non-expansion semantics are explicit.
- [x] **DONE:** JSON Schema validation and structured source-aware error paths for Draft 7/2019-09/2020-12 under the local-only reference, parse/node/depth/error/time/privacy, bundle, and CSP contract in `.ai/experiments/JSON_SCHEMA_VALIDATOR_DESIGN.md`. Issues #368/#801 supplied requirements only; the implementation is local and no upstream component code was reused.
- [x] Bound Ajv `allErrors` by both instance size and projected schema/instance node pairs so branch-heavy schemas fail fast before internal error-array amplification.
- [x] **DONE:** JSON Schema & Code Generator with bounded worker parsing, Draft 2020-12 schema inference, TypeScript output, graph statistics, and deterministic RFC 6902 `add`/`remove`/`replace` generation. RFC 6901 pointer escaping, array fixtures, operation/output limits, preserved numeric lexemes, and conservative lexical-number replacement are covered.
- [x] **DONE:** explicit HMAC UTF-8/hex/canonical-Base64 key representations in a bounded disposable worker with RFC 4231 vectors and malformed/oversized-input rejection. The legacy password-envelope Encryption route documents its derived-IV/unauthenticated/legacy semantics and deliberately does not pretend raw-key/IV interoperability; ITAE-v1 AES-GCM remains the authenticated route.
- [x] **DONE:** Token Generator UX closure with numeric 1–512 length, batches up to 100, bounded custom/denied Unicode code-point alphabets, unbiased Web Crypto sampling, copy/download/clear, harmless versioned preferences, and ephemeral generated/custom content.
- [x] **DONE:** local file hashing with fixed 4 MiB incremental worker reads and SHA-256/384/512, SHA3-256, BLAKE3-256, SHA-1, and MD5 in one pass. SHA-1/MD5 are visibly marked as legacy; throttled progress, cancellation/replacement after real progress, session-only privacy, safe filename display, same-file reselection, 256 MiB peak-memory/responsiveness evidence, offline worker reuse, and independent route/worker bundle gates remain in force from `.ai/experiments/FILE_HASH_DESIGN.md`.
- [x] **DONE:** Local File Inspector with magic-byte identification, streaming CRC-32, fixed 4 MiB worker reads, 4 KiB hex preview, 2 GiB policy bound, cancellation, and session-only file handling.
- [x] **DONE:** SAML & Enterprise Timestamp Inspector with bounded local Base64/Base64url/raw-DEFLATE decode, plain-text XML, DTD/entity rejection, explicit non-verification scope, exact FILETIME arithmetic, and strict LDAP/ISO calendar/offset semantics.
- [x] **DONE:** URL Safety & Authoring Workspace with existing standards encoding plus explicit tracker removal, removed-name-only reporting, defang/refang, UTM and text-fragment builders, strict HTTP(S) validation, and no automatic navigation/persistence.
- [x] **DONE:** Developer Text Workspace with bounded worker-owned stack-trace formatting, literal/regex smart replace, safe relative-path folder trees, and fenced-block-aware Markdown TOC. Paste-as-Markdown is intentionally not claimed because safe HTML ingestion needs its own sanitizer/trust design.
- [x] **DONE:** Offline Network Calculation Suite with exact shared IPv4/IPv6 BigInt CIDR range/membership/exclusion, bounded DHCP Option 43 TLV encoding, port classification, and TTL helpers; existing MAC routes remain canonical.
- [x] **DONE:** Favicon & App Icon Generator with bounded local decode/Canvas rendering, seven PNG presets, maskable padding, manifest output, dependency-free deterministic TAR download, and deterministic Bitmap/Blob URL disposal.
- [x] **DONE:** secure Passphrase Generator with a route-local BIP39 English list, unbiased Web Crypto selection, bounded 4–12-word controls, entropy guidance, copy/clear, and ephemeral output.
- [x] **DONE:** native GZIP text/file converter with capability disclosure, streaming transform/cancellation, bounded Base64 and file paths, and deterministic download cleanup.
- [x] **DONE:** local RFC 3492 Punycode/IDN safety converter with canonical Unicode↔ACE round trips, label/domain bounds, and explicitly heuristic mixed-script/confusable warnings.
- [x] **DONE:** exact Data Storage & Transfer Units converter using BigInt rationals for bit/byte, SI/IEC, and transfer-time calculations.
- [x] **DONE:** worker-owned Markdown Table Generator with quoted CSV/TSV parsing, escaping/alignment controls, explicit action, and byte/row/column/cell/output/time limits.
- [x] **DONE:** IEEE-754 binary32/binary64 inspector with fields, endian bytes, exact stored values, exact rounding error, and special-value classification.
- [x] **DONE:** lightweight Conventional Commit authoring/reference helper with bounded plain-text fields, validation, copy/clear, and no Git execution or persistence.
- [x] **DONE:** bounded List Comparison with set, duplicate-aware multiset, and ordered LCS modes in a disposable worker, including per-side byte/line and ordered-cell/output/time limits.
- [x] **DONE:** Unicode & GSM-7 Inspector for entered text with code-point/UTF offsets, grapheme counts, NFC/NFD signals, literal/U+ search, GSM basic/extension septets, non-BMP tests, and disclosed SMS-estimate limits.
- [x] **DONE:** Date, ISO Week & iCalendar Utilities with strict Gregorian/ISO-week boundaries, UTC VEVENT building/inspection, RFC 5545 escaping/unfolding, and UTF-8-safe 75-octet folding.
- [x] **DONE:** HTTP Request & Code Builder with cURL/fetch text output, duplicate fields, HTTP(S)/userinfo rejection, bounds, recognized-secret redaction by default, no request execution, and strict POSIX cURL import through the existing CLI tokenizer.
- [x] **DONE:** Priority A / Text Faker-compatible mock-data generator with deterministic seeds, disclosed `it-tools-en-v1` data, person/address/date/internet/identifier profiles, JSON/CSV, a route-owned worker, 5,000-record/2-MiB limits, ephemeral state, and copy/download actions.
- [x] **DONE:** bounded local-image barcode generation/decoding: dependency-free Code 128/EAN-13/UPC-A SVG output plus capability-detected native `BarcodeDetector` reading with 20-MiB/25-megapixel/50-result limits and deterministic image-resource disposal.
- [x] **DONE:** bounded local Certificate/CSR/public-key structural inspection with SHA-256 fingerprints, no network/new parser dependency, explicit non-verification scope, and private-key rejection.
- [x] **DONE:** bounded worker-owned JSON repair plus a safe JSONPath-like property/index/wildcard query subset; filters, recursion, expressions, scripts, and arbitrary JavaScript execution are rejected.
- [x] **DONE:** Ed25519 & SSH Key Workspace with explicit capability-detected Web Crypto generation in a disposable worker, SPKI/PKCS#8/OpenSSH output, SHA-256 fingerprint, bounded SSH comment, cancellation, and ephemeral private keys.
- [x] **DONE:** QR Decoder & OTP Import with bounded native local-image/current-frame decoding, explicit camera permission, five-minute auto-stop, deterministic resource disposal, cross-browser `otpauth://` TOTP/HOTP parsing, and no OTP-secret persistence.
- [x] **DONE:** Docker Compose ↔ Docker Run conversion in one bounded worker with quoting, environment, ports, volumes, entrypoint/command, unsupported-field guidance, and both-direction fixtures.
- [x] **DONE:** IPv6 expansion, RFC 5952 compression, BigInt CIDR network/range/count, containment, and bounded subnet splitting.
- [x] **DONE:** Sensitive Data Masker/HAR Sanitizer for local text/JSON/HAR with bounded worker traversal and secret header/key/query/body presets.
- [x] **DONE:** Timezone + Date Duration Calculator with IANA zones and explicit DST gap/ambiguity behavior.
- [x] **DONE:** Cron Next Runs with Unix/seconds/Quartz presets, IANA timezone evaluation, DST-safe instants, bounded results and explicit unsupported Quartz-special syntax.
- [x] **DONE:** versioned ITAE-v1 AES-256-GCM text/file envelope with Web Crypto PBKDF2-HMAC-SHA-256, fresh salt/IV, authenticated header, encrypted file metadata, strict input/iteration/protocol bounds, generic authentication failure, disposable worker lifecycle, and ephemeral secrets.
- [x] **DONE:** lazy local Argon2id `v=19` hash/verify with pinned `hash-wasm@4.12.0`, RFC 9106 memory-constrained defaults, Web Crypto salts, strict canonical PHC/resource/protocol bounds, disposable-worker physical cancellation, ephemeral secrets, independent compatibility vectors, source-dev privacy/cancel coverage, and separate worker/route/shell/PWA budgets.
- [x] **DONE:** lazy local Markdown Diff with 256-KiB-per-side line/word source comparison, line/token/alignment/output/time limits, disposable-worker physical cancellation, equal peer inputs, optional sanitized last-successful previews with raw HTML/links/images disabled, ephemeral content, pinned patched DOMPurify, and separate worker/route/shell/PWA budgets.
- [x] **DONE:** lazy Mermaid Diagram Renderer/Exporter with exact patched `mermaid@10.9.8`, five allowed diagram families, explicit action-only loading, fixed strict configuration, source/element/SVG/viewBox/time/PNG allocation limits, link/HTML/style/config rejection, DOMPurify post-sanitization, a scriptless network-denying sandboxed iframe, ephemeral content, SVG/PNG actions, late-result invalidation, and reviewed route/renderer/unreachable-catalog budgets.
- [x] **DONE:** lazy local Parquet Reader with exact dependency-free `hyparquet@1.28.2`, Blob-backed selected reads in a disposable worker, strict file/footer/schema/row-group/column/chunk/page/cell/output/time/memory bounds, schema/metadata inspection, 200-row/16-column paging, conservative JSON/CSV export with formula protection, UNCOMPRESSED/SNAPPY support, metadata-visible unsupported codecs, encrypted/external-layout rejection, ephemeral content, and independent route/worker budgets.
- [x] **DONE:** lazy local macro-free XLSX Spreadsheet Reader with exact zero-dependency `saxen@11.1.1`, native bounded raw-DEFLATE, strict ZIP central/local/path/overlap/CRC and UTF-8 XML/relationship/macro limits, metadata-first inspection, 200-row/32-column selected paging, exact stored scalar lexemes, cached-formula-only disclosure, raw date serials, formula-protected JSON/CSV, external-link non-fetching, ephemeral content, and independent route/worker budgets.
- [x] **DONE:** exact RAID 0/1/5/6/10 storage calculator with SI/IEC units, BigInt-rational capacity/overhead/efficiency, bounded disk layouts, conditional RAID 10 failure semantics, and explicit non-backup/controller/filesystem exclusions.
- [x] **DONE:** lossless bounded JPEG/PNG/WebP metadata removal by signature-verified container rewriting in a disposable worker; encoded image payloads are not decoded/recompressed, rendering/color/animation data are preserved, and result object URLs are revoked.
- [x] **DONE:** bounded JWT authoring/signing/verification plus HOTP completion. JWT decode is labelled untrusted; unsigned and HS256/384/512 workflows are distinct explicit actions with algorithm-driven verification, strict compact/JSON/size/depth/key limits, Web Crypto HMAC, ephemeral secrets, and no authentication/issuer/audience claim. HOTP uses exact unsigned 64-bit counters, 6/8 digits, strict Base32 bounds, RFC 4226 vectors, exact-counter verification, and provisioning URIs.
- [x] **DONE:** version-pinned SPDX common-license guidance using an explicitly incomplete 17-entry subset of SPDX License List 3.28.0 (2026-02-20), bounded search/identifier comparison, canonical per-license links, obligation summaries, conservative family-level signals, and a prominent not-legal-advice/non-expression-parser disclosure.
- [x] **DONE:** W3C CSS Color 4 OKLab/OKLCH conversion in the existing Color Converter, including strict CSS-like input, normalized hue, sRGB gamut detection, and constant-lightness/hue binary chroma reduction. Local MINDE and display-profile color management are explicitly not claimed.
- [x] **DONE:** lazy bounded Tabular Data Import & Inspector for pasted/local UTF-8 CSV/TSV with one disposable-worker parse, quoted/escaped/newline/empty-cell preservation, 1 MiB input, 10,000-row, 128-column, 200,000-cell, 32 KiB-cell, 2 MiB output and eight-second limits; inspection/profile preview; explicit all-text versus conservative primitive inference; normalized CSV/TSV; optional formula-prefix protection; copy/download; no XLSX dependency.
- [x] **DONE:** Wi-Fi QR WPA3 Personal/transition intent and exact raw-payload copy. The local implementation follows current ZXing de-facto escaping and deliberately encodes WPA3 credentials as compatible `T:WPA`; it explicitly cannot force SAE-only/transition policy or guarantee scanner behavior. Password-bearing payloads remain ephemeral.
- [x] **DONE:** Chmod octal/symbolic parsing, setuid/setgid/sticky display/input, and creation-umask guidance with malformed/special-bit/boundary fixtures. The route never executes chmod and does not claim ACL/default-ACL/filesystem-policy equivalence.
- [x] **DONE:** Ansible Vault 1.1 and labelled 1.2 AES256 encrypt/decrypt plus Apache bcrypt htpasswd generation/verification in one lazy disposable-worker route. Compatibility is proven against Ansible Core 2.21.2 and Apache's documented `$2y$` example; inputs, outputs, secrets, formats, cost, and time are bounded, authentication failures are generic, and APR1/SHA-1/crypt/plaintext generation is excluded.
- [x] **DONE:** explicit escaped-JSON-string import in JSON Repair & Query. The worker accepts only a strict outer JSON string whose decoded content is itself strict bounded JSON, returns the decoded text without rewriting numeric lexemes, and never silently reinterprets ordinary valid JSON.

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
| Open [PR #1138](https://github.com/CorentinTh/it-tools/pull/1138) | **Completed local adaptation of NanoID requirements** | Local lazy implementation uses Web Crypto-backed rejection sampling, stable route/keywords, bounded quantity/length/alphabet controls, collision/property fixtures, and no copied PR component or runtime generator dependency |
| Open [PR #1260](https://github.com/CorentinTh/it-tools/pull/1260), [PR #929](https://github.com/CorentinTh/it-tools/pull/929), [PR #1695](https://github.com/CorentinTh/it-tools/pull/1695), and [PR #1258](https://github.com/CorentinTh/it-tools/pull/1258) | **Completed local adaptation of Passphrase, GZIP, and IDN requirements** | Implemented locally with Web Crypto and the existing route-local BIP39 list, browser-native compression streams, local RFC 3492 conversion, strict bounds/capability and safety disclosures, and no copied upstream component code |
| Issue [#817](https://github.com/CorentinTh/it-tools/issues/817), [PR #1303](https://github.com/CorentinTh/it-tools/pull/1303), issue [#735](https://github.com/CorentinTh/it-tools/issues/735), [PR #1295](https://github.com/CorentinTh/it-tools/pull/1295), [PR #1183](https://github.com/CorentinTh/it-tools/pull/1183), and issue [#1630](https://github.com/CorentinTh/it-tools/issues/1630) | **Completed local adaptation of List Comparison and Unicode/GSM-7 requirements** | Implemented from local pure models and worker/UI contracts with strict line/LCS/code-point limits, non-BMP/GSM fixtures, no global Unicode dataset claim, and no copied upstream implementation code |
| [PR #984](https://github.com/CorentinTh/it-tools/pull/984), [PR #1336](https://github.com/CorentinTh/it-tools/pull/1336), [PR #1331](https://github.com/CorentinTh/it-tools/pull/1331), issue [#837](https://github.com/CorentinTh/it-tools/issues/837), [PR #1168](https://github.com/CorentinTh/it-tools/pull/1168), [PR #1171](https://github.com/CorentinTh/it-tools/pull/1171), and [PR #1811](https://github.com/CorentinTh/it-tools/pull/1811) | **Completed local adaptation of calendar and HTTP/cURL authoring requirements** | Implemented with local strict date/RFC 5545 services and the existing CLI tokenizer; HTTP output is non-executing, bounded, redacted by default, and rejects unsupported command syntax. No upstream component/parser code was copied |
| [PR #1585](https://github.com/CorentinTh/it-tools/pull/1585), [PR #1229](https://github.com/CorentinTh/it-tools/pull/1229), issue [#1132](https://github.com/CorentinTh/it-tools/issues/1132), [PR #1218](https://github.com/CorentinTh/it-tools/pull/1218), and [PR #1022](https://github.com/CorentinTh/it-tools/pull/1022) | **Completed local adaptation of authenticated-encryption, metadata-removal, and RAID requirements** | Implemented independently from [W3C Web Crypto](https://www.w3.org/TR/WebCryptoAPI/), [NIST SP 800-132](https://csrc.nist.gov/pubs/sp/800/132/final), [NIST SP 800-38D](https://csrc.nist.gov/pubs/sp/800/38/d/final), [PNG third edition](https://www.w3.org/TR/png-3/), and [WebP RIFF-container](https://developers.google.com/speed/webp/docs/riff_container) requirements. The local result uses a new versioned envelope, bounded disposable workers, exact RAID arithmetic, and no copied upstream implementation/component code |
| Issue [#1668](https://github.com/CorentinTh/it-tools/issues/1668), [PR #1669](https://github.com/CorentinTh/it-tools/pull/1669), [PR #1515](https://github.com/CorentinTh/it-tools/pull/1515), [PR #933](https://github.com/CorentinTh/it-tools/pull/933), issue [#1025](https://github.com/CorentinTh/it-tools/issues/1025), [PR #1186](https://github.com/CorentinTh/it-tools/pull/1186), issue [#1798](https://github.com/CorentinTh/it-tools/issues/1798), and [PR #1328](https://github.com/CorentinTh/it-tools/pull/1328) | **Completed local adaptation of JWT/HOTP, license-guidance, and modern-color requirements** | Implemented independently from RFC 4226/Web Crypto, the official [SPDX License List 3.28.0](https://spdx.org/licenses/), and [W3C CSS Color 4](https://www.w3.org/TR/css-color-4/). The local result deliberately limits JWT to none/HMAC modes, license data to a disclosed curated common subset, and gamut mapping to constant-L/H chroma reduction; no upstream code, full SPDX payload, legal compatibility claim, or color dependency was copied |
| Issues [#539](https://github.com/CorentinTh/it-tools/issues/539) and [#785](https://github.com/CorentinTh/it-tools/issues/785), [PR #1289](https://github.com/CorentinTh/it-tools/pull/1289), issue [#542](https://github.com/CorentinTh/it-tools/issues/542), [PR #1807](https://github.com/CorentinTh/it-tools/pull/1807), [PR #1626](https://github.com/CorentinTh/it-tools/pull/1626), and [PR #1348](https://github.com/CorentinTh/it-tools/pull/1348) | **Completed local adaptation of units, Markdown-table, commit-helper, and IEEE-754 requirements** | Implemented from local pure models and shared UI/worker contracts with exact rational arithmetic, bounded CSV/TSV processing, non-executing plain-text authoring, binary field fixtures, and no copied upstream implementation code |
| [Issue #368](https://github.com/CorentinTh/it-tools/issues/368) and [issue #801](https://github.com/CorentinTh/it-tools/issues/801) | **Completed local JSON Schema requirements adaptation** | Implemented locally with explicit worker validation, three draft modes, source-aware errors, fragment-local references, hard resource limits, session-only privacy, and no copied upstream component code |
| Open [PR #913](https://github.com/CorentinTh/it-tools/pull/913) | **Completed local adaptation of Token Generator usability requirements** | Implemented independently with numeric 1–512 length, bounded batches of 100, custom/denied Unicode code-point alphabets, local Web Crypto rejection sampling, copy/download/clear, harmless versioned preferences, and session-only generated/custom content; no upstream component code was copied |
| Open [PR #1441](https://github.com/CorentinTh/it-tools/pull/1441), [PR #1149](https://github.com/CorentinTh/it-tools/pull/1149), and [PR #742](https://github.com/CorentinTh/it-tools/pull/742) | UUID v6/v7 and normalization | Update the UUID library intentionally, add RFC/version fixtures, and integrate formats into one identifier workspace |
| Open [PR #1602](https://github.com/CorentinTh/it-tools/pull/1602) | CLI Command Editor requirements | Design a tested shell AST first; preserve quoting, repeated flags, `--`, pipes, redirection, and platform modes rather than copying its parser |
| Open [PR #1474](https://github.com/CorentinTh/it-tools/pull/1474) | URL encoding standards | Adapt named RFC3986/RFC5987 modes with authoritative fixtures and keep the current component local |
| Open [PR #1479](https://github.com/CorentinTh/it-tools/pull/1479) and [PR #1439](https://github.com/CorentinTh/it-tools/pull/1439) | **Completed local adaptation of Wi-Fi QR WPA3-intent and raw-content requirements** | Current [ZXing Barcode Contents](https://github.com/zxing/zxing/wiki/Barcode-Contents#wi-fi-network-config-android-ios-11) and parser source remain de-facto rather than Wi-Fi Alliance standards and list WPA, not SAE/WPA3. The local UI therefore maps WPA3/transition intent to scanner-compatible `T:WPA`, exposes the exact ordered payload only with a secret warning, preserves escaping/order/stale-result bounds, and does not copy upstream code or claim WPA3-only enforcement |
| Open [PR #901](https://github.com/CorentinTh/it-tools/pull/901) | **Completed local Integer Base requirements adaptation** | Exact signed BigInt parsing, matching base-2/8/10/16 prefixes/suffixes, malformed/ambiguous fixtures, case-insensitive bases <=36, and unchanged case-sensitive base-37–64 semantics; no upstream implementation code copied |
| Open [PR #964](https://github.com/CorentinTh/it-tools/pull/964) | **Completed local adaptation of Chmod input/special-bit requirements** | Implemented independently with octal/symbolic round trips, `s/S/t/T`, setuid/setgid/sticky controls, creation-umask calculation, malformed boundaries, and explicit ACL/filesystem/non-execution scope; no upstream code was copied |
| Issues [#394](https://github.com/CorentinTh/it-tools/issues/394) and [#1628](https://github.com/CorentinTh/it-tools/issues/1628) | **Completed local adaptation of tabular-import requirements** | Implemented independently against [RFC 4180](https://www.rfc-editor.org/rfc/rfc4180.html) common CSV syntax with a bounded local worker, exact empty/text choices, conservative optional inference, formula-prefix disclosure, and no heavy XLSX dependency or copied upstream code |
| Open [PR #1643](https://github.com/CorentinTh/it-tools/pull/1643) and [PR #1542](https://github.com/CorentinTh/it-tools/pull/1542) | **Completed local adaptation of escaped-JSON requirements** | Implemented independently as an explicit worker operation over a strict outer JSON string and strict bounded decoded JSON, preserving the decoded source lexemes and refusing implicit reinterpretation; no upstream code was copied |
| Open [PR #1169](https://github.com/CorentinTh/it-tools/pull/1169) and [PR #846](https://github.com/CorentinTh/it-tools/pull/846) | Shared output actions | Add bounded download support and correctly implement all copy placements in current shared components |
| Open [PR #1670](https://github.com/CorentinTh/it-tools/pull/1670) and [PR #427](https://github.com/CorentinTh/it-tools/pull/427) | Configurable container listen port | Adapt to the selected non-root nginx image with runtime templating and container tests |
| Open [PR #1452](https://github.com/CorentinTh/it-tools/pull/1452), [PR #965](https://github.com/CorentinTh/it-tools/pull/965), [PR #1014](https://github.com/CorentinTh/it-tools/pull/1014), and issue [#1828](https://github.com/CorentinTh/it-tools/issues/1828) | DevOps config workspace | Extract schemas/fixtures and build route-local lint/format/env plugins without merging the separate UIs |
| Open [PR #1016](https://github.com/CorentinTh/it-tools/pull/1016), [PR #1263](https://github.com/CorentinTh/it-tools/pull/1263), and [PR #1140](https://github.com/CorentinTh/it-tools/pull/1140) | File inspection workspace | Reimplement as streaming worker tasks with magic-byte, hex, CRC, cancellation, and memory fixtures |
| Open [PR #1307](https://github.com/CorentinTh/it-tools/pull/1307), [PR #1290](https://github.com/CorentinTh/it-tools/pull/1290), and [PR #1020](https://github.com/CorentinTh/it-tools/pull/1020) | Developer text workflows | Share the lightweight editor/output foundation and adapt format-specific fixtures, not entire components |
| Issues [#1801](https://github.com/CorentinTh/it-tools/issues/1801) and [#1806](https://github.com/CorentinTh/it-tools/issues/1806) | SAML and enterprise timestamps | Implement local decode-only SAML with sanitized XML and extend Date-Time with explicit FILETIME/LDAP epoch semantics |
| Open [PR #1740](https://github.com/CorentinTh/it-tools/pull/1740) and [PR #1813](https://github.com/CorentinTh/it-tools/pull/1813) | Favicon/app icon generation | Consolidate both proposals, use bounded Canvas/Blob processing, revoke URLs, and validate ZIP/manifest contents |
| Open [PR #1166](https://github.com/CorentinTh/it-tools/pull/1166) and [PR #1323](https://github.com/CorentinTh/it-tools/pull/1323) | JSON schema/codegen/size requirements | Add plugins on the lossless parse-once worker model instead of creating more independent parsers |
| Open [PR #1085](https://github.com/CorentinTh/it-tools/pull/1085) and [PR #1087](https://github.com/CorentinTh/it-tools/pull/1087) | Unicode/code-point correctness | Reimplement with `TextEncoder`/code points and non-BMP fixtures across related text tools |
| Open [PR #1434](https://github.com/CorentinTh/it-tools/pull/1434) | **Completed local Prettify-scope adaptation of large-integer requirements** | Strict JSON preserves source numeric lexemes and YAML Prettify uses `BigInt` for integers; YAML floats and converters remain explicitly outside the lossless contract |
| Open [PR #1651](https://github.com/CorentinTh/it-tools/pull/1651) | Resilient ASCII font loading | Bundle a default font first, then adapt HTTPS cache/fallback behavior with cancellation |
| Open [PR #1170](https://github.com/CorentinTh/it-tools/pull/1170) | All-tool smoke coverage | Expanded locally to all 120 registered routes at the current checkpoint, console/page errors, chunk failures, responsive overflow, visible-control naming, theme state, and local persistence isolation |
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

## Current implementation sequence

Implementation is approved and active on the local branch. Current ordering is:

1. [x] restore green lint/typecheck and add route/bundle baselines;
2. [x] replace insecure Token/TOTP randomness and restore the complete alphabets;
3. [x] fix the Text Diff leak, worker warning, persistence boundary, and import shape;
4. [x] finish the measured Text Diff payload experiment and retain repaired Monaco until a worker-backed CodeMirror spike passes parity/adversarial gates;
5. [x] pass the two-by-1-MiB Text Diff worker interaction fixture;
6. [x] resolve locally confirmed Base64 File, Temperature, URL, command-palette, CSV, and Text Statistics defects with regression tests;
7. [x] replace reactive bcrypt and Regex matching/RandExp work with cancellable worker flows; keep the explicit bounded DOM-dependent SVG residual documented;
8. [x] add the shared large-output fallback for JSON/YAML and related text tools and pass the 1 MiB JSON browser fixture.
9. [x] move YAML Prettify to one bounded parse-once worker job and pass its 1 MiB responsiveness fixture;
10. [x] add production-service-worker offline-unavailable recovery with a privacy-safe fresh-document retry;
11. [x] replace the OUI monolith with a reproducible compact fixed-URL worker and reject the measured prefix-bucket privacy regression;
12. [x] make build-stat route closures worker-aware and complete the direct/shared randomness audit including UUID v1;
13. [x] deliver the local bounded NanoID feature plus strict JSON numeric-lexeme and YAML integer-preserving Prettify with exact worker-side full-payload UTF-8 bounds, a bounded 100,000-byte readonly preview, `<50 ms` measured Long Task gates, and final bundle/privacy regressions.
14. [x] harden YAML output sizing before serializer allocation for alias, indentation, escaping, and physical-line expansion; retain the 100,000-node capacity and stabilize the isolated Long Task fixture at 10/10 without weakening its threshold.
15. [x] **DONE:** delivered the bounded three-draft JSON Schema Validator, extracted the shared JSON/YAML one-shot worker transport, closed related malformed-protocol correctness gaps, and passed focused/full/browser/build-budget gates.
16. [x] **DONE:** delivered bounded local File Hash, same-file upload correctness, exact-key SHA worker protocols, compatible shared transport hardening, sampled peak-memory/Long Task/cancellation/replacement evidence, demand-cached offline reuse, and independent route/worker budgets.
17. [x] Execute `.ai/UI_CONSISTENCY.md` Phase 0–2: capture the live visual baseline, repair the shared field/choice/action primitives, and migrate the representative pilot with responsive, keyboard, visual, and bundle gates.
18. [x] Roll the accepted UI patterns through the remaining routes by archetype and make consistency regressions executable.
19. [x] Repair RSA as a fixed-preset explicit Web Crypto worker task with physical cancellation, prior-result retention, privacy coverage, and removal of its final UI-contract exceptions.
20. [x] Add the first deterministic representative screenshot/state fixtures and complete the bounded QR/Wi-Fi QR, HTML WYSIWYG, and JSON Diff P1 lifecycle/rendering slice.
21. [x] Expand visual baselines across the remaining archetypes and complete bounded JSON Diff array alignment plus the Math/SQL/XML/Markdown/Text Statistics worker slice.
22. [x] Add production large-input/Long Task evidence for SQL, XML, Markdown, Text Statistics, and JSON Diff; migrate JSON-to-TOML/YAML, YAML-to-JSON/TOML, and TOML-to-JSON/YAML to three parse-once source-family workers plus the shared vertical bounded-transformer lifecycle.
23. [x] Audit and migrate the remaining reactive XML-to-JSON/JSON-to-XML pair; migrate Docker Run-to-Compose to the same explicit-action, output-bound, cancellation, stale-result, and disposal policy with production responsiveness evidence.
24. [x] Measure and rank the remaining attacker-controlled main-thread transforms by input cost and output amplification; move Hash Text's eight reactive CryptoJS digests into one bounded route-owned worker with exact protocols, lifecycle/privacy coverage, and production Long Task evidence.
25. [x] Repair the three remaining `FormatTransformer` routes. JSON-to-CSV now parses JSON5 once in a bounded worker and limits CSV amplification; JSON Minify and List Converter were measured and migrated to bounded workers; the zero-caller `FormatTransformer` was removed.
26. [x] Close the remaining performance-first implementation slice: degrade large SQL display while retaining full copy/download, run and reject the worker-backed CodeMirror migration spike on interaction parity, move Emoji search into a bounded worker, accept the privacy-safe exact OUI payload as a documented product exception, preserve the nine-entry PWA contract, explicitly prebundle worker dependencies in Vite dev, and measure the initial-shell Lodash removal.
27. [x] Deliver the bounded JWT/HOTP, version-pinned common-license SPDX guidance, and OKLCH/sRGB-gamut wave without new runtime dependencies, then pass RFC/boundary, browser, route, and build-budget gates.
28. [x] Deliver bounded CSV/TSV import/inspection, scanner-compatible WPA3-intent/raw Wi-Fi QR output, and Chmod special-bit/umask workflows without new runtime dependencies, then pass boundary/browser/route/build-budget gates.
29. [x] Deliver compatible bounded Ansible Vault/htpasswd workflows, deterministic exact-first Command Palette search with accessible Show all, and explicit non-destructive escaped-JSON import, then pass official-fixture/unit/browser/route/build-budget gates.

Dependency/base-image vulnerability remediation and scan policy remain in the
separately tracked deferred security slice.
