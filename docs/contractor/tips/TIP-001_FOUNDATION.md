# TIP-001 — Foundation and Quality Gates

Status: `DRAFT · DO NOT EXECUTE BEFORE G0 + BLUEPRINT APPROVAL`

## Task

Establish the approved application foundation after Contractor reconciliation of the real SCAN report.

## Acceptance Criteria

- Strict TypeScript and deterministic package lock.
- Build, typecheck, lint, unit test, integration test, and E2E commands defined.
- Environment schema validates required variables without leaking values.
- CI runs quality gates.
- Base database migration and object-storage interface exist.
- App has explicit demo/development fixture boundary.
- No feature pages beyond a minimal health route and shell placeholder.
