# UI Consistency Audit and Migration Plan

Status: **IMPLEMENTATION COMPLETE — first snapshot/state baseline accepted; broader expansion remains**
Source review: 2026-08-15

## Scope and review boundary

This audit covers the shared UI primitives, tool layout, and all Vue SFCs under
`src/tools/`. It focuses on form controls, labels, field widths, boolean and
choice controls, action placement, result/status presentation, responsive
behavior, accessibility semantics, and regression coverage.

The source inventory and representative route review are complete. The Orca
embedded browser baseline now covers Token, NanoID, UUID, File Hash, List
Converter, Percentage Calculator, Regex, JSON, YAML, XML, Docker conversion,
Wi-Fi QR, QR, Bcrypt, Random Port, MAC Address, IPv6 ULA, Lorem Ipsum, and
shared control semantics against the Vite dev server. Every live claim was
checked with `/@vite/client` and `/src/main.ts` loaded, no service-worker
controller, and the current purple accent. The executable all-route matrix now
covers all 89 routes at desktop/light and mobile/dark, including horizontal
overflow, visible form-control names, theme state, route content, and runtime/
chunk errors. Representative Orca review supplies the complementary live
desktop/mobile and light/dark visual checks against the Vite dev server.

The first deterministic state baseline is now executable: explicit-task
loading with disabled controls, mobile dark validation errors, and a dense form
with long values plus a result. Semantic assertions remain cross-platform;
pixel comparison uses checked-in Darwin Chromium references so host font
rendering does not make Linux checks flaky. This is a representative hardening
foundation, not a claim that every route/state combination has a screenshot.

## Accepted product decisions

- Non-diff input-to-output tools always use one vertical workbench: input above
  output on every viewport. Side-by-side panels are reserved for true diff
  tools.
- Large transformation editors use the available desktop width. Input and
  output have equal available width and comparable base height; options may
  remain compact, but editors may not inherit compact form constraints.
- NanoID is the visual reference for the UUID/ULID/NanoID generator family.
- Docker Run to Compose and XML Formatter are the first accepted transformer
  pilots for the wide, stacked contract.

## Implementation progress — 2026-08-10

- Shared spacing, width, control-height, radius, and focus tokens are active.
- `c-input-text`, `c-select`, `c-file-upload`, and `c-buttons-select` now have
  tested keyboard, disabled, labelling, error, and state semantics.
- `c-field` now supplies the shared label, description, required/optional,
  disabled, status, and stable-feedback contract. `c-input-number` repairs the
  Naive UI 2.35 wrapper limitation by publishing a labelled `spinbutton` with
  min/max/current state on the native input and names its increase/decrease
  actions. `c-switch`, `c-choice-group`,
  `c-checkbox`, `c-color-picker`, and `c-slider` keep Naive UI as an
  implementation detail while providing one labelled route-level control
  contract. The color adapter also repairs the old Naive trigger's missing
  keyboard/button semantics.
- The wide vertical transformer contract is active across the original
  12-route `FormatTransformer` cohort (three remaining callers) and the direct
  JSON, YAML, SQL, Docker,
  Base64, URL, HTML entity, text/binary/Unicode, encryption, Markdown,
  SafeLink, email, slug, hash/HMAC, meta-tag, and obfuscation routes. A
  source-level test prevents these routes from losing the contract.
- NanoID, UUID, ULID, Token, MAC Address, IPv6 ULA, Random Port, and Lorem Ipsum
  now use the shared generator rhythm. Configurable generators place options
  before output and actions; `Generate` is primary and `Copy` follows.
- NanoID, UUID, and ULID specifically share one options -> 12-row monospace
  output -> action-bar structure. Fixed label widths and UUID-only
  centred/autosize output were removed, and the three routes have an executable
  source contract.
- Orca dev review confirms equal-width vertical editor panels for Docker, XML,
  JSON, YAML, and SQL, plus equal-height outputs and action order for the three
  identifier generators. The remaining routes now opt into a named transformer,
  task, generator, form, diff, or reference/catalog layout rather than an
  unclassified route-local page contract.
- List Converter now combines responsive dense options with the shared vertical
  transformer. Wi-Fi QR uses full-width fields and places its equal-width result
  card below the form. Percentage Calculator uses three equal responsive field
  columns per calculation group; live DOM review confirms all nine labels target
  native inputs and `25% of 200` produces `50` in Vite dev.
- Regex Tester now uses a semantic six-checkbox group, wide task/status/result
  slots, keyboard toggling, and responsive overflow coverage. JSON/YAML/XML
  formatter options now use responsive cards plus shared switch and numeric
  controls; their old direct Naive wrappers and literal 100 px widths are gone.
- The numeric/form/catalog wave now covers Bcrypt, ASCII Art, ETA, Integer Base,
  Roman Numeral, Temperature, BIP39, Benchmark Builder, Chmod, Hash Text,
  Keycode Info, Open Graph, Date-time, IPv4, OTP, URL Parser, Case Converter,
  HTML Entities, Markdown, SafeLink, and the QR/color family. Bcrypt's integer
  rounds regression is fixed: Naive `precision=0` deferred the model update
  until blur, so the explicit action could read the old value. Integer
  validation now preserves immediate commit, with component and browser gates.
- Route source now contains zero direct Naive checkbox, switch, color-picker,
  fixed input-group, form-item, or number-input controls, and zero literal
  `label-width` rules. The completed RSA repair removes the final temporary
  exception.
- RSA Key Pair Generator now uses the shared explicit-task rhythm: fixed
  2,048/3,072/4,096-bit presets, an explicit Generate action, a vertically
  stacked prior-result-preserving output, and a bounded terminate-and-replace
  Web Crypto worker lifecycle.
- QR and Wi-Fi QR now share one ordered generation lifecycle and visible
  status/result rhythm. Incomplete Wi-Fi fields clear the result immediately;
  pending or invalid output cannot leave an enabled download action.
- HTML WYSIWYG now uses the shared task/action/status/result layout. Small
  documents format after typing pauses in a route-owned worker, while larger
  documents expose an explicit action rather than doing hidden work per edit.
- JSON Diff remains a justified side-by-side diff exception. Its array options
  use top labels without route-local width constraints, actions use the shared
  task bar, its bounded worker aligns stable keys/LCS sequences, and the result
  tree uses accessible expand/collapse controls plus progressive 200-row
  rendering instead of eagerly mounting every nested line.
- Current integrated evidence is zero-warning lint, dual-project typecheck,
  990/990 unit tests across 150 files, the prior 89/89 all-route responsive/
  theme/semantics matrix plus Hash Text and bounded-converter focus against Vite
  dev, 172/172 sequential production-preview Chromium flows, a fresh
  22,876-module production build, and 228/228 production artifact-budget
  checks.

## Resolved executive finding

The application originally had reusable `c-*` primitives but no single form or
tool-page contract. Tools independently combined custom controls, Naive UI form
wrappers, native elements, arbitrary UnoCSS spacing, and local widths. The
rollout resolves that route-level split with shared control adapters, tokens,
layout archetypes, source ratchets, and browser acceptance. RSA's separate
generation-lifecycle repair is now complete and follows the same contracts.

The gate that held the next product feature is now satisfied. This was not a
full visual redesign: the rollout preserved tool behavior while establishing a
small, testable system that later routes must adopt. RSA was completed as a
correctness task with its own lifecycle regressions rather than disguised as a
cosmetic migration.

## Source inventory

The following counts cover 100 Vue files in `src/tools/`, including route
components and route-local child components:

| Signal | Current evidence |
|---|---:|
| Files using `c-input-text` | 60 |
| Files using `n-form-item` | 0 |
| Files mixing `c-input-text` and `n-form-item` | 0 |
| `c-input-text` instances | 110 |
| `n-input-number` instances | 0 |
| `c-select` instances | 26 |
| `n-switch` instances | 0 |
| `n-checkbox` instances | 0 |
| `n-color-picker` instances | 0 |
| `n-input-group` instances | 0 |
| `c-buttons-select` instances | 6 |
| `CSwitch` instances | 23 |
| `CInputNumber` instances | 28 |
| `CCheckbox` instances | 10 |
| `CColorPicker` instances | 7 |
| `CSlider` instances | 3 |
| Files with literal `label-width` rules | 0 |
| Files using `c-card` | 60 |
| `c-card` instances | 127 |
| Tool/component visual screenshot baselines | 7 representative states |
| Executable all-route responsive/theme matrices | 1 (89 routes) |

The original inventory found at least 18 literal label-width representations
from 60 px to 200 px. The rollout has reduced that class to zero. Remaining
inline width rules belong to a smaller media,
large-table, compact-output, and reference-layout exception audit rather
than the former route-wide field system.

The executable width ratchet permits template width exceptions only in Emoji
Picker (media grid), JSON Schema Validator's compact option area, and SVG
Placeholder's bounded preview. CSS-only responsive breakpoints, intrinsic QR image
dimensions, editor containment, and the compact Chmod octal result are not
field-layout exceptions. True JSON/Text diff views remain the only routes that
may place peer editors side by side.

## Confirmed growth points

### P0 — repair the primitive contract

1. **One field wrapper is missing.** `c-input-text` owns its label and feedback,
   `c-select` delegates to `c-label`, and number/color/switch controls usually
   sit inside `n-form-item`. As a result, label spacing, alignment, help text,
   validation height, required state, and disabled state differ within one
   card. Introduce one `c-field` contract that can wrap text, number, select,
   color, checkbox, and switch controls without nesting one form system inside
   another.
2. **`c-select` is incomplete.** It has no `disabled` prop even though List
   Converter passes one; the attribute falls through without disabling
   interaction. The trigger/options also lack combobox/listbox roles,
   `aria-expanded`, active-descendant semantics, and an associated focusable
   control. Filtered keyboard navigation clamps against the unfiltered option
   count. Repair behavior and add component tests before broad migration.
3. **`c-input-text` error styling targets the wrong element.** The `.error`
   selector addresses a direct `.input` child, but the visible border belongs to
   the nested `.input-wrapper`. Feedback text renders, while the intended error
   border/focus treatment is not reliably applied. Icon-only clear and password
   visibility actions also need accessible names and pressed/state semantics.
4. **`c-file-upload` is pointer-only.** Its clickable drop zone is a `div`
   without button semantics, focusability, or keyboard activation. Preserve
   native file input behavior while adding a keyboard-operable labelled trigger,
   focus-visible state, disabled state, and drag/error/help slots.
5. **Segmented choices expose color only.** `c-buttons-select` has no
   radiogroup/pressed semantics and its non-wrapping flex row can overflow.
   Define it as a single-choice control, make selection programmatically
   available, and support bounded wrapping or horizontal overflow.
6. **Button variants are not enforced.** Most tools use `c-button`, one route
   uses `n-button`, several use native buttons, and Docker conversion passes an
   unsupported `secondary` prop. Define documented primary/secondary/danger/
   ghost roles, action ordering, icon-button labelling, loading state, and a
   test that rejects unsupported variants.

### P1 — define layout and interaction semantics

1. **Control choice must follow meaning.** Use a checkbox for independent
   inclusion or multi-select, a switch only for an immediately applied mode,
   and a segmented/radio control for one choice among a small fixed set. Current
   generator and formatter tools choose among these controls ad hoc.
2. **Field width must follow a small layout vocabulary.** Replace per-route
   label widths and inline `width`/`max-width` rules with compact, normal, and
   wide tool layouts; full, short numeric, and content-sized fields; and
   responsive stacked labels below a shared breakpoint. Do not force editors,
   media grids, or result tables into the compact 600 px form width.
   For transformation tools this vocabulary is settled: `.c-tool-workbench`
   is wide, `.c-tool-stack` is always vertical, and `.c-tool-panel` gives both
   editor areas the same width contract. Only true diff tools may opt out.
3. **Spacing needs tokens rather than local corrections.** Define route section,
   card, field, inline-control, and action gaps using the existing UnoCSS setup.
   The design system currently defines colors but no shared spacing, radius,
   content-width, control-height, or focus-ring tokens.
4. **Actions need one order and location.** Explicit tasks should use a shared
   action bar: primary Run/Generate/Validate first, Cancel only while running,
   then secondary Copy/Download/Clear according to result state. Desktop aligns
   the bar consistently; narrow screens wrap or stack without reversing the
   reading/tab order.
5. **Status and results need stable slots.** Worker-backed tools already reserve
   status space in some new routes, while older tools rely on disappearing
   cards, toast-only feedback, or inline text. Standardize pending/progress/
   success/warning/error placement, `aria-live`, and result headers.
6. **Related routes need shared archetypes.** Adopt five page patterns rather
   than a unique layout per tool: live transformer, explicit task, generator,
   local-file inspector, and searchable reference/catalog. Special media/editor
   routes may extend these patterns but should reuse their fields and actions.

### P1 — build a visual and accessibility safety net

- Add deterministic Chromium visual fixtures for representative routes at
  compact mobile, tablet, and desktop widths in light and dark themes. Mask
  generated/time-varying output instead of accepting noisy snapshots.
- Cover default, hover, focus-visible, disabled, validation error, long-label,
  long-value, empty, loading, and result states for shared primitives.
- Add keyboard and semantic tests for label association, tab order, select,
  checkbox groups, segmented choices, file upload, action bars, and dialogs.
- Keep all 89 route smoke, bundle, PWA, privacy, and lifecycle gates green. A UI
  migration must not eager-load Naive modules or another component library into
  the shell.

## Proposed target foundation

Build the smallest reusable layer compatible with the existing codebase:

1. design tokens for spacing, control heights, radii, focus rings, compact/wide
   content widths, and responsive label behavior;
2. `c-field` for label, description, validation, required/optional state, and
   stable feedback space;
3. repaired `c-input-text` and `c-select`, plus thin `c-number-input`,
   `c-choice`, and `c-choice-group` adapters where native/custom functionality
   is insufficient;
4. `c-tool-section`, `c-tool-actions`, and `c-tool-status` layout primitives;
5. an explicit route archetype documented with examples rather than a new
   generic component that owns tool business logic.

Prefer the existing `c-*` and UnoCSS conventions. Naive UI may remain an
implementation detail for complex primitives, but route code should not need
to know two different field/label systems. Do not add Storybook or another UI
framework unless a measured need justifies its bundle and maintenance cost.

## Migration order

### Phase 0 — visual baseline and contract (2–3 engineering days)

- capture the representative route matrix before changing styles;
- agree on tokens, field semantics, boolean-control rules, action order, and
  compact/wide breakpoints;
- add a lightweight UI inventory check for unsupported control/button variants.

### Phase 1 — primitives (4–6 engineering days; core controls complete)

- fix `c-input-text`, `c-select`, `c-file-upload`, `c-buttons-select`, and
  `c-button` contracts with component, keyboard, and state tests;
- add field/action/status/layout primitives without changing tool behavior;
- verify light/dark and mobile/desktop states visually.

### Phase 2 — representative pilot (complete)

Migrate one route family from each major pattern:

- JSON/YAML Prettify: identical option, input, action, status, and output layout;
- Token/NanoID/UUID/ULID: generator fields, choice semantics, and action order;
- File Hash and JSON Schema Validator: explicit task/status/result pattern;
- List Converter and Wi-Fi QR: dense mixed-control form and responsive labels;
- Percentage Calculator: short numeric field sizing and mobile sentence layout;
- Regex Tester: multi-checkbox group and wide result behavior.

The pilot must pass source-level UI contract checks and browser review before
the remaining routes are migrated.

### Phase 3 — route rollout (complete)

- migrate remaining routes by archetype, not alphabetically;
- preserve transformation behavior and persistence/privacy semantics;
- remove local width/label/spacing exceptions only after each route is visually
  accepted at the target viewports.

### Phase 4 — hardening (core gates and first snapshots complete; broader variants remain)

- maintain the all-route responsive/theme matrix, keyboard flows, and semantic checks;
- keep the three representative state baselines stable and expand them by
  archetype rather than copying every route indiscriminately;
- document justified exceptions for Monaco, media, large tables, and editors;
- ratchet an executable UI consistency gate so new tools cannot recreate the
  mixed field system.

The original planning estimate for one experienced engineer was approximately **6–10 weeks**,
including the full 89-route rollout and regression work. The first useful
foundation plus representative pilot is approximately **2–3 weeks**.

## Acceptance gates

- [x] Live visual baseline is captured for the first representative route matrix.
- [x] Shared design tokens and field/control semantics are documented.
- [x] P0 primitive defects have failing regressions before fixes.
- [x] Shared controls pass keyboard, labelling, disabled, error, and focus tests.
- [x] Pilot routes pass desktop/mobile and light/dark visual review.
- [x] No migrated route mixes `c-field` with direct `n-form-item` layout; the
  RSA correctness repair removed the final frozen exception.
- [x] No new literal label widths or unsupported button/control variants appear.
- [x] Remaining per-route width exceptions are documented by archetype.
- [x] All-route smoke, unit/type/lint/build, bundle/PWA, and affected E2E gates pass.
- [x] The final route rollout and justified exceptions are recorded here and in
  `.ai/PROGRESS.md`.
