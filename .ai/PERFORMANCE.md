# Performance Optimization Audit

## Implementation status — 2026-07-18

- **DONE — executable build guardrail:** deterministic report schema v4 plus budget schema v1 include literal route-owned workers and enforce shell, required Workbox membership, default dynamic-route, rationale-backed heavy-route ceilings, and an independent reviewed File Hash worker ceiling in CI/release. Sixteen infrastructure tests and 202 current-artifact checks pass; standard-runner build-time/modules/RSS telemetry remains separate.
- **DONE — Text Diff lifecycle/heap:** editor-only Monaco import, a real worker, complete disposal, and cross-route layout repair reduced ten-cycle retained growth to +2.46 MiB with zero workers, below the `<5 MiB` budget.
- **IN PROGRESS — Text Diff payload:** main JS is 2,206,864 B raw / 570,786 B gzip (down 30.2% / 28.8%); schema-v4 includes its 206,100 B raw / 63,981 B gzip worker, making the true route closure 2,474,507 B raw / 646,976 B gzip. The measured comparison retains repaired Monaco until a worker-backed CodeMirror spike passes parity, adversarial-input, lifecycle, and `<350 kB` gates.
- **DONE — mandatory PWA payload and cache-miss UX:** shell-only precache contains nine HTML/JS/CSS/Workbox-runtime/manifest/icon entries at 956,157 B raw / 327,325 B gzip, down from 270 entries / 6,121,476 B raw / 1,911,520 B gzip. Opened chunks reload offline; File Hash proves its route and worker are demand-cached and can hash again after clean-HTTP-cache offline reload; an uncached lazy route shows recovery instead of stale content/blank UI and retries through an origin-verified, privacy-safe fresh document. Update/rollback and stale-cache cleanup remain separate work.
- **DONE — current container delivery contract:** gzip, immutable hashed assets, HTML/SW/manifest revalidation, strict missing assets, local Figlet delivery, and headers pass rootless/read-only default-and-arbitrary-UID smoke. Reverse-proxy/subpath acceptance remains a separate deployment task.
- **DONE — shared layout lifecycle:** persistent `BaseLayout` reduced ten Home/tool cycles from +188.40 MiB retained heap to +0.86 MiB, with DOM 5,036 -> 5,037 and listeners 807 -> 809.
- **DONE — Text Statistics:** character, word, CR/LF line, and UTF-8 byte counts now share one O(n) pass with O(1) auxiliary space instead of repeated splits plus a `TextEncoder` allocation.
- **DONE — Bcrypt responsiveness:** reactive synchronous hashing/comparison is replaced by explicit dedicated-worker tasks with cancellation, stale-result protection, a ten-second deadline, 72-byte input bound, and a measured 4–14 rounds range.
- **DONE — local file hashing:** the third catalog feature uses one route-owned worker pass and fixed 4 MiB reads, so application-controlled buffering is one window plus seven small incremental hash states instead of file size; browser-engine physical zero-copy is not claimed. SHA-256/384/512, SHA3-256, BLAKE3-256, SHA-1, and MD5 are available, with visible legacy warnings for SHA-1/MD5. The original production 256 MiB/all-three-SHA-2 run is 9,999 ms with 0.0 ms longest observed Long Task, +1,922,904 B peak page heap, +91,242,496 B peak sampled Chromium-process RSS, and +260,696 B retained page heap. Its current additional closure is 70,260 B raw / 26,677 B gzip and worker 25,899 B / 10,417 B; the worker remains demand-loaded and separately gated at 30/12 kB.
- **DONE — Camera media lifecycle:** image/video Blob URLs have one owner; recordings use 1-second chunks and stop at 5 minutes or 64 MiB; screenshots are single-flight, reject more than 16,777,216 pixels/64 MiB before canvas allocation, cap encoded output at 16 MiB, and ignore callbacks after unmount; retained media is bounded to 12/4 items and 128 MiB total with deterministic revoke-on-delete/evict/unmount behavior.
- **DONE — Regex responsiveness:** matching and RandExp use separate terminate-and-replace workers with a 1.2-second deadline, explicit limits, stale/cancel guards, and a live-heartbeat catastrophic fixture. Sample generation projects the AST before allocation, including nested repetitions and lexically numbered backreferences. DOM-dependent SVG is single-flight, explicit and bounded but remains on the main thread.
- **DONE — shared large-output rendering slice:** highlighted output switches above 100,000 UTF-8 bytes to one readonly `<textarea>` with a UTF-8-safe 100,000-byte preview and zero descendants; Copy retains the complete bounded output in memory.
- **DONE — YAML parse/worker slice:** YAML Prettify parses once in a terminate-and-replace worker with input/output/depth/node/alias/time bounds, `BigInt` integers, exact worker-side UTF-8 accounting, explicit large-input formatting, and stale/cancel/dispose guards. A conservative graph projection rejects alias, indentation, escaping, and physical-line output amplification before `Document.toString()` while preserving valid 90,000-node/1 MiB inputs. Its final isolated production Chromium fixture is 203 ms format-ready with 0.0 ms observed longest Long Task and passes 10/10 repeats.
- **DONE — JSON lossless parse/worker slice:** strict JSON Prettify preserves original numeric lexemes in one bounded worker AST while JSON5 remains an explicit non-lossless compatibility mode with an incremental 4 MiB writer. Full-payload/output-limit UTF-8 accounting stays in the worker; the main thread scans only the bounded 100,000-byte preview. The final production Chromium fixture is 404 ms cold-route / 197 ms format-ready with 0.0 ms observed longest Long Task.
- **DONE — JSON Schema worker slice:** the three-draft local validator owns a 161,471 B raw / 47,125 B gzip worker and a 176,585 B / 53,355 B additional route closure, both below their 200/60 and 300/100 kB gates. Its final production Chromium fixture measures 246 ms cold route / 205 ms 1 MiB result-ready / 0.0 ms longest observed Long Task; branch-heavy `allErrors` is fail-fast above 20,000 projected schema/instance node pairs, and the current mandatory PWA install remains nine entries / 956,157 B raw / 327,325 B gzip. The feature's accepted registry increment was 350 B gzip; Ajv remains lazy in the owned worker and creates no new chunk above 500 kB.
- **DONE — Emoji bounded rendering slice:** initial presentation is 60 cards / 1,731 DOM elements; additional route payload fell to 272,834 B raw / 32,488 B gzip, keyword metadata is lazy, and search uses one paged grid without losing Fuse relevance order. Synchronous Fuse cancellation and the 4x CPU gate remain open.
- **DONE — isolated CI optimization:** Playwright cache identity no longer reads the wrong dependency section; BuildKit uses a pnpm store cache plus `pnpm fetch`.
- **IN PROGRESS — OUI payload:** a generated compact fixed-URL worker reduces the full closure from 3,350,554 B raw / 1,064,267 B gzip to 1,937,384 B / 770,467 B while keeping MAC prefixes out of network URLs. The smaller 112-bucket prototype was rejected for access-log privacy; the `<250 kB` product target now requires an explicit coverage/product trade-off.
- **NOT STARTED:** shell/icon/Lodash reduction outside the completed slices above.

The raw checkpoint and before/after table are maintained in `.ai/PROGRESS.md`.
No budget is marked achieved merely because a metric improved.

## Executive summary

The application already lazy-loads every tool component, but several costs remain eager or unbounded. The largest verified opportunities are:

1. Keep the now-repaired Text Diff and shared-layout lifecycle behind forced-GC regression gates; the original branch leaked roughly 20 MB per visit.
2. Keep the completed plain large-output fallback, then move the remaining parse/format path into bounded tasks; the original 1 MB JSON baseline took about 4.0 seconds and created approximately 248,000 DOM nodes.
3. Reuse the completed Bcrypt/Regex task patterns for formatting, diffing, QR generation, and parsers that still lack a shared cancellation/size policy.
4. Execute the recorded worker-backed CodeMirror gate and decide the OUI exact-coverage trade-off; the editor comparison and privacy-safe OUI redesign are complete.
5. Reduce shell JavaScript further while preserving the completed nine-entry demand-driven PWA install policy.
6. Preserve the now-verified production gzip and immutable/revalidation cache policies while adding reverse-proxy/subpath coverage.
7. Consolidate icon imports and build the application once per pipeline. The original audit transformed 24,599 modules in 51.16 seconds; the current local build transforms 24,185 in 19.86 seconds, but standard-runner build/RSS telemetry and redundant pipeline builds remain open.

That first measurable delivery slice is now largely complete: Monaco lifecycle,
bounded large-output preview, Bcrypt/Regex/JSON/YAML workers, asset budgets, and
nginx/PWA caching all have executable gates. OUI uses a privacy-safe compact
worker. Text Diff transfer size, a common heavy-task policy, remaining
converters/parsers, and shell reduction are the next frontier.

## Scope and methodology

This audit covers the complete current branch, not only upstream changes. It combines:

- static inspection of the original 416 TypeScript/Vue source files and the current 89 registered tools;
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

### Original audit build and asset inventory

| Metric | Original audit value |
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

This is the audit baseline: parsing twice is material, but it is not the whole browser cost. `TextareaCopyable` fed the complete result into Naive UI/highlight.js, producing a span-heavy DOM. Large-output rendering is now bounded, and JSON/YAML Prettify both parse once in workers; the remaining structured-transform paths come next.

### Bcrypt responsiveness

The audited implementation ran `bcryptjs.hashSync` from a computed value on every input event and permitted 0–100 rounds. The current slice replaces that path with explicit dedicated-worker tasks and bounds rounds to 4–14.

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

After the first module load, the audited implementation retained approximately
19–20 MB per visit. This table is the original problem baseline.

**Current result (2026-07-18):** after adding real worker ownership and complete
editor/model/listener disposal, ten warmed Text Diff route cycles retain
2,577,920 B (+2.46 MiB) with zero workers, passing the `<5 MiB` gate. The same
probe exposed a separate dynamic-layout leak; persistent `BaseLayout` reduced ten
Home/tool cycles from +188.40 MiB to +906,072 B (+0.86 MiB), with stable DOM and
listener counts.

### Dataset and synchronous storage probes

- `oui-data` contains 34,503 keys and serializes to 3,409,293 bytes. Loading it in an isolated Node process added about 20.2 MB of heap. The UI only needs one vendor lookup by a six-hex-digit prefix.
- The emoji datasets contain 1,870 records. Building the Fuse index was inexpensive in isolation (about 10 ms), while a `smile` search took about 29 ms. Rendering all records is the dominant cost: 14,396 DOM nodes and a 1.06 second task.
- Synchronous `localStorage.setItem` averaged about 0.2 ms for 100 kB, 1.62 ms for 1 MB, and 3.66 ms for 3 MB in the local Chromium run. This is not the primary large-document bottleneck, but doing it on every edit adds jank, duplicates sensitive content, risks quota errors, and varies considerably by device.

**Current Emoji result (2026-07-18):** production rendering starts with 60
cards / 1,731 DOM elements and expands 60 -> 120 on demand. Full-catalog
`face` search reached its first complete page in 166 ms with no Long Task API
entry at or above 50 ms on the unthrottled runner. `emojilib` moved to a
116,181 B raw / 32,015 B gzip lazy chunk; one paged result grid preserves Fuse
relevance order, while synchronous cancellation and
the 4x CPU acceptance profile remain open.

## Ranked optimization work

### P0 — remove confirmed freezes and leaks

#### 1. Repair or replace Text Diff's Monaco integration

**Audit baseline (all items below except the payload target are resolved):**

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

**Current structured-output result (2026-07-18):** strict JSON and YAML
Prettify satisfy these gates. YAML additionally projects graph output before
constructing/serializing the document, so scalar aliases, deep indentation,
escaped controls, and spaces adjacent to physical line breaks cannot allocate
past the 4 MiB output limit inside the serializer. Normal 1 MiB and flat
90,000-node inputs remain accepted.

#### 3. Isolate adversarial CPU work

Regex execution is particularly important because JavaScript cannot interrupt a catastrophic regular expression on the same thread. RandExp and regex SVG rendering add two more unbounded computations.

- Put matching/generation in separate terminate-and-replace workers; move rendering only after a DOM-free or isolated renderer is selected.
- Debounce edits and attach monotonically increasing job IDs so stale results cannot win.
- Limit pattern length, input length, match count, generated sample length, and diagram complexity.
- Fix optional capture handling before exposing worker results.
- Do not synchronize the query string and `localStorage` on every regex keystroke.

Bcrypt should use an explicit action in a dedicated worker. Async `bcryptjs` alone yields more often but does not provide a reliable CPU cancellation boundary. Cap rounds to a practical range, validate empty/null input, terminate stale jobs, show elapsed time, and enforce a hard deadline. The behavior in [PR #1152](https://github.com/CorentinTh/it-tools/pull/1152) is a useful specification, but its implementation must be adapted to this branch and current limits.

**Current result (2026-07-18):** Bcrypt is explicit and worker-backed.
Regex matching and RandExp run in separate terminate-and-replace module workers
with job IDs, 1.2-second deadlines, stale guards, and bounded input/output.
The SVG library requires `document`, so diagram generation is no longer
reactive: it is an explicit detached-DOM main-thread task bounded to a 1 KiB
pattern, 1,500 nodes, and 256 KiB output. A DOM-free or isolated renderer is
required before that residual can leave the main thread.

### P1 — delivery and offline performance

#### 4. Enable compression and cache immutable artifacts

At the audit baseline, `nginx.conf` only defined SPA fallback. The implemented container path now follows these rules:

- precompress `.js`, `.css`, `.json`, `.svg`, and manifest assets during the build, or enable verified gzip/Brotli in nginx;
- serve hashed assets with `Cache-Control: public, max-age=31536000, immutable`;
- serve `index.html`, `sw.js`, and `manifest.webmanifest` with revalidation/no-cache semantics;
- preserve the SPA fallback without returning `index.html` for a missing hashed asset;
- add ETag/content-type tests and a container-level compression test;
- verify reverse-proxy behavior instead of assuming the outer proxy adds compression.

Measured artifact ratios indicate a 3.2x reduction for the shell JS, 3.15x for MAC Address Lookup, and 3.94x for Text Diff when gzip is actually used. This is a byte-transfer gain for the current container configuration, not a claim that JavaScript execution becomes four times faster.

#### 5. Make the PWA cache demand-driven

At the audit baseline, the default `generateSW` inventory precached nearly every lazy route. The replacement policy is:

- precache only the HTML shell, critical shell JS/CSS, manifest, and icons;
- use `CacheFirst` runtime caching for content-hashed route chunks;
- provide a user-visible optional “Make all tools available offline” action if complete offline installation is a product requirement;
- report unavailable offline tools clearly instead of showing a blank route;
- clean old caches after a successful update and test update rollback;
- never solve the current problem by raising Workbox's per-file limit globally.

Reducing the mandatory precache from 6.12 MB raw to a sub-1 MB shell is a measured-payload opportunity of roughly 6x. Runtime caching preserves offline use after a tool is opened.

**Current result (2026-07-18):** mandatory precache is nine entries /
956,157 B raw / 327,325 B gzip. A Chromium production-preview fixture opens a
lazy route, observes its four hashed assets in the bounded runtime cache,
clears the HTTP cache, goes offline, and reloads successfully with document,
shell, Workbox client runtime, and lazy assets served by the service worker
(318 ms controller, 94 ms online route, 290 ms offline reload in the recorded
run). A second production-Workbox fixture forces an uncached asset miss, hides
the prior tool, shows the recovery state, and succeeds through a query-free
fresh document after reconnect. Update/rollback and stale-cache cleanup remain
open. A separate File Hash fixture confirms both its route and dedicated worker
enter only the bounded runtime cache, then recomputes SHA-256 after HTTP-cache
clearing and offline reload.

#### 6. Compact and partition MAC vendor data

The audited route loaded a 34,503-entry JavaScript object to perform one prefix lookup.

Options to benchmark:

- a compact sorted prefix/value table with binary search;
- a generated binary format decoded in a worker;
- first-byte or first-two-byte buckets fetched on demand;
- a small recent/common prefix cache plus a lazy full database;
- update the data in a reproducible generation step rather than bundling package-shaped JavaScript.

The audit-stage acceptance target was below 250 kB gzip for a typical lookup and no main-thread task over 50 ms. The original 3–10x projection was an estimate; competing formats have now been built and measured below.

**Current result (2026-07-18):** compact dictionary, varint, binary, and 112
bucket forms were generated and measured. Buckets reached about 66.9 kB gzip
for the worst individual request but were rejected because prefix-derived URLs
would disclose MAC input in access logs. The accepted fixed-URL worker keeps
all input inside `postMessage`, reuses one worker across offline lookups, and
reduces the full closure from 3,350,554 B raw / 1,064,267 B gzip to 1,937,384 B
/ 770,467 B. The `<250 kB` target remains open and cannot be claimed without a
new coverage/product decision.

### P1 — render and shell performance

#### 7. Virtualize Emoji Picker and large result collections

The current 1,870-record dataset is not unusually large, but rendering every card eagerly is. Keep the Fuse index and change presentation:

- virtualize the grid or initially render a bounded page per category;
- use `content-visibility` only as a progressive enhancement, not as the sole memory strategy;
- keep search results virtualized and cancel stale searches;
- lazy-load details or secondary metadata only when visible;
- preserve keyboard navigation and accessibility while virtualizing.

[PR #1374](https://github.com/CorentinTh/it-tools/pull/1374) reports an upstream 40% improvement through bounded initial groups. Use that idea as a benchmark candidate, not as a commit to copy. The local target should be fewer than 2,000 DOM nodes and no task above 200 ms on the 4x CPU profile.

**Current result (2026-07-18):** bounded pagination renders 60 cards initially
and 120 after one explicit load, with 1,731 initial DOM elements. Copy controls
are keyboard-native, complete ZWJ/flag sequences are retained, and secondary
keyword metadata loads only on search. This meets the DOM budget without
claiming true virtualization; cancellable Fuse execution and the 4x CPU target
remain separate gates.

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
| Remaining JSON/YAML converter paths | JSON and YAML Prettify are parse-once, bounded and worker-backed; converters still have independent parse/number policies | Reuse the typed lossless contract where destinations support it, parse once, debounce, worker for large input, and keep output bounded |
| SQL/XML/Markdown | Full format/render on every edit; shared highlighted output can explode DOM | Debounce or explicit run, worker where possible, bounded plain output |
| HTML WYSIWYG | Prettier runs asynchronously for every document change and output is highlighted | Idle/debounced formatting, cancel stale jobs, format on demand for large documents |
| QR and Wi-Fi QR | Async `toDataURL` starts on every watched change with no ordering guard | Debounce, job token, ignore stale results, prefer SVG/canvas when it avoids large data URLs |
| Text Statistics | **Current:** one O(n), O(1)-space streaming pass; multi-megabyte input still runs synchronously | Add explicit/debounced worker mode only with the shared large-input policy |
| Math Evaluator | Full `mathjs` route and evaluation on every keystroke | Smaller configured math build, explicit/debounced evaluation, expression complexity limits |
| JSON Diff | Recursive tree creation plus deep equality at every nested node; arrays align only by index | Compute status in one traversal, lazy/virtual tree, depth/output limits, optional LCS/key alignment |
| Camera Recorder | **Current:** owned Blob URLs, 1-second recording chunks, 5-minute/64-MiB video, single-flight screenshots with a 16,777,216-pixel/64-MiB raw preallocation check, 16-MiB encoded cap, and late-callback guard, 128-MiB aggregate and 12/4 item bounds; revoke on delete/evict/unmount | Preserve the lifecycle/limit tests; add browser memory profiling only if capture behavior is expanded |
| ASCII Art | **Current:** all 289 versioned fonts are same-origin, loaded/cached on demand, and stale renders are cancelled | Preserve the same-origin browser/container smoke and bounded runtime cache |
| PDF/crypto/file tools | Large files and crypto can monopolize the main thread | Transfer `ArrayBuffer`s to workers, stream/chunk where supported, size/time limits |

#### 10. Fix duplicate work in `computedRefreshable`

The audited `computedRefreshable` and `computedRefreshableAsync` passed the expensive getter itself to `watch`. Vue executed that getter to collect dependencies and again when the visible computed value refreshed. The async version could start an unobserved job and then a second visible job.

**Current:** all eight callers (UUID, ULID, Token, MAC, Lorem, OTP, Random Port, and RSA) declare dependency sources explicitly. Sync work runs once per initial/dependency/manual refresh; async work has AbortSignal, job-id stale protection, pending/error state, and scope disposal. Nine focused invocation/cancellation tests pass. Node-forge does not expose its internal worker handle, so RSA abort prevents stale UI commits but cannot physically terminate underlying in-flight prime generation; this remains a documented library limitation.

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
- keep the corrected Playwright cache key tied to `devDependencies['@playwright/test']` and the lockfile;
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

**Current result (2026-07-18):** Node/nginx images are digest-pinned, Corepack
uses the package-manager pin, `pnpm fetch` and the BuildKit store cache are
active, and rootless/read-only/default-plus-arbitrary-UID delivery passes its
health/compression/cache smoke. Sharing one architecture-independent artifact
and enforcing a container-size budget remain open; vulnerability scanning is
in the separately deferred security track.

Incremental container build gains of 2–5x are plausible with a warm pnpm/BuildKit cache, but this remains an estimate until the target CI runner is benchmarked.

## Expected impact: measured versus estimated

| Change | Evidence | Expected result |
|---|---|---|
| Dispose Text Diff resources and repair layout ownership | Forced-GC profile | **Achieved:** Text Diff ten-cycle growth is +2.46 MiB; Home/tool layout growth is +0.86 MiB |
| Explicit bcrypt action + worker | Ten typed characters caused ten hashes and 1.01 s work | **Achieved for the interaction model:** typing performs zero hashes; one explicit action creates one bounded worker job |
| Plain/virtualized large output | 1 MB JSON: 4.0 s and 248k nodes | **JSON/YAML slice achieved:** one readonly zero-descendant `<textarea>` previews at most 100,000 UTF-8 bytes while Copy keeps full bounded output; final isolated 1 MiB fixtures measure JSON 197 ms and YAML 203 ms format-ready with no observed Long Task entry `>=50 ms`; YAML passes 10/10 repeats |
| nginx compression | Artifact ratios of 3.2–3.9x | **Achieved for delivery:** container smoke verifies gzip plus immutable/revalidation cache rules; exact client transfer savings depend on the requested route |
| Shell-only PWA precache | 6,121,476 B raw / 1,911,520 B gzip | **Achieved:** 956,157 B raw / 327,325 B gzip across nine mandatory entries (84.4% / 82.9% reduction), plus generic/File-Hash clean-HTTP-cache offline reload and uncached-route recovery |
| Incremental local file hashing | Whole-file WebCrypto would require one complete input buffer | **Achieved:** one 4 MiB worker window, 256 MiB/all-three in 9,999 ms, 0.0 ms longest Long Task, +1.92 MB peak page heap, +91.24 MB peak sampled browser RSS, zero workers after replacement/cancel; browser physical zero-copy is not claimed |
| Emoji bounded rendering | 14,396 nodes and 1.06 s route task | **Achieved for DOM:** 60 cards / 1,731 elements initially (88.0% fewer); additional-route gzip is 32,488 B versus 63,420 B (-48.8%) and one paged grid preserves Fuse relevance. True virtualization and 4x CPU remain open |
| Redesign OUI database | 3,350,554 B raw / 1,064,267 B gzip route closure for one lookup | **Privacy-safe slice achieved:** fixed-worker closure is 1,937,384 B / 770,467 B (-42.2% / -27.6%); input-selected buckets were rejected because URLs leaked prefixes. The `<250 kB` target remains open |
| Parse once | Duplicate parse paths confirmed | **Achieved for JSON/YAML Prettify:** exactly one bounded worker parse per job; remaining structured converters stay open and may not claim the lossless contract yet |
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
| Route smoke coverage | 89/89 tools, no console/page errors |
| File Hash worker artifact | <= 30 kB raw / <= 12 kB gzip |

Any intentional exception should record the reason, owner, measured user value, and a route-specific ceiling.

## Measurement and regression infrastructure

1. [x] Add a deterministic `build:stats` command that emits manifest totals, per-route closures including literal owned workers, dynamic-import/worker counts, stable membership digests, and Workbox inventory as JSON.
2. [x] Store a reviewed compact baseline and fail CI/release only on explicit byte/count ceilings, not content hashes or normalized filenames; current artifact passes 202 checks including an independent File Hash worker ceiling.
3. Add Chromium performance smoke cases for Home, Text Diff, Emoji, MAC Lookup, JSON/YAML, Bcrypt, Regex, Math, WYSIWYG, and PDF.
4. Include 100 kB, 1 MB, deep nesting, malformed input, catastrophic regex, and repeated-navigation fixtures.
5. Capture long tasks, DOM count, console errors, route bytes, and forced-GC heap trends.
6. Run a smaller mandatory suite on every pull request and a full cross-browser/profile suite on a schedule.
7. [x] Add [PR #1170](https://github.com/CorentinTh/it-tools/pull/1170)'s all-route smoke-test idea, adapted to cover all 89 routes and fail on page errors, chunk failures, unexpected console warnings, and Monaco fallback.
8. Measure on both a fast desktop and a 4x CPU/slow-network profile; do not optimize only local unthrottled load time.

## Recommended execution order

1. [x] Restore green lint/typecheck and add build/route measurement scripts.
2. [x] Fix Monaco disposal, worker loading, and bundle imports, and complete the measured editor comparison; only the `<350 kB` payload target and worker-backed CodeMirror migration gate remain open.
3. [x] Add the large-document plain-output fallback; the shared worker/parser/depth/download abstraction remains open.
4. [x] Move Bcrypt and Regex matching/sample work to cancellable workers with explicit limits; keep the DOM-dependent SVG residual explicit and bounded.
5. [x] Correct nginx compression/cache headers, make PWA caching demand-driven, and provide privacy-safe uncached-route recovery; update/rollback and stale-cache cleanup remain open.
6. [x] Page Emoji rendering and lazy-load secondary metadata; true virtualization/cancellable search remain open.
7. [x] Redesign OUI data as a reproducible compact fixed-URL worker and reject prefix-selected chunks on privacy review; the `<250 kB` product target remains open.
8. [x] Move JSON/YAML Prettify to bounded parse-once workers, preserve strict JSON numeric lexemes/YAML integers, and pass sequential 1 MiB `<50 ms` Long Task fixtures.
9. Reduce shell registry/icons/Lodash and progressively render Home.
10. Reuse one built artifact across CI/Docker and measure container size; dependency caching and rootless delivery are already complete.
11. Ratchet budgets after each verified improvement.

This order deliberately develops the local fork forward. Upstream pull requests are specifications and sources of test cases; they are not a synchronization plan.
