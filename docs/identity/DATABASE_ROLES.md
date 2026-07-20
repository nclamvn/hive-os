# Database Roles & Least Privilege (SEC-03)

The application runtime never connects as a PostgreSQL superuser or the
migration owner.

| Connection | Env var | Role | Used for |
|---|---|---|---|
| Migration/owner | `DATABASE_MIGRATION_URL` | `hiveos` (owner) | Prisma migrations + configuring the runtime role |
| Runtime | `DATABASE_URL` | `hiveos_app` (least privilege) | The running application (Next.js server, integration/E2E app) |

## Runtime role (`hiveos_app`)

Created/configured by `scripts/db/app-role.sql` (applied by the owner after
migrations; `npm run db:setup-role` or `npm run db:bootstrap`).

- `SUPERUSER=false`, `CREATEDB=false`, `CREATEROLE=false`, `BYPASSRLS=false`.
- Does **not** own the database, schema, `audit_event`, or the audit trigger
  function.
- `audit_event`: `SELECT` + `INSERT` only. `UPDATE`/`DELETE`/`TRUNCATE` are
  revoked, and it cannot `ALTER`/own the table — so it can neither mutate audit
  rows nor drop the append-only trigger.
- Better Auth tables (`user`, `account`, `session`, `verification`) and
  `workspace`/`membership`/`invitation`: ordinary DML.
- `_prisma_migrations`: no privileges.
- `ALTER DEFAULT PRIVILEGES` grants runtime DML on future owner-created tables.

## Defense layers on audit immutability

1. **Privilege**: the runtime role lacks `UPDATE`/`DELETE` on `audit_event`
   ("permission denied").
2. **Trigger**: `audit_event_no_update` / `audit_event_no_delete` reject the
   operation for any role that does hold the privilege (e.g. the owner).

Evidence: `artifacts/tip-003c/db-role-evidence.txt` (DB-ROLE-01..07), generated
using the exact runtime role.

## Commands

```bash
npm run db:migrate      # migrate deploy as the owner (DATABASE_MIGRATION_URL)
npm run db:setup-role   # configure hiveos_app + grants
npm run db:bootstrap    # both, in order
```

Local container credentials (`hiveos` / `hiveos_app`) are public development
fixtures, labelled local-only. Production supplies its own credentials.
