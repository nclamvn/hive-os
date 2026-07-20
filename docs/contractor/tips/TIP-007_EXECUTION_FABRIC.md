# TIP-007 — Execution Fabric and Manual Provider Bridge

Status: `DRAFT`

## Task

Implement provider-agnostic Contractor, Builder, verifier, TIP, report, artifact, run, deviation, and resource records. Deliver manual bridge first unless SCAN confirms approved API integration.

## Acceptance Criteria

- Instruction artifacts are immutable and hash-addressed.
- Imported Completion Reports require schema validation.
- Provider/model/role and input/output artifact IDs are recorded.
- Retry never overwrites prior runs.
- Builder deviations are visible to Contractor before later dependent TIPs proceed.
- Missing report fields block completion rather than being inferred.
