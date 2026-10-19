# Research UX — approved implementation, 2026-10-14

Engineering continuation of TIP-117. Owner approved the live QA priorities;
no new research milestone, provider grant, deployment, dependency or schema change.
Contractor uses a compact specification and completion report, not extra gates.

## Design and scope

Keep existing Inter type and tokens: canvas #f4f6f8, surface #ffffff, ink #0c1424,
muted #617086, line #dce3eb, action navy #17366a. Left-aligned workspace grid,
readable prose, one clear primary action. No decorative dashboard or new workflow.

```
Research: [goal / selected mission / explicit execution mode]
          [work grouped by exact question: latest state + prior attempts]
          [examples and workbenches] [expert tools, collapsed]
Mission:  [title / objective / scope / desired result]
          [editable draft contract details, collapsed] [create draft]
Workbench:[problem] [prepare prompt OR import original output]
          [argument / remaining gaps / checked scope]
          [explicit local draft save/restore + evidence export]
```

## Acceptance requirements

- R1 Sidebar New mission opens missions/new in desktop/tablet/mobile. Existing
  server authorization remains intact.
- R2 Main Research goal precedes examples and inactive engineering controls.
  Submission is labelled as a request, never as proof of a running model.
- R3 Recent work groups only exact normalized question matches within the same
  mission. Show newest state and attempt count, retain every prior attempt and
  review/import control under disclosures. No semantic merging or erased failures.
- R4 Mission creation foregrounds the four human-readable fields. Contract
  details remain editable; any suggested defaults are visibly disclosed as drafts,
  not AI-generated plans or accepted obligations. No server/kernel rule change.
- R5 Workbench hides JSON/schema detail until needed, preserves raw imports and
  checker semantics. Draft protection is explicit, tab-session storage only,
  scoped by user/workspace, input-only with no restored verified status. Show
  storage errors and expiry/lifetime clearly; do not auto-dispatch on restore.
- R6 EN/VI, keyboard operation, 390/900/1440 layouts and real browser navigation
  verified. No live research submission; only isolated synthetic E2E fixtures.

## Boundaries and verification

Reuse current modules and actions; no new planning engine, gate, agent runtime,
database persistence, hidden model call or new dependency. Preserve K5/K6 evidence.
Main coordinates Builders and inspects output; Builders implement separate files.
Run focused unit/type/lint, one reusable LOCAL_QA build after disk check, then
selected isolated E2E plus read-only live browser QA. Report exact deferred gaps.
