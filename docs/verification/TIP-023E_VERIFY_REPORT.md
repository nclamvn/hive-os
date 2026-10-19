# VERIFY REPORT — TIP-023E Durable Command, Job and Projection Plane

Status: `READY WITH DEFERRED`

Verified: `2026-07-30`

## Requirement coverage

| Requirement | Result | Evidence |
| --- | --- | --- |
| ENT-008 durable command identity | PASS | Serialized idempotency, immutable stable outcomes |
| ENT-009 durable work execution | PASS | Outbox, leases, bounded retry, dead-letter disposition |
| ENT-010 operational projections | PASS | Incremental Workspace/Portfolio counts and rebuild |

Coverage: **3/3 implemented, 100%**.

## Acceptance coverage

| Criterion | Result | Evidence |
| --- | --- | --- |
| CMD-01 | PASS | Concurrent duplicate has one effect and one stable result; payload conflict rejected |
| CMD-02 | PASS | Savepoint rollback retains failed envelope/outbox but removes failed domain effect |
| CMD-03 | PASS | Bounded repeated dispatch creates one job per outbox row |
| JOB-01 | PASS | Live lease cannot be stolen; expired lease is recovered |
| JOB-02 | PASS | Append-only events, capped backoff and terminal dead letter |
| JOB-03 | PASS | `jobs.manage` authorization plus retained actor and reason |
| PROJ-01 | PASS | Insert/delete/status and Portfolio-move deltas update materialized counts |
| PROJ-02 | PASS | Watermark/freshness exposed; corruption reconstructed by rebuild worker |
| DATA-01 | PASS | Composite tenant FKs and six forced-RLS policies reject cross-tenant access |
| REG-01 | PASS | Local regression, build, E2E and migration gates pass |

Scenario coverage: **10/10 PASS, 100%**.

## Gate ledger

| Gate | Result |
| --- | --- |
| Prisma format/validate/generate | PASS |
| TypeScript | PASS, 0 errors |
| ESLint | PASS, 0 warnings/errors |
| Dependency policy | PASS, 8/8 |
| Bounded-query policy | PASS, 1/1 |
| Unit | 28 files, 164 tests PASS |
| Integration | 23 files, 155 tests PASS |
| TIP-023E integration | 7/7 scenarios PASS |
| E2E | 83/83 PASS, 1 worker, 0 retries |
| Production build | PASS |
| Fresh database | 22 migrations PASS |
| Legacy upgrade | PASS; source state preserved and projection rebuilt |
| Durable database plane | 6/6 tables forced RLS; 26 source triggers |
| Contractor manifest | PASS |
| Diff whitespace | PASS |

## Durability conclusions

- The idempotency key identifies a retained command outcome, not merely a
  best-effort request cache.
- Successful kernel mutation, audit and outbox publication share one
  transaction boundary.
- A failed effect cannot leak partial authoritative state, while its safe
  failure remains queryable and duplicate-stable.
- Job ownership is time-bounded by a lease; worker death does not permanently
  strand work.
- Retry mutates only job control state and never overwrites authoritative
  kernel history.
- Projection freshness is explicit and rebuildable. It is not presented as
  authoritative truth.
- Control Room no longer performs tenant-wide operational count fan-out in the
  request path.
- Worker and disposition APIs re-enter TIP-023B scoped authorization rather
  than trusting UI role labels.

## Deferred items

- `P0 / TIP-023F`: enterprise Mission Command Surface and accountable work
  orchestration UI.
- `P1 / infrastructure`: deploy worker scheduling, queue/notification adapters,
  telemetry and autoscaling.
- `P1 / test harness`: isolate E2E databases per worker before restoring
  parallel execution; deterministic single-worker E2E is green.
- `P2 / monitored`: pinned `pg` deprecation warning (`OBL-DEP-002`).
- `P0 / external`: remote reproducibility remains blocked by `OBL-FND-001`.

## Overall status

**READY WITH DEFERRED**

TIP-023E is locally complete for the authorized durable PostgreSQL boundary.
It does not claim a deployed worker fleet, external queue delivery, whole-
product event sourcing, cloud readiness or production readiness.
