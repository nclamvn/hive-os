# VERIFY REPORT — TIP-023B Scoped Authorization, RLS and SoD

Status: `READY WITH DEFERRED`

Verified: `2026-07-30`

## Requirement coverage

| Requirement                         | Result | Evidence                                                  |
| ----------------------------------- | ------ | --------------------------------------------------------- |
| ENT-002 scoped and group authority  | PASS   | Four scopes, user/group subjects, deny precedence         |
| ENT-003 delegation and SoD          | PASS   | Bounded chain evaluation and named-performer independence |
| ENT-005 tenant database defense     | PASS   | Composite relations and forced transaction-local RLS      |

Coverage: **3/3 implemented, 100%**.

## Acceptance coverage

| Criterion | Result | Evidence                                                   |
| --------- | ------ | ---------------------------------------------------------- |
| AUTH-01   | PASS   | Founding and migrated Owner compatibility grants           |
| AUTH-02   | PASS   | OrgUnit descendant inheritance, sibling denial             |
| AUTH-03   | PASS   | Group allow merged with direct explicit deny               |
| AUTH-04   | PASS   | Parent revocation fails child closed; broader scope blocked |
| AUTH-05   | PASS   | Research Builder cannot approve verification               |
| AUTH-06   | PASS   | No-context/foreign-tenant runtime SQL blocked               |
| AUTH-07   | PASS   | Grant, revoke and denial events retain bounded attribution  |
| AUTH-08   | PASS   | All local regression, build and migration gates            |

Scenario coverage: **8/8 PASS, 100%**.

## Gate ledger

| Gate                            | Result                                      |
| ------------------------------- | ------------------------------------------- |
| Prisma validate/generate        | PASS                                        |
| TypeScript                      | PASS, 0 errors                              |
| ESLint                          | PASS, 0 warnings/errors                     |
| Unit                            | 25 files, 159 tests PASS                    |
| Integration                     | 20 files, 139 tests PASS                    |
| E2E                             | 83 tests PASS using 2 workers               |
| Production build                | PASS                                        |
| Fresh database                  | 16 migrations PASS                          |
| Legacy authority upgrade        | PASS                                        |
| Forced RLS catalog              | 9 tables and 9 tenant policies PASS         |
| Runtime role cross-tenant probe | PASS; read/write fail closed, `NOBYPASSRLS` |
| Contractor manifest             | PASS                                        |

## Security conclusions

- Authorization decisions are deterministic: explicit deny wins, missing
  policy and inactive subjects fail closed, and reason codes are bounded.
- Organization and OrgUnit inheritance cannot cross Organization composite
  keys.
- Delegation validity depends on every active parent and cannot widen resource
  scope at either the service or database boundary.
- Separation of duties queries performer existence directly and therefore
  does not lose conflicts behind an arbitrary history limit.
- Tenant settings are transaction-local, preventing pooled-connection context
  leakage.

## Deferred items

- `P0 / program`: business-ledger RLS expansion remains incomplete by design;
  each bounded context must first use transaction-local tenant context.
- `P2 / monitored`: `OBL-DEP-002` pinned `pg` deprecation warning.
- `P0 / external`: `OBL-FND-001` blocks remote CI reproducibility.

## Overall status

**READY WITH DEFERRED**

TIP-023B is locally complete for its approved boundary. It establishes a
mature authority kernel and database tenant defense for enterprise authority
records, but it does not claim production readiness or database-wide RLS.
