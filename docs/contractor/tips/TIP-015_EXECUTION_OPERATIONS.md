# TIP-015 — Execution Operations

Status: `READY_WITH_DEFERRED — LOCAL VERIFIED`

Owner authorization: `2026-07-23`

## Task

Turn the existing Execution Fabric and Manual Provider Bridge into a complete
operator surface. The page must support the governed path from an approved
Mission through exploration, execution-package definition, immutable manual
instructions, external exchange, strict Completion Report import, retries,
deviation resolution, and readiness-gated entry to BUILDING.

## Boundaries

- Execution Fabric and Mission Kernel remain authoritative.
- Server actions resolve trusted WorkspaceContext and call kernel services only.
- Provider credentials and direct provider APIs remain out of scope.
- Instruction and Completion Report artifacts are immutable and content-hashed.
- Report import is strict and atomic; missing fields are never inferred.
- Imported provider results remain execution claims, never independent
  verification.
- A retry appends a new attempt and never overwrites history.
- Material deviations block dependent work until an authorized reviewer records
  a resolution.
- Viewer has read-only access; cross-workspace identifiers fail closed.

## Acceptance scenarios

| ID | Scenario | Expected |
| --- | --- | --- |
| EO-01 | Owner opens an approved Mission for exploration | Mission becomes EXPLORING with audit |
| EO-02 | Operator defines a package with active compatible skill | TIP and SkillRun are created |
| EO-03 | Operator issues a manual instruction | Immutable artifact and attributed attempt 1 appear |
| EO-04 | Operator imports a complete report | Report, artifact, usage and terminal state commit atomically |
| EO-05 | Operator imports malformed/missing JSON | No partial report or state change |
| EO-06 | Terminal attempt is retried | New instruction and attempt append; history remains |
| EO-07 | Material deviation is resolved | Resolution is audited; original report remains immutable |
| EO-08 | Ready Mission enters BUILDING | Kernel readiness gate passes |
| EO-09 | Viewer opens Execution Operations | Ledger is readable; controls are absent |
| EO-10 | 320px viewport and accessibility scan | No overflow or serious/critical violations |

## Local closure

Closed on `2026-07-23`.

- Execution Operations exposes the complete governed path from approved Mission
  to exploration, work package, immutable instruction, external exchange,
  strict report import, retry, deviation review, and readiness-gated BUILDING.
- All writes pass through Mission Kernel or Execution Fabric with trusted
  WorkspaceContext.
- Invalid report JSON and structurally incomplete reports fail without changing
  the awaiting attempt.
- Ledger views retain provider/model/role attribution, exact instruction
  content, hashes, reports, coverage, resource usage, predecessors, and attempt
  history.
- Desktop and 320px UI inspection passed with no horizontal overflow.
- Typecheck, lint, production build, 106 unit, 99 integration, and 57 E2E
  scenarios passed.
- Provider APIs, Verification UI, Settings productization, billing, and remote
  CI were not changed.

See `docs/verification/TIP-015_VERIFY_REPORT.md`.
