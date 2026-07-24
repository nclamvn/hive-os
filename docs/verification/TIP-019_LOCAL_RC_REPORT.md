# TIP-019 Local Release Hardening and RC Report

Date: 2026-07-24

Overall status: `PASS — LOCAL RC SIGNED`

## Release-candidate result

The authorized local product architecture and UI through TIP-018 is complete
and TIP-019 hardening is closed. HIVE OS now has tested backup and recovery
tooling, clean-install and upgrade preservation evidence, a vulnerability-free
installed dependency graph, and a complete production-build regression pass.

This is a local sign-off only. It does not claim remote CI reproducibility,
production deployment readiness, or resolution of the Owner account billing
condition.

## Exact technical evidence

| Check | Result |
|---|---|
| Next.js production build | PASS on 16.2.11 |
| Prisma generation/runtime | PASS on 7.9.0 |
| Type errors | 0 |
| Lint errors / warnings | 0 / 0 |
| Unit tests | 106 passed |
| Integration tests | 103 passed |
| E2E tests | 64 passed |
| Aggregate tests | 273 passed |
| npm vulnerabilities | 0 |
| Fresh migration rehearsal | PASS, 12 migrations |
| Upgrade preservation rehearsal | PASS |
| Backup/restore rehearsal | PASS, 54 tables preserved |
| Serious/critical accessibility violations | 0 |
| Mobile horizontal overflow | 0 at governed test widths |
| Warm local `/sign-in` | 14 ms average, 93 ms max, n=10 |
| Warm local `/api/health` | 11 ms average, 73 ms max, n=10 |

Performance timings are local loopback observations, not production SLOs.

## Recovery controls

- Backup uses PostgreSQL custom format plus the configured local object-store
  directory.
- A manifest retains size and SHA-256 for the database dump and every storage
  object.
- Restore verifies all hashes before database mutation.
- Restore requires an exact `--confirm-target` match and rejects PostgreSQL
  system databases.
- Storage restore refuses a non-empty target.
- The automated rehearsal creates and removes only dedicated
  `hiveos_tip019_*_rehearsal` databases.
- Clean installation verifies all migrations, Workspace Policy, and
  least-privileged append-only Audit and Release Manifest protections.
- Upgrade rehearsal proves pre-policy Mission title, status and version remain
  unchanged while Workspace Policy is backfilled.
- Recovery rehearsal compares authoritative row counts across all 54 product
  tables after restore.

## Dependency hardening

- Next.js moved from 16.2.10 to the patched 16.2.11.
- Prisma client, CLI and PostgreSQL adapter moved together from 7.8.0 to 7.9.0.
- `eslint-config-next` matches the Next.js patch version.
- Patched transitive versions are explicitly overridden:
  `find-my-way 9.7.0`, `postcss 8.5.22`, `sharp 0.35.3`.
- `npm audit --audit-level=moderate` reports zero vulnerabilities.
- Full build and 273 tests passed against the resulting installed graph.

## Retained observation

`pg 8.22.0` is the current registry release and emits a deprecation warning
when intentional concurrency tests overlap queries through Prisma's adapter.
The warning is not a failed assertion or vulnerability; all serialization and
single-winner invariants pass. It remains an upstream compatibility observation
for a future isolated dependency update.

## Gate assessment

- TIP-016: local verified.
- TIP-017: local verified.
- TIP-018: local verified.
- TIP-019: PASS.
- Local RC: SIGNED.
- Billing, remote GitHub Actions, merge and deployment: still deferred and
  outside this local sign-off.
