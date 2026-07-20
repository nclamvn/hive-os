# TIP-004 — Mission Kernel

Status: `DRAFT`

## Task

Implement mission contracts, requirements, lifecycle, gates, obligations, decisions, escalations, assurance profiles, and deterministic progress.

## Acceptance Criteria

- Invalid state transitions fail loudly and create no partial mutation.
- Progress derives only from approved weighted obligations.
- Model/provider reports cannot directly set governed mission state.
- Material decisions generate a decision-required item.
- Audit events capture actor, reason, before/after, and linked artifact.
- Unit tests cover every allowed and forbidden transition.
