# Performance Optimization Audit

## Implementation status — 2026-08-16

- **DONE — XLSX bounded local-reader budget:** the narrow XLSX route moves the Parquet checkpoint from 639 files / 18,100,903 B raw / 5,285,852 B gzip to 642 / 18,151,938 / 5,303,777 (+3 files / +51,035 B / +17,925 B gzip). Shell including document and mandatory Workbox move only +1,668/+236 B to 844,594/247,458 B and 9 files / 898,442/297,820 B, leaving 101,558 B raw PWA headroom. The full additional route closure is 135,961/47,458 B under a reviewed 150/55 kB ceiling; the disposable native-DEFLATE/`saxen@11.1.1` worker is 29,240/10,717 B under a 35/13 kB ceiling. Candidate review rejected multi-megabyte general spreadsheet/ZIP engines and unzip-first memory shapes. Inspection reads central/local metadata and only required bounded workbook parts; preview adds one 16 MiB worksheet and only referenced shared strings under a 32 MiB aggregate budget. The build transforms 24,163 modules and all 404 artifact checks pass.
- **DONE — Parquet bounded local-reader budget:** one new lazy route moves the Mermaid checkpoint from 636 files / 18,011,920 B raw / 5,257,890 B gzip to 639 / 18,100,903 / 5,285,852 (+3 files / +88,983 B / +27,962 B gzip). Shell including document and mandatory Workbox move only +1,690/+229 B to 842,926/247,222 B and 9 files / 896,774/297,584 B respectively, leaving 103,226 B raw PWA headroom. The full additional route closure is 183,372/61,028 B under a reviewed 200/70 kB ceiling; the disposable worker, including exact dependency-free `hyparquet@1.28.2`, is 65,630/20,682 B under a 75/25 kB ceiling. Browser candidates were measured before selection: `parquet-wasm@0.7.2` is about 19.95 MB unpacked and couples WASM/Arrow memory copies, DuckDB-Wasm is about 149 MB, and the optional `hyparquet-compressors@1.1.1` adds roughly 116.4/75.2 kB minified/gzip, so none enter this first release. Blob-backed slices plus independent footer/chunk/aggregate/cumulative-read/page/output limits avoid whole-file buffering; only UNCOMPRESSED/SNAPPY are decoded. The build transforms 24,156 modules and all 400 artifact checks pass.
- **DONE — Mermaid demand-loaded renderer budget:** one new lazy route moves the DNS checkpoint from 589 files / 14,643,752 B raw / 4,229,913 B gzip to 636 / 18,011,920 / 5,257,890 (+47 files / +3,368,168 B / +1,027,977 B gzip). The large artifact delta is the official Mermaid root API's broad all-diagram lazy catalog, not initial install cost: shell including document moves only to 841,236/246,993 B raw/gzip (+2,023/+642 B, including patched Lodash resolution), and mandatory Workbox is 9 files / 895,084/297,355 B with 104,916 B raw headroom. The UI route adds 44,906/18,043 B and the explicit-action renderer adds 278,266/78,124 B. Supported renderer closures remain below the default 500/150 kB gate; exact reviewed exceptions cover only unreachable legacy Graph, ELK, and Mindmap catalog entries rejected by source policy. The build transforms 24,149 modules and all 396 artifact checks pass.
- **DONE — DNS-over-HTTPS bounded route budget:** one new lazy route moves the Markdown Diff checkpoint from 587 files / 14,624,060 B raw / 4,222,289 B gzip to 589 / 14,643,752 / 4,229,913 (+2 files / +19,692 B / +7,624 B). Shell including document moves only to 839,213 B / 246,351 B gzip (+902/+217 B) for registry metadata; mandatory Workbox moves by the same amount to 9 files / 893,061 B / 296,713 B gzip and retains 106,939 B raw headroom. The complete additional route closure is 26,124/11,383 B raw/gzip under a reviewed 35/15 kB ceiling. The explicit browser network request and strict DNS encoder/parser add no runtime dependency or worker, the build transforms 23,226 modules, and all 346 schema-v4 artifact checks pass.
- **DONE — Markdown Diff bounded route budget:** one new lazy route moves the Argon2id checkpoint from 583 files / 14,496,638 B raw / 4,167,585 B gzip to 587 / 14,624,060 / 4,222,289 (+4 files / +127,422 B / +54,704 B). Shell including document moves only to 838,311 B / 246,134 B gzip (+1,049/+164 B) for registry metadata; mandatory Workbox moves by the same amount to 9 files / 892,159 B / 296,496 B gzip and retains 107,841 B raw headroom. Source alignment is demand-loaded in a 4,927/2,021 B raw/gzip worker under a 6/2.6 kB ceiling; the complete additional route closure, including existing lazy `markdown-it`, pinned patched DOMPurify, shared UI, and worker, is 168,815/71,948 B under the reviewed 190/80 kB ceiling. No Monaco/CodeMirror/new diff library enters the route, the build transforms 23,221 modules, and all 344 schema-v4 artifact checks pass.
- **DONE — Argon2id measured WASM budget:** one new lazy route and the exact pinned zero-dependency `hash-wasm@4.12.0` runtime move the artifact from 581 files / 14,446,094 B raw / 4,148,514 B gzip to 583 / 14,496,638 / 4,167,585 (+2 files / +50,544 B / +19,071 B). Shell including document moves only to 837,262 B / 245,970 B gzip (+1,167/+168 B) for registry metadata; mandatory Workbox moves by the same amount to 9 files / 891,110 B / 296,332 B gzip and retains 108,890 B raw headroom. WASM/glue remains demand-loaded: the disposable worker is 34,523/13,687 B raw/gzip under a 38/15 kB ceiling and the full additional route closure is 130,867/47,124 B under the reviewed 145/55 kB ceiling. The default 64 MiB hash reported 186 ms worker time / 255 ms wall time in source dev, the build transforms 23,134 modules, and all 340 schema-v4 artifact checks pass.
- **DONE — shell-headroom recovery:** removing Home's `vuedraggable` import and the now-unused `vuedraggable` plus `sortablejs` packages replaces favorite reordering with native drag/drop and explicit keyboard actions with deterministic focus transfer. Against the preceding authoring checkpoint, initial shell including `index.html` falls from 943,992 B / 284,657 B gzip to 836,095 B / 245,802 B gzip (-107,897 B / -38,855 B gzip). Mandatory Workbox falls by the same amount to 9 files / 889,943 B / 296,164 B gzip, restoring 110,057 B raw headroom under unchanged 1,000,000 B / 350,000 B / 10-file ceilings. The tighter shell budgets are now 850,000 B raw / 250,000 B gzip. The full artifact is 581 files / 14,446,094 B raw / 4,148,514 B gzip (-111,518 B / -39,803 B gzip), the build transforms 23,128 modules, and all 336 schema-v4 artifact checks pass.
- **DONE — DevOps/JSON/crypto-authoring budget:** four existing-route enhancements move the artifact to 582 files / 14,557,612 B raw / 4,188,317 B gzip without adding a registry route or runtime dependency. Shell including document is 943,992 B / 284,657 B gzip, only +244/+103 B over the preceding checkpoint; mandatory Workbox is 9 files / 997,840 B / 335,019 B gzip and has only 2,160 B raw headroom below its 1 MB ceiling. DevOps, JSON Patch, and HMAC remain lazy and worker-owned: their workers are 146,714/40,101 B, 45,180/14,297 B, and 60,965/21,477 B raw/gzip respectively. Reviewed ceilings cover those measured closures, all 336 artifact checks pass, and the next route addition must first reduce shell/PWA weight or supply a separately approved budget change.
- **DONE — security/search/JSON-wave budget:** one new lazy route plus two bounded existing-route enhancements move the artifact to 581 files / 14,423,193 B raw / 4,149,937 B gzip. Shell including document is 943,748 B / 284,554 B gzip, +2,443/+683 B over the preceding checkpoint; the narrowly raised 945/285 kB ceilings cover one approved registry descriptor and the deterministic palette code without admitting feature implementation into the shell. Mandatory Workbox remains 9 files / 997,596 B / 334,916 B gzip. The bcrypt/Ansible Vault worker is 29,852 B / 13,270 B gzip under an independent 34/15 kB ceiling, all 334 artifact checks pass, and no runtime dependency was added.
- **DONE — tabular/Wi-Fi/permissions-wave budget:** one new lazy route plus two bounded existing-route enhancements move the artifact to 579 files / 14,382,350 B raw / 4,132,736 B gzip. Shell including document is 941,305 B / 283,871 B gzip; the raw ceiling is narrowly raised from 940 to 942 kB for the approved registry descriptor while the 284 kB gzip ceiling is unchanged. Mandatory Workbox remains 9 files / 995,153 B / 334,233 B gzip. The Tabular worker is 5,908 B / 2,656 B gzip under an independent 7/3.2 kB ceiling, all 330 artifact checks pass, and no runtime dependency was added.
- **DONE — JWT/HOTP, SPDX, and OKLCH-wave budget:** one new lazy SPDX route plus three bounded existing-route enhancements move the artifact to 577 files / 14,359,816 B raw / 4,123,947 B gzip. Shell including document is 939,833 B / 283,608 B gzip, still below the narrow 940/284 kB ceiling; the increase is registry text only, while JWT, SPDX, OTP, and color code remains lazy. Mandatory Workbox stays at 9 files / 993,681 B / 333,970 B gzip, and all 326 artifact checks pass. No worker or runtime dependency was added: bounded JWT JSON parsing is explicit, Web Crypto HMAC is asynchronous, HOTP input is capped before synchronous HMAC, SPDX operates on 17 local records, and OKLCH mapping performs a fixed 24-step search.
- **DONE — bounded storage/privacy/crypto-wave budget:** three new lazy routes move the build from 573 files / 14,281,568 B raw / 4,096,501 B gzip to 578 / 14,338,885 / 4,116,483. Shell including document moves to 938,834 B / 283,367 B gzip (+3,147 B raw / +468 B gzip), reflecting three registry descriptors with reused eager icons; all implementation remains lazy and no runtime dependency was added. Mandatory Workbox stays below policy at 9 files / 992,682 B / 333,729 B gzip. AES-GCM and Image Metadata workers measure 14,329/5,023 and 6,447/2,589 B raw/gzip under independent 17/6.5 and 8/3.5 kB ceilings. All 324 artifact checks pass. The clean 120-route `dev:fresh` traversal completes in 3.8 minutes without optimizer reload after adding transitive worker-owned `js-base64` to the explicit dependency inventory.
- **DONE — Priority B local utility-wave budget:** four new lazy routes move the build from 567 files / 14,237,148 B raw / 4,079,885 B gzip to 573 / 14,281,568 / 4,096,501. Shell including document moves to 935,687 B / 282,899 B gzip (+3,433 B raw / +622 B gzip), representing only four registry descriptors/keywords with reused eager icons; all implementations remain lazy and no runtime dependency was added. Mandatory Workbox stays below policy at 9 files / 989,535 B / 333,261 B gzip. The List Comparison worker measures 5,039/2,152 B raw/gzip under an independent 6/2.8 kB ceiling; the narrowly raised 940/284 kB shell ceiling is rationale-backed by the approved descriptors. All 314 artifact checks pass. The same clean 117-route source-dev traversal found the remaining lazy-only `jsonc-parser` and Monaco optimizer discoveries; both are now prebundled under a source-contract test, and the rerun completes without a Vite reload.
- **DONE — Priority B browser-native wave budget:** seven new lazy routes move the build from 557 files / 14,178,387 B raw / 4,056,253 B gzip to 567 / 14,237,148 / 4,079,885. Shell including document moves to 932,254 B / 282,277 B gzip (+6,075 B raw / +1,056 B gzip), representing only seven registry descriptors/keywords with reused eager icons; feature implementations remain lazy and add no runtime dependency. Mandatory Workbox remains below policy at 9 files / 986,102 B / 332,639 B gzip. The Markdown Table worker measures 4,187/1,929 B raw/gzip under an independent 5/2.5 kB ceiling; the narrowly raised 935/283 kB shell ceilings are rationale-backed by the approved descriptors. All 304 artifact checks pass.
- **DONE — bounded offline utility-wave budget:** four new lazy routes move the build from 550 files / 14,120,692 B raw / 4,033,727 B gzip to 557 / 14,178,387 / 4,056,253. Shell including document moves to 926,179 B / 281,221 B gzip (+4,516 B raw / +793 B gzip), reflecting only registry metadata/icons; all feature code remains lazy. Mandatory Workbox stays below policy at 9 files / 980,027 B / 331,583 B gzip. Developer Text and SAML workers measure 5,202/2,380 and 10,174/4,050 B raw/gzip under independent ceilings; Network Calculation and Favicon routes measure 9,091/3,856 and 10,011/4,177 B raw/gzip. The narrowly raised 930 kB raw shell ceiling is rationale-backed by four approved route descriptors while the existing 282 kB gzip ceiling still holds. All 288 artifact checks pass and no runtime dependency was added.
- **DONE — Priority A closure-wave budget:** four new lazy routes plus the enhanced URL route move the build from 541 files / 14,035,194 B raw / 4,004,069 B gzip to 550 / 14,120,692 / 4,033,727. Shell including document moves to 921,663 B / 280,428 B gzip; mandatory Workbox remains 9 files / 975,511 B / 330,790 B. Ed25519, Local File Inspector, and JSON Code Generator workers measure 3,245/1,564, 5,074/2,171, and 31,778/9,836 B raw/gzip under independent ceilings. All 276 artifact checks pass and no runtime dependency was added.
- **DONE — second Priority A feature-wave budget:** four new lazy routes plus the enhanced UUID route move the build from 534 files / 13,833,668 B raw / 3,936,666 B gzip to 541 / 14,035,194 / 4,004,069. Shell including document moves from 912,165 B / 278,540 B gzip to 917,063 B / 279,612 B (+4,898 B raw / +1,072 B gzip); implementation remains route-local and no runtime dependency was added. Mandatory Workbox remains 9 files / 970,911 B / 329,974 B. The separately gated DevOps, JSON Repair/Query, and Certificate workers measure 100,441/31,765, 31,425/9,649, and 7,892/3,171 B raw/gzip respectively; all 262 artifact checks pass.
- **DONE — Priority A feature-batch budget:** five lazy routes plus two enhanced routes move the build from 522 files / 13,656,676 B raw / 3,875,761 B gzip to 534 / 13,833,668 / 3,936,666. Shell including document moves only from 907,307 B / 277,717 B gzip to 912,165 B / 278,540 B (+4,858 B raw / +823 B gzip) because new implementation remains route-local and existing eager icons are reused. Mandatory Workbox remains 9 files / 966,013 B / 328,902 B. Docker's two-way YAML/composerize worker is 206,522 B / 63,434 B gzip; Mock Data is 7,058 / 3,283, Sensitive Data is 5,740 / 2,471, and Cron is 8,957 / 3,811. All stay demand-loaded under explicit ceilings; no runtime dependency was added.
- **DONE — executable build guardrail:** deterministic report schema v4 plus budget schema v1 include literal route-owned workers and enforce shell, required Workbox membership, default dynamic-route, rationale-backed heavy-route ceilings, and independent reviewed worker ceilings in CI/release. Sixteen infrastructure tests and 248 current-artifact checks pass; standard-runner build-time/modules/RSS telemetry remains informational.
- **DONE — Text Diff lifecycle/heap:** editor-only Monaco import, a real worker, complete disposal, and cross-route layout repair reduced ten-cycle retained growth to +2.46 MiB with zero workers, below the `<5 MiB` budget.
- **DONE — Text Diff payload decision:** repaired Monaco remains the accepted implementation at 2,474,507 B raw / 646,976 B gzip for the route-plus-worker closure. The isolated worker-backed CodeMirror spike produced a 363,669 B raw / 118,937 B gzip editor-plus-worker artifact and passed the 1 MiB lifecycle/Long Task probe, but public MergeView result publication requires rebuilding the view and loses focus, undo, and history. Migration is rejected until CodeMirror exposes parity without that regression; Monaco is a documented budget exception.
- **DONE — mandatory PWA payload, freshness, and cache-miss UX:** shell-only precache contains nine entries at the current 970,911 B raw / 329,974 B gzip, down from 270 entries / 6,121,476 B raw / 1,911,520 B gzip. Opened chunks reload offline; File Hash proves its route and worker are demand-cached; uncached lazy routes recover through a privacy-safe fresh document. Development removes only stale IT Tools registrations/caches, serves `no-store` source on strict port 8091, and explicitly prebundles worker-only dependencies so Vite 4 cannot reload and abandon in-flight workers. Update-notification UX remains a separate feature, not an unresolved payload/cache-correctness item.
- **DONE — current container delivery contract:** gzip, immutable hashed assets, HTML/SW/manifest revalidation, strict missing assets, local Figlet delivery, and headers pass rootless/read-only default-and-arbitrary-UID smoke. Reverse-proxy/subpath acceptance remains a separate deployment task.
- **DONE — shared layout lifecycle:** persistent `BaseLayout` reduced ten Home/tool cycles from +188.40 MiB retained heap to +0.86 MiB, with DOM 5,036 -> 5,037 and listeners 807 -> 809.
- **DONE — bounded text-tool worker slice:** Math uses the number-only `mathjs` entry in a two-second worker task; SQL, XML, and Markdown use 250 ms debounce below 64 KiB and explicit worker actions up to 1 MiB; Text Statistics runs its O(n), O(1)-space pass after 150 ms below 256 KiB and explicitly up to 4 MiB. All use terminate-and-replace cancellation, stale-result guards, hard output/time limits, disposal, stable status/action slots, and plain large-output rendering where applicable.
- **DONE — bounded JSON Diff:** JSON5 is parsed once per explicit worker request under 1 MiB-per-side, depth-128, 100,000-input/output-node, eight-second, and 250,000-LCS-cell limits. Unique object keys (`id`, `key`, `name`) and primitive LCS align insertions without cascading updates; other arrays use an explicit positional fallback. Nested rendering remains lazy and wide roots remain paged in 200-row batches.
- **DONE — structured converter worker slice:** JSON-to-TOML/YAML, YAML-to-JSON/TOML, TOML-to-JSON/YAML, and XML-to-JSON/JSON-to-XML share one bounded vertical UI/lifecycle contract. Three source-family workers and one XML-family worker parse once, auto-run only below 64 KiB, require an explicit action up to 1 MiB, cap output at 2 MiB, and enforce terminate/replace, timeout, stale-result, previous-result, and disposal guards. Conversion semantics remain intentionally separate from the strict Prettify lossless-number contract.
- **DONE — Docker Compose ↔ Docker Run isolation:** the composerize path and reverse YAML parser share a strict worker. Automatic work is limited to 16 KiB, explicit input to 256 KiB, output to 512 KiB, messages to 100 entries and 4 KiB each, and execution to four seconds. Environment, ports, volumes, entrypoint, command and shell quoting have round-trip-oriented fixtures; downloads use Blob URLs without a complete base64 copy.
- **DONE — production responsiveness evidence:** sequential Chromium production fixtures record cold-route and result-ready time, a 10 ms heartbeat, and Long Task entries. The final large-result run measured SQL 716,800 B at 576/3,976 ms, JSON-to-CSV 1,021,781 B at 379/429 ms, JSON Minify 921,619 B at 380/396 ms, and List Converter 938,889 B at 388/446 ms; each reported 0.0 ms as the longest observed task. SQL now publishes a 16 KiB readonly preview while full bounded output remains available through Copy and Blob download, so the executable fixture covers the previously failing 700 KiB result without raising the 1 MiB input limit.
- **DONE — Bcrypt responsiveness:** reactive synchronous hashing/comparison is replaced by explicit dedicated-worker tasks with cancellation, stale-result protection, a ten-second deadline, 72-byte input bound, and a measured 4–14 rounds range.
- **DONE — RSA generation lifecycle:** the reactive node-forge task is replaced by explicit 2,048/3,072/4,096-bit Web Crypto generation in a route-owned terminate-and-replace worker. Cancel, replacement, the 30-second deadline, and unmount physically terminate owned work; previous results remain visible. The additional route closure fell from 450,149 B raw / 132,813 B gzip to 60,832 B / 24,700 B, including a 2,498 B / 1,151 B worker.
- **DONE — local file hashing:** the third catalog feature uses one route-owned worker pass and fixed 4 MiB reads, so application-controlled buffering is one window plus seven small incremental hash states instead of file size; browser-engine physical zero-copy is not claimed. SHA-256/384/512, SHA3-256, BLAKE3-256, SHA-1, and MD5 are available, with visible legacy warnings for SHA-1/MD5. The original production 256 MiB/all-three-SHA-2 run is 9,999 ms with 0.0 ms longest observed Long Task, +1,922,904 B peak page heap, +91,242,496 B peak sampled Chromium-process RSS, and +260,696 B retained page heap. The current gate keeps independent 32 MiB peak/retained page heap and backing-storage ceilings; its process-wide RSS ceiling is three quarters of the fixture because fresh Chromium worker/process overhead varied from +91 MiB to +155 MiB across otherwise identical passing runs, while 192 MiB still rejects a sustained 256 MiB whole-file clone. Its current additional closure is 70,260 B raw / 26,677 B gzip and worker 25,899 B / 10,417 B; the worker remains demand-loaded and separately gated at 30/12 kB.
- **DONE — Camera media lifecycle:** image/video Blob URLs have one owner; recordings use 1-second chunks and stop at 5 minutes or 64 MiB; screenshots are single-flight, reject more than 16,777,216 pixels/64 MiB before canvas allocation, cap encoded output at 16 MiB, and ignore callbacks after unmount; retained media is bounded to 12/4 items and 128 MiB total with deterministic revoke-on-delete/evict/unmount behavior.
- **DONE — Regex responsiveness:** matching and RandExp use separate terminate-and-replace workers with a 1.2-second deadline, explicit limits, stale/cancel guards, and a live-heartbeat catastrophic fixture. Sample generation projects the AST before allocation, including nested repetitions and lexically numbered backreferences. DOM-dependent SVG is single-flight, explicit and bounded but remains on the main thread.
- **DONE — shared large-output rendering slice:** highlighted output switches above 100,000 UTF-8 bytes to one readonly `<textarea>` with a UTF-8-safe 100,000-byte preview and zero descendants; Copy retains the complete bounded output in memory.
- **DONE — YAML parse/worker slice:** YAML Prettify parses once in a terminate-and-replace worker with input/output/depth/node/alias/time bounds, `BigInt` integers, exact worker-side UTF-8 accounting, explicit large-input formatting, and stale/cancel/dispose guards. A conservative graph projection rejects alias, indentation, escaping, and physical-line output amplification before `Document.toString()` while preserving valid 90,000-node/1 MiB inputs. Its final isolated production Chromium fixture is 203 ms format-ready with 0.0 ms observed longest Long Task and passes 10/10 repeats.
- **DONE — JSON lossless parse/worker slice:** strict JSON Prettify preserves original numeric lexemes in one bounded worker AST while JSON5 remains an explicit non-lossless compatibility mode with an incremental 4 MiB writer. Full-payload/output-limit UTF-8 accounting stays in the worker; the main thread scans only the bounded 100,000-byte preview. The final production Chromium fixture is 404 ms cold-route / 197 ms format-ready with 0.0 ms observed longest Long Task.
- **DONE — JSON Schema worker slice:** the three-draft local validator owns a 161,471 B raw / 47,125 B gzip worker and a 176,585 B / 53,355 B additional route closure, both below their 200/60 and 300/100 kB gates. Its final production Chromium fixture measures 246 ms cold route / 205 ms 1 MiB result-ready / 0.0 ms longest observed Long Task; branch-heavy `allErrors` is fail-fast above 20,000 projected schema/instance node pairs, and the current mandatory PWA install remains nine entries / 960,676 B raw / 327,958 B gzip. The feature's accepted registry increment was 350 B gzip; Ajv remains lazy in the owned worker and creates no new chunk above 500 kB.
- **DONE — Hash Text worker slice:** the highest remaining measured reactive path—eight CryptoJS digests over 1 MiB at about 706 ms in the audit benchmark—now runs in one strict route-owned worker. The 16 KiB live / 1 MiB input / 8 KiB result / five-second contract preserves empty-string, Unicode, and Bin/Hex/Base64/Base64url semantics with terminate/replace, cancel, timeout, stale-result, and disposal guards. Its final production fixture measures 578 ms cold route / 2,951 ms 1 MiB result-ready / 0.0 ms longest observed Long Task with 298 heartbeat ticks. The worker is 60,239 B raw / 21,154 B gzip and the accepted full additional closure is 77,014 B / 29,635 B versus 62,200 B / 22,934 B before isolation.
- **DONE — Emoji bounded rendering/search slice:** initial presentation remains 60 cards / 1,731 DOM elements; query-triggered Fuse indexing/search now runs in a bounded terminate-and-replace worker with cancellation, stale-result, timeout, and disposal guards. The final production 4x CPU flow reaches results in 587 ms end-to-end, records a 79.0 ms longest task below the route's `<200 ms` acceptance ceiling, and keeps the main thread alive for 21 heartbeat ticks. The worker is 400,601 B raw / 68,523 B gzip and remains route-local and demand-loaded.
- **DONE — isolated CI optimization:** Playwright cache identity no longer reads the wrong dependency section; BuildKit uses a pnpm store cache plus `pnpm fetch`.
- **DONE — OUI payload decision:** a generated compact fixed-URL worker reduces the full closure from 3,350,554 B raw / 1,064,267 B gzip to 1,937,384 B / 770,467 B while keeping MAC prefixes out of network URLs. The smaller 112-bucket prototype was rejected for access-log privacy. Exact coverage plus the privacy boundary is now an accepted product exception; further reduction requires a new coverage/product decision.
- **DONE — measured initial-shell Lodash slice:** seven shell-critical callers now use small native implementations. An apples-to-apples restoration build measured 906,964 B raw / 278,135 B gzip for the shell including document versus 907,307 B / 277,702 B after replacement: +343 B raw and -433 B gzip. The gzip win is retained; broader icon/registry consolidation is future feature work, not an unmeasured claim.

The raw checkpoint and before/after table are maintained in `.ai/PROGRESS.md`.
No budget is marked achieved merely because a metric improved.

## Executive summary

The application already lazy-loads every tool component, but several costs remain eager or unbounded. The largest verified opportunities are:

1. Keep the now-repaired Text Diff and shared-layout lifecycle behind forced-GC regression gates; the original branch leaked roughly 20 MB per visit.
2. Keep the completed plain large-output fallback, then move the remaining parse/format path into bounded tasks; the original 1 MB JSON baseline took about 4.0 seconds and created approximately 248,000 DOM nodes.
3. Reuse the completed Bcrypt/Regex task patterns for formatting, diffing, QR generation, and parsers that still lack a shared cancellation/size policy.
4. Preserve the completed CodeMirror rejection and privacy-safe exact-coverage OUI decision unless product requirements change.
5. Keep the measured native shell replacements and nine-entry demand-driven PWA install policy behind executable budgets.
6. Preserve the now-verified production gzip and immutable/revalidation cache policies while adding reverse-proxy/subpath coverage.
7. Consolidate icon imports and build the application once per pipeline. The original audit transformed 24,599 modules in 51.16 seconds; the current local build transforms 24,185 in 19.86 seconds, but standard-runner build/RSS telemetry and redundant pipeline builds remain open.

That first measurable delivery slice is now largely complete: Monaco lifecycle,
bounded large-output preview, Bcrypt/Regex/JSON/YAML workers, asset budgets, and
nginx/PWA caching all have executable gates. OUI uses a privacy-safe compact
worker. The duplicated JSON-to-CSV parse, remaining `FormatTransformer` routes,
large SQL publication, Emoji search, CodeMirror decision, and measured shell
slice are now closed; new catalog features can proceed behind these gates.

## Scope and methodology

This audit covers the complete current branch, not only upstream changes. It combines:

- static inspection of the original 416 TypeScript/Vue source files and the current 121 registered tools;
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

This is the audit baseline: parsing twice is material, but it is not the whole browser cost. `TextareaCopyable` fed the complete result into Naive UI/highlight.js, producing a span-heavy DOM. Large-output rendering is now bounded; JSON/YAML Prettify and JSON-to-CSV parse once in workers, while JSON Minify and List Converter use their own bounded worker paths.

### Remaining main-thread transform ranking — 2026-08-15

The current-source audit measured representative maximum or near-maximum
payloads in an isolated Node process to rank work before adding workers. These
figures are comparative workstation measurements, not browser acceptance
timings:

| Path | Representative work | Main-thread time |
|---|---:|---:|
| Hash Text before isolation | Eight CryptoJS digests over 1 MiB | about 706 ms |
| JSON-to-CSV before isolation | Two JSON5 parses over about 2.4 MiB JSON | about 451 ms |
| AES | Encrypt 1 MiB | about 69 ms |
| List sort/deduplicate | 150,000 lines | about 55 ms |
| HMAC SHA-256 | Digest 1 MiB | about 22 ms |

Hash Text was selected because it was both the highest measured path and
reactive. Its production Chromium 1 MiB worker fixture records 578 ms cold
route, 2,951 ms result-ready, 0.0 ms longest observed Long Task, and 298
heartbeat ticks. JSON-to-CSV subsequently moved to a parse-once bounded worker.
JSON Minify reused the structured JSON worker, List Converter moved after its
1.93 MiB/4x measurement, and the zero-caller `FormatTransformer` was deleted.

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

**Current Emoji result (2026-08-16):** production rendering starts with 60
cards / 1,731 DOM elements and expands 60 -> 120 on demand. Search builds and
queries Fuse inside a bounded route-owned worker; replacement, cancellation,
stale-result, timeout, and disposal paths are covered. At 4x CPU throttling the
accepted production flow reached results in 587 ms, kept 21 heartbeat ticks,
and observed a 79.0 ms longest task, below the route-specific `<200 ms` gate.

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

**Current artifact (2026-08-16):** mandatory precache is nine entries /
898,442 B raw / 297,820 B gzip, leaving 101,558 B raw headroom. A Chromium production-preview fixture opens a
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

**Current result (2026-08-16):** compact dictionary, varint, binary, and 112
bucket forms were generated and measured. Buckets reached about 66.9 kB gzip
for the worst individual request but were rejected because prefix-derived URLs
would disclose MAC input in access logs. The accepted fixed-URL worker keeps
all input inside `postMessage`, reuses one worker across offline lookups, and
reduces the full closure from 3,350,554 B raw / 1,064,267 B gzip to 1,937,384 B
/ 770,467 B. This fixed-URL exact-coverage result is the accepted product
exception; further reduction requires a new coverage or privacy decision.

### P1 — render and shell performance

#### 7. Virtualize Emoji Picker and large result collections

The current 1,870-record dataset is not unusually large, but rendering every card eagerly is. Keep the Fuse index and change presentation:

- virtualize the grid or initially render a bounded page per category;
- use `content-visibility` only as a progressive enhancement, not as the sole memory strategy;
- keep search results virtualized and cancel stale searches;
- lazy-load details or secondary metadata only when visible;
- preserve keyboard navigation and accessibility while virtualizing.

[PR #1374](https://github.com/CorentinTh/it-tools/pull/1374) reports an upstream 40% improvement through bounded initial groups. Use that idea as a benchmark candidate, not as a commit to copy. The local target should be fewer than 2,000 DOM nodes and no task above 200 ms on the 4x CPU profile.

**Current result (2026-08-16):** bounded pagination renders 60 cards initially
and 120 after one explicit load, with 1,731 initial DOM elements. Copy controls
are keyboard-native, complete ZWJ/flag sequences are retained, and secondary
keyword metadata loads only on search. Fuse execution is now cancellable and
worker-backed; the final 4x CPU profile observes a 79.0 ms longest task and 21
heartbeat ticks, passing the route-specific `<200 ms` acceptance gate.

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
| Parquet Reader | **Current:** exact dependency-free `hyparquet@1.28.2` is route/worker-only; the full route is 183,372/61,028 B and worker 65,630/20,682 B raw/gzip. Blob-backed slices, selected-page decoding, and cumulative read limits avoid a whole-file application buffer. UNCOMPRESSED/SNAPPY only | Preserve exact pin, disposable worker, file/footer/schema/chunk/page/output/time/memory gates, selected-only export, and independent budgets. Re-measure before adding codecs, Arrow, DuckDB, XLSX, full-file export, or another table parser |
| Mermaid Renderer | **Current:** exact `10.9.8` loads only after Render; the route adds 44,906/18,043 B and the renderer 278,266/78,124 B raw/gzip. Supported families remain under default limits, while rejected legacy Graph/ELK/Mindmap catalog entries add static artifact files only. The library's synchronous DOM phase cannot be physically interrupted | Preserve the family allow-list, sanitizer, sandbox, audit, and cancellation invalidation. Do not enable another diagram/config surface or raise source/SVG/PNG bounds without measuring its closure and main-thread behavior |
| JSON/YAML/TOML/XML converter paths | **Current:** all eight routes use three parse-once source-family workers plus one XML-family worker with a shared 64 KiB live / 1 MiB hard input / 2 MiB output / eight-second lifecycle; conversion number semantics remain library-specific | Preserve lifecycle and destination fixtures; do not claim strict Prettify numeric losslessness without a separate destination-compatible design |
| Docker Run-to-Compose | **Current:** composerize and cleanup run in one strict worker at 16 KiB live / 256 KiB hard input / 512 KiB YAML / four seconds with bounded categorized messages, previous-result retention, and Blob downloads | Preserve composerize output/message fixtures and production heartbeat evidence; do not raise the input ceiling without measuring parser and YAML amplification |
| SQL/XML/Markdown | **Current:** 250 ms debounce below 64 KiB, explicit action above it, 1 MiB input / 2 MiB output, eight-second terminate-and-replace route workers, and production large-input heartbeat/Long Task evidence. SQL shows a 16 KiB preview and retains the complete result for Copy/Blob download | Preserve the `<50 ms` gate and full-result actions; the 700 KiB SQL fixture now passes without publishing the complete textarea value |
| HTML WYSIWYG | **Current:** Prettier runs in a terminate-and-replace worker after a 250 ms pause below 64 KiB; larger documents require an explicit action, input is capped at 1 MiB, output at 2 MiB, and stale/cancel/timeout/unmount work is physically terminated | Preserve the lifecycle/browser gates; consider an explicit plain-output/download policy only if the document ceiling grows |
| QR and Wi-Fi QR | **Current:** generation waits 150 ms after edits, uses a monotonic stale-result guard, rejects input above 4,096 UTF-8 bytes, clears incomplete Wi-Fi output immediately, and invalidates timers/promises on scope disposal | Preserve ordered-result and incomplete-field browser coverage; prefer SVG/canvas only after measuring data-URL memory on the accepted bounds |
| Text Statistics | **Current:** one O(n), O(1)-space pass in a route-owned worker; automatic below 256 KiB, explicit up to 4 MiB, four-second deadline, and a passing 4,000,000-byte production responsiveness fixture | Preserve the production gate before raising the ceiling |
| Math Evaluator | **Current:** number-only mathjs worker, 350 ms debounce below 2 KiB, explicit action up to 8 KiB, 64 KiB output, two-second deadline | Preserve timeout/adversarial fixtures and document any future function-set expansion |
| JSON Diff | **Current:** explicit route-owned worker with byte/depth/input/output/LCS bounds, stable-key and primitive-LCS alignment, positional fallback, lazy branches, 200-row batches, and a stable 827,203-byte production responsiveness fixture | Preserve large/deep evidence; do not raise the LCS-cell ceiling without measurement |
| Camera Recorder | **Current:** owned Blob URLs, 1-second recording chunks, 5-minute/64-MiB video, single-flight screenshots with a 16,777,216-pixel/64-MiB raw preallocation check, 16-MiB encoded cap, and late-callback guard, 128-MiB aggregate and 12/4 item bounds; revoke on delete/evict/unmount | Preserve the lifecycle/limit tests; add browser memory profiling only if capture behavior is expanded |
| ASCII Art | **Current:** all 289 versioned fonts are same-origin, loaded/cached on demand, and stale renders are cancelled | Preserve the same-origin browser/container smoke and bounded runtime cache |
| PDF/crypto/file tools | Large files and crypto can monopolize the main thread | Transfer `ArrayBuffer`s to workers, stream/chunk where supported, size/time limits |

The 2026-08-15 WYSIWYG build isolates the existing Prettier payload in a
212,679 B raw / 70,280 B gzip demand-loaded worker. The route's main chunk
falls from 493,145 B / 153,634 B gzip to 287,982 B / 86,389 B gzip; the
worker-aware additional closure is 551,423 B / 176,574 B gzip versus 541,545 B
/ 172,634 B before isolation. The measured 1.8% raw / 2.3% gzip closure cost is
accepted under explicit 560/180 kB route and 220/75 kB worker ceilings because
the initial shell is unchanged by the formatter relocation and no owned chunk
exceeds 500 kB.

#### 10. Fix duplicate work in `computedRefreshable`

The audited `computedRefreshable` and `computedRefreshableAsync` passed the expensive getter itself to `watch`. Vue executed that getter to collect dependencies and again when the visible computed value refreshed. The async version could start an unobserved job and then a second visible job.

**Current:** the seven remaining callers (UUID, ULID, Token, MAC, Lorem, OTP,
and Random Port) declare dependency sources explicitly. Sync work runs once per
initial/dependency/manual refresh; async work has AbortSignal, job-id stale
protection, pending/error state, and scope disposal. Nine focused invocation/
cancellation tests pass. RSA now uses a separate explicit route-owned Web
Crypto worker, so it never regenerates from a dependency change and its active
task can be physically terminated.

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
| Shell-only PWA precache | 6,121,476 B raw / 1,911,520 B gzip | **Achieved:** 961,155 B raw / 328,079 B gzip across nine mandatory entries, plus generic/File-Hash clean-HTTP-cache offline reload and uncached-route recovery |
| Incremental local file hashing | Whole-file WebCrypto would require one complete input buffer | **Achieved:** one 4 MiB worker window, 256 MiB/all-three in 9,999 ms, 0.0 ms longest Long Task, +1.92 MB peak page heap, +91.24 MB peak sampled browser RSS, zero workers after replacement/cancel; browser physical zero-copy is not claimed |
| Emoji bounded rendering | 14,396 nodes and 1.06 s route task | **Achieved:** 60 cards / 1,731 elements initially; one paged grid preserves Fuse relevance; bounded worker search passes the 4x CPU gate at 79.0 ms longest task |
| Redesign OUI database | 3,350,554 B raw / 1,064,267 B gzip route closure for one lookup | **Accepted exception:** fixed-worker closure is 1,937,384 B / 770,467 B; input-selected buckets were rejected because URLs leaked prefixes. Exact coverage and the privacy boundary take priority over the former `<250 kB` target |
| Parse once | Duplicate parse paths confirmed | **Achieved:** JSON/YAML Prettify, all JSON/YAML/TOML/XML converters, and JSON-to-CSV parse each job once; JSON Minify and List Converter are bounded workers and `FormatTransformer` is removed |
| Initial shell Lodash slice | Seven shell-critical full-Lodash imports | **Achieved for measured gzip:** native replacements move the apples-to-apples shell from 278,135 B to 277,702 B gzip (-433 B); raw grows 343 B, so no larger claim is made |
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
| Route smoke coverage | 120/120 tools, no console/page errors |
| File Hash worker artifact | <= 30 kB raw / <= 12 kB gzip |

Any intentional exception should record the reason, owner, measured user value, and a route-specific ceiling.

## Measurement and regression infrastructure

1. [x] Add a deterministic `build:stats` command that emits manifest totals, per-route closures including literal owned workers, dynamic-import/worker counts, stable membership digests, and Workbox inventory as JSON.
2. [x] Store a reviewed compact baseline and fail CI/release only on explicit byte/count ceilings, not content hashes or normalized filenames; the current artifact passes 288 checks including independent reviewed worker ceilings.
3. Add Chromium performance smoke cases for Home, Text Diff, Emoji, MAC Lookup, JSON/YAML, Bcrypt, Regex, Math, WYSIWYG, and PDF.
4. Include 100 kB, 1 MB, deep nesting, malformed input, catastrophic regex, and repeated-navigation fixtures.
5. Capture long tasks, DOM count, console errors, route bytes, and forced-GC heap trends.
6. Run a smaller mandatory suite on every pull request and a full cross-browser/profile suite on a schedule.
7. [x] Add [PR #1170](https://github.com/CorentinTh/it-tools/pull/1170)'s all-route smoke-test idea, adapted to cover all 121 registered routes at the current checkpoint and fail on page errors, chunk failures, unexpected console warnings, responsive overflow, unnamed visible controls, and Monaco fallback.
8. Measure on both a fast desktop and a 4x CPU/slow-network profile; do not optimize only local unthrottled load time.

## Recommended execution order

1. [x] Restore green lint/typecheck and add build/route measurement scripts.
2. [x] Fix Monaco disposal, worker loading, and bundle imports; complete the worker-backed CodeMirror spike and retain Monaco as a documented exception because rebuild-based result publication loses focus/undo/history.
3. [x] Add the large-document plain-output fallback; the shared worker/parser/depth/download abstraction remains open.
4. [x] Move Bcrypt and Regex matching/sample work to cancellable workers with explicit limits; keep the DOM-dependent SVG residual explicit and bounded.
5. [x] Correct nginx compression/cache headers, make PWA caching demand-driven, provide privacy-safe uncached-route recovery, and isolate fresh Vite dev from stale PWA/worker-dependency reloads.
6. [x] Page Emoji rendering, lazy-load secondary metadata, and move cancellable search into a bounded worker with a passing 4x CPU gate.
7. [x] Redesign OUI data as a reproducible compact fixed-URL worker, reject prefix-selected chunks on privacy review, and accept exact coverage as a documented product exception.
8. [x] Move JSON/YAML Prettify to bounded parse-once workers, preserve strict JSON numeric lexemes/YAML integers, and pass sequential 1 MiB `<50 ms` Long Task fixtures.
9. [x] Measure and remove full Lodash from seven shell-critical paths; retain the small gzip win without overstating raw/module improvements.
10. Reuse one built artifact across CI/Docker and measure container size; dependency caching and rootless delivery are already complete.
11. Ratchet budgets after each verified improvement.

This order deliberately develops the local fork forward. Upstream pull requests are specifications and sources of test cases; they are not a synchronization plan.
