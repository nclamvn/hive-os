# HIVE OS: ChatGPT Project handoff

Last synchronized from the ChatGPT Project on 2026-07-23.

Project URL:
https://chatgpt.com/g/g-p-6a61bee121788191929ff1e017cf3796-sot-os/project

## Purpose

This file transfers the decisions and current state that previously lived in the
ChatGPT Project into the repository. It is a navigation aid, not a replacement
for the code, migrations, tests, Contractor package, or Git history.

When a statement here conflicts with the repository, inspect the repository and
report the conflict before changing anything.

## People and operating roles

- Lâm is the Owner and provides authorization for external actions and gates.
- Sol acted as Contractor and reviewer in the ChatGPT Project.
- Fable acted as Builder and stopped at the boundary of each authorized TIP.
- Codex must preserve the same gate discipline. Do not infer authorization for a
  later TIP from the fact that earlier work is complete.

## Repository state at handoff

- Repository: `nclamvn/hive-os`
- Visibility: private
- Local path: `/Users/os/hiveos`
- Branch: `main`
- Remote: `origin`
- Reviewed commit: `cb53c5e55b8ccbd09e99a9f9af6e99bb812c14c5`
- Short SHA: `cb53c5e`
- Working tree was clean and `main` matched `origin/main` when checked.

Recent milestones:

- `28bb932`: TIP-003 Identity, Workspace, and Audit
- `b75aece`: TIP-003C identity security closure
- `a7fb2b1`: TIP-004 Mission Kernel and governed contract loop
- `e47d25c`: TIP-004C current-contract uniqueness
- `cb53c5e`: GitHub Actions workflow aligned with migration and runtime role separation

## Current gate status

- G0 Scan: PASS
- G1 Blueprint: PASS
- G2 Foundation: PASS_WITH_DEFERRED
- TIP-002 Design System: PASS_WITH_DEFERRED
- TIP-003 Identity, Workspace, and Audit: PASS
- TIP-003C identity security sub-gate: PASS
- TIP-004 Mission Kernel: PASS_WITH_DEFERRED
- TIP-004C active-contract uniqueness: PASS
- Remote repository and reviewed commit: VERIFIED
- G3 Mission Loop end-to-end: HOLD (Owner elected to process this hold later)
- TIP-005 Truth Kernel: READY_WITH_DEFERRED after local G4 verification
- TIP-006 Skill Registry: READY_WITH_DEFERRED after local verification
- TIP-007 Execution Fabric: READY_WITH_DEFERRED after local verification
- TIP-008 Verification Governance: READY_WITH_DEFERRED after local verification

On 2026-07-23, the Owner explicitly authorized continuing TIP-005 while
deferring the G3 billing hold. The Owner subsequently authorized TIP-006 Skill
Registry and then authorized local-only TIP-007 Execution Fabric on 2026-07-23.
The Owner explicitly paused billing and all GitHub Actions work. On 2026-07-23
the Owner subsequently authorized local-only TIP-008 Verification Governance.
This authorization does not extend to TIP-009 or later work.

On 2026-07-23, the Owner superseded that boundary and authorized Codex to
continue TIP-009 through TIP-012 in dependency order until the local
architecture and UI are complete, then return to the paused billing/GitHub
Actions obligation. This is local product authorization only; it does not
authorize billing changes, remote pushes, provider APIs, or production
deployment.

The Owner subsequently authorized immediate UI unification using the SOT.OS
v0.2 mock as an interaction reference. The resulting HIVE OS Control Room keeps
the locked light design system, uses real workspace-scoped projections, and
marks later bounded contexts as `Planned`. See `docs/ui/CONTROL_ROOM.md`.

## Current blocker

GitHub Actions did not start because of an Owner account billing problem:

`The job was not started because recent account payments have failed or your
spending limit needs to be increased.`

Relevant workflow runs:

- `29735234751` for `cb53c5e`
- `29735087402` for `e47d25c`

The `quality-gates` workflow is configured, but the job had no executed steps.
Therefore remote reproducibility remains unproven.

Current obligation:

- `OBL-FND-001`: BLOCKED_EXTERNAL

Rerun attempt 2 was triggered on 2026-07-23 against the unchanged `cb53c5e`
commit. The `quality` job failed again with zero executed steps, so the billing
blocker remains active.

After billing is fixed, the intended next action is to rerun workflow run
`29735234751`, inspect every job and step, and close G3 only if all required
checks pass on the reviewed commit. Do not create an empty commit or modify the
workflow merely to bypass the blocker.

## Implemented architecture

### Identity, Workspace, and Audit

- Better Auth owns user, account, session, verification, and email/password auth.
- HIVE OS owns Workspace, Membership, Invitation, permissions, and AuditEvent.
- Workspace routes use `/w/[workspaceSlug]`.
- Server-side `WorkspaceContext` and authorized membership are authoritative.
- Cross-workspace lookup must not leak object existence.
- Owner, Admin, Member, and Viewer permissions come from one centralized source.
- Admin cannot grant, demote, or remove Owner.
- No action may leave a workspace without an active Owner.
- Invitation raw tokens are never persisted. Only cryptographic hashes are stored.
- Invitation acceptance is transactional, email-matched, single-use, and expiry-aware.
- Audit events are append-only with database protection against update and delete.
- Audit payloads use strict schemas and redaction. Credentials, session tokens,
  raw invitation tokens, secrets, and database URLs are forbidden.
- Runtime database access remains least-privileged and separate from migration access.

### Mission Kernel

- Mission creation and contract version 1 are atomic.
- The primary governed loop reaches APPROVED and stops before later kernels.
- State transitions are fail-closed and concurrency-safe.
- Contract approval creates runtime obligations and gates atomically.
- Approved contract content is immutable at service and database levels.
- Mission progress is derived from real obligation records and is unavailable
  before approval.
- `INCOMPLETE` never means `PASS`.
- GateRun is append-only.
- Material actions require governed Decision records.
- BLOCKED creates an Escalation and resume returns to the recorded prior state.
- Every query and mutation is scoped by trusted workspace context.
- Provider or model output cannot directly mutate governed state.
- Claims, evidence, skill execution, provider execution, verification, and
  release remain outside TIP-004.

TIP-004C enforces at most one current contract in DRAFT or IN_REVIEW for a
Mission through the partial unique index:

`mission_contract_one_current`

Concurrent scenarios CONTRACT-CURRENT-01 through CONTRACT-CURRENT-04 were
reported PASS.

## Verification reported in the Project

After TIP-004C:

- Unit tests: 81 passed
- Integration tests: 57 passed
- E2E tests: 33 passed
- Aggregate reported tests: 171 passed
- Build: PASS
- Typecheck: PASS
- Lint: PASS with zero warnings
- Accessibility: no serious or critical automated violations
- Dependency audit: five moderate, zero high or critical, unchanged

These are historical results. Re-run relevant checks whenever code changes or
when remote CI exposes an environment-specific failure.

## Product and interface decisions

The locked visual direction is light, restrained, editorial, and premium.
Avoid generic AI dashboard styling, decorative gradients, glass effects,
excessive cards, oversized empty space, and unnecessary capsules.

Decisions from the SearchOS comparison chat:

- Body copy and text inside cards were increased to about 120 percent.
- The main title should stay on one line where the viewport permits.
- The hero area should remain compact.
- The concise product statement used was:
  `Một hệ thống duy nhất biến ý định thành sự thật có nguồn, trạng thái, vòng đời và trách nhiệm rõ ràng.`
- The compact hero description was subsequently increased by 120 percent from
  its smaller intermediate size.
- Mobile tables may become cards when that prevents unusable horizontal scrolling.
- Long node titles may wrap to two lines rather than being clipped.
- Inspector code, receipts, and long content must wrap safely.
- Top navigation may reduce secondary actions on narrow screens.
- Touch targets, focus states, spacing, and typography must remain accessible.
- Do not use em dash characters in interface copy.
- Validate desktop, tablet, and mobile, including widths from 320 to 1600 pixels.
- No horizontal overflow, text clipping, or badge collision is acceptable.

Deferred visual obligation:

- `OBL-UI-001`: below 768 pixels, stack the workflow heading and explanatory
  note vertically. CLOSED on 2026-07-23 by the responsive layout correction
  and E2E scenario `ID-24`.

## TIP-005 local closure update

On 2026-07-23, the Owner accepted the chief-architect priority to close TIP-005
and G4 before beginning TIP-006.

- G4 local Truth Loop evidence: PASS.
- Unit tests: 85 passed.
- Integration tests: 71 passed.
- E2E tests: 40 passed.
- Build, typecheck and lint: PASS with zero lint warnings.
- Fresh migration and upgrade-from-`cb53c5e` rehearsals: PASS.
- `OBL-UI-001`: CLOSED.
- Remote reproducibility remains blocked by `OBL-FND-001`.
- A fresh npm registry vulnerability audit remains
  `OBL-DEP-001: DEFERRED_PERMISSION`.
- The pinned Prisma PostgreSQL adapter warning is tracked as
  `OBL-DEP-002: DEFERRED_PINNED_DEPENDENCY`.

See `docs/verification/TIP-005_VERIFY_REPORT.md`.

## TIP-006 local closure update

On 2026-07-23, the Owner explicitly authorized TIP-006 Skill Registry.

- Immutable, content-hashed SkillVersion contracts: PASS.
- Explicit, audited and concurrency-safe activation: PASS.
- Capability and assurance discovery: PASS.
- Tenant isolation and Viewer/manager permissions: PASS.
- Runtime role and database immutability enforcement: PASS.
- Control Room Skill Registry projection: operational from real counts.
- Unit tests: 91 passed.
- Integration tests: 80 passed.
- E2E tests: 41 passed.
- Build, typecheck and lint: PASS with zero lint warnings.
- Fresh migration and TIP-005-to-TIP-006 upgrade rehearsals: PASS.
- At this checkpoint TIP-007 had not started; the later authorization and
  closure below supersede that earlier boundary.

See `docs/verification/TIP-006_VERIFY_REPORT.md`.

## TIP-007 local closure update

On 2026-07-23, the Owner paused billing/GitHub Actions and explicitly authorized
continuing product completion on the local machine with TIP-007.

- Provider-independent Execution Fabric and Manual Provider Bridge: PASS.
- Immutable SHA-256 instruction/report artifacts: PASS.
- Strict atomic Completion Report import with no inferred fields: PASS.
- Provider/model/role attribution and append-only retries: PASS.
- Contractor-visible material deviation gate for dependent TIPs: PASS.
- Execution readiness gate for `EXPLORING → BUILDING`: PASS.
- `BUILDING → VERIFYING` remains fail-closed pending TIP-008.
- Control Room Manual Bridge projection: operational from real records.
- Unit tests: 97 passed.
- Integration tests: 88 passed.
- E2E tests: 42 passed.
- Build, typecheck and lint: PASS with zero lint warnings.
- Fresh migration and TIP-006-to-TIP-007 upgrade rehearsals: PASS.
- Remote reproducibility remains paused/blocked by `OBL-FND-001`.
- At this checkpoint TIP-008 had not started; the later authorization below
  supersedes that earlier boundary.

See `docs/verification/TIP-007_VERIFY_REPORT.md`.

## TIP-008 local authorization update

On 2026-07-23, the Owner explicitly authorized TIP-008 Verification Governance
for local implementation. Billing, GitHub Actions, provider APIs, TIP-009, and
TIP-011 Observatory product surfaces remain outside the authorization.

## TIP-008 local closure update

The local TIP-008 boundary is complete and supersedes the earlier authorization
checkpoint:

- Immutable VerificationScenario, VerificationRun, four-section VerifyReport,
  sign-off, evidence-ceiling, GovernedRelease, and ReleaseManifest ledgers:
  PASS.
- Research/Regulated verifier independence and corruption requirements: PASS.
- Deterministic `BUILDING → VERIFYING → REVIEW → RELEASED` governance: PASS.
- Exact public claim-version and evidence-ceiling release checks: PASS.
- Future Observatory projection reads only approved public manifests after
  Mission RELEASED; no Observatory route was opened.
- Control Room VER-31 and RLS-32 are operational from real scoped records.
- Unit tests: 102 passed.
- Integration tests: 92 passed.
- E2E tests: 43 passed.
- Build, typecheck and lint: PASS with zero lint warnings.
- Fresh migration and TIP-007-to-TIP-008 upgrade rehearsals: PASS.
- Remote reproducibility remains paused/blocked by `OBL-FND-001`.
- TIP-009 and TIP-011 remain closed pending explicit Owner authorization.

See `docs/verification/TIP-008_VERIFY_REPORT.md`.

## TIP-009 through TIP-012 local closure update

On 2026-07-23, the Owner authorized continuing all architecture and UI TIPs
locally before returning to billing.

- TIP-009 Mission Workspace with nine governed deep-linked lenses: PASS.
- TIP-010 authoritative Dashboard and operational context rail: PASS.
- TIP-011 manifest-only Observatory and retained Reports surfaces: PASS.
- TIP-012 local release-candidate gate G6: PASS.
- Unit tests: 104 passed.
- Integration tests: 96 passed.
- E2E tests: 50 passed.
- Aggregate tests: 250 passed.
- Production build, typecheck and lint: PASS with zero lint warnings.
- Responsive 390px overflow and serious/critical accessibility gates: PASS.
- Fresh 11-migration and TIP-007 upgrade-preservation rehearsals: PASS.
- Owner accepted local UI UAT on 2026-07-23.
- Final UI regression scenarios `CR-10` and `CR-11` cover deterministic
  single-line finder ellipsis at 320px and pointer-versus-keyboard form focus.
- Billing was not changed. `OBL-FND-001` is now the next priority and remains
  externally blocked until the Owner resolves the repository billing
  condition and GitHub Actions passes on a reviewed commit.
- Read-only GitHub recheck: run `29735234751`, job `89174148641`, failed with
  zero steps. The annotation says recent account payments failed or the
  spending limit must be increased; no job log exists.

See `docs/verification/TIP-009_VERIFY_REPORT.md` through
`docs/verification/TIP-012_VERIFY_REPORT.md`.

## TIP-013 local closure update

On 2026-07-23, the Owner authorized continuing the remaining local product
architecture before returning to billing.

- Evidence Hub for governed sources, immutable snapshots, and unique exact
  spans: PASS.
- Claims & Insights for append-only assertions, review, conflict, honest-null,
  and provenance: PASS.
- Truth Kernel-only mutations with trusted WorkspaceContext: PASS.
- Blank-record, ambiguous-quote, Viewer-write, and tenant-isolation negative
  paths: PASS.
- Desktop and 320px responsive inspection: PASS with no horizontal overflow.
- Unit tests: 104 passed.
- Integration tests: 99 passed.
- E2E tests: 52 passed.
- Aggregate tests: 255 passed.
- Production build, typecheck and lint: PASS with zero lint warnings.
- No schema change was required; all 11 migrations remain current.
- Billing and remote CI were not changed. `OBL-FND-001` remains externally
  blocked.
- TIP-014 Templates and Skill Registry productization is the next local
  priority.

See `docs/verification/TIP-013_VERIFY_REPORT.md`.

## TIP-014 local closure update

On 2026-07-23, the chief-architect sequence continued with Templates and Skill
Library productization.

- Deterministic Mission contract catalog across all four assurance profiles:
  PASS.
- Template-to-draft prefill without auto-approval or lifecycle bypass: PASS.
- Real workspace Skill Registry read and management surface: PASS.
- Atomic initial registration, inert candidate version, explicit activation,
  status lifecycle, immutable digest, and audit boundaries: PASS.
- Viewer read-only and tenant isolation boundaries: PASS through existing
  kernel scenarios.
- Desktop and 320px responsive inspection: PASS with no horizontal overflow.
- Unit tests: 106 passed.
- Integration tests: 99 passed.
- E2E tests: 55 passed.
- Aggregate tests: 260 passed.
- Production build, typecheck and lint: PASS with zero lint warnings.
- No schema change was required; all 11 migrations remain current.
- Billing and remote CI were not changed. `OBL-FND-001` remains externally
  blocked.
- TIP-015 Execution Operations is the next local priority.

See `docs/verification/TIP-014_VERIFY_REPORT.md`.

## TIP-015 local closure update

On 2026-07-23, the Owner explicitly authorized Execution Operations before
Verification and Settings productization.

- Full governed Manual Bridge sequence from APPROVED through execution
  readiness and BUILDING: PASS.
- Work-package creation with active assurance-compatible SkillVersion: PASS.
- Immutable instruction artifacts and provider/model/role attribution: PASS.
- Strict atomic Completion Report import and malformed-report negative path:
  PASS.
- Append-only retry, dependency, deviation resolution, and retained history:
  PASS.
- Viewer read-only and tenant-scoped projection boundaries: PASS.
- Desktop and 320px responsive inspection: PASS with no horizontal overflow.
- Unit tests: 106 passed.
- Integration tests: 99 passed.
- E2E tests: 57 passed.
- Aggregate tests: 262 passed.
- Production build, typecheck and lint: PASS with zero lint warnings.
- No schema change was required; all 11 migrations remain current.
- Provider APIs, billing and remote CI were not changed. `OBL-FND-001` remains
  externally blocked.
- TIP-016 Verification Operations is the next local priority, followed by
  Settings productization.

See `docs/verification/TIP-015_VERIFY_REPORT.md`.

## Startup checklist for every new Codex task

1. Read `AGENTS.md`.
2. Read this handoff.
3. Read the relevant files under `docs/contractor/`.
4. Inspect `git status --short --branch`.
5. Inspect `git log -5 --oneline --decorate`.
6. Confirm the current commit and gate before proposing work.
7. Read the relevant Next.js guide under `node_modules/next/dist/docs/` before
   changing Next.js code.
8. Do not print or modify `.env` secrets.
9. Do not begin TIP-005 without explicit Owner authorization.

## ChatGPT Project inventory

The Project contained three chats:

- `Big Project - HIVE OS`: authoritative history of TIP reviews and current gate.
- `So sánh SearchOS-V1`: responsive and typography refinement decisions.
- `HIVE-Research Math`: listed in the Project but no message content was
  available when the handoff was created.

The Project Sources section contained no uploaded source files at the time of
handoff. The repository is the durable source of truth.
