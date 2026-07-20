-- Least-privilege runtime role for the HIVE OS application.
-- Applied by the OWNER connection AFTER migrations (tables must exist).
-- The password here is a local-only development fixture (same class as the
-- container's POSTGRES_PASSWORD); production supplies its own credentials.

DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'hiveos_app') THEN
    CREATE ROLE hiveos_app LOGIN PASSWORD 'hiveos_app'
      NOSUPERUSER NOCREATEDB NOCREATEROLE NOBYPASSRLS;
  ELSE
    ALTER ROLE hiveos_app LOGIN PASSWORD 'hiveos_app'
      NOSUPERUSER NOCREATEDB NOCREATEROLE NOBYPASSRLS;
  END IF;
END
$$;

GRANT USAGE ON SCHEMA public TO hiveos_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO hiveos_app;

-- audit_event is append-only for the runtime role: SELECT + INSERT only.
-- The role never receives UPDATE/DELETE/TRUNCATE (and cannot ALTER/own it),
-- so the append-only database trigger cannot be dropped or bypassed by it.
REVOKE UPDATE, DELETE, TRUNCATE ON TABLE audit_event FROM hiveos_app;

-- The runtime role has no business with the migration ledger.
REVOKE ALL ON TABLE _prisma_migrations FROM hiveos_app;

-- Tables created later by the owner auto-grant runtime DML.
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO hiveos_app;
