# Provider-Neutral Deployment Runbook

Status: `LOCAL CONTRACT — NO EXTERNAL DEPLOYMENT AUTHORIZED`

## Artifact

`Dockerfile` builds the Next.js standalone output and runs it as the unprivileged
`hiveos` user. `.dockerignore` excludes local environments, storage, test
artifacts, Git history, and dependency directories.

Local verification:

```bash
docker build -t hiveos:tip-021c-a .
docker inspect hiveos:tip-021c-a --format '{{.Config.User}}'
```

The expected user is `hiveos`. Image creation is local evidence only.

## Deployment sequence

1. Select the exact reviewed commit and immutable image digest.
2. Inject runtime secrets from the platform secret manager. Do not copy
   `.env`, migration credentials, or local storage into the image.
3. Run `prisma migrate status` and `prisma migrate deploy` as a separate,
   short-lived migration job using `DATABASE_MIGRATION_URL`.
4. Configure the least-privileged runtime role.
5. Start the application container with only `DATABASE_URL`.
6. Require `/api/health/live` for liveness and `/api/health/ready` for
   readiness. Do not send traffic until readiness returns 200.
7. Run authenticated smoke and cross-workspace negative scenarios.
8. Record commit, image digest, migration ledger, configuration class, operator,
   time, and smoke evidence.

## Maintenance mode

Set `MAINTENANCE_MODE=true` and restart/roll the application through the
platform. User and API traffic receives 503 with `Retry-After`; health probes
remain reachable. Maintenance mode does not replace database access controls
and must never be used to hide a failed readiness state.

## Rollback

- Application-only failure: route traffic back to the prior immutable image
  when its schema compatibility is proven.
- Schema/data failure: do not run an improvised down migration. Stop writes,
  retain evidence, and follow `MIGRATION_RECOVERY_RUNBOOK.md`.

No production command in this runbook is authorized until TIP-021C-B/C.
