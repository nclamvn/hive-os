-- A delegated grant may narrow time, but TIP-023B deliberately requires an
-- exact resource boundary. Keep that invariant at the database edge as well
-- as in the authorization service.
CREATE OR REPLACE FUNCTION hiveos_scoped_grant_validate()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  resource_organization_id TEXT;
  parent_record RECORD;
BEGIN
  IF NEW."subject_type" = 'USER' AND NOT EXISTS (
    SELECT 1 FROM "organization_membership"
    WHERE "organization_id" = NEW."organization_id"
      AND "user_id" = NEW."subject_user_id"
  ) THEN
    RAISE EXCEPTION 'grant subject is not an organization member'
      USING ERRCODE = 'foreign_key_violation';
  END IF;

  IF NEW."scope_type" = 'WORKSPACE' THEN
    SELECT "organization_id" INTO resource_organization_id
    FROM "workspace" WHERE "id" = NEW."workspace_id";
  ELSIF NEW."scope_type" = 'MISSION' THEN
    SELECT workspace."organization_id" INTO resource_organization_id
    FROM "mission"
    JOIN "workspace" ON workspace."id" = mission."workspace_id"
    WHERE mission."id" = NEW."mission_id";
  ELSE
    resource_organization_id := NEW."organization_id";
  END IF;
  IF resource_organization_id IS DISTINCT FROM NEW."organization_id" THEN
    RAISE EXCEPTION 'grant resource crosses organization boundary'
      USING ERRCODE = 'foreign_key_violation';
  END IF;

  IF NEW."delegated_from_grant_id" IS NOT NULL THEN
    SELECT
      "role", "effect", "status", "valid_from", "valid_until",
      "scope_type", "org_unit_id", "workspace_id", "mission_id"
      INTO parent_record
    FROM "scoped_grant"
    WHERE "organization_id" = NEW."organization_id"
      AND "id" = NEW."delegated_from_grant_id";
    IF NOT FOUND
      OR parent_record."role" <> NEW."role"
      OR parent_record."effect" <> 'ALLOW'
      OR NEW."effect" <> 'ALLOW'
      OR parent_record."status" <> 'ACTIVE'
      OR parent_record."scope_type" <> NEW."scope_type"
      OR parent_record."org_unit_id" IS DISTINCT FROM NEW."org_unit_id"
      OR parent_record."workspace_id" IS DISTINCT FROM NEW."workspace_id"
      OR parent_record."mission_id" IS DISTINCT FROM NEW."mission_id"
      OR NEW."valid_from" < parent_record."valid_from"
      OR (
        parent_record."valid_until" IS NOT NULL
        AND (
          NEW."valid_until" IS NULL
          OR NEW."valid_until" > parent_record."valid_until"
        )
      )
    THEN
      RAISE EXCEPTION 'delegated grant exceeds or invalidates parent authority'
        USING ERRCODE = 'integrity_constraint_violation';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
