## Plan: Belgian SSIN Generator — Updates

**What**: Apply the changes in the section below.

---

**Changes**

- UI: The 'date of birth' field is indented slightly more than the other fields, making it shorter. This is probably because of the label being too long. Keep the label and make all input fiels equally wide, aligned to the left edge of the longest label. This is a more consistent and visually balanced layout.
- UI: The 'date of birth' and 'gender' fields both have a default "random" option, but this is shown in different ways: the date picker is has 'default' text greyed out, while the gender select has an explicit "— random —" option. Make these consistent by showing a 'random' greyed-out option in the gender select, and removing the "— random —" option. This makes it clearer that both fields have a random default, and reduces visual clutter in the gender select.
- UI: After generating a number, the result card is shown to the right of the form, which looks a bit disconnected. Move the result card below the form, centered, to create a more cohesive and balanced layout. This also allows more space for the result card, which can be wider and easier to read. Make the result card always visible, but show placeholder text (e.g. "Your generated SSIN will appear here") before the first generation, to indicate where the output will be. This improves the user experience by providing a clear and consistent layout, and guiding the user on where to look for the results.
- UI: In the result card, the copy buttons are shown as buttons next to the result fields. Integrate them as icons inside the input fields, aligned to the right, to save space and create a cleaner look. This also makes it more intuitive that clicking the icon will copy the field value. Use a standard copy icon (e.g. clipboard) for this purpose.

---

**Steps**

### Phase 1 — Consistent field alignment (`id-number-generator.vue`)
1. Remove the built-in `label` prop from all `c-select` usages (Country, Gender) — place labels manually outside the component instead, matching the existing manual rows.
2. Wrap the whole options form in a CSS grid: `display: grid; grid-template-columns: 140px 1fr` — each row contributes one label cell and one input cell, ensuring all inputs start at the same horizontal position regardless of which component renders them.
3. The `n-date-picker` and `n-switch` rows already use manual labels; adjust their label width to match the grid column (140 px).

### Phase 2 — Consistent "random" placeholder for gender (`id-number-generator.vue`)
4. Remove `{ value: '', label: '— Random —' }` from `genderOptions`; the array should only contain `Male` and `Female`.
5. Change `selectedGender` initial value from `''` to `null` (type `string | null`).
6. Add `placeholder="Random"` to the gender `c-select` — the component renders placeholder text greyed out when no option is selected, matching the date picker's greyed-out `"Random"` placeholder text.
7. Update the `generate()` function: treat `selectedGender.value === null` the same as the existing empty-string guard (random fallback in the service).

### Phase 3 — Result card below, always visible (`id-number-generator.vue`)
8. Wrap both `<c-card>` elements in a single `<div flex flex-col gap-4>` container. The tool layout assigns `flex: 0 1 600px` to each *direct* child of `.tool-content`; wrapping in one `div` forces both cards into a single column of that width.
9. Remove `v-if="result"` from the result card so it is always rendered.
10. Inside the result card, show a centred, muted placeholder paragraph (e.g. `"Your generated SSIN will appear here"`) when `result` is `null`, and hide it once a result exists (`v-if="!result"`).
11. Keep the result rows under `v-if="result"` so they only appear after the first generation.

### Phase 4 — Copy icons inside input fields (`id-number-generator.vue`)
12. Replace each `c-input-text` + standalone `c-button "Copy"` pair with a single `c-input-text` that uses its `#suffix` slot:
    ```html
    <template #suffix>
      <c-tooltip :tooltip="isJustCopiedFormatted ? 'Copied!' : 'Copy to clipboard'">
        <c-button circle variant="text" size="small" @click="copyFormatted()">
          <icon-mdi-content-copy />
        </c-button>
      </c-tooltip>
    </template>
    ```
    (Same pattern for the raw SSIN field, using a separate `isJustCopiedRaw`.)
13. Destructure `isJustCopied` from each `useCopy` call and rename to `isJustCopiedFormatted` / `isJustCopiedRaw` for the tooltip text.
14. Reference pattern: `src/components/InputCopyable.vue` — uses `#suffix` slot with `c-tooltip`, `c-button circle variant="text" size="small"`, and `icon-mdi-content-copy`.

---

**Relevant files**
- `src/tools/id-number-generator/id-number-generator.vue` — all changes are here

**Decisions**
- No service or test changes required — purely a UI/layout update.
- Grid column width set to 140 px to comfortably fit "Date of birth" (the longest label).
- `c-tooltip` used for copy icon to provide "Copied!" feedback without a toast, matching `InputCopyable.vue`.

