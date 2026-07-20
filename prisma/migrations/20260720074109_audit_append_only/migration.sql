-- Enforce append-only semantics for audit_event at the database level.
-- Any UPDATE or DELETE (including application code that bypasses the ORM
-- guard) is rejected. INSERT remains permitted.

CREATE OR REPLACE FUNCTION hiveos_audit_event_append_only()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'audit_event is append-only: % is not permitted', TG_OP
    USING ERRCODE = 'restrict_violation';
END;
$$;

CREATE TRIGGER audit_event_no_update
  BEFORE UPDATE ON "audit_event"
  FOR EACH ROW
  EXECUTE FUNCTION hiveos_audit_event_append_only();

CREATE TRIGGER audit_event_no_delete
  BEFORE DELETE ON "audit_event"
  FOR EACH ROW
  EXECUTE FUNCTION hiveos_audit_event_append_only();
