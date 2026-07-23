# TIP-008 Verification Governance Verify Report

Date: 2026-07-23

Overall status: `READY_WITH_DEFERRED`

This report covers the locally authorized TIP-008 Verification and Release
Governance boundary. Billing, remote GitHub Actions, provider APIs, production
deployment, TIP-009 Mission Workspace, and TIP-011 Observatory product
surfaces remain outside this verification boundary.

## Requirement coverage

Applicable acceptance criteria: 16

Implemented: 16

| Requirement | Result | Primary evidence |
|---|---|---|
| Immutable governed scenarios linked to approved requirements | PASS | `VG-01`, append-only trigger |
| Verification begins only from completed Execution Fabric evidence | PASS | `VG-01`, `beginVerificationRun` readiness checks |
| Research/Regulated verifier independence | PASS | `VG-08`, retained Builder/Verifier provider-model comparison |
| Strict four-section Verify Report | PASS | verification contract unit tests, `VG-01..07` |
| Exact requirement and required-scenario coverage | PASS | contract unit tests, `VG-09..11` |
| Deterministic health/readiness recomputation | PASS | contract unit tests, contradictory-status rejection |
| Required corruption runs for high assurance | PASS | contract unit tests, `VG-01..07` |
| Atomic concurrent report completion | PASS | `VG-09..11` |
| Human verification and release sign-offs | PASS | `VG-01..07`, `VG-12..16` |
| Evidence-ceiling calculation for exact ClaimVersions | PASS | `VG-12..16` |
| OPEN_INCOMPLETE never becomes EMPTY_CERTIFIED | PASS | release kernel explicit certificate guard |
| Public-release assurance and state policy | PASS | `VG-12..16`, release policy checks |
| Immutable exact release manifest | PASS | `VG-12..16`, append-only trigger |
| Governed Mission path through VERIFYING/REVIEW/RELEASED | PASS | integration state assertions |
| Manifest-only future Observatory projection | PASS | omitted before RELEASED, visible after RELEASED |
| Workspace isolation and least-privilege runtime grants | PASS | scoped kernels, migration rehearsal |

## Scenario results

Verification and governance:

- `VG-01..07`: independent run, four-section report, corruption evidence,
  verification sign-off, and transition to REVIEW PASS.
- `VG-08`: Research verifier reusing the Builder provider/model pair is
  rejected without creating a VerificationRun or mutating Mission state PASS.
- `VG-09..11`: contradictory overall status is rejected and competing report
  completions create exactly one immutable report PASS.
- `VG-12..16`: missing release sign-off blocks; exact public manifest succeeds;
  projection is omitted before RELEASED and manifest-backed after RELEASED;
  append-only mutation is rejected PASS.

Control Room:

- `CR-09`: VER-31 Verification and RLS-32 Release Governance are operational
  from workspace-scoped ledger counts PASS.
- The Operations lens exposes the real ordered boundary:
  `Requirement coverage → Scenario results → Technical health → Release ceiling`.
- Desktop 1536×1024 and mobile 390×844 evidence is retained under
  `artifacts/tip-008/`.
- No horizontal overflow or serious/critical automated accessibility violation
  was found.

## Migration and database rehearsal

Fresh install:

- Prisma applied all 11 migrations to an isolated empty PostgreSQL database.
- Runtime-role setup completed.
- VerificationReport and ReleaseManifest expose no runtime UPDATE/DELETE.
- VerificationRun retains the one governed UPDATE needed for completion.

Upgrade:

- Applied the ten-migration TIP-007 baseline to an isolated database.
- Inserted a synthetic Research Mission in BUILDING at version 9.
- Applied `20260723170000_verification_governance`.
- Verified the Mission title, status, and version were unchanged and the
  verification/report/manifest tables existed.
- Both isolated rehearsal databases were deleted after verification; they
  contained only synthetic fixtures.

## Technical health

| Check | Result |
|---|---|
| Production build | PASS |
| Type errors | 0 |
| Lint errors | 0 |
| Lint warnings | 0 |
| Unit tests | 102 passed, 0 failed, 0 skipped |
| Integration tests | 92 passed, 0 failed, 0 skipped |
| E2E tests | 43 passed, 0 failed, 0 skipped |
| Aggregate tests | 237 passed |
| Serious/critical accessibility violations | 0 |
| Fresh migration rehearsal | PASS |
| Upgrade from TIP-007 rehearsal | PASS |

The first sandboxed production build could not reach Google Fonts. Re-running
the same build with network access succeeded; this was an environment access
condition, not a product failure.

## Scope boundary verification

- Verifier/provider APIs, billing, queues, and webhooks were not added.
- Provider output remains attributed input evidence and cannot directly set a
  verification result, approve release, or mutate Mission state.
- No TIP-009 Mission Workspace surface was opened.
- No Observatory route or public release endpoint was opened.
- The future Observatory function reads only immutable approved public
  manifests for Missions already in RELEASED.

## Deferred obligations

### OBL-FND-001: remote reproducibility

Status: `BLOCKED_EXTERNAL / OWNER_PAUSED`

The Owner paused billing and GitHub Actions. No remote run, workflow bypass,
commit, or push was attempted.

### OBL-DEP-001: dependency audit refresh

Status: `DEFERRED_PERMISSION`

No dependency manifest was transmitted to the npm registry, so no fresh
vulnerability result is claimed.

### OBL-DEP-002: Prisma pg adapter deprecation

Status: `DEFERRED_PINNED_DEPENDENCY`

The existing `pg` concurrency warning remains visible during concurrent
integration tests. All concurrency assertions pass on pinned `pg` 8.22.0.

## Gate assessment

- TIP-008 local implementation: `READY_WITH_DEFERRED`.
- Local Verification and Release Governance: PASS.
- G5 local release-governance evidence: PASS.
- Remote reproducibility remains unproven and Owner-paused.
- TIP-009 and TIP-011 remain closed.
