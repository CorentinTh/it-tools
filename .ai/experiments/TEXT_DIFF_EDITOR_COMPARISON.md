# Text Diff Editor Payload Comparison

Date: 2026-08-16

Status: **worker-backed spike complete; production migration rejected on parity grounds**.

## Decision

Further Monaco import pruning cannot meet the `<350 kB gzip` route target.
CodeMirror 6 is the only measured candidate with enough payload headroom, but
its native `MergeView` recomputes diffs synchronously during document changes.
The completed worker-backed/adversarial-input spike confirms that its supported
API cannot accept asynchronous chunks without rebuilding the editors and losing
focus plus undo/history.

Therefore:

- keep the current repaired Monaco editor for now;
- reject import-path-only and Monaco-upgrade payload work;
- accept the current Monaco payload as a documented route-specific exception
  until CodeMirror exposes supported asynchronous chunk injection or another
  editor can preserve the required interaction contract;
- count worker assets in route measurements before accepting either editor.

No dependency or production editor change was made by this experiment. The
temporary CodeMirror packages were removed from the root manifest and lockfile
after the reproducible spike was built and measured.

## Worker-backed spike result — 2026-08-16

The follow-up built an isolated production artifact from the pinned comparison
versions. `presentableDiff` ran in a terminate-and-replace module worker under a
1 MiB-per-side bound, 1.5-second algorithm timeout, 10,000-change limit, and a
150 ms edit debounce. The main thread rendered a focused two-pane `MergeView`.
The source and measurement harness remain in
`.ai/experiments/codemirror-worker-spike/`; they intentionally do not ship in
the application.

| Artifact / probe | Result |
|---|---:|
| Focused editor JavaScript | 332,686 B raw / 108,055 B gzip |
| Diff worker | 30,983 B raw / 10,882 B gzip |
| Combined editor + worker | **363,669 B raw / 118,937 B gzip** |
| 1,000,000 B per side, initial result-ready | 76.5 ms |
| Same fixture, worker algorithm | 4.2 ms |
| Edit/publication longest observed Long Task | 0.0 ms |
| Edit/publication heartbeat | 32 ticks |
| Distributed 4,000-line adversarial worker run | 547.7 ms |
| Ten destroy/recreate cycles | zero remaining `.cm-editor` nodes |

Payload, worker isolation, bounds, responsiveness, and basic lifecycle gates
passed. The production migration did not pass the interaction gate:

- CodeMirror `MergeView` owns its chunk state and its public `diffConfig.override`
  callback is synchronous;
- returning a cheap empty diff during edits and rebuilding after the worker
  response is the only supported spike path that never computes the diff on the
  main thread;
- rebuilding loses editor focus and the undo/history stack; both failures were
  reproduced by the Chromium harness;
- feeding stale worker changes through the synchronous callback is invalid after
  document edits, while copying private package internals would create an
  unmaintainable fork.

Building independent editors with a custom asynchronous decoration, gutter,
alignment, selection, search, and scroll-synchronization layer would cease to be
a focused editor replacement and would duplicate most of the merge view. The
measured payload saving does not justify that correctness and maintenance risk.
The spike is therefore closed as a rejection, not left as an unbounded future
migration task.

## Current Monaco transfer

The former schema-v3 route closure omitted `editor.worker`, so its
`582,998 B gzip` figure understated the real cold route cost.

| Artifact | Raw | Gzip |
|---|---:|---:|
| `text-diff` JavaScript | 2,206,864 B | 570,786 B |
| Text Diff CSS/shared additions | 61,543 B | 12,216 B |
| Previously reported additional closure | 2,268,407 B | 582,998 B |
| `editor.worker` | 206,100 B | 63,981 B |
| Schema-v4 route-specific closure | **2,474,507 B** | **646,976 B** |

Schema v4 now discovers literal local worker URLs, validates ownership, and
includes `editor.worker` in the executable Text Diff route budget.

## Monaco experiments

Measurements used the repository's Vite 4/minification setup in an isolated
temporary build.

| Variant | Main gzip | CSS gzip | Result |
|---|---:|---:|---|
| Current `editor.api` namespace | 568,718 B | 8,703 B | Baseline experiment |
| Internal named standalone imports | 559,741 B | 8,703 B | Only 8,977 B saved; internal API risk |
| Unsafe legacy-only internal prune | 532,955 B | 8,155 B | Still about 541 kB before worker/app code |
| Monaco 0.55.1 namespace | 660,037 B | 11,873 B | Larger than the pinned version |
| Monaco 0.55.1 worker | 88,427 B | — | Larger than the current worker |

Rejected approaches:

- changing only the import path;
- patching Monaco internals;
- upgrading Monaco for bundle size;
- hiding the same payload behind a second immediate dynamic import.

## CodeMirror comparison

Measured versions:

- `@codemirror/merge@6.12.2`;
- `@codemirror/view@6.43.6`;
- `@codemirror/state@6.7.1`;
- `@codemirror/commands@6.10.4`;
- `@codemirror/search@6.7.1`.

| Configuration | Raw | Gzip |
|---|---:|---:|
| Minimum `MergeView` | 252,110 B | 81,904 B |
| Focused parity: line numbers/history/search/keymaps/selections | 338,765 B | 110,063 B |
| Full `basicSetup` | 406,580 B | 131,659 B |
| Separate pure-diff worker | 30,019 B | 10,521 B |

A focused route should land around 116–140 kB gzip, comfortably below the
product target. Payload alone is not sufficient evidence to migrate.

## Responsiveness findings

For two 1 MiB documents in the isolated CodeMirror diff benchmark:

- a marker-only change took roughly 0.8–2.2 ms and produced one correct chunk;
- 23 distributed changes with `scanLimit=500` took roughly 1–3 ms but collapsed
  into one coarse chunk;
- `scanLimit=50,000` retained 23 chunks and took roughly 19–31 ms on the local
  Node runner, which can exceed 50 ms under a 4x CPU profile.

The dangerous trade-off is increasing `scanLimit` for visual accuracy and
reintroducing main-thread stalls. A production spike must move diff computation
behind a debounced, cancellable worker and render bounded decorations.

## Migration gate disposition

1. **Pass:** route JavaScript plus owned worker is 118,937 B gzip (`<350 kB`).
2. **Fail:** two editable panes can retain line/character highlights and vertical alignment only by rebuilding after each worker result; focus and undo/history are lost.
3. **Partial:** Unicode/CRLF/empty-side fixtures work in the underlying diff, but the distributed-change fixture took 547.7 ms in the worker and only bounded viewport markers were rendered.
4. **Pass for main-thread safety:** the 1 MiB edit probe created no observed Long Task.
5. **Pass:** byte bounds, debounce, physical replacement, and stale job IDs apply.
6. **Pass for DOM/worker cleanup:** ten cycles leave no editor DOM; production migration was already rejected before a retained-heap acceptance claim was needed.
7. **Not changed:** existing default-off persistence/privacy remains on Monaco.

The original required parity included:

- two editable panes retaining line/character highlights, vertical alignment,
  undo/redo, find, clipboard, line numbers, keyboard navigation, theme/resize,
  and loop-free external model updates.

That interaction contract remains the reason Monaco is retained despite its
larger transfer size.
