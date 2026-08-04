-- TIP-023G hardens lifecycle/export ledger immutability.

CREATE OR REPLACE FUNCTION hiveos_tip023g_delete_guard()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'governed lifecycle/export ledger is append-only';
END
$$;
CREATE TRIGGER legal_hold_delete_guard BEFORE DELETE ON "legal_hold"
  FOR EACH ROW EXECUTE FUNCTION hiveos_tip023g_delete_guard();
CREATE TRIGGER lifecycle_disposition_delete_guard BEFORE DELETE ON "lifecycle_disposition"
  FOR EACH ROW EXECUTE FUNCTION hiveos_tip023g_delete_guard();
CREATE TRIGGER dossier_export_delete_guard BEFORE DELETE ON "dossier_export"
  FOR EACH ROW EXECUTE FUNCTION hiveos_tip023g_delete_guard();
CREATE TRIGGER dossier_export_part_append_only BEFORE UPDATE OR DELETE ON "dossier_export_part"
  FOR EACH ROW EXECUTE FUNCTION hiveos_tip023g_delete_guard();

CREATE OR REPLACE FUNCTION hiveos_legal_hold_identity_guard()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.status = 'RELEASED' THEN
    RAISE EXCEPTION 'released legal hold is immutable';
  END IF;
  IF NEW.id <> OLD.id OR NEW.organization_id <> OLD.organization_id
    OR NEW.workspace_id <> OLD.workspace_id
    OR NEW.mission_id IS DISTINCT FROM OLD.mission_id
    OR NEW.scope <> OLD.scope OR NEW.reason <> OLD.reason
    OR NEW.placed_by_organization_membership_id <> OLD.placed_by_organization_membership_id
    OR NEW.placed_at <> OLD.placed_at
  THEN
    RAISE EXCEPTION 'legal hold identity is immutable';
  END IF;
  RETURN NEW;
END
$$;
CREATE TRIGGER legal_hold_identity_guard BEFORE UPDATE ON "legal_hold"
  FOR EACH ROW EXECUTE FUNCTION hiveos_legal_hold_identity_guard();

CREATE OR REPLACE FUNCTION hiveos_dossier_export_identity_guard()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.status IN ('SUCCEEDED', 'FAILED') THEN
    RAISE EXCEPTION 'terminal dossier export is immutable';
  END IF;
  IF NEW.id <> OLD.id OR NEW.organization_id <> OLD.organization_id
    OR NEW.workspace_id <> OLD.workspace_id OR NEW.mission_id <> OLD.mission_id
    OR NEW.requested_by_organization_membership_id <> OLD.requested_by_organization_membership_id
    OR NEW.command_id <> OLD.command_id OR NEW.snapshot_at <> OLD.snapshot_at
    OR NEW.mission_version <> OLD.mission_version OR NEW.created_at <> OLD.created_at
  THEN
    RAISE EXCEPTION 'dossier export identity is immutable';
  END IF;
  RETURN NEW;
END
$$;
CREATE TRIGGER dossier_export_identity_guard BEFORE UPDATE ON "dossier_export"
  FOR EACH ROW EXECUTE FUNCTION hiveos_dossier_export_identity_guard();
