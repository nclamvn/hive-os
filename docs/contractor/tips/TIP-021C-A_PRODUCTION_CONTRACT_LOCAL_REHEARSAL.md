# TIP-021C-A — Production Contract & Local Rehearsal

Status: `COMPLETE — LOCAL VERIFIED`

Owner authorization: `2026-07-29`

## Context

HIVE OS has a signed Local RC, locally verified identity recovery, a
provider-independent storage port, least-privileged PostgreSQL runtime role,
local backup/restore, and a configured remote quality workflow. It does not yet
have a reproducible deployment artifact or a complete provider-neutral
production operating contract.

This phase closes only what can be proven locally. It does not provision
staging, select vendors, spend money, push changes, or claim production
readiness.

## Task

Create and verify a provider-neutral production contract and deterministic
local staging rehearsal suitable for later external provisioning.

## Specifications

1. Produce a deterministic standalone container artifact that runs as a
   non-root user and contains no development environment file.
2. Define and validate the development, test, staging, and production
   environment matrix. Staging and production must fail closed when storage,
   mail, identity, database, or deployment settings are unsafe.
3. Split liveness from readiness. Liveness proves the process responds;
   readiness checks required runtime dependencies without exposing secrets.
4. Propagate a validated correlation ID at the HTTP boundary and emit
   machine-readable, redacted operational events.
5. Configure bounded PostgreSQL pool, connection, idle, and statement timeouts
   through the validated environment contract.
6. Verify the S3-compatible adapter deterministically, including encryption
   intent and pagination, without contacting a real provider.
7. Preserve the existing integrity-manifested local backup/restore rehearsal
   and document the production recovery boundary. No destructive automatic
   migration rollback is permitted.
8. Re-run cross-workspace negative scenarios as the local tenant-isolation
   evidence set.
9. Record a local load baseline as observed evidence only. It must not be named
   or presented as a production SLO.
10. Provide incident response, maintenance mode, deployment, migration
    recovery, and local rehearsal runbooks.

## Acceptance scenarios

| ID | Scenario | Expected |
| --- | --- | --- |
| PRC-01 | Build deployment image | Standalone image builds; process runs non-root |
| PRC-02 | Start with unsafe staging/production configuration | Startup fails before readiness |
| PRC-03 | Probe live and ready endpoints | Live is process-only; ready reports DB/storage dependency state |
| PRC-04 | Send absent, valid, and malformed correlation IDs | Safe ID is propagated; malformed input is replaced |
| PRC-05 | Emit an operational failure | One-line JSON contains allowed metadata and no sensitive value |
| PRC-06 | Configure DB runtime | Pool and timeout bounds are validated and applied |
| PRC-07 | Exercise S3 adapter against a deterministic fake | Put/get/head/list/delete and encryption intent pass |
| PRC-08 | Run backup/restore and migration rehearsal | Integrity checks and forward recovery pass |
| PRC-09 | Run tenant-isolation negative suite | Cross-workspace access remains fail-closed |
| PRC-10 | Run local load baseline | Observed latency/throughput evidence is labeled non-SLO |
| PRC-11 | Enable maintenance mode | User traffic receives 503; health probes remain reachable |
| PRC-12 | Run full local quality gates | Typecheck, lint, unit, integration, E2E, build and dependency policy pass |

## Constraints

- No external staging or production resource.
- No vendor choice, billing action, domain/DNS change, secret creation, remote
  push, deployment, release, or public Observatory authorization.
- No PostgreSQL RLS implementation in this phase; the decision remains a
  Production Security Review item.
- No retention deletion or legal-hold implementation without a separate Owner
  policy decision.
- No production RPO, RTO, throughput, uptime, or latency claim may be inferred
  from local evidence.
- Remote reproducibility remains `BLOCKED_EXTERNAL (OBL-FND-001)`.
- Dependency risk remains governed by DEC-012 and RISK-DEP-001.

## Builder Completion Report

Report exact files, scenario evidence, commands, counts, deviations, observed
local load results, open Owner decisions, and confirmation that no restricted
external action occurred.

## Local closure

Closed on `2026-07-29`.

- A digest-addressed standalone container was built from a pinned Node base,
  ran as the unprivileged `hiveos` user (UID 1001), contained no `.env`, and
  reached liveness.
- Staging/production environment, storage encryption, mail, identity, and
  database bounds fail closed.
- Liveness/readiness, correlation propagation, structured redacted operational
  events, maintenance mode, and S3 adapter behavior passed.
- The recovery rehearsal deployed all 13 migrations and restored 56 tables plus
  object storage with integrity validation.
- Local loopback load evidence completed with zero failed requests and remains
  explicitly labeled `LOCAL_LOOPBACK_NON_SLO`.
- Typecheck, lint, production build, dependency policy, 140 unit, 123
  integration, and 76 E2E scenarios completed. One registered shared-server E2E
  flake passed on retry and passed a clean isolated rerun.
- No external resource, provider, billing action, push, deployment, or release
  was performed.

See `docs/verification/TIP-021C-A_COMPLETION_REPORT.md` and
`docs/verification/TIP-021C-A_VERIFY_REPORT.md`.
