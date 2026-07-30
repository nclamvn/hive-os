# TIP-023F-R2 — Inter Typography Consolidation

## Header

- TIP-ID: `TIP-023F-R2`
- Project: HIVE OS Enterprise Core
- Modules: Design System, Enterprise UI, App Shell
- Depends on: TIP-002A, TIP-002B, TIP-023F-R1
- Priority: P1
- Status: `AUTHORIZED BY OWNER — 2026-07-30`

## Owner direction

Application headings are visually inconsistent because some surfaces use a
serif display face while others use the interface sans. Consolidate product
typography on Inter.

## Requirements

1. Use Inter for application titles, theses, section headings, controls and
   body copy in Vietnamese and English.
2. Keep IBM Plex Mono only for identifiers, hashes, timestamps, gates and
   tabular utility data.
3. Remove Literata and Be Vietnam Pro from the application font payload.
4. Preserve the existing type scale, hierarchy, line lengths and responsive
   behavior unless a local optical correction is required.
5. Preserve Vietnamese-first locale and system-first appearance defaults.

## Acceptance criteria

- No application title or thesis resolves to a serif family.
- Existing `font-serif`, `text-thesis` and Mission Command thesis roles resolve
  to Inter.
- Inter contains the required Vietnamese and Latin subsets at weights 400, 500
  and 600.
- Typecheck, lint, unit, production build and focused browser inspection pass.
- No page-level horizontal overflow is introduced at 390 or 1280 pixels.

## Constraints

- This amendment changes typography only.
- IBM Plex Mono remains a narrowly scoped data face.
- No spacing, color, kernel, authorization or provider contract is inferred.
- Existing dirty visual artifacts remain outside scope.

## Reports

- `docs/verification/TIP-023F-R2_COMPLETION_REPORT.md`
