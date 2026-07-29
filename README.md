# HIVE OS

Provenance-preserving operating system for Human-AI research, engineering, and
decision-making. Built under Vibecode Kit v6.1 trust boundaries — the
authoritative product specification and governance documents live in
[`docs/contractor/`](docs/contractor/README.md) and are not modified by builds.

Current state: **Local Release Candidate signed through TIP-019, with
TIP-021A identity recovery and TIP-021B stabilization locally verified**.
Identity,
Mission, Truth, Skill, Execution, Verification, Release, Observatory, Reports,
Settings, cross-surface discovery, governed exports, and local recovery are
implemented and locally verified. Billing, remote GitHub Actions, merge and
production deployment remain separate deferred gates. Exact evidence lives in
[`docs/verification/TIP-019_LOCAL_RC_REPORT.md`](docs/verification/TIP-019_LOCAL_RC_REPORT.md).

## Stack

- Next.js App Router, TypeScript strict, Tailwind CSS
- PostgreSQL + Prisma (deterministic migrations, driver adapter)
- Zod-validated environment (`src/server/env.ts`)
- Provider-independent object storage (`src/server/storage/`): local adapter
  for development, S3-compatible adapter for production
- Vitest (unit + integration), Playwright (E2E), GitHub Actions quality gates

## Getting started

```bash
npm ci                 # deterministic install (runs prisma generate)
docker compose up -d   # dedicated Postgres on port 5433 (dev + test databases)
npm run db:migrate     # apply committed migrations
npm run dev            # http://localhost:3000 — full local application
```

Copy `.env.example` to `.env` if you need non-default configuration.
Health endpoint: `GET /api/health` (includes database connectivity).

## Local backup and recovery

Create an integrity-manifested PostgreSQL and local object-storage backup in a
new or empty directory:

```bash
npm run db:backup:local -- --output=/absolute/path/hiveos-backup
```

Restore only to an explicitly named target database. The confirmation must
exactly match the database name in the target URL; system databases are
rejected:

```bash
npm run db:restore:local -- \
  --backup=/absolute/path/hiveos-backup \
  --database-url=postgresql://.../hiveos_recovery \
  --confirm-target=hiveos_recovery \
  --storage-target=/absolute/path/restored-storage
```

Run the non-destructive release rehearsal. It creates and removes only the
dedicated `hiveos_tip019_*_rehearsal` databases:

```bash
npm run db:rehearse:tip019
```

## Quality commands

```bash
npm run build
npm run typecheck
npm run lint
npm run test              # unit + integration
npm run test:unit
npm run test:integration  # runs against the isolated hiveos_test database
npm run test:e2e          # Playwright; builds and starts the app itself
```

## Data boundaries

Production data, development data, demo fixtures, and test fixtures are
strictly separated — see [`docs/DATA_BOUNDARIES.md`](docs/DATA_BOUNDARIES.md).
Demo fixtures never load implicitly and are rejected outright in production.
No metric, count, or status anywhere in the product may be synthesized.
