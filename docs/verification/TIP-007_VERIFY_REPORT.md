# TIP-007 Execution Fabric Verify Report

Date: 2026-07-23

Overall status: `READY_WITH_DEFERRED`

This report covers the locally authorized TIP-007 provider-independent
Execution Fabric and Manual Provider Bridge. Billing, remote GitHub Actions,
provider APIs, Verification Governance (TIP-008), and Release Governance remain
outside this verification boundary.

## Requirement coverage

Applicable acceptance criteria: 12

Implemented: 12

| Requirement | Result | Primary evidence |
|---|---|---|
| Immutable SHA-256 instruction artifacts | PASS | `EF-01`, database append-only trigger |
| Strict four-section Completion Report schema | PASS | contract unit tests, `EF-03/04` |
| Provider/model/role and input/output artifact attribution | PASS | `EF-01`, `EF-03` |
| Retry appends and never overwrites | PASS | `EF-02`, attempt uniqueness, agent-run guard |
| Builder deviations are Contractor-visible | PASS | `EF-05/06/07`, Control Room projection |
| Material deviations block dependent TIPs | PASS | `EF-05/06/07` |
| Missing report fields fail atomically | PASS | `EF-04` |
| Immutable report and resource-usage ledgers | PASS | `EF-03/04`, database triggers and runtime grants |
| Cross-workspace references fail closed | PASS | `EF-08` |
| Concurrent imports serialize | PASS | `EF-09` |
| Execution readiness governs `BUILDING` | PASS | `EF-10/11` |
| Verification and Release boundaries remain closed | PASS | `EF-12`, `CR-08` |

## Scenario results

Manual Provider Bridge and database:

- `EF-01`: immutable hashed instruction and attributed attempt 1 PASS.
- `EF-02`: retry creates attempt 2 and retains attempt 1 PASS.
- `EF-03`: report, artifact, usage, status, and audit commit atomically PASS.
- `EF-04`: missing section creates no report or partial status mutation PASS.
- `EF-05`: imported material deviation appears in Contractor projection PASS.
- `EF-06`: dependent TIP start is blocked by an open material deviation PASS.
- `EF-07`: governed resolution allows the completed dependency to proceed PASS.
- `EF-08`: cross-workspace TIP access fails without disclosure PASS.
- `EF-09`: concurrent report import produces exactly one report PASS.
- `EF-10`: Mission without completed execution evidence cannot enter BUILDING PASS.
- `EF-11`: Mission with completed TIPs and no material deviation enters BUILDING PASS.
- `EF-12`: BUILDING to VERIFYING still requires Verification Governance PASS.

Control Room:

- `CR-08`: Manual Bridge and artifact nodes are operational without implying
  independent verification PASS.
- Architecture and Operations lenses show authoritative workspace-scoped
  execution counts and open deviations.
- Mobile 390x844 inspection showed no horizontal overflow.
- Automated accessibility scans reported zero serious or critical violations.

## Migration and database rehearsal

Fresh install:

- Applied all ten migrations to an isolated empty PostgreSQL database: PASS.
- Applied the runtime-role grant script: PASS.
- Immutable execution dependency, artifact, report, and resource ledgers expose
  `SELECT, INSERT` only to `hiveos_app`.
- AgentRun and ExecutionDeviation expose only the additional `UPDATE` required
  for their single governed terminal transition; `DELETE/TRUNCATE` are revoked.

Upgrade:

- Applied the nine-migration TIP-006 baseline to an isolated database.
- Inserted a pre-existing Workspace and EXPLORING Mission at version 7.
- Applied `20260723130000_execution_fabric`.
- Verified the Mission remained `EXPLORING`, version 7, and ExecutionTip and
  CompletionReport tables existed: PASS.
- Both temporary rehearsal databases were deleted after verification. They
  contained only synthetic rehearsal fixtures.

## Technical health

| Check | Result |
|---|---|
| Production build | PASS |
| Type errors | 0 |
| Lint errors | 0 |
| Lint warnings | 0 |
| Unit tests | 97 passed, 0 failed, 0 skipped |
| Integration tests | 88 passed, 0 failed, 0 skipped |
| E2E tests | 42 passed, 0 failed, 0 skipped |
| Aggregate tests | 227 passed |
| Serious/critical accessibility violations | 0 |
| Fresh migration rehearsal | PASS |
| Upgrade from TIP-006 rehearsal | PASS |

The first sandboxed build could not reach Google Fonts. Re-running the same
build with network access succeeded; this was an environment access condition,
not a product failure.

## Scope boundary verification

- Provider mode is fixed to `MANUAL_BRIDGE`; no provider API adapter exists.
- No background queue, webhook, billing, or token-purchase behavior was added.
- Imported provider technical-health values remain execution claims.
- TIP-008 Verification Governance was not opened or implemented.
- `BUILDING → VERIFYING`, `VERIFYING → REVIEW`, and `REVIEW → RELEASED`
  remain guarded.

## Deferred obligations

### OBL-FND-001: remote reproducibility

Status: `BLOCKED_EXTERNAL / OWNER_PAUSED`

The Owner paused billing and GitHub Actions work. No remote run, commit, push,
or workflow bypass was attempted.

### OBL-DEP-001: dependency audit refresh

Status: `DEFERRED_PERMISSION`

A fresh npm registry audit still requires explicit permission to transmit the
dependency manifest. No new vulnerability result is claimed.

### OBL-DEP-002: Prisma pg adapter deprecation

Status: `DEFERRED_PINNED_DEPENDENCY`

The pre-existing upstream `pg` concurrency warning remains tracked for a future
pinned dependency upgrade. It does not cause a current test failure.

## Gate assessment

- TIP-007 local implementation: `READY_WITH_DEFERRED`.
- Execution Fabric local verification: PASS.
- G5 is not evaluated because TIP-008 is not authorized or implemented.
- TIP-008 remains closed.
