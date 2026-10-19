# TIP-021C-A — Builder Completion Report

Status: `COMPLETE`

Date: `2026-07-29`

## Work completed

- Added a pinned, multi-stage standalone Docker artifact with OpenSSL/CA
  runtime support, non-root UID 1001, constrained build context, and runtime
  secret injection boundary.
- Removed loaded `.env` files from every local standalone artifact after build.
- Added explicit deployment class, bounded database pool/timeouts, S3
  encryption intent, and maintenance-mode configuration.
- Split process liveness from DB/object-storage readiness.
- Added HTTP correlation-ID validation/propagation and one-line structured,
  allowlisted operational logging.
- Added deterministic S3 command tests with KMS intent and pagination.
- Extended migration/recovery rehearsal to all 13 migrations, 56 product
  tables, and integrity-checked object storage.
- Added a bounded local load-observation harness.
- Added environment, deployment, incident, migration/recovery, rehearsal, and
  pending-Owner-decision runbooks.
- Added production startup contract execution to the remote workflow definition.

## Acceptance evidence

| Scenario | Evidence | Result |
| --- | --- | --- |
| PRC-01 | Docker build, image inspect, runtime UID and liveness | PASS |
| PRC-02 | Env unit tests and 7 invalid startup cases | PASS |
| PRC-03 | Integration and E2E live/ready probes | PASS |
| PRC-04 | Unit and E2E correlation scenarios | PASS |
| PRC-05 | Structured-log unit tests; sanitized ledger tests | PASS |
| PRC-06 | Env bounds and exported applied pool configuration | PASS |
| PRC-07 | Deterministic S3 put/get/head/list/delete + KMS intent | PASS |
| PRC-08 | Fresh/upgrade/backup/restore rehearsal | PASS |
| PRC-09 | Full integration tenant-isolation negative evidence | PASS |
| PRC-10 | 200 local loopback observations, zero failures | PASS |
| PRC-11 | Maintenance unit scenario; health bypass retained | PASS |
| PRC-12 | Full local gate suite | PASS_WITH_OBSERVATION |

## Local evidence

| Check | Result |
| --- | --- |
| Container | `hiveos`, UID 1001, live, no `.env` |
| Local image digest | `sha256:d27496118b3feddf053a672e48b6070f26a852f7844172adec18d04e0d08c5ce` |
| Startup contract | 8 passed |
| Recovery | 13 migrations; 56 tables + object storage preserved |
| Unit | 140 passed |
| Integration | 123 passed |
| E2E | 76 completed; 1 registered flake passed retry and isolated rerun |
| Build/typecheck/lint | PASS |
| Dependency policy | PASS; runtime high/critical 0 |

Local load observation (`LOCAL_LOOPBACK_NON_SLO`, 100 requests per route,
concurrency 10):

| Route | Failures | Observed req/s | p50 | p95 | max |
| --- | ---: | ---: | ---: | ---: | ---: |
| `/api/health/live` | 0 | 1042.5 | 7 ms | 17 ms | 23 ms |
| `/sign-in` | 0 | 261.3 | 26 ms | 125 ms | 126 ms |

These timings are one local loopback observation, not a production capacity,
uptime, latency, or SLO claim.

## Deviations and observations

- No architecture or TIP deviation.
- The known `pg` concurrent-query deprecation remains `OBL-DEP-002`.
- The registered EO-01..08 shared-server timing flake occurred once, passed on
  configured retry, and passed an isolated no-retry rerun. No assertion or
  state invariant failed on the rerun.
- `next start` warns when used with standalone output in the E2E harness.
  Container and production startup rehearsals use the required standalone
  `server.js`; E2E intentionally retains the test-only server path because its
  safe test configuration must not be accepted by a production artifact.

## Restricted actions

No vendor was selected; no external resource, billing action, domain change,
secret creation, remote push, staging/production deployment, release, or public
Observatory authorization occurred.
