# TIP-021C-B — AWS Managed Staging

Status: `AUTHORIZED — BUILDING`

## Objective

Provision one auditable HIVE OS staging environment in AWS Singapore without
exceeding the Owner-approved USD 20 monthly ceiling. Establish deployment
evidence only; do not imply production readiness or public release.

## Authorized topology

- AWS Budget: USD 20/month with credits excluded.
- Compute: Lightsail Nano, IPv6-only, Ubuntu 24.04 LTS.
- Database: Lightsail managed PostgreSQL 16 Micro with private networking and
  backup retention.
- Storage: private regional S3 bucket with versioning, SSE-S3 and bounded
  lifecycle rules.
- Secrets: a single consolidated Secrets Manager value, injected by the
  operator into a root-owned runtime file.
- Mail: Amazon SES SMTP boundary; certification remains blocked until a sender
  identity is verified.
- TLS: Caddy with a staging-only IPv6-derived hostname.
- Runtime: immutable reviewed commit, unprivileged HIVE OS container, separate
  migration and runtime database credentials.

## Acceptance gates

| Gate | Required evidence |
| --- | --- |
| STG-01 | Exact commit and immutable artifact digest recorded |
| STG-02 | Runtime receives no migration credential |
| STG-03 | PostgreSQL runtime role is `NOSUPERUSER`, `NOCREATEDB`, `NOCREATEROLE`, `NOBYPASSRLS` and append-only grants remain enforced |
| STG-04 | S3 write/read/delete probe passes with `AES256` intent and no public access |
| STG-05 | HTTPS liveness and readiness return 200 through the staging hostname |
| STG-06 | Email verification and recovery delivery pass through a verified SES identity |
| STG-07 | Authenticated smoke plus cross-tenant non-disclosure pass |
| STG-08 | Constrained 30–60 minute soak records CPU, RSS, latency, errors and restart behavior |
| STG-09 | Integrity-checked logical backup/restore and projection rebuild pass |
| STG-10 | Forecast/run-rate remains below USD 20; fixed services remain USD 18.50 |

## Stop conditions

- Do not add Lightsail CDN, a public IPv4 address or another fixed-price
  service while the current ceiling applies.
- Do not weaken startup validation, email verification, RLS, encryption or
  runtime-role separation to obtain a green result.
- Do not call the environment production, Production RC or publicly released.
- If IPv6 reachability, 512 MiB memory, SES identity or remaining variable-cost
  headroom is insufficient, stop at `READY_WITH_DEFERRED` and report the exact
  failed gate.
