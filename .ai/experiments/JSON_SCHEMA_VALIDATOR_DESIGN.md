# JSON Schema Validator Design

Status: **DONE — bounded local implementation accepted**

Date: 2026-07-18

## Product scope

The second locally delivered catalog feature validates one JSON instance against
one user-provided JSON Schema entirely in the browser. It supports Draft 7,
2019-09, and 2020-12 with an explicit Validate action, cancellation, structured
source-aware errors, and session-only state. Upstream issues #368 and #801 are
requirements research only; no upstream component is copied.

Remote schema loading is deliberately unsupported. Only fragment-local
references are accepted, and schema/instance/error content must not enter URLs,
storage, analytics, logs, or network requests.

## Dependency decision

Ajv 8.17.1 was already resolved in the pinned lock graph and is now promoted to
an exact direct runtime dependency. All three draft implementations remain in a
route-owned worker. The measured worker-only prototype is approximately
137,657 B raw / 40,254 B gzip.

`ajv-formats` is not added. `format` is treated as an annotation and produces a
visible warning; a schema that requires the 2020-12 format-assertion vocabulary
is rejected. Ajv compiles schemas with runtime code generation, so a future CSP
that forbids eval-like execution needs a separate validator decision. This
feature must not weaken nginx headers to add `unsafe-eval`.

## Validation contract

- schema: at most 512 KiB UTF-8, 20,000 syntax nodes, depth 64;
- instance: at most 2 MiB UTF-8, 100,000 syntax nodes, depth 128;
- worker deadline: 5 seconds; terminate and replace on cancel/timeout;
- at most 200 sanitized errors and 1,000 characters per path/message;
- `allErrors` only through 10,000 instance nodes and 20,000 projected
  schema/instance node pairs; larger or branch-amplified inputs fail fast and
  disclose that the list is incomplete;
- exact UTF-8, JSON syntax, duplicate-key, node, depth, reference, and numeric
  safety checks run before Ajv in the worker;
- unsafe integers and non-finite numeric results are rejected; decimal/exponent
  values are accepted with an IEEE-754 warning;
- no coercion, defaults, property removal, schema fetching, or async schemas;
- arbitrary keys such as `__proto__` are materialized prototype-safely.

The main thread performs only constant-time UTF-16 preflight, owns stale-job
guards, and disposes the worker on route leave. Error locations are one-based
Unicode code-point line/column positions derived from the instance syntax tree.

## Acceptance gates

- focused parser/model/protocol/worker/client/component regressions for all
  supported drafts, local/external references, bounds, cancellation, malformed
  messages, Unicode locations, mutation safety, and privacy;
- production Chromium core/privacy and 1 MiB responsiveness flows, including a
  live main-thread heartbeat and no observed Long Task at or above 50 ms;
- cold route and result-ready below 3 seconds;
- additional route closure at most 300 kB raw / 100 kB gzip;
- worker at most 200 kB raw / 60 kB gzip; no chunk over 500 kB;
- mandatory Workbox install remains at most 10 entries / 1 MB raw / 350 kB gzip.

## Related platform slice

In parallel, JSON and YAML migrate to the smallest proven shared one-shot
worker-task transport: typed envelopes, job IDs, timeout, cancellation,
stale-result protection, structured errors, and deterministic disposal. OUI
remains a persistent indexed worker and is not forced into this abstraction.
Shared parser/output/download policy continues incrementally after real consumer
evidence rather than becoming a speculative framework.

## Final evidence

- 121/121 focused validator model/protocol/handler/client/component regressions;
- 3/3 Chromium feature/privacy/1 MiB flows plus the registry-backed 88-route smoke;
- 246 ms cold route, 205 ms result-ready for 1 MiB, and 0.0 ms longest observed Long Task;
- 176,585 B raw / 53,355 B gzip additional route closure;
- 161,471 B raw / 47,125 B gzip owned worker;
- +350 B gzip shell-plus-document increment for registry/route metadata and the
  icon; Ajv remains lazy and no new chunk exceeds 500 kB;
- nine-entry Workbox install at 954,481 B raw / 327,007 B gzip;
- Ajv remains worker-local, `ajv-formats` is intentionally absent, and an
  eval-blocking future CSP is reported as validator unavailability rather than
  weakening delivery headers with `unsafe-eval`.
