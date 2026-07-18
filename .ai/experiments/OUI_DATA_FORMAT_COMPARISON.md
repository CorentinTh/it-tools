# OUI Data Format and Privacy Comparison

Date: 2026-07-18

Status: **format decision and production acceptance complete; `<250 kB` product target remains open**.

## Decision

An input-selected bucket design was built and measured first: 34,503 records
became 112 local chunks, and the worst route-plus-bucket request was about
66.9 kB gzip. It was rejected during integration review because chunk names
contained the selected MAC prefix. The prefix would therefore reach the
same-origin nginx access log as part of `$uri`, violating the fork's rule that
tool input must not be sent to logs by default.

The accepted design uses one compact, route-local module Worker with a single
fixed hashed URL. It is started when MAC Address Lookup mounts, independently
of the entered address. The six-hex-digit prefix crosses only the browser's
`postMessage` boundary; it is absent from HTTP URLs, storage, analytics, and
logs. Repeated lookups reuse the same worker and make no input-dependent
network request.

## Measured formats

All measurements use the lockfile-pinned `oui-data@1.0.10` source containing
34,503 prefixes and 20,255 unique exact vendor strings. Gzip values in this
format-comparison table use level 6; production schema-v4 route accounting uses
level 9.

| Format | Raw | Gzip | Decision |
|---|---:|---:|---|
| Original minified object/module | 3,411,485 B | 1,060,936 B | Baseline; fixed URL but largest payload |
| 112 prefix-selected JSON chunks | about 3.52 MB total; largest 162,655 B | largest 63,262 B | Rejected: request URI disclosed input-derived prefix |
| Vendor dictionary + numeric prefix deltas + fixed-width base36 IDs | 1,986,393 B | 775,090 B | Accepted: simplest privacy-safe compact representation |
| Base64/varint prefix deltas | 1,944,342 B | 773,964 B | Rejected: only about 1.1 kB gzip saved for a more complex decoder |
| Binary variant | 1,912,700 B | 908,146 B | Rejected: worse transfer under the current nginx MIME/compression policy |

The compact representation is deterministic:

- sorted 24-bit prefixes stored as non-negative numeric deltas;
- a three-character base36 vendor ID per record;
- a code-unit-sorted dictionary of exact vendor strings;
- schema/source version, license, source SHA-256, artifact SHA-256, counts, and
  raw bytes in generated metadata.

The generator emits one compact artifact and fails the build if it is stale or
if legacy bucket files reappear.

## Runtime measurements and residual

On the local Node 24 runner, compact JSON parsing plus index construction was
about 2.33 ms median / 2.44 ms p95; 100,000 binary-search lookups took about
8.86 ms. Browser parsing and lookup run entirely in the dedicated worker.

The accepted representation is roughly 27% smaller gzip than the original
monolith, but it cannot meet the aspirational `<250 kB gzip` lookup target:
20,255 mostly unique vendor strings alone dominate the information payload.
Meeting that target without an input-dependent request requires a new product
trade-off (for example, a reduced dataset) and must not silently weaken
privacy or vendor correctness.

The final schema-v4 production artifact records:

- worker: 1,929,822 B raw / 767,122 B gzip;
- complete additional route closure: 1,937,380 B raw / 770,453 B gzip;
- original additional route closure: 3,350,554 B raw / 1,064,267 B gzip;
- change: -42.2% raw / -27.6% gzip.

The reviewed no-regression ceiling is 1,950,000 B raw / 780,000 B gzip. It is
an explicit privacy/correctness exception, not a claim that the 250 kB product
budget has been achieved.
