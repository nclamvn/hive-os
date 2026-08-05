-- Governed Authoring Workspace: mission-scoped documents with immutable,
-- content-hashed revisions and organization-enforced tenant isolation.

CREATE TYPE "AuthoringDocumentType" AS ENUM (
  'RESEARCH_PROPOSAL',
  'TECHNICAL_PROPOSAL',
  'CLIENT_PROPOSAL',
  'COURSE_DOSSIER',
  'RESEARCH_PAPER',
  'OTHER'
);

CREATE TYPE "AuthoringDocumentStatus" AS ENUM (
  'DRAFT',
  'IN_REVIEW',
  'APPROVED',
  'PUBLISHED',
  'ARCHIVED'
);

CREATE TABLE "authoring_document" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "organization_id" TEXT NOT NULL,
  "workspace_id" TEXT NOT NULL,
  "mission_id" TEXT NOT NULL,
  "document_key" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "document_type" "AuthoringDocumentType" NOT NULL,
  "status" "AuthoringDocumentStatus" NOT NULL DEFAULT 'DRAFT',
  "current_revision_number" INTEGER NOT NULL DEFAULT 1,
  "created_by_membership_id" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "version" INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT "authoring_document_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "authoring_document_revision_positive" CHECK ("current_revision_number" > 0)
);

CREATE TABLE "authoring_revision" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "organization_id" TEXT NOT NULL,
  "workspace_id" TEXT NOT NULL,
  "mission_id" TEXT NOT NULL,
  "document_id" TEXT NOT NULL,
  "revision_number" INTEGER NOT NULL,
  "title" TEXT NOT NULL,
  "abstract" TEXT NOT NULL,
  "sections" JSONB NOT NULL,
  "citations" JSONB NOT NULL,
  "computational_artifacts" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "quality_report" JSONB NOT NULL,
  "content_hash" TEXT NOT NULL,
  "change_summary" TEXT NOT NULL,
  "created_by_membership_id" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "authoring_revision_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "authoring_revision_number_positive" CHECK ("revision_number" > 0),
  CONSTRAINT "authoring_revision_hash_shape" CHECK ("content_hash" ~ '^[a-f0-9]{64}$')
);

CREATE UNIQUE INDEX "authoring_document_workspace_id_document_key_key"
  ON "authoring_document"("workspace_id", "document_key");
CREATE UNIQUE INDEX "authoring_document_workspace_id_id_key"
  ON "authoring_document"("workspace_id", "id");
CREATE INDEX "authoring_document_organization_id_workspace_id_status_idx"
  ON "authoring_document"("organization_id", "workspace_id", "status");
CREATE INDEX "authoring_document_workspace_id_mission_id_updated_at_idx"
  ON "authoring_document"("workspace_id", "mission_id", "updated_at");

CREATE UNIQUE INDEX "authoring_revision_document_id_revision_number_key"
  ON "authoring_revision"("document_id", "revision_number");
CREATE UNIQUE INDEX "authoring_revision_document_id_content_hash_key"
  ON "authoring_revision"("document_id", "content_hash");
CREATE INDEX "authoring_revision_organization_id_workspace_id_created_at_idx"
  ON "authoring_revision"("organization_id", "workspace_id", "created_at");
CREATE INDEX "authoring_revision_workspace_id_mission_id_created_at_idx"
  ON "authoring_revision"("workspace_id", "mission_id", "created_at");

ALTER TABLE "authoring_document"
  ADD CONSTRAINT "authoring_document_organization_fkey"
    FOREIGN KEY ("organization_id") REFERENCES "organization"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "authoring_document_workspace_fkey"
    FOREIGN KEY ("organization_id", "workspace_id")
    REFERENCES "workspace"("organization_id", "id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "authoring_document_mission_fkey"
    FOREIGN KEY ("workspace_id", "mission_id")
    REFERENCES "mission"("workspace_id", "id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "authoring_document_creator_fkey"
    FOREIGN KEY ("created_by_membership_id") REFERENCES "membership"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "authoring_revision"
  ADD CONSTRAINT "authoring_revision_organization_fkey"
    FOREIGN KEY ("organization_id") REFERENCES "organization"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "authoring_revision_workspace_fkey"
    FOREIGN KEY ("organization_id", "workspace_id")
    REFERENCES "workspace"("organization_id", "id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "authoring_revision_mission_fkey"
    FOREIGN KEY ("workspace_id", "mission_id")
    REFERENCES "mission"("workspace_id", "id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "authoring_revision_document_fkey"
    FOREIGN KEY ("workspace_id", "document_id")
    REFERENCES "authoring_document"("workspace_id", "id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "authoring_revision_creator_fkey"
    FOREIGN KEY ("created_by_membership_id") REFERENCES "membership"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE OR REPLACE FUNCTION hiveos_reject_authoring_revision_mutation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'authoring revision is append-only';
END
$$;
REVOKE ALL ON FUNCTION hiveos_reject_authoring_revision_mutation() FROM PUBLIC;

CREATE TRIGGER authoring_revision_append_only
  BEFORE UPDATE OR DELETE ON "authoring_revision"
  FOR EACH ROW EXECUTE FUNCTION hiveos_reject_authoring_revision_mutation();

ALTER TABLE "authoring_document" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "authoring_document" FORCE ROW LEVEL SECURITY;
CREATE POLICY "authoring_document_tenant_isolation"
  ON "authoring_document"
  USING (organization_id = hiveos_rls_organization_id())
  WITH CHECK (organization_id = hiveos_rls_organization_id());

ALTER TABLE "authoring_revision" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "authoring_revision" FORCE ROW LEVEL SECURITY;
CREATE POLICY "authoring_revision_tenant_isolation"
  ON "authoring_revision"
  USING (organization_id = hiveos_rls_organization_id())
  WITH CHECK (organization_id = hiveos_rls_organization_id());

CREATE TRIGGER authoring_document_source_revision
  AFTER INSERT OR UPDATE OR DELETE ON "authoring_document"
  FOR EACH ROW EXECUTE FUNCTION hiveos_bump_mission_source_revision('direct');

CREATE TRIGGER authoring_revision_source_revision
  AFTER INSERT OR UPDATE OR DELETE ON "authoring_revision"
  FOR EACH ROW EXECUTE FUNCTION hiveos_bump_mission_source_revision('direct');
