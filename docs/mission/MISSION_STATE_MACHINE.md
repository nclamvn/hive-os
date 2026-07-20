# Mission State Machine (TIP-004)

Source of truth: `src/modules/mission-kernel/state-machine.ts` (`classifyTransition`).

## States
DRAFT, INTAKE, SCOPED, CONTRACT_REVIEW, APPROVED, EXPLORING, BUILDING,
VERIFYING, REVIEW, RELEASED (primary line) and side states PARTIAL, BLOCKED,
REFUTED, CANCELLED, ARCHIVED.

## Publicly executable in TIP-004 (human command)
- DRAFT → INTAKE, INTAKE → SCOPED (`transitionMission`)
- SCOPED → CONTRACT_REVIEW (`submitContract`)
- CONTRACT_REVIEW → APPROVED (`approveContract`)

## Later-stage transitions — recognized but FAIL CLOSED
- APPROVED → EXPLORING → `TRUTH_KERNEL_REQUIRED`
- EXPLORING → BUILDING → `EXECUTION_FABRIC_REQUIRED`
- BUILDING → VERIFYING → `VERIFICATION_KERNEL_REQUIRED`
- VERIFYING → REVIEW → `VERIFICATION_KERNEL_REQUIRED`
- REVIEW → RELEASED → `RELEASE_AUTHORIZATION_REQUIRED`
No UI control bypasses these.

## Side states
- BLOCKED: allowed from INTAKE/SCOPED/CONTRACT_REVIEW/APPROVED, requires a
  reason, records `blockedFromStatus`, and creates an OPEN Escalation atomically.
- Resume: BLOCKED → the recorded prior state only (any other target is INVALID).
- CANCELLED (from DRAFT/INTAKE/SCOPED/CONTRACT_REVIEW/APPROVED/BLOCKED),
  PARTIAL and REFUTED (from APPROVED) require an approved material Decision.
- ARCHIVED from terminal states (RELEASED/PARTIAL/REFUTED/CANCELLED). Archived
  is terminal — no outgoing transition is valid.

Every transition requires an authenticated actor + authorized WorkspaceContext,
optimistic version check, explicit reason, and a transactionally linked
AuditEvent. Tests: MK-11..16, MK-22..24, MK-34 (table-driven).
