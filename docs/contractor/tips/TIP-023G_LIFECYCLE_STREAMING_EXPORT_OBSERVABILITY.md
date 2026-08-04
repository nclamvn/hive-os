# TIP-023G — Lifecycle, Streaming Export and Observability

## Header

- TIP-ID: `TIP-023G`
- Project: HIVE OS Enterprise Core
- Modules: Lifecycle, Dossier Export, Worker Runtime, Observability
- Depends on: TIP-023D, TIP-023E, TIP-023F
- Priority: P1
- Status: `LOCALLY VERIFIED — 2026-08-04`

## Context

- Working directory: `/Users/os/hiveos`
- Blueprint: `docs/contractor/12_ENTERPRISE_CORE_BLUEPRINT.md`
- Task graph: `docs/contractor/13_ENTERPRISE_CORE_TASK_GRAPH.md`
- Reuse the PostgreSQL command/outbox/job plane, scoped authorization, forced
  RLS, object-storage port and immutable audit conventions.

## Requirements

| ID | Requirement |
| --- | --- |
| ENT-011 | Generate large dossiers asynchronously, consistently and without whole-document heap construction |
| ENT-016 | Enforce retention, legal hold, archive and controlled deletion as auditable lifecycle rules |
| ENT-017 | Emit structured traces, metrics and slow-query evidence without inventing operational claims |

## Task

1. Add tenant-scoped legal holds and lifecycle disposition candidates.
2. Prevent Organization, Workspace and governed Mission deletion from
   cascading through retained ledgers.
3. Evaluate retained object bodies against Workspace policy in bounded pages;
   active legal holds must block disposition.
4. Require explicit authorization, actor, reason and optimistic version for
   approval and execution. Execution may remove an eligible object body but
   never its governed metadata, hashes, provenance or audit history.
5. Replace request-time whole-dossier construction with an asynchronous export
   request backed by the existing command, outbox and durable-job plane.
6. Write bounded canonical JSONL parts to object storage, retain per-part
   hashes, and publish a canonical manifest only after every part completes.
7. Make export processing idempotent and resumable from retained section and
   cursor state. A failed or incomplete export must not expose a manifest.
   Capture a monotonic Mission source revision at request time and fail closed
   if any dossier source mutates before manifest publication.
8. Add a bounded worker-cycle entry point that dispatches outbox rows, claims
   jobs and routes registered handlers without cross-tenant sweeps.
9. Emit safe structured trace/metric events carrying correlation, component,
   duration, count and outcome fields only. Add slow-query evidence at the
   database boundary without logging SQL, parameters or secrets.

## Acceptance criteria

- `LIFE-01`: active Workspace or Mission legal hold blocks lifecycle approval
  and execution, with a retained reason.
- `LIFE-02`: an authorized two-step disposition removes only the eligible
  object body and retains its immutable Snapshot metadata and audit trail.
- `LIFE-03`: direct Organization, Workspace or governed Mission deletion fails
  closed at the database boundary.
- `EXP-01`: a duplicate dossier request returns one retained export identity
  and one durable job.
- `EXP-02`: export parts never exceed the configured row/byte ceilings and can
  resume without duplicating a committed part.
- `EXP-03`: manifest hashes every part, is published last and remains absent
  for READY, RUNNING or FAILED exports.
- `EXP-04`: foreign Workspace access is non-disclosing, every export-plane
  table is protected by Organization composite keys and forced RLS, and a
  post-boundary source mutation prevents dossier publication.
- `OBS-01`: one bounded worker cycle processes only the supplied Organization,
  records job outcomes and emits sanitized correlation/metric evidence.
- `REG-01`: typecheck, lint, unit, strict integration, E2E, build, fresh
  migration and legacy-upgrade rehearsal pass.

## Constraints

- PostgreSQL remains the initial durable adapter; do not add Redis, Kafka or a
  cloud-specific queue.
- Workers never mutate governed kernel truth from retry state.
- Cache and projections remain derived and rebuildable, never authoritative.
- Do not retain arbitrary SQL, payloads, object keys, user content or secrets
  in operational telemetry.
- Existing dirty visual artifacts remain outside scope.

## Report format

Create `docs/verification/TIP-023G_COMPLETION_REPORT.md` and
`docs/verification/TIP-023G_VERIFY_REPORT.md` after verification.
