# TIP-023F — Enterprise Mission Command Surface

## Header

- TIP-ID: `TIP-023F`
- Project: HIVE OS Enterprise Core
- Modules: Enterprise UI, Query Contracts, Workflow Accountability
- Depends on: TIP-023B, TIP-023C, TIP-023D, TIP-023E
- Priority: P0
- Status: `AUTHORIZED BY OWNER — 2026-07-30`

## Requirements

| ID      | Requirement |
| ------- | ----------- |
| ENT-013 | Provide an organizational navigator, Mission Command Graph, operational grid and contextual inspector |
| ENT-014 | Provide saved views, bulk selection/actions and a command palette constrained by authorization |
| ENT-015 | Preserve VN/EN, system/light/dark, accessibility and responsive operation from 320 to 1600 pixels |

## Design direction

The primary Workspace route becomes a neutral graphite **mission trace
instrument**. Six lifecycle lanes form the signature: Intake, Contract, Truth,
Execution, Verification and Release. Every mark represents stored state or an
explicit gap. The surrounding shell stays quiet, dense and typographic.

- Palette: existing Precision Instrument semantic tokens only.
- Display type: Literata, reserved for one compact command thesis.
- Body type: Be Vietnam Pro.
- Data/utility type: IBM Plex Mono.
- No gradients, glass, neon, fabricated telemetry or decorative card stacks.

## Task

1. Replace the default Workspace dashboard with an enterprise Mission Command
   Surface backed by bounded query contracts and operational projections.
2. Add Organization → Unit → Portfolio → Workspace context to the shell without
   exposing unauthorized sibling records.
3. Provide graph, grid and chronology views over the same bounded Mission set.
4. Represent each Mission across deterministic lifecycle lanes using only
   stored status, contract identity, assignment and SLA facts.
5. Keep selection stable across view switches and expose a contextual inspector
   with authority, state, provenance facts and permitted next actions.
6. Surface the actor's bounded work inbox and explicit projection freshness.
7. Provide URL-addressable saved operational views with visible owner and
   visibility semantics.
8. Provide keyboard multi-selection and read-safe bulk actions. Material
   commands remain server-authorized per resource.
9. Provide an authorization-derived command palette with keyboard invocation.
10. Preserve the existing governed-object finder and module routes.

## Acceptance criteria

### SURF-01 — Default enterprise surface

The authenticated Workspace root renders the Mission Command Surface, not the
legacy composer/dashboard card sequence. Empty state directs the operator to a
real authorized next action.

### SCOPE-01 — Organizational context

The shell exposes the current Organization, Unit, Portfolio and Workspace from
authorized server data. Missing Portfolio is represented honestly and no
foreign Organization record is disclosed.

### GRAPH-01 — Governed lifecycle graph

Every visible Mission occupies one row across six deterministic lanes. Its
stored status selects the active lane; earlier/later lanes are represented as
retained path or explicit gap without inventing progress, risk or completion.

### GRID-01 — Bounded operational grid

The grid uses the TIP-023C Mission cursor, status/assurance filter and stable
sort contracts. Pagination is URL-addressable and never loads an unbounded
tenant collection.

### CTX-01 — Stable contextual inspector

Selecting a Mission in graph, grid or chronology opens one inspector containing
stored identity, status, assurance, timestamps, authority and authorized next
actions. Switching view mode does not discard the selection.

### WORK-01 — Accountable work

The actor's inbox is cursor bounded and reports real assignment/SLA state or an
explicit empty state. Projection freshness is visible and never restated as
authoritative kernel truth.

### CMD-01 — Authorized command palette

`⌘/Ctrl+K` opens a focus-trapped command palette. Commands are derived from
server authorization; a hidden or disabled command never substitutes for
server enforcement.

### VIEW-01 — Saved and bulk views

Operational view presets are URL-addressable and show owner/visibility. The
grid supports keyboard-accessible selection and read-safe bulk reference
copy/export; no bulk domain mutation bypasses per-resource authorization.

### UI-01 — Enterprise visual contract

The surface uses one continuous instrument canvas, disciplined dividers,
compact controls and the lifecycle trace signature. It does not degenerate into
a decorative stack of cards or duplicate the old dashboard.

### UI-02 — Responsive and accessible

The complete surface works at 320, 390, 768, 1280 and 1600 pixels, in VN/EN and
system/light/dark. It has no horizontal page overflow, retains visible keyboard
focus, names interactive controls, traps modal focus and respects reduced
motion.

### REG-01 — Regression

Typecheck, lint, unit, integration, E2E and production build pass. Existing
Mission, Truth, Execution, Verification and Settings routes remain functional.

## Constraints

- Server Components load authoritative/bounded data; the interactive canvas is
  a narrow Client Component boundary.
- No external graph, grid, search, state-management or animation dependency.
- No schema or kernel mutation is inferred from a visual interaction.
- Mobile becomes a structured record list with a stacked inspector; it is not
  a compressed desktop grid.
- Vietnamese and system appearance remain first-visit defaults.
- Existing dirty visual artifacts remain outside scope.

## Reports

- `docs/verification/TIP-023F_COMPLETION_REPORT.md`
- `docs/verification/TIP-023F_VERIFY_REPORT.md`
