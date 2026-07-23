-- CreateEnum
CREATE TYPE "AccessLevel" AS ENUM ('PUBLIC', 'WORKSPACE', 'RESTRICTED');

-- CreateEnum
CREATE TYPE "ClaimState" AS ENUM ('DRAFT', 'HYPOTHESIS', 'SOURCED', 'CORROBORATED', 'DISPUTED', 'VALIDATED_BOUNDED', 'PROVED_INTERNAL', 'FALSIFIED', 'RETRACTED', 'HONEST_NULL');

-- CreateEnum
CREATE TYPE "EvidenceRelation" AS ENUM ('SUPPORTS', 'CONTRADICTS');

-- CreateEnum
CREATE TYPE "ProvenanceRelation" AS ENUM ('DERIVED_FROM', 'SUPPORTS', 'CONTRADICTS', 'SUPERSEDES');

-- CreateEnum
CREATE TYPE "SearchCompleteness" AS ENUM ('OPEN_INCOMPLETE', 'EMPTY_CERTIFIED');

-- CreateTable
CREATE TABLE "evidence_source" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "mission_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "canonical_uri" TEXT NOT NULL,
    "publisher" TEXT,
    "source_type" TEXT NOT NULL,
    "independence_key" TEXT NOT NULL,
    "qualifies_for_corroboration" BOOLEAN NOT NULL DEFAULT false,
    "access_level" "AccessLevel" NOT NULL DEFAULT 'WORKSPACE',
    "created_by_membership_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evidence_source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "snapshot" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "mission_id" TEXT NOT NULL,
    "evidence_source_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "content_hash" TEXT NOT NULL,
    "media_type" TEXT NOT NULL DEFAULT 'text/plain',
    "storage_reference" TEXT,
    "captured_at" TIMESTAMP(3) NOT NULL,
    "created_by_membership_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidence_span" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "mission_id" TEXT NOT NULL,
    "snapshot_id" TEXT NOT NULL,
    "start_offset" INTEGER NOT NULL,
    "end_offset" INTEGER NOT NULL,
    "exact_text" TEXT NOT NULL,
    "extraction_label" TEXT,
    "created_by_membership_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evidence_span_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claim" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "mission_id" TEXT NOT NULL,
    "claim_key" TEXT NOT NULL,
    "state" "ClaimState" NOT NULL DEFAULT 'DRAFT',
    "access_level" "AccessLevel" NOT NULL DEFAULT 'WORKSPACE',
    "internal_owner_membership_id" TEXT,
    "review_cadence_days" INTEGER,
    "next_review_at" TIMESTAMP(3),
    "reviewed_at" TIMESTAMP(3),
    "created_by_membership_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "claim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claim_version" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "mission_id" TEXT NOT NULL,
    "claim_id" TEXT NOT NULL,
    "version_number" INTEGER NOT NULL,
    "statement" TEXT NOT NULL,
    "normalized_value" TEXT,
    "falsification_criterion" TEXT,
    "access_level" "AccessLevel" NOT NULL DEFAULT 'WORKSPACE',
    "created_by_membership_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "claim_version_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claim_evidence" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "claim_version_id" TEXT NOT NULL,
    "evidence_span_id" TEXT NOT NULL,
    "relation" "EvidenceRelation" NOT NULL DEFAULT 'SUPPORTS',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "claim_evidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dispute" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "mission_id" TEXT NOT NULL,
    "claim_id" TEXT NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "created_by_membership_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dispute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "honest_null_record" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "mission_id" TEXT NOT NULL,
    "claim_id" TEXT NOT NULL,
    "rationale" TEXT NOT NULL,
    "search_completeness" "SearchCompleteness" NOT NULL,
    "certificate_reference" TEXT,
    "asserted_by_membership_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "honest_null_record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "provenance_edge" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "mission_id" TEXT NOT NULL,
    "from_kind" TEXT NOT NULL,
    "from_id" TEXT NOT NULL,
    "to_kind" TEXT NOT NULL,
    "to_id" TEXT NOT NULL,
    "relation" "ProvenanceRelation" NOT NULL,
    "created_by_membership_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "provenance_edge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "evidence_source_workspace_id_mission_id_idx" ON "evidence_source"("workspace_id", "mission_id");

-- CreateIndex
CREATE UNIQUE INDEX "evidence_source_workspace_id_canonical_uri_key" ON "evidence_source"("workspace_id", "canonical_uri");

-- CreateIndex
CREATE INDEX "snapshot_workspace_id_mission_id_idx" ON "snapshot"("workspace_id", "mission_id");

-- CreateIndex
CREATE UNIQUE INDEX "snapshot_evidence_source_id_content_hash_key" ON "snapshot"("evidence_source_id", "content_hash");

-- CreateIndex
CREATE INDEX "evidence_span_workspace_id_mission_id_idx" ON "evidence_span"("workspace_id", "mission_id");

-- CreateIndex
CREATE UNIQUE INDEX "evidence_span_snapshot_id_start_offset_end_offset_key" ON "evidence_span"("snapshot_id", "start_offset", "end_offset");

-- CreateIndex
CREATE INDEX "claim_workspace_id_state_idx" ON "claim"("workspace_id", "state");

-- CreateIndex
CREATE UNIQUE INDEX "claim_mission_id_claim_key_key" ON "claim"("mission_id", "claim_key");

-- CreateIndex
CREATE INDEX "claim_version_workspace_id_mission_id_idx" ON "claim_version"("workspace_id", "mission_id");

-- CreateIndex
CREATE UNIQUE INDEX "claim_version_claim_id_version_number_key" ON "claim_version"("claim_id", "version_number");

-- CreateIndex
CREATE INDEX "claim_evidence_workspace_id_idx" ON "claim_evidence"("workspace_id");

-- CreateIndex
CREATE UNIQUE INDEX "claim_evidence_claim_version_id_evidence_span_id_relation_key" ON "claim_evidence"("claim_version_id", "evidence_span_id", "relation");

-- CreateIndex
CREATE INDEX "dispute_workspace_id_mission_id_idx" ON "dispute"("workspace_id", "mission_id");

-- CreateIndex
CREATE UNIQUE INDEX "dispute_claim_id_fingerprint_key" ON "dispute"("claim_id", "fingerprint");

-- CreateIndex
CREATE INDEX "honest_null_record_workspace_id_mission_id_idx" ON "honest_null_record"("workspace_id", "mission_id");

-- CreateIndex
CREATE INDEX "provenance_edge_workspace_id_mission_id_idx" ON "provenance_edge"("workspace_id", "mission_id");

-- CreateIndex
CREATE UNIQUE INDEX "provenance_edge_from_kind_from_id_to_kind_to_id_relation_key" ON "provenance_edge"("from_kind", "from_id", "to_kind", "to_id", "relation");

-- AddForeignKey
ALTER TABLE "evidence_source" ADD CONSTRAINT "evidence_source_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidence_source" ADD CONSTRAINT "evidence_source_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "snapshot" ADD CONSTRAINT "snapshot_evidence_source_id_fkey" FOREIGN KEY ("evidence_source_id") REFERENCES "evidence_source"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidence_span" ADD CONSTRAINT "evidence_span_snapshot_id_fkey" FOREIGN KEY ("snapshot_id") REFERENCES "snapshot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim" ADD CONSTRAINT "claim_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim" ADD CONSTRAINT "claim_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_version" ADD CONSTRAINT "claim_version_claim_id_fkey" FOREIGN KEY ("claim_id") REFERENCES "claim"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_evidence" ADD CONSTRAINT "claim_evidence_claim_version_id_fkey" FOREIGN KEY ("claim_version_id") REFERENCES "claim_version"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_evidence" ADD CONSTRAINT "claim_evidence_evidence_span_id_fkey" FOREIGN KEY ("evidence_span_id") REFERENCES "evidence_span"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispute" ADD CONSTRAINT "dispute_claim_id_fkey" FOREIGN KEY ("claim_id") REFERENCES "claim"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "honest_null_record" ADD CONSTRAINT "honest_null_record_claim_id_fkey" FOREIGN KEY ("claim_id") REFERENCES "claim"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Exact spans are always non-empty and bounded; content equality is enforced
-- by the service because CHECK constraints cannot safely query Snapshot.
ALTER TABLE "evidence_span"
  ADD CONSTRAINT "evidence_span_offsets_valid"
  CHECK ("start_offset" >= 0 AND "end_offset" > "start_offset");

ALTER TABLE "claim"
  ADD CONSTRAINT "claim_review_cadence_positive"
  CHECK ("review_cadence_days" IS NULL OR "review_cadence_days" > 0);

-- Immutable truth ledgers: historical evidence, assertions, disputes,
-- honest-null declarations and provenance may never be rewritten or erased.
CREATE OR REPLACE FUNCTION hiveos_truth_ledger_append_only()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION '% is append-only: % is not permitted', TG_TABLE_NAME, TG_OP
    USING ERRCODE = 'restrict_violation';
END;
$$;

CREATE TRIGGER snapshot_no_update_delete
  BEFORE UPDATE OR DELETE ON "snapshot"
  FOR EACH ROW EXECUTE FUNCTION hiveos_truth_ledger_append_only();
CREATE TRIGGER evidence_span_no_update_delete
  BEFORE UPDATE OR DELETE ON "evidence_span"
  FOR EACH ROW EXECUTE FUNCTION hiveos_truth_ledger_append_only();
CREATE TRIGGER claim_version_no_update_delete
  BEFORE UPDATE OR DELETE ON "claim_version"
  FOR EACH ROW EXECUTE FUNCTION hiveos_truth_ledger_append_only();
CREATE TRIGGER claim_evidence_no_update_delete
  BEFORE UPDATE OR DELETE ON "claim_evidence"
  FOR EACH ROW EXECUTE FUNCTION hiveos_truth_ledger_append_only();
CREATE TRIGGER dispute_no_update_delete
  BEFORE UPDATE OR DELETE ON "dispute"
  FOR EACH ROW EXECUTE FUNCTION hiveos_truth_ledger_append_only();
CREATE TRIGGER honest_null_no_update_delete
  BEFORE UPDATE OR DELETE ON "honest_null_record"
  FOR EACH ROW EXECUTE FUNCTION hiveos_truth_ledger_append_only();
CREATE TRIGGER provenance_edge_no_update_delete
  BEFORE UPDATE OR DELETE ON "provenance_edge"
  FOR EACH ROW EXECUTE FUNCTION hiveos_truth_ledger_append_only();
