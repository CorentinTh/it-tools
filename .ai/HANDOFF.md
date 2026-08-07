# Cross-machine AI Handoff

Last transfer review: 2026-08-07 (Europe/Moscow)

This file is the first recovery checkpoint for a new AI session. It records
portable repository state, not hidden conversation memory or machine caches.
After reading it, use `.ai/PROGRESS.md` for current results/risks/next gates and
`.ai/TODO.md` for the approved roadmap.

## Repository identity and durable checkpoint

- Repository: `git@github.com:64mb/it-tools.git`
- Working branch: `feat-ai-research`
- Last completed implementation checkpoint:
  `5f7e97aa4ee538d54c87605d8ad7c0e9f79486f5`
- On 2026-08-07, `git ls-remote origin refs/heads/feat-ai-research`
  returned that exact implementation checkpoint before this documentation-only
  handoff update was created.
- The pre-handoff worktree was clean, with no staged, modified, or untracked
  files. The branch and local tracking ref were `+0/-0`.
- There are no Git submodules, Git LFS objects, repository-local `.env` or
  `.npmrc` files, machine-local symlinks, or required untracked datasets. The
  `.ai` snapshots and generated OUI source artifact are ordinary tracked Git
  files.

The handoff documentation itself must be committed and pushed before changing
machines. A resumed checkout is valid when its branch contains this file and
the implementation checkpoint above is an ancestor; the branch may correctly
be newer than that checkpoint:

```sh
git merge-base --is-ancestor 5f7e97aa4ee538d54c87605d8ad7c0e9f79486f5 HEAD
```

Do not reset, rebase, or delete local work merely because the target HEAD is
different. Inspect the graph and dirty state first.

## Completed state to preserve

The latest completed cross-category slice delivered:

- local File Hash with SHA-256/384/512 in one fixed-window route-owned worker
  pass, progress/cancellation/replacement, exact-key protocols, an 8 GiB policy
  ceiling, session-only file references, safe filename rendering, and online to
  offline demand-cache reuse;
- deterministic same-file reselection and drop-state cleanup in the shared file
  upload control;
- compatible worker-transport hardening for `messageerror`, non-array legacy
  records, bounded/sanitized OUI errors, and malformed-message replacement;
- independent route/worker build budgets plus large-file, privacy, clipboard,
  lifecycle, and production Workbox evidence.

There is no active partially implemented source change at this checkpoint.
Roadmap rows marked `IN PROGRESS` describe remaining product milestones, not
uncommitted work.

The last integrated evidence, executed on 2026-07-18 and committed in the
checkpoint above, is:

- lint and both typecheck projects passed;
- 816/816 unit tests across 104 files passed;
- 16/16 build-stat infrastructure tests and 202/202 production-artifact checks
  passed;
- 4/4 OUI generation/data checks passed;
- the production build transformed 24,192 modules in 21.17 seconds;
- 102/102 sequential Chromium E2E tests passed, including all 89 registered
  routes;
- File Hash focused tests were 107/107, with separate core/privacy, 256 MiB,
  and offline-PWA browser flows passing;
- `git diff --check` passed.

Exact metrics and the distinction between current results and historical audit
baselines live in `.ai/PROGRESS.md`, `.ai/PERFORMANCE.md`, and
`.ai/experiments/FILE_HASH_DESIGN.md`.

## Active constraints and non-claims

- Dependency/base-image vulnerability remediation and scanner policy remain an
  explicitly deferred security track. Do not start that track merely because
  historical advisory findings exist in `.ai`.
- Upstream issues and PRs are requirements/fixture research only. Do not merge,
  rebase, or cherry-pick upstream without explicit approval and a recorded
  `.ai/TODO.md` adaptation entry.
- The accepted baseline is Node `24.18.0` and pnpm `9.11.0`. The source host's
  final local measurements used Node `24.15.0` and emitted the expected engine
  warning; the exact Node baseline was also exercised through Docker. A new
  machine should use `.nvmrc`, not reproduce the old host mismatch.
- The source host had the pinned Chromium binary, but not the pinned Firefox or
  WebKit binaries. Do not claim those File Hash feature smokes passed until they
  are installed and run on the target machine.
- File Hash bounds application-owned reads to 4 MiB. Browser-managed `File`
  structured cloning does not establish physical zero-copy or memory
  zeroization, and the documentation intentionally makes neither claim.
- Envelope-first stale filtering and worker-reported output-byte metadata trust
  are explicit transport follow-ups. They are not hidden correctness claims.
- Text Diff payload, privacy-safe OUI payload, PWA update/rollback cleanup,
  Emoji slower-device search, reverse-proxy/subpath acceptance, and the common
  preference-storage denial boundary remain open as listed in `PROGRESS`.

## Exact recovery procedure

Clone or update the branch, then verify its identity before installing anything:

```sh
git clone --branch feat-ai-research --single-branch git@github.com:64mb/it-tools.git
cd it-tools
git status --short --branch
git rev-parse HEAD
git merge-base --is-ancestor 5f7e97aa4ee538d54c87605d8ad7c0e9f79486f5 HEAD
```

Use the repository toolchain and reconstruct ignored artifacts locally:

```sh
nvm install
nvm use
corepack enable
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
```

On a supported Linux host, Playwright system packages may additionally require
`pnpm exec playwright install --with-deps chromium`. Install Firefox/WebKit only
when running their backlog/compatibility gates; caches from the old ARM64 macOS
host are not portable.

Run the recovery gates in dependency order:

```sh
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm test:build-stats
pnpm test:oui-data
pnpm build
pnpm build:stats:check
pnpm test:e2e --project=chromium --reporter=line --workers=1
git diff --check
```

`node_modules/`, `dist/`, pnpm stores, Playwright caches, test reports, editor
state, and SSH credentials are intentionally not portable. Recreate them; do
not add them to Git.

For an optional offline backup independent of GitHub, create and verify a Git
bundle on the source machine after committing the handoff:

```sh
git bundle create it-tools-handoff.bundle --all
git bundle verify it-tools-handoff.bundle
```

Keep that bundle outside the repository.

## Resume priority

Continue from `.ai/PROGRESS.md` → `Next acceptance gates`, not from the oldest
unchecked or historical finding. The next autonomous slice should:

1. select the fourth independent bounded catalog feature from the approved
   Priority A candidates and lock privacy, lifecycle, correctness, browser,
   bundle, and PWA gates before implementation;
2. advance envelope-first stale filtering and output-byte metadata trust only
   where a real consumer proves the shared transport design;
3. include one measured project-owned correctness or performance improvement
   from the active non-security backlog;
4. update `.ai/TODO.md`, the relevant category file, and `.ai/PROGRESS.md` as
   work starts and completes.

Do not weaken existing gates, overstate losslessness/zero-copy/cross-browser
coverage, or silently expand the deferred CVE/base-image scope.

## Copy-paste prompt for the next AI session

```text
Read AGENTS.md and .ai/HANDOFF.md completely, then read the current-status,
active-risk, and next-gate sections of .ai/PROGRESS.md plus .ai/TODO.md. Verify
the branch, HEAD ancestry, and dirty state before editing. Continue the highest
priority approved non-security slice autonomously, preserve the local fork as
source of truth, run proportional regression/browser/build gates, and update
the .ai progress/checklists continuously. Do not begin the deferred
dependency/base-image CVE track and do not import upstream code without explicit
approval.
```
