# Environment Matrix

Status: `TIP-021C-A LOCAL CONTRACT`

`NODE_ENV` controls framework behavior. `DEPLOYMENT_ENV` names the operating
environment. Staging and production both require `NODE_ENV=production`.

| Boundary | Development | Test | Staging | Production |
| --- | --- | --- | --- | --- |
| `DEPLOYMENT_ENV` | `development` | `test` | `staging` | `production` |
| Database | local dev | isolated test | managed, dedicated | managed, dedicated |
| DB role | least privilege | least privilege | least privilege | least privilege |
| Migration role | local owner | test owner | separate secret | separate secret |
| Storage | local | isolated local | S3-compatible | S3-compatible |
| Server-side encryption | optional local | optional local | required | required |
| Mail | local sink | local sink | SMTP | SMTP |
| Self-sign-up | explicit | enabled for tests | Owner decision | Owner decision |
| Demo fixtures | optional labeled | forbidden by test policy | forbidden | forbidden |
| Secrets | local `.env` | committed non-prod test values | secret manager injection | secret manager injection |
| Maintenance | operator controlled | test controlled | operator controlled | operator controlled |

## Fail-closed rules

- A real runtime with `NODE_ENV=production` must explicitly name staging or
  production.
- Staging and production require S3-compatible storage, encryption intent,
  SMTP, HTTPS same-origin recovery URLs, a throttle secret, and bounded
  database settings.
- `DATABASE_URL` is the runtime role. `DATABASE_MIGRATION_URL` is never
  supplied to the application container.
- The container image contains no `.env` file. External platforms inject
  runtime secrets.
- Production demo fixtures and disabled authentication rate limiting are
  rejected.

## Owner decisions deferred to TIP-021C-B

- Hosting, PostgreSQL, object-storage, SMTP, secret-manager, and observability
  providers.
- Domain, DNS, region, data residency, and monthly budget.
- Production RPO, RTO, SLO, alert thresholds, and support/on-call model.
- Whether customer-managed KMS keys are required.
