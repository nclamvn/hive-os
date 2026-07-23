# TIP-005 — Truth Kernel

Status: `IMPLEMENTED — READY_WITH_DEFERRED`

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

## Implementation notes

- Authoritative schema: `prisma/schema.prisma`
- Database reinforcement: `prisma/migrations/20260723074606_truth_kernel/migration.sql`
- Deterministic services: `src/modules/truth-kernel/`
- Test evidence: `tests/unit/truth-rules.test.ts`,
  `tests/integration/truth.test.ts`

The implemented access lattice is `PUBLIC < WORKSPACE < RESTRICTED`. Public
projections include only `PUBLIC`; export projections exclude `RESTRICTED`;
internal projections require workspace authorization. Snapshot bodies,
falsification criteria, and review metadata are never added to public/export
objects by late redaction.

## Verification

- Full governed Truth Loop, tenant isolation, permission boundaries and
  concurrent terminal-state serialization are covered by `TK-01` through
  `TK-12`.
- Fresh-install and upgrade-from-`cb53c5e` migration rehearsals pass.
- Local technical health: 85 unit, 71 integration and 40 E2E tests pass.
- Detailed evidence and deferred obligations:
  `docs/verification/TIP-005_VERIFY_REPORT.md`.
- G4 local evidence passes. Remote reproducibility remains deferred behind
  `OBL-FND-001`.
