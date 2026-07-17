# Performance Optimization Audit

## Executive summary

The application already lazy-loads every tool component, but several costs remain eager or unbounded. The largest verified opportunities are:

1. Fix the Text Diff lifecycle. Each SPA visit leaks roughly 20 MB after the first load because the Monaco editor, models, and subscriptions are never disposed.
2. Stop rendering large transformed documents as fully highlighted DOM. A 1 MB JSON input currently takes about 4.0 seconds and creates approximately 248,000 DOM nodes; YAML takes about 2.7 seconds and creates approximately 103,000 nodes.
3. Move potentially unbounded CPU work away from reactive keystroke handlers. Bcrypt, regular expressions, formatting, diffing, QR generation, and several parsers currently run on the main thread without a shared cancellation or size policy.
4. Redesign Monaco, the OUI database, and Emoji Picker loading. These routes have the largest transfer, parse, render, or memory costs.
5. Reduce the application shell and PWA install payload. The shell is 272.6 kB gzip and the service worker precaches 6.12 MB raw, including most tools that a user may never open.
6. Configure production compression and immutable caching. The current nginx configuration contains neither; the measured artifact compresses by 3.2–3.9 times for the largest JavaScript files.
7. Consolidate icon imports and build the application once per pipeline. The current build transforms 24,599 modules in 51.16 seconds, while CI rebuilds the same application independently in multiple jobs.

The best first delivery slice is not a framework rewrite. It is a small set of measurable changes: dispose Monaco correctly, configure its worker or replace it, introduce a large-output fallback, move bcrypt/regex work into cancellable workers, add asset budgets, and correct nginx/PWA caching.

## Scope and methodology

This audit covers the complete current branch, not only upstream changes. It combines:

- static inspection of all 416 TypeScript/Vue source files and all 86 registered tools;
- production build and manifest analysis;
- Workbox service-worker inventory;
- cold-route profiles in headless Chromium with service workers disabled;
- a second profile with 4x CPU throttling;
- interaction benchmarks for bcrypt and 100 kB/1 MB JSON/YAML inputs;
- forced-GC SPA navigation tests for Text Diff;
- isolated parser, dataset, storage, and crypto benchmarks;
- analysis of all 710 upstream issues and 997 upstream pull requests.

Measurements were taken on the audit workstation with Node 22.21.1, the repository's installed Playwright Chromium, and the production Vite build. Local-network timings are useful for CPU and payload comparison but are not internet latency measurements. Browser heap values are approximate; the forced-GC trend is the important signal. All projected gains below are explicitly marked as estimates.

## Measured baseline

### Build and asset inventory

| Metric | Current value |
|---|---:|
| Production build time | 51.16 s |
| Transformed modules | 24,599 |
| `dist/` size | 13 MB |
| Application shell | 885,863 B raw / 272,640 B gzip |
| Initial JavaScript | 853,311 B raw / 265,819 B gzip |
| Initial CSS | 32,552 B raw / 6,821 B gzip |
| Workbox precache | 270 files / 6,121,476 B raw |
| Theoretical gzip size of that precache | 1,900,866 B |
| Vite's Workbox report | 5,940.03 KiB |
| MAC Address Lookup, additional route closure | 3,350,554 B raw / 1,064,267 B gzip |
| Text Diff main JS | 3,161,296 B raw / 801,735 B gzip |
| Text Diff CSS | 112,426 B raw / 18,115 B gzip |
| Text Diff language chunks reachable from the manifest | 84 unique files / 570,069 B raw / 193,638 B gzip |
| Math Evaluator, additional route closure | 623,554 B raw / 180,030 B gzip |
| HTML WYSIWYG Editor, additional route closure | 539,697 B raw / 171,852 B gzip |
| PDF Signature Checker, additional route closure | 539,606 B raw / 215,459 B gzip |

The Text Diff manifest contains 92 dynamic-import references resolving to 84 unique language/mode chunks. The route does not fetch every language during a normal open, but Workbox precaches those small language chunks even though it excludes the 3.16 MB Monaco main chunk. This spends 570 kB of raw offline-install bandwidth on assets that cannot be reached offline until the excluded main chunk is available.

Workbox also excludes MAC Address Lookup because both it and Text Diff exceed the default per-file limit. Increasing that limit would make the install payload worse; shell-only precaching plus runtime caching is the appropriate design.

### Cold route profile

The table sums static resources after the document navigation. Vite Preview served compressible assets with gzip.

| Route | Compressed transfer | Decoded resources | DOM nodes | Used JS heap | Largest long task |
|---|---:|---:|---:|---:|---:|
| Home | 276 kB | 891 kB | 2,825 | 27.6 MB | 379 ms |
| MAC Address Lookup | 1,344 kB | 4,242 kB | 1,290 | 27.6 MB | 280 ms |
| Text Diff | 1,173 kB | 4,238 kB | 1,393 | 31.2 MB | 259 ms |
| Math Evaluator | 458 kB | 1,515 kB | 1,277 | 24.5 MB | 258 ms |
| HTML WYSIWYG Editor | 451 kB | 1,431 kB | 1,503 | 19.3 MB | 247 ms |
| Emoji Picker | 341 kB | 1,277 kB | 14,396 | 47.4 MB | 1,065 ms |
| JSON Prettify, default input | 344 kB | 1,071 kB | 1,373 | 17.1 MB | 264 ms |
| Bcrypt, default input | 326 kB | 1,017 kB | 1,355 | 17.1 MB | 256 ms |

The first long task on most routes includes shell evaluation. Emoji Picker adds a separate 1.06 second render task. Text Diff logs both of these warnings in production:

```text
Could not create web worker(s). Falling back to loading web worker code in main thread
You must define a function MonacoEnvironment.getWorkerUrl or MonacoEnvironment.getWorker
```

### 4x CPU profile

This profile approximates a slower mobile or low-power client. It is not a Lighthouse score.

| Route | Largest observed long task | Important secondary task |
|---|---:|---:|
| Home | 1,549 ms | 126 ms |
| MAC Address Lookup | 1,137 ms | 559 ms |
| Text Diff | 1,092 ms | 149 ms |
| Emoji Picker | 4,926 ms | 1,293 ms |

The result shows that the current shell and eager page rendering are not merely bundle-size concerns: they create multi-second periods during which input cannot be handled on slower devices.

### Large-input behavior

| Scenario | Input | Time through two animation frames | Largest long task | Result DOM |
|---|---:|---:|---:|---:|
| JSON Prettify | 99,921 B | 404 ms | 304 ms | 26,066 nodes |
| JSON Prettify | 1,018,191 B | 3,972 ms | 3,076 ms | 248,366 nodes |
| YAML Prettify | 101,287 B | 314 ms | 162 ms | 11,565 nodes |
| YAML Prettify | 1,029,787 B | 2,681 ms | 1,665 ms | 103,365 nodes |

Isolated Node benchmarks demonstrate where the time goes:

| Pipeline | Approximately 100 kB | Approximately 1 MB | Approximately 3 MB |
|---|---:|---:|---:|
| JSON validation plus format, including two parses | 26.6 ms | 181.1 ms | 542.1 ms |
| YAML validation plus format, including two parses | 158.0 ms | 1,002.7 ms | 2,965.4 ms |

Parsing twice is material, but it is not the whole browser cost. `TextareaCopyable` feeds the complete result into Naive UI/highlight.js, producing a span-heavy DOM. Large-output rendering is therefore the first optimization; parse-once and workers come next.

### Bcrypt responsiveness

`bcryptjs` currently runs `hashSync` from a computed value on every input event and permits 0–100 rounds.

| Rounds | One synchronous hash |
|---:|---:|
| 8 | 19.3 ms mean |
| 10 | 69.1 ms mean |
| 12 | 276.9 ms |
| 14 | 1,118.5 ms |

Typing ten characters at the default 10 rounds took 1,010 ms and created ten consecutive 74–80 ms long tasks. One explicit final hash would use roughly one tenth of that repeated work for this interaction. Because bcrypt cost grows exponentially, the current maximum of 100 is not a meaningful or safe UI limit.

### Text Diff memory lifecycle

The test opened Text Diff and returned to Home through SPA navigation, then forced a Chromium garbage collection after each cycle.

| State | Retained heap after GC |
|---|---:|
| Home baseline | 16.7 MB |
| After first Text Diff cycle | 44.9 MB |
| After second cycle | 64.7 MB |
| After third cycle | 84.8 MB |
| After fourth cycle | 104.2 MB |
| After fifth cycle | 124.3 MB |
| After sixth cycle | 143.9 MB |

After the first module load, each visit retains approximately 19–20 MB. The source creates a diff editor, two models, and two content listeners but has no unmount disposal. This is a confirmed critical leak, not a speculative optimization.

### Dataset and synchronous storage probes

- `oui-data` contains 34,503 keys and serializes to 3,409,293 bytes. Loading it in an isolated Node process added about 20.2 MB of heap. The UI only needs one vendor lookup by a six-hex-digit prefix.
- The emoji datasets contain 1,870 records. Building the Fuse index was inexpensive in isolation (about 10 ms), while a `smile` search took about 29 ms. Rendering all records is the dominant cost: 14,396 DOM nodes and a 1.06 second task.
- Synchronous `localStorage.setItem` averaged about 0.2 ms for 100 kB, 1.62 ms for 1 MB, and 3.66 ms for 3 MB in the local Chromium run. This is not the primary large-document bottleneck, but doing it on every edit adds jank, duplicates sensitive content, risks quota errors, and varies considerably by device.

## Ranked optimization work

### P0 — remove confirmed freezes and leaks

#### 1. Repair or replace Text Diff's Monaco integration

Evidence:

- 3.16 MB main JavaScript chunk;
- worker configuration is missing, so Monaco falls back to the main thread;
- 84 unnecessary unique language/mode chunks are emitted;
- roughly 20 MB is leaked per repeated SPA visit;
- two nullable accesses already fail type checking;
- large chunks explain self-hosted loading reports such as [issue #1273](https://github.com/CorentinTh/it-tools/issues/1273) and [issue #1665](https://github.com/CorentinTh/it-tools/issues/1665).

Implementation direction:

- evaluate a lightweight plain-text diff editor against a minimal Monaco editor-only import; select with a measured bundle comparison;
- do not import the `monaco-editor` package barrel when the tool does not use the full language catalog;
- configure a real editor worker through `MonacoEnvironment` if Monaco remains;
- keep explicit references to both models and content subscriptions;
- dispose subscriptions, models, editor, and any worker on unmount;
- throttle or opt out of content persistence and handle quota failures;
- add an SPA lifecycle test that opens/closes the route repeatedly and a bundle manifest assertion.

Acceptance criteria:

- less than 5 MB retained-heap growth after ten open/close cycles with forced GC;
- no Monaco worker warning;
- no Monaco language chunks for a plain-text-only editor;
- no main-thread task above 50 ms for normal edits;
- target additional route payload below 350 kB gzip, to be validated against the chosen editor.

#### 2. Introduce a large-document execution and rendering policy

This should be shared by JSON, YAML, TOML, XML, SQL, Markdown, text statistics, diff tools, and future parsers.

- Debounce small-input live preview.
- Switch to an explicit **Run/Format** action above a documented threshold.
- Parse once and pass either the parsed value or a structured error through validation and transformation.
- Run expensive parse/format/diff work in a module worker with job IDs, cancellation, and a hard time budget.
- Reject or degrade gracefully by byte size, nesting depth, item count, and output size.
- Render large results as plain read-only text or a virtualized editor. Do not syntax-highlight a megabyte into hundreds of thousands of spans.
- Keep copy/download actions outside the scroll container and available even when highlighting is disabled.
- Never put a large result into reactive deep proxies when a shallow value is sufficient.

Acceptance criteria:

- a 1 MB JSON or YAML input never creates a main-thread task above 50 ms;
- output DOM remains below 5,000 nodes for a 1 MB fixture;
- the UI remains interactive and cancellation works while a worker is running;
- byte/depth/output limits have unit and Playwright fixtures.

#### 3. Isolate adversarial CPU work

Regex execution is particularly important because JavaScript cannot interrupt a catastrophic regular expression on the same thread. RandExp and regex SVG rendering add two more unbounded computations.

- Put matching/generation/rendering in separate terminate-and-replace workers.
- Debounce edits and attach monotonically increasing job IDs so stale results cannot win.
- Limit pattern length, input length, match count, generated sample length, and diagram complexity.
- Fix optional capture handling before exposing worker results.
- Do not synchronize the query string and `localStorage` on every regex keystroke.

Bcrypt should use an explicit action in a dedicated worker. Async `bcryptjs` alone yields more often but does not provide a reliable CPU cancellation boundary. Cap rounds to a practical range, validate empty/null input, terminate stale jobs, show elapsed time, and enforce a hard deadline. The behavior in [PR #1152](https://github.com/CorentinTh/it-tools/pull/1152) is a useful specification, but its implementation must be adapted to this branch and current limits.

### P1 — delivery and offline performance

#### 4. Enable compression and cache immutable artifacts

The current `nginx.conf` only defines SPA fallback. For the container path:

- precompress `.js`, `.css`, `.json`, `.svg`, and manifest assets during the build, or enable verified gzip/Brotli in nginx;
- serve hashed assets with `Cache-Control: public, max-age=31536000, immutable`;
- serve `index.html`, `sw.js`, and `manifest.webmanifest` with revalidation/no-cache semantics;
- preserve the SPA fallback without returning `index.html` for a missing hashed asset;
- add ETag/content-type tests and a container-level compression test;
- verify reverse-proxy behavior instead of assuming the outer proxy adds compression.

Measured artifact ratios indicate a 3.2x reduction for the shell JS, 3.15x for MAC Address Lookup, and 3.94x for Text Diff when gzip is actually used. This is a byte-transfer gain for the current container configuration, not a claim that JavaScript execution becomes four times faster.

#### 5. Make the PWA cache demand-driven

The default `generateSW` inventory precaches nearly every lazy route. Replace it with an explicit policy:

- precache only the HTML shell, critical shell JS/CSS, manifest, and icons;
- use `CacheFirst` runtime caching for content-hashed route chunks;
- provide a user-visible optional “Make all tools available offline” action if complete offline installation is a product requirement;
- report unavailable offline tools clearly instead of showing a blank route;
- clean old caches after a successful update and test update rollback;
- never solve the current problem by raising Workbox's per-file limit globally.

Reducing the mandatory precache from 6.12 MB raw to a sub-1 MB shell is a measured-payload opportunity of roughly 6x. Runtime caching preserves offline use after a tool is opened.

#### 6. Compact and partition MAC vendor data

The route loads a 34,503-entry JavaScript object to perform one prefix lookup.

Options to benchmark:

- a compact sorted prefix/value table with binary search;
- a generated binary format decoded in a worker;
- first-byte or first-two-byte buckets fetched on demand;
- a small recent/common prefix cache plus a lazy full database;
- update the data in a reproducible generation step rather than bundling package-shaped JavaScript.

The acceptance target is below 250 kB gzip for a typical lookup and no main-thread task over 50 ms. A 3–10x typical transfer reduction is plausible but remains an estimate until competing formats are built and measured.

### P1 — render and shell performance

#### 7. Virtualize Emoji Picker and large result collections

The current 1,870-record dataset is not unusually large, but rendering every card eagerly is. Keep the Fuse index and change presentation:

- virtualize the grid or initially render a bounded page per category;
- use `content-visibility` only as a progressive enhancement, not as the sole memory strategy;
- keep search results virtualized and cancel stale searches;
- lazy-load details or secondary metadata only when visible;
- preserve keyboard navigation and accessibility while virtualizing.

[PR #1374](https://github.com/CorentinTh/it-tools/pull/1374) reports an upstream 40% improvement through bounded initial groups. Use that idea as a benchmark candidate, not as a commit to copy. The local target should be fewer than 2,000 DOM nodes and no task above 200 ms on the 4x CPU profile.

The same bounded-rendering rule applies to regex matches, generated IDs, expanded lists, diff trees, HTTP/MIME tables, and future file viewers.

#### 8. Reduce the application shell

All tool components are lazy, but every descriptor and icon is statically imported by `src/tools/index.ts`. The shell also initializes translation, the command palette, the full Home grid, and multiple icon systems.

Recommended sequence:

1. Generate a lightweight descriptor manifest containing strings, routes, keywords, category, and an icon key.
2. Use one sprite/direct virtual-icon mechanism rather than package barrels from four icon systems.
3. Resolve the component import from a generated route map and keep heavy module code out of descriptors.
4. Precompute or remove `isNew`; importing date helpers at runtime is unnecessary when all current tools are older than two weeks.
5. Render the Home grid progressively or virtually. It currently creates 2,825 nodes before any interaction.
6. Load drag-and-drop support only when favorites exist and editing/reordering is requested.
7. Build the command-palette index lazily on first open or during idle time.
8. Continue the incremental custom UI migration only where measurements show Naive UI is retaining shell code; do not perform an unmeasured big-bang rewrite.

The current code imports icons through `@vicons/tabler` in 79 files, `@vicons/material` in 10, `@tabler/icons-vue` in two, and unplugin-icons in seven. The installed icon packages expose very large barrel entry points. Consolidation should be judged by transformed-module count, shell gzip size, and visual/a11y regression tests. [PR #1373](https://github.com/CorentinTh/it-tools/pull/1373) provides useful inventory work, but replacing one barrel with another is not sufficient proof of improvement.

#### 9. Remove full CommonJS utility imports from shared code

There are 42 source/script imports of Lodash, predominantly `import _ from 'lodash'`. Shared shell modules use only small operations such as `noop`, `isNil`, grouping, sampling, and taking values.

- Prefer native operations for trivial cases.
- For non-trivial helpers, compare direct ESM imports or `lodash-es` with current output.
- Keep readability and behavior tests; do not mechanically rewrite complex chains without measurements.
- Add a bundle check that the full Lodash 4.17.21 build is not present in the shell.

This is likely a tens-of-kilobytes shell improvement. It is not expected to solve route-level pauses by itself.

### P1/P2 — tool execution improvements

| Area | Current cost/risk | Direction |
|---|---|---|
| JSON/YAML converters and viewers | Validation and transformation often parse the same input twice | Parse once into a typed result, debounce, worker for large input, plain output above threshold |
| SQL/XML/Markdown | Full format/render on every edit; shared highlighted output can explode DOM | Debounce or explicit run, worker where possible, bounded plain output |
| HTML WYSIWYG | Prettier runs asynchronously for every document change and output is highlighted | Idle/debounced formatting, cancel stale jobs, format on demand for large documents |
| QR and Wi-Fi QR | Async `toDataURL` starts on every watched change with no ordering guard | Debounce, job token, ignore stale results, prefer SVG/canvas when it avoids large data URLs |
| Text Statistics | Multiple complete string scans and a `TextEncoder` allocation on every render | One streaming pass after debounce; worker for multi-megabyte text |
| Math Evaluator | Full `mathjs` route and evaluation on every keystroke | Smaller configured math build, explicit/debounced evaluation, expression complexity limits |
| JSON Diff | Recursive tree creation plus deep equality at every nested node; arrays align only by index | Compute status in one traversal, lazy/virtual tree, depth/output limits, optional LCS/key alignment |
| Camera Recorder | Video object URLs are never revoked; screenshots are retained as base64 strings | Revoke on delete/unmount, cap retained media, use Blob URLs for images, show memory limits |
| ASCII Art | Every change can race an asynchronous CDN font load | Bundle a default font, cache loaded fonts, cancel stale jobs, use HTTPS fallback only |
| PDF/crypto/file tools | Large files and crypto can monopolize the main thread | Transfer `ArrayBuffer`s to workers, stream/chunk where supported, size/time limits |

#### 10. Fix duplicate work in `computedRefreshable`

`computedRefreshable` and `computedRefreshableAsync` pass the expensive getter itself to `watch`. Vue executes that getter to collect dependencies and again when the visible computed value refreshes. The async version can start an unobserved job and then a second visible job. This affects UUID, ULID, token, MAC, lorem, OTP, random port, and RSA generation; RSA can therefore start redundant key-generation work.

Replace this design with explicit dependency sources plus a refresh counter, or a single computed/task abstraction that owns one execution, cancellation, and state. Add tests proving exactly one invocation per dependency change and per manual refresh.

#### 11. Make persistence bounded and asynchronous where appropriate

The local fork intentionally added useful state persistence, so the goal is to preserve that behavior safely:

- persist small settings immediately;
- debounce content writes and cap stored byte size;
- use opt-in IndexedDB for large documents rather than synchronous `localStorage`;
- never persist secrets, private keys, OTP material, or uploaded file contents by default;
- expose per-tool and global clear actions;
- version schemas and handle quota/security exceptions;
- do not serialize content in both URL and storage on each input event.

### P2 — build, CI, and container iteration speed

#### 12. Reduce transformed modules

The 24,599-module build strongly correlates with large icon barrels and Monaco's package barrel. The installed package trees are also very large: `@vicons/tabler` has 9,122 files, `@vicons/material` 63,344, `@tabler/icons-vue` 11,381, and Monaco 1,385.

- use direct virtual SVG/icon modules or a generated sprite;
- avoid Monaco's root export;
- remove unused local/demo imports and packages;
- narrow auto-component scanning to directories that actually contain reusable components;
- move type-only/build-only packages to development dependencies;
- generate the registry/locales without repeatedly editing and scanning broad barrel files;
- inspect a bundle metafile/source map after each step rather than trusting package-level tree-shaking claims.

A warm-build target below 20 seconds is reasonable but estimated. Track module count and peak RSS as well as elapsed time, because upstream [issues #442](https://github.com/CorentinTh/it-tools/issues/442) and [#1008](https://github.com/CorentinTh/it-tools/issues/1008) document build OOM on constrained hosts.

#### 13. Build once and reuse artifacts

On a normal push, CI builds in the main job and independently in all three E2E shards. Release workflows build Docker images and a separate ZIP.

- create one frozen-lockfile production artifact;
- upload it for all browser shards and release packaging;
- use a single tested artifact as the Docker content where the release design permits;
- fix the Playwright cache key, which currently reads nonexistent `.dependencies.playwright` instead of `devDependencies['@playwright/test']`;
- cache the pnpm store and Playwright browsers with exact lock/tool versions;
- shard browser tests after artifact creation, not the build itself;
- preserve provenance, checksums, and an SBOM when reusing release artifacts.

This removes at least two redundant production builds from the E2E matrix. It also prevents browser tests from validating an artifact different from the release ZIP.

#### 14. Optimize Docker build layers

- pin Node, pnpm, and nginx versions and digests;
- use Corepack rather than installing the latest global pnpm;
- use `pnpm fetch` plus a BuildKit cache mount for the store;
- keep dependency and source layers separate;
- share architecture-independent build output across multi-architecture image stages where BuildKit permits;
- add a non-root runtime, health check, read-only-rootfs test, compression test, and container size budget.

Incremental container build gains of 2–5x are plausible with a warm pnpm/BuildKit cache, but this remains an estimate until the target CI runner is benchmarked.

## Expected impact: measured versus estimated

| Change | Evidence | Expected result |
|---|---|---|
| Dispose Text Diff resources | Forced-GC profile | Eliminate approximately 20 MB retained per repeat visit; measured opportunity |
| Explicit bcrypt action + worker | Ten typed characters caused ten hashes and 1.01 s work | Roughly 10x less repeated hashing for that interaction; measured work reduction |
| Plain/virtualized large output | 1 MB JSON: 4.0 s and 248k nodes | Multi-second main-thread pause removed; exact worker end-to-end time must be measured |
| nginx compression | Artifact ratios of 3.2–3.9x | 3.2–3.9x fewer transferred JS bytes when the current container otherwise sends raw assets |
| Shell-only PWA precache | 6.12 MB current raw inventory | Approximately 6x smaller mandatory install if kept below 1 MB raw |
| Emoji virtualization | 14,396 nodes and 1.06 s route task | More than 70% fewer nodes is a target; upstream reports 40% time improvement |
| Partition OUI database | 3.41 MB data for one lookup | Estimated 3–10x typical route transfer reduction |
| Parse once | Duplicate parse paths confirmed | Up to about 2x parser-phase improvement; much less if rendering remains unchanged |
| Icon/direct-import cleanup | 24,599 transformed modules | Estimated 2–5x warm build improvement only after measured experiments |
| Build once for E2E | Three shard builds plus CI build | Two redundant E2E builds removed deterministically |

## Proposed performance budgets

These are initial guardrails and should be calibrated after the first optimization slice:

| Budget | Target |
|---|---:|
| Shell JS | <= 200 kB gzip, then ratchet downward |
| Mandatory PWA precache | <= 1 MB raw and <= 350 kB compressed transfer |
| Normal route additional JS | <= 150 kB gzip unless explicitly approved |
| Text Diff additional payload | <= 350 kB gzip |
| MAC lookup typical additional payload | <= 250 kB gzip |
| Main-thread task during normal interaction | < 50 ms |
| Home largest task under 4x CPU | < 300 ms |
| Emoji initial DOM | < 2,000 nodes |
| 1 MB formatted output DOM | < 5,000 nodes |
| Text Diff heap growth after 10 cycles | < 5 MB after forced GC |
| Warm production build | < 20 s on the audit runner |
| Route smoke coverage | 86/86 tools, no console/page errors |

Any intentional exception should record the reason, owner, measured user value, and a route-specific ceiling.

## Measurement and regression infrastructure

1. Add a deterministic `build:stats` command that emits manifest totals, per-route closures, dynamic-import counts, and Workbox inventory as JSON.
2. Store a reviewed baseline and fail CI only on meaningful regression thresholds, not hash/name changes.
3. Add Chromium performance smoke cases for Home, Text Diff, Emoji, MAC Lookup, JSON/YAML, Bcrypt, Regex, Math, WYSIWYG, and PDF.
4. Include 100 kB, 1 MB, deep nesting, malformed input, catastrophic regex, and repeated-navigation fixtures.
5. Capture long tasks, DOM count, console errors, route bytes, and forced-GC heap trends.
6. Run a smaller mandatory suite on every pull request and a full cross-browser/profile suite on a schedule.
7. Add [PR #1170](https://github.com/CorentinTh/it-tools/pull/1170)'s all-route smoke-test idea, adapted to fail on page errors, chunk failures, and unexpected console warnings.
8. Measure on both a fast desktop and a 4x CPU/slow-network profile; do not optimize only local unthrottled load time.

## Recommended execution order

1. Restore green lint/typecheck and add build/route measurement scripts.
2. Fix Monaco disposal, worker loading, and bundle imports.
3. Add the large-document output fallback and worker/task abstraction.
4. Move bcrypt and regex to cancellable workers with explicit limits.
5. Correct nginx compression/cache headers and redesign PWA caching.
6. Virtualize Emoji and partition OUI data.
7. Reduce shell registry/icons/Lodash and progressively render Home.
8. Rework CI/Docker caching and artifact reuse.
9. Ratchet budgets after each verified improvement.

This order deliberately develops the local fork forward. Upstream pull requests are specifications and sources of test cases; they are not a synchronization plan.
