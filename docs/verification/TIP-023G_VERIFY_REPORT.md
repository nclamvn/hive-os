# VERIFY REPORT — TIP-023G Lifecycle, Streaming Export and Observability

Status: `LOCALLY VERIFIED — READY FOR TIP-023H`

Verified: `2026-08-04`

## Requirement coverage

| Requirement | Result | Evidence |
| --- | --- | --- |
| ENT-011 large dossier export | PASS | Durable request/job, bounded canonical parts, hashes, resume cursor, publish-last manifest and source-revision fence |
| ENT-016 governed lifecycle | PASS | Tenant legal hold, bounded candidate evaluation, two-person disposition and root-delete guards |
| ENT-017 operational evidence | PASS | Organization worker cycle, safe structured events and SQL-content-free slow-query signals |

Coverage: **3/3 implemented, 100%**.

## Acceptance coverage

| Criterion | Result | Evidence |
| --- | --- | --- |
| LIFE-01 | PASS | Active Workspace/Mission holds block approval and execution with retained reason |
| LIFE-02 | PASS | Independent approval and execution remove only object body; Snapshot and audit survive |
| LIFE-03 | PASS | Organization, Workspace and Mission direct deletion rejected by PostgreSQL triggers |
| EXP-01 | PASS | Duplicate idempotency key returns one export and one durable job |
| EXP-02 | PASS | 100-row query ceiling, 1 MiB part ceiling, retained section/cursor and stable sequence |
| EXP-03 | PASS | Every part hashed; manifest complete, hashed and published last |
| EXP-04 | PASS | Non-disclosing scope, forced RLS and post-boundary mutation failure |
| OBS-01 | PASS | Organization-only worker claims with sanitized correlation and numeric measurements |
| REG-01 | PASS | Static, migration, test, build, startup and dependency gates |

Scenario coverage: **9/9 PASS, 100%**.

## Gate ledger

| Gate | Result |
| --- | --- |
| Prisma format, validate and client generation | PASS |
| TypeScript | PASS, 0 errors |
| ESLint | PASS, 0 errors |
| Dependency policy | PASS, runtime/full high 0, critical 0, moderate 0 |
| Runtime dependency audit | PASS, 0 vulnerabilities |
| Full dependency audit | PASS, 0 vulnerabilities |
| Unit | 28 files, 165/165 PASS |
| Strict integration | 24 files, 162/162 PASS |
| Production build | PASS |
| Strict E2E | 85/85 PASS |
| Production fail-closed startup contract | PASS |
| Fresh + legacy migration rehearsal | PASS, 25 migrations |
| Lifecycle/export forced-RLS plane | PASS, 5/5 tables and policies |
| Governed root deletion | PASS, 3/3 database guards |
| Contractor current manifest | PASS after report closure |

## Correctness and security conclusions

- Authorization is checked before commands and again inside tenant-bound
  persistence. Forced RLS remains the final database tenant boundary for every
  new lifecycle/export table.
- Legal hold is evaluated during approval and execution, preventing a race
  from turning an earlier eligibility decision into uncontrolled deletion.
- Durable command idempotency, outbox dispatch, bounded claims, worker leases,
  heartbeats and terminal job events make processing crash-recoverable.
- A Mission version protects root changes; the monotonic source revision
  protects all included child records. Either mismatch prevents publication.
- Parts may exist for an incomplete/failed export but are unreachable through
  the governed download API until the export succeeds and its manifest exists.
- Cache/projection state remains derived and rebuildable; none is authoritative
  Mission, Truth, Execution or Verification state.

## Deferred items

- `P0 / TIP-023H`: million-row deterministic fixture and high-cardinality query
  certification.
- `P0 / TIP-023H`: 100-way governed write contention and hot-tenant isolation.
- `P0 / TIP-023H`: multi-process worker crash/lease recovery and duplicate
  effect certification.
- `P0 / TIP-023H`: 60-minute soak with latency, throughput, CPU, RSS,
  connections and queue-depth evidence.
- `P0 / TIP-023H`: backup/restore plus projection rebuild to a verified
  watermark.
- `P1 / infrastructure`: external scheduler, autoscaling, managed object
  storage, queue and telemetry adapters after workload evidence and budget.

## Overall status

**LOCALLY VERIFIED — READY FOR TIP-023H**

TIP-023G closes the authorized lifecycle, consistent large-export and bounded
worker-observability contract. It does not claim million-row certification,
production SLOs, cloud deployment or production release.

