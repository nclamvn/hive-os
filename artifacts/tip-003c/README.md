# TIP-003C Security Closure Evidence

- `db-role-evidence.txt` — DB-ROLE-01..07 proving the runtime role `hiveos_app`
  is least-privileged (non-superuser, owns nothing) and cannot UPDATE/DELETE
  audit_event nor drop its trigger, while ordinary auth DML still works.

Generated with the exact runtime role. Regenerate via the DB-role checks in the
TIP-003C closure. No passwords are printed.
