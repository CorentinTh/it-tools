# Text Diff Editor Payload Comparison

Date: 2026-07-18

Status: **comparison complete; migration not yet approved for production**.

## Decision

Further Monaco import pruning cannot meet the `<350 kB gzip` route target.
CodeMirror 6 is the only measured candidate with enough payload headroom, but
its native `MergeView` recomputes diffs synchronously during document changes.
Replacing Monaco before a worker-backed/adversarial-input spike would violate
the fork's main-thread safety rules and risk silently coarse diffs.

Therefore:

- keep the current repaired Monaco editor for now;
- reject import-path-only and Monaco-upgrade payload work;
- treat a focused, worker-backed CodeMirror spike as the next implementation
  gate rather than a mechanical dependency swap;
- count worker assets in route measurements before accepting either editor.

No dependency or production editor change was made by this experiment.

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

## Required migration gates

1. Route JavaScript/CSS plus every owned worker remains `<350 kB gzip`.
2. Two editable panes retain line/character highlights, vertical alignment,
   undo/redo, find, clipboard, line numbers, keyboard navigation, theme/resize,
   and loop-free external model updates.
3. Unicode, CRLF, empty-side, long-line, repeated-line, and adversarial
   distributed-change fixtures are correct.
4. Both existing 1 MiB fixtures stay responsive; normal editing creates no
   main-thread task `>=50 ms` at 4x CPU.
5. Input is byte-bounded and worker work is cancellable/stale-safe.
6. Ten route cycles retain `<5 MiB`, with no workers/listeners left behind.
7. Existing default-off persistence/privacy behavior remains unchanged.
