# TIP-023D — Enterprise Workflow and Accountability

## Header

- TIP-ID: `TIP-023D`
- Project: HIVE OS Enterprise Core
- Module: Workflow Accountability
- Depends on: TIP-023B
- Uses: TIP-023C bounded query primitives
- Priority: P1
- Status: `AUTHORIZED BY OWNER — 2026-07-30`

## Requirement

| ID      | Requirement                                                                                      |
| ------- | ------------------------------------------------------------------------------------------------ |
| ENT-012 | Implement assignment, responsibility, due time, SLA, escalation and configurable approval chains |

## Task

1. Add retained work assignments with accountable roles, validity, due time,
   assignee, assigning authority, reason and optimistic version.
2. Permit only one active accountable assignment for a target while retaining
   ended assignment history.
3. Add versioned Organization/Workspace SLA policies with warning, breach and
   escalation thresholds.
4. Derive `UNASSIGNED`, `ON_TRACK`, `DUE_SOON`, `OVERDUE`, `ESCALATION_DUE`
   and `COMPLETE` from retained policy, due time, target state and evaluation
   time.
5. Materialize idempotent SLA escalations into the existing governed
   Escalation ledger without rewriting assignment history.
6. Add configurable ordered approval-chain definitions, requests and
   append-only approval actions.
7. Enforce each step's required capability through TIP-023B and enforce
   actor independence across configured steps.
8. Provide a cursor-bounded work inbox and authorized bulk reassignment with
   one explicit success/failure outcome per requested resource.

## Acceptance criteria

### WORK-01 — Honest accountability

Every active RuntimeObligation appears in the accountability projection with
one active accountable assignment or explicit `UNASSIGNED`; missing ownership
is never hidden by omission.

### WORK-02 — Retained assignment history

Reassignment ends the prior row and creates a new row atomically. Database
constraints prevent two active accountable owners for one target. Historical
assignment and audit records are not rewritten.

### WORK-03 — Derived SLA

SLA state is derived deterministically from captured policy version, due time,
target completion and evaluation time. Clock-dependent state is not persisted
as fabricated truth.

### WORK-04 — Escalation

An escalation-due assignment creates at most one open governed escalation.
Repeated evaluation is idempotent and tenant scoped.

### WORK-05 — Approval chain

Definitions have ordered steps, required capabilities and approval thresholds.
Requests advance only after their current step is satisfied. Configured
independence and TIP-023B separation of duties fail closed.

### WORK-06 — Delegation expiry

Every future assignment, reassignment and approval command re-evaluates scoped
authority at command time. Expired/revoked grants cannot authorize new effects
and do not erase earlier accepted history.

### WORK-07 — Work inbox and bulk outcomes

Inbox reads are cursor bounded. Bulk reassignment accepts at most 100 unique
items and returns exactly one success or bounded failure result for every
input; no partial result is silent.

### WORK-08 — Tenant database defense

Workflow tables use Organization/Workspace composite relationships and forced
transaction-local PostgreSQL RLS. Foreign assignees, targets, chains and
requests fail closed.

### WORK-09 — Regression

Typecheck, lint, unit, integration, E2E, production build, fresh migration and
legacy upgrade rehearsal pass without weakening TIP-023B or TIP-023C.

## Constraints

- PostgreSQL remains the initial authority and workflow store.
- Work-item target polymorphism is validated under row locks by the workflow
  kernel; database checks constrain target shape and tenant relationships.
- SLA evaluation never depends on a client clock.
- Bulk reassignment is intentionally per-resource transactional so failures
  are isolated and visible.
- UI Mission Command Surface remains TIP-023F; this TIP provides the core and
  cursor-native work-inbox port.
- No external workflow engine, queue, notification provider or model API.
- Existing dirty visual artifacts remain outside scope.

## Reports

- `docs/verification/TIP-023D_COMPLETION_REPORT.md`
- `docs/verification/TIP-023D_VERIFY_REPORT.md`
