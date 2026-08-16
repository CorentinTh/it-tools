# Approved Work

There is no remaining approved implementation or feature backlog as of
2026-08-16. Do not invent additional tools or revive removed upstream lists.

Future work begins only from an explicit user request or a locally reproduced
regression. Before implementation, record the narrow scope here, including any
intentional upstream adaptation that requires approval.

## Maintenance definition of done

```sh
pnpm lint
pnpm typecheck
pnpm exec vitest run --environment jsdom
pnpm build
pnpm build:stats:check
pnpm test:e2e --project=chromium --reporter=line
```

Run Firefox/WebKit, container, subpath, security, and focused performance gates
when the change touches those surfaces. Keep routes lazy, unique tool icons,
privacy defaults, worker limits/cancellation, and build budgets intact.

## Upstream adaptations

None are currently approved or pending.
