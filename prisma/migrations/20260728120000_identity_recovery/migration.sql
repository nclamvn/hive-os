-- TIP-021A — Identity recovery security.
-- Append-only identity security ledger + concurrency-safe throttle counters.

-- CreateEnum
CREATE TYPE "IdentitySecurityEventType" AS ENUM ('EMAIL_VERIFICATION_REQUESTED', 'EMAIL_VERIFICATION_COMPLETED', 'EMAIL_VERIFICATION_REJECTED', 'PASSWORD_RESET_REQUESTED', 'PASSWORD_RESET_COMPLETED', 'PASSWORD_RESET_REJECTED', 'PASSWORD_CHANGED', 'SESSIONS_REVOKED', 'MAIL_DELIVERY_FAILED');

-- CreateEnum
CREATE TYPE "IdentitySecurityOutcome" AS ENUM ('SUCCESS', 'FAILURE', 'PENDING');

-- CreateTable
CREATE TABLE "identity_security_event" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "event_type" "IdentitySecurityEventType" NOT NULL,
    "outcome" "IdentitySecurityOutcome" NOT NULL,
    "correlation_id" TEXT NOT NULL,
    "ip_digest" TEXT,
    "user_agent_digest" TEXT,
    "payload" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "identity_security_event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_throttle_counter" (
    "id" TEXT NOT NULL,
    "digest" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "window_key" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auth_throttle_counter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "identity_security_event_user_id_idx" ON "identity_security_event"("user_id");

-- CreateIndex
CREATE INDEX "identity_security_event_event_type_idx" ON "identity_security_event"("event_type");

-- CreateIndex
CREATE INDEX "identity_security_event_correlation_id_idx" ON "identity_security_event"("correlation_id");

-- CreateIndex
CREATE INDEX "auth_throttle_counter_expires_at_idx" ON "auth_throttle_counter"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "auth_throttle_counter_digest_purpose_window_key_key" ON "auth_throttle_counter"("digest", "purpose", "window_key");

-- Enforce append-only semantics for identity_security_event at the database
-- level. Any UPDATE or DELETE is rejected regardless of role; INSERT remains.
CREATE OR REPLACE FUNCTION hiveos_identity_security_event_append_only()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'identity_security_event is append-only: % is not permitted', TG_OP
    USING ERRCODE = 'restrict_violation';
END;
$$;

CREATE TRIGGER identity_security_event_no_update
  BEFORE UPDATE ON "identity_security_event"
  FOR EACH ROW
  EXECUTE FUNCTION hiveos_identity_security_event_append_only();

CREATE TRIGGER identity_security_event_no_delete
  BEFORE DELETE ON "identity_security_event"
  FOR EACH ROW
  EXECUTE FUNCTION hiveos_identity_security_event_append_only();
