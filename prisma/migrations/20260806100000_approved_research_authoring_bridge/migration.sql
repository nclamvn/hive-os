-- TIP-024E — Approved Research to Authoring Bridge.
-- Provenance is retained inside the append-only revision so an exported
-- document can be traced to the exact independently approved research bundle.
ALTER TABLE "authoring_revision"
  ADD COLUMN "research_imports" JSONB NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE "authoring_revision"
  ADD CONSTRAINT "authoring_revision_research_imports_array"
  CHECK (jsonb_typeof("research_imports") = 'array');
