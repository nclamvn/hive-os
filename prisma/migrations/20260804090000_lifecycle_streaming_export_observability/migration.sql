-- TIP-023G: governed lifecycle, resumable dossier export and tenant-safe
-- operational evidence.

CREATE TYPE "LegalHoldStatus" AS ENUM ('ACTIVE', 'RELEASED');
CREATE TYPE "LegalHoldScope" AS ENUM ('WORKSPACE', 'MISSION');
CREATE TYPE "LifecycleDispositionStatus" AS ENUM (
  'CANDIDATE', 'BLOCKED', 'APPROVED', 'EXECUTED', 'CANCELLED'
);
CREATE TYPE "DossierExportStatus" AS ENUM (
  'READY', 'RUNNING', 'SUCCEEDED', 'FAILED'
);

CREATE TABLE "legal_hold" (
  "id" TEXT NOT NULL,
  "organization_id" TEXT NOT NULL,
  "workspace_id" TEXT NOT NULL,
  "mission_id" TEXT,
  "scope" "LegalHoldScope" NOT NULL,
  "reason" TEXT NOT NULL,
  "status" "LegalHoldStatus" NOT NULL DEFAULT 'ACTIVE',
  "placed_by_organization_membership_id" TEXT NOT NULL,
  "released_by_organization_membership_id" TEXT,
  "placed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "released_at" TIMESTAMP(3),
  "release_reason" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT "legal_hold_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "legal_hold_scope_shape" CHECK (
    ("scope" = 'WORKSPACE' AND "mission_id" IS NULL)
    OR ("scope" = 'MISSION' AND "mission_id" IS NOT NULL)
  ),
  CONSTRAINT "legal_hold_reason_shape" CHECK (
    length(btrim("reason")) BETWEEN 1 AND 1000
    AND ("release_reason" IS NULL OR length(btrim("release_reason")) BETWEEN 1 AND 1000)
  ),
  CONSTRAINT "legal_hold_release_shape" CHECK (
    ("status" = 'ACTIVE' AND "released_at" IS NULL
      AND "released_by_organization_membership_id" IS NULL
      AND "release_reason" IS NULL)
    OR ("status" = 'RELEASED' AND "released_at" IS NOT NULL
      AND "released_by_organization_membership_id" IS NOT NULL
      AND "release_reason" IS NOT NULL)
  )
);

CREATE TABLE "lifecycle_disposition" (
  "id" TEXT NOT NULL,
  "organization_id" TEXT NOT NULL,
  "workspace_id" TEXT NOT NULL,
  "mission_id" TEXT NOT NULL,
  "snapshot_id" TEXT NOT NULL,
  "storage_reference" TEXT NOT NULL,
  "content_hash" TEXT NOT NULL,
  "policy_version" INTEGER NOT NULL,
  "eligible_at" TIMESTAMP(3) NOT NULL,
  "status" "LifecycleDispositionStatus" NOT NULL DEFAULT 'CANDIDATE',
  "blocked_reason" TEXT,
  "requested_by_organization_membership_id" TEXT NOT NULL,
  "approved_by_organization_membership_id" TEXT,
  "executed_by_organization_membership_id" TEXT,
  "request_reason" TEXT NOT NULL,
  "approval_reason" TEXT,
  "execution_reason" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "approved_at" TIMESTAMP(3),
  "executed_at" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT "lifecycle_disposition_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "lifecycle_disposition_shape" CHECK (
    length("content_hash") = 64
    AND length(btrim("storage_reference")) BETWEEN 1 AND 1000
    AND length(btrim("request_reason")) BETWEEN 1 AND 1000
    AND "policy_version" > 0
  ),
  CONSTRAINT "lifecycle_disposition_state_shape" CHECK (
    ("status" IN ('CANDIDATE', 'BLOCKED', 'CANCELLED')
      AND "executed_at" IS NULL)
    OR ("status" = 'APPROVED' AND "approved_at" IS NOT NULL
      AND "approved_by_organization_membership_id" IS NOT NULL
      AND "executed_at" IS NULL)
    OR ("status" = 'EXECUTED' AND "approved_at" IS NOT NULL
      AND "approved_by_organization_membership_id" IS NOT NULL
      AND "executed_at" IS NOT NULL
      AND "executed_by_organization_membership_id" IS NOT NULL)
  )
);

CREATE TABLE "dossier_export" (
  "id" TEXT NOT NULL,
  "organization_id" TEXT NOT NULL,
  "workspace_id" TEXT NOT NULL,
  "mission_id" TEXT NOT NULL,
  "requested_by_organization_membership_id" TEXT NOT NULL,
  "command_id" TEXT NOT NULL,
  "job_id" TEXT,
  "status" "DossierExportStatus" NOT NULL DEFAULT 'READY',
  "snapshot_at" TIMESTAMP(3) NOT NULL,
  "mission_version" INTEGER NOT NULL,
  "next_section" INTEGER NOT NULL DEFAULT 0,
  "next_cursor" TEXT,
  "part_count" INTEGER NOT NULL DEFAULT 0,
  "row_count" INTEGER NOT NULL DEFAULT 0,
  "total_bytes" BIGINT NOT NULL DEFAULT 0,
  "manifest_storage_key" TEXT,
  "manifest_hash" TEXT,
  "failure_code" TEXT,
  "failure_message" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "started_at" TIMESTAMP(3),
  "completed_at" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT "dossier_export_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "dossier_export_bounds" CHECK (
    "mission_version" > 0 AND "next_section" >= 0
    AND "part_count" >= 0 AND "row_count" >= 0 AND "total_bytes" >= 0
  ),
  CONSTRAINT "dossier_export_terminal_shape" CHECK (
    ("status" IN ('READY', 'RUNNING') AND "manifest_storage_key" IS NULL
      AND "manifest_hash" IS NULL AND "completed_at" IS NULL)
    OR ("status" = 'SUCCEEDED' AND "manifest_storage_key" IS NOT NULL
      AND "manifest_hash" IS NOT NULL AND "completed_at" IS NOT NULL)
    OR ("status" = 'FAILED' AND "manifest_storage_key" IS NULL
      AND "manifest_hash" IS NULL AND "failure_code" IS NOT NULL)
  )
);

CREATE TABLE "dossier_export_part" (
  "id" TEXT NOT NULL,
  "organization_id" TEXT NOT NULL,
  "workspace_id" TEXT NOT NULL,
  "export_id" TEXT NOT NULL,
  "sequence" INTEGER NOT NULL,
  "section" TEXT NOT NULL,
  "first_row_id" TEXT,
  "last_row_id" TEXT,
  "row_count" INTEGER NOT NULL,
  "storage_key" TEXT NOT NULL,
  "content_hash" TEXT NOT NULL,
  "size_bytes" INTEGER NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "dossier_export_part_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "dossier_export_part_bounds" CHECK (
    "sequence" >= 0 AND "row_count" BETWEEN 0 AND 500
    AND "size_bytes" BETWEEN 1 AND 10485760
    AND length("content_hash") = 64
    AND length(btrim("section")) BETWEEN 1 AND 120
    AND length(btrim("storage_key")) BETWEEN 1 AND 1000
  )
);

CREATE UNIQUE INDEX "legal_hold_organization_id_id_key"
  ON "legal_hold"("organization_id", "id");
CREATE INDEX "legal_hold_workspace_status_idx"
  ON "legal_hold"("organization_id", "workspace_id", "status", "placed_at", "id");
CREATE INDEX "legal_hold_mission_status_idx"
  ON "legal_hold"("organization_id", "mission_id", "status");
CREATE UNIQUE INDEX "lifecycle_disposition_organization_id_id_key"
  ON "lifecycle_disposition"("organization_id", "id");
CREATE UNIQUE INDEX "lifecycle_disposition_snapshot_id_key"
  ON "lifecycle_disposition"("snapshot_id");
CREATE INDEX "lifecycle_disposition_workspace_status_idx"
  ON "lifecycle_disposition"("organization_id", "workspace_id", "status", "eligible_at", "id");
CREATE INDEX "lifecycle_disposition_mission_status_idx"
  ON "lifecycle_disposition"("organization_id", "mission_id", "status");
CREATE UNIQUE INDEX "dossier_export_organization_id_id_key"
  ON "dossier_export"("organization_id", "id");
CREATE UNIQUE INDEX "dossier_export_command_id_key" ON "dossier_export"("command_id");
CREATE UNIQUE INDEX "dossier_export_job_id_key" ON "dossier_export"("job_id");
CREATE INDEX "dossier_export_workspace_status_idx"
  ON "dossier_export"("organization_id", "workspace_id", "status", "created_at", "id");
CREATE INDEX "dossier_export_mission_idx"
  ON "dossier_export"("organization_id", "mission_id", "created_at", "id");
CREATE UNIQUE INDEX "dossier_export_part_export_sequence_key"
  ON "dossier_export_part"("export_id", "sequence");
CREATE UNIQUE INDEX "dossier_export_part_storage_key"
  ON "dossier_export_part"("organization_id", "storage_key");
CREATE UNIQUE INDEX "dossier_export_part_organization_id_id_key"
  ON "dossier_export_part"("organization_id", "id");
CREATE INDEX "dossier_export_part_sequence_idx"
  ON "dossier_export_part"("organization_id", "export_id", "sequence");
CREATE INDEX "audit_event_workspace_entity_created_idx"
  ON "audit_event"("workspace_id", "entity_id", "created_at", "id");

ALTER TABLE "legal_hold"
  ADD CONSTRAINT "legal_hold_organization_fkey" FOREIGN KEY ("organization_id")
    REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "legal_hold_workspace_fkey" FOREIGN KEY ("organization_id", "workspace_id")
    REFERENCES "workspace"("organization_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "legal_hold_mission_fkey" FOREIGN KEY ("workspace_id", "mission_id")
    REFERENCES "mission"("workspace_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "legal_hold_placer_fkey" FOREIGN KEY ("organization_id", "placed_by_organization_membership_id")
    REFERENCES "organization_membership"("organization_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "legal_hold_releaser_fkey" FOREIGN KEY ("organization_id", "released_by_organization_membership_id")
    REFERENCES "organization_membership"("organization_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "lifecycle_disposition"
  ADD CONSTRAINT "lifecycle_disposition_organization_fkey" FOREIGN KEY ("organization_id")
    REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "lifecycle_disposition_workspace_fkey" FOREIGN KEY ("organization_id", "workspace_id")
    REFERENCES "workspace"("organization_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "lifecycle_disposition_mission_fkey" FOREIGN KEY ("workspace_id", "mission_id")
    REFERENCES "mission"("workspace_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "lifecycle_disposition_snapshot_fkey" FOREIGN KEY ("snapshot_id")
    REFERENCES "snapshot"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "lifecycle_disposition_requester_fkey" FOREIGN KEY ("organization_id", "requested_by_organization_membership_id")
    REFERENCES "organization_membership"("organization_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "lifecycle_disposition_approver_fkey" FOREIGN KEY ("organization_id", "approved_by_organization_membership_id")
    REFERENCES "organization_membership"("organization_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "lifecycle_disposition_executor_fkey" FOREIGN KEY ("organization_id", "executed_by_organization_membership_id")
    REFERENCES "organization_membership"("organization_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "dossier_export"
  ADD CONSTRAINT "dossier_export_organization_fkey" FOREIGN KEY ("organization_id")
    REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "dossier_export_workspace_fkey" FOREIGN KEY ("organization_id", "workspace_id")
    REFERENCES "workspace"("organization_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "dossier_export_mission_fkey" FOREIGN KEY ("workspace_id", "mission_id")
    REFERENCES "mission"("workspace_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "dossier_export_requester_fkey" FOREIGN KEY ("organization_id", "requested_by_organization_membership_id")
    REFERENCES "organization_membership"("organization_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "dossier_export_part"
  ADD CONSTRAINT "dossier_export_part_organization_fkey" FOREIGN KEY ("organization_id")
    REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "dossier_export_part_workspace_fkey" FOREIGN KEY ("organization_id", "workspace_id")
    REFERENCES "workspace"("organization_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "dossier_export_part_export_fkey" FOREIGN KEY ("organization_id", "export_id")
    REFERENCES "dossier_export"("organization_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE OR REPLACE FUNCTION hiveos_governed_root_delete_guard()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'governed root deletion requires lifecycle disposition'
    USING ERRCODE = 'integrity_constraint_violation';
END
$$;
CREATE TRIGGER organization_governed_delete_guard BEFORE DELETE ON "organization"
  FOR EACH ROW EXECUTE FUNCTION hiveos_governed_root_delete_guard();
CREATE TRIGGER workspace_governed_delete_guard BEFORE DELETE ON "workspace"
  FOR EACH ROW EXECUTE FUNCTION hiveos_governed_root_delete_guard();
CREATE TRIGGER mission_governed_delete_guard BEFORE DELETE ON "mission"
  FOR EACH ROW EXECUTE FUNCTION hiveos_governed_root_delete_guard();

CREATE OR REPLACE FUNCTION hiveos_lifecycle_terminal_guard()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.status IN ('EXECUTED', 'CANCELLED') THEN
    RAISE EXCEPTION 'terminal lifecycle disposition is immutable';
  END IF;
  IF NEW.id <> OLD.id OR NEW.organization_id <> OLD.organization_id
    OR NEW.workspace_id <> OLD.workspace_id OR NEW.mission_id <> OLD.mission_id
    OR NEW.snapshot_id <> OLD.snapshot_id OR NEW.storage_reference <> OLD.storage_reference
    OR NEW.content_hash <> OLD.content_hash OR NEW.policy_version <> OLD.policy_version
    OR NEW.eligible_at <> OLD.eligible_at OR NEW.request_reason <> OLD.request_reason
  THEN
    RAISE EXCEPTION 'lifecycle disposition identity is immutable';
  END IF;
  RETURN NEW;
END
$$;
CREATE TRIGGER lifecycle_disposition_terminal_guard
  BEFORE UPDATE ON "lifecycle_disposition"
  FOR EACH ROW EXECUTE FUNCTION hiveos_lifecycle_terminal_guard();


DO $$
DECLARE v_table TEXT;
BEGIN
  FOREACH v_table IN ARRAY ARRAY[
    'legal_hold', 'lifecycle_disposition', 'dossier_export', 'dossier_export_part'
  ] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', v_table);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', v_table);
    EXECUTE format(
      'CREATE POLICY %I ON %I USING (organization_id = hiveos_rls_organization_id()) WITH CHECK (organization_id = hiveos_rls_organization_id())',
      v_table || '_tenant_isolation', v_table
    );
  END LOOP;
END
$$;
