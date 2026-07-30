# COMPLETION REPORT — TIP-023E

**STATUS:** DONE

## Delivered

- Organization-scoped durable command envelope with correlation identity,
  bounded secret-screened JSON and immutable terminal outcomes.
- Advisory-lock serialization of concurrent idempotency keys with stable
  duplicate results and fail-closed command-identity conflicts.
- Savepoint-backed command execution that atomically retains successful domain
  effects, audit, outcome and outbox while rolling failed effects back and
  retaining a bounded failure outcome.
- Bounded idempotent outbox dispatch into one durable job per outbox event.
- PostgreSQL job claiming with `FOR UPDATE SKIP LOCKED`, worker identity,
  expiring leases, bounded batches and bounded attempts.
- Append-only job lifecycle events, exponential retry capped at one hour,
  dead-letter transition and authorized requeue/cancel disposition.
- Incremental Workspace and Portfolio operational projections across 26 source
  tables, with source watermarks and refresh timestamps.
- Authorized projection rebuild commands and a worker handler that reconstructs
  derived counts from authoritative rows.
- Control Room operational counts served from one bounded materialized
  projection read instead of request-time count fan-out.
- Composite Organization relationships, forced PostgreSQL RLS on six durable
  plane tables and least-privilege runtime grants.
- Fresh and legacy-upgrade migration rehearsal across all 22 migrations.

## Principal files

- `src/modules/command-runtime/`
- `src/modules/projections/`
- `src/server/control-room.ts`
- `prisma/migrations/20260730223000_durable_command_job_projection/`
- `prisma/migrations/20260730224000_projection_trigger_tenant_context/`
- `prisma/migrations/20260730224500_projection_portfolio_move/`
- `tests/integration/command-runtime.test.ts`
- `scripts/db/rehearse-tip023e.mjs`

## Verification results

- Requirements: 3/3 implemented (`ENT-008`, `ENT-009`, `ENT-010`).
- Acceptance criteria: 10/10 PASS.
- TIP-023E PostgreSQL integration scenarios: 7/7 PASS.
- Unit suite: 164/164 PASS.
- Integration suite: 23 files, 155/155 PASS.
- E2E suite: 83/83 PASS with one worker and zero retries.
- Typecheck, lint, dependency policy, bounded-query policy and production
  build: PASS.
- Fresh database: 22/22 migrations PASS.
- Legacy upgrade: existing Mission and Runtime Obligation state and versions
  preserved; projection bootstrap returned the authoritative counts.

## Boundaries

- PostgreSQL is the durable adapter. No cloud queue, scheduler, notification
  provider or model API is connected.
- Workers are callable runtime ports, not a deployed autoscaling worker fleet.
- Projection rows are derived and rebuildable; authoritative kernel ledgers
  remain the source of truth.
- Source triggers temporarily bind transaction-local Organization context from
  each Workspace so pre-TIP-023B kernels remain compatible with forced RLS.
- The enterprise Mission Command Surface remains TIP-023F.
- A parallel Playwright run exposed a shared-E2E-database auth race; the full
  deterministic run passed 83/83 with one worker and no retries. Test-database
  isolation remains a harness hardening item, not a TIP-023E product failure.
- Remote reproducibility remains externally blocked by `OBL-FND-001`.
- The pinned `pg` integration harness retains known deprecation warning
  `OBL-DEP-002`.
- Existing dirty visual artifacts remain outside TIP-023E scope.

## Suggested next contract

Proceed with **TIP-023F — Enterprise Mission Command Surface**, consuming the
bounded workflow inbox, durable job state and honest projection freshness
without introducing request-time fan-out or synthetic metrics.
