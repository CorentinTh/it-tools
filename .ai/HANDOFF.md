# Cross-machine AI Handoff

Last transfer review: 2026-08-16 (Europe/Moscow)

This file is the first recovery checkpoint for a new AI session. It records
portable repository state, not hidden conversation memory or machine caches.
After reading it, use `.ai/PROGRESS.md` for current results/risks/next gates and
`.ai/TODO.md` for the approved roadmap.

## Latest completed product goal — 2026-08-16

XLSX Reader is implementation-complete as one lazy local Data route. Exact MIT
`saxen@11.1.1`, native raw-DEFLATE, and repository-owned ZIP central-directory
and OPC readers are imported only by a disposable route-owned worker after an
explicit Inspect action. The route exposes macro-free workbook/sheet metadata,
one selected 200-row/32-column page, exact stored scalar lexemes, cached-formula
disclosure, and conservative JSON/CSV copy/download of that bounded page.

The contract caps the file at 32 MiB, central directory at 2 MiB, entries at
512, entry names at 512 B, sheets at 128, one worksheet at 16 MiB, required
inflated aggregate at 32 MiB, shared-string XML at 8 MiB and 200,000 values,
cells/formulas at 4 KiB, rendered preview at 512 KiB, each JSON/CSV export at
1 MiB, and worker time at 15 seconds. ZIP64, encryption, unsafe/duplicate/
overlapping paths, inconsistent local metadata, CRC failures, macros, external
fetches, DTD/entities/extra processing instructions, non-UTF-8 XML, styles/date
interpretation, and whole-workbook export are rejected or deliberately outside
scope. Formulas are never executed and CSV formula prefixes are protected.
Success, error, Cancel, replacement, timeout, Clear, and unmount terminate the
worker.

File bytes, filename, metadata, preview, and exports remain session-only and do
not enter URL/history, storage, network, analytics, or application logs. Final
gates pass: zero-warning lint, dual typecheck, 1417/1417 unit tests across 245
files, a 24,163-module production build, 404/404 artifact checks, 2/2 source-dev
privacy/lifecycle/layout scenarios, and all 129 routes in 5.2 minutes. Artifact
is 642 files / 18,151,938 B raw / 5,303,777 B gzip; shell is
844,594/247,458 B; mandatory Workbox is 9 files / 898,442/297,820 B with
101,558 B raw headroom. The full route is 135,961/47,458 B and its worker is
29,240/10,717 B. Exact `saxen` has zero audit paths; 57 unrelated
severity-counted production findings remain in the deferred security track.
General spreadsheet/ZIP engines and upstream implementation code were not used.
The decision and official sources are recorded in
`.ai/experiments/XLSX_READER_DESIGN.md`.

## Previous completed product goal — 2026-08-16

Parquet Reader is implementation-complete as one lazy local Data route. Exact
dependency-free MIT `hyparquet@1.28.2` is imported only by a disposable
route-owned worker after an explicit Inspect action. The worker validates
PAR1/footer/schema/row-group/column metadata and offset ranges, exposes schema
and row-group metadata, and reads only the selected bounded page from the local
`File` through Blob-backed slices.

The contract independently caps the file at 64 MiB, footer at 2 MiB, schema at
512 nodes/depth 16, top-level columns at 128, selected columns at 16, row groups
at 512, preview at 200 rows, selected column chunk at 16 MiB, aggregate selected
chunks at 32 MiB, one tracked slice at 16 MiB, cumulative reads at 48 MiB, one
cell at 4 KiB, rendered preview at 512 KiB, each JSON/CSV export at 1 MiB, and
worker time at 15 seconds. Success, failure, Cancel, replacement, timeout,
Clear, and unmount terminate the worker. The first release decodes
UNCOMPRESSED and SNAPPY only; unsupported codecs stay visible in metadata,
while encrypted or external layouts are rejected. Big integers, timestamps,
binary values, non-finite numbers, and CSV formula prefixes are represented
conservatively. Copy/download cover only the last bounded selected page.

File bytes, filename, metadata, preview, and exports remain session-only and do
not enter URL/history, storage, network, analytics, or application logs.
`parquet-wasm`/Arrow, DuckDB-Wasm, optional compressor bundles, whole-file
export, XLSX, and schema rewriting are excluded. Final gates pass:
zero-warning lint, dual typecheck, 1408/1408 unit tests across 242 files, a
24,156-module production build, 400/400 artifact checks, 2/2 source-dev
privacy/lifecycle/layout scenarios, and all 128 routes in 4.3 minutes. Artifact
is 639 files / 18,100,903 B raw / 5,285,852 B gzip; shell is
842,926/247,222 B; mandatory Workbox is 9 files / 896,774/297,584 B with
103,226 B raw headroom. The full route is 183,372/61,028 B and its worker is
65,630/20,682 B. The target dependency audit is clean. Official Parquet and
hyparquet documentation plus PR #1529 supplied requirements only; no upstream
implementation code was copied.

## Earlier completed product goal — 2026-08-16

Mermaid Diagram Renderer/Exporter is implementation-complete as one lazy local
Development route. It accepts only Flowchart, Sequence, Class, State, and ER
source under a 32 KiB/2,000-line policy. Exact patched `mermaid@10.9.8` loads
only after Render with fixed strict/deterministic configuration; frontmatter,
init directives, HTML, click/link/style directives, URLs, legacy Graph and all
other diagram families are rejected before the dependency is loaded.

Rendered SVG is passed through pinned DOMPurify and independent tag, attribute,
CSS, URL, element-count, byte, and viewBox checks before entering a scriptless
network-denying sandboxed iframe. Copy/Download SVG and allocation-bounded PNG
use only that sanitized result. Source/output are session-only; object URLs are
revoked; Cancel, edits, Clear, and unmount invalidate late results. The UI
explicitly states that Mermaid's DOM-bound synchronous phase cannot be
physically interrupted. Audit rejected vulnerable `10.9.6`; exact `10.9.8`
plus patched shared `lodash`/`lodash-es@4.18.1` have zero target advisories.

Final gates pass: zero-warning lint, dual typecheck, 1399/1399 unit tests across
240 files, a 24,149-module production build, 396/396 artifact checks, 2/2
source-dev render/export/privacy/layout scenarios, and all 127 routes in 4.4
minutes. Artifact is 636 files / 18,011,920 B raw / 5,257,890 B gzip; shell is
841,236/246,993 B; mandatory Workbox is 9 files / 895,084/297,355 B with
104,916 B raw headroom. The route adds 44,906/18,043 B before action and the
renderer adds 278,266/78,124 B. Official usage/config/security documentation
and PR #1563 supplied requirements only; no upstream implementation code was
copied. Orca 1.4.177 exited after reporting ready, so the deterministic fresh
source-dev Chromium fallback supplied the live UI evidence.

## Earlier completed product goal — 2026-08-16

DNS-over-HTTPS Query is implementation-complete as one lazy Network route and
one deliberate, prominently disclosed network exception. It sends no request
while typing. Pressing Query sends one RFC 8484 `application/dns-message`
binary POST to a fixed allow-list containing Cloudflare standard and malware-
blocking modes; Google and Quad9 were not exposed because live browser
preflight did not satisfy the required binary-POST CORS contract.

The dependency-free wire encoder/parser supports A, AAAA, CNAME, MX, TXT, NS,
SOA, PTR, SRV, and CAA. It enforces canonical names and IDN conversion, one
matching question, DNS ID/flags/opcode, backward-only bounded compression,
EDNS extended status, 65,535 response bytes, 256 records, bounded output,
content type, redirects, stream chunks, a ten-second deadline, replacement,
cancellation, Clear, and unmount. Query/result content remains memory-only and
absent from URL/history, storage, analytics, and application logs. The route
states that the resolver sees the name/type, client IP, and ordinary transport
metadata and makes no local-only, anonymity, or ODoH claim.

Final gates pass: zero-warning lint, dual typecheck, 1373/1373 unit tests across
238 files, a 23,226-module production build, 346/346 artifact checks, 1/1
controlled source-dev request/privacy/cancel scenario, a live Orca Cloudflare
wire request/layout inspection, and all 126 routes without runtime/chunk errors
or optimizer restart. The artifact is 589 files / 14,643,752 B raw /
4,229,913 B gzip; shell including document is 839,213 B / 246,351 B gzip;
mandatory Workbox is 9 files / 893,061 B / 296,713 B gzip with 106,939 B raw
headroom. The complete route closure is 26,124/11,383 B raw/gzip under a
35/15 kB ceiling. PR #1371 supplied requirements only; no upstream
implementation code was copied.

Protocol and privacy decisions were checked against [RFC 8484](https://www.rfc-editor.org/info/rfc8484/),
[Cloudflare's DoH API documentation](https://developers.cloudflare.com/1.1.1.1/encryption/dns-over-https/make-api-requests/),
and [Cloudflare's ODoH distinction](https://developers.cloudflare.com/1.1.1.1/encryption/oblivious-dns-over-https/).

## Earlier completed product goal — 2026-08-16

Markdown Diff is implementation-complete as one lazy local Text route without a
new editor, parser, or diff dependency. Deterministic line or exact word/token
source alignment runs only after an explicit action in a disposable route-owned
worker. Each side is capped at 256 KiB, with hard line, token, line-length,
alignment-cell, output, protocol, and five-second bounds. Equal peer inputs sit
side by side only as the accepted true-diff exception and stack below 900 px.

Optional previews use only the last successful bounded input snapshot. Existing
lazy `markdown-it` has raw HTML, active links, and images disabled; its output is
then restricted by a static HTML-only DOMPurify allow-list with zero permitted
attributes. DOMPurify is upgraded and exactly pinned at patched `3.4.13`.
Original/modified Markdown, reports, and previews remain memory-only and absent
from URL/history, browser storage, analytics, request URLs/bodies, logs, and
worker errors. Success, failure, cancellation, replacement, input change,
timeout, clear, and unmount physically terminate the owned worker.

Final gates pass: zero-warning lint, dual typecheck, 1363/1363 unit tests across
236 files, a 23,221-module production build, 344/344 artifact checks, 1/1
targeted source-dev comparison/sanitization/privacy/cancel scenario, and all 125
routes in 4.1 minutes without runtime/chunk errors or optimizer restart. The
artifact is 587 files / 14,624,060 B raw / 4,222,289 B gzip; shell including
document is 838,311 B / 246,134 B gzip; mandatory Workbox is 9 files /
892,159 B / 296,496 B gzip with 107,841 B raw headroom. The Markdown Diff worker
is 4,927/2,021 B raw/gzip and the full additional route closure is
168,815/71,948 B; both are independently budgeted and demand-loaded. Issue #1804
and PR #1803 supplied requirements only; no upstream implementation code was
copied.

Rendering and sanitization choices were checked against [CommonMark 0.31.2](https://spec.commonmark.org/0.31.2/),
the [markdown-it project](https://github.com/markdown-it/markdown-it), the
[DOMPurify project](https://github.com/cure53/DOMPurify), and its
[GHSA-cjmm-f4jc-qw8r advisory](https://github.com/cure53/DOMPurify/security/advisories/GHSA-cjmm-f4jc-qw8r).

## Previous completed product goal — 2026-08-16

Argon2id Hash & Verify is implementation-complete as one lazy local Crypto
route. It pins the zero-dependency `hash-wasm@4.12.0` Argon2 v1.3
implementation and imports it only inside a disposable route-owned worker.
Hash mode uses Web Crypto for a fresh 16-byte salt and defaults to RFC 9106's
memory-constrained recommendation (`m=65536` KiB, `t=3`, `p=4`, 32-byte tag).
Verify mode accepts only canonical Argon2id `v=19` PHC strings. Passwords are
bounded to 1–1,024 UTF-8 bytes; PHC, salt, tag, memory, iterations, lanes,
runtime, protocol envelopes, replacement, cancellation, and disposal all have
hard limits. The UI is vertical, explicit-action, capability-aware, and clearly
states that this is neither a password database nor a guarantee of immediate
JavaScript memory zeroization.

Every task worker is physically terminated after success, failure, cancel,
replacement, timeout, input change, clear, or unmount. Password, PHC, salt, and
result values are memory-only and excluded from URL/history, local/session
storage, analytics, request URL/body data, logs, and echoed errors. Independent
`@phc/argon2` compatibility, RFC parser transport, malformed/oversized/protocol/
lifecycle unit coverage, a source-dev hash/verify/wrong-password/privacy/cancel
flow, and the clean registry traversal pass. The default hash measured 186 ms
inside the worker and 255 ms wall-clock in source dev.

Final gates pass: zero-warning lint, dual typecheck, 1343/1343 unit tests across
231 files, a 23,134-module production build, 340/340 artifact checks, 1/1
targeted source-dev scenario, and all 124 routes in 4.0 minutes without runtime/
chunk errors, horizontal overflow, unlabelled controls, or optimizer restart.
The artifact is 583 files / 14,496,638 B raw / 4,167,585 B gzip; shell including
document is 837,262 B / 245,970 B gzip; mandatory Workbox is 9 files /
891,110 B / 296,332 B gzip with 108,890 B raw headroom. The Argon2id worker is
34,523/13,687 B raw/gzip and the full additional route closure is
130,867/47,124 B; both are independently budgeted and remain demand-loaded.
No upstream implementation code was copied.

Requirements and defaults were checked against [RFC 9106](https://www.rfc-editor.org/rfc/rfc9106.html),
the [hash-wasm project](https://github.com/Daninet/hash-wasm), the
[reference Argon2 implementation](https://github.com/P-H-C/phc-winner-argon2),
and an independent [PHC Argon2 implementation/vector](https://github.com/simonepri/phc-argon2).

## Previous completed product goal — 2026-08-16

The shell-conscious existing-route interoperability wave is implementation-
complete. Integer Base Converter now provides exact signed arbitrary-precision
bases 2–64, matching common prefixes/suffixes, case-insensitive bases <=36, and
unchanged case-sensitive bases 37–64. Seventeen prioritized structured-text and
authoring paths share one bounded download contract over already-computed
output. Home has canonical bounded `q`/`category` URL state with deep-link,
back/forward, status, no-result, and keyboard favorite-reorder coverage. Native
drag/drop replaces `vuedraggable`; the removed dependency and `sortablejs`
transitive reduce shell and mandatory Workbox by 107,897 B raw / 38,855 B gzip.

Local gates pass: lint, dual typecheck, 1325/1325 unit tests across 227 files,
a 23,128-module production build, 336/336 artifact checks, and 5/5 targeted
source-dev scenarios. The artifact is 581 files / 14,446,094 B raw /
4,148,514 B gzip; shell including document is 836,095 B / 245,802 B gzip and
mandatory Workbox is 9 files / 889,943 B / 296,164 B gzip, leaving 110,057 B
raw headroom. The targeted source-dev suite passes 5/5 and the fresh sequential
all-123-route source-dev smoke passes in 4.1 minutes without runtime/chunk
errors or optimizer restart. No runtime dependency or upstream code was added.

## Previous completed product goal — 2026-08-16

The DevOps/JSON/crypto-authoring wave is complete. DevOps Configuration now
extracts deterministic POSIX-shell-safe assignments from an exact JSON/YAML/
TOML subtree with JSON Pointer/prefix validation, collision diagnostics, and no
execution or variable expansion. JSON Schema & Code Generator now emits bounded
deterministic RFC 6902 `add`/`remove`/`replace` patches with RFC 6901 escaping,
positional array semantics, preserved value lexemes, and a disclosed
conservative lexical-number equality policy. HMAC now accepts explicit UTF-8,
hex byte-pair, or canonical padded Base64 keys, uses a disposable bounded
worker, and passes RFC 4231 SHA-256 fixtures. The legacy Encryption route
explicitly documents its password-based OpenSSL-compatible envelope, random
salt/derived IV, unauthenticated AES, and legacy algorithms; raw keys/caller
IVs remain deliberately unsupported there, while authenticated encryption is
the separate ITAE-v1 AES-GCM route. Token Generator now provides bounded numeric
length/batches, custom and denied Unicode code-point alphabets, unbiased Web
Crypto sampling, copy/download/clear, and only harmless versioned preferences.
Sensitive inputs and outputs remain ephemeral. No runtime dependency or
upstream implementation code was added.

Current gates pass: zero-warning lint, dual typecheck, 1291/1291 unit tests
across 225 files, a 23,132-module production build, and 336/336 artifact checks.
The build is 582 files / 14,557,612 B raw / 4,188,317 B gzip; shell including
document is 943,992 B / 284,657 B gzip and mandatory Workbox is 9 files /
997,840 B / 335,019 B gzip. DevOps, JSON Code, and HMAC workers are
146,714/40,101 B, 45,180/14,297 B, and 60,965/21,477 B raw/gzip. The targeted
and Token-regression source-dev suite passes 8/8 and the clean smoke passes all
123 routes in 3.8 minutes without optimizer restart. Mandatory PWA raw headroom
is only 2,160 B; prefer existing-route work and shell reduction before another
registry route.

Primary requirements were checked against [RFC 6902](https://www.rfc-editor.org/rfc/rfc6902.html),
[RFC 6901](https://www.rfc-editor.org/rfc/rfc6901.html),
[FIPS 198-1](https://csrc.nist.gov/pubs/fips/198-1/final),
[RFC 4231](https://www.rfc-editor.org/rfc/rfc4231.html), and
[RFC 4648](https://www.rfc-editor.org/rfc/rfc4648.html).

## Previous completed product goal — 2026-08-16

The security/search/JSON interoperability wave is complete. A new lazy Ansible
Vault & htpasswd Helper implements authenticated Ansible Vault 1.1 and labelled
1.2 AES256 encrypt/decrypt plus Apache-compatible bcrypt `$2y$` generation and
verification in a disposable bounded worker. Compatibility is covered by
Ansible Core 2.21.2-generated fixtures and Apache's documented bcrypt example;
APR1, SHA-1, Unix crypt, and plaintext htpasswd generation are deliberately
excluded. Passwords, plaintext, and vault data are ephemeral. Command Palette
now ranks exact title/keyword/normalized-path matches deterministically before
fuzzy matches and exposes the complete bounded catalog through an accessible
Show all action. JSON Repair & Query adds explicit strict escaped-JSON-string
import without silently rewriting valid JSON or numeric lexemes. No runtime
dependency or upstream implementation code was added.

Current gates pass: zero-warning lint, dual typecheck, 1278/1278 unit tests
across 222 files, a 23,117-module production build, and 334/334 artifact checks.
The build is 581 files / 14,423,193 B raw / 4,149,937 B gzip; shell including
document is 943,748 B / 284,554 B gzip and mandatory Workbox is 9 files /
997,596 B / 334,916 B gzip. The new worker is 29,852 B / 13,270 B gzip; the
targeted browser suite passes 4/4 and the clean source-dev smoke passes all 123
routes without an optimizer restart.

## Previous completed product goal — 2026-08-16

The tabular/Wi-Fi/permissions interoperability wave is complete. A new lazy
Tabular Data Import & Inspector reads pasted or local UTF-8 CSV/TSV through one
disposable bounded worker, preserves quoting/newlines/empty cells, profiles a
bounded preview, and exports normalized CSV/TSV or explicit all-text/
conservatively inferred JSON with formula-prefix protection. Wi-Fi QR exposes
WPA3/transition intent through the broadly compatible de-facto `T:WPA` payload,
shows the exact successfully encoded secret-bearing payload, and explicitly
does not claim SAE-only enforcement. Chmod now parses octal and symbolic forms,
supports setuid/setgid/sticky bits, and calculates creation-umask guidance
without executing commands or claiming ACL equivalence. No runtime dependency
or upstream implementation code was added; XLSX remains dependency/memory
gated.

Current gates pass: zero-warning lint, dual typecheck, 1268/1268 unit tests
across 219 files, a 23,110-module production build, and 330/330 artifact checks.
The build is 579 files / 14,382,350 B raw / 4,132,736 B gzip; shell including
document is 941,305 B / 283,871 B gzip and mandatory Workbox is 9 files /
995,153 B / 334,233 B gzip. The Tabular worker is 5,908 B / 2,656 B gzip; the
targeted browser suite passes 3/3 and the clean source-dev smoke passes all 122
routes.

## Previous completed product goal — JWT/HOTP, SPDX, and OKLCH, 2026-08-16

The JWT/HOTP, SPDX, and OKLCH interoperability wave is complete. The existing
JWT route now cleanly separates untrusted decode, unsigned authoring, bounded
HS256/384/512 signing, and algorithm-driven verification; OTP now includes
exact unsigned-64-bit HOTP with RFC 4226 vectors. A new lazy SPDX route exposes
an explicitly incomplete 17-license common subset pinned to SPDX License List
3.28.0 (2026-02-20), canonical links, and conservative family-level signals
under a prominent not-legal-advice warning. Color Converter adds CSS Color 4
OKLab/OKLCH conversion, sRGB gamut detection, and constant-lightness/hue chroma
mapping without claiming Local MINDE or display-profile management. Secrets,
tokens, and payloads remain ephemeral. No runtime dependency or upstream code
was added.

Current gates pass: zero-warning lint, dual typecheck, 1257/1257 unit tests
across 216 files, a 23,105-module production build, and 326/326
artifact checks. The build is 577 files / 14,359,816 B raw / 4,123,947 B gzip;
shell including document is 939,833 B / 283,608 B gzip and mandatory Workbox is
9 files / 993,681 B / 333,970 B gzip. The targeted browser suite passes 4/4
and the clean source-dev smoke passes all 121 routes.

## Previous completed product goal — storage/privacy/crypto, 2026-08-16

The bounded storage/privacy/crypto wave is complete. Three new lazy routes
provide exact RAID 0/1/5/6/10 capacity planning, lossless JPEG/PNG/WebP
metadata removal, and the versioned ITAE-v1 AES-256-GCM text/file envelope.
The RAID model uses exact BigInt fractions and distinguishes SI from IEC;
metadata cleanup copies codec/pixel payloads without decode/recompression in a
32-MiB disposable worker; AES uses Web Crypto, PBKDF2-HMAC-SHA-256 at 600,000
iterations, fresh salt/IV, an authenticated header, and encrypted file
metadata. Inputs, files, and passphrases remain ephemeral. No runtime dependency
or upstream implementation code was added.

Current gates pass: zero-warning lint, dual typecheck, 1243/1243 unit tests
across 213 files, a 23,104-module production build, 324/324 artifact checks,
all 120 registry routes in Chromium, and all 3 targeted scenarios. The build is
578 files / 14,338,885 B raw / 4,116,483 B gzip; shell including document is
938,834 B / 283,367 B gzip and mandatory Workbox is 9 files / 992,682 B /
333,729 B gzip. The AES and metadata workers measure 14,329/5,023 B and
6,447/2,589 B raw/gzip. Canonical `pnpm dev:fresh` prebundles the new
worker-transitive `js-base64`; the clean 120-route traversal completes in 3.8
minutes without optimizer reload. Port 5050 remains preview-only.

## Earlier completed product goal — Priority B local utility wave, 2026-08-16

The Priority B local utility wave is complete. Four new lazy routes provide
worker-owned List Comparison, Unicode & GSM-7 inspection, strict Date/ISO
Week/iCalendar utilities, and an HTTP Request & Code Builder with strict POSIX
cURL import. All use unified vertical layouts and local-only, ephemeral inputs.
Ordered comparison has a hard LCS ceiling; SMS results are explicitly estimates;
VEVENT output is UTC and RFC 5545 folded; HTTP/cURL only generates text, never
executes input or sends a request, and redacts recognized secrets by default.
No runtime dependency or upstream implementation code was added.

Current gates pass: zero-warning lint, dual typecheck, 1223/1223 unit tests
across 206 files, a 23,089-module production build, 314/314 artifact checks,
all 117 registry routes in Chromium, and all 5 targeted scenarios. The build is
573 files / 14,281,568 B raw / 4,096,501 B gzip; shell including document is
935,687 B / 282,899 B gzip and mandatory Workbox is 9 files / 989,535 B /
333,261 B gzip. Canonical `pnpm dev:fresh` on strict `127.0.0.1:8091` now
prebundles both worker-owned and lazy-only dependencies, including
`jsonc-parser` and Monaco; the clean 117-route traversal completes without an
optimizer reload. Port 5050 remains preview-only.

## Earlier completed product goal — 2026-08-16

The Priority A closure wave is complete. Four new lazy routes provide Local
File Inspector, JSON Schema & Code Generator, Ed25519 & SSH Key Workspace, and
QR Decoder & OTP Import; URL Encoder is now a URL Safety & Authoring Workspace.
The workflows are local, action-driven, bounded, session-only for sensitive
content, and capability-aware. Camera permission is explicit and auto-stops;
private keys and OTP secrets are never persisted; no runtime dependency or
upstream implementation code was added.

Current gates pass: lint, dual typecheck, 1160/1160 unit tests across 186 files,
a 23,019-module production build, 276/276 artifact checks, all 102 registry
routes in Chromium, and all 10 targeted scenarios against an isolated fresh
preview port. The build is 550 files / 14,120,692 B raw / 4,033,727 B gzip;
shell including document is 921,663 B / 280,428 B gzip and mandatory Workbox
is 9 files / 975,511 B / 330,790 B gzip.

## Earlier completed product goal — second Priority A wave, 2026-08-16

The second Priority A wave is complete. Four new lazy routes provide a CLI
Command Editor, DevOps Configuration Workspace, JSON Repair & safe Query, and
Certificate/CSR Inspector; the existing UUID route is now a modern identifier
workspace with UUID v6/v7, normalization, Mongo ObjectID, and exact BigInt
Snowflake inspection. Commands and configuration are never executed. DevOps,
JSON, and ASN.1 work is bounded and worker-owned; private-key PEM is rejected;
all content remains ephemeral; no runtime dependency or upstream implementation
code was added.

Current gates pass: lint, dual typecheck, 1123/1123 unit tests across 178 files,
a 22,998-module production build, 262/262 artifact checks, all 98 registry
routes in Chromium, and all 10 targeted scenarios. The current build is 541
files / 14,035,194 B raw / 4,004,069 B gzip; shell including document is
917,063 B / 279,612 B gzip and mandatory Workbox is 9 files / 970,911 B /
329,974 B gzip. The full-route run also exposed and closed an older Camera
Recorder issue: camera/microphone permission requests now occur only after the
visible user action, preventing an unhandled unsupported/denied rejection.

## Earlier completed product goal — seven-feature batch, 2026-08-16

The requested seven-feature Priority A batch is complete. Five new lazy routes
provide deterministic Faker-compatible Mock Data, exact BigInt IPv6/CIDR,
bounded Sensitive Data/HAR sanitization, IANA Timezone + Date Duration, and
local Barcode Generator/Reader workflows. The existing Docker converter now
runs Compose ↔ Run in both directions through one bounded worker, and Crontab
adds bounded Next Runs with Unix/seconds/Quartz dialects and IANA timezones.
Generated, uploaded, and sensitive content remains ephemeral; structured work
has explicit action/size/output/time limits; barcode decoding uses the native
capability only when the browser exposes it; no runtime dependency was added.

Current gates pass: lint, dual typecheck, 1094/1094 unit tests across 171 files,
22,905-module production build, 248/248 artifact checks, all 94 registry routes
in Chromium, and all 17 targeted feature scenarios. The current build is 534
files / 13,833,668 B raw / 3,936,666 B gzip; shell including document is
912,165 B / 278,540 B gzip and mandatory Workbox is 9 files / 966,013 B /
328,902 B gzip. `.ai/FEATURES.md`, `.ai/TODO.md`, `.ai/PROGRESS.md`,
`.ai/PERFORMANCE.md`, and `.ai/ARCHITECTURE.md` contain the durable details.

## Active resumed slice — 2026-08-15

The current dirty worktree is intentional and must be preserved. It contains
the completed UI-consistency/RSA implementation plus the expanded
visual-state, ordered QR, bounded WYSIWYG/JSON Diff, and bounded text-worker
slices. The
UI foundation includes shared spacing/width/focus
tokens, repaired input/select/file-upload/segmented-choice semantics, and the
accepted wide vertical transformer contract (input above output; side-by-side
only for true diff tools) across the shared 12-route transformer plus direct
JSON/YAML/SQL/Docker and text-conversion routes. UUID/ULID/NanoID share
NanoID's options -> fixed output -> actions structure and were accepted in the
Orca Vite-dev browser alongside representative transformer geometry.
The expanded form slice adds shared `c-field`, native-input-aware
`c-input-number`, labelled `c-switch`, `c-choice-group`/`c-checkbox`, and
ARIA-correct `c-slider` and keyboard-operable `c-color-picker` primitives. List Converter, Wi-Fi QR, Percentage,
Regex, File Hash, and JSON Schema cover dense/form/numeric/multi-choice/task
pilots. Token, Random Port, MAC Address, IPv6 ULA, and Lorem Ipsum have joined
the identifier family on the generator rhythm. JSON/YAML/XML formatter options
now use shared responsive controls rather than direct Naive wrappers and 100 px
fields. The broad numeric/form/catalog wave additionally covers Bcrypt, ASCII,
ETA, Integer Base, Roman Numeral, Temperature, BIP39, Benchmark Builder, Chmod,
Hash Text, Keycode, Open Graph, Date-time, IPv4, OTP, URL Parser, Case, HTML
Entities, Markdown, SafeLink, and the QR/color family. Direct Naive
checkbox/switch/color/fixed-input-group/form-item/number-input usage and
literal label widths are now zero. RSA closes the final exception with fixed
2,048/3,072/4,096-bit presets and an explicit Generate task. The route
rollout is complete: every route uses a named layout archetype, and the all-89-
route Vite-dev matrix passes desktop/light and mobile/dark overflow, form-
control naming, theme, content, and runtime/chunk checks. The first
deterministic screenshot set now contains seven states across all five core
archetypes plus true diff: loading/disabled, mobile-dark error, dense long
value/result, live-transformer error with prior output, local-file empty/
disabled/legacy guidance, aligned diff result, and mobile-dark reference
search. Semantic assertions run everywhere; pixel references target Darwin
Chromium.
The Orca embedded-browser workflow, dev/preview distinction, and scoped stale
PWA-cache recovery are recorded in `.ai/ORCA_BROWSER.md`.

RSA generation now uses Web Crypto inside a strict route-owned
terminate-and-replace worker. Cancel, replacement, a 30-second deadline, and
unmount physically terminate owned work; prior output remains visible during
pending/cancel/error and keys are never persisted. Direct `node-forge` and its
types were removed, while the transitive PDF-reader path remains. The current
additional closure is 60,832 B raw / 24,700 B gzip (previously 450,149 B /
132,813 B), including a 2,498 B / 1,151 B worker. Focused RSA 22/22,
Chromium Vite-dev 2/2, full unit 921/921, lint/typecheck/build, and 202/202
artifact budgets pass.

The following bounded reactive-computation slice is also complete:

- QR and Wi-Fi QR generation waits 150 ms after edits, accepts only the latest
  snapshot, rejects input above 4,096 UTF-8 bytes, clears incomplete Wi-Fi
  output immediately, and invalidates pending work on scope disposal;
- HTML WYSIWYG formats below 64 KiB after a 250 ms pause in a strict
  terminate-and-replace worker; larger documents require an explicit action,
  input/output are bounded at 1/2 MiB, and an eight-second timeout plus
  cancellation/stale/unmount guards apply;
- JSON Diff is an explicit route-owned worker task with 1 MiB-per-document,
  depth-128, 100,000 input/output-node, 250,000-LCS-cell, and eight-second
  bounds. It parses each JSON5 source once, aligns unique `id`/`key`/`name`
  object arrays plus primitive LCS sequences, reports positional fallback,
  lazily mounts nested branches, and renders wide results in 200-row batches;
- Math, SQL, XML, Markdown, and Text Statistics use route-local terminate-and-
  replace workers with shared debounce/explicit action/status/disposal
  behavior. SQL/XML/Markdown use 64 KiB live and 1 MiB hard input thresholds;
  Text Statistics uses 256 KiB live and 4 MiB hard input thresholds. Math uses
  the number-only `mathjs` entry, 2/8 KiB live/hard input, 64 KiB output, and a
  two-second deadline.

The structured-converter slice is complete as well. JSON-to-TOML/YAML,
YAML-to-JSON/TOML, TOML-to-JSON/YAML, and XML-to-JSON/JSON-to-XML use one shared
vertical `BoundedTextTransformer`, three parse-once source-family workers, and
one XML-family worker. They auto-run only below 64 KiB, require an explicit
action up to 1 MiB, cap output at 2 MiB, time out after eight seconds,
physically terminate replacement/cancel/unmount work, reject stale results,
and retain the previous successful result after an invalid edit. Their library
number semantics are not the strict JSON/YAML Prettify lossless-number
contract. Docker Run-to-Compose separately moves composerize, cleanup, and
message classification into a strict four-second worker with 16 KiB live,
256 KiB hard input, 512 KiB YAML, and bounded-message limits; downloads use a
Blob URL. Production Chromium fixtures cover SQL, XML Formatter, XML-to-JSON,
Markdown, Text Statistics, JSON Diff, and Docker conversion with cold-route/
result-ready timing, heartbeat, and `<50 ms` Long Task gates. SQL and the
remaining large text transformers publish a 16 KiB preview while preserving
the complete bounded result for Copy/download; SQL's executable fixture now
covers 700 KiB without raising the 1 MiB hard limit.

The current integrated checkpoint is zero-warning lint, dual typecheck,
1021/1021 unit tests across 160 files, a 22,876-module production build, 232/232
artifact checks, source-dev worker flows, and all 176 production Chromium cases
passing across isolated performance plus full functional matrices. WYSIWYG's main
route chunk is 287,982 B raw / 86,389 B gzip and its demand-loaded worker is
212,679 B / 70,280 B gzip; the accepted complete additional closure is
551,423 B / 176,574 B gzip. The shell remains below its existing ceiling.

File Hash in this slice supports SHA-256/384/512, SHA3-256, BLAKE3-256, SHA-1,
and MD5 in the same fixed-window worker pass. SHA-1/MD5 are visibly marked as
legacy. Official vectors, protocol/UI tests, production Chromium E2E 3/3, and
202/202 build-budget checks pass; the current demand-loaded worker is 25,899 B
raw / 10,417 B gzip under its documented 30/12 kB route-specific ceiling.

## Repository identity and durable checkpoint

- Repository: `git@github.com:64mb/it-tools.git`
- Working branch: `feat-ai-research`
- Last completed implementation checkpoint:
  `5f7e97aa4ee538d54c87605d8ad7c0e9f79486f5`
- On 2026-08-07, `git ls-remote origin refs/heads/feat-ai-research`
  returned that exact implementation checkpoint before this documentation-only
  handoff update was created.
- The 2026-08-07 pre-handoff worktree was clean. The current 2026-08-15 dirty
  worktree is intentional and contains the UI-consistency/RSA plus current
  visual/reactive-computation, bounded text-worker, and structured-converter
  implementation;
  preserve it until it is reviewed and committed.
- There are no Git submodules, Git LFS objects, repository-local `.env` or
  `.npmrc` files, machine-local symlinks, or required untracked datasets. The
  `.ai` snapshots and generated OUI source artifact are ordinary tracked Git
  files.

The handoff documentation itself must be committed and pushed before changing
machines. A resumed checkout is valid when its branch contains this file and
the implementation checkpoint above is an ancestor; the branch may correctly
be newer than that checkpoint:

```sh
git merge-base --is-ancestor 5f7e97aa4ee538d54c87605d8ad7c0e9f79486f5 HEAD
```

Do not reset, rebase, or delete local work merely because the target HEAD is
different. Inspect the graph and dirty state first.

## Completed state to preserve

The latest completed cross-category slice delivered:

- local File Hash with SHA-256/384/512 in one fixed-window route-owned worker
  pass, progress/cancellation/replacement, exact-key protocols, an 8 GiB policy
  ceiling, session-only file references, safe filename rendering, and online to
  offline demand-cache reuse;
- deterministic same-file reselection and drop-state cleanup in the shared file
  upload control;
- compatible worker-transport hardening for `messageerror`, non-array legacy
  records, bounded/sanitized OUI errors, and malformed-message replacement;
- independent route/worker build budgets plus large-file, privacy, clipboard,
  lifecycle, and production Workbox evidence.

The latest measured hardening slice moved JSON-to-CSV, JSON Minify, and List
Converter into bounded workers after measurement, deleted the zero-caller
`FormatTransformer`, degraded large result previews to 16 KiB while retaining
complete Copy/download data, and moved Emoji Fuse search into its own bounded
worker. The CodeMirror spike and privacy-safe exact-coverage OUI decision are
closed documented exceptions rather than hidden open-ended migrations.

The current dirty worktree contains a completed, fully gated UI-consistency,
RSA, visual-state, QR/WYSIWYG, and JSON Diff slice. Roadmap rows marked
`IN PROGRESS` describe remaining product
milestones and are not permission to discard local changes.

The last integrated evidence, executed on 2026-07-18 and committed in the
checkpoint above, is:

- lint and both typecheck projects passed;
- 816/816 unit tests across 104 files passed;
- 16/16 build-stat infrastructure tests and 202/202 production-artifact checks
  passed;
- 4/4 OUI generation/data checks passed;
- the production build transformed 24,192 modules in 21.17 seconds;
- 102/102 sequential Chromium E2E tests passed, including all 89 registered
  routes;
- File Hash focused tests were 107/107, with separate core/privacy, 256 MiB,
  and offline-PWA browser flows passing;
- `git diff --check` passed.

Exact metrics and the distinction between current results and historical audit
baselines live in `.ai/PROGRESS.md`, `.ai/PERFORMANCE.md`, and
`.ai/experiments/FILE_HASH_DESIGN.md`.

## Active constraints and non-claims

- Dependency/base-image vulnerability remediation and scanner policy remain an
  explicitly deferred security track. Do not start that track merely because
  historical advisory findings exist in `.ai`.
- Upstream issues and PRs are requirements/fixture research only. Do not merge,
  rebase, or cherry-pick upstream without explicit approval and a recorded
  `.ai/TODO.md` adaptation entry.
- The accepted baseline is Node `24.18.0` and pnpm `9.11.0`. The source host's
  final local measurements used Node `24.15.0` and emitted the expected engine
  warning; the exact Node baseline was also exercised through Docker. A new
  machine should use `.nvmrc`, not reproduce the old host mismatch.
- The source host had the pinned Chromium binary, but not the pinned Firefox or
  WebKit binaries. Do not claim those File Hash feature smokes passed until they
  are installed and run on the target machine.
- File Hash bounds application-owned reads to 4 MiB. Browser-managed `File`
  structured cloning does not establish physical zero-copy or memory
  zeroization, and the documentation intentionally makes neither claim.
- Preserve RSA's fixed presets, explicit action, session-only keys, previous-
  result retention, strict worker protocol, and physical worker termination;
  do not restore reactive node-forge generation.
- Envelope-first stale filtering and worker-reported output-byte metadata trust
  are explicit transport follow-ups. They are not hidden correctness claims.
- Monaco's Text Diff payload and the privacy-safe exact-coverage OUI payload are
  documented product exceptions after measured alternatives failed interaction
  or privacy parity. Emoji slower-device worker search and dev stale-cache/
  optimizer recovery now pass. PWA update-notification UX, reverse-proxy/subpath
  acceptance, and the common preference-storage denial boundary remain open as
  separate work in `PROGRESS`.

## Exact recovery procedure

Clone or update the branch, then verify its identity before installing anything:

```sh
git clone --branch feat-ai-research --single-branch git@github.com:64mb/it-tools.git
cd it-tools
git status --short --branch
git rev-parse HEAD
git merge-base --is-ancestor 5f7e97aa4ee538d54c87605d8ad7c0e9f79486f5 HEAD
```

Use the repository toolchain and reconstruct ignored artifacts locally:

```sh
nvm install
nvm use
corepack enable
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
```

On a supported Linux host, Playwright system packages may additionally require
`pnpm exec playwright install --with-deps chromium`. Install Firefox/WebKit only
when running their backlog/compatibility gates; caches from the old ARM64 macOS
host are not portable.

Run the recovery gates in dependency order:

```sh
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm test:build-stats
pnpm test:oui-data
pnpm build
pnpm build:stats:check
pnpm test:e2e --project=chromium --reporter=line --workers=1
git diff --check
```

`node_modules/`, `dist/`, pnpm stores, Playwright caches, test reports, editor
state, and SSH credentials are intentionally not portable. Recreate them; do
not add them to Git.

For an optional offline backup independent of GitHub, create and verify a Git
bundle on the source machine after committing the handoff:

```sh
git bundle create it-tools-handoff.bundle --all
git bundle verify it-tools-handoff.bundle
```

Keep that bundle outside the repository.

## Resume priority

Continue from `.ai/PROGRESS.md` → `Next acceptance gates`, not from the oldest
unchecked or historical finding. The next autonomous slice should:

1. preserve the seven representative screenshot baselines and expand states by
   archetype rather than snapshotting every route indiscriminately;
2. preserve the accepted QR/Wi-Fi ordering, WYSIWYG worker, JSON Diff
   one-pass/progressive rendering, structured converters, and RSA lifecycle
   regressions;
3. preserve the completed JSON-to-CSV/JSON Minify/List Converter worker bounds,
   SQL preview/full-download contract, and zero-`FormatTransformer` ratchet;
4. preserve Markdown Diff's bounded source-worker, inert-preview, ephemeral-data,
   exact-DOMPurify-pin, and route/worker budget contracts;
5. preserve DNS-over-HTTPS's fixed allow-list, explicit binary POST, strict
   wire/response/lifecycle bounds, and resolver-observability disclosure;
6. preserve Mermaid's restricted syntax, fixed strict configuration, exact
   patched pins, sanitizer/sandbox, ephemeral SVG/PNG lifecycle, target-audit,
   demand-load, and synchronous-DOM-residual contracts;
7. preserve Parquet Reader's exact dependency pin, local Blob-backed selected
   reads, disposable-worker lifecycle, strict metadata/chunk/page/output/time/
   memory bounds, UNCOMPRESSED/SNAPPY scope, selected-page-only export, privacy,
   and independent route/worker budgets;
8. preserve XLSX Reader's exact dependency pin, repository-owned ZIP/OPC
   checks, native raw-DEFLATE boundary, disposable-worker lifecycle, strict
   ZIP/XML/page/output/time bounds, macro/external/formula exclusions,
   selected-page-only export, privacy, and independent route/worker budgets;
9. take either the generated typed tool-registry/metadata slice or the already
   scoped Emoji result-windowing/cancellable-search optimization next. No new
   catalog feature is pre-approved; refresh the product backlog before adding
   another route;
10. update `.ai/UI_CONSISTENCY.md`, `.ai/TODO.md`, and `.ai/PROGRESS.md` as work
    starts and completes.

Do not weaken existing gates, overstate losslessness/zero-copy/cross-browser
coverage, or silently expand the deferred CVE/base-image scope.

For source-dev browser acceptance, start `pnpm dev:fresh` and run Playwright
only through `pnpm test:e2e:dev ...`. Bare `pnpm exec playwright test ...`
uses the preview configuration on port 5050 and can therefore validate an old
production artifact instead of current source. Source dev is strict port 8091;
preview remains strict port 5050.

## Copy-paste prompt for the next AI session

```text
Read AGENTS.md and .ai/HANDOFF.md completely, then read the current-status,
active-risk, and next-gate sections of .ai/PROGRESS.md plus .ai/TODO.md and
.ai/UI_CONSISTENCY.md. Verify
the branch, HEAD ancestry, and dirty state before editing. Continue the highest
priority approved non-security slice autonomously, preserve the local fork as
source of truth, run proportional regression/browser/build gates, and update
the .ai progress/checklists continuously. Do not begin the deferred
dependency/base-image CVE track and do not import upstream code without explicit
approval.
```
