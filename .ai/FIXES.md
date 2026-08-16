# Resolved Engineering State

The approved correctness, security, delivery, persistence, and performance
work is complete as of 2026-08-16.

- Production dependency audit has no known advisory in the approved graph.
- Crypto, YAML, i18n, Ajv, forge/PKI, nginx, and container concerns were fixed or
  replaced with bounded browser-local implementations and executable gates.
- Registry generation keeps routes lazy and preserves each tool's individual
  icon; category-wide icon substitution is explicitly a regression.
- Large transforms and sensitive operations have bounded worker lifecycles.
- Root, subpath, reverse-proxy, security-header, PWA, Firefox, WebKit, Chromium,
  and Long Task coverage exists in the repository.
- Storage migrations, quota failure, rollback, and stale-cache cleanup are
  tested; sensitive content is not persisted by default.
- The DataLens standalone sandbox renders explicit router-link menu items with
  unique SVG icons, never touches opaque-origin storage, and executes embedded
  worker programs without violating `worker-src 'none'`.

Do not resurrect historical upstream issue/PR dumps as a backlog. Reproduce a
new defect locally, add a failing regression test, and record only unresolved
work in `TODO.md`.
