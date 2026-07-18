# Lossless Structured Number Contract

Status: **DONE — strict JSON numeric lexemes and YAML integer values verified for Prettify scope**

Date: 2026-07-18

## Scope

This slice fixes silent integer corruption only where an explicit, testable
representation contract exists:

- strict JSON Prettify preserves every valid number token from the source,
  including integers beyond `Number.MAX_SAFE_INTEGER`, decimals, exponents,
  and negative zero;
- JSON object keys may be reordered, but number lexemes are never converted
  through JavaScript `number` during strict formatting;
- YAML Prettify parses integer scalars as `BigInt` and therefore preserves
  arbitrarily large integer values through its existing parse-once worker;
- YAML floating-point scalars remain IEEE-754 and are not advertised as
  lossless in this slice.

JSON-to-YAML/TOML/XML/CSV, JSON Diff, JSON Minify, and the remaining YAML
converters are outside this acceptance boundary. They continue to require a
destination-specific number policy before they may claim lossless behavior.

## JSON modes

### Strict lossless JSON

The default mode uses one `jsonc-parser` AST in a route-local worker. Number
nodes are emitted from their original source offsets rather than from the
rounded `node.value`. The formatter:

- accepts only strict JSON syntax;
- rejects malformed documents and duplicate object keys;
- enforces route-specific 2 MiB input, 4 MiB output, 128-level depth,
  100,000-node, and five-second limits matching the proven YAML contract;
- supports deterministic decoded-key sorting without changing value tokens.

`jsonc-parser@3.2.0` was already resolved in the lockfile and is declared as a
direct runtime dependency for this route. The final worker-aware additional
closure is 207,049 B raw / 70,049 B gzip, including a 46,309 B raw /
13,989 B gzip owned worker.

### JSON5 compatibility

The former JSON5 behavior remains available only as an explicitly selected
compatibility mode. It is not a lossless representation. Unsafe integers and
non-finite values are rejected instead of being silently rounded or serialized
to `null`; safe JSON5 values may still be normalized through the existing
parser. An incremental bounded writer enforces the 4 MiB output ceiling without
allocating a complete amplified serialization first.

## YAML integer result

`yaml@2.2.1` already supports `intAsBigInt`. Enabling it in the existing single
`parseDocument` call preserves positive and negative values beyond 64-bit
ranges, including values reached through aliases. The formatter may normalize
YAML spelling and scalar-anchor presentation; the integer value itself remains
exact. Output uses `lineWidth: 0` as a deliberate bounded-formatting choice: it
avoids serializer-created soft wrapping, so the pre-serialization byte
projection can conservatively cover every emitted scalar representation.

Before `Document.toString`, a graph projection rejects output amplification
from copied scalar aliases, two-space sequence indentation, escaped physical
lines, and spaces escaped on both sides of LF. The exact post-serialization
UTF-8 check remains defense in depth. Regression fixtures assert the serializer
is never called for those oversized cases, while a 1 MiB scalar and a 90,000
item flat document remain accepted.

## Verified evidence

- 64/64 JSON/YAML model, component, protocol, client, and pure worker-handler
  checks pass;
- boundaries around `Number.MAX_SAFE_INTEGER`, unsigned 64-bit maximum, large
  negative integers, high-precision decimals, exponent notation, and `-0`;
- Unicode strings/keys, sorted and unsorted nested structures, empty input,
  duplicate keys, and malformed syntax;
- JSON5 safe compatibility plus explicit unsafe/non-finite rejection;
- worker protocol, cancellation, timeout, stale-result, crash, disposal, exact
  worker-side UTF-8 accounting, and O(1) main-thread preflight;
- final production Chromium 1 MiB fixtures: JSON is 404 ms cold-route /
  197 ms format-ready and YAML is 203 ms format-ready; both record 0.0 ms as
  the longest Long Task and keep a live heartbeat;
- the YAML Long Task fixture also passes 10/10 sequential repeats after garbage
  from previously discarded Chromium contexts is collected before (never
  inside) the measurement window;
- shared output renders only a UTF-8-safe 100,000-byte readonly preview while
  JSON's browser fixture verifies Copy still receives the complete 1 MiB result;
- final YAML additional closure is 259,621 B raw / 86,784 B gzip, including a
  99,735 B raw / 31,033 B gzip owned worker;
- no upstream code merge, rebase, or cherry-pick occurred.
