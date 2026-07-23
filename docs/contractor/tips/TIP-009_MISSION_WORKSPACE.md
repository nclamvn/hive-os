# TIP-009 — Mission Workspace UX

Status: `READY_WITH_DEFERRED — LOCAL VERIFIED`

Owner authorization: `2026-07-23`

## Task

Turn the Mission detail route into the canonical governed workspace across the
full Mission lifecycle. The workspace composes existing bounded-context
projections; it does not become a new source of truth.

## In Scope

- Persistent Mission identity, assurance, lifecycle, progress and next-gate
  context.
- Nine URL-addressable lenses: Overview, Contract, Research graph, Evidence,
  Claims, Build, Verify, Decisions, and Release.
- Workspace-scoped projections from Mission, Truth, Execution, Verification,
  and Release ledgers.
- Existing authorized Mission, obligation, and decision controls in their
  relevant context.
- Honest empty states and responsive navigation from 320 to 1600 pixels.

## Out of Scope

- New truth, execution, verification, or release authority.
- Provider APIs, background workers, billing, and production deployment.
- Public Observatory and report export surfaces, which belong to TIP-011.

## Acceptance Criteria

- Every lens is deep-linkable and defaults safely to Overview.
- Unknown lens values fall back without error or data disclosure.
- Counts and records are Mission- and Workspace-scoped.
- Progress remains derived from approved obligations and is unavailable before
  approval.
- Execution imports remain labelled as claims rather than verification.
- Release shows only immutable governed releases/manifests for the Mission.
- Empty lenses explain which governed action produces data.
- Keyboard focus, mobile wrapping, and accessibility pass without horizontal
  page overflow.

## Acceptance Scenarios

| ID | Scenario | Expected |
| --- | --- | --- |
| MW-01 | Open a Mission without a view parameter | Overview is selected |
| MW-02 | Open each supported view parameter | Correct authoritative lens renders |
| MW-03 | Open an unknown view parameter | Overview renders safely |
| MW-04 | Mission has no Truth/Execution/Verify records | Honest directed empty states |
| MW-05 | Mission has governed records | Only that Mission’s rows appear |
| MW-06 | Viewer opens Mission Workspace | Read succeeds, mutation controls remain absent |
| MW-07 | Mobile viewport at 390px | No page overflow or clipped controls |
| MW-08 | Automated accessibility scan | No serious or critical violations |
