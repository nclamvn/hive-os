-- TIP-023A: enterprise Organization graph with a compatibility-safe backfill.
-- Existing workspaces become one-organization tenants; no cross-workspace
-- grouping is inferred by the migration.

CREATE TYPE "OrgUnitType" AS ENUM (
  'ROOT',
  'SUBSIDIARY',
  'BUSINESS_UNIT',
  'DEPARTMENT',
  'TEAM'
);

CREATE TABLE "organization" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "status" "WorkspaceStatus" NOT NULL DEFAULT 'ACTIVE',
  "created_by_id" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  "version" INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT "organization_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "organization_slug_key" ON "organization"("slug");

CREATE TABLE "organization_membership" (
  "id" TEXT NOT NULL,
  "organization_id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "role" "Role" NOT NULL DEFAULT 'MEMBER',
  "status" "MembershipStatus" NOT NULL DEFAULT 'ACTIVE',
  "created_by_id" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  "version" INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT "organization_membership_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "org_unit" (
  "id" TEXT NOT NULL,
  "organization_id" TEXT NOT NULL,
  "parent_id" TEXT,
  "unit_key" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "type" "OrgUnitType" NOT NULL,
  "status" "WorkspaceStatus" NOT NULL DEFAULT 'ACTIVE',
  "created_by_id" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  "version" INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT "org_unit_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "org_unit_root_shape" CHECK (
    ("type" = 'ROOT' AND "parent_id" IS NULL)
    OR
    ("type" <> 'ROOT' AND "parent_id" IS NOT NULL)
  )
);

CREATE TABLE "org_unit_closure" (
  "organization_id" TEXT NOT NULL,
  "ancestor_id" TEXT NOT NULL,
  "descendant_id" TEXT NOT NULL,
  "depth" INTEGER NOT NULL,
  CONSTRAINT "org_unit_closure_pkey"
    PRIMARY KEY ("organization_id", "ancestor_id", "descendant_id"),
  CONSTRAINT "org_unit_closure_depth_nonnegative" CHECK ("depth" >= 0),
  CONSTRAINT "org_unit_closure_self_depth" CHECK (
    ("ancestor_id" = "descendant_id" AND "depth" = 0)
    OR
    ("ancestor_id" <> "descendant_id" AND "depth" > 0)
  )
);

CREATE TABLE "portfolio" (
  "id" TEXT NOT NULL,
  "organization_id" TEXT NOT NULL,
  "org_unit_id" TEXT NOT NULL,
  "portfolio_key" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "status" "WorkspaceStatus" NOT NULL DEFAULT 'ACTIVE',
  "created_by_id" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  "version" INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT "portfolio_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "organization_group" (
  "id" TEXT NOT NULL,
  "organization_id" TEXT NOT NULL,
  "group_key" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "status" "MembershipStatus" NOT NULL DEFAULT 'ACTIVE',
  "created_by_id" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  "version" INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT "organization_group_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "organization_group_membership" (
  "id" TEXT NOT NULL,
  "organization_id" TEXT NOT NULL,
  "group_id" TEXT NOT NULL,
  "organization_membership_id" TEXT NOT NULL,
  "created_by_id" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "organization_group_membership_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "organization_membership_organization_id_user_id_key"
  ON "organization_membership"("organization_id", "user_id");
CREATE UNIQUE INDEX "organization_membership_organization_id_id_key"
  ON "organization_membership"("organization_id", "id");
CREATE INDEX "organization_membership_user_id_status_idx"
  ON "organization_membership"("user_id", "status");
CREATE INDEX "organization_membership_organization_id_role_status_idx"
  ON "organization_membership"("organization_id", "role", "status");

CREATE UNIQUE INDEX "org_unit_organization_id_unit_key_key"
  ON "org_unit"("organization_id", "unit_key");
CREATE UNIQUE INDEX "org_unit_organization_id_id_key"
  ON "org_unit"("organization_id", "id");
CREATE UNIQUE INDEX "org_unit_one_root_per_organization"
  ON "org_unit"("organization_id") WHERE "type" = 'ROOT';
CREATE INDEX "org_unit_organization_id_parent_id_status_idx"
  ON "org_unit"("organization_id", "parent_id", "status");
CREATE INDEX "org_unit_closure_organization_id_descendant_id_depth_idx"
  ON "org_unit_closure"("organization_id", "descendant_id", "depth");
CREATE INDEX "org_unit_closure_organization_id_ancestor_id_depth_idx"
  ON "org_unit_closure"("organization_id", "ancestor_id", "depth");

CREATE UNIQUE INDEX "portfolio_organization_id_portfolio_key_key"
  ON "portfolio"("organization_id", "portfolio_key");
CREATE UNIQUE INDEX "portfolio_organization_id_id_key"
  ON "portfolio"("organization_id", "id");
CREATE INDEX "portfolio_organization_id_org_unit_id_status_idx"
  ON "portfolio"("organization_id", "org_unit_id", "status");

CREATE UNIQUE INDEX "organization_group_organization_id_group_key_key"
  ON "organization_group"("organization_id", "group_key");
CREATE UNIQUE INDEX "organization_group_organization_id_id_key"
  ON "organization_group"("organization_id", "id");
CREATE INDEX "organization_group_organization_id_status_idx"
  ON "organization_group"("organization_id", "status");
CREATE UNIQUE INDEX "organization_group_membership_organization_id_group_id_orga_key"
  ON "organization_group_membership"(
    "organization_id",
    "group_id",
    "organization_membership_id"
  );
CREATE INDEX "organization_group_membership_organization_id_organization__idx"
  ON "organization_group_membership"(
    "organization_id",
    "organization_membership_id"
  );

ALTER TABLE "organization_membership"
  ADD CONSTRAINT "organization_membership_organization_id_fkey"
  FOREIGN KEY ("organization_id") REFERENCES "organization"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "organization_membership_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "user"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "org_unit"
  ADD CONSTRAINT "org_unit_organization_id_fkey"
  FOREIGN KEY ("organization_id") REFERENCES "organization"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "org_unit_organization_id_parent_id_fkey"
  FOREIGN KEY ("organization_id", "parent_id")
  REFERENCES "org_unit"("organization_id", "id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "org_unit_closure"
  ADD CONSTRAINT "org_unit_closure_organization_id_fkey"
  FOREIGN KEY ("organization_id") REFERENCES "organization"("id")
  ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "org_unit_closure_organization_id_ancestor_id_fkey"
  FOREIGN KEY ("organization_id", "ancestor_id")
  REFERENCES "org_unit"("organization_id", "id")
  ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "org_unit_closure_organization_id_descendant_id_fkey"
  FOREIGN KEY ("organization_id", "descendant_id")
  REFERENCES "org_unit"("organization_id", "id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "portfolio"
  ADD CONSTRAINT "portfolio_organization_id_fkey"
  FOREIGN KEY ("organization_id") REFERENCES "organization"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "portfolio_organization_id_org_unit_id_fkey"
  FOREIGN KEY ("organization_id", "org_unit_id")
  REFERENCES "org_unit"("organization_id", "id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "organization_group"
  ADD CONSTRAINT "organization_group_organization_id_fkey"
  FOREIGN KEY ("organization_id") REFERENCES "organization"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "organization_group_membership"
  ADD CONSTRAINT "organization_group_membership_organization_id_organization_fkey"
  FOREIGN KEY ("organization_id", "organization_membership_id")
  REFERENCES "organization_membership"("organization_id", "id")
  ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "organization_group_membership_organization_id_group_id_fkey"
  FOREIGN KEY ("organization_id", "group_id")
  REFERENCES "organization_group"("organization_id", "id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- Closure rows are maintained by the database so imports and future workers
-- cannot bypass hierarchy invariants.
CREATE OR REPLACE FUNCTION hiveos_org_unit_validate()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM 1 FROM "organization"
    WHERE "id" = NEW."organization_id"
    FOR UPDATE;

  IF TG_OP = 'UPDATE' AND NEW."organization_id" <> OLD."organization_id" THEN
    RAISE EXCEPTION 'org_unit organization cannot change'
      USING ERRCODE = 'integrity_constraint_violation';
  END IF;

  IF NEW."type" = 'ROOT' AND NEW."parent_id" IS NOT NULL THEN
    RAISE EXCEPTION 'root org_unit cannot have a parent'
      USING ERRCODE = 'check_violation';
  END IF;
  IF NEW."type" <> 'ROOT' AND NEW."parent_id" IS NULL THEN
    RAISE EXCEPTION 'non-root org_unit requires a parent'
      USING ERRCODE = 'check_violation';
  END IF;

  IF NEW."parent_id" = NEW."id" OR (
    TG_OP = 'UPDATE'
    AND NEW."parent_id" IS DISTINCT FROM OLD."parent_id"
    AND EXISTS (
      SELECT 1
      FROM "org_unit_closure"
      WHERE "organization_id" = NEW."organization_id"
        AND "ancestor_id" = NEW."id"
        AND "descendant_id" = NEW."parent_id"
    )
  ) THEN
    RAISE EXCEPTION 'org_unit hierarchy cycle'
      USING ERRCODE = 'integrity_constraint_violation';
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION hiveos_org_unit_insert_closure()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO "org_unit_closure" (
    "organization_id", "ancestor_id", "descendant_id", "depth"
  )
  VALUES (NEW."organization_id", NEW."id", NEW."id", 0);

  IF NEW."parent_id" IS NOT NULL THEN
    INSERT INTO "org_unit_closure" (
      "organization_id", "ancestor_id", "descendant_id", "depth"
    )
    SELECT
      NEW."organization_id",
      parent_path."ancestor_id",
      NEW."id",
      parent_path."depth" + 1
    FROM "org_unit_closure" parent_path
    WHERE parent_path."organization_id" = NEW."organization_id"
      AND parent_path."descendant_id" = NEW."parent_id";
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION hiveos_org_unit_move_closure()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW."parent_id" IS NOT DISTINCT FROM OLD."parent_id" THEN
    RETURN NEW;
  END IF;

  DELETE FROM "org_unit_closure" path
  USING "org_unit_closure" old_ancestor,
        "org_unit_closure" subtree
  WHERE old_ancestor."organization_id" = NEW."organization_id"
    AND old_ancestor."descendant_id" = NEW."id"
    AND old_ancestor."ancestor_id" <> NEW."id"
    AND subtree."organization_id" = NEW."organization_id"
    AND subtree."ancestor_id" = NEW."id"
    AND path."organization_id" = NEW."organization_id"
    AND path."ancestor_id" = old_ancestor."ancestor_id"
    AND path."descendant_id" = subtree."descendant_id";

  IF NEW."parent_id" IS NOT NULL THEN
    INSERT INTO "org_unit_closure" (
      "organization_id", "ancestor_id", "descendant_id", "depth"
    )
    SELECT
      NEW."organization_id",
      new_ancestor."ancestor_id",
      subtree."descendant_id",
      new_ancestor."depth" + 1 + subtree."depth"
    FROM "org_unit_closure" new_ancestor
    CROSS JOIN "org_unit_closure" subtree
    WHERE new_ancestor."organization_id" = NEW."organization_id"
      AND new_ancestor."descendant_id" = NEW."parent_id"
      AND subtree."organization_id" = NEW."organization_id"
      AND subtree."ancestor_id" = NEW."id"
    ON CONFLICT ("organization_id", "ancestor_id", "descendant_id")
    DO UPDATE SET "depth" = EXCLUDED."depth";
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER org_unit_validate
  BEFORE INSERT OR UPDATE OF "organization_id", "parent_id", "type"
  ON "org_unit"
  FOR EACH ROW EXECUTE FUNCTION hiveos_org_unit_validate();

CREATE TRIGGER org_unit_insert_closure
  AFTER INSERT ON "org_unit"
  FOR EACH ROW EXECUTE FUNCTION hiveos_org_unit_insert_closure();

CREATE TRIGGER org_unit_move_closure
  AFTER UPDATE OF "parent_id" ON "org_unit"
  FOR EACH ROW EXECUTE FUNCTION hiveos_org_unit_move_closure();

-- Compatibility backfill. Reusing each Workspace identifier in the new
-- Organization and root-unit namespaces makes the mapping deterministic.
INSERT INTO "organization" (
  "id", "slug", "name", "status", "created_by_id",
  "created_at", "updated_at", "version"
)
SELECT
  "id", "slug", "name", "status", "created_by_id",
  "created_at", "updated_at", "version"
FROM "workspace";

INSERT INTO "org_unit" (
  "id", "organization_id", "parent_id", "unit_key", "name", "type",
  "status", "created_by_id", "created_at", "updated_at", "version"
)
SELECT
  "id", "id", NULL, 'root', "name", 'ROOT',
  "status", "created_by_id", "created_at", "updated_at", "version"
FROM "workspace";

INSERT INTO "organization_membership" (
  "id", "organization_id", "user_id", "role", "status",
  "created_by_id", "created_at", "updated_at", "version"
)
SELECT
  membership."id", membership."workspace_id", membership."user_id",
  membership."role", membership."status", membership."created_by_id",
  membership."created_at", membership."updated_at", membership."version"
FROM "membership";

ALTER TABLE "workspace"
  ADD COLUMN "organization_id" TEXT,
  ADD COLUMN "org_unit_id" TEXT,
  ADD COLUMN "portfolio_id" TEXT;

UPDATE "workspace"
SET "organization_id" = "id", "org_unit_id" = "id";

ALTER TABLE "workspace"
  ALTER COLUMN "organization_id" SET NOT NULL,
  ALTER COLUMN "org_unit_id" SET NOT NULL;

CREATE INDEX "workspace_organization_id_org_unit_id_status_idx"
  ON "workspace"("organization_id", "org_unit_id", "status");
CREATE INDEX "workspace_organization_id_portfolio_id_status_idx"
  ON "workspace"("organization_id", "portfolio_id", "status");

ALTER TABLE "workspace"
  ADD CONSTRAINT "workspace_organization_id_fkey"
  FOREIGN KEY ("organization_id") REFERENCES "organization"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "workspace_organization_id_org_unit_id_fkey"
  FOREIGN KEY ("organization_id", "org_unit_id")
  REFERENCES "org_unit"("organization_id", "id")
  ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "workspace_organization_id_portfolio_id_fkey"
  FOREIGN KEY ("organization_id", "portfolio_id")
  REFERENCES "portfolio"("organization_id", "id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
