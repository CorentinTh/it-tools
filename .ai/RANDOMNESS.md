# Randomness Inventory

Last reviewed: 2026-08-16

This inventory classifies every production randomness path in the local fork.
Security-sensitive values and durable identifiers must use Web Crypto. Visual
variation, example data, and transient DOM identifiers may use the explicitly
non-cryptographic helpers in `src/utils/random.ts`.

| Caller | Classification | Current source | Decision |
|---|---|---|---|
| Token Generator | Secret/security-sensitive | Shared `crypto.getRandomValues` rejection sampler over a deduplicated Unicode code-point alphabet | Approved; 1–512 symbols per token, batches up to 100, custom/denied alphabet bounds, tampered-preference clamping, session-only output, and `Math.random` exclusion are regression-tested |
| NanoID Generator | Identifier | Shared `crypto.getRandomValues` rejection sampler | Approved; unbiased Unicode-aware batches are bounded, generated values are session-only, and `Math.random` is regression-tested out |
| TOTP secret generation | Secret/security-sensitive | Shared Web Crypto token path | Approved; RFC alphabet and non-persistence covered |
| Argon2id salt | Secret/security-sensitive input | Route-local `crypto.getRandomValues` over exactly 16 bytes before dispatch to a disposable worker | Approved; capability failure is explicit, salt/result remain ephemeral, and deterministic unit plus source-dev privacy/hash/verify coverage applies |
| UUID v1 | Identifier | Web Crypto seed for a random multicast node and 14-bit clock sequence | Approved; `Math.random` is regression-tested out |
| UUID v4 | Identifier | `uuid` browser RNG backed by Web Crypto | Approved; no insecure caller override |
| ULID | Identifier | `ulid` browser PRNG detection, which selects Web Crypto and rejects insecure fallback | Approved for the current browser-only product |
| MAC Address Generator | Example/test data | Lodash pseudo-random bytes | Presentation-only; output is not claimed to be a credential, reservation, or hardware identity |
| Regex sample generation | Example/test data | Bounded `Math.random` inside the terminate-and-replace sample worker | Presentation-only; length/allocation/deadline guards apply |
| Lorem Ipsum | Filler text | `randFromArray` / `randIntFromInterval` | Presentation-only |
| Random Port | Development suggestion | `randIntFromInterval` | Presentation-only; the UI does not claim availability or reserve the port |
| Command Palette random tool | Navigation choice | Lodash `sample` | Presentation-only |
| `c-input-text` generated ID | Transient DOM label binding | `generateRandomId` | Presentation-only; never exposed as a security or persistence identifier |
| Shared shuffle helpers | No current production callers | `Math.random` | Retained only in the explicitly non-cryptographic helper module |

The remaining direct `Math.random` uses are therefore confined to
presentation-only helpers and bounded Regex sample generation. Any future
token, key, nonce, OTP secret, password, UUID/ULID-style identifier, or other
security-sensitive caller must use `src/utils/secure-random.ts` or a reviewed
Web Crypto-backed dependency and add deterministic tests that make
`Math.random` throw.
