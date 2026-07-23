# TIP-008 — Verification and Governance

Status: `READY_WITH_DEFERRED — LOCAL VERIFICATION COMPLETE`

Owner authorization: `2026-07-23`

Delivery boundary: local repository and local databases only. Billing, remote
GitHub Actions, provider APIs, production deployment, Mission Workspace UX
(TIP-009), and Observatory product surfaces (TIP-011) remain out of scope.

## Task

Implement deterministic Verification and Release Governance over retained
TIP-007 execution evidence. Verifier output is accepted only as schema-valid,
attributed input; it cannot directly set verification PASS, approve a release,
or mutate Mission status.

## In Scope

- Immutable VerificationScenario definitions linked to approved requirements.
- VerificationRun records bound to completed Manual Bridge `VERIFIER` attempts.
- Deterministic verifier-independence assessment against retained Builder runs.
- First-class requirement coverage, scenario results, technical health, and
  corruption-test results.
- Immutable, content-hashed Verify Reports containing all four mandatory Verify
  Standard sections.
- Human verification and release sign-offs with assurance-aware authority.
- Deterministic evidence-ceiling assessments for exact ClaimVersions.
- Approved Release and immutable ReleaseManifest records.
- Mission transitions `BUILDING → VERIFYING → REVIEW → RELEASED`, gated by
  deterministic records rather than model assertions.
- A read-only approved-release projection for the future Observatory. No
  Observatory page or public endpoint is opened in this TIP.

## Out of Scope

- Direct verifier/provider APIs, background workers, or billing.
- Treating a TIP-007 Completion Report as independent verification by itself.
- Mission Workspace, Observatory, Reports, or public web publication UI.
- Release deployment, artifact download endpoints, revocation workflows, or
  production migration.
- TIP-009 or later product-surface work.

## Verification Contract

A VerificationRun can begin only when:

- its Mission is `BUILDING`;
- every execution TIP is `DONE`, with no awaiting report or open material
  deviation;
- at least one required VerificationScenario exists;
- the linked AgentRun is terminal, has role `VERIFIER`, and has a valid imported
  Completion Report.

For Research and Regulated profiles, the verifier provider/model pair must not
match any retained Builder provider/model pair for the Mission.

A Verify Report is imported atomically and rejected unless it contains:

1. exact coverage for every approved requirement, with explicit
   `PASS`/`FAIL`/`DEFERRED`, method, and evidence artifact IDs;
2. exactly one result for every required scenario, with explicit severity and
   evidence;
3. the complete technical-health schema with exact counts;
4. an explicit overall status and deferred list.

The kernel recomputes overall status and rejects a caller-supplied status that
does not match. Missing, duplicate, cross-workspace, or unlinked evidence fails
the transaction.

Research and Regulated verification additionally require at least one
corruption test, all with `PASS`.

## Release Contract

- `VERIFYING → REVIEW` requires a completed READY Verify Report. Research and
  Regulated also require independent verification and an approved human
  verification sign-off.
- Release authorization requires explicit methods and limitations, all
  assurance-required release sign-offs, and no unresolved verification failure.
- Public release is available only to assurance profiles that permit it.
- Every selected ClaimVersion must be the latest retained version, have an
  allowed Claim state, satisfy access-level and evidence-ceiling rules, and
  retain supporting provenance. `HONEST_NULL` is public-eligible only with an
  `EMPTY_CERTIFIED` record and replayable certificate reference.
- `OPEN_INCOMPLETE` is never upgraded, inferred, or serialized as
  `EMPTY_CERTIFIED`.
- The immutable manifest records exact ClaimVersion IDs/numbers/content hashes,
  exact artifact IDs/hashes, methods, limitations, evidence ceilings, and
  approver membership IDs.
- `REVIEW → RELEASED` requires an approved Release with a valid manifest.
- The future Observatory projection reads only PUBLIC, APPROVED releases whose
  Mission is already `RELEASED`; it never joins directly to mutable truth rows.

## Acceptance Criteria

- Verify Report cannot be completed without all four mandatory sections.
- OPEN_INCOMPLETE never appears as EMPTY_CERTIFIED.
- Release blocks when claim state, access level, evidence ceiling, verifier status, or required sign-off fails.
- A release manifest lists exact claim versions, artifacts, hashes, methods, limitations, and approvers.
- Observatory only reads from approved release projections.
- Missing, failed, deferred-required, or contradictory verification fields
  produce `NOT_READY`.
- Retry/concurrent completion never overwrites a prior run or creates two Verify
  Reports for one run.
- Runtime roles cannot update/delete immutable verification, sign-off,
  assessment, or manifest ledgers.
- Cross-workspace references fail closed.
- Fresh and TIP-007-upgrade migrations, unit, integration, concurrency, E2E,
  lint, typecheck, and production build pass locally.

## Acceptance Scenarios

| ID | Scenario | Expected |
| --- | --- | --- |
| VG-01 | Begin with a terminal independent VERIFIER attempt | IN_PROGRESS run and Mission VERIFYING |
| VG-02 | Reuse a Builder provider/model for Research verification | Rejected as not independent |
| VG-03 | Submit all four valid sections | Immutable READY report created |
| VG-04 | Omit or duplicate any mandatory coverage/result | Atomic rejection |
| VG-05 | Supply an overall status inconsistent with computed health | Rejected |
| VG-06 | Run required corruption tests with one failure | NOT_READY |
| VG-07 | Attempt REVIEW without verification sign-off when required | Blocked |
| VG-08 | Approve sign-off with unauthorized role | Rejected |
| VG-09 | Public-release non-public or disputed claim | Blocked |
| VG-10 | Public-release HONEST_NULL with OPEN_INCOMPLETE | Blocked |
| VG-11 | Authorize a valid release | Immutable hash-addressed manifest created |
| VG-12 | Transition REVIEW to RELEASED without approved manifest | Blocked |
| VG-13 | Read Observatory projection before Mission RELEASED | Omitted |
| VG-14 | Read a released PUBLIC projection | Manifest-backed record only |
| VG-15 | Concurrent Verify Report completion | Exactly one succeeds |
| VG-16 | Cross-workspace verifier/artifact/claim reference | Non-disclosing failure |
