## Plan: Belgian SSIN Generator Tool

**What**: Complete `id-number-generator` to generate valid Belgian SSINs (nationaal registernummer / numéro national), with optional user inputs and "Generate" button, displaying both formatted and raw output.

---

### Belgian SSIN format
`YY.MM.DD-SSS.CC` — 11 digits total:
- `YYMMDD` — date of birth
- `SSS` — serial: **odd** (001–997) for males, **even** (002–998) for females
- `CC` — checksum: `97 − (9-digit-number mod 97)`, left-padded to 2 digits; for births ≥ 2000, prepend `"2"` to the 9 digits before the mod

---

**Steps**

### Phase 1 — Service layer (`id-number-generator.service.ts`)
1. Export `generateBelgianSSIN(opts: { birthDate?: Date; gender?: 'male' | 'female'; fictitious?: boolean })` returning `{ raw, formatted, gender, birthDate }`
   - Random date fallback (1900–current year range)
   - Random gender fallback
   - `fictitious: false` (default) → serial in low range (001–499 odd for male, 002–498 even for female)
   - `fictitious: true` → serial in high range (501–997 odd for male, 500–998 even for female); these numbers are never assigned to real persons by the Belgian registry
   - Checksum: `97 − (YYMMDDSS % 97)`, prepend `"2"` for year ≥ 2000
2. Export `formatBelgianSSIN(ssin: string): string` → `YY.MM.DD-SSS.CC`

### Phase 2 — Unit tests (`id-number-generator.service.test.ts`)
3. Validate checksum against ≥ 3 known valid Belgian SSINs (pre-2000 and post-2000)
4. Assert male → odd SSS, female → even SSS
5. Test `formatBelgianSSIN` output shape

### Phase 3 — Vue component (`id-number-generator.vue`)
6. Keep existing country `c-select`
7. Add optional `n-date-picker` for date of birth (blank = random)
8. Add optional gender `c-select` (Male / Female / — random —)
9. Add `c-checkbox` or toggle "Fictitious (non-existing) number" — when checked, passes `fictitious: true` to the service (uses high serial range)
10. `c-button` “Generate” triggers `generateBelgianSSIN`
11. Result card (hidden until first generate) shows:
    - Formatted SSIN (`XX.XX.XX-XXX.XX`) + copy button
    - Unformatted raw 11-digit SSIN + copy button
    - Uses `useCopy` composable from `@/composable/copy`

### Phase 4 — Tool registration (`index.ts`)
12. Set `description: 'Generate a valid Belgian national identification number (NISS/INSZ)'`

### Phase 5 — E2E (`id-number-generator.e2e.spec.ts`)
13. Add a test: clicking Generate produces visible SSIN output
14. Add a test: enabling "Fictitious" and clicking Generate produces a valid SSIN with serial ≥ 500

---

**Relevant files**
- `src/tools/id-number-generator/id-number-generator.vue` — full rewrite
- `src/tools/id-number-generator/id-number-generator.service.ts` — new implementation
- `src/tools/id-number-generator/id-number-generator.service.test.ts` — unit tests
- `src/tools/id-number-generator/id-number-generator.e2e.spec.ts` — E2E update
- `src/tools/id-number-generator/index.ts` — description update

**Reference patterns**
- `src/tools/bcrypt/bcrypt.vue` — `c-card`, `c-input-text` (readonly), `c-button`, `useCopy`
- `useCopy({ source: ref })` from `@/composable/copy`

**Decisions**
- All inputs optional; missing values are randomised
- Generation triggered by button click only
- Country dropdown kept for future country additions
- Default serial range (low) avoids realistic collisions with real numbers
- Fictitious mode uses the high serial range (500–999), which the Belgian registry reserves and never assigns to real persons
