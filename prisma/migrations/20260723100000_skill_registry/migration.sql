-- CreateEnum
CREATE TYPE "SkillStatus" AS ENUM ('ACTIVE', 'DEPRECATED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "skill" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "skill_key" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "SkillStatus" NOT NULL DEFAULT 'ACTIVE',
    "active_version_id" TEXT NOT NULL,
    "created_by_membership_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill_version" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "skill_id" TEXT NOT NULL,
    "semantic_version" TEXT NOT NULL,
    "capabilities" TEXT[] NOT NULL,
    "input_schema" JSONB NOT NULL,
    "output_schema" JSONB NOT NULL,
    "required_evidence" TEXT[] NOT NULL,
    "failure_states" TEXT[] NOT NULL,
    "verifier_binding" JSONB NOT NULL,
    "resource_estimate" JSONB NOT NULL,
    "assurance_compatibility" "AssuranceProfile"[] NOT NULL,
    "content_hash" TEXT NOT NULL,
    "created_by_membership_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "skill_version_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "skill_active_version_id_key" ON "skill"("active_version_id");

-- CreateIndex
CREATE UNIQUE INDEX "skill_workspace_id_skill_key_key" ON "skill"("workspace_id", "skill_key");

-- CreateIndex
CREATE INDEX "skill_workspace_id_status_idx" ON "skill"("workspace_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "skill_version_skill_id_semantic_version_key" ON "skill_version"("skill_id", "semantic_version");

-- CreateIndex
CREATE UNIQUE INDEX "skill_version_skill_id_content_hash_key" ON "skill_version"("skill_id", "content_hash");

-- CreateIndex
CREATE INDEX "skill_version_workspace_id_skill_id_idx" ON "skill_version"("workspace_id", "skill_id");

-- AddForeignKey
ALTER TABLE "skill" ADD CONSTRAINT "skill_workspace_id_fkey"
  FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- The active-version FK is deferred so initial Skill + SkillVersion creation
-- can be atomic while the Skill row remains non-nullable at every commit.
ALTER TABLE "skill" ADD CONSTRAINT "skill_active_version_id_fkey"
  FOREIGN KEY ("active_version_id") REFERENCES "skill_version"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE
  DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "skill_version" ADD CONSTRAINT "skill_version_workspace_id_fkey"
  FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill_version" ADD CONSTRAINT "skill_version_skill_id_fkey"
  FOREIGN KEY ("skill_id") REFERENCES "skill"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "skill"
  ADD CONSTRAINT "skill_version_positive"
  CHECK ("version" > 0);

ALTER TABLE "skill_version"
  ADD CONSTRAINT "skill_version_contract_sets_nonempty"
  CHECK (
    cardinality("capabilities") > 0
    AND cardinality("required_evidence") > 0
    AND cardinality("failure_states") > 0
    AND cardinality("assurance_compatibility") > 0
  );

-- Stable identity is database-enforced. The Skill projection may change
-- status/pointer/version, but never tenant or key.
CREATE OR REPLACE FUNCTION hiveos_skill_projection_guard()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF (
    NEW."workspace_id" IS DISTINCT FROM OLD."workspace_id"
    OR NEW."skill_key" IS DISTINCT FROM OLD."skill_key"
    OR NEW."created_by_membership_id" IS DISTINCT FROM OLD."created_by_membership_id"
    OR NEW."created_at" IS DISTINCT FROM OLD."created_at"
  ) THEN
    RAISE EXCEPTION 'skill stable identity is immutable'
      USING ERRCODE = 'restrict_violation';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER skill_projection_guard
  BEFORE UPDATE ON "skill"
  FOR EACH ROW EXECUTE FUNCTION hiveos_skill_projection_guard();

-- Deferred ownership check supports atomic circular insertion while proving at
-- commit that the active version belongs to this exact skill and workspace.
CREATE OR REPLACE FUNCTION hiveos_skill_active_version_guard()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM "skill_version" version_row
    WHERE version_row."id" = NEW."active_version_id"
      AND version_row."skill_id" = NEW."id"
      AND version_row."workspace_id" = NEW."workspace_id"
  ) THEN
    RAISE EXCEPTION 'active skill version must belong to the same skill and workspace'
      USING ERRCODE = 'foreign_key_violation';
  END IF;
  RETURN NEW;
END;
$$;

CREATE CONSTRAINT TRIGGER skill_active_version_guard
  AFTER INSERT OR UPDATE ON "skill"
  DEFERRABLE INITIALLY DEFERRED
  FOR EACH ROW EXECUTE FUNCTION hiveos_skill_active_version_guard();

CREATE OR REPLACE FUNCTION hiveos_skill_version_append_only()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'skill_version is append-only: % is not permitted', TG_OP
    USING ERRCODE = 'restrict_violation';
END;
$$;

CREATE TRIGGER skill_version_no_update_delete
  BEFORE UPDATE OR DELETE ON "skill_version"
  FOR EACH ROW EXECUTE FUNCTION hiveos_skill_version_append_only();
