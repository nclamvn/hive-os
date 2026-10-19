CREATE OR REPLACE FUNCTION hiveos_guard_math_research_cycle_projection()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.status IN ('STOPPED', 'FAILED') THEN
    RAISE EXCEPTION 'terminal math research cycle is immutable';
  END IF;
  IF NEW.organization_id IS DISTINCT FROM OLD.organization_id OR
     NEW.workspace_id IS DISTINCT FROM OLD.workspace_id OR
     NEW.mission_id IS DISTINCT FROM OLD.mission_id OR
     NEW.root_case_id IS DISTINCT FROM OLD.root_case_id OR
     NEW.root_contract_digest IS DISTINCT FROM OLD.root_contract_digest OR
     NEW.root_attempt_digest IS DISTINCT FROM OLD.root_attempt_digest OR
     NEW.root_review_digest IS DISTINCT FROM OLD.root_review_digest OR
     NEW.command_id IS DISTINCT FROM OLD.command_id OR
     NEW.max_rounds IS DISTINCT FROM OLD.max_rounds OR
     NEW.max_calls IS DISTINCT FROM OLD.max_calls OR
     NEW.max_observed_tokens IS DISTINCT FROM OLD.max_observed_tokens OR
     NEW.deadline_at IS DISTINCT FROM OLD.deadline_at OR
     NEW.created_at IS DISTINCT FROM OLD.created_at THEN
    RAISE EXCEPTION 'math research cycle sealed fields are immutable';
  END IF;
  IF NEW.calls_started < OLD.calls_started OR
     NEW.observed_tokens < OLD.observed_tokens OR
     NEW.completed_rounds < OLD.completed_rounds THEN
    RAISE EXCEPTION 'math research cycle accounting is monotonic';
  END IF;
  IF NEW.status IN ('STOPPED', 'FAILED') AND NEW.stop_reason IS NULL THEN
    RAISE EXCEPTION 'terminal math research cycle requires a stop reason';
  END IF;
  RETURN NEW;
END;
$$;
