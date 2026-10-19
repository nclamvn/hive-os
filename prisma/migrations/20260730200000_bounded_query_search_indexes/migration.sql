-- TIP-023C: stable seek-pagination and PostgreSQL full-text search indexes.

CREATE INDEX mission_workspace_updated_id_idx
  ON mission(workspace_id, updated_at DESC, id DESC);
CREATE INDEX mission_workspace_created_id_idx
  ON mission(workspace_id, created_at DESC, id DESC);
CREATE INDEX claim_workspace_updated_id_idx
  ON claim(workspace_id, updated_at DESC, id DESC);
CREATE INDEX skill_workspace_updated_id_idx
  ON skill(workspace_id, updated_at DESC, id DESC);
CREATE INDEX execution_tip_workspace_updated_id_idx
  ON execution_tip(workspace_id, updated_at DESC, id DESC);
CREATE INDEX verification_report_workspace_created_id_idx
  ON verification_report(workspace_id, created_at DESC, id DESC);
CREATE INDEX audit_event_workspace_created_id_idx
  ON audit_event(workspace_id, created_at DESC, id DESC);
CREATE INDEX governed_release_workspace_approved_id_idx
  ON governed_release(workspace_id, approved_at DESC, id ASC);

CREATE INDEX skill_version_capabilities_gin_idx
  ON skill_version USING GIN(capabilities);
CREATE INDEX skill_version_assurance_compatibility_gin_idx
  ON skill_version USING GIN(assurance_compatibility);

CREATE INDEX mission_search_fts_idx
  ON mission USING GIN(
    to_tsvector('simple', reference_code || ' ' || title)
  );
CREATE INDEX evidence_source_search_fts_idx
  ON evidence_source USING GIN(
    to_tsvector(
      'simple',
      title || ' ' || canonical_uri || ' ' || COALESCE(publisher, '')
    )
  );
CREATE INDEX claim_search_fts_idx
  ON claim USING GIN(to_tsvector('simple', claim_key));
CREATE INDEX claim_version_search_fts_idx
  ON claim_version USING GIN(to_tsvector('simple', statement));
CREATE INDEX skill_search_fts_idx
  ON skill USING GIN(
    to_tsvector(
      'simple', skill_key || ' ' || display_name || ' ' || description
    )
  );
CREATE INDEX execution_tip_search_fts_idx
  ON execution_tip USING GIN(
    to_tsvector('simple', code || ' ' || title || ' ' || description)
  );
