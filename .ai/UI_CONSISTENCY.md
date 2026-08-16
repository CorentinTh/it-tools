# UI Contract

All tools use the existing `c-*` controls and UnoCSS tokens. Tool-specific
visual identity is intentional: each route keeps its unique icon. Form geometry,
state, and interaction semantics are shared.

## Layout

- Transformation editors stack vertically unless the tool is explicitly a
  diff/comparison view. Input and output use the same available width and
  comparable heights.
- Large desktop utilities use the content width; do not squeeze primary editors
  into narrow form columns. Compact widths are reserved for short options.
- Related generators such as UUID, ULID, and NanoID follow the NanoID-style
  hierarchy: options, primary action, then full-width result actions.
- Mobile stacks controls naturally without horizontal scrolling.

## Controls

- Reuse one label/help/error contract, checkbox/radio styling, field height,
  focus ring, disabled state, and action hierarchy.
- Primary actions are explicit for expensive work. Copy/download operate on the
  latest successful result and do not erase it on validation errors.
- Destructive actions are visually distinct and keyboard accessible.
- Empty, loading, error, success, and oversized-input states must not change the
  page geometry unexpectedly.

## Acceptance

Representative light/dark and desktop/mobile states, keyboard focus, accessible
names, and visual snapshots are required for shared-control changes. Docker
Run/Compose and XML Formatter remain reference routes for the vertical wide
editor pattern; ID generators remain the reference family for generator
unification.
