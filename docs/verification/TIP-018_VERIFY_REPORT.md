# TIP-018 Cross-surface Closure Verify Report

Date: 2026-07-24

Overall status: `READY_WITH_DEFERRED — LOCAL VERIFIED`

## Result

Cross-surface discovery and governed export are now operational local product
capabilities. Object Finder searches real workspace records in addition to the
system map, while Audit, Verify Reports and release manifests expose explicit
download actions backed by authenticated, capability-checked route handlers.

## Technical health

| Check | Result |
|---|---|
| Next.js 16.2.10 production build | PASS |
| Type errors | 0 |
| Lint errors | 0 |
| Lint warnings | 0 |
| Unit tests | 106 passed |
| Integration tests | 103 passed |
| E2E tests | 64 passed |
| Aggregate tests | 273 passed |
| Serious/critical accessibility violations | 0 |
| Mobile horizontal overflow at 320px | 0 |
| Schema migrations | 12 current |

## Governed behavior

- Object Finder searches recent Evidence Sources, Claims, Skills, Execution
  TIPs, Verify Reports and governed releases using workspace-scoped queries.
- Finder results use existing governed surface routes and never synthesize
  records, status or metrics.
- Audit export requires `audit.read`; unauthorized roles fail with `403`.
- Verify Report and release-manifest exports require `verification.read`.
- Every record lookup combines the requested identifier with the trusted
  `WorkspaceContext.workspace.id`.
- Cross-workspace identifiers collapse to `404 NOT_FOUND`.
- Unauthenticated export requests return `401` before workspace discovery.
- Downloads use private, no-store JSON responses with attachment and
  `nosniff` headers.
- Verify Report exports retain coverage, scenario, technical-health,
  corruption, artifact-digest, sign-off and evidence-ceiling evidence.
- Release exports retain the exact immutable manifest, approvals, methods,
  limitations, claim versions, artifacts and content digest.
- Audit exports retain redacted append-only event payloads and correlation
  identifiers; the export path does not weaken audit redaction rules.

## UI evidence

- Finder copy remains one line with deterministic ellipsis at narrow widths.
- Governed result rows reuse the current editorial ledger language and display
  object type, stable code and honest status.
- Reports exposes quiet secondary download actions without changing the
  mission-first hierarchy.
- Audit exposes its download only to roles that can already read the ledger.
- Automated mobile, keyboard and accessibility scenarios remain green.

## Deferred obligations

- TIP-019 owns clean-install and upgrade rehearsal, backup/restore,
  performance/security review, recovery drills and final Local RC evidence.
- Billing, remote CI, merge and deployment remain intentionally deferred until
  Local RC sign-off.
- The pinned `pg` concurrency deprecation remains isolated for dependency
  hardening; governed concurrency scenarios continue to pass.

## Gate assessment

- TIP-018: local verified.
- Cross-surface discovery and governed export: operational.
- TIP-019: next and final local hardening priority.
- Remote G3: intentionally deferred until Local RC and billing resolution.
