CREATE TYPE "ProviderPolicyMode" AS ENUM ('OPEN_MANUAL', 'ALLOWLIST_MANUAL');
CREATE TYPE "WorkspaceStorageMode" AS ENUM ('DATABASE');
CREATE TYPE "PublicReleasePolicy" AS ENUM ('INTERNAL_ONLY', 'GOVERNED_PUBLIC');

CREATE TABLE "workspace_policy" (
    "workspace_id" TEXT NOT NULL,
    "default_assurance_profile" "AssuranceProfile" NOT NULL DEFAULT 'PROFESSIONAL',
    "provider_policy_mode" "ProviderPolicyMode" NOT NULL DEFAULT 'OPEN_MANUAL',
    "allowed_providers" JSONB NOT NULL DEFAULT '[]',
    "storage_mode" "WorkspaceStorageMode" NOT NULL DEFAULT 'DATABASE',
    "artifact_retention_days" INTEGER NOT NULL DEFAULT 2555,
    "evidence_retention_days" INTEGER NOT NULL DEFAULT 2555,
    "audit_retention_days" INTEGER NOT NULL DEFAULT 2555,
    "public_release_policy" "PublicReleasePolicy" NOT NULL DEFAULT 'GOVERNED_PUBLIC',
    "updated_by_membership_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "workspace_policy_pkey" PRIMARY KEY ("workspace_id")
);

ALTER TABLE "workspace_policy"
ADD CONSTRAINT "workspace_policy_workspace_id_fkey"
FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "workspace_policy" ("workspace_id")
SELECT "id" FROM "workspace"
ON CONFLICT ("workspace_id") DO NOTHING;

ALTER TABLE "workspace_policy"
ADD CONSTRAINT "workspace_policy_retention_bounds"
CHECK (
  "artifact_retention_days" BETWEEN 30 AND 36500
  AND "evidence_retention_days" BETWEEN 30 AND 36500
  AND "audit_retention_days" BETWEEN 365 AND 36500
);
