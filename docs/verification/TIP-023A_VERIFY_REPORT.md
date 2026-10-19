# VERIFY REPORT — TIP-023A Organization Graph

Status: `READY WITH DEFERRED`

Verified: `2026-07-30`

## Requirement coverage

| Requirement                     | Result | Evidence                                                                             |
| ------------------------------- | ------ | ------------------------------------------------------------------------------------ |
| ENT-001 Organization hierarchy  | PASS   | Organization, OrgUnit, closure, portfolio and group schema plus bounded module ports |
| ENT-004 Compatibility migration | PASS   | Deterministic legacy backfill and atomic onboarding/invitation compatibility         |

Coverage: **2/2 implemented, 100%**.

## Scenario results

| Scenario                                    | Result | Severity if failed |
| ------------------------------------------- | ------ | ------------------ |
| ORG-01 legacy Workspace/Membership upgrade  | PASS   | P0                 |
| ORG-02 atomic onboarding graph              | PASS   | P0                 |
| ORG-03 bounded hierarchy and closure depth  | PASS   | P0                 |
| ORG-04 concurrent move and cycle prevention | PASS   | P0                 |
| ORG-05 cross-organization parent rejection  | PASS   | P0                 |
| ORG-06 scoped portfolio/group collections   | PASS   | P1                 |
| ORG-07 regression and migration gates       | PASS   | P0                 |

Scenario coverage: **7/7 PASS, 100%**.

## Technical health

| Gate                            | Result                                           |
| ------------------------------- | ------------------------------------------------ |
| Prisma format/validate/generate | PASS                                             |
| TypeScript                      | PASS, 0 errors                                   |
| ESLint                          | PASS, 0 warnings/errors                          |
| Unit                            | 25 files, 159 tests PASS                         |
| Integration                     | 133 tests PASS, including 5 TIP-023A scenarios   |
| E2E                             | 83 tests PASS using 2 workers                    |
| Production build                | PASS                                             |
| Fresh database                  | 14 migrations PASS                               |
| Legacy upgrade                  | PASS with retained Workspace/Membership versions |
| Contractor manifest             | PASS                                             |
| Diff whitespace                 | PASS                                             |

## Security and invariants

- Organization parent, unit, portfolio, group and membership relationships use
  organization-scoped composite foreign keys.
- A partial unique index permits exactly one root unit per Organization.
- Database triggers lock the Organization, reject cycles and maintain closure
  rows for inserts and moves.
- The service hides foreign-parent existence behind `NotFound`.
- Organization deletion and parent deletion use restrictive foreign keys.
- New collection reads have explicit 200/500-row bounds; closure projection is
  capped at 5,000 rows and reports truncation.
- Existing Workspace authorization remains authoritative until TIP-023B.

## Deferred items

- `P0 / next TIP`: scoped grants, delegated authority, separation of duties and
  PostgreSQL RLS are intentionally deferred to TIP-023B.
- `P2 / monitored`: `OBL-DEP-002` pinned `pg` concurrent-query deprecation.
- `P3 / pre-existing`: cosmetic Prisma constraint/default drift outside the new
  Organization models.
- Remote reproducibility remains blocked externally by `OBL-FND-001`.

## Overall status

**READY WITH DEFERRED**

TIP-023A is locally complete and satisfies the approved Organization Graph
boundary. It does not claim enterprise authorization or production readiness.
TIP-023B must replace compatibility role mirroring with scoped authority and
database-enforced runtime tenant isolation.
