# TIP-008 — Verification and Governance

Status: `DRAFT`

## Task

Implement requirement coverage, scenarios, technical health, verifier and corruption runs, sign-offs, evidence ceilings, and release manifests.

## Acceptance Criteria

- Verify Report cannot be completed without all four mandatory sections.
- OPEN_INCOMPLETE never appears as EMPTY_CERTIFIED.
- Release blocks when claim state, access level, evidence ceiling, verifier status, or required sign-off fails.
- A release manifest lists exact claim versions, artifacts, hashes, methods, limitations, and approvers.
- Observatory only reads from approved release projections.
