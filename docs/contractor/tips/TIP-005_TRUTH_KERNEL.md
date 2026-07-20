# TIP-005 — Truth Kernel

Status: `DRAFT`

## Task

Implement claims, evidence, snapshots, exact spans, provenance, disputes, honest-null, insight falsification, and review/access metadata.

## Acceptance Criteria

- Evidence spans are validated against immutable snapshot content.
- Two independent qualifying sources are required for corroboration.
- Conflicting values create disputed state with all claims retained.
- Honest-null is explicit and cannot be auto-filled.
- Falsified/retracted records remain queryable for audit.
- Access-level projections block forbidden fields from public/export views.
- Deterministic tests reproduce Refinery and hygiene invariants.
