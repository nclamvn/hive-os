-- TIP-023B: scoped grants, delegated authority, separation-of-duty policy,
-- and transaction-local PostgreSQL RLS for the Enterprise authority plane.

CREATE TYPE "EnterpriseRole" AS ENUM (
  'ORG_OWNER',
  'ORG_ADMIN',
  'PORTFOLIO_LEAD',
  'MISSION_OWNER',
  'CONTRIBUTOR',
  'BUILDER',
  'VERIFIER',
  'RELEASE_APPROVER',
  'AUDITOR',
  'VIEWER'
);
CREATE TYPE "GrantEffect" AS ENUM ('ALLOW', 'DENY');
CREATE TYPE "GrantSubjectType" AS ENUM ('USER', 'GROUP');
CREATE TYPE "GrantScopeType" AS ENUM (
  'ORGANIZATION',
  'ORG_UNIT',
  'WORKSPACE',
  'MISSION'
);
CREATE TYPE "GrantStatus" AS ENUM ('ACTIVE', 'REVOKED');

CREATE TABLE "organization_policy" (
  "organization_id" TEXT NOT NULL,
  "require_independent_verification" BOOLEAN NOT NULL DEFAULT true,
  "require_independent_release_approval" BOOLEAN NOT NULL DEFAULT true,
  "prevent_self_approval" BOOLEAN NOT NULL DEFAULT true,
  "max_delegation_depth" INTEGER NOT NULL DEFAULT 8,
  "updated_by_organization_membership_id" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  "version" INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT "organization_policy_pkey" PRIMARY KEY ("organization_id"),
  CONSTRAINT "organization_policy_delegation_depth"
    CHECK ("max_delegation_depth" BETWEEN 1 AND 16)
);

CREATE TABLE "scoped_grant" (
  "id" TEXT NOT NULL,
  "organization_id" TEXT NOT NULL,
  "subject_type" "GrantSubjectType" NOT NULL,
  "subject_user_id" TEXT,
  "subject_group_id" TEXT,
  "role" "EnterpriseRole" NOT NULL,
  "effect" "GrantEffect" NOT NULL DEFAULT 'ALLOW',
  "scope_type" "GrantScopeType" NOT NULL,
  "org_unit_id" TEXT,
  "workspace_id" TEXT,
  "mission_id" TEXT,
  "delegated_from_grant_id" TEXT,
  "granted_by_organization_membership_id" TEXT NOT NULL,
  "reason" TEXT NOT NULL,
  "valid_from" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "valid_until" TIMESTAMP(3),
  "status" "GrantStatus" NOT NULL DEFAULT 'ACTIVE',
  "revoked_at" TIMESTAMP(3),
  "revoked_by_organization_membership_id" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  "version" INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT "scoped_grant_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "scoped_grant_subject_shape" CHECK (
    (
      "subject_type" = 'USER'
      AND "subject_user_id" IS NOT NULL
      AND "subject_group_id" IS NULL
    )
    OR
    (
      "subject_type" = 'GROUP'
      AND "subject_user_id" IS NULL
      AND "subject_group_id" IS NOT NULL
    )
  ),
  CONSTRAINT "scoped_grant_scope_shape" CHECK (
    (
      "scope_type" = 'ORGANIZATION'
      AND "org_unit_id" IS NULL
      AND "workspace_id" IS NULL
      AND "mission_id" IS NULL
    )
    OR
    (
      "scope_type" = 'ORG_UNIT'
      AND "org_unit_id" IS NOT NULL
      AND "workspace_id" IS NULL
      AND "mission_id" IS NULL
    )
    OR
    (
      "scope_type" = 'WORKSPACE'
      AND "org_unit_id" IS NULL
      AND "workspace_id" IS NOT NULL
      AND "mission_id" IS NULL
    )
    OR
    (
      "scope_type" = 'MISSION'
      AND "org_unit_id" IS NULL
      AND "workspace_id" IS NULL
      AND "mission_id" IS NOT NULL
    )
  ),
  CONSTRAINT "scoped_grant_validity"
    CHECK ("valid_until" IS NULL OR "valid_until" > "valid_from"),
  CONSTRAINT "scoped_grant_revocation_shape" CHECK (
    (
      "status" = 'ACTIVE'
      AND "revoked_at" IS NULL
      AND "revoked_by_organization_membership_id" IS NULL
    )
    OR
    (
      "status" = 'REVOKED'
      AND "revoked_at" IS NOT NULL
      AND "revoked_by_organization_membership_id" IS NOT NULL
    )
  ),
  CONSTRAINT "scoped_grant_reason_nonempty"
    CHECK (length(btrim("reason")) BETWEEN 1 AND 500)
);

ALTER TABLE "agent_run"
  ADD COLUMN "performed_by_membership_id" TEXT,
  ADD CONSTRAINT "agent_run_performed_by_membership_id_fkey"
  FOREIGN KEY ("performed_by_membership_id") REFERENCES "membership"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE INDEX "agent_run_workspace_id_mission_id_performed_by_membership_idx"
  ON "agent_run"(
    "workspace_id", "mission_id", "performed_by_membership_id"
  );

CREATE UNIQUE INDEX "workspace_organization_id_id_key"
  ON "workspace"("organization_id", "id");
CREATE UNIQUE INDEX "scoped_grant_organization_id_id_key"
  ON "scoped_grant"("organization_id", "id");
CREATE INDEX "scoped_grant_organization_id_subject_user_id_status_valid_f_idx"
  ON "scoped_grant"(
    "organization_id", "subject_user_id", "status", "valid_from", "valid_until"
  );
CREATE INDEX "scoped_grant_organization_id_subject_group_id_status_valid_idx"
  ON "scoped_grant"(
    "organization_id", "subject_group_id", "status", "valid_from", "valid_until"
  );
CREATE INDEX "scoped_grant_organization_id_scope_type_org_unit_id_worksp_idx"
  ON "scoped_grant"(
    "organization_id", "scope_type", "org_unit_id", "workspace_id", "mission_id"
  );
CREATE INDEX "scoped_grant_organization_id_delegated_from_grant_id_idx"
  ON "scoped_grant"("organization_id", "delegated_from_grant_id");

ALTER TABLE "organization_policy"
  ADD CONSTRAINT "organization_policy_organization_id_fkey"
  FOREIGN KEY ("organization_id") REFERENCES "organization"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "organization_policy_organization_id_updated_by_organizati_fkey"
  FOREIGN KEY ("organization_id", "updated_by_organization_membership_id")
  REFERENCES "organization_membership"("organization_id", "id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "scoped_grant"
  ADD CONSTRAINT "scoped_grant_organization_id_fkey"
  FOREIGN KEY ("organization_id") REFERENCES "organization"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "scoped_grant_subject_user_id_fkey"
  FOREIGN KEY ("subject_user_id") REFERENCES "user"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "scoped_grant_organization_id_subject_group_id_fkey"
  FOREIGN KEY ("organization_id", "subject_group_id")
  REFERENCES "organization_group"("organization_id", "id")
  ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "scoped_grant_organization_id_org_unit_id_fkey"
  FOREIGN KEY ("organization_id", "org_unit_id")
  REFERENCES "org_unit"("organization_id", "id")
  ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "scoped_grant_organization_id_workspace_id_fkey"
  FOREIGN KEY ("organization_id", "workspace_id")
  REFERENCES "workspace"("organization_id", "id")
  ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "scoped_grant_mission_id_fkey"
  FOREIGN KEY ("mission_id") REFERENCES "mission"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "scoped_grant_organization_id_delegated_from_grant_id_fkey"
  FOREIGN KEY ("organization_id", "delegated_from_grant_id")
  REFERENCES "scoped_grant"("organization_id", "id")
  ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "scoped_grant_organization_id_granted_by_organization_me_fkey"
  FOREIGN KEY ("organization_id", "granted_by_organization_membership_id")
  REFERENCES "organization_membership"("organization_id", "id")
  ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "scoped_grant_organization_id_revoked_by_organization_mem_fkey"
  FOREIGN KEY ("organization_id", "revoked_by_organization_membership_id")
  REFERENCES "organization_membership"("organization_id", "id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

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
    SELECT "role", "effect", "status", "valid_from", "valid_until"
      INTO parent_record
    FROM "scoped_grant"
    WHERE "organization_id" = NEW."organization_id"
      AND "id" = NEW."delegated_from_grant_id";
    IF NOT FOUND
      OR parent_record."role" <> NEW."role"
      OR parent_record."effect" <> 'ALLOW'
      OR NEW."effect" <> 'ALLOW'
      OR parent_record."status" <> 'ACTIVE'
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

CREATE TRIGGER scoped_grant_validate
  BEFORE INSERT OR UPDATE ON "scoped_grant"
  FOR EACH ROW EXECUTE FUNCTION hiveos_scoped_grant_validate();

INSERT INTO "organization_policy" (
  "organization_id", "created_at", "updated_at"
)
SELECT "id", now(), now() FROM "organization";

INSERT INTO "scoped_grant" (
  "id", "organization_id", "subject_type", "subject_user_id",
  "role", "effect", "scope_type",
  "granted_by_organization_membership_id", "reason",
  "valid_from", "status", "created_at", "updated_at", "version"
)
SELECT
  organization_membership."id",
  organization_membership."organization_id",
  'USER',
  organization_membership."user_id",
  CASE organization_membership."role"
    WHEN 'OWNER' THEN 'ORG_OWNER'::"EnterpriseRole"
    WHEN 'ADMIN' THEN 'ORG_ADMIN'::"EnterpriseRole"
    WHEN 'MEMBER' THEN 'CONTRIBUTOR'::"EnterpriseRole"
    ELSE 'VIEWER'::"EnterpriseRole"
  END,
  'ALLOW',
  'ORGANIZATION',
  organization_membership."id",
  'TIP-023B compatibility authority',
  organization_membership."created_at",
  'ACTIVE',
  organization_membership."created_at",
  organization_membership."updated_at",
  organization_membership."version"
FROM "organization_membership";

-- Transaction-local tenant context. Empty/missing settings match no rows.
CREATE OR REPLACE FUNCTION hiveos_rls_organization_id()
RETURNS text
LANGUAGE sql
STABLE
PARALLEL SAFE
AS $$
  SELECT NULLIF(current_setting('hiveos.organization_id', true), '')
$$;

ALTER TABLE "organization" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "organization" FORCE ROW LEVEL SECURITY;
CREATE POLICY organization_tenant_isolation ON "organization"
  USING ("id" = hiveos_rls_organization_id())
  WITH CHECK ("id" = hiveos_rls_organization_id());

ALTER TABLE "organization_membership" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "organization_membership" FORCE ROW LEVEL SECURITY;
CREATE POLICY organization_membership_tenant_isolation
  ON "organization_membership"
  USING ("organization_id" = hiveos_rls_organization_id())
  WITH CHECK ("organization_id" = hiveos_rls_organization_id());

ALTER TABLE "organization_policy" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "organization_policy" FORCE ROW LEVEL SECURITY;
CREATE POLICY organization_policy_tenant_isolation ON "organization_policy"
  USING ("organization_id" = hiveos_rls_organization_id())
  WITH CHECK ("organization_id" = hiveos_rls_organization_id());

ALTER TABLE "org_unit" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "org_unit" FORCE ROW LEVEL SECURITY;
CREATE POLICY org_unit_tenant_isolation ON "org_unit"
  USING ("organization_id" = hiveos_rls_organization_id())
  WITH CHECK ("organization_id" = hiveos_rls_organization_id());

ALTER TABLE "org_unit_closure" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "org_unit_closure" FORCE ROW LEVEL SECURITY;
CREATE POLICY org_unit_closure_tenant_isolation ON "org_unit_closure"
  USING ("organization_id" = hiveos_rls_organization_id())
  WITH CHECK ("organization_id" = hiveos_rls_organization_id());

ALTER TABLE "portfolio" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "portfolio" FORCE ROW LEVEL SECURITY;
CREATE POLICY portfolio_tenant_isolation ON "portfolio"
  USING ("organization_id" = hiveos_rls_organization_id())
  WITH CHECK ("organization_id" = hiveos_rls_organization_id());

ALTER TABLE "organization_group" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "organization_group" FORCE ROW LEVEL SECURITY;
CREATE POLICY organization_group_tenant_isolation ON "organization_group"
  USING ("organization_id" = hiveos_rls_organization_id())
  WITH CHECK ("organization_id" = hiveos_rls_organization_id());

ALTER TABLE "organization_group_membership" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "organization_group_membership" FORCE ROW LEVEL SECURITY;
CREATE POLICY organization_group_membership_tenant_isolation
  ON "organization_group_membership"
  USING ("organization_id" = hiveos_rls_organization_id())
  WITH CHECK ("organization_id" = hiveos_rls_organization_id());

ALTER TABLE "scoped_grant" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "scoped_grant" FORCE ROW LEVEL SECURITY;
CREATE POLICY scoped_grant_tenant_isolation ON "scoped_grant"
  USING ("organization_id" = hiveos_rls_organization_id())
  WITH CHECK ("organization_id" = hiveos_rls_organization_id());
