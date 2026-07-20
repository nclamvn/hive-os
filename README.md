# HIVE OS

Provenance-preserving operating system for Human-AI research, engineering, and
decision-making. Built under Vibecode Kit v6.1 trust boundaries — the
authoritative product specification and governance documents live in
[`docs/contractor/`](docs/contractor/README.md) and are not modified by builds.

Current state: **TIP-003 Identity + Workspace + Audit** — foundation (TIP-001),
locked design system and app shell (TIP-002), and authentication, workspaces,
memberships, invitations, and an append-only audit log (TIP-003). Missions,
claims, evidence, and verification arrive with later authorized TIPs (see
`docs/contractor/07_TASK_GRAPH.md`). Identity design notes live in
`docs/identity/`.

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
npm run dev            # http://localhost:3000 — placeholder shell
```

Copy `.env.example` to `.env` if you need non-default configuration.
Health endpoint: `GET /api/health` (includes database connectivity).

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
