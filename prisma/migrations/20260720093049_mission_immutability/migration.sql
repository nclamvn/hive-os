-- Mission Kernel database-level reinforcement (TIP-004).

-- 1. gate_run is append-only (like audit_event): reject UPDATE/DELETE.
CREATE OR REPLACE FUNCTION hiveos_gate_run_append_only()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'gate_run is append-only: % is not permitted', TG_OP
    USING ERRCODE = 'restrict_violation';
END;
$$;

CREATE TRIGGER gate_run_no_update
  BEFORE UPDATE ON "gate_run"
  FOR EACH ROW EXECUTE FUNCTION hiveos_gate_run_append_only();

CREATE TRIGGER gate_run_no_delete
  BEFORE DELETE ON "gate_run"
  FOR EACH ROW EXECUTE FUNCTION hiveos_gate_run_append_only();

-- 2. An APPROVED/SUPERSEDED mission_contract's content is immutable; only the
--    status transition to SUPERSEDED (and supersession linkage) may change.
CREATE OR REPLACE FUNCTION hiveos_contract_content_frozen()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.status IN ('APPROVED', 'SUPERSEDED') THEN
    IF NEW.objective IS DISTINCT FROM OLD.objective
       OR NEW.scope IS DISTINCT FROM OLD.scope
       OR NEW.success_definition IS DISTINCT FROM OLD.success_definition
       OR NEW.assurance_profile IS DISTINCT FROM OLD.assurance_profile
       OR NEW.version_number IS DISTINCT FROM OLD.version_number
       OR NEW.mission_id IS DISTINCT FROM OLD.mission_id THEN
      RAISE EXCEPTION 'approved contract content is immutable'
        USING ERRCODE = 'restrict_violation';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER mission_contract_content_frozen
  BEFORE UPDATE ON "mission_contract"
  FOR EACH ROW EXECUTE FUNCTION hiveos_contract_content_frozen();

-- 3. Contract definition rows are immutable once their contract leaves DRAFT
--    (i.e. once submitted/approved). Blocks UPDATE and DELETE.
CREATE OR REPLACE FUNCTION hiveos_contract_def_frozen()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  cid text;
  cstatus text;
BEGIN
  cid := COALESCE(OLD.contract_id, NEW.contract_id);
  SELECT status INTO cstatus FROM "mission_contract" WHERE id = cid;
  IF cstatus IS NOT NULL AND cstatus <> 'DRAFT' THEN
    RAISE EXCEPTION 'contract definitions are frozen once the contract leaves DRAFT (status=%): % on %',
      cstatus, TG_OP, TG_TABLE_NAME
      USING ERRCODE = 'restrict_violation';
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER requirement_frozen
  BEFORE UPDATE OR DELETE ON "requirement"
  FOR EACH ROW EXECUTE FUNCTION hiveos_contract_def_frozen();
CREATE TRIGGER assumption_frozen
  BEFORE UPDATE OR DELETE ON "assumption"
  FOR EACH ROW EXECUTE FUNCTION hiveos_contract_def_frozen();
CREATE TRIGGER constraint_frozen
  BEFORE UPDATE OR DELETE ON "constraint"
  FOR EACH ROW EXECUTE FUNCTION hiveos_contract_def_frozen();
CREATE TRIGGER mission_input_frozen
  BEFORE UPDATE OR DELETE ON "mission_input"
  FOR EACH ROW EXECUTE FUNCTION hiveos_contract_def_frozen();
CREATE TRIGGER contract_obligation_frozen
  BEFORE UPDATE OR DELETE ON "contract_obligation"
  FOR EACH ROW EXECUTE FUNCTION hiveos_contract_def_frozen();
CREATE TRIGGER contract_gate_frozen
  BEFORE UPDATE OR DELETE ON "contract_gate"
  FOR EACH ROW EXECUTE FUNCTION hiveos_contract_def_frozen();
