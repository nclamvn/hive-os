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

-- Append-only tables for the runtime role: SELECT + INSERT only. The role
-- never receives UPDATE/DELETE/TRUNCATE (and cannot ALTER/own them), so the
-- append-only database triggers cannot be dropped or bypassed by it.
REVOKE UPDATE, DELETE, TRUNCATE ON TABLE audit_event FROM hiveos_app;
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'gate_run') THEN
    REVOKE UPDATE, DELETE, TRUNCATE ON TABLE gate_run FROM hiveos_app;
  END IF;
END
$$;

-- The runtime role has no business with the migration ledger.
REVOKE ALL ON TABLE _prisma_migrations FROM hiveos_app;

-- Tables created later by the owner auto-grant runtime DML.
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO hiveos_app;
