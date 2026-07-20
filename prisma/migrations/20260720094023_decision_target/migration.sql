-- AlterTable
ALTER TABLE "decision" ADD COLUMN     "proposed_profile" "AssuranceProfile",
ADD COLUMN     "target_id" TEXT,
ADD COLUMN     "target_kind" TEXT;
