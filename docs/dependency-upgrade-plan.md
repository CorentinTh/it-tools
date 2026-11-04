# Major dependency upgrade plan

This plan covers the dependency upgrades that need a major version change. It also covers the runtime, the package manager, the CI actions, and the remaining updates within a major version. [#2](https://github.com/destan/toolbox/pull/2) updated only the vulnerable dependencies within their major versions.

On 2026-11-04, every target version in this plan matched the `latest` dist-tag in the npm registry. Every "From" version matched `pnpm-lock.yaml` on `main`.

## Starting point

On 2026-11-04, `pnpm audit` on `main` at `5b069d5` reported these advisories:

| Severity | Count |
|---|---|
| Critical | 6 |
| High | 90 |
| Moderate | 63 |
| Low | 17 |

The audit reaches most advisories through build, test, and lint tooling. The table lists the largest sources by top-level package. One advisory counts once for each top-level package that pulls it in, so the rows overlap.

| Top-level package | Critical | High | Main vulnerable packages |
|---|---|---|---|
| `vitest` | 4 | 14 | `form-data`, `get-func-name`, `esbuild`, `rollup` |
| `@vitejs/plugin-vue-jsx` | 1 | 13 | `@babel/traverse`, `@babel/helpers` |
| `jsdom` | 1 | 3 | `form-data`, `tough-cookie`, `ws` |
| `vite-plugin-pwa` | 0 | 42 | `@babel/*`, `ajv`, `braces` |
| `hygen` | 0 | 21 | `ejs`, `minimatch`, `cross-spawn` |
| `vite-plugin-vue-markdown` | 0 | 18 | `markdown-it`, `esbuild`, `rollup` |
| `unplugin-vue-components` | 0 | 18 | `micromatch`, `picomatch`, `postcss` |
| `vue` and every Vue library | 0 | 7 | `@vue/server-renderer`, `postcss`, `nanoid` |

## Constraints

### Node version

`.nvmrc` pins Node 22. The Cloudflare build installed Node 22.23.4. The [Node.js release schedule](https://github.com/nodejs/Release/blob/main/schedule.json) lists these dates:

| Release line | Status on 2026-11-04 | End of life |
|---|---|---|
| Node 22 | Maintenance since 2025-10-21 | 2027-04-30 |
| Node 24 | Maintenance since 2026-10-20 | 2028-04-30 |
| Node 26 | Active LTS since 2026-10-28 | 2029-04-30 |

Phase 0 moves the project to Node 26. These target versions declare a Node requirement:

| Package | Node requirement |
|---|---|
| `vitest` 5 | `^22.12.0 \|\| ^24.0.0 \|\| >=26.0.0` |
| `jsdom` 30 | `^22.22.2 \|\| ^24.15.0 \|\| >=26.0.0` |
| `@intlify/unplugin-vue-i18n` 11 | `>= 22.13` |
| `eslint` 10 | `^20.19.0 \|\| ^22.13.0 \|\| >=24` |
| `@vueuse/core` 15 | `>=22` |
| `vue-i18n` 11 | `>= 22` |
| `unplugin-vue-markdown` 32 | `>=22` |

Node 26.13.0 satisfies all of them.

The Node 26 distribution does not include corepack. The `node-v26.13.0-linux-x64` tarball has no `corepack` binary. The `node-v24.22.2` tarball has one. All four workflows run `corepack enable`, so phase 0 replaces that step.

### Peer dependency order

The peer ranges fix the order of the phases:

- `pinia` 4, `@vueuse/core` 15, and `@unhead/vue` 3 require Vue 3.5. `vue-router` 5 requires Vue 3.5.34 or later. Phase 1 upgrades Vue first.
- `vitest` 5 and `@intlify/unplugin-vue-i18n` 11 require Vite 6 or later. `vite-plugin-vue-markdown` accepts only Vite 4 or earlier. Phase 2 moves these packages together.
- `vite-plugin-pwa` 2 requires `workbox-window` 7.4.1 or later. Phase 2 updates both packages.
- `vitest` 5 declares the optional peer `@types/node` `^22.0.0 || >=24.0.0`. `vite` 8 declares `^20.19.0 || >=22.12.0`. Phase 2 updates `@types/node`.
- `vue-router` 5 declares the optional peers `vite` 7.3 or later and `pinia` 3.0.4 or later. pnpm warns when an optional peer is installed outside its range. Phase 5 runs after phase 2.
- `pinia` 4 declares the optional peer `typescript` 5.6 or later. Phase 4 runs before phase 5.

## Phases

Each phase is one pull request. Each pull request runs the full verification procedure before it merges.

| Phase | Scope | Risk | Expected audit effect |
|---|---|---|---|
| 0 | Runtime, package manager, and CI actions | Medium | None |
| 1 | Updates within major versions, including Vue core | Low | Removes the advisories that every Vue library pulls in |
| 2 | Build and test toolchain | High | Removes all 6 critical advisories |
| 3 | Lint toolchain | Medium | Removes the ESLint advisories |
| 4 | Type checking toolchain | Medium | Removes the `vue-tsc` advisories |
| 5 | Vue ecosystem libraries | High | Removes the `vue-i18n` and `@vueuse/head` advisories |
| 6 | Application libraries with advisories | Medium | Removes `@tiptap`, `uuid`, `zx`, and `hygen` advisories |
| 7 | Remaining major versions without advisories | Low to medium | None |

The expected audit effects are estimates from the audit paths. Unverified: the exact counts after each phase. The `pnpm audit` step in each phase records them.

### Phase 0: Runtime, package manager, and CI actions

1. Change `.nvmrc` from `22` to `26`.
2. Change `node-version` from `22` to `26` in `ci.yml`, `e2e-tests.yml`, `docker-nightly-release.yml`, and `releases.yml`.
3. Change `packageManager` in `package.json` from `pnpm@9.11.0` to `pnpm@9.15.9`.
4. Replace `run: corepack enable` with `uses: pnpm/action-setup@v6.1.1` in the four workflows.
5. Place the `pnpm/action-setup` step before `actions/setup-node`. The `cache: 'pnpm'` option of `actions/setup-node` needs `pnpm` on the path.
6. In `Dockerfile`, change `node:lts-alpine` to `node:26-alpine`.
7. In `Dockerfile`, change `npm install -g pnpm` to `npm install -g pnpm@9.15.9`.
8. Update the GitHub Actions in the table below.
9. In the Workers Builds settings, set `SKIP_DEPENDENCY_INSTALL` to `true`. Set the build command to `npm install -g pnpm@9.15.9 && pnpm install --frozen-lockfile && pnpm build`.

`pnpm/action-setup` reads the pnpm version from `packageManager` when the workflow omits the `version` input. Its v6.1.1 README documents this behavior.

On 2026-11-04, the npm `latest` dist-tag of pnpm was 12.16.1. The unpinned `npm install -g pnpm` in `Dockerfile` installs the `latest` dist-tag, not the `packageManager` version.

| Action | From | To |
|---|---|---|
| `actions/checkout` | SHA `3df4ab11…` with the comment `# v4` | v7.0.1 |
| `actions/setup-node` | v3 | v7.1.0 |
| `actions/cache` | v3 | v6.1.0 |
| `docker/login-action` | v3 | v4.7.0 |
| `docker/setup-qemu-action` | v3 | v4.4.0 |
| `docker/setup-buildx-action` | v3 | v4.4.1 |
| `docker/build-push-action` | v5 | v7.4.0 |
| `softprops/action-gh-release` | v1 | v3.0.3 |

The table lists the latest tags from `git ls-remote` on 2026-11-04. The pinned `actions/checkout` SHA matches no `v4.x` tag. Pin `actions/checkout` to the commit SHA of the v7.0.1 tag.

Unverified items for this phase:

- The breaking changes in each action. Read the release notes of each action before the update.
- Node 26 in Cloudflare Workers Builds. The build image accepts any Node version through `.nvmrc`, but preinstalls only Node 22.23.4 and 24.22.1. Workers Builds runs pnpm through corepack, and Node 26 does not include corepack. Check pnpm's install output in the first build log after the phase merges.
- The Vite 4 and Vitest 0.34 toolchain on Node 26. If the verification procedure fails, move steps 1, 2, and 6 after phase 2.
- Corepack in the `node:26-alpine` image. Step 7 does not depend on it.

### Phase 1: Updates within major versions

1. Update `vue` from 3.3.4 to 3.5.44.
2. Align `@vue/compiler-sfc` and `@vue/runtime-dom` with the `vue` version. `@vue/compiler-sfc` is pinned to 3.2.47, which is older than `vue`.
3. Update `naive-ui` from 2.35.0 to 2.45.3.
4. Update `@vue/test-utils` from 2.3.2 to 2.5.1.
5. Remove `@types/dompurify`. npm marks it deprecated because `dompurify` ships its own types.
6. Remove `@types/figlet`. npm marks it deprecated because `figlet` ships its own types.
7. Keep the `@unhead/vue>@vueuse/shared` override in `package.json`. Phase 5 removes it.
8. Update `typescript` from 5.2.2 to 5.4.5.
9. Update `vue-tsc` from 1.8.1 to 1.8.27.
10. In `src/modules/command-palette/command-palette.vue`, call `activateOption` only when the selected option exists.
11. In `src/tools/string-obfuscator/string-obfuscator.model.ts`, replace `get` from `@vueuse/core` with `toValue` from `vue`.
12. Update the packages in the table below.

`@vueuse/head` 1.0.0 depends on `@unhead/vue` 0.5.1. `@unhead/vue` 0.5.1 imports `resolveUnref` from `@vueuse/shared`. Without the override, pnpm resolves `@vueuse/shared` 15.0.0, which does not export `resolveUnref`. `pnpm build` then fails.

The Vue 3.5 type definitions use the `NoInfer` type, which TypeScript 5.2 does not provide. `vue-tsc` 1.8.27 crashed on every TypeScript release from 5.5.4 to 5.9.3. TypeScript 5.4.5 is the newest release that works with `vue-tsc` 1.8.27.

The Vue 3.5 types exposed two type errors in the application code:

- The command palette passed `undefined` to `activateOption` when the user pressed Enter with no matching option. `activateOption` then threw a `TypeError`.
- The `get` function of VueUse 10 does not accept the Vue 3.5 `MaybeRef` type.

| Package | From | To |
|---|---|---|
| `@iconify-json/mdi` | 1.1.50 | 1.2.3 |
| `@tabler/icons-vue` | 3.20.0 | 3.50.0 |
| `consola` | 3.0.2 | 3.4.2 |
| `cron-validator` | 1.3.1 | 1.4.0 |
| `highlight.js` | 11.7.0 | 11.12.0 |
| `ibantools` | 4.3.3 | 4.5.4 |
| `js-base64` | 3.7.7 | 3.9.6 |
| `less` | 4.1.3 | 4.9.1 |
| `libphonenumber-js` | 1.10.28 | 1.13.15 |
| `netmask` | 2.0.2 | 2.1.1 |
| `pdf-signature-reader` | 1.4.2 | 1.4.3 |
| `plausible-tracker` | 0.3.8 | 0.3.9 |
| `prettier` | 3.0.0 | 3.9.10 |
| `qrcode` | 1.5.1 | 1.5.4 |
| `xml-formatter` | 3.3.2 | 3.7.0 |
| `@types/crypto-js` | 4.1.1 | 4.2.2 |
| `@types/lodash` | 4.14.192 | 4.17.27 |
| `@types/markdown-it` | 13.0.9 | 14.2.0 |
| `@types/netmask` | 2.0.0 | 2.0.6 |
| `@types/node-forge` | 1.3.2 | 1.3.14 |
| `@types/qrcode` | 1.5.0 | 1.5.6 |

`@types/markdown-it` 14 matches the installed `markdown-it` 14.

These 0.x packages have a minor version that a caret range does not accept. Update each one in this phase, and test the tool that uses it:

| Package | From | To |
|---|---|---|
| `@vicons/material` | 0.12.0 | 0.13.0 |
| `@vicons/tabler` | 0.12.0 | 0.13.0 |
| `country-code-lookup` | 0.1.0 | 0.2.2 |
| `randexp` | 0.5.3 | 0.6.1 |
| `unicode-emoji-json` | 0.4.0 | 0.9.0 |

### Phase 2: Build and test toolchain

This phase lands as one pull request. `vitest` 5 and the Vite plugins share the Vite peer range, so a partial upgrade leaves peer conflicts.

| Package | From | To |
|---|---|---|
| `vite` | 4.5.14 | 8.3.5 |
| `@vitejs/plugin-vue` | 4.3.2 | 6.0.10 |
| `@vitejs/plugin-vue-jsx` | 3.0.2 | 5.1.6 |
| `vite-plugin-pwa` | 0.16.0 | 2.0.0 |
| `workbox-window` | 7.0.0 | 7.4.1 |
| `vite-plugin-vue-markdown` | 0.23.5 | Replaced by `unplugin-vue-markdown` 32.1.1 |
| `unplugin-auto-import` | 0.16.4 | 21.1.0 |
| `unplugin-vue-components` | 0.25.0 | 32.1.0 |
| `unplugin-icons` | 0.17.0 | 24.0.0 |
| `unocss` | 0.65.1 | 66.12.0 |
| `unocss-preset-scrollbar` | 0.2.1 | 4.0.0 |
| `vite-svg-loader` | 4.0.0 | 5.1.3 |
| `@intlify/unplugin-vue-i18n` | 2.0.0 | 11.2.8 |
| `vitest` | 0.34.0 | 5.1.0 |
| `jsdom` | 22.0.0 | 30.1.3 |
| `@types/jsdom` | 21.1.0 | 30.0.0 |
| `@types/node` | 18.15.11 | 26.6.6 |

`vite-plugin-vue-markdown` is deprecated. npm reports that the package was renamed to `unplugin-vue-markdown`, and that Vite users also change the import.

`tsconfig.vitest.json` loads the `jsdom` types, so `@types/jsdom` follows `jsdom`. `@types/node` 26 matches the Node version from phase 0.

The phase changes these files:

- `vite.config.ts`: plugin imports, plugin options, and the `test` block.
- `unocss.config.ts`: preset imports.
- `.eslintrc-auto-import.json`: `unplugin-auto-import` regenerates it.
- `auto-imports.d.ts` and `components.d.ts`: the plugins regenerate them.

Alternative: split Vite and Vitest into two pull requests. Unverified: `vitest` 0.34 runs against its own Vite copy while the app uses Vite 8.

### Phase 3: Lint toolchain

1. Update `eslint` from 8.47.0 to 10.14.0.
2. Update `@antfu/eslint-config` from 0.41.0 to 10.0.0.
3. Update `@unocss/eslint-config` from 0.57.1 to 66.12.0.
4. Remove `@rushstack/eslint-patch`. `.eslintrc.cjs` does not load it.
5. Replace `.eslintrc.cjs` with `eslint.config.js`. ESLint 9 and later read only the flat config format.
6. Commit the configuration change first.
7. Commit the autofix changes from `pnpm lint --fix` separately, so the review can skip the formatting commit.

### Phase 4: Type checking toolchain

1. Update `vue-tsc` from 1.8.27 to 3.3.14.
2. Update `typescript` from 5.4.5 to 7.0.2.
3. Fall back to `typescript` 6.0.3 if `vue-tsc` fails with 7.0.2. `vue-tsc` 3.3.14 declares `typescript >=5.0.0`. Unverified: `vue-tsc` support for TypeScript 7.
4. Update `@vue/tsconfig` from 0.4.0 to 0.9.1.
5. Replace `@tsconfig/node18` with `@tsconfig/node26` 26.0.1.

### Phase 5: Vue ecosystem libraries

1. Update `pinia` from 2.0.34 to 4.1.0. `src/main.ts` creates the store. `pinia` 4 requires the peer `@vue/devtools-api` 8.2.1 or later, and pnpm installs it by default.
2. Update `vue-router` from 4.1.6 to 5.4.0.
3. Update `vue-i18n` from 9.14.5 to 11.4.18. `src/plugins/i18n.plugin.ts` creates the i18n instance. One high advisory has no fixed version in any release.
4. Update `@vueuse/core` and `@vueuse/router` from 10 to 15.
5. Replace `@vueuse/head` with `@unhead/vue` 3.4.3. `src/main.ts` and four pages and layouts use it. This step removes the `"@vueuse/shared": "latest"` dependency that the phase 1 override works around.
6. Remove the `@unhead/vue>@vueuse/shared` override from `package.json`.

### Phase 6: Application libraries with advisories

1. Update `@tiptap/pm`, `@tiptap/starter-kit`, and `@tiptap/vue-3` from 2 to 3.32.2. The HTML WYSIWYG editor tool uses them. This step removes the `markdown-it` 13.0.2 copy.
2. Update `uuid` from 9.0.0 to 14.0.3.
3. Remove `@types/uuid`. npm marks it deprecated because `uuid` ships its own types.
4. Update `zx` from 7.2.1 to 8.8.5. Only `scripts/release.mjs` uses it.
5. Decide what to do with `hygen`. Version 6.2.11 is the latest release and still pulls in 21 high advisories. Only the `script:create:ui` script uses it.
6. Update `mathjs` from 11.9.1 to 15.2.0. The math evaluator tool uses it.

`composerize-ts` 0.6.2 is the latest release, and it pulls in 10 high advisories. No upgrade fixes them.

### Phase 7: Remaining major versions without advisories

These packages have a major version available and no advisory in the audit:

| Package | From | To | Type package |
|---|---|---|---|
| `@sindresorhus/slugify` | 2.2.1 | 4.0.0 | |
| `bcryptjs` | 2.4.3 | 3.0.3 | Remove `@types/bcryptjs` |
| `change-case` | 4.1.2 | 5.4.4 | |
| `cronstrue` | 2.26.0 | 3.38.0 | |
| `date-fns` | 2.29.3 | 4.4.0 | |
| `emojilib` | 3.0.10 | 4.0.3 | |
| `figue` | 1.2.0 | 3.3.0 | |
| `fuse.js` | 6.6.2 | 7.5.0 | |
| `jwt-decode` | 3.1.2 | 4.0.0 | |
| `markdown-it` | 14.3.3 | 15.0.3 | Remove `@types/markdown-it` |
| `marked` | 10.0.0 | 18.1.3 | |
| `mime-types` | 2.1.35 | 3.0.2 | Update `@types/mime-types` from 2.1.1 to 3.0.1 |
| `monaco-editor` | 0.43.0 | 0.57.0 | |
| `oui-data` | 1.0.10 | 2.1.53 | |
| `sql-formatter` | 13.0.0 | 15.9.0 | |
| `ua-parser-js` | 1.0.35 | 2.0.10 | Remove `@types/ua-parser-js` |
| `ulid` | 2.3.0 | 3.0.2 | |

`bcryptjs` 3, `markdown-it` 15, and `ua-parser-js` 2 ship their own types. npm marks `@types/bcryptjs` 3.0.0 deprecated for this reason.

Each package backs one or two tools. Upgrade each package in a separate pull request, or let Renovate propose them.

`vuedraggable` needs no update. Its `latest` dist-tag points to the Vue 2 release line, and 4.1.0 is the latest Vue 3 release.

## Verification procedure

Run these steps on the Node version in `.nvmrc` for each phase:

1. Run `pnpm install`.
2. Compare the peer dependency warnings with the previous phase. Explain each added warning in the pull request.
3. Run `pnpm lint`.
4. Run `pnpm test`.
5. Run `pnpm typecheck`.
6. Run `pnpm build`.
7. Confirm that the E2E workflow passes on Chromium, Firefox, and WebKit.
8. Open each tool whose library changed in the Cloudflare preview deployment.
9. Run `pnpm audit` and record the counts in the pull request description.

## Keeping dependencies current

`renovate.json` extends `config:base`. Unverified: the Renovate app runs on this repository. Merged commits on `main` show no Renovate pull requests. After phase 7, enable Renovate and group the toolchain packages from phase 2.

pnpm 10.34.9, 11.28.9, and 12.16.1 are the latest releases of the next three major versions. pnpm 10 runs dependency lifecycle scripts only for the packages that `onlyBuiltDependencies` lists. pnpm 11 requires Node 22.13 or later. pnpm 12 is a rewrite in Rust. Unverified: the full list of breaking changes in pnpm 10, 11, and 12. The [pnpm release notes](https://pnpm.io/blog) list them.

## Open questions

- Should the project remove `hygen` and its `script:create:ui` script, or replace it?
- Should the project keep `composerize-ts`, given that no release fixes its advisories?
- Which TypeScript major version should phase 4 target if `vue-tsc` supports both 6 and 7?
- Which pnpm major version should the project move to after phase 7?
