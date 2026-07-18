# Persistence and Privacy Inventory

Last reviewed: 2026-07-18

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
- Analytics custom events and automatic pageviews receive path-only URLs;
  referrers are stripped of credentials, query parameters, and fragments before
  leaving the browser.

## Persisted values

| Class | Keys | Reason |
|---|---|---|
| UI settings | `locale`, `vueuse-color-scheme`, `isMenuCollapsed`, `menu-tool-option:collapsed-categories`, `favoriteToolsName` | Language/theme/layout/favorites only; `isMenuCollapsed` is the desktop preference, while mobile open/closed state is transient |
| Formatter settings | JSON/YAML indent and sort keys; XML indent and collapse-content keys | Small harmless presentation preferences |
| Tool settings | Base64 URL-safe toggles, List Converter config, Benchmark unit | Transformation configuration, not source content |
| Generator settings | UUID version/quantity, ULID amount/format, MAC amount/separator, ASCII font/width | Format/count/presentation only; generated values are not stored |
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

## Verification

- Final integrated unit checkpoint: 546/546 tests across 89 files passed; the
  focused storage/cleanup suite passed 15/15.
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

## Remaining work

- If another tool needs content persistence, design it as an explicit opt-in
  feature. Large state should use a bounded asynchronous IndexedDB store rather
  than synchronous writes on input.
- Add a common storage-denial boundary for persisted settings; the current
  cleanup and Text Diff paths are guarded, while third-party `useStorage`
  preference calls still rely on library behavior.
