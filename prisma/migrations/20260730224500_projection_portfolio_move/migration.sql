-- Move already-materialized Workspace counts when its Portfolio association
-- changes. Future source deltas then continue against the new Portfolio.

CREATE OR REPLACE FUNCTION hiveos_workspace_projection_seed()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  v_counts JSONB;
  v_metric RECORD;
  v_watermark TIMESTAMP(3) := clock_timestamp();
BEGIN
  PERFORM set_config('hiveos.organization_id', NEW.organization_id, true);
  IF TG_OP = 'UPDATE' AND OLD.portfolio_id IS DISTINCT FROM NEW.portfolio_id THEN
    SELECT counts INTO v_counts
    FROM workspace_operational_projection
    WHERE organization_id = NEW.organization_id
      AND workspace_id = NEW.id
    FOR UPDATE;
    FOR v_metric IN
      SELECT entry.key AS key, (entry.value #>> '{}')::INTEGER AS value
      FROM jsonb_each(COALESCE(v_counts, '{}'::jsonb)) entry
    LOOP
      PERFORM hiveos_portfolio_projection_adjust(
        NEW.organization_id, OLD.portfolio_id,
        v_metric.key, -v_metric.value, v_watermark
      );
      PERFORM hiveos_portfolio_projection_adjust(
        NEW.organization_id, NEW.portfolio_id,
        v_metric.key, v_metric.value, v_watermark
      );
    END LOOP;
  END IF;
  INSERT INTO workspace_operational_projection (
    organization_id, workspace_id, portfolio_id, counts,
    status, source_watermark_at, refreshed_at, version
  ) VALUES (
    NEW.organization_id, NEW.id, NEW.portfolio_id, '{}',
    'READY', v_watermark, clock_timestamp(), 1
  )
  ON CONFLICT (organization_id, workspace_id) DO UPDATE
    SET portfolio_id = EXCLUDED.portfolio_id,
        source_watermark_at = GREATEST(
          workspace_operational_projection.source_watermark_at,
          v_watermark
        ),
        refreshed_at = clock_timestamp(),
        version = workspace_operational_projection.version + 1;
  RETURN NEW;
END
$$;
