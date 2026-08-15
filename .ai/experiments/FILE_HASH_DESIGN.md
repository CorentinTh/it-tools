# Local File Hashing — bounded implementation design

Status: **DONE**  
Date: 2026-07-18

## Scope and provenance

Deliver one independently routed tool that computes SHA-256, SHA-384, and
SHA-512 for a user-selected local file. GitHub issue #528 and pull requests
#535/#1141 are requirements research only. No upstream component, protocol, or
test code is copied, merged, rebased, or cherry-picked.

This slice does not include CRC, file-type identification, directory hashing,
checksum manifests, password hashing, dependency remediation, or container
base-image work.

## Privacy and lifecycle contract

- The application retains its selected `File` reference for the current route
  session only. File names/bytes are never written by IT Tools to local/session
  storage, a URL, analytics, a log, a cache, or a network request; application
  references are released on clear/unmount without claiming browser GC or
  physical-memory zeroization.
- Work starts only after an explicit action. Selecting a file does not hash it.
- Cancel, replacement, clear, and route unmount terminate the owned worker.
  Stale progress/results cannot overwrite the current selection.
- The worker result contains only the selected algorithm names, lowercase
  hexadecimal digests, and file size; bounded progress carries processed/total
  byte counts and the client transport records elapsed time.

## Memory and protocol model

- The main thread sends the serializable `File` through structured clone; the
  application never calls whole-file `arrayBuffer()` or converts the file to
  text/base64. `File` is not Transferable, so browser-level physical zero-copy
  is not claimed. The Chromium gate samples peak page heap and aggregate browser
  process RSS during hashing; this rejects sustained whole-file growth but does
  not assert an engine-level zero-copy guarantee.
- The worker reads sequential fixed-size `Blob.slice()` ranges and converts only
  one range at a time to an `ArrayBuffer`. This is chosen over
  `crypto.subtle.digest`, which requires the complete input, and over relying on
  implementation-defined `Blob.stream()` chunk sizes.
- Exact-pinned `@noble/hashes@2.2.0` is imported from its `sha2.js` subpath in
  the worker. It is zero-dependency, tree-shakeable, incrementally updates from
  `Uint8Array`, has an independent Cure53 audit plus a 2026 full self-audit, and
  requires no WebAssembly CSP exception. A 128 MiB local decision benchmark
  measured 320.7 MiB/s for SHA-256 and 52.7 MiB/s for all three algorithms;
  this cleared the dependency-decision threshold for the mandatory 256 MiB /
  20-second production all-algorithm gate. `hash-wasm@4.12.0`
  measured faster (481.5/199.2 MiB/s) but was rejected because its WebAssembly
  CSP expansion is unnecessary at the measured workload. Existing CryptoJS
  would require an extra byte-to-`WordArray` packing copy and is retained only
  for the legacy text route.

  Benchmark method: Node 24.15.0 on a Darwin/arm64 host, one 4 MiB binary
  `Uint8Array` updated 32 times (128 MiB total), module initialization excluded,
  one decision run per candidate after constructing fresh hashers. Raw noble
  times were 399.2 ms for SHA-256 and 2,428.7 ms for SHA-256/384/512; hash-wasm
  times were 265.8 ms and 642.6 ms. This selects a dependency only; it does not
  replace the mandatory production Chromium 256 MiB worker measurement.
- Algorithm input is a unique allow-listed set with SHA-256 selected by default.
  Empty files are valid. Requests, progress envelopes, results, digest lengths,
  byte counters, and exact allowed key sets are decoded fail-closed.
- The locked application window is 4 MiB, the file ceiling is 8 GiB, progress
  is emitted initially, at most every 100 ms, and at completion, and the hard
  task deadline is 60 minutes. These are policy bounds rather than a promise
  that every device can hash the maximum file quickly.

## Acceptance gates

- Unit/protocol: official empty/`abc` vectors for every algorithm, multi-chunk
  equivalence, no whole-file read, maximum chunk size, empty file, request and
  response validation, monotonic bounded progress, timeout, cancellation,
  replacement, stale result, `messageerror`, disposal, and malformed worker
  envelopes.
- Shared upload regression: clearing and selecting the same local file emits a
  second selection; a completed drop clears the drag-over state.
- Browser: title/load smoke, core known-file digests, copy/clear, no request or
  persisted/URL content, reload reset, cancel/replacement, and a large-file
  responsiveness run with current-interaction Long Tasks below 50 ms.
- Build: the route remains lazy, its owned worker is included in schema-v4
  closure accounting, no emitted chunk exceeds 500 kB, and route/worker ceilings
  are added only from measured production output with explicit rationale.
- PWA: mandatory precache remains at most 10 entries, 1,000,000 raw bytes, and
  350,000 gzip bytes. The hashing worker is demand-loaded rather than installed
  eagerly, then must serve a second hash after HTTP-cache clearing and offline
  reload from the Workbox runtime cache.
- Final: zero-warning lint, dual typecheck, complete one-shot unit suite,
  sequential Chromium suite including every registered route, production build,
  build-stat tests, artifact budgets, and `git diff --check` pass on the
  integrated worktree.

## Accepted evidence

- Focused transport/tool/upload suite: 107/107; full one-shot unit suite:
  816/816 across 104 files. Production-window differential cases cover
  4 MiB - 1, 4 MiB, 4 MiB + 1, and two complete windows plus a tail.
- Sequential production Chromium: three core/privacy/copy/reselection flows,
  one PWA online-to-offline worker flow, and one 256 MiB performance/lifecycle
  flow pass. The large run measured 357 ms cold route, 9,999 ms for all three
  algorithms, 0.0 ms longest observed Long Task, +1,922,904 B peak page heap,
  +91,242,496 B peak sampled Chromium-process RSS, and +260,696 B retained page
  heap. Runtime backing-storage telemetry is unavailable in the pinned browser,
  so no browser physical zero-copy claim is made. Replacement/cancel wait for
  nonzero progress, reject late output, and leave zero active workers.
- Schema-v4 additional route closure: 56,994 B raw / 22,189 B gzip. Worker:
  13,583 B / 6,298 B against its independent 20,000/10,000 B ceiling. Initial
  shell delta: +1,676 B raw / +318 B gzip. Mandatory PWA: 9 files / 956,157 B
  raw / 327,325 B gzip. Sixteen build-stat tests and 202 artifact checks pass.
- Final integrated gates: zero-error/warning lint, dual typecheck, 24,192-module
  production build in 21.17 s, 102/102 sequential Chromium E2E including all
  89 routes, OUI generation checks, and `git diff --check`.

### 2026-08-10 algorithm extension

The same one-pass streaming contract now supports SHA-256/384/512, SHA3-256,
BLAKE3-256, SHA-1, and MD5. SHA-1 and MD5 are exposed only for compatibility
and carry visible collision warnings. Official empty/`abc` vectors cover all
seven algorithms. The measured route closure is 70,260 B raw / 26,677 B gzip;
the demand-loaded worker is 25,899 B / 10,417 B against a revised narrow
30,000/12,000 B ceiling. No implementation enters the initial shell.

## Progress checklist

- [x] Scope, provenance, privacy boundary, and memory model recorded.
- [x] Lock measured dependency, chunk/file/progress/timeout limits.
- [x] Implement worker handler, strict protocol, client, and route UI.
- [x] Repair and cover same-file reselection/drop-state correctness.
- [x] Pass focused unit/component/browser tests.
- [x] Record production route/worker/initial-shell/PWA measurements and budgets.
- [x] Pass full integrated gates and synchronize all roadmap files.
