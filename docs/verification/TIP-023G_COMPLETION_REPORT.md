# COMPLETION REPORT — TIP-023G

**STATUS:** DONE — LOCALLY VERIFIED

## Delivered

- Added Organization-scoped legal holds and bounded lifecycle-disposition
  evaluation for retained Snapshot object bodies.
- Enforced requester/approver separation, active-hold rechecks, optimistic
  versions and retained reasons for approval and execution.
- Added PostgreSQL guards that reject direct Organization, Workspace and
  Mission root deletion and preserve the governed ledgers.
- Replaced request-time whole-dossier construction with one idempotent durable
  command, transactional outbox event and leased asynchronous job.
- Streamed canonical JSONL in query pages of at most 100 rows and object parts
  of at most 1 MiB, including safe byte splitting for one oversized row.
- Retained part identity, cursor, row/byte counts and SHA-256 hashes; published
  the canonical integrity manifest only after every expected part exists.
- Added a tenant-scoped monotonic Mission source revision. A related source
  mutation after capture makes the export fail closed with no manifest.
- Added an Organization-scoped bounded worker cycle, registered handler
  routing, lease heartbeat, retry/dead-letter behavior and rebuildable
  projection dispatch.
- Added structured operational duration/count/queue evidence and slow-query
  signals without SQL, parameters, object keys, content or secrets.
- Added request/status/manifest/part API contracts and a UI control that
  requests, polls and downloads a completed dossier manifest.

## Principal files

- `prisma/schema.prisma`
- `prisma/migrations/20260804090000_lifecycle_streaming_export_observability/migration.sql`
- `prisma/migrations/20260804091000_tip023g_ledger_guards/migration.sql`
- `prisma/migrations/20260804092000_mission_source_revision_fence/migration.sql`
- `src/modules/lifecycle/kernel.ts`
- `src/modules/dossier-export/kernel.ts`
- `src/modules/command-runtime/jobs.ts`
- `src/server/workers/organization-cycle.ts`
- `src/server/db.ts`
- `src/components/exports/dossier-export-control.tsx`
- `scripts/db/rehearse-tip023g.mjs`
- `tests/integration/lifecycle-export.test.ts`
- `tests/integration/pilot-exports.test.ts`

## Verification summary

- Requirements: 3/3 implemented (`ENT-011`, `ENT-016`, `ENT-017`).
- Acceptance criteria: 9/9 PASS.
- Fresh and legacy-upgrade rehearsal: 25 migrations PASS.
- Tenant boundary: 5 lifecycle/export tables use forced Organization RLS.
- Database invariants: 3 governed root-delete guards plus immutable lifecycle,
  hold and export ledgers.
- Static, unit, strict integration, production build, strict E2E, production
  startup and dependency-security gates are recorded in the Verify Report.

## Boundaries

- PostgreSQL and the provider-neutral object-storage port remain the initial
  durable adapters; no Redis, Kafka, hosted queue or telemetry vendor was
  added.
- Export consistency is fail-closed. A source mutation requires a new export
  request; a mixed-state dossier is never published.
- Lifecycle execution removes only an eligible retained object body, not
  authoritative metadata, hashes, provenance or audit.
- Operational measurements are local verification evidence, not a production
  SLO or an enterprise-scale claim.
- Existing dirty visual artifacts were preserved outside TIP-023G scope.

## Next release gate

Proceed only under a separate authorization with **TIP-023H — Enterprise Scale
Certification**: deterministic million-row data, 100-way governed contention,
hot-tenant isolation, multi-process worker recovery, 60-minute soak and
backup/restore plus projection-rebuild certification.

