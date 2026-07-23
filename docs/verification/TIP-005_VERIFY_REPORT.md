# TIP-005 Truth Kernel Verify Report

Date: 2026-07-23

Overall status: `READY_WITH_DEFERRED`

This report covers the authorized TIP-005 Truth Kernel and the read-only HIVE OS
Control Room projection. It does not authorize TIP-006 or any later bounded
context.

## Requirement coverage

Applicable acceptance criteria: 7

Implemented: 7

| Requirement | Result | Primary evidence |
|---|---|---|
| Exact spans match immutable snapshot content | PASS | `TK-01`, `TK-U01` |
| Corroboration requires two independent qualifying sources | PASS | `TK-02`, `TK-U02` |
| Conflicting retained values create a dispute | PASS | `TK-03`, `TK-U03`, `TK-U04` |
| Honest-null is explicit and EMPTY_CERTIFIED requires a certificate | PASS | `TK-04` |
| Falsified/retracted ledgers remain queryable | PASS | `TK-05`, `TK-11` |
| Public/export projections omit forbidden objects and fields | PASS | `TK-06`, `TK-09` |
| Deterministic truth, provenance and hygiene invariants are reproducible | PASS | `TK-01` through `TK-12` |

## Scenario results

Truth Kernel:

- `TK-U01` through `TK-U04`: PASS.
- `TK-01` through `TK-08`: PASS.
- `TK-09` governed source-to-dispute loop with provenance, projection and
  audit: PASS.
- `TK-10` cross-workspace ownership and object isolation: PASS.
- `TK-11` concurrent terminal-state serialization and late-write rejection:
  PASS.
- `TK-12` Viewer read/write capability boundary: PASS.

Control Room and responsive shell:

- `CR-01` through `CR-06`: PASS.
- `ID-24 / OBL-UI-001`: PASS at 390px.
- No horizontal overflow at the covered 390px Control Room, mission and shell
  scenarios.
- Keyboard operation, dialog focus trapping and focus return: PASS.
- Automated accessibility scans: zero serious or critical violations.

## Migration and database rehearsal

Fresh install:

- Applied all eight migrations to an isolated empty PostgreSQL database: PASS.
- Applied the runtime-role grant script: PASS.
- Verified append-only runtime privileges for Snapshot, EvidenceSpan,
  ClaimVersion, ClaimEvidence, Dispute, HonestNullRecord and ProvenanceEdge:
  `SELECT, INSERT` only.
- Verified all seven append-only database triggers: PASS.

Upgrade:

- Checked out the exact `cb53c5e` migration set into an isolated temporary
  directory.
- Applied its seven migrations and inserted a pre-existing approved Mission.
- Applied `20260723074606_truth_kernel`.
- Verified the existing Mission remained unchanged and the Truth tables were
  present: PASS.
- Both temporary rehearsal databases were removed after verification.

## Technical health

| Check | Result |
|---|---|
| Production build | PASS |
| Type errors | 0 |
| Lint errors | 0 |
| Lint warnings | 0 |
| Unit tests | 85 passed, 0 failed, 0 skipped |
| Integration tests | 71 passed, 0 failed, 0 skipped |
| E2E tests | 40 passed, 0 failed, 0 skipped |
| Aggregate tests | 196 passed |
| Serious/critical accessibility violations | 0 |
| Fresh migration rehearsal | PASS |
| Upgrade from `cb53c5e` rehearsal | PASS |

## Deferred obligations

### OBL-FND-001: remote reproducibility

Status: `BLOCKED_EXTERNAL`

GitHub Actions run `29735234751` did not execute because of Owner account
billing. Attempt 2 was triggered on 2026-07-23 against the unchanged
`cb53c5e` commit and failed again with zero executed steps. Billing remains the
external blocker. Do not create an empty commit or alter the workflow to bypass
this gate.

### OBL-DEP-001: dependency audit refresh

Status: `DEFERRED_PERMISSION`

The current task did not transmit the dependency manifest to the npm registry,
so a fresh vulnerability result is not claimed. The last verified report at the
handoff was five moderate and zero high or critical vulnerabilities.

### OBL-DEP-002: Prisma pg adapter deprecation

Status: `DEFERRED_PINNED_DEPENDENCY`

Concurrency integration tests pass, but the pinned Prisma PostgreSQL adapter
emits the upstream `pg` warning that overlapping `client.query()` calls will be
unsupported in `pg` 9. HIVE OS remains pinned to `pg` 8.22.0. Before any pg 9
upgrade, reproduce this suite against the candidate Prisma adapter and require
the warning to be absent.

## Gate assessment

- TIP-005 implementation: `READY_WITH_DEFERRED`.
- G4 local Truth Loop evidence: PASS.
- Remote reproducibility: not proven.
- TIP-006: not authorized and not started.
