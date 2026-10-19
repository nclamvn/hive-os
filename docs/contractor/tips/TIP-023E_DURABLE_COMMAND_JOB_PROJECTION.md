# TIP-023E — Durable Command, Job and Projection Plane

## Header

- TIP-ID: `TIP-023E`
- Project: HIVE OS Enterprise Core
- Modules: Command Runtime, Enterprise Projections
- Depends on: TIP-023B, TIP-023C
- Priority: P0
- Status: `AUTHORIZED BY OWNER — 2026-07-30`

## Requirements

| ID      | Requirement                                                                                       |
| ------- | ------------------------------------------------------------------------------------------------- |
| ENT-008 | Give material commands an idempotency key, correlation identity and immutable outcome             |
| ENT-009 | Run long work through durable jobs, bounded retry, backpressure and dead-letter disposition        |
| ENT-010 | Materialize operational counts and portfolio projections outside request-time count fan-out        |

## Task

1. Add a tenant-scoped command envelope and immutable outcome registry.
2. Execute command effects, command audit and outbox creation in one database
   transaction.
3. Serialize duplicate idempotency keys and return the original stable outcome;
   reject key reuse with a different command type or payload.
4. Dispatch outbox rows into durable PostgreSQL jobs without duplicate jobs.
5. Claim jobs with `FOR UPDATE SKIP LOCKED`, worker identity, lease expiry,
   bounded attempts and bounded batch size.
6. Record append-only job lifecycle events. Retry transient failures with a
   bounded delay; move poisoned jobs to dead letter.
7. Require scoped authorization and a retained disposition reason before a
   dead-letter job can be requeued or cancelled.
8. Maintain Workspace and Portfolio operational-count projections
   incrementally with a source watermark.
9. Provide a durable projection rebuild handler and bounded projection reads.
10. Replace Control Room request-time count fan-out with the materialized
    Workspace projection while preserving honest freshness metadata.

## Acceptance criteria

### CMD-01 — Stable duplicate outcome

Two concurrent deliveries with the same Organization/idempotency key and
identical command identity produce one governed effect and return the same
retained outcome. Reusing the key for another payload or type fails closed.

### CMD-02 — Atomic state, audit and outbox

A successful handler commits its domain effect, command audit, command outcome
and outbox row together. A failed handler rolls its domain effect back while
retaining one bounded failed outcome and failure outbox record.

### CMD-03 — Outbox dispatch

Bounded dispatch creates at most one job per outbox row. Repeated dispatch is
idempotent and marks only successfully materialized rows as dispatched.

### JOB-01 — Lease recovery

A worker claims ready or expired-running jobs under row locks. A live lease
cannot be stolen; an expired lease is recoverable by another worker.

### JOB-02 — Retry and dead letter

Every claim and disposition is append-only. Failures retry only up to
`maxAttempts`; exhausted jobs enter `DEAD_LETTER` and never overwrite
authoritative kernel history.

### JOB-03 — Authorized disposition

Only an actor with scoped `jobs.manage` authority may requeue or cancel dead
letters. Every disposition retains actor, reason and prior attempt count.

### PROJ-01 — Incremental operational counts

Relevant source-row insert/delete/status transitions adjust Workspace and
Portfolio projections by bounded deltas instead of running tenant-wide count
fan-out in the Control Room request.

### PROJ-02 — Honest freshness and rebuild

Every projection exposes source watermark and refresh time. A rebuild job can
reconstruct the same counts from authoritative rows after corruption or
restore without claiming freshness before completion.

### DATA-01 — Tenant defense

Command, outbox, job, job-event and projection tables use Organization
composite relationships and forced transaction-local PostgreSQL RLS.

### REG-01 — Regression

Typecheck, lint, unit, integration, E2E, production build, fresh migration and
legacy-upgrade rehearsal pass without weakening TIP-023B through TIP-023D.

## Constraints

- PostgreSQL is the initial durable adapter; no queue, cloud or model provider.
- Payloads and outcomes are JSON objects with bounded serialized size and no
  secrets.
- Batch size, lease duration, retry delay and attempts have hard ceilings.
- Worker APIs are Organization-scoped; no runtime-role cross-tenant sweep.
- Projection rows are derived and rebuildable, never authoritative truth.
- Existing kernels remain authoritative and are not rewritten by retries.
- The Control Room UI design remains unchanged; TIP-023F owns the enterprise
  Mission Command Surface.
- Existing dirty visual artifacts remain outside scope.

## Reports

- `docs/verification/TIP-023E_COMPLETION_REPORT.md`
- `docs/verification/TIP-023E_VERIFY_REPORT.md`
