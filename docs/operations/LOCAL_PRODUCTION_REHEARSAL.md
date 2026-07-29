# Local Production Rehearsal

Status: `TIP-021C-A`

## Preconditions

- Dedicated local PostgreSQL from `docker compose up -d`.
- `.env` points only to development/rehearsal resources.
- No external provider credentials are present or required.

## Sequence

```bash
npm ci
npm run typecheck
npm run lint
npm run test:unit
npm run test:integration
npm run build
npm run test:prod-startup
npm run db:rehearse:tip019
npm run test:load-local
npm run test:e2e
npm run check:dependency-policy
docker build -t hiveos:tip-021c-a .
docker inspect hiveos:tip-021c-a --format '{{.Config.User}}'
```

## Evidence labels

- Build and container results are local reproducibility evidence.
- Backup/restore results cover local PostgreSQL and local object storage.
- Load output has schema `hive-os.local-load-observation.v1` and classification
  `LOCAL_LOOPBACK_NON_SLO`.
- Tenant isolation is evidenced by integration and E2E negative scenarios.
- None of this establishes Remote RC, staging readiness, production RPO/RTO,
  production SLO, or public release.

## External continuation

TIP-021C-B must select and provision vendors. TIP-021C-C must rerun the
equivalent drills in staging and complete the production security review,
including the PostgreSQL RLS decision.
