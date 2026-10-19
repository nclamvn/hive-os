-- Compatibility bridge: legacy bounded-context writes are Workspace-scoped
-- but do not yet bind the TIP-023B transaction-local Organization setting.
-- Projection triggers derive that setting from the referenced Workspace
-- before writing forced-RLS projection rows. RLS itself remains unchanged.

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
  PERFORM set_config('hiveos.organization_id', v_organization_id, true);
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

CREATE OR REPLACE FUNCTION hiveos_workspace_projection_seed()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  PERFORM set_config('hiveos.organization_id', NEW.organization_id, true);
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

CREATE OR REPLACE FUNCTION hiveos_portfolio_projection_seed()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  PERFORM set_config('hiveos.organization_id', NEW.organization_id, true);
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
