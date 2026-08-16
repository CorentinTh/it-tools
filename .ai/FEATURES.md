# Feature State

The approved browser-only catalog is implemented. The generated registry
currently contains 133 lazy tools across Crypto, Converter, Web, Images and
videos, Development, Network, Math, Measurement, Text, and Data.

The catalog includes the final approved additions: local mock data, IPv6/CIDR,
two-way Docker command conversion, masking/HAR sanitization, timezone/duration,
cron schedules, barcode workflows, JWK/JWKS and asymmetric JWT verification,
OpenAPI inspection, PKCS#12/public PEM inspection, offline GeoIP, and the local
encrypted OTP vault.

The definitive inventory is generated from `src/tools/*/index.ts`; do not keep
a second hand-maintained list here. Every tool keeps its own icon and lazy route
component.

The optional single-file build contains 126 tools. Its reviewed exclusions are
Camera Recorder, DNS over HTTPS Query, Local Encrypted OTP Vault, Mermaid
Diagram, Offline GeoIP Inspector, PDF Signature Checker, and Text Diff. The
reasons are sandbox permissions/network policy, unavailable opaque-origin
storage, or the strict 10 MiB artifact budget. These tools remain present in
the normal 133-tool application.

No new feature backlog is approved. Server-dependent products, account/cloud
features, network scanning, remote GeoIP/API services, heavy OCR/PDF workspaces,
and broad converter/obfuscation expansion are outside the product boundary.
