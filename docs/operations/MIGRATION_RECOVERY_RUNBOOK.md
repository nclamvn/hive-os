# Migration and Recovery Runbook

Status: `TIP-021C-A LOCAL CONTRACT`

## Forward migration

- Back up governed database and object storage before a material migration.
- Verify backup hashes and the exact source environment.
- Run committed migrations with the separate migration role.
- Confirm migration ledger, runtime-role restrictions, readiness, and smoke
  scenarios before enabling traffic.
- Store timings and query/lock observations as evidence, not as an SLO.

## Failure boundary

Prisma migrations are forward-only in this project. Do not create or run an
automatic destructive down migration.

If a migration fails:

1. Enter maintenance mode and stop writes.
2. Preserve logs, database state, migration ledger, commit, and image digest.
3. Determine whether the failure occurred before or after a committed schema or
   data change.
4. If a safe corrective forward migration exists, review it under a new TIP.
5. Otherwise restore into a new database from the verified pre-migration backup.
6. Validate row counts/invariants, object hashes, runtime-role grants, and
   tenant-isolation negatives.
7. Switch traffic only through an explicit Owner decision.

## Local rehearsal

`npm run db:rehearse:tip019` creates only dedicated
`hiveos_tip019_*_rehearsal` databases, deploys all committed migrations,
preserves upgrade data, verifies least privilege, backs up PostgreSQL and a
sample object, restores both into new targets, compares authoritative counts
and content, then removes the rehearsal resources.

This proves tooling behavior locally. Managed-service point-in-time recovery,
retention, RPO, and RTO require external staging evidence.
