# COMPLETION REPORT — TIP-022Q

**STATUS:** DONE

The authorized comprehensive local QA and bounded stress scope is complete.
This report does not authorize production or represent local observations as a
production capacity claim.

## FILES CHANGED

- Created:
  - `docs/contractor/tips/TIP-022Q_COMPREHENSIVE_QA_AND_STRESS.md` — QA contract
    and six acceptance criteria.
  - `docs/verification/TIP-022Q_COMPLETION_REPORT.md` — Builder evidence.
  - `docs/verification/TIP-022Q_VERIFY_REPORT.md` — Contractor verification.
- Modified:
  - `scripts/test/load-baseline.mjs` — four-stage, multi-round local stress
    profile with p50/p95/p99/max latency, throughput, status distribution,
    transport/5xx failure counts, dependency labels, and process RSS/CPU
    observations.
  - `tests/e2e/execution-operations.spec.ts` — waits for the stable governed
    post-transition state instead of a transient message removed by refresh.
  - `tests/e2e/shell.spec.ts` — polls the final sidebar width across its 200 ms
    transition.
  - `docs/operations/LOCAL_PRODUCTION_REHEARSAL.md` — documents load schema v2.
  - `docs/verification/FLAKE_REGISTER.md` — closes FLAKE-001 with reproduction
    and no-retry evidence.
  - `docs/contractor/MANIFEST.current.sha256` — registers the TIP audit artifact.

## TEST RESULTS

### Final functional evidence

| Gate | Result |
|---|---|
| Typecheck | PASS, 0 errors |
| Lint | PASS, 0 errors/warnings |
| Unit | PASS, 159/159 across 25 files |
| Integration | PASS, 128/128 across 18 files |
| Production build | PASS |
| Production startup contract | PASS, 8/8 |
| Dependency policy | PASS; runtime high 0, critical 0; approved full-tree baseline high 9, moderate 3 |
| Full E2E, retries disabled | PASS, 83/83 across 21 files |
| Targeted flake regression | PASS, 65/65 across five repetitions, retries disabled |
| Migration/recovery rehearsal | PASS; 13 migrations, TIP-017 upgrade preserved, 56 tables and object storage restored |
| Container build | PASS; runtime UID 1001 |

### Stress evidence

The final diagnostic used the production standalone artifact, local PostgreSQL
test database, and a loopback S3 HEAD protocol stub. It ran two complete rounds:

- 21,600 total requests;
- concurrency stages 5, 25, 50, and 100;
- `/api/health/live`, `/api/health/ready`, and `/sign-in`;
- 0 transport failures;
- 0 HTTP 5xx responses;
- 21,600 HTTP 200 responses.

At concurrency 100 in round two:

| Surface | Throughput | p50 | p95 | p99 | max |
|---|---:|---:|---:|---:|---:|
| Liveness | 2,952.3 req/s | 26 ms | 48 ms | 356 ms | 672 ms |
| Readiness | 1,148.4 req/s | 85 ms | 106 ms | 122 ms | 138 ms |
| Sign-in SSR | 593.8 req/s | 165 ms | 204 ms | 341 ms | 507 ms |

Process observation: RSS began at 220,348,416 bytes, peaked and ended at
980,729,856 bytes after the two-round profile and cooldown. Most initialization
growth occurred in round one; round two added approximately 95.5 MB from its
starting RSS rather than repeating the approximately 665 MB first-round growth.
This is evidence of a high warm process footprint and partial plateau, not proof
of either a memory leak or a production memory requirement.

## ISSUES DISCOVERED

1. Contractor manifest omitted the new TIP: P0 audit failure introduced during
   QA setup. Fixed before continuing; the initial unit run was 158/159.
2. EO-01..08 transient-message assertion: P2 test reliability. Reproduced and
   fixed to assert the stable governed state.
3. DS-04A immediate width assertion: P2 test reliability. Reproduced and fixed
   with Playwright polling across the CSS transition.
4. Original load harness did not exercise readiness and used intentionally fake
   S3 credentials: P2 test coverage gap. Fixed with an explicit local S3 HEAD
   stub and honest dependency labeling.
5. Warm standalone RSS reached approximately 935 MiB after 21,600 requests:
   P2 operational observation. Requires real staging container limits and
   longer soak evidence before a production memory limit or SLO is approved.
6. `pg` emits its registered client-query deprecation warning under concurrent
   tests: P2 monitored technical debt; correctness tests pass.

## DEVIATIONS FROM SPEC

- Object-storage readiness used a local S3 HEAD protocol stub, not a real
  provider. This preserves a fully local, non-secret test while explicitly
  leaving provider capacity and suitability unverified.
- Stress covered read/dependency and SSR surfaces. Governed write throughput was
  not benchmarked through the unstable internal Server Action wire protocol;
  write correctness and pairwise concurrency remain covered by integration and
  E2E scenarios.
- Regenerated visual PNGs predated TIP-022Q and remain outside this task's
  intentional change set.

## SUGGESTIONS FOR CHỦ THẦU

- Treat the current state as a verified **local release candidate**, not a
  production-ready service.
- In real staging, run a 30–60 minute soak with container memory/CPU limits,
  real managed PostgreSQL and real object storage before selecting replicas or
  SLOs.
- Resolve remote CI billing and rerun the same reviewed commit before removing
  provisional remote gates.
