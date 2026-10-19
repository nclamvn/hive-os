# TIP-023F-R1 — Premium Product Refinement

## Header

- TIP-ID: `TIP-023F-R1`
- Project: HIVE OS Enterprise Core
- Modules: Enterprise UI, Query Contracts, Workflow Accountability
- Depends on: TIP-023F
- Priority: P1
- Status: `AUTHORIZED BY OWNER — 2026-07-30`

## Intent

Refine the Mission Command Surface from a correct enterprise projection into a
quiet, precise operating instrument. This revision does not change kernel,
authorization, query or workflow contracts.

## Design direction

- Canvas Graphite `#111315`, Surface Carbon `#15181C`, Hairline Steel
  `#2A2E33`, Ink Chalk `#F2F1ED`, Muted Alloy `#969BA3`.
- Signal colors remain semantic and are never decorative.
- Literata is reserved for the compact command thesis. Be Vietnam Pro carries
  operating copy. IBM Plex Mono carries identifiers, timestamps and scope data.
- The six-lane lifecycle trace remains the sole visual signature.
- Empty states must expose real operating structure and explicit gaps without
  fabricating records or telemetry.
- Hover and selection use precise line, contrast and trace changes instead of
  large filled rectangles.

## Task

1. Replace the oversized marketing-style Mission empty state with a compact
   six-lane operational datum that represents an honestly empty bounded page.
2. Keep the contextual inspector useful without a selected Mission by showing
   real view, page-bound, visible-set, scope and projection facts.
3. Show the projection refresh timestamp rather than an ambiguous freshness
   label.
4. Make active view, row and inspector interactions use restrained precision
   cues while preserving visible keyboard focus.
5. Improve bounded-page and active-filter legibility without introducing an
   unbounded query or material bulk command.
6. Preserve Vietnamese/English, system/light/dark, responsive and accessibility
   behavior.

## Acceptance criteria

### PR-01 — Honest zero-state datum

An empty Mission result renders all six real lifecycle lanes as explicit gaps,
one compact explanation and the authorized next action. It contains no
synthetic mission, metric, risk or progress.

### PR-02 — Useful unselected inspector

Without a selected Mission, the inspector reports the active saved view and its
visibility, visible/total count, page bound, Workspace scope and projection
timestamp using projection data already authorized by the server.

### PR-03 — Precision interaction language

Active modes and selected records are communicated by line, contrast and trace
state. Hover does not rely on a large opaque rounded rectangle. Focus remains
clearly visible.

### PR-04 — Bounded legibility

The page ledger distinguishes visible rows from the optional exact total and
states the 25-record query bound. Active filters can be reset without clearing
unrelated navigation context.

### PR-05 — Responsive and accessible

The surface works at 320, 390, 768, 1280 and 1600 pixels with no page-level
horizontal overflow. Interactive controls remain named and keyboard reachable,
and reduced-motion preferences are respected.

### REG-01 — Regression

Typecheck, lint, unit, integration, E2E and production build pass. Existing
Mission Command graph, grid, chronology, selection, command palette and module
routes remain functional.

## Constraints

- No schema, kernel, authorization or provider change.
- No external UI, graph, grid, state or animation dependency.
- No gradients, glass, neon, decorative telemetry or card-stack dashboard.
- Existing dirty visual artifacts remain outside scope.

## Reports

- `docs/verification/TIP-023F-R1_COMPLETION_REPORT.md`
- `docs/verification/TIP-023F-R1_VERIFY_REPORT.md`
