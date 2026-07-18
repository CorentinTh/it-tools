# Implementation Progress

Last updated: 2026-07-18

This is the live implementation journal for the roadmap. A task is `DONE` only
after its relevant regression tests and acceptance gates pass on the current
working tree. `IN PROGRESS` means implementation exists but the complete
milestone Definition of Done has not yet passed.

## Current slice

| Area | Status | Current result / remaining gate |
|---|---|---|
| M0 quality baseline | DONE | Lint, dual-project typecheck, 367/367 unit tests, 86/86 Chromium E2E tests, all 86 routes, production build, and diff checks are green on the final integrated worktree. |
| M0 build measurements | IN PROGRESS | Schema-v3 baseline plus schema-v1 budgets enforce shell, required Workbox entries, default routes, and rationale-backed heavy-route ceilings in CI/release; 194 current-artifact checks pass. Standard-runner build-time/modules/RSS telemetry remains. |
| PWA mandatory install | DONE | Shell-only Workbox inventory is 9 files / 945,188 B raw / 324,178 B gzip. Required membership and <=1 MB raw / <=350 kB gzip / <=10 files fail CI/release; clean-HTTP-cache offline lazy-route reload passes. |
| M1 container delivery | IN PROGRESS | Rootless/read-only/default-and-arbitrary-UID contracts pass with alternate internal port, strict static 404, gzip/cache/headers, and privacy-safe access logs. The CVE/remediation track is explicitly deferred; reverse-proxy/subpath acceptance remains. |
| Token/TOTP secure randomness | DONE | Web Crypto rejection sampling, alphabet fixes, length bounds, Unicode/boundary tests, and non-persistence browser checks are implemented. The wider shared-random caller inventory remains a separate checklist item. |
| Text Diff lifecycle/privacy | DONE | Minimal Monaco editor import, real worker, multi-owner environment restoration, complete disposal, default-off bounded/versioned persistence, quota handling, and explicit clear are covered. Ten warmed route cycles retain +2.46 MiB and zero workers (`<5 MiB` budget). |
| Text Diff payload | IN PROGRESS | Main chunk is 2,206,864 B raw / 570,786 B gzip; additional-to-shell closure is 2,268,407 B raw / 582,998 B gzip, still above the `<350 kB gzip` target. The 1 MiB interaction fixture passes; the remaining gap is transfer size. |
| Shared refreshable tasks | DONE | Eight callers use explicit dependency sources and single-execution refresh. Async jobs have AbortSignal/stale-result/scope guards; node-forge cannot physically terminate its internal RSA worker after launch. |
| Shell/Home lifecycle | DONE | Persistent `BaseLayout` removes the detached-layout leak: ten Home/tool cycles improved from +188.40 MiB to +0.86 MiB; DOM and listener counts are stable. |
| ASCII font delivery | DONE | Removed the `unpkg.com` runtime dependency. All 289 Figlet fonts are emitted as versioned same-origin assets, excluded from install-time precache, cached on demand, and covered by browser/container smoke. |
| Confirmed product fixes — slice 1 | DONE | Base64 File, Temperature, URL Parser, Command Palette, CSV, Text Statistics, and Docker Compose output pass 65 focused tests across nine files plus scoped lint. |
| Responsiveness/lifecycle — slice 2 | DONE | Bcrypt and Regex use bounded cancellable workers; Regex preflights sample expansion and preserves zero-width matches; mobile navigation separates transient/persisted state and is inert/focus-safe; Camera has byte/time/raw-allocation/aggregate bounds plus single-flight capture; shared buttons have real disabled semantics. DOM-dependent Regex SVG remains an explicit bounded main-thread residual. |
| Shared large-output rendering | DONE | Above 100,000 UTF-8 bytes, highlighted output degrades to one copyable plain `<pre>`; the 1 MiB JSON browser fixture has zero result descendants. Parser workers and the `<50 ms` task gate remain a separate phase. |
| Emoji bounded rendering | DONE | Initial presentation is 60 cards / 1,731 DOM elements, load-more reaches 120, full ZWJ/flag values copy correctly, `emojilib` is lazy, and one paged search grid preserves Fuse relevance order. Fuse cancellation and 4x CPU acceptance remain separate work. |
| Cross-tool persistence/privacy | IN PROGRESS | The current storage inventory is classified in `.ai/PERSISTENCE.md`: thirteen legacy content/network-input keys are session-only, secrets are ephemeral, Text Diff is the sole bounded opt-in, Regex edits stay out of URL/history, analytics strips query/hash/referrer credentials, and About provides disclosure plus a managed-key-only global reset. A common preference-storage denial boundary remains. |
| M5 product features | NOT STARTED | New catalog features remain behind the P0/P1 correctness and responsiveness work. |

## Verified checkpoints

- `pnpm install --frozen-lockfile --force`: passed; lock-resolved dependency graph restored.
- `pnpm lint`: final integrated run passed with zero errors/warnings.
- `pnpm typecheck`: final integrated application/test and Vite-config projects passed.
- `pnpm exec vitest run --environment jsdom`: final integrated run passed 367/367 across 70 files.
- `pnpm test:build-stats`: schema-v3 11/11 passed, including manifest graph, stable identity, subpath handling, strict budget parsing, and required Workbox membership.
- `pnpm build`: final integrated production build passed; 24,163 modules transformed and the local Vite phase took 19.37 s. The earlier exact-Node-24.18.0 Docker build passed in 21.42 s.
- `pnpm test:e2e --project=chromium --reporter=line`: final integrated run passed 86/86 in 22.7 s, including the registry-generated 86-tool route smoke.
- Chromium all-tool route smoke: all 86 registry-backed routes pass without runtime/chunk errors or Monaco worker fallback warnings.
- ASCII same-origin E2E: passed; no external font request is made.
- Text Diff forced-GC gate: 20,423,472 B -> 23,001,392 B after ten warmed cycles, +2,577,920 B (+2.46 MiB), zero remaining workers.
- Home forced-GC gate: before fix +188.40 MiB with DOM 9,064 -> 74,694 and listeners 1,939 -> 14,988; after fix 18,336,088 B -> 19,242,160 B, +906,072 B (+0.86 MiB), DOM 5,036 -> 5,037, listeners 807 -> 809.
- Rootless nginx smoke: default UID 101 and arbitrary UID 12345 pass with root-owned non-writable artifact/config, read-only rootfs, tmpfs `/tmp`, all capabilities dropped, and configurable internal port.
- HTTP delivery smoke: health/SPA fallback, strict missing static/Workbox `404`, local Figlet font, HTML/SW/manifest policies, immutable assets, gzip, security headers, and query/referrer-safe access logs pass.
- Workflow syntax: all GitHub workflow YAML parses; entrypoint/container scripts pass `sh -n`; `git diff --check` passes.
- Correctness slice 1: 65/65 focused tests pass across Base64 File, Temperature, URL Parser, Command Palette, CSV, Text Statistics, and Docker Compose; scoped ESLint and `git diff --check` pass.
- Regex responsiveness: 36/36 focused unit/component checks across five files and 4/4 Chromium flows pass for optional/zero-width captures, pre-allocation sample bounds, limits/protocol validation, explicit incoming-query/session-only behavior, catastrophic timeout with heartbeat, stale cancellation, route leave, and tool-to-tool unmount.
- Shared `TextareaCopyable`: 8/8 placement/late-target/plain-fallback tests plus 6/6 exact UTF-8 threshold checks pass; the 1 MiB JSON Chromium fixture renders one `<pre>` with zero descendants and keeps copy available.
- Build budgets: 11/11 infrastructure tests and 194/194 current production-artifact checks pass; CI/release enforce byte/count ceilings plus mandatory Workbox shell/static membership.
- Bcrypt responsiveness: 19/19 worker/protocol unit checks and 4/4 Chromium flows pass; the lazy route is 10,966 B raw / 3,984 B gzip and its worker is 24,937 B raw / 11,308 B gzip.
- Camera Recorder lifecycle: 18/18 model/composable/component checks pass with deterministic Blob URL ownership, 1-second chunks, 5-minute/64-MiB recording, single-flight screenshots, a pre-canvas 16,777,216-pixel/64-MiB raw bound, a 16-MiB encoded bound, and a 128-MiB aggregate bound.
- Shared buttons: 4/4 component/router checks pass for non-submitting native defaults, explicit submit/reset, physical href removal plus link semantics while disabled, and enabled object-route navigation.
- URL Encoder standards: 19/19 model regressions pass across component, RFC3986, RFC5987 value-body, and form-urlencoded modes.
- UnoCSS native `size`: 15/15 input/config regressions pass with the original Attributify ignore defaults preserved.
- Sensitive-content migration checkpoint: the final 367/367 full unit run, 15/15 focused storage checks, and 2/2 Chromium privacy flows pass after making thirteen content/network-input keys ephemeral and cleaning legacy values.
- Text Diff 1 MiB interaction: two exact 1,048,576-byte models reach ready diff state in 725 ms; a clear UI action takes 45 ms, the real worker remains active, storage remains default-off, and the focused production-preview suite passes.
- Refreshable task abstraction: 9/9 new invocation/cancellation tests and 38/38 related unit checks pass across all eight migrated callers.
- Privacy/reset UX: 4/4 focused tests pass; clearing managed settings/content preserves unrelated same-origin keys and reports denied mutations.
- Mobile menu: 4/4 layout regressions, 2/2 style-store checks, and 1/1 Chromium focus flow pass for immediate small-screen collapse, route-close, Escape, focus restoration, inert desktop/mobile hidden states, and a preserved persisted desktop preference.
- Emoji bounded rendering: 10/10 focused unit/component checks and 3/3 Chromium flows pass; 60 cards create 1,731 elements, load-more reaches 120, one result grid preserves Fuse ranking, production `face` search takes 166 ms with no Long Task API entry >=50 ms, and additional-route gzip is 32,491 B (-48.8%).
- Analytics/URL privacy: 3/3 plugin checks cover path-only event/pageview URLs and sanitized referrers; 2/2 Regex component checks cover explicit incoming query import without editor write-back.
- PWA demand caching: 10/10 policy checks and 1/1 Chromium offline flow pass. The final precache is nine entries; Random Port adds four runtime-cached chunks; after HTTP-cache clear, offline reload completes in 290 ms with every required response served by the service worker.

## Current production measurements

The audit baseline used the original CDN-hosted Figlet design. The current
artifact deliberately adds 289 versioned local font files (2,888,669 B raw /
478,400 B theoretical gzip), but excludes them from the mandatory Workbox
precache and caches at most 32 requested fonts at runtime.

| Metric | Audit baseline | Current schema-v3 build | Change |
|---|---:|---:|---:|
| Total dist files | 286 | 499 | +213 (+74.5%; includes 289 local fonts) |
| Total dist raw | 12,816,672 B | 14,365,310 B | +1,548,638 B (+12.1%) |
| Total dist gzip | 3,893,533 B | 3,986,991 B | +93,458 B (+2.4%) |
| Shell gzip incl. document | 273,513 B | 273,816 B | +303 B (+0.1%) |
| Workbox entries | 270 | 9 | -261 (-96.7%) |
| Workbox raw | 6,121,476 B | 945,188 B | -5,176,288 B (-84.6%) |
| Workbox gzip | 1,911,520 B | 324,178 B | -1,587,342 B (-83.0%) |
| Text Diff JS raw | 3,161,296 B | 2,206,864 B | -954,432 B (-30.2%) |
| Text Diff JS gzip | 801,738 B | 570,786 B | -230,952 B (-28.8%) |
| Text Diff additional route gzip | not previously separated | 582,998 B | target remains `<350 kB` |
| Emoji additional route raw | 386,059 B | 272,834 B | -113,225 B (-29.3%) |
| Emoji additional route gzip | 63,420 B | 32,491 B | -30,929 B (-48.8%) |

## Completed implementation units

- Restored a zero-warning lint baseline and canonical application/test/Vite type checking.
- Made unit tests one-shot by default and made production build invoke canonical typecheck.
- Aligned Node 24.18.0/pnpm 9.11.0 across engines, `.nvmrc`, CI, Docker, and documentation; pinned first-party/third-party actions by SHA and disabled persisted checkout credentials.
- Added frozen installs, corrected Playwright cache identity, BuildKit fetch/cache, strict SemVer release validation, immutable version tags, draft-before-push ordering, SBOM, and provenance declarations.
- Moved build/type-only packages out of runtime dependencies without importing an upstream lockfile.
- Added deterministic schema-v3 build/PWA statistics with compact closure membership digests; the checked baseline is 149 kB rather than a duplicated 6.6 MB report.
- Added secure unbiased browser randomness, restored `N`/`n`, removed duplicate symbols, bounded untrusted token length, and added non-persistence coverage.
- Reworked Text Diff worker ownership, lifecycle disposal, persistence privacy, quota recovery, and forced-GC regression gates.
- Fixed the application-shell detached layout leak and added a cross-route heap/DOM/listener gate.
- Removed ASCII Art's third-party CDN dependency using versioned same-origin on-demand font delivery.
- Added all-86-route smoke coverage and narrow worker/chunk/runtime warning gates.
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
- Added one-`pre` shared rendering above 100,000 UTF-8 bytes and a 1 MiB JSON browser regression that preserves copy access.
- Paged Emoji Picker 60 cards at a time, lazy-loaded keyword metadata, preserved complete ZWJ/flag sequences and Fuse result order in one grid, and replaced clickable text with keyboard-native copy buttons.
- Closed the small-screen menu after route changes and Escape without changing the persisted desktop collapse preference; hidden navigation is inert at both breakpoints and focus returns to the labelled toggle.

## Active risks and deliberately deferred work

- Local host Node is 24.15.0 while the selected baseline is 24.18.0. Exact-baseline build verification is provided by Docker; local commands emit the expected engine warning.
- `@types/node` remains 18.x. Updating it alone makes the old peer graph resolve an incompatible `@vueuse/shared` 14.x, so this stays in the controlled dependency-remediation group.
- Text Diff meets the heap/worker budget but not the route payload budget; a measured lightweight-editor comparison is still required.
- Local Figlet assets increase static artifact file count/size but remain excluded from the nine-entry mandatory precache; on-demand runtime caching and a separate same-origin browser/container fixture pass.
- Regex SVG remains an explicit bounded main-thread task because `@regexper/render` requires the DOM; selecting a DOM-free or isolated renderer is separate work.
- Emoji meets the initial DOM budget, but full-catalog Fuse search is still synchronous and the 4x CPU `<200 ms` acceptance profile remains open.
- PWA demand caching passes clean-cache offline reload, but update/rollback, stale-cache cleanup acceptance, and offline-unavailable UX remain open.
- Dependency and base-image vulnerability remediation/scanner gating is intentionally deferred to a later security track per current scope direction. No advisory suppression was added.
- Reverse-proxy and real base/subpath deployment acceptance remain open.
- No upstream code has been merged, rebased, or cherry-picked. Upstream items remain requirements/fixture sources only.

## Next acceptance gates

1. Run the measured lightweight-editor experiment and bring Text Diff additional payload below `<350 kB` gzip or record an explicit reviewed exception.
2. Consolidate the Bcrypt/Regex patterns into a common worker/parser/depth/output/download policy and migrate the remaining heavy parsers.
3. Add Emoji 4x CPU coverage and cancellable/worker-backed search if the slower profile exceeds budget.
4. Add PWA update/rollback, stale-cache cleanup, and offline-unavailable acceptance UX.
5. Partition the OUI dataset and continue shell/icon/Lodash reduction with route budgets.
6. Keep dependency/base-image CVE remediation and scanner policy in the separately tracked later security slice.

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
