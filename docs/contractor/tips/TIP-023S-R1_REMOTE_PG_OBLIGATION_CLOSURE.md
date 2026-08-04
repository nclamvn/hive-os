# TIP-023S-R1 — Remote Reproducibility and pg Obligation Closure

## Header

- TIP-ID: `TIP-023S-R1`
- Project: HIVE OS Enterprise Core
- Modules: PostgreSQL Transaction Runtime, CI/Reproducibility Governance
- Depends on: TIP-023S
- Priority: P0 release gate
- Status: `AUTHORIZED BY OWNER — 2026-08-04`

## Owner direction

Recheck GitHub Actions after the billing correction and close both remaining
obligations: remote reproducibility (`OBL-FND-001`) and the pg concurrent-query
deprecation (`OBL-DEP-002`).

## Requirements

1. Identify the exact call pattern producing the pg 8 deprecation warning.
2. Remove concurrent queries on one interactive-transaction client without
   weakening transaction, lock, RLS or domain semantics.
3. Prove the full integration suite emits zero pg concurrent-query warnings.
4. Preserve the complete TIP-023S local quality and security gates.
5. Commit and push only the authorized implementation and governance files;
   exclude all pre-existing modified visual artifacts.
6. Run the remote quality workflow on the reviewed commit and inspect every
   step before closing remote reproducibility.
7. Update the obligation ledger only from retained green evidence.

## Acceptance criteria

- Trace-enabled Mission and Verification integration scenarios pass with zero
  `client.query()` concurrent-execution deprecation warnings.
- Full integration, unit, build, lint, typecheck, E2E, startup and dependency
  policy gates pass locally.
- GitHub Actions starts after the billing fix and every required workflow step
  passes on the pushed commit.
- `OBL-FND-001` and `OBL-DEP-002` are recorded CLOSED with exact evidence.
- The pushed commit contains none of the 60 pre-existing modified PNG files.

## Constraints

- Do not suppress Node warnings or pin pg merely to hide the deprecation.
- Do not parallelize role/bootstrap setup against the same PostgreSQL cluster.
- Do not claim remote closure from a local result or from a workflow that ran
  against a different SHA.

## Reports

- `docs/verification/TIP-023S-R1_COMPLETION_REPORT.md`
- `docs/verification/TIP-023S-R1_VERIFY_REPORT.md`
