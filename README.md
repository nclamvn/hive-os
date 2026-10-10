# HIVE OS

Provenance-preserving operating system for Human-AI research, engineering, and
decision-making. Built under Vibecode Kit v6.1 trust boundaries — the
authoritative product specification and governance documents live in
[`docs/contractor/`](docs/contractor/README.md) and are not modified by builds.

Current state: **Local Release Candidate signed through TIP-019, with
TIP-021A identity recovery, TIP-021B stabilization, TIP-021C-A production
contract, Enterprise Core TIP-023A through TIP-023H locally verified, and a
provider-free TIP-024A Query Trust foundation implemented**.
Identity,
Mission, Truth, Skill, Execution, Verification, Release, Observatory, Reports,
Settings, cross-surface discovery, asynchronous bounded dossier exports,
governed lifecycle disposition, and local recovery are
implemented and locally verified. Remote quality reproducibility passed on
GitHub Actions run `30891944749`; merge, RC packaging and production deployment
remain separate gates. Exact evidence lives in
[`docs/verification/TIP-019_LOCAL_RC_REPORT.md`](docs/verification/TIP-019_LOCAL_RC_REPORT.md).

TIP-024A defines strict, read-only QueryPlan and golden-evaluation contracts.
It does not connect a model provider, implement an enterprise ontology, or
claim production question-answering accuracy.

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

## Local production contract

```bash
npm run build
npm run test:prod-startup
npm run test:load-local
docker build -t hiveos:tip-021c-a .
```

The standalone artifact runs non-root and receives configuration only at
runtime. Local load output is observation evidence, never a production SLO.
See [`docs/operations/LOCAL_PRODUCTION_REHEARSAL.md`](docs/operations/LOCAL_PRODUCTION_REHEARSAL.md).

## Quality commands

For the small, provider-free mathematics development slice, start here (using
the already installed dependencies; no database or application build):

```bash
npm run research:check    # syntax, focused strict types, regression tests, real CLI smoke
npm run research:replay   # known public permutation arithmetic engineering replay
npm run research:lean     # synthetic primary-first execution controls; no model/API charge
npm run research:lean -- --replay-file tests/fixtures/lean-retained-replay.json
```

This is **not** a fresh AI solve, proof validation, official FrontierMath score
or full-application acceptance. Existing execution/security gates remain in force.
See [lean research direction](docs/research/DEVELOPMENT_DIRECTION.md) for the
scope and the distinction between developer checks and research claims.

For the two fixed, exact LRC method demonstrations (installed Python 3, standard
library only):

```bash
npm run research:lrc
python3 -I -S -B tests/research/test_lrc_method.py
```

This independently replays continuous tightness of one 14-runner tuple and a
constructive 15-runner shift witness. The accompanying argument establishes the
stated infinite family, **not global LRC 14/15**, novelty or a blind benchmark.
See [proof, actual results and limits](docs/research/LRC_METHOD_VALIDATION_084.md).
The ordinary command is read-only; `--record` creates its fixed evidence file
once and refuses to overwrite an existing record.

The read-only visual presentation is available at
`/w/<workspaceSlug>/research/lrc-demo`, linked from the mathematics workbench.
Local demo startup (no install or production build):

```bash
DEMO_FIXTURES_ENABLED=true npm run dev -- --webpack --hostname 127.0.0.1 --port 3000
```

Open `http://localhost:3000`, the configured authentication origin, rather than
`http://127.0.0.1:3000`. Existing demo credentials are prefilled only when the
local development safeguards allow it; normal authentication still applies.
See [UI verification and limits](docs/research/LRC_VISUAL_DEMONSTRATION_085.md).

Full-application quality commands remain separate:

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
