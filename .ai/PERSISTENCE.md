# Persistence and Privacy Inventory

Last reviewed: 2026-08-16

IT Tools is a client-only application, but browser storage is still durable and
shared by every user of the same origin/profile. Tool input is therefore treated
as potentially sensitive even when a typical example looks harmless.

## Current policy

- UI and formatting settings may be persisted immediately.
- Tool content is session-only by default.
- Secrets, credentials, uploaded files, private keys, OTP seeds, generated
  tokens, and cryptographic plaintext are never persisted by default.
- Text Diff is the only content-persistence exception. It is default-off,
  explicitly enabled by the user, versioned, debounced, bounded to 256 KiB per
  side, clearable, and resilient to corrupt/quota-denied storage.
- Regex accepts a pattern from an explicitly supplied incoming `?regex=` URL,
  but editor changes are never written back to URL/history or `localStorage`.
- Home search/category filters use harmless URL-only `q` and `category` state.
  Search is limited to 80 characters, category must match the registry, repeated
  or unknown values and unrelated keys are canonicalized away, and no tool
  content is represented or persisted.
- Analytics custom events and automatic pageviews receive path-only URLs;
  referrers are stripped of credentials, query parameters, and fragments before
  leaving the browser.

## Persisted values

| Class | Keys | Reason |
|---|---|---|
| UI settings | `locale`, `vueuse-color-scheme`, `isMenuCollapsed`, `menu-tool-option:collapsed-categories`, `favoriteToolsName` | Language/theme/layout/favorites only; `isMenuCollapsed` is the desktop preference, while mobile open/closed state is transient |
| Formatter settings | JSON/YAML indent and sort keys; XML indent and collapse-content keys | Small harmless presentation preferences |
| Tool settings | Base64 URL-safe toggles, List Converter config, Benchmark unit | Transformation configuration, not source content |
| Generator settings | UUID version/quantity, ULID amount/format, MAC amount/separator, ASCII font/width, Token length/quantity/category switches under `token-generator:v1:*` | Format/count/presentation only; generated values, custom alphabets, and denied characters are not stored |
| Text Diff consent | `it-tools:v1:preferences:text-diff:persist` | Explicit default-off preference |
| Opt-in content | `it-tools:v1:content:text-diff` | Versioned and bounded content envelope |

## Session-only content and legacy migration

Startup calls `clearLegacySensitiveContentStorage()` before mounting the app.
It removes the following keys while tolerating denied storage access and
per-key mutation failures:

- `json-prettify:raw-json`
- `yaml-prettify:raw-yaml`
- `json-diff:raw-left-json`
- `json-diff:raw-right-json`
- `html-wysiwyg-editor--html`
- `benchmark-builder:suites`
- `case-converter:input`
- `regex-tester:regex`
- `ipv4-converter:ip`
- `ipv4-range-expander:startAddress`
- `ipv4-range-expander:endAddress`
- `ipv4-subnet-calculator:ip`
- `mac-address-generator-prefix`

The corresponding current inputs use in-memory Vue refs. The former generic
`useQueryParamOrStorage` helper was removed because no caller remained and its
implicit durable-content behavior conflicts with the default policy.

Text Diff separately recognizes and explicitly clears its pre-v1
`text-diff:original` and `text-diff:modified` keys.

NanoID settings and generated identifiers are also session-only. The tool uses
in-memory refs, never places its alphabet or output in URL/history, and exposes
copy/download only as explicit user actions; it adds no managed storage key or
network request.

File Hash likewise adds no managed storage key. Its selected `File`, filename,
and bytes are held only by route-local application references, never included in
requests/URLs/analytics, and released by the application on clear/unmount. Only
lowercase digests are copyable. This does not claim browser GC timing or physical
memory zeroization.

The DevOps `.env`, RFC 6902 JSON Patch, and HMAC workflows add no managed
storage keys. Source/target configuration, selected paths/prefixes, message,
decoded HMAC key bytes, and generated output live only in route/worker memory.
Token Generator persists only its bounded length, quantity, and four category
switches. Generated tokens, custom alphabets, and denied-character lists remain
session-only and are excluded from URL/history, storage, analytics, and worker
error messages.

Argon2id Hash & Verify adds no managed storage key. Passwords, supplied PHC
strings, generated salts, and results live only in route/worker memory and are
excluded from URL/history, browser storage, analytics, request URLs/bodies, and
error text. Every operation owns a disposable worker that is physically
terminated after success, failure, cancellation, replacement, timeout, or route
disposal, releasing its WASM memory. Clearing and unmounting drop application
references, but JavaScript cannot promise immediate garbage collection or
physical zeroization of every temporary engine copy; the route states this
limitation and does not claim to be a password database or storage policy.

Markdown Diff adds no managed storage key. Original/modified Markdown, the
source report, and preview snapshots remain in route/worker memory only and are
excluded from URL/history, local/session storage, analytics, request URL/body
data, logs, and worker errors. Preview uses only the last successful bounded
snapshot, renders at most 64 KiB per side, disables raw HTML, active links, and
images before rendering, and then applies a static DOMPurify allow-list. Clear
and unmount remove application references; no browser-engine zeroization claim
is made.

DNS-over-HTTPS Query adds no managed storage key. DNS names, types, response
bytes, and reports remain in route memory and are excluded from URL/history,
local/session storage, analytics, and application logs. Only an explicit Query
action sends the name/type inside one RFC 8484 binary POST body to the selected
fixed Cloudflare endpoint; resolver and type choices are not persisted. The
client omits credentials/referrer, rejects redirects and unexpected media,
bounds streamed response bytes, and aborts on replacement, timeout, Cancel,
Clear, or unmount. The browser and resolver can still observe ordinary network
transport, and the resolver sees the DNS name/type and client IP; the route does
not claim local-only processing, anonymity, or ODoH.

Mermaid Diagram Renderer/Exporter adds no managed storage key. Diagram source,
sanitized SVG, and PNG export state remain in route memory only and are
excluded from URL/history, local/session storage, analytics, application logs,
and network request data. Rendering starts only after an explicit action;
source policy rejects active content and external resources before Mermaid is
loaded, and the result is independently sanitized and bounded before entering
a scriptless, network-denying sandboxed iframe. SVG and PNG downloads use
short-lived Blob URLs that are revoked deterministically. Cancel, edits, Clear,
replacement, and unmount invalidate late results, although Mermaid's
synchronous DOM phase cannot be physically interrupted and JavaScript cannot
promise immediate zeroization of temporary engine copies.

Parquet Reader adds no managed storage key. The selected local file, filename,
parsed metadata, selected columns, bounded page, and derived JSON/CSV exist only
in component/worker memory. The worker receives the `File` directly, reads
bounded Blob slices, and is terminated after success, error, cancellation,
replacement, timeout, Clear, or unmount. No file-derived value enters route
query/hash, Web Storage, IndexedDB, Cache Storage, analytics, application logs,
or network requests; reload clears the session. The displayed filename is
rendered as text in `<bdi>`. Copy/download are explicit and cover only the last
bounded selected page; object URLs are revoked immediately after use.

XLSX Spreadsheet Reader adds no managed storage key. The selected local file,
filename, validated package/workbook metadata, selected worksheet page, and
derived JSON/CSV remain only in component/worker memory. Inspect and Preview
use separate disposable workers and bounded `Blob.slice()` reads; success,
failure, cancellation, replacement, timeout, Clear, and unmount terminate the
worker and drop application references. External relationships are counted but
never fetched. No file-derived value enters URL/history, Web Storage, IndexedDB,
Cache Storage, analytics, application logs, or request URL/body data. Reload
clears the session, displayed filenames use text plus `<bdi>`, and downloads use
short-lived object URLs through the shared cleanup contract.

## Verification

- Final integrated unit checkpoint: 1417/1417 tests across 245 files passed;
  the focused storage/cleanup suite remains covered by the full run.
- Chromium persistence flows: 2/2 passed across legacy cleanup and edits to all
  migrated tools.
- Application/test and Vite-config type checking passed.
- The global managed-storage reset and About control pass 4/4 focused tests;
  unrelated same-origin keys are preserved and denied removals are reported.
- Regex incoming-query/session-only behavior passes 2/2 component checks, and
  analytics URL/referrer sanitization passes 3/3 focused plugin checks.
- NanoID's production Chromium flow verifies exact clipboard and downloaded
  output, no generated ID/custom alphabet in URL or request URL/body, no matching
  `localStorage` value, and explicit clearing.
- File Hash production Chromium verifies no filename/content marker in URL,
  storage, or request URL/body, exact digest-only clipboard output, reload reset,
  and a second hash from demand-cached route/worker assets while offline.
- Token Generator Chromium verifies tampered preference clamping, bounded batch
  generation, and absence of generated/custom/denied content from managed
  storage. The integrated DevOps/JSON/crypto-authoring flow passes 8/8 targeted
  source-dev scenarios.
- Home filtering/reordering passes deterministic deep-link, back/forward,
  query-canonicalization, keyboard order, and harmless favorite-storage checks
  in the 5/5 current targeted source-dev suite.
- Argon2id source-dev Chromium verifies hash-to-PHC, correct and wrong-password
  verification, cancel/worker termination, and that a unique password is absent
  from URL, local/session storage, and request URL/body data.
- Markdown Diff source-dev Chromium verifies line comparison, inert sanitized
  previews, no input marker in URL/storage/request data, and physical worker
  termination on Cancel.
- DNS-over-HTTPS source-dev Chromium verifies no request before the explicit
  action, a marker only in the fixed-endpoint binary POST body, inert response
  handling, storage/URL/console exclusion, and cancellation. A live Orca run
  confirmed the Cloudflare wire request and full-width vertical desktop layout;
  that DNS-specific evidence remains valid.
- Mermaid source-dev Chromium passes 2/2 scenarios across all five supported
  diagram families, stale/cancel handling, inert sandboxed output, SVG/PNG
  exports, and unique-marker exclusion from URL, storage, requests, and console.
  The fresh source-dev registry traversal covers all 127 routes.
- Parquet source-dev Chromium passes 2/2 scenarios for official local Snappy
  inspection/preview, bounded copy/download, deterministic cancel/restart/Clear,
  vertical layout, and privacy. A unique fixture marker never appears in URL,
  storage, requests, console output, or after reload. The fresh source-dev
  registry traversal now covers all 128 routes.
- XLSX source-dev Chromium passes 2/2 scenarios for bounded DEFLATE workbook
  inspection/preview, exact large scalar lexemes, cached-formula disclosure,
  formula-protected copy/download, cancel/restart/Clear, vertical desktop layout,
  and privacy. A unique filename marker is absent from URL, storage, request
  URL/body data, console output, exports, and the reloaded page. The verified
  fresh source-dev registry traversal covers all 129 routes.

## Remaining work

- If another tool needs content persistence, design it as an explicit opt-in
  feature. Large state should use a bounded asynchronous IndexedDB store rather
  than synchronous writes on input.
- Add a common storage-denial boundary for persisted settings; the current
  cleanup and Text Diff paths are guarded, while third-party `useStorage`
  preference calls still rely on library behavior.
