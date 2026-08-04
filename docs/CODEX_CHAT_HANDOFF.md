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

### Gate reconciliation (TIP-020 Part A — LOCKED by Owner 2026-07-28)

Ratified by `DEC-009` and `DEC-010` (`docs/contractor/10_DECISIONS_LOG.md`).
This locked ledger is now the authoritative gate record; the single-axis
statuses above are retained as the historical build trail (append-only, not
rewritten). See `docs/contractor/tips/TIP-020_GOVERNANCE_RECONCILIATION.md`.

```text
G0 SCAN:                            PASS
G1 BLUEPRINT:                       PASS
G2 FOUNDATION LOCAL:                PASS
G3 MISSION LOOP LOCAL:              PASS
G3 REMOTE REPRODUCIBILITY:          PASS               (run 30891944749)
G4 TRUTH LOOP LOCAL:                PASS
G5 EXECUTION + VERIFICATION LOCAL:  PASS
G6 LOCAL RC:                        PASS

LOCAL RC:            SIGNED
REMOTE RC:           NOT ESTABLISHED (packaging gates remain)
PRODUCTION RELEASE:  NOT AUTHORIZED
PUBLIC RELEASE:      NOT AUTHORIZED
```

`PASS_PROVISIONAL` holds until remote CI runs green on the reviewed commit; then
the suffix is removed and DEC-009 expires. A bare `G3: PASS` must never be
recorded while remote reproducibility is unproven (DEC-010).

Deferred obligations (preserved; not softened by the signed Local RC):

```text
OBL-FND-001  GitHub Actions remote CI   CLOSED                (run 30891944749, SHA e7fe2155363f3567ce9670b087407b8795b8f906)
OBL-DEP-001  Dependency audit closure   CLOSED                (TIP-023S, fresh zero-finding audits)
OBL-DEP-002  Prisma/pg deprecation      CLOSED                (TIP-023S-R1 strict local + remote gates)
```

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

## Historical billing blocker — closed

Earlier GitHub Actions runs did not start because of an Owner account billing
problem:

`The job was not started because recent account payments have failed or your
spending limit needs to be increased.`

Relevant workflow runs:

- `29735234751` for `cb53c5e`
- `29735087402` for `e47d25c`

The `quality-gates` workflow was configured, but those historical jobs had no
executed steps. On 2026-08-04 the Owner reported billing corrected and
authorized TIP-023S-R1. Run `30891944749` then completed all steps successfully
on exact SHA `e7fe2155363f3567ce9670b087407b8795b8f906`.

Current obligation:

- `OBL-FND-001`: CLOSED

## TIP-021B local stabilization closure

On 2026-07-29, the Owner authorized TIP-021B after the current-project X-Ray.
The bounded local findings were closed:

- Direct `/verify-email` visits no longer claim successful verification.
- Runtime startup validation remains fail-closed without unsupported
  `process.exit` usage in the Edge instrumentation bundle.
- Security-event ledger failures emit sanitized operational signals while
  remaining isolated from authentication flow availability.
- The founding Contractor manifest is preserved separately from the tested
  current-package manifest under DEC-013.
- Drifted project, governance, identity, and module-boundary documentation was
  reconciled.

Local evidence: typecheck, lint, production build, dependency policy, 131 unit,
122 integration, and 74 E2E scenarios passed. Remote reproducibility,
production release, and public release remain unauthorized; `OBL-FND-001`
remains `BLOCKED_EXTERNAL`.

## TIP-021C-A local production-contract closure

On 2026-07-29, the Owner authorized the local-only, provider-neutral
TIP-021C-A. The standalone container, environment matrix, split
liveness/readiness, correlation/structured logging, bounded database runtime,
S3 encryption contract, maintenance mode, recovery rehearsal, local load
observation, and operations runbooks were locally verified.

Local evidence: container user UID 1001 with no embedded `.env`; startup
contract 8/8; 13 migrations and 56 tables plus object storage restored; 140
unit, 123 integration, and 76 E2E scenarios completed. The one registered
shared-server timing flake passed on retry and an isolated no-retry rerun.

External staging, vendor selection, billing, domain/DNS, secrets, production
RPO/RTO/SLO, PostgreSQL RLS, retention deletion, legal hold, production, and
public release remain unauthorized. See
`docs/operations/OWNER_DECISIONS_TIP-021C-B.md`.

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

## TIP-016 local closure update

On 2026-07-24, the Owner made Local Product Complete the primary objective and
explicitly deferred billing, remote GitHub CI, merge readiness, and deployment
until after a locally signed Release Candidate.

- Full Scenario → verifier → Verify Report → sign-off → manifest → RELEASED
  operator sequence: PASS.
- Deterministic independence, exact coverage, corruption, evidence ceiling and
  runtime-gate enforcement remain kernel-owned: PASS.
- Viewer read-only and server-side capability boundaries: PASS.
- Production build, typecheck and lint: PASS with zero lint warnings.
- Unit tests: 106 passed.
- Integration tests: 99 passed.
- E2E tests: 59 passed.
- Aggregate tests: 264 passed.
- Desktop and 320px responsive/accessibility gates: PASS with no horizontal
  overflow and zero serious/critical violations.
- No schema change was required; all 11 migrations remain current.
- TIP-017 Settings productization is the next local priority, followed by
  TIP-018 cross-surface closure and TIP-019 local release hardening.
- Billing, remote CI and deployment remain outside the local critical path.

See `docs/verification/TIP-016_VERIFY_REPORT.md`.

## TIP-017 local closure update

On 2026-07-24, the Owner accepted the TIP-016 UI and authorized continuing the
remaining local TIPs.

- Unified Settings control plane for Identity, Provider, Storage, Assurance,
  Retention and Release: PASS.
- Workspace-scoped policy persistence, migration backfill, authority lock and
  append-only audit event: PASS.
- Mission assurance default, Manual Bridge provider allowlist and public
  release ceiling enforced by their authoritative kernels: PASS.
- Credential-free provider identifier contract: PASS.
- Main navigation contains zero planned destinations.
- Production build, typecheck and lint: PASS with zero lint warnings.
- Unit tests: 106 passed.
- Integration tests: 102 passed.
- E2E tests: 61 passed.
- Aggregate tests: 269 passed.
- 320px responsive/accessibility gate: PASS with no horizontal overflow and
  zero serious/critical violations.
- All 12 migrations are current in development and isolated E2E databases.
- TIP-018 cross-surface closure is the next local priority, followed by TIP-019
  local release hardening and Local RC sign-off.
- Billing, remote CI, merge and deployment remain outside the local critical
  path.

See `docs/verification/TIP-017_VERIFY_REPORT.md`.

## TIP-018 local closure update

On 2026-07-24, the chief-architect sequence continued with cross-surface
discovery and governed export.

- Object Finder searches real Evidence, Claim, Skill, Execution, Verification
  and Release records with workspace-scoped server projections: PASS.
- Audit ledger, Verify Report and immutable release-manifest downloads: PASS.
- Authentication, capability enforcement, tenant isolation and non-disclosing
  `404` behavior: PASS.
- Private no-store attachment responses and retained canonical evidence:
  PASS.
- Production build, typecheck and lint: PASS with zero lint warnings.
- Unit tests: 106 passed.
- Integration tests: 103 passed.
- E2E tests: 64 passed.
- Aggregate tests: 273 passed.
- 320px responsive/accessibility gates remain PASS.
- All 12 migrations remain current.
- TIP-019 local release hardening and Local RC sign-off are the next and final
  local priority.
- Billing, remote CI, merge and deployment remain outside the local critical
  path.

See `docs/verification/TIP-018_VERIFY_REPORT.md`.

## TIP-019 local hardening and Local RC update

On 2026-07-24, local hardening completed and the Local Release Candidate was
signed.

- Integrity-manifested PostgreSQL and local-object-storage backup tooling:
  PASS.
- Confirmation-guarded restore with pre-mutation SHA-256 verification: PASS.
- Fresh install across all 12 migrations and runtime privilege checks: PASS.
- Upgrade preservation and Workspace Policy backfill: PASS.
- Recovery rehearsal preserving counts across all 54 product tables: PASS.
- Next.js 16.2.11 and Prisma 7.9.0 dependency upgrade: PASS.
- `npm audit --audit-level=moderate`: zero vulnerabilities.
- Production build, typecheck and lint: PASS with zero lint warnings.
- Unit tests: 106 passed.
- Integration tests: 103 passed.
- E2E tests: 64 passed.
- Aggregate tests: 273 passed.
- Local warm loopback baseline: `/sign-in` 14 ms average and `/api/health`
  11 ms average across ten requests each.
- Local RC: SIGNED.
- Billing, remote CI, merge and deployment remain deferred; Local RC does not
  claim those external gates.

See `docs/verification/TIP-019_LOCAL_RC_REPORT.md`.

## TIP-023S dependency-security closure update

On 2026-08-04, the Owner authorized an isolated dependency closure after fresh
registry advisories caused DEC-012 to fail. Prisma runtime, adapter and CLI
packages were aligned on 7.9.1; PostCSS, `fast-uri` and both installed
`brace-expansion` lines were patched without a major framework or lint-stack
upgrade. Fresh full and runtime audits report zero vulnerabilities, so
RISK-DEP-001 is closed and the accepted high-advisory ceiling is reset to zero.
The former billing blocker is closed by new green evidence, not inferred from
the old zero-step runs.

## TIP-023S-R1 pg and remote-obligation update

On 2026-08-04, the Owner authorized closure of the two remaining obligations.
The Prisma/pg concurrency warning was traced to relation fan-out and explicit
parallel calls sharing one PoolClient. A per-client FIFO plus bounded sequential
kernel reads now preserves pool concurrency while enforcing the pg 9 contract.
Strict integration (157/157) and strict E2E (85/85) promote deprecations to
errors and pass locally and remotely. Both `OBL-DEP-002` and `OBL-FND-001` are
closed by run `30891944749` on the exact implementation SHA.

## TIP-022 pilot-readiness implementation update

On 2026-07-29, the Owner authorized the Builder to implement the bounded
TIP-022 RtR Real-World Pilot Readiness package before any real pilot or
model-provider integration.

- Built-in RtR engineering-change dossier template: implemented.
- Governed PDF/CSV/TXT/JSON/Markdown/image file intake through the existing
  local/S3 storage boundary: implemented.
- Complete mission dossier with deterministic SHA-256 integrity manifest:
  implemented.
- Mission-scoped pilot measurement from authoritative ledger timestamps and
  provenance, with honest unavailable values: implemented.
- Controlled-environment readiness command and dry-run runbook: implemented.
- Typecheck, lint, production build, 159 unit, 128 integration, and 82 E2E
  scenarios passed. One existing sidebar timing scenario passed on its
  configured retry.

The current local readiness observation remains intentionally not ready until
the Owner supplies `PILOT_WORKSPACE_SLUG` and a real functional-team
attestation. Remote CI remains `BLOCKED_EXTERNAL`; external staging, provider
selection, production release, and public release remain unverified or
unauthorized.

## TIP-023G lifecycle and dossier-plane update

On 2026-08-04, the Owner authorized the Builder to close the lifecycle,
large-dossier and worker-observability boundary before enterprise scale
certification.

- Legal holds and two-person lifecycle dispositions preserve immutable
  Snapshot metadata, hashes, provenance and audit while allowing only an
  eligible retained object body to be removed.
- Organization, Workspace and Mission root deletion fails closed at the
  PostgreSQL boundary.
- Dossier requests use the retained command, outbox and leased-job plane;
  canonical JSONL parts are byte bounded, hashed and resumable, and the
  manifest is published last.
- A tenant-scoped monotonic source revision invalidates an export when any
  included Mission record changes after its boundary was captured.
- Worker cycles are Organization-scoped, query pages are bounded, and
  operational/slow-query events exclude SQL, parameters, content and secrets.
- TIP-023H remains the next release gate for million-row, 100-way contention,
  multi-process worker, hot-tenant, 60-minute soak and recovery certification.

## TIP-023H enterprise-scale certification update

On 2026-08-04, the Owner authorized the final Enterprise Core scale gate and
automatic commit/push after closure.

- Deterministic fixture: 1,000,000 append-only ledger rows, 10,000 governed
  Missions and stable fingerprint `a845f683244c6249168797a290e06209`.
- Contention: 100 simultaneous logical writes through a 64-connection runtime
  pool retained exactly one command identity with zero rejected transaction.
- Hot tenant: 19,586 Organization A operations ran while Organization B
  observed zero foreign rows and retained 887 own probe writes.
- Workers: four independent OS processes completed 1,000 jobs exactly once,
  with 1,000 unique terminal events and no non-terminal job.
- Continuous soak: 3,601.03 seconds, 1,062,570 mixed operations, zero operation
  errors, 361 samples and maximum sample gap 11 seconds. Local observed p95 was
  10.92 ms and p99 15.44 ms; these are explicitly non-SLO values.
- Recovery: integrity-verified backup/restore preserved 1,000,000 ledger rows
  and 10,000 Missions; the real projection rebuild returned READY with 10,000
  Missions and a new watermark.
- A prior run was rejected because host sleep produced a 1,006-second gap. The
  certification harness now enforces continuity and uses a local power guard.

TIP-023H establishes local Enterprise Core certification only. Production
SLOs, cloud capacity, staging, production and public release remain separate
decisions.

## TIP-024A query-trust foundation update

On 2026-08-04, after reviewing the query-intelligence architecture of a
comparable enterprise project, the Owner authorized the next bounded local
step. TIP-024A introduces strict analyzer, trusted-scope, registry-candidate,
QueryPlan and golden-evaluation contracts. Analyzer output cannot select tenant
scope or permissions; unknown and ambiguous entities fail closed; every plan
is read-only/non-authoritative and requires authorization again at retrieval.

No provider API, persistent ontology, embedding index, reranker, answer
generator, independent answer verifier, cloud service or production accuracy
claim is included. The initial four-case fixture proves contract behavior only
and must not be represented as an enterprise benchmark.

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
