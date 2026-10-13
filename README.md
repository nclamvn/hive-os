# HIVE OS

Provenance-preserving operating system for Human-AI research, engineering, and
decision-making. Built under Vibecode Kit v6.1 trust boundaries — the
authoritative product specification and governance documents live in
[`docs/contractor/`](docs/contractor/README.md) and are not modified by builds.

Current direction (2026-10-13): **research paused; product polish and research-team
handoff in progress**. Finish and push the reviewed local product first; the
deployment target will be chosen separately. A Git push does not publish
staging images automatically.

The application includes workspace identity and roles, missions, evidence and
review, execution/manual bridge, research tools, bilingual mathematical
presentations, and settings. The compact research workflow is primary solver →
targeted critique if needed → appropriate tool verification. Using Codex to
supply model output is an operator-mediated bridge, not an unattended model API.
An exact computation or accepted workflow does not by itself certify a theorem.
**K6 remains open**; retained partial results and failed approaches are preserved.

Start with the [research-team handoff guide](docs/operations/RESEARCH_TEAM_HANDOFF.md).
Historical acceptance and current scope are recorded in
[`docs/CODEX_CHAT_HANDOFF.md`](docs/CODEX_CHAT_HANDOFF.md), not inferred from this
overview. Historical local passes are not certification of this release or of
the old remote staging environment.

## Stack

- Next.js App Router, TypeScript strict, Tailwind CSS
- PostgreSQL + Prisma (deterministic migrations, driver adapter)
- Zod-validated environment (`src/server/env.ts`)
- Provider-independent object storage (`src/server/storage/`): local adapter
  for development, S3-compatible adapter for production
- Vitest (unit + integration), Playwright (E2E), GitHub Actions quality gates

## Getting started

Use Node.js 24 and PostgreSQL 16. Before an install/build, run `df -h /` and
keep at least 20 GB free. Work in this checkout, not a temporary project copy.

1. Copy `.env.example` to `.env` **only if `.env` does not already exist**.
2. Set distinct `BETTER_AUTH_SECRET` and `AUTH_THROTTLE_SECRET` values (generate
   each with `openssl rand -base64 32`). Keep `.env` untracked.
3. Keep the template's separate local runtime/migration database connections.

```bash
npm ci                       # deterministic install, including prisma generate
docker compose up -d db       # local PostgreSQL on port 5433
npm run db:bootstrap          # migrations AND least-privileged runtime role
npm run dev                  # http://localhost:3000
```

For a disposable local walkthrough, provision the demo explicitly once:

```bash
AUTH_ALLOW_SELF_SIGNUP=true npm run demo:provision
npm run dev:demo
```

Stop the existing dev server before starting `dev:demo`. Open
`http://localhost:3000/sign-in`; local demo credentials are prefilled. This is
for the local `hiveos_dev` database only, not shared/team credentials. The
provisioner may refuse an existing unverified or changed demo account rather
than resetting it; do not bypass authentication to recover it.

Use the origin in `BETTER_AUTH_URL` consistently. Local email is an in-memory
test sink, not a real delivery inbox. Shared-team onboarding needs working
SMTP and verified accounts; see the handoff guide.
Health: `/api/health/live` and `/api/health/ready` (readiness checks dependencies).

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
HIVE_BUILD_PROFILE=LOCAL_QA npm run build
```

The isolated maintenance build reuses `.next-build`; ordinary `npm run build`
uses `.next`. For a configured release runtime, `npm start` selects `.next`,
and `HIVE_BUILD_PROFILE=LOCAL_QA npm start` selects `.next-build`. Supply the
matching runtime environment explicitly: packaged `.env` files are removed,
and production rejects local/demo mail and storage settings. Historical
`test:prod-startup` and `test:load-local` scripts still require a fresh default
`.next` standalone build and their isolated test prerequisites; do not run them
as acceptance of `.next-build` or against a live development session.

The container artifact runs non-root and receives configuration only at
runtime. Local load output is observation evidence, never a production SLO.
See [`docs/operations/LOCAL_PRODUCTION_REHEARSAL.md`](docs/operations/LOCAL_PRODUCTION_REHEARSAL.md).

## Quality commands

`npm run test:unit` runs current product regression. Immutable historical
source-contract checks are separate (`npm run test:archive`) and currently have
unresolved replay prerequisites; they are **not** counted as passing. The
unfiltered baseline is `npm run test:unit:all`. Read the
[exact scope and one-shot capture warning](docs/verification/PRODUCT_TEST_SCOPE.md)
before running historical checks. No historical hashes are automatically resealed.

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
