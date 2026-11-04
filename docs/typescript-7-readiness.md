# TypeScript 7 readiness

The project uses TypeScript 6.0.3. TypeScript 7 does not work with the Vue type checking and lint toolchain. This document records the evidence and the checks that show when an upgrade becomes possible.

## Findings

On 2026-11-04, these checks ran against the npm registry and a local install of `typescript` 7.0.2:

| Package | Latest version | Blocker |
|---|---|---|
| `typescript` | 7.0.2 | The package ships the native compiler only. It has no JavaScript API, such as `lib/typescript.js`. |
| `vue-tsc` | 3.3.14 | `vue-tsc` fails with `ERR_PACKAGE_PATH_NOT_EXPORTED`: `Package subpath './lib/tsc' is not defined`. |
| `@volar/typescript` | 2.4.30 | The peer range is `typescript <7`. |
| `@typescript-eslint/parser` | 8.72.1 | The peer range is `typescript >=4.8.4 <6.1.0`. |

No prerelease of these packages supported TypeScript 7:

- `vue-tsc` had no version above 3.3.14.
- The `next` tag of `@volar/typescript` pointed to 2.4.0-alpha.20, which is older than 2.4.30.
- The `rc-*` tags of `@typescript-eslint/parser` pointed to alphas of versions 3 to 8. Unverified: the peer range of the `canary` tag (8.72.2-alpha.11).

The `typescript-eslint` range also excludes TypeScript 6.1. Stay on TypeScript 6.0.x until `typescript-eslint` widens its range.

## Upgrade conditions

The project can move to TypeScript 7 when all of these conditions hold:

- A `vue-tsc` release runs with `typescript` 7.
- The `@volar/typescript` version that this `vue-tsc` release depends on accepts `typescript` 7 in its peer range.
- A `@typescript-eslint/parser` release accepts `typescript` 7 in its peer range.

Follow the `vuejs/language-tools` and `typescript-eslint/typescript-eslint` repositories for announcements.

## Check procedure

1. List the `vue-tsc` versions and dist-tags:

   ```bash
   npm view vue-tsc dist-tags versions --json
   ```

2. Show the `typescript` peer range of the latest `@volar/typescript` release:

   ```bash
   npm view @volar/typescript dist-tags peerDependencies --json
   ```

3. Show the `typescript` peer range of the latest `@typescript-eslint/parser` release:

   ```bash
   npm view @typescript-eslint/parser dist-tags peerDependencies --json
   ```

4. If all three accept TypeScript 7, install it:

   ```bash
   pnpm add -D typescript@^7
   ```

5. Run `pnpm install` and confirm that pnpm reports no peer dependency warnings.
6. Run `pnpm typecheck`.
7. Run `pnpm build`. The build runs `vue-tsc --build`.
8. Run `pnpm lint`.

The tsconfig files use no `baseUrl` and no `moduleResolution: node10`. TypeScript 7 removes both options, so the upgrade needs no tsconfig change for them.
