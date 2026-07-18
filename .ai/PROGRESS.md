# Implementation Progress

Last updated: 2026-07-18

This is the live implementation journal for the roadmap. A task is `DONE` only
after its relevant regression tests and acceptance gates pass on the current
working tree. `IN PROGRESS` means implementation exists but the complete
milestone Definition of Done has not yet passed.

## Current slice

| Area | Status | Current result / remaining gate |
|---|---|---|
| M0 quality baseline | DONE | Lint, dual-project typecheck, 729/729 unit tests, 97/97 sequential Chromium E2E tests, all 88 routes, production build, OUI generation, build budgets, and diff checks are green on the final integrated worktree. |
| M0 build measurements | IN PROGRESS | Schema-v4 baseline includes literal route-owned workers in every closure; schema-v1 budgets enforce shell, required Workbox entries, default routes, and rationale-backed heavy-route ceilings in CI/release. Fifteen infrastructure tests and 198 current-artifact checks pass; standard-runner build-time/modules/RSS telemetry remains. |
| PWA mandatory install | DONE | Shell-only Workbox inventory is 9 files / 954,481 B raw / 327,007 B gzip. Required membership and <=1 MB raw / <=350 kB gzip / <=10 files fail CI/release; clean-HTTP-cache offline lazy-route reload passes. |
| PWA uncached-route recovery | DONE | Strict lazy-tool/network-error classification, effective-offline probing, query-safe in-memory state, prior-route hiding, and accessible actions pass 14/14 unit/component checks and a production-Workbox E2E. Retry first probes the app origin, then starts a fresh query-free document because failed native imports are sticky and query/hash must not reach access logs. |
| M1 container delivery | IN PROGRESS | Rootless/read-only/default-and-arbitrary-UID contracts pass with alternate internal port, strict static 404, gzip/cache/headers, and privacy-safe access logs. The CVE/remediation track is explicitly deferred; reverse-proxy/subpath acceptance remains. |
| Secure randomness | DONE | Web Crypto rejection sampling, alphabet fixes, length bounds, Unicode/boundary tests, and non-persistence browser checks are implemented. `.ai/RANDOMNESS.md` classifies every caller; UUID v1 now seeds its multicast node and 14-bit clock sequence with Web Crypto, while remaining pseudo-random callers are presentation-only. |
| Text Diff lifecycle/privacy | DONE | Minimal Monaco editor import, real worker, multi-owner environment restoration, complete disposal, default-off bounded/versioned persistence, quota handling, and explicit clear are covered. Ten warmed route cycles retain +2.46 MiB and zero workers (`<5 MiB` budget). |
| Text Diff payload | IN PROGRESS | The schema-v4 route-plus-owned-worker closure is 2,474,507 B raw / 646,976 B gzip, above the `<350 kB gzip` target. The measured experiment rejects further Monaco pruning and records a worker-backed CodeMirror spike as the only viable migration gate; repaired Monaco remains in production. |
| MAC/OUI route payload | IN PROGRESS | The accepted privacy-safe design generates one compact fixed-URL worker from 34,503 pinned records. Its worker is 1,929,826 B raw / 767,125 B gzip and its full closure is 1,937,384 B / 770,467 B, 27.6% less gzip than the original route. Input-selected buckets were measured then rejected because their filenames leaked MAC prefixes; the `<250 kB` product target remains open. |
| YAML Prettify responsiveness | DONE | One terminate-and-replace worker parses each document exactly once with 2 MiB input, 4 MiB output, depth/node/alias, five-second, job-ID, cancellation, stale-result, disposal, and exact worker-side UTF-8 bounds. A conservative graph projection rejects scalar-alias, deep-sequence, escaped-line, and boundary-space amplification before serialization while preserving the 100,000-node capacity. Large integers use `BigInt`; 31 focused checks and the final isolated production 1 MiB fixture pass at 203 ms format-ready with 0.0 ms longest Long Task. |
| JSON lossless/worker slice | DONE | Strict JSON Prettify uses one bounded worker AST, preserves integer/decimal/exponent/negative-zero lexemes, rejects duplicate decoded keys, and sorts decoded keys without touching value tokens. JSON5 is explicitly non-lossless and uses an incremental bounded writer. Thirty-three focused checks and the final production 1 MiB fixture pass at 404 ms cold-route / 197 ms format-ready with 0.0 ms longest Long Task. |
| Shared one-shot worker transport | DONE | JSON/YAML now use the smallest common typed-envelope/job-ID/timeout/cancel/stale/dispose transport without changing their public APIs or literal route-owned worker URLs. Ninety-six focused regressions cover replacement, timeout, cancellation, stale messages, decode failures, and disposal. Persistent OUI indexing is not forced into the one-shot abstraction; broader parser/output/download policy remains incremental. |
| Worker protocol correctness | DONE | Bcrypt error envelopes preserve valid correlation IDs and sanitize/bound worker messages; malformed OUI result IDs are worker failures and force replacement. The combined Bcrypt/OUI focused protocol set passes 46/46 checks. |
| Shared refreshable tasks | DONE | Eight callers use explicit dependency sources and single-execution refresh. Async jobs have AbortSignal/stale-result/scope guards; node-forge cannot physically terminate its internal RSA worker after launch. |
| Shell/Home lifecycle | DONE | Persistent `BaseLayout` removes the detached-layout leak: ten Home/tool cycles improved from +188.40 MiB to +0.86 MiB; DOM and listener counts are stable. |
| ASCII font delivery | DONE | Removed the `unpkg.com` runtime dependency. All 289 Figlet fonts are emitted as versioned same-origin assets, excluded from install-time precache, cached on demand, and covered by browser/container smoke. |
| Confirmed product fixes — slice 1 | DONE | Base64 File, Temperature, URL Parser, Command Palette, CSV, Text Statistics, and Docker Compose output pass 65 focused tests across nine files plus scoped lint. |
| Responsiveness/lifecycle — slice 2 | DONE | Bcrypt and Regex use bounded cancellable workers; Regex preflights sample expansion and preserves zero-width matches; mobile navigation separates transient/persisted state and is inert/focus-safe; Camera has byte/time/raw-allocation/aggregate bounds plus single-flight capture; shared buttons have real disabled semantics. DOM-dependent Regex SVG remains an explicit bounded main-thread residual. |
| Shared large-output rendering | DONE | Above 100,000 UTF-8 bytes, highlighted output becomes one zero-descendant readonly `<textarea>` with a UTF-8-safe 100,000-byte preview; Copy retains the complete bounded output in memory. JSON/YAML 1 MiB fixtures pass the `<50 ms` Long Task gate. |
| Emoji bounded rendering | DONE | Initial presentation is 60 cards / 1,731 DOM elements, load-more reaches 120, full ZWJ/flag values copy correctly, `emojilib` is lazy, and one paged search grid preserves Fuse relevance order. Fuse cancellation and 4x CPU acceptance remain separate work. |
| Cross-tool persistence/privacy | IN PROGRESS | The current storage inventory is classified in `.ai/PERSISTENCE.md`: thirteen legacy content/network-input keys are session-only, secrets are ephemeral, Text Diff is the sole bounded opt-in, Regex edits stay out of URL/history, analytics strips query/hash/referrer credentials, and About provides disclosure plus a managed-key-only global reset. A common preference-storage denial boundary remains. |
| M5 first catalog feature | DONE | NanoID Generator is the first delivered bounded catalog feature: Web Crypto rejection sampling, no content persistence/network transport, explicit generation, NFC Unicode custom-alphabet validation, entropy/collision guidance, 100,000-symbol / 512-KiB limits, copy/download/clear, lazy route, and bundle/browser gates. Its additional closure is 23,225 B raw / 8,916 B gzip; the second feature is also delivered. |
| M5 second catalog feature | DONE | JSON Schema Validator supports Draft 7/2019-09/2020-12 in a route-owned bounded worker with fragment-local references, source-aware sanitized errors, explicit actions, session-only privacy, safe equality for prototype-shaped data, and executable performance/PWA budgets. `allErrors` is additionally bounded by 20,000 projected schema/instance node pairs. Focused 121/121 and Chromium 3/3 pass; issues #368/#801 were requirements research only. |

## Verified checkpoints

- `pnpm install --frozen-lockfile`: passed against the pinned pnpm 9.11.0 lock-resolved graph.
- `pnpm lint`: final integrated run passed with zero errors/warnings.
- `pnpm typecheck`: final integrated application/test and Vite-config projects passed.
- `pnpm exec vitest run --environment jsdom`: final integrated run passed 729/729 across 97 files.
- `pnpm test:build-stats`: schema-v4 15/15 passed, including worker discovery/ownership, unrelated-worker exclusion, malformed-reference failure, manifest graph, stable identity, subpath handling, strict budgets, and required Workbox membership.
- `pnpm build`: final integrated production build passed; OUI freshness and dual typecheck run first, 24,185 modules were transformed, and the local Vite phase took 19.86 s. The earlier exact-Node-24.18.0 Docker build passed in 21.42 s.
- `pnpm exec playwright test --project=chromium --reporter=line --workers=1`: final integrated run passed 97/97 in 1.3 minutes, including the registry-generated 88-tool route smoke.
- Chromium all-tool route smoke: all 88 registry-backed routes pass without runtime/chunk errors or Monaco worker fallback warnings.
- ASCII same-origin E2E: passed; no external font request is made.
- Text Diff forced-GC gate: 20,423,472 B -> 23,001,392 B after ten warmed cycles, +2,577,920 B (+2.46 MiB), zero remaining workers.
- Home forced-GC gate: before fix +188.40 MiB with DOM 9,064 -> 74,694 and listeners 1,939 -> 14,988; after fix 18,336,088 B -> 19,242,160 B, +906,072 B (+0.86 MiB), DOM 5,036 -> 5,037, listeners 807 -> 809.
- Rootless nginx smoke: default UID 101 and arbitrary UID 12345 pass with root-owned non-writable artifact/config, read-only rootfs, tmpfs `/tmp`, all capabilities dropped, and configurable internal port.
- HTTP delivery smoke: health/SPA fallback, strict missing static/Workbox `404`, local Figlet font, HTML/SW/manifest policies, immutable assets, gzip, security headers, and query/referrer-safe access logs pass.
- Workflow syntax: all GitHub workflow YAML parses; entrypoint/container scripts pass `sh -n`; `git diff --check` passes.
- Correctness slice 1: 65/65 focused tests pass across Base64 File, Temperature, URL Parser, Command Palette, CSV, Text Statistics, and Docker Compose; scoped ESLint and `git diff --check` pass.
- Regex responsiveness: 36/36 focused unit/component checks across five files and 4/4 Chromium flows pass for optional/zero-width captures, pre-allocation sample bounds, limits/protocol validation, explicit incoming-query/session-only behavior, catastrophic timeout with heartbeat, stale cancellation, route leave, and tool-to-tool unmount.
- Shared `TextareaCopyable`: 9/9 component checks plus 16/16 UTF-8 helper checks pass; the 1 MiB JSON/YAML Chromium fixtures render one UTF-8-safe 100,000-byte readonly preview with zero descendants, and JSON verifies Copy receives the complete output.
- Build budgets: 15/15 infrastructure tests and 198/198 current production-artifact checks pass; CI/release enforce byte/count ceilings, owned-worker closures, and mandatory Workbox shell/static membership.
- Bcrypt responsiveness: 19/19 original worker/protocol unit checks and 4/4 Chromium flows pass; current protocol hardening is included in the 46/46 Bcrypt/OUI set. The lazy route is 11,427 B raw / 4,160 B gzip and its worker is 25,436 B raw / 11,394 B gzip.
- Camera Recorder lifecycle: 18/18 model/composable/component checks pass with deterministic Blob URL ownership, 1-second chunks, 5-minute/64-MiB recording, single-flight screenshots, a pre-canvas 16,777,216-pixel/64-MiB raw bound, a 16-MiB encoded bound, and a 128-MiB aggregate bound.
- Shared buttons: 4/4 component/router checks pass for non-submitting native defaults, explicit submit/reset, physical href removal plus link semantics while disabled, and enabled object-route navigation.
- URL Encoder standards: 19/19 model regressions pass across component, RFC3986, RFC5987 value-body, and form-urlencoded modes.
- UnoCSS native `size`: 15/15 input/config regressions pass with the original Attributify ignore defaults preserved.
- Sensitive-content migration checkpoint: the current 729/729 full unit run, 15/15 focused storage checks, and 2/2 Chromium privacy flows pass after making thirteen content/network-input keys ephemeral and cleaning legacy values.
- Text Diff 1 MiB interaction: two exact 1,048,576-byte models reach ready diff state in 725 ms; a clear UI action takes 45 ms, the real worker remains active, storage remains default-off, and the focused production-preview suite passes.
- Refreshable task abstraction: 9/9 new invocation/cancellation tests and 38/38 related unit checks pass across all eight migrated callers.
- Privacy/reset UX: 4/4 focused tests pass; clearing managed settings/content preserves unrelated same-origin keys and reports denied mutations.
- Mobile menu: 4/4 layout regressions, 2/2 style-store checks, and 1/1 Chromium focus flow pass for immediate small-screen collapse, route-close, Escape, focus restoration, inert desktop/mobile hidden states, and a preserved persisted desktop preference.
- Emoji bounded rendering: 10/10 focused unit/component checks and 3/3 Chromium flows pass; 60 cards create 1,731 elements, load-more reaches 120, one result grid preserves Fuse ranking, production `face` search takes 166 ms with no Long Task API entry >=50 ms, and additional-route gzip is 32,488 B (-48.8%).
- Analytics/URL privacy: 3/3 plugin checks cover path-only event/pageview URLs and sanitized referrers; 2/2 Regex component checks cover explicit incoming query import without editor write-back.
- PWA demand caching: 10/10 policy checks and 1/1 Chromium offline flow pass. The final precache is nine entries / 954,481 B raw / 327,007 B gzip; Random Port adds four runtime-cached chunks; after HTTP-cache clear, offline reload completes in 290 ms with every required response served by the service worker.
- PWA uncached-route recovery: 14/14 classifier/component checks and 1/1 production-Workbox flow pass; an uncached target replaces sensitive prior DOM with recovery UI, an origin probe prevents navigation into the browser's own offline page, a fresh query-free document clears the sticky import failure after reconnect, and the target enters the lazy cache.
- YAML Prettify: 31/31 handler/protocol/client/model/component checks, 10/10 repeated isolated Long Task runs, and the final 1/1 production flow pass; one bounded worker parse preserves large integers, exact UTF-8 accounting stays off-main-thread, pre-serialization projection blocks four output-amplification classes, format-ready is 203 ms, and no current-interaction Long Task is observed. Chromium garbage from prior discarded contexts is collected before the measurement window, without excluding any formatting allocation.
- JSON Prettify: 33/33 handler/protocol/client/model/component checks and 1/1 1 MiB Chromium flow pass; strict formatting is lossless for numeric lexemes, full Copy is exact, cold route is 404 ms, format-ready is 197 ms, and no Long Task is observed.
- NanoID Generator: 53/53 service/component/download-helper checks and 4/4 Chromium flows pass; maximum 100 x 1,000 generation is 144 ms with no Long Task, clipboard/download are exact, and output/alphabet remain absent from URL, requests, and storage.
- MAC/OUI privacy and lifecycle: generator 4/4, data/protocol/client/service 28/28, and Chromium 2/2 pass; one prefix-independent worker request is reused offline, retry uses the exact same URL, no tested prefix enters a URL/body, and SPA leave disposes the worker.
- UUID v1 randomness: 8/8 service regressions pass with Web Crypto seeding, multicast-node semantics, a 14-bit clock sequence, and no `Math.random` path.
- Shared one-shot worker transport: 96/96 utility/UTF-8/JSON/YAML regressions pass with terminate-and-replace cancellation, timeout, stale-message, decode-failure, and disposal coverage while public clients remain stable.
- Bcrypt/OUI protocol correctness: 46/46 focused checks pass for bounded sanitized errors, preserved valid correlation IDs, malformed-envelope classification, and worker invalidation.
- JSON Schema Validator: 121/121 model/protocol/handler/client/component regressions and 3/3 Chromium flows pass; the final 1 MiB production fixture is 246 ms cold / 205 ms result-ready / 0.0 ms longest observed Long Task, branch-heavy `allErrors` is node-pair bounded, and content remains absent from URL, storage, and requests.

## Current production measurements

The audit baseline used the original CDN-hosted Figlet design. The current
artifact deliberately adds 289 versioned local font files (2,888,669 B raw /
478,400 B theoretical gzip), but excludes them from the mandatory Workbox
precache and caches at most 32 requested fonts at runtime.

| Metric | Audit baseline | Current schema-v4 build | Change |
|---|---:|---:|---:|
| Total dist files | 286 | 508 | +222 (+77.6%; includes 289 local fonts) |
| Total dist raw | 12,816,672 B | 13,298,942 B | +482,270 B (+3.8%) |
| Total dist gzip | 3,893,533 B | 3,800,041 B | -93,492 B (-2.4%) |
| Shell gzip incl. document | 273,513 B | 276,645 B | +3,132 B (+1.1%) |
| Workbox entries | 270 | 9 | -261 (-96.7%) |
| Workbox raw | 6,121,476 B | 954,481 B | -5,166,995 B (-84.4%) |
| Workbox gzip | 1,911,520 B | 327,007 B | -1,584,513 B (-82.9%) |
| Text Diff JS raw | 3,161,296 B | 2,206,864 B | -954,432 B (-30.2%) |
| Text Diff JS gzip | 801,738 B | 570,786 B | -230,952 B (-28.8%) |
| Text Diff additional route + worker gzip | not previously separated | 646,976 B | target remains `<350 kB` |
| MAC Lookup additional route + worker raw | 3,350,554 B | 1,937,384 B | -1,413,170 B (-42.2%) |
| MAC Lookup additional route + worker gzip | 1,064,267 B | 770,467 B | -293,800 B (-27.6%) |
| NanoID additional route raw / gzip | not present | 23,225 B / 8,916 B | first local catalog feature |
| JSON Prettify additional route + worker raw / gzip | not previously worker-aware | 208,871 B / 70,845 B | worker is 46,309 B / 13,989 B |
| YAML Prettify additional route + worker raw / gzip | not previously worker-aware | 261,438 B / 87,579 B | worker is 99,735 B / 31,033 B |
| JSON Schema Validator additional route + worker raw / gzip | not present | 176,585 B / 53,355 B | worker is 161,471 B / 47,125 B; both gates pass |
| JSON Schema registry shell increment | prior checkpoint 276,295 B gzip | 276,645 B gzip | +350 B (+0.1%) accepted for route metadata/icon; Ajv stays lazy and worker-owned |
| Emoji additional route raw | 386,059 B | 272,834 B | -113,225 B (-29.3%) |
| Emoji additional route gzip | 63,420 B | 32,488 B | -30,932 B (-48.8%) |

## Completed implementation units

- Restored a zero-warning lint baseline and canonical application/test/Vite type checking.
- Made unit tests one-shot by default and made production build invoke canonical typecheck.
- Aligned Node 24.18.0/pnpm 9.11.0 across engines, `.nvmrc`, CI, Docker, and documentation; pinned first-party/third-party actions by SHA and disabled persisted checkout credentials.
- Added frozen installs, corrected Playwright cache identity, BuildKit fetch/cache, strict SemVer release validation, immutable version tags, draft-before-push ordering, SBOM, and provenance declarations.
- Moved build/type-only packages out of runtime dependencies without importing an upstream lockfile.
- Added deterministic schema-v4 build/PWA statistics with compact closure membership digests and fail-closed ownership of literal local workers in route closures.
- Added secure unbiased browser randomness, restored `N`/`n`, removed duplicate symbols, bounded untrusted token length, and added non-persistence coverage.
- Reworked Text Diff worker ownership, lifecycle disposal, persistence privacy, quota recovery, and forced-GC regression gates.
- Fixed the application-shell detached layout leak and added a cross-route heap/DOM/listener gate.
- Removed ASCII Art's third-party CDN dependency using versioned same-origin on-demand font delivery.
- Added all-88-route smoke coverage and narrow worker/chunk/runtime warning gates.
- Added pinned rootless container delivery, configurable port, read-only operation, healthcheck, gzip/cache/security headers, strict static routing, and automated default/arbitrary-UID smoke.
- Corrected release image namespaces from upstream `corentinth` to the local fork `64mb`.
- Fixed Base64 MIME/raw-data URIs, all-scale Temperature bounds/rounding, ordered URL query duplicates/fragments, guarded Command Palette keyboard activation, standard CSV quoting, single-pass Text Statistics, and obsolete Compose output with focused regressions.
- Fixed Regex optional captures and shared output copy-placement/late-height tracking.
- Added machine-readable build budget schema, default route ceilings, documented heavy-route exceptions, and CI/release enforcement.
- Replaced route-wide Workbox precaching with a nine-entry shell policy (including the fail-closed discovered Workbox client runtime), bounded runtime caching for opened hashed routes, required-entry checks, product-target byte ceilings, and a clean-HTTP-cache offline reload fixture.
- Replaced reactive Bcrypt work with explicit bounded worker actions; bounded Camera Recorder duration/chunks/raw canvas/encoded output/item and aggregate bytes with single-flight capture; added four URL encoding modes; restored native input `size` and shared disabled-button contracts.
- Replaced getter-as-watch refresh logic with explicit dependencies, one execution per refresh, async stale guards, AbortSignal cancellation, and scope disposal across eight generators.
- Removed default raw-content persistence from JSON/YAML viewers, JSON Diff, HTML WYSIWYG, Benchmark Builder, Case Converter, Regex, IPv4 converter/range/subnet, and MAC prefix while preserving harmless settings; explicit incoming Regex query import remains, but editor changes never write back to URL/history.
- Sanitized Plausible custom events and automatic pageviews to path-only URLs and stripped referrer credentials/query/hash before transport.
- Added an About privacy boundary and global reset that removes only the audited managed-key registry, leaving other same-origin application data untouched.
- Moved Regex matching and RandExp into independent terminate-and-replace workers with 1.2-second deadlines, limits, cancellation/stale guards, route disposal, and catastrophic-heartbeat coverage; added pre-allocation AST/backreference bounds and single-flight DOM-dependent SVG.
- Added one zero-descendant readonly `<textarea>` preview above 100,000 UTF-8 bytes and 1 MiB JSON/YAML browser regressions that preserve full copy access without rendering the complete result into the DOM.
- Paged Emoji Picker 60 cards at a time, lazy-loaded keyword metadata, preserved complete ZWJ/flag sequences and Fuse result order in one grid, and replaced clickable text with keyboard-native copy buttons.
- Closed the small-screen menu after route changes and Escape without changing the persisted desktop collapse preference; hidden navigation is inert at both breakpoints and focus returns to the labelled toggle.
- Replaced YAML Prettify's double parse/reactive main-thread path with one bounded parse-once worker, `BigInt` integers, explicit formatting above 100 kB, worker-side exact UTF-8 bounds, cancellation/stale guards, and a 1 MiB `<50 ms` Long Task browser gate.
- Added strict lossless JSON Prettify on one bounded worker AST, decoded-key duplicate/sort rules, an incremental bounded JSON5 writer, worker-side exact UTF-8 accounting, complete-output Copy, and a 1 MiB `<50 ms` Long Task browser gate.
- Delivered the dependency-free NanoID catalog feature with Web Crypto rejection sampling, Unicode-aware custom alphabets, exact/approximated collision guidance, hard batch/output limits, copy/download/clear privacy coverage, and a measured 8,916 B gzip additional route.
- Added a privacy-safe offline lazy-route state that hides the old tool, distinguishes origin unavailability from ordinary code errors, and recovers sticky failed imports through a query-free fresh document.
- Replaced the OUI monolith with reproducibly generated compact data in a fixed-URL route worker; rejected the smaller prefix-bucket prototype because input-derived filenames would enter access logs.
- Completed the Text Diff editor payload comparison and secure-randomness inventory; retained repaired Monaco pending a worker-backed CodeMirror spike and removed UUID v1's pseudo-random seed path.
- Delivered the bounded three-draft JSON Schema Validator with local references, session-only privacy, source-aware sanitized errors, safe prototype-shaped equality, explicit actions, and measured worker/route/PWA budgets.
- Extracted the proven JSON/YAML terminate-and-replace worker-task transport and closed Bcrypt/OUI malformed-envelope and error-sanitization correctness gaps with focused regressions.

## Active risks and deliberately deferred work

- Local host Node is 24.15.0 while the selected baseline is 24.18.0. Exact-baseline build verification is provided by Docker; local commands emit the expected engine warning.
- `@types/node` remains 18.x. Updating it alone makes the old peer graph resolve an incompatible `@vueuse/shared` 14.x, so this stays in the controlled dependency-remediation group.
- Text Diff meets the heap/worker budget but not the route payload budget; the measured comparison is complete and a worker-backed CodeMirror parity/adversarial spike is required before migration.
- Local Figlet assets increase static artifact file count/size but remain excluded from the nine-entry mandatory precache; on-demand runtime caching and a separate same-origin browser/container fixture pass.
- Regex SVG remains an explicit bounded main-thread task because `@regexper/render` requires the DOM; selecting a DOM-free or isolated renderer is separate work.
- Emoji meets the initial DOM budget, but full-catalog Fuse search is still synchronous and the 4x CPU `<200 ms` acceptance profile remains open.
- PWA demand caching and uncached-route recovery pass; update/rollback and stale-cache cleanup acceptance remain open.
- The privacy-safe OUI worker is 27.6% smaller gzip than the original route but still exceeds the `<250 kB` product target. Prefix-selected loading is rejected unless input-derived URLs/logging can be eliminated; reducing exact vendor coverage requires a product decision.
- JSON/YAML Prettify now pass the unthrottled sequential Chromium 1 MiB `<50 ms` Long Task fixtures, but remaining converters/parsers and a slower-device profile are not covered by that claim. The complete bounded output still resides in memory/main-thread state; only the DOM preview is truncated.
- NanoID's 100,000-symbol gate passes unthrottled Chromium at 144 ms with no observed Long Task; this is not yet a slow-device guarantee.
- JSON Schema validation passes the unthrottled Chromium 1 MiB gate, but slower-device and cross-browser performance profiles remain open. The 5-second worker deadline is the hard runtime bound.
- Ajv performs runtime validator code generation. The current delivery headers do not impose an eval-blocking CSP; if a future CSP does, the feature reports validator unavailability and must move to precompiled/interpreted validation rather than adding `unsafe-eval`.
- Dependency and base-image vulnerability remediation/scanner gating is intentionally deferred to a later security track per current scope direction. No advisory suppression was added.
- Reverse-proxy and real base/subpath deployment acceptance remain open.
- No upstream code has been merged, rebased, or cherry-picked. Upstream items remain requirements/fixture sources only.

## Next acceptance gates

1. Extend the delivered one-shot task transport only where another real consumer needs it, adding `messageerror`, envelope-first stale filtering, strict legacy record guards, OUI error sanitization, and an explicit output-byte-metadata trust contract; then consolidate shared parser/depth/output/download limits without forcing persistent OUI or overstating lossless behavior.
2. Scope the third bounded catalog feature; streaming local file hashing is the leading candidate and must prove incremental memory, cancellation/progress, large-file browser behavior, and route-worker budgets before implementation.
3. Build a worker-backed CodeMirror parity/adversarial spike and migrate Text Diff only if the full owned-worker closure is `<350 kB` gzip and lifecycle/accuracy gates pass.
4. Add Emoji 4x CPU coverage and cancellable/worker-backed search if the slower profile exceeds budget.
5. Add PWA update/rollback and stale-cache cleanup acceptance using an explicit two-build rollback contract.
6. Decide whether exact OUI coverage justifies the reviewed 770,467 B gzip privacy-safe exception, then continue shell/icon/Lodash reduction with route budgets.
7. Keep dependency/base-image CVE remediation and scanner policy in the separately tracked later security slice.

## Journal

- 2026-07-18: started implementation from the approved roadmap and established the baseline.
- 2026-07-18: completed Token/TOTP secure randomness, alphabet/boundary tests, and privacy coverage.
- 2026-07-18: implemented Text Diff minimal Monaco import, worker ownership, disposal, opt-in bounded persistence, and schema-v3 route measurements.
- 2026-07-18: reduced Text Diff JS gzip by 28.8%; payload remains over budget.
- 2026-07-18: passed the 86-route smoke and removed ASCII Art's failing `unpkg.com` dependency using local on-demand fonts.
- 2026-07-18: added forced-GC gates; Text Diff retains +2.46 MiB with zero workers after ten cycles.
- 2026-07-18: found that the apparent remaining Monaco leak was a global dynamic-layout leak; persistent `BaseLayout` reduced Home/tool retained growth from +188.40 MiB to +0.86 MiB.
- 2026-07-18: passed rootless/read-only default and arbitrary-UID container contracts with strict static/cache/privacy behavior.
- 2026-07-18: hardened release ordering/permissions/versioning and enabled SBOM/provenance declarations; vulnerability remediation/gating was moved to the later security track by scope direction.
- 2026-07-18: started the next project-owned correctness slice for Base64 File, Temperature Converter, and URL Parser; external/base-image CVE work remains deferred.
- 2026-07-18: completed correctness slice 1: seven project-owned fixes, 65/65 focused regressions, scoped lint, and diff checks are green; started Regex/Bcrypt/Camera lifecycle work in parallel.
- 2026-07-18: completed Regex optional-capture and shared `TextareaCopyable` fixes; activated 181 build-budget checks in CI/release with explicit rationales for existing heavy routes.
- 2026-07-18: completed Bcrypt worker/cancellation, Camera Recorder lifecycle, URL Encoder standards modes, and UnoCSS native-size fixes with focused unit/component/browser gates.
- 2026-07-18: completed the current persistence inventory: thirteen legacy content/network-input keys are cleaned and session-only, secret classes remain ephemeral, and policy/remaining UX work are recorded in `.ai/PERSISTENCE.md`.
- 2026-07-18: passed the Text Diff two-by-1-MiB worker interaction gate (725 ms ready, 45 ms UI action) and completed the eight-caller single-execution refreshable-task migration.
- 2026-07-18: reduced mandatory PWA install from 270 files / 6.12 MB raw to nine files / 945,188 B raw / 324,178 B gzip and made shell/runtime/static membership plus both product byte targets executable gates.
- 2026-07-18: exposed the persistence boundary in-product and added a confirmed global reset over the audited managed-key registry without calling broad `localStorage.clear()`.
- 2026-07-18: moved Regex matching and RandExp into bounded terminate-and-replace workers; 35/35 unit/component plus 4/4 Chromium checks cover zero-width results, sample projection, catastrophic timeout/heartbeat, stale work, route disposal, and previous-tool unmount. DOM-dependent SVG is explicit and bounded rather than falsely reported as worker-backed.
- 2026-07-18: added the shared 100,000-byte plain-output threshold and passed a 1 MiB JSON fixture with one `<pre>`, zero result descendants, and reachable copy; closed mobile route/Escape behavior with 3/3 checks.
- 2026-07-18: paged Emoji 60 -> 120, reduced initial DOM to 1,731 elements and additional-route gzip by 48.8%, lazy-loaded keywords, preserved Fuse ranking in one result grid, and passed 10/10 focused plus 3/3 Chromium checks.
- 2026-07-18: the first real offline test exposed a missing pre-control Workbox client chunk; added fail-closed manifest discovery, then passed clean-HTTP-cache offline reload with all shell/lazy responses served by the service worker.
- 2026-07-18: final integrated checkpoint passed lint, dual typecheck, 367/367 unit across 70 files, 11/11 build-stat tests, 194/194 artifact budgets, production build, 86/86 Chromium tests, and all 86 registered routes; refreshed the schema-v3 baseline.
- 2026-07-18: post-checkpoint review closed RandExp pre-allocation amplification (nested repetition and skipped/lookahead capture numbering), restored zero-width Regex results, made SVG single-flight, fixed Emoji symbol sizing, and made mobile-menu hiding inert with deterministic focus restoration; all combined gates pass.
- 2026-07-18: bounded Camera recordings to 5 minutes/64 MiB with 1-second chunks, screenshots before canvas allocation and after encoding with single-flight/late-callback guards, and retained captures to 128 MiB plus count caps; Camera 18/18 and shared-button 4/4 focused regressions plus the full Chromium suite pass.
- 2026-07-18: final independent audit closed Regex URL write-back and analytics disclosure, late/simultaneous Camera screenshots, transient mobile-state persistence, desktop inertness, and Emoji relevance-order regressions; all focused checks pass.
- 2026-07-18: final gates pass on the integrated tree: zero-warning lint, dual typecheck, 367/367 unit, production build, 11/11 build-stat tests, 194/194 artifact checks, 86/86 Chromium E2E in 22.7 seconds, and `git diff --check`; external CVE work remains intentionally deferred.
- 2026-07-18: started the next autonomous P0/P1 slice with OUI partitioning, YAML worker isolation, offline uncached-route recovery, and a measured Text Diff editor decision; the external CVE/dependency track remains deferred.
- 2026-07-18: generated and measured 112 deterministic OUI buckets at about 66.9 kB gzip for the worst request, then rejected that prototype because its prefix-derived filenames would disclose MAC input in nginx `$uri`; no bucket implementation remains in the accepted tree.
- 2026-07-18: completed YAML Prettify's parse-once bounded worker, explicit large-input flow, 19/19 focused checks, and 1 MiB Chromium heartbeat fixture; the owned worker is 96,806 B raw / 30,216 B gzip.
- 2026-07-18: completed the Text Diff Monaco/CodeMirror experiment and schema-v4 owned-worker accounting. Repaired Monaco remains because CodeMirror needs a worker-backed correctness spike; the true current closure is 2,474,507 B raw / 646,984 B gzip.
- 2026-07-18: completed OUI fixed-worker privacy/lifecycle acceptance from one reproducible 1,986,393-byte compact artifact. Generator 4/4, focused 28/28, Chromium 2/2, and the reviewed 1,937,380 B raw / 770,460 B gzip closure gate pass; the `<250 kB` product target remains open.
- 2026-07-18: completed production-Workbox uncached-route recovery. The integration test exposed sticky failed native imports, so retry now verifies the app origin and starts a query-free fresh document, preserving recovery while keeping any in-memory query/hash out of access logs.
- 2026-07-18: completed the shared/direct randomness audit in `.ai/RANDOMNESS.md` and replaced UUID v1 pseudo-random node/clock seeding with Web Crypto plus 8/8 regression checks.
- 2026-07-18: final slice gates pass: zero-warning lint, dual typecheck, 436/436 unit across 81 files, OUI generator 4/4, schema-v4 build-stat tests 15/15, 194/194 artifact budgets, production build, 90/90 Chromium E2E in 28.0 seconds, and `git diff --check`; unrelated CVE work remains intentionally deferred.
- 2026-07-18: started the next autonomous cross-category slice: the local NanoID catalog feature plus strict lossless, bounded worker-backed JSON Prettify. Added the already lock-resolved `jsonc-parser@3.2.0` as a direct route dependency; external CVE work remains deferred.
- 2026-07-18: independent review closed NanoID pigeonhole/exact-small-namespace guidance, huge alphabet/count preflights, native input bounds, URL-safe/default copy, and JSON5 pre-allocation amplification. The new strict Long Task gate then exposed a remaining full-string scan on the main-thread worker transfer boundary; JSON/YAML transfer metadata refactoring is active rather than weakening the `<50 ms` assertion.
- 2026-07-18: completed the NanoID + strict JSON numeric-lexeme/YAML integer-preservation slice. Full-payload UTF-8 scans moved into pure-tested worker handlers while the main thread retains only bounded preview truncation; final production fixtures measure JSON 404 ms cold / 197 ms ready / 0.0 ms longest task, YAML 203 ms / 0.0 ms, and maximum NanoID generation 144 ms / 0.0 ms. Independent audit then closed YAML scalar-alias/deep-sequence/escaped-line/boundary-space allocation before serialization and stabilized the Chromium measurement window against garbage from prior discarded contexts without weakening the `<50 ms` current-interaction gate. Final gates pass: lint, dual typecheck, 546/546 unit, 15/15 build-stat, 4/4 OUI, 196/196 artifact budgets, 24,177-module production build in 19.44 s, 94/94 sequential Chromium E2E including all 87 routes, YAML repeat-each 10/10, and refreshed schema-v4 stats. External CVE work remains intentionally deferred.
- 2026-07-18: synchronized `TODO`, `FEATURES`, `FIXES`, `PERFORMANCE`, `PERSISTENCE`, experiment notes, and this journal to the final schema-v4 metrics. A separate read-only consistency audit returned clean after narrowing the claims to strict JSON numeric lexemes, YAML integer preservation, worker-side full-payload accounting, and bounded main-thread preview scanning. Repeat lint, typecheck, 546/546 unit, 15/15 build-stat, 4/4 OUI, 196/196 artifact-budget, and diff checks pass.
- 2026-07-18: started the next autonomous cross-category slice: a local three-draft JSON Schema Validator, extraction of the proven JSON/YAML one-shot worker transport, and project-owned Bcrypt/OUI protocol hardening. Ajv 8.17.1 was promoted to an exact direct route dependency; issues #368/#801 remained requirements-only and no upstream code was transferred.
- 2026-07-18: delivered the JSON Schema Validator with strict local-reference/resource/privacy contracts, prototype-safe validation semantics, and a schema/instance node-pair `allErrors` guard; delivered the shared JSON/YAML task transport; bounded and sanitized Bcrypt errors; and corrected malformed OUI response classification. Final integrated gates pass: lint, dual typecheck, 729/729 unit across 97 files, 15/15 build-stat, 4/4 OUI, 198/198 artifact budgets, 24,185-module production build in 19.86 s, 97/97 sequential Chromium E2E including all 88 routes, and `git diff --check`. The validator closure is 176,585 B raw / 53,355 B gzip, its worker is 161,471 B / 47,125 B, the nine-entry PWA is 954,481 B / 327,007 B, and the final 1 MiB flow is 246 ms cold / 205 ms ready / 0.0 ms longest task. The accepted initial-shell cost is +350 B gzip for the catalog entry while Ajv remains lazy and no new chunk exceeds 500 kB. External CVE/base-image work remains intentionally deferred.
- 2026-07-18: final independent adversarial review found and closed one medium Ajv error-amplification gap with a real branch-heavy regression. No high-severity findings remain; lower-risk `messageerror`, envelope-first decode, legacy array-record, OUI text-sanitization, and byte-metadata trust refinements are explicitly queued in `TODO` rather than hidden or overstated.
