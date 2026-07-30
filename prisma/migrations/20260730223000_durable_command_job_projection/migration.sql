-- TIP-023E: PostgreSQL-first command, outbox, durable job and incremental
-- operational projection plane.

CREATE TYPE "CommandStatus" AS ENUM ('PROCESSING', 'SUCCEEDED', 'FAILED');
CREATE TYPE "OutboxStatus" AS ENUM ('PENDING', 'DISPATCHED');
CREATE TYPE "DurableJobStatus" AS ENUM (
  'READY', 'RUNNING', 'SUCCEEDED', 'DEAD_LETTER', 'CANCELLED'
);
CREATE TYPE "JobEventType" AS ENUM (
  'CLAIMED', 'SUCCEEDED', 'RETRY_SCHEDULED',
  'DEAD_LETTERED', 'REQUEUED', 'CANCELLED'
);
CREATE TYPE "ProjectionStatus" AS ENUM ('READY', 'REBUILDING', 'FAILED');

CREATE TABLE "command_record" (
  "id" TEXT NOT NULL,
  "organization_id" TEXT NOT NULL,
  "workspace_id" TEXT,
  "idempotency_key" TEXT NOT NULL,
  "command_type" TEXT NOT NULL,
  "actor_user_id" TEXT NOT NULL,
  "actor_organization_membership_id" TEXT NOT NULL,
  "correlation_id" TEXT NOT NULL,
  "expected_version" INTEGER,
  "issued_at" TIMESTAMP(3) NOT NULL,
  "payload" JSONB NOT NULL,
  "payload_hash" TEXT NOT NULL,
  "status" "CommandStatus" NOT NULL DEFAULT 'PROCESSING',
  "outcome" JSONB,
  "error_code" TEXT,
  "error_message" TEXT,
  "completed_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "command_record_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "command_record_identity_shape" CHECK (
    length(btrim("idempotency_key")) BETWEEN 1 AND 200
    AND length(btrim("command_type")) BETWEEN 1 AND 120
    AND length("payload_hash") = 64
    AND length(btrim("correlation_id")) BETWEEN 1 AND 200
    AND octet_length("payload"::text) <= 65536
  ),
  CONSTRAINT "command_record_outcome_shape" CHECK (
    (
      "status" = 'PROCESSING'
      AND "completed_at" IS NULL
      AND "outcome" IS NULL
      AND "error_code" IS NULL
      AND "error_message" IS NULL
    )
    OR (
      "status" = 'SUCCEEDED'
      AND "completed_at" IS NOT NULL
      AND "outcome" IS NOT NULL
      AND "error_code" IS NULL
      AND "error_message" IS NULL
      AND octet_length("outcome"::text) <= 65536
    )
    OR (
      "status" = 'FAILED'
      AND "completed_at" IS NOT NULL
      AND "outcome" IS NULL
      AND "error_code" IS NOT NULL
      AND "error_message" IS NOT NULL
      AND length("error_code") BETWEEN 1 AND 100
      AND length("error_message") BETWEEN 1 AND 1000
    )
  )
);

CREATE TABLE "outbox_event" (
  "id" TEXT NOT NULL,
  "organization_id" TEXT NOT NULL,
  "workspace_id" TEXT,
  "command_id" TEXT NOT NULL,
  "topic" TEXT NOT NULL,
  "aggregate_type" TEXT NOT NULL,
  "aggregate_id" TEXT NOT NULL,
  "payload" JSONB NOT NULL,
  "status" "OutboxStatus" NOT NULL DEFAULT 'PENDING',
  "available_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "dispatched_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "version" INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT "outbox_event_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "outbox_event_shape" CHECK (
    length(btrim("topic")) BETWEEN 1 AND 120
    AND length(btrim("aggregate_type")) BETWEEN 1 AND 120
    AND length(btrim("aggregate_id")) BETWEEN 1 AND 200
    AND octet_length("payload"::text) <= 65536
    AND (
      ("status" = 'PENDING' AND "dispatched_at" IS NULL)
      OR ("status" = 'DISPATCHED' AND "dispatched_at" IS NOT NULL)
    )
  )
);

CREATE TABLE "durable_job" (
  "id" TEXT NOT NULL,
  "organization_id" TEXT NOT NULL,
  "workspace_id" TEXT,
  "outbox_event_id" TEXT,
  "job_type" TEXT NOT NULL,
  "payload" JSONB NOT NULL,
  "status" "DurableJobStatus" NOT NULL DEFAULT 'READY',
  "priority" INTEGER NOT NULL DEFAULT 100,
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "max_attempts" INTEGER NOT NULL DEFAULT 5,
  "available_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "locked_by" TEXT,
  "lease_expires_at" TIMESTAMP(3),
  "last_error_code" TEXT,
  "last_error_message" TEXT,
  "result" JSONB,
  "completed_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  "version" INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT "durable_job_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "durable_job_bounds" CHECK (
    length(btrim("job_type")) BETWEEN 1 AND 120
    AND octet_length("payload"::text) <= 65536
    AND "priority" BETWEEN 0 AND 1000
    AND "attempts" BETWEEN 0 AND 100
    AND "max_attempts" BETWEEN 1 AND 20
    AND "attempts" <= "max_attempts"
    AND ("result" IS NULL OR octet_length("result"::text) <= 65536)
  ),
  CONSTRAINT "durable_job_lease_shape" CHECK (
    (
      "status" = 'RUNNING'
      AND "locked_by" IS NOT NULL
      AND "lease_expires_at" IS NOT NULL
      AND "completed_at" IS NULL
    )
    OR (
      "status" IN ('READY', 'DEAD_LETTER')
      AND "locked_by" IS NULL
      AND "lease_expires_at" IS NULL
      AND "completed_at" IS NULL
    )
    OR (
      "status" IN ('SUCCEEDED', 'CANCELLED')
      AND "locked_by" IS NULL
      AND "lease_expires_at" IS NULL
      AND "completed_at" IS NOT NULL
    )
  )
);

CREATE TABLE "durable_job_event" (
  "id" TEXT NOT NULL,
  "organization_id" TEXT NOT NULL,
  "workspace_id" TEXT,
  "job_id" TEXT NOT NULL,
  "event_type" "JobEventType" NOT NULL,
  "attempt_number" INTEGER NOT NULL,
  "worker_id" TEXT,
  "actor_organization_membership_id" TEXT,
  "reason" TEXT,
  "detail" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "durable_job_event_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "durable_job_event_shape" CHECK (
    "attempt_number" BETWEEN 0 AND 100
    AND ("reason" IS NULL OR length(btrim("reason")) BETWEEN 1 AND 1000)
    AND ("detail" IS NULL OR octet_length("detail"::text) <= 16384)
  )
);

CREATE TABLE "workspace_operational_projection" (
  "organization_id" TEXT NOT NULL,
  "workspace_id" TEXT NOT NULL,
  "portfolio_id" TEXT,
  "counts" JSONB NOT NULL DEFAULT '{}',
  "status" "ProjectionStatus" NOT NULL DEFAULT 'READY',
  "source_watermark_at" TIMESTAMP(3),
  "refreshed_at" TIMESTAMP(3),
  "last_job_id" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT "workspace_operational_projection_pkey"
    PRIMARY KEY ("organization_id", "workspace_id"),
  CONSTRAINT "workspace_operational_projection_counts"
    CHECK (jsonb_typeof("counts") = 'object')
);

CREATE TABLE "portfolio_operational_projection" (
  "organization_id" TEXT NOT NULL,
  "portfolio_id" TEXT NOT NULL,
  "counts" JSONB NOT NULL DEFAULT '{}',
  "status" "ProjectionStatus" NOT NULL DEFAULT 'READY',
  "source_watermark_at" TIMESTAMP(3),
  "refreshed_at" TIMESTAMP(3),
  "last_job_id" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT "portfolio_operational_projection_pkey"
    PRIMARY KEY ("organization_id", "portfolio_id"),
  CONSTRAINT "portfolio_operational_projection_counts"
    CHECK (jsonb_typeof("counts") = 'object')
);

CREATE UNIQUE INDEX "command_record_organization_id_id_key"
  ON "command_record"("organization_id", "id");
CREATE UNIQUE INDEX "command_record_idempotency_key"
  ON "command_record"("organization_id", "idempotency_key");
CREATE INDEX "command_record_created_idx"
  ON "command_record"("organization_id", "workspace_id", "created_at", "id");
CREATE INDEX "command_record_correlation_idx"
  ON "command_record"("organization_id", "correlation_id");

CREATE UNIQUE INDEX "outbox_event_organization_id_id_key"
  ON "outbox_event"("organization_id", "id");
CREATE INDEX "outbox_event_dispatch_idx"
  ON "outbox_event"("organization_id", "status", "available_at", "id");

CREATE UNIQUE INDEX "durable_job_organization_id_id_key"
  ON "durable_job"("organization_id", "id");
CREATE UNIQUE INDEX "durable_job_outbox_key"
  ON "durable_job"("organization_id", "outbox_event_id");
CREATE INDEX "durable_job_ready_idx"
  ON "durable_job"(
    "organization_id", "status", "available_at", "priority", "id"
  );
CREATE INDEX "durable_job_lease_idx"
  ON "durable_job"(
    "organization_id", "status", "lease_expires_at", "id"
  );

CREATE UNIQUE INDEX "durable_job_event_organization_id_id_key"
  ON "durable_job_event"("organization_id", "id");
CREATE INDEX "durable_job_event_job_idx"
  ON "durable_job_event"("organization_id", "job_id", "created_at", "id");
CREATE INDEX "workspace_operational_projection_portfolio_idx"
  ON "workspace_operational_projection"(
    "organization_id", "portfolio_id", "status"
  );
CREATE INDEX "portfolio_operational_projection_status_idx"
  ON "portfolio_operational_projection"(
    "organization_id", "status", "refreshed_at"
  );

ALTER TABLE "command_record"
  ADD CONSTRAINT "command_record_organization_fkey"
    FOREIGN KEY ("organization_id") REFERENCES "organization"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "command_record_workspace_fkey"
    FOREIGN KEY ("organization_id", "workspace_id")
    REFERENCES "workspace"("organization_id", "id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "command_record_actor_fkey"
    FOREIGN KEY (
      "organization_id", "actor_organization_membership_id"
    ) REFERENCES "organization_membership"("organization_id", "id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "outbox_event"
  ADD CONSTRAINT "outbox_event_organization_fkey"
    FOREIGN KEY ("organization_id") REFERENCES "organization"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "outbox_event_workspace_fkey"
    FOREIGN KEY ("organization_id", "workspace_id")
    REFERENCES "workspace"("organization_id", "id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "outbox_event_command_fkey"
    FOREIGN KEY ("organization_id", "command_id")
    REFERENCES "command_record"("organization_id", "id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "durable_job"
  ADD CONSTRAINT "durable_job_organization_fkey"
    FOREIGN KEY ("organization_id") REFERENCES "organization"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "durable_job_workspace_fkey"
    FOREIGN KEY ("organization_id", "workspace_id")
    REFERENCES "workspace"("organization_id", "id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "durable_job_outbox_fkey"
    FOREIGN KEY ("organization_id", "outbox_event_id")
    REFERENCES "outbox_event"("organization_id", "id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "durable_job_event"
  ADD CONSTRAINT "durable_job_event_organization_fkey"
    FOREIGN KEY ("organization_id") REFERENCES "organization"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "durable_job_event_workspace_fkey"
    FOREIGN KEY ("organization_id", "workspace_id")
    REFERENCES "workspace"("organization_id", "id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "durable_job_event_job_fkey"
    FOREIGN KEY ("organization_id", "job_id")
    REFERENCES "durable_job"("organization_id", "id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "durable_job_event_actor_fkey"
    FOREIGN KEY (
      "organization_id", "actor_organization_membership_id"
    ) REFERENCES "organization_membership"("organization_id", "id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "workspace_operational_projection"
  ADD CONSTRAINT "workspace_operational_projection_organization_fkey"
    FOREIGN KEY ("organization_id") REFERENCES "organization"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "workspace_operational_projection_workspace_fkey"
    FOREIGN KEY ("organization_id", "workspace_id")
    REFERENCES "workspace"("organization_id", "id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "workspace_operational_projection_portfolio_fkey"
    FOREIGN KEY ("organization_id", "portfolio_id")
    REFERENCES "portfolio"("organization_id", "id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "portfolio_operational_projection"
  ADD CONSTRAINT "portfolio_operational_projection_organization_fkey"
    FOREIGN KEY ("organization_id") REFERENCES "organization"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "portfolio_operational_projection_portfolio_fkey"
    FOREIGN KEY ("organization_id", "portfolio_id")
    REFERENCES "portfolio"("organization_id", "id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE OR REPLACE FUNCTION hiveos_command_terminal_immutable()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.status <> 'PROCESSING' THEN
    RAISE EXCEPTION 'terminal command outcome is immutable';
  END IF;
  IF NEW.id <> OLD.id
    OR NEW.organization_id <> OLD.organization_id
    OR NEW.idempotency_key <> OLD.idempotency_key
    OR NEW.command_type <> OLD.command_type
    OR NEW.actor_user_id <> OLD.actor_user_id
    OR NEW.actor_organization_membership_id <>
       OLD.actor_organization_membership_id
    OR NEW.correlation_id <> OLD.correlation_id
    OR NEW.issued_at <> OLD.issued_at
    OR NEW.payload <> OLD.payload
    OR NEW.payload_hash <> OLD.payload_hash
  THEN
    RAISE EXCEPTION 'command identity is immutable';
  END IF;
  IF NEW.status = 'PROCESSING' THEN
    RAISE EXCEPTION 'command must transition to a terminal outcome';
  END IF;
  RETURN NEW;
END
$$;

CREATE TRIGGER command_record_terminal_guard
  BEFORE UPDATE ON "command_record"
  FOR EACH ROW EXECUTE FUNCTION hiveos_command_terminal_immutable();

CREATE OR REPLACE FUNCTION hiveos_durable_ledger_append_only()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'durable lifecycle ledger is append-only';
END
$$;

CREATE TRIGGER durable_job_event_append_only
  BEFORE UPDATE OR DELETE ON "durable_job_event"
  FOR EACH ROW EXECUTE FUNCTION hiveos_durable_ledger_append_only();

CREATE OR REPLACE FUNCTION hiveos_outbox_identity_immutable()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.id <> OLD.id
    OR NEW.organization_id <> OLD.organization_id
    OR NEW.command_id <> OLD.command_id
    OR NEW.topic <> OLD.topic
    OR NEW.aggregate_type <> OLD.aggregate_type
    OR NEW.aggregate_id <> OLD.aggregate_id
    OR NEW.payload <> OLD.payload
    OR NEW.available_at <> OLD.available_at
    OR OLD.status = 'DISPATCHED'
  THEN
    RAISE EXCEPTION 'outbox event identity is immutable';
  END IF;
  RETURN NEW;
END
$$;

CREATE TRIGGER outbox_event_identity_guard
  BEFORE UPDATE ON "outbox_event"
  FOR EACH ROW EXECUTE FUNCTION hiveos_outbox_identity_immutable();

CREATE OR REPLACE FUNCTION hiveos_portfolio_projection_adjust(
  p_organization_id TEXT,
  p_portfolio_id TEXT,
  p_metric TEXT,
  p_delta INTEGER,
  p_watermark TIMESTAMP(3)
) RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
  IF p_portfolio_id IS NULL OR p_delta = 0 THEN
    RETURN;
  END IF;
  INSERT INTO portfolio_operational_projection (
    organization_id, portfolio_id, counts, status,
    source_watermark_at, refreshed_at, version
  ) VALUES (
    p_organization_id, p_portfolio_id,
    jsonb_build_object(p_metric, GREATEST(p_delta, 0)),
    'READY', p_watermark, clock_timestamp(), 1
  )
  ON CONFLICT (organization_id, portfolio_id) DO UPDATE SET
    counts = jsonb_set(
      portfolio_operational_projection.counts,
      ARRAY[p_metric],
      to_jsonb(GREATEST(
        COALESCE(
          (portfolio_operational_projection.counts ->> p_metric)::INTEGER,
          0
        ) + p_delta,
        0
      )),
      true
    ),
    status = 'READY',
    source_watermark_at = GREATEST(
      portfolio_operational_projection.source_watermark_at,
      p_watermark
    ),
    refreshed_at = clock_timestamp(),
    version = portfolio_operational_projection.version + 1;
END
$$;

CREATE OR REPLACE FUNCTION hiveos_workspace_projection_adjust(
  p_workspace_id TEXT,
  p_metric TEXT,
  p_delta INTEGER,
  p_watermark TIMESTAMP(3)
) RETURNS VOID LANGUAGE plpgsql AS $$
DECLARE
  v_organization_id TEXT;
  v_portfolio_id TEXT;
BEGIN
  IF p_workspace_id IS NULL OR p_delta = 0 THEN
    RETURN;
  END IF;
  SELECT organization_id, portfolio_id
    INTO v_organization_id, v_portfolio_id
  FROM workspace
  WHERE id = p_workspace_id;
  IF v_organization_id IS NULL THEN
    RETURN;
  END IF;
  INSERT INTO workspace_operational_projection (
    organization_id, workspace_id, portfolio_id, counts, status,
    source_watermark_at, refreshed_at, version
  ) VALUES (
    v_organization_id, p_workspace_id, v_portfolio_id,
    jsonb_build_object(p_metric, GREATEST(p_delta, 0)),
    'READY', p_watermark, clock_timestamp(), 1
  )
  ON CONFLICT (organization_id, workspace_id) DO UPDATE SET
    portfolio_id = EXCLUDED.portfolio_id,
    counts = jsonb_set(
      workspace_operational_projection.counts,
      ARRAY[p_metric],
      to_jsonb(GREATEST(
        COALESCE(
          (workspace_operational_projection.counts ->> p_metric)::INTEGER,
          0
        ) + p_delta,
        0
      )),
      true
    ),
    status = 'READY',
    source_watermark_at = GREATEST(
      workspace_operational_projection.source_watermark_at,
      p_watermark
    ),
    refreshed_at = clock_timestamp(),
    version = workspace_operational_projection.version + 1;
  PERFORM hiveos_portfolio_projection_adjust(
    v_organization_id, v_portfolio_id, p_metric, p_delta, p_watermark
  );
END
$$;

CREATE OR REPLACE FUNCTION hiveos_projection_apply_source_row(
  p_table TEXT,
  p_row JSONB,
  p_direction INTEGER,
  p_watermark TIMESTAMP(3)
) RETURNS VOID LANGUAGE plpgsql AS $$
DECLARE
  v_workspace_id TEXT := p_row ->> 'workspace_id';
  v_status TEXT := p_row ->> 'status';
BEGIN
  CASE p_table
    WHEN 'mission' THEN
      PERFORM hiveos_workspace_projection_adjust(
        v_workspace_id, 'missions', p_direction, p_watermark
      );
      IF v_status = 'APPROVED' THEN
        PERFORM hiveos_workspace_projection_adjust(
          v_workspace_id, 'approvedMissions', p_direction, p_watermark
        );
      END IF;
      IF v_status = 'EXPLORING' THEN
        PERFORM hiveos_workspace_projection_adjust(
          v_workspace_id, 'exploringMissions', p_direction, p_watermark
        );
      END IF;
    WHEN 'runtime_obligation' THEN
      PERFORM hiveos_workspace_projection_adjust(
        v_workspace_id, 'obligations', p_direction, p_watermark
      );
    WHEN 'decision' THEN
      IF v_status = 'REQUIRED' THEN
        PERFORM hiveos_workspace_projection_adjust(
          v_workspace_id, 'decisionsRequired', p_direction, p_watermark
        );
      END IF;
    WHEN 'evidence_source' THEN
      PERFORM hiveos_workspace_projection_adjust(
        v_workspace_id, 'evidenceSources', p_direction, p_watermark
      );
    WHEN 'snapshot' THEN
      PERFORM hiveos_workspace_projection_adjust(
        v_workspace_id, 'snapshots', p_direction, p_watermark
      );
    WHEN 'evidence_span' THEN
      PERFORM hiveos_workspace_projection_adjust(
        v_workspace_id, 'evidenceSpans', p_direction, p_watermark
      );
    WHEN 'claim' THEN
      PERFORM hiveos_workspace_projection_adjust(
        v_workspace_id, 'claims', p_direction, p_watermark
      );
    WHEN 'dispute' THEN
      PERFORM hiveos_workspace_projection_adjust(
        v_workspace_id, 'disputes', p_direction, p_watermark
      );
    WHEN 'honest_null_record' THEN
      PERFORM hiveos_workspace_projection_adjust(
        v_workspace_id, 'honestNulls', p_direction, p_watermark
      );
    WHEN 'provenance_edge' THEN
      PERFORM hiveos_workspace_projection_adjust(
        v_workspace_id, 'provenanceEdges', p_direction, p_watermark
      );
    WHEN 'skill' THEN
      PERFORM hiveos_workspace_projection_adjust(
        v_workspace_id, 'skills', p_direction, p_watermark
      );
      IF v_status = 'ACTIVE' THEN
        PERFORM hiveos_workspace_projection_adjust(
          v_workspace_id, 'activeSkills', p_direction, p_watermark
        );
      END IF;
    WHEN 'skill_version' THEN
      PERFORM hiveos_workspace_projection_adjust(
        v_workspace_id, 'skillVersions', p_direction, p_watermark
      );
    WHEN 'runtime_gate' THEN
      PERFORM hiveos_workspace_projection_adjust(
        v_workspace_id, 'runtimeGates', p_direction, p_watermark
      );
      IF v_status = 'PASSED' THEN
        PERFORM hiveos_workspace_projection_adjust(
          v_workspace_id, 'passedGates', p_direction, p_watermark
        );
      END IF;
    WHEN 'execution_tip' THEN
      PERFORM hiveos_workspace_projection_adjust(
        v_workspace_id, 'executionTips', p_direction, p_watermark
      );
      IF v_status IN (
        'IN_PROGRESS', 'BLOCKED', 'BLOCKED_DEVIATION', 'PARTIAL'
      ) THEN
        PERFORM hiveos_workspace_projection_adjust(
          v_workspace_id, 'activeExecutionTips', p_direction, p_watermark
        );
      END IF;
    WHEN 'agent_run' THEN
      IF v_status = 'AWAITING_REPORT' THEN
        PERFORM hiveos_workspace_projection_adjust(
          v_workspace_id, 'awaitingReports', p_direction, p_watermark
        );
      END IF;
    WHEN 'completion_report' THEN
      PERFORM hiveos_workspace_projection_adjust(
        v_workspace_id, 'completionReports', p_direction, p_watermark
      );
    WHEN 'execution_artifact' THEN
      PERFORM hiveos_workspace_projection_adjust(
        v_workspace_id, 'executionArtifacts', p_direction, p_watermark
      );
    WHEN 'execution_deviation' THEN
      IF v_status = 'OPEN' THEN
        PERFORM hiveos_workspace_projection_adjust(
          v_workspace_id, 'openExecutionDeviations',
          p_direction, p_watermark
        );
      END IF;
    WHEN 'verification_scenario' THEN
      PERFORM hiveos_workspace_projection_adjust(
        v_workspace_id, 'verificationScenarios', p_direction, p_watermark
      );
    WHEN 'verification_run' THEN
      IF v_status = 'IN_PROGRESS' THEN
        PERFORM hiveos_workspace_projection_adjust(
          v_workspace_id, 'activeVerificationRuns',
          p_direction, p_watermark
        );
      END IF;
    WHEN 'verification_report' THEN
      PERFORM hiveos_workspace_projection_adjust(
        v_workspace_id, 'verificationReports', p_direction, p_watermark
      );
      IF (p_row ->> 'overall_status') = 'NOT_READY' THEN
        PERFORM hiveos_workspace_projection_adjust(
          v_workspace_id, 'notReadyVerificationReports',
          p_direction, p_watermark
        );
      END IF;
    WHEN 'governance_signoff' THEN
      PERFORM hiveos_workspace_projection_adjust(
        v_workspace_id, 'governanceSignoffs', p_direction, p_watermark
      );
    WHEN 'evidence_ceiling_assessment' THEN
      PERFORM hiveos_workspace_projection_adjust(
        v_workspace_id, 'evidenceCeilingAssessments',
        p_direction, p_watermark
      );
    WHEN 'governed_release' THEN
      PERFORM hiveos_workspace_projection_adjust(
        v_workspace_id, 'governedReleases', p_direction, p_watermark
      );
    WHEN 'release_manifest' THEN
      PERFORM hiveos_workspace_projection_adjust(
        v_workspace_id, 'releaseManifests', p_direction, p_watermark
      );
    WHEN 'escalation' THEN
      IF v_status <> 'RESOLVED' THEN
        PERFORM hiveos_workspace_projection_adjust(
          v_workspace_id, 'openEscalations', p_direction, p_watermark
        );
      END IF;
  END CASE;
END
$$;

CREATE OR REPLACE FUNCTION hiveos_projection_source_trigger()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  v_watermark TIMESTAMP(3) := clock_timestamp();
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM hiveos_projection_apply_source_row(
      TG_TABLE_NAME, to_jsonb(OLD), -1, v_watermark
    );
    RETURN OLD;
  END IF;
  IF TG_OP = 'UPDATE' THEN
    PERFORM hiveos_projection_apply_source_row(
      TG_TABLE_NAME, to_jsonb(OLD), -1, v_watermark
    );
  END IF;
  PERFORM hiveos_projection_apply_source_row(
    TG_TABLE_NAME, to_jsonb(NEW), 1, v_watermark
  );
  RETURN NEW;
END
$$;

INSERT INTO workspace_operational_projection (
  organization_id, workspace_id, portfolio_id, counts,
  status, source_watermark_at, refreshed_at, version
)
SELECT organization_id, id, portfolio_id, '{}', 'REBUILDING', NULL, NULL, 1
FROM workspace;

INSERT INTO portfolio_operational_projection (
  organization_id, portfolio_id, counts,
  status, source_watermark_at, refreshed_at, version
)
SELECT organization_id, id, '{}', 'REBUILDING', NULL, NULL, 1
FROM portfolio;

DO $$
DECLARE
  v_table TEXT;
  v_row RECORD;
  v_watermark TIMESTAMP(3) := clock_timestamp();
  v_tables TEXT[] := ARRAY[
    'mission', 'runtime_obligation', 'decision',
    'evidence_source', 'snapshot', 'evidence_span',
    'claim', 'dispute', 'honest_null_record', 'provenance_edge',
    'skill', 'skill_version', 'runtime_gate', 'execution_tip',
    'agent_run', 'completion_report', 'execution_artifact',
    'execution_deviation', 'verification_scenario', 'verification_run',
    'verification_report', 'governance_signoff',
    'evidence_ceiling_assessment', 'governed_release',
    'release_manifest', 'escalation'
  ];
BEGIN
  FOREACH v_table IN ARRAY v_tables LOOP
    FOR v_row IN EXECUTE format(
      'SELECT to_jsonb(source_row) AS data FROM %I source_row', v_table
    ) LOOP
      PERFORM hiveos_projection_apply_source_row(
        v_table, v_row.data, 1, v_watermark
      );
    END LOOP;
  END LOOP;
  UPDATE workspace_operational_projection
    SET status = 'READY',
        source_watermark_at = v_watermark,
        refreshed_at = clock_timestamp(),
        version = version + 1;
  UPDATE portfolio_operational_projection
    SET status = 'READY',
        source_watermark_at = v_watermark,
        refreshed_at = clock_timestamp(),
        version = version + 1;
END
$$;

CREATE OR REPLACE FUNCTION hiveos_workspace_projection_seed()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO workspace_operational_projection (
    organization_id, workspace_id, portfolio_id, counts,
    status, source_watermark_at, refreshed_at, version
  ) VALUES (
    NEW.organization_id, NEW.id, NEW.portfolio_id, '{}',
    'READY', clock_timestamp(), clock_timestamp(), 1
  )
  ON CONFLICT (organization_id, workspace_id) DO UPDATE
    SET portfolio_id = EXCLUDED.portfolio_id,
        version = workspace_operational_projection.version + 1;
  RETURN NEW;
END
$$;

CREATE TRIGGER workspace_projection_seed
  AFTER INSERT OR UPDATE OF portfolio_id ON workspace
  FOR EACH ROW EXECUTE FUNCTION hiveos_workspace_projection_seed();

CREATE OR REPLACE FUNCTION hiveos_portfolio_projection_seed()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO portfolio_operational_projection (
    organization_id, portfolio_id, counts,
    status, source_watermark_at, refreshed_at, version
  ) VALUES (
    NEW.organization_id, NEW.id, '{}',
    'READY', clock_timestamp(), clock_timestamp(), 1
  )
  ON CONFLICT (organization_id, portfolio_id) DO NOTHING;
  RETURN NEW;
END
$$;

CREATE TRIGGER portfolio_projection_seed
  AFTER INSERT ON portfolio
  FOR EACH ROW EXECUTE FUNCTION hiveos_portfolio_projection_seed();

DO $$
DECLARE
  v_table TEXT;
  v_tables TEXT[] := ARRAY[
    'mission', 'runtime_obligation', 'decision',
    'evidence_source', 'snapshot', 'evidence_span',
    'claim', 'dispute', 'honest_null_record', 'provenance_edge',
    'skill', 'skill_version', 'runtime_gate', 'execution_tip',
    'agent_run', 'completion_report', 'execution_artifact',
    'execution_deviation', 'verification_scenario', 'verification_run',
    'verification_report', 'governance_signoff',
    'evidence_ceiling_assessment', 'governed_release',
    'release_manifest', 'escalation'
  ];
BEGIN
  FOREACH v_table IN ARRAY v_tables LOOP
    EXECUTE format(
      'CREATE TRIGGER %I AFTER INSERT OR UPDATE OR DELETE ON %I
       FOR EACH ROW EXECUTE FUNCTION hiveos_projection_source_trigger()',
      v_table || '_operational_projection', v_table
    );
  END LOOP;
END
$$;

ALTER TABLE "command_record" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "command_record" FORCE ROW LEVEL SECURITY;
CREATE POLICY command_record_tenant_isolation ON "command_record"
  USING ("organization_id" = hiveos_rls_organization_id())
  WITH CHECK ("organization_id" = hiveos_rls_organization_id());

ALTER TABLE "outbox_event" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "outbox_event" FORCE ROW LEVEL SECURITY;
CREATE POLICY outbox_event_tenant_isolation ON "outbox_event"
  USING ("organization_id" = hiveos_rls_organization_id())
  WITH CHECK ("organization_id" = hiveos_rls_organization_id());

ALTER TABLE "durable_job" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "durable_job" FORCE ROW LEVEL SECURITY;
CREATE POLICY durable_job_tenant_isolation ON "durable_job"
  USING ("organization_id" = hiveos_rls_organization_id())
  WITH CHECK ("organization_id" = hiveos_rls_organization_id());

ALTER TABLE "durable_job_event" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "durable_job_event" FORCE ROW LEVEL SECURITY;
CREATE POLICY durable_job_event_tenant_isolation ON "durable_job_event"
  USING ("organization_id" = hiveos_rls_organization_id())
  WITH CHECK ("organization_id" = hiveos_rls_organization_id());

ALTER TABLE "workspace_operational_projection" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "workspace_operational_projection" FORCE ROW LEVEL SECURITY;
CREATE POLICY workspace_operational_projection_tenant_isolation
  ON "workspace_operational_projection"
  USING ("organization_id" = hiveos_rls_organization_id())
  WITH CHECK ("organization_id" = hiveos_rls_organization_id());

ALTER TABLE "portfolio_operational_projection" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "portfolio_operational_projection" FORCE ROW LEVEL SECURITY;
CREATE POLICY portfolio_operational_projection_tenant_isolation
  ON "portfolio_operational_projection"
  USING ("organization_id" = hiveos_rls_organization_id())
  WITH CHECK ("organization_id" = hiveos_rls_organization_id());
