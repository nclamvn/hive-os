# TIP-013 — Truth Operations

Status: `READY_WITH_DEFERRED — LOCAL VERIFIED`

Owner authorization: `2026-07-23`

## Task

Expose the existing Truth Kernel as two operator-grade product surfaces:
Evidence Hub and Claims & Insights. UI actions call Truth Kernel capabilities
only; Prisma remains a read projection behind trusted WorkspaceContext.

## In scope

- Workspace-scoped source, immutable snapshot, and exact evidence-span capture.
- Mission-scoped claim creation and append-only assertion versions.
- Evidence relation, access level, hypothesis/falsification, review cadence,
  disputes, honest-null records, and provenance visibility.
- Owner/Admin review actions and role-appropriate read/write controls.
- Responsive navigation, directed empty states, keyboard access, and a11y.

## Non-negotiable boundaries

- No Truth mutation writes Prisma directly from an app action.
- Evidence spans must match immutable snapshot content exactly.
- Missing evidence never becomes corroboration or certification.
- Conflicting retained assertions remain visible and create disputes.
- Cross-workspace identifiers fail closed without existence disclosure.
- Viewer has no mutation controls.

## Acceptance scenarios

| ID | Scenario | Expected |
| --- | --- | --- |
| TO-01 | Member adds source, snapshot, exact quote | Immutable governed records appear |
| TO-02 | Exact quote is absent or ambiguous | No span is created; directed error |
| TO-03 | Claim links supporting evidence | Claim becomes SOURCED |
| TO-04 | Independent qualifying sources agree | Claim becomes CORROBORATED |
| TO-05 | Retained values conflict | Claim becomes DISPUTED and dispute is visible |
| TO-06 | Cross-workspace IDs are submitted | Operation fails closed |
| TO-07 | Viewer opens Truth pages | Reads succeed; mutation controls are absent |
| TO-08 | 320px viewport and automated scan | No overflow or serious/critical violations |

## Local closure

Closed on `2026-07-23`.

- Evidence Hub and Claims & Insights operate on real, workspace-scoped Truth
  Kernel records.
- Source, snapshot, unique exact-span, claim, version, review, honest-null,
  dispute, and provenance paths retain their governed boundaries.
- Blank governed records, ambiguous quotes, cross-workspace identifiers, and
  Viewer writes fail closed.
- Desktop and 320px UI inspection passed with no horizontal overflow.
- Typecheck, lint, production build, 104 unit, 99 integration, and 52 E2E
  scenarios passed.
- Billing, remote CI, provider execution, and public-release policy were not
  changed.

See `docs/verification/TIP-013_VERIFY_REPORT.md`.
