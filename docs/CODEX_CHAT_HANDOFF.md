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

## TIP-021C-B AWS managed staging update

On 2026-08-04, the Owner authorized AWS Singapore with a USD 20/month gross
ceiling. Managed staging is live at
`https://d366nm3yse819q.cloudfront.net` from immutable commit
`90b63a6b2b37c9f5420ea9f2f2201f12bf64d948`.

- Five consecutive external liveness/readiness samples passed `200/200`; root
  redirects to `/sign-in`, which returns 200.
- CloudFront is deployed with explicit IPv6-only origin connectivity. Caddy
  holds the origin certificate; the application container uses host networking
  to reach private IPv4 PostgreSQL and IPv6 AWS service endpoints.
- Managed PostgreSQL 16.14 is private with backup retention; `hiveos_app` is
  `NOSUPERUSER`, `NOCREATEDB`, `NOCREATEROLE`, `NOBYPASSRLS`.
- The runtime S3 credential passed put/head/get/delete with `AES256`; the bucket
  is private, versioned and lifecycle bounded.
- AWS Budget `hiveos-staging-monthly` is USD 20 with credits excluded.

Status is `READY_WITH_DEFERRED`, not production-ready. SES has no verified
identity, so email verification/recovery and authenticated onboarding remain
fail-closed. Authenticated cross-tenant smoke, constrained 30–60 minute soak,
managed backup/restore and projection rebuild remain TIP-021C-C work. See
`docs/verification/TIP-021C-B_MANAGED_STAGING_REPORT.md`.

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

## TIP-025 local mathematics pilot gate update

On 2026-09-28, the Owner authorized implementation of the pre-research math
pilot gate. The local implementation now retains a SHA-256-sealed problem
contract, two server-fixed known-answer calibration cases, model/Mission-bound
open-case gating, append-only independent human assessment, and an authoring
block until that assessment is recorded. The existing source-research worker
remains an evidence collector, not a general theorem prover.

Local verification: schema/migration and forced RLS PASS; 215 unit, 170 strict
integration, 102 E2E, typecheck, lint and production build PASS. The local
readiness command reports worker/provider UNVERIFIED and calibration NOT_RUN.
No live provider request or novel theorem claim is part of this closure. See
`docs/contractor/tips/TIP-025_MATH_PILOT_GATE.md`,
`docs/verification/TIP-025_MATH_PILOT_VERIFY_REPORT.md` and
`docs/operations/MATH_PILOT_LOCAL_RUNBOOK.md`.

## Local sign-in presentation and demo fixture (2026-09-28)

The Owner requested a premium mathematical sign-in screen and one-click local
test access. `/sign-in` now uses restrained graph/geometry linework, a bounded
form and the existing bilingual/appearance controls. A disposable demo login
is prefilled only when fixtures are explicitly enabled in development, the
request/auth origin is loopback and the database is `hiveos_dev`; staging and
production fail closed. The demo account and its own workspace are provisioned
explicitly with `npm run demo:provision`, then served with `npm run dev:demo`.
See `docs/identity/LOCAL_DEMO_LOGIN.md`. Desktop/mobile visual inspection,
one-click login, WCAG A/AA scan, typecheck, lint, unit and identity E2E passed.
The Owner then requested the sign-in preference toolbar be replaced by two
minimal upper-right controls: a VN/EN switch and an icon-only
system/light/dark cycle. The sign-in brand, form, and footer retain their
center axis; desktop/mobile alignment, bilingual behavior, appearance cycle,
WCAG A/AA, typecheck, lint, production build, and identity E2E passed.

## TIP-026 local math runtime accounting update (2026-09-28)

The Owner authorized a maximum of $20 for a future local live calibration but
reported no independent mathematical reviewer. No provider key, dedicated
worker, or enforceable hard USD stop is verified. Accordingly the Math Pilot
queue and worker dispatch now default closed, and the local readiness verdict
is `readyForLiveOpenProblem: false`. This is not a claim that the $20 cap can
currently be enforced, and no paid API request was made.

The local runtime now retains verified Responses usage in the research run and
durable job, bounds output tokens and hosted-tool calls, rejects incomplete or
model-mismatched results, and uses an immutable dispatch fence plus terminal
failure handling to prevent automatic replay of an ambiguous paid request.
OpenAI math assessment requires matching retained usage; source review and
independent mathematical assessment remain separate. The UI shows usage or
an explicit unverified state and disables calibration dispatch while closed.

The new migrations were applied to the local development and isolated test
databases. Verification: 219 unit, 174 strict integration and 102 browser E2E
tests, typecheck, lint and production build PASS. A dev server that still held
the old Prisma Client briefly showed an error on the user's Math Pilot tab;
restarting only `dev:demo` on port 3000 resolved it, and the authenticated
page was checked again. See `docs/contractor/tips/TIP-026_MATH_PILOT_RUNTIME_ACCOUNTING.md`
and `docs/verification/TIP-026_MATH_PILOT_RUNTIME_ACCOUNTING_VERIFY_REPORT.md`.

## TIP-027 local Codex mathematics bridge (2026-09-28)

The Owner requested a real browser-to-LLM acceptance run using the Codex
subscription on this machine instead of a separately billed API request.
Local-only `codex-local` routes sealed Math Pilot cases to a distinct durable
job and operator-started worker. The worker confirms ChatGPT login, invokes
Codex CLI with an ephemeral read-only workspace and allowlisted environment,
and retains the model-authored math attempt, token counts and SHA-256 digest.
This mode is not a production API or independent mathematical verifier.

Two fixed calibrations completed through the UI and worker: an even-square
proof attempt and the counterexample `2` to “every prime is odd.” Both remain
`AWAITING_REVIEW`. The Owner has not identified a distinct mathematical
reviewer, so neither was marked passed and the open-problem gate stayed locked.
One initial login-status parsing failure is preserved as a terminal failed
dossier, not overwritten or automatically replayed. No paid API call was made.

Verification: 222 unit, 175 strict integration, 102 browser E2E, typecheck,
lint and production build PASS. The local readiness preflight confirms the
Codex migration and ChatGPT login but still reports no live-open-problem
certification. See `docs/contractor/tips/TIP-027_LOCAL_CODEX_MATH_BRIDGE.md`,
`docs/verification/TIP-027_LOCAL_CODEX_MATH_BRIDGE_VERIFY_REPORT.md`, and
`docs/operations/MATH_PILOT_LOCAL_RUNBOOK.md`.

## TIP-028 integrated mathematical review desk (2026-09-28)

The Owner requested that review, evaluation and acceptance be embedded in the
mathematical discovery procedure. The Math Pilot dossier now presents a
three-stage in-place workflow: sealed statement/boundaries, source/finding
review, then a five-criterion independent mathematics ledger and conclusion.
The source review remains distinct from mathematical assessment. A positive
conclusion requires all five checks marked verified with individual notes and
an explicit human attestation; the append-only ledger has its own SHA-256
digest. Calibration and authoring import reject a missing or corrupted ledger.
The authoring evidence section also carries the review conclusion/rationale,
independent-check notes and ledger digest, explicitly refusing to frame
partial or inconclusive progress as an accepted theorem.
The requester cannot review their own case and sees a route to member
management instead of approval controls.

The local migration has been applied; the two actual Codex calibrations are
still `AWAITING_REVIEW`, as no independent reviewer has been identified. No
scientific sign-off was fabricated. See `docs/contractor/tips/TIP-028_MATH_REVIEW_DESK.md`
and `docs/verification/TIP-028_MATH_REVIEW_DESK_VERIFY_REPORT.md`.

## TIP-029 autonomous mathematical peer review (2026-09-28)

The Owner clarified that HIVE OS should maximize AI-native operation rather
than require a second human account for every research iteration. Local
Codex-backed Math Pilot attempts now automatically enter a durable,
role-separated AI review: a critic and an adversary run in fresh contexts,
retain exact quotes/checks/gaps/session usage, and write an immutable,
digest-bound review ledger. Historical completed attempts can be requested
once from the dossier. This AI lane does not impersonate the existing human
review desk. The two sealed elementary calibrations passed a narrow
deterministic witness check plus both AI roles, unlocking a local open case.

An actual browser-submitted Erdős–Straus case produced a partial construction
for even `n`, multiples of three and `n ≡ 3 (mod 4)`. Both AI roles retained
the uncovered classes; the system recorded `INCONCLUSIVE`, not a solved
theorem. AI-reviewed material can enter Authoring only with an explicit AI
label and review digest; no external citation or finding is fabricated. The
ordinary source-approved import contract remains stricter. The local
`ResearchRun` statuses remain `AWAITING_REVIEW` because no human approval was
manufactured. Billing, Git and deployment remain paused. Readiness continues
to say `RETAINED_NOT_CERTIFIED`/`readyForLiveOpenProblem: false`.

See `docs/contractor/tips/TIP-029_AUTONOMOUS_MATH_REVIEW.md`,
`docs/verification/TIP-029_AUTONOMOUS_MATH_REVIEW_VERIFY_REPORT.md`, and
`docs/operations/MATH_PILOT_LOCAL_RUNBOOK.md`. This is one bounded
AI-native research/review cycle, not an indefinitely autonomous theorem
prover or independent scientific certification.

## TIP-030 controlled mathematics research loop (2026-09-28)

The Owner prioritized AI-generated hypotheses and new research tasks from
retained critique gaps, with resource bounds and separate verification. Local
TIP-030 adds one linked cycle per integrity-valid OPEN case. Each round uses a
fresh Codex planner, separate task verifier, solver, critic and adversary.
Deterministic checks bind an exact recorded gap, reject duplicate tasks and
distinct-context violations, and prevent a rejected task from reaching the
solver. Root case, attempt and review digests remain fixed. Each call is
reserved before execution; every result/usage is retained in an append-only,
SHA-256-chained RLS ledger. At most two rounds and five model calls per round
are possible; the operator selects an observed-token threshold. A deadline
is checked before each call and each Codex call has a four-minute timeout.
An interrupted or ambiguous call is terminal, not automatically replayed.

The Math Pilot dossier now shows the bounded loop, event trace and stop
reason. Separate sessions of the same model are procedural verification, not
an independent human/model proof check. The token threshold and deadline can
be exceeded by an in-flight call; they are not hard USD budget controls.
No open result is automatically certified or imported as established truth.
Billing, Git and deployment remain paused. See
`docs/contractor/tips/TIP-030_CONTROLLED_MATH_RESEARCH_LOOP.md` and
`docs/operations/MATH_PILOT_LOCAL_RUNBOOK.md`.

Live local acceptance used the existing authenticated Erdős–Straus case with
one round and a 60,000 observed-token threshold. Planner, independent-context
verifier, solver and critic ran. The verifier accepted a narrower task about
`n ≡ 5 (mod 12)`; the resulting model argument is only a proof attempt.
Observed usage reached 66,939 after four calls, so the worker did not launch
the adversary call. The cycle is `STOPPED / TOKEN_LIMIT`, with zero fully
reviewed rounds. This is an intentional fail-closed boundary, not a completed
live mathematical review. Full fake-adapter iteration and rejection tests
passed. See `docs/verification/TIP-030_CONTROLLED_MATH_RESEARCH_LOOP_VERIFY_REPORT.md`.

## TIP-031 prior-art correction (2026-09-28)

The first live cycle's `n ≡ 5 (mod 12)` task was a false research gap: that
class is already contained in the known `n ≡ 2 (mod 3)` identity. TIP-031 adds
a small source-bound prior-art catalog, gives it to the planner and verifier,
records it in each new round's digest-chained trace, and mechanically rejects
explicitly targeted congruence classes already covered by the catalog before
solver dispatch. The Math Pilot dossier marks the old task retrospectively;
the historical ledger and terminal cycle remain untouched. Catalog coverage
is partial, and novelty outside it is unverified. See
`docs/contractor/tips/TIP-031_MATH_PRIOR_ART_GATE.md`.

## TIP-032 frontier-source gate (2026-09-28)

The Owner authorized immediate local implementation of the next chief-architect
priority. New controlled Math Pilot cycles now capture a problem-scoped,
SHA-256-bound primary-passage dossier and bounded Crossref bibliographic leads.
Two fresh Codex contexts challenge relevance, quantifier scope and known-result
overlap before the task verifier or solver can run. The deterministic gate
distinguishes `KNOWN`, `HOLD` and `RESEARCH_ONLY`; the last permits only bounded
exploration and is not a novelty certificate. Missing/corrupt sources,
unavailable discovery and source-agent disagreement hold. Seven model calls per
round are now reserved; existing five-call cycles remain immutable. The UI
shows the retained evidence and gate state. The initial primary-source corpus
is Erdős–Straus-specific, and Crossref provides discovery metadata only, not
full-text proof. See `docs/contractor/tips/TIP-032_MATH_FRONTIER_DOSSIER.md`
and its verify report. No billing, paid API, Git or deployment work is included.

## Local exact-certificate research milestone (2026-09-28)

After TIP-032, the Math Pilot gained optional typed Erdős–Straus witness tuples,
an exact BigInt identity checker, and a digest-chained `CERTIFICATE_CHECKED`
cycle event whose contents are recomputed during trace validation. Historical
attempts and cycles without these optional fields/events remain readable. The
prior-art gate now recognizes a prime-residual Erdős–Straus contract as well
as the original all-integer wording. A separate bounded residual-prime survey
and stdlib-only Python audit create reproducible computational evidence; they
are not a proof kernel or a literature novelty certificate.

The survey verified finite witnesses for all 3,426 primes `p ≡ 1 (mod 840)`
through `10^7` with `x=(p+A)/4` and some `A≤47`. It then falsified the
*auxiliary* universal bound `A≤47`: prime `p=10,051,441` has no admissible
factor pair for any `A=3,7,…,47`, but has an exact solution at `A=59`.
`p=16,467,361` likewise fails through `A=47` and succeeds at `A=55`.
These are not counterexamples to Erdős–Straus itself and no novelty claim is
made. See `docs/operations/MATH_PILOT_MILESTONE_2026-09-28.md` for method,
manifests, independent checks and exact tuples.

A live local browser case (`406a9816-ebe2-45f7-945d-00daa75d4758`) showed
an `EXACT_IDENTITY` tuple for `p=2521` while AI review remained
`INCONCLUSIVE` on the universal bound. Its controlled cycle
(`611e2e2d-54e8-4e45-b631-9792445b4e63`) independently selected precisely
the `10^7<p≤2·10^7` finite interval but, lacking an exact computation tool,
returned `INCONCLUSIVE` with an empty certificate event. That is a key
procedural gap: the next priority is a typed, bounded computation plan,
deterministic oracle execution and digest-checked evidence *inside* the
agent loop before solver/critic calls. Do not alter the immutable live cycle.
The local worker was stopped after testing; the web UI remains available with
Codex dossiers visible but new queue dispatch disabled. Billing, paid API,
Git/push and deployment remain paused unless separately requested.

## Bounded in-loop computation and 100-million milestone (2026-09-28)

The prior live E2E exposed an LLM-only loop: the planner selected the correct
finite interval but the solver could not execute exact arithmetic. New
Erdős–Straus cycle proposals may now contain a typed, resource-capped residual
survey plan. The independent task verifier sees the plan; the kernel runs a
fixed no-model-code computation before solver dispatch, retains `COMPUTED` in
the hash-chain ledger, and supplies the scoped evidence to solver and both
review roles. Trace validation recomputes the computation. Earlier immutable
cycles are unchanged. This new path has unit/integration/build verification
but has not yet been run with a fresh subscription-backed browser cycle; do not
claim fresh live E2E closure from the old cycle.

The exact standalone scan through `10^8` covered 30,061 primes `p≡1 mod 840`;
all had a witness in the declared first-denominator family by `A≤59`. Seven
failed the narrower `A≤47` bound, and the independent Python factor-pair
auditor reproduced their first successful A values (`59,55,59,55,55,51,55`)
in ascending prime order. A separate Python sieve reproduced the prime count.
This is a finite computational milestone, not a theorem about unbounded p, a
novelty finding, or an independent full-range audit. The detailed evidence,
manifests and remaining proof gates are in
`docs/operations/MATH_PILOT_MILESTONE_2026-09-28.md`. Billing, paid API and
deployment remain paused. The user subsequently authorized a reviewed local
UI refinement followed by commit and push of this Math Pilot work; that does
not authorize deployment or billing activation.

## Per-A audit browser E2E follow-up (2026-09-28)

A fresh browser-created A≤59 case and seven-call Codex-local cycle now retain
an optional, replay-validated per-A exclusion audit for the first survey
failure. The new arithmetic path checks `p=171348241` for primality by trial
division through 13090 and enumerates all factor pairs separately for each of
the 15 A values; an external Python implementation reproduces all counts and
the full interval result (5,483 eligible primes, one bounded-family failure).
Historical V2 events remain immutable and readable; subsequent V3 writes
require the audit for a failure and reject an audit-stripping downgrade. The
V3 path is unit-tested but has not had its own live browser cycle. Both tool-free AI review
contexts still returned `INCONCLUSIVE`, because they could not themselves
execute the primality/congruence replay. This is a review-tooling gap, not a
general Erdős–Straus counterexample. The next procedure should retain a
separate executable read-only verification result before AI classification;
never promote finite evidence or same-model agreement to theorem status.
See `docs/operations/MATH_PILOT_AUDIT_E2E_2026-09-28.md`. The local worker
was stopped and browser queue dispatch should remain disabled between tests.

## Independent executable replay and structural baseline (2026-09-29)

The Owner prioritized a tool-running independent verifier before further
mathematical conclusions, then proof and literature comparison for a general
structural claim. New V3 residual cycles now execute two fixed, read-only,
stdlib-only Python tools between `COMPUTED` and `SOLVER`: a full per-prime
interval replay and, on the first failure, a separate per-A primality/factor
audit. A digest-chained `INDEPENDENT_REPLAY` event records the program/output
hashes and comparison report. Any mismatch stops the round. Historical V2
cycles remain unchanged; the new path has local tool/unit verification, not a
fresh browser E2E cycle yet.

The fixed first-denominator divisor criterion and its exact A=3 prime-factor
classification were proved in the local research note and checked against
Bradford (2025) and the existing prior-art catalog. They are known structural
facts, not a novel theorem or resolution of the surviving classes. No new
general claim has passed proof plus literature comparison. See
`docs/operations/MATH_PILOT_INDEPENDENT_REPLAY_AND_STRUCTURE_2026-09-29.md`.

## Human-steered A=11 research check (2026-09-29)

The Owner confirmed the breakthrough objective and authorized one local
human-steered structural campaign at A=11, using the Codex subscription
worker rather than a paid provider API. The authenticated browser submitted
the direction and the event ledger sealed it as `HUMAN_STEERED`. Cycle
`e5dc2208-59d6-4a0c-be20-97b5ebf9e11e` stopped after four model calls
(`77,532` observed tokens) with `VERIFICATION_REJECTED`, before solver or
peer-review dispatch. The independent task verifier found that the proposed
implication did not close its copied gap. There is no new theorem or
breakthrough from this attempt.

The run exposed a stronger planning defect: its naive universal A=11
implication is already contradicted by the prior independently replayed
finite exclusion at prime `10,051,441`, which fails all A≤47 yet has a witness
at A=59. The prior result was in an immutable earlier cycle but reached the
planner only as a task string, not as a checked counterexample constraint.
The local procedure now extracts only independently replayed, complete
per-A exclusions from validated prior traces, retains their source/replay
digests as a `PRIOR_FINDINGS` event, presents them to the next planner and
verifier, uses the latest closed-round gap instead of the stale root gap, and
rejects the bare universal two-gate implication known to be false. This
protects future planning; it does not retroactively alter either cycle. No
follow-up campaign was launched
without a new human direction, and no novelty or theorem status was assigned.

## Open-root structural campaign and scope-gate correction (2026-09-29)

The Owner asked Codex to continue reasonably after the A=11 rejection.
One authenticated browser campaign was started on the *unrestricted*
prime-residual Erdős–Straus root. Cycle
`441df339-1c66-430c-a84b-aedd97d26aa6` stopped at `KNOWN_SCOPE` after one
planner call (19,660 observed subscription-session tokens). Its proposed
`p≡-1 (mod 11)` construction is an elementary fixed-A identity; it does not
advance the hard two-gate survivors or settle the root conjecture. The gate's
recorded reason incorrectly matched an A=3 *premise* as if it covered the A=11
conclusion. A local code correction now prevents this single-gate false-positive
and explicitly steers future planner/verifier roles away from the trivial
`p≡-1 (mod A)` family. Historical events were not altered. A new campaign was
not auto-launched. See
`docs/operations/MATH_PILOT_OPEN_ROOT_CAMPAIGN_2026-09-29.md` for exact digest,
evidence and the cross-case provenance limitation identified at that point.

## Open-root follow-up and square-lemma falsification (2026-09-29)

The Owner then asked to continue. A second authenticated browser campaign on
the unrestricted prime-residual root, cycle
`79a347a3-572b-46fc-98d0-627b807555a0`, demonstrated scoped cross-case
transfer of an independently replayed finite finding in `PRIOR_FINDINGS`:
`p=10051441` fails A≤47 but succeeds at A=59. This closes the specific
cross-case provenance limitation noted above; only finite evidence transfers,
not the other root's universal claim.

The new planner's conditional A=11 square lemma was *falsified*, not proved:
`p=131041` satisfies its square and divisor premises yet fails its A=11
conclusion. A separate stdlib Python audit proves primality by trial division
and exhausts factor pairs at A=3,7,11,15,19,23; the first success in the
declared family is A=23, with an exact three-denominator witness. The in-cycle
critic remained `INCONCLUSIVE` pending executable primality replay, and the
cycle stopped after 6/7 calls at `TOKEN_LIMIT` (129,256 observed subscription
tokens) before the adversary. The outside-cycle arithmetic check does not
rewrite that verdict. This is not a counterexample to Erdős–Straus, nor a
new unbounded theorem or demonstrated research breakthrough.

Current procedure gives the task verifier the source assessors' warnings and
rejects new success identities using the wrong first denominator. Historical
ledger validation deliberately does not reapply these evolving admission
rules; a browser-discovered backward-compatibility defect was repaired and
regression-tested. The next gate is a typed in-loop executable certificate
for structural counterexamples, followed by a new, explicitly scoped
survivor-class lemma and primary-literature comparison. Do not auto-promote
the outside-cycle audit or launch another campaign without a reviewed
direction. See `docs/operations/MATH_PILOT_OPEN_ROOT_CAMPAIGN_2026-09-29.md`.

## Typed structural counterexample replay in the agent loop (2026-09-29)

The Owner explicitly authorized this next gate and a different follow-up
structural hypothesis. A solver can now submit a typed residual-prime candidate
`{prime, failedThroughA}`. Before either AI review role is called, the cycle
checks primality and every fixed-A factor pair through the declared gate in
TypeScript, then replays the same exclusion using a digest-pinned, read-only,
stdlib Python program. The resulting `COUNTEREXAMPLE_REPLAY` event binds the
candidate, per-A rows, script/output digests, and checked square/divisor facts
into the append-only cycle chain. A missing typed candidate on a human-steered
structural `COUNTEREXAMPLE_ATTEMPT`, a mismatched target A, or a failed replay
stops with `COUNTEREXAMPLE_REJECTED` before critic/adversary classification.
Historical cycles remain readable and are not relabeled. A PASS only certifies
the declared finite first-denominator gates; the AI must still assess the
natural-language premise, scope, and literature.

Unit and integration fixtures verify `p=131041` fails A=3,7,11, including its
square/early-divisor premises, and verify that a false claim of failure through
A=23 is stopped before AI review. A validated replay can become a typed
`PRIOR_FINDINGS` constraint for later planner/verifier calls. These fixtures are
not a live scientific result. See
`docs/operations/MATH_PILOT_STRUCTURAL_COUNTEREXAMPLE_2026-09-29.md` for the
live browser campaign outcome and limitations.

The in-loop path also accepts an operator-selected *prior* `{prime,
failedThroughA}` seed for a later target A. Before any planner call, the cycle
recomputes and Python-replays the candidate, records
`PRIOR_COUNTEREXAMPLE_REPLAY` in its sealed event chain, and stops if the
replay fails. The planner and verifier receive only the verified finite facts,
including the square/early-divisor flags. This prevents a model from silently
reusing the falsified A=11 implication while the new A=23 campaign is framed.
The first live seeded A=23 campaign, cycle
`76075d43-9abb-4130-a8ba-d1320093c6aa`, recorded the replay PASS before
planner dispatch but stopped at `VERIFICATION_REJECTED`: a prime-power variant
again omitted the A=11,15,19 hard-survivor gates. Subsequent structural tasks
must explicitly name every intervening gate from the replayed bound to the
new target; this admission rule is regression-tested. No theorem resulted.
The second seeded cycle `594819fe-309a-4dca-b329-750dcdc26370` passed task
verification with a different five-gate A=23 conditional but yielded only a
partial solver attempt. An exact A=23 witness for `p=2521` was checked, yet
that prime lacks the complete premise; critic returned `INCONCLUSIVE`, and
the 120,000-token gate stopped the cycle before adversary review. A separate
tool audit shows `p=131041` is a complete finite premise instance with A=23
success, but this was not in the sealed cycle's reviewer evidence and cannot
rewrite its verdict. Next methodology work should pass a fuller typed gate
dossier into the agents before reattempting this specific conditional.

## A=23 full-gate dossier and conditional refutations (2026-09-29)

The local agent loop now seals `PRIOR_GATE_DOSSIER` before planning when an
operator's independently replayed prime first succeeds at the selected later
A gate. It includes every preceding failed gate with factorization and an
exact target witness, and is supplied to planner, task verifier, solver and
both peer reviewers. A DB migration raised the bounded observed-token
threshold to 200,000 so all seven calls could complete; it is not a USD cap.

Authenticated browser cycle `28a2b908-493f-4d2a-b462-7e641f9a2162` sealed
the `p=131041` dossier through A=23, then completed seven calls and both
reviewers. It stopped at `ROUND_LIMIT` with one `INCONCLUSIVE` round and
138,626 observed subscription-session tokens. The local worker was stopped
after testing. This proves E2E procedure closure, not a new theorem.

Separate exact TS and pinned Python checks found `p=4037881` prime,
`p≡1 mod 840`, and all A=3,7,11,15,19,23 gates obstructed; its first
fixed-family success is A=27. It satisfies every extra x15/x19 divisor
premise of the previous conditional (739 and 1355 are the required divisors),
so that auxiliary A=23 implication is false. An exploratory scan through
10^8 found 42 complete-premise primes and seven such refutations; the Python
auditor replayed all seven. The same p is `1 mod 23`, refuting the new
planner's different claim that A=23 obstruction after five failed gates
forces `p≡4 mod 23`. The live agent verdict remains historically
`INCONCLUSIVE`; neither review role had a proposal-time executable
falsification tool. Next priority: a typed, bounded counterexample probe
before task acceptance, with independent replay and no universal inference
from finite search. See
`docs/operations/MATH_PILOT_A23_GATE_DOSSIER_2026-09-29.md`.

## Proposal-time structural falsification update (2026-09-29)

The next local method upgrade adds an optional historical-compatible, typed
`structuralProbePlan` to new Math Pilot proposals. New subscription-backed
human-steered structural proposals must supply a supported plan; an explicit
`null` stops at `STRUCTURAL_PROBE_HOLD`. Before source/verifier/solver calls, the fixed tool scans
`p≡1 (mod 840)` through a capped `10^7` ceiling and independently replays any
first counterexample using the existing digest-pinned Python factor-pair
auditor. `STRUCTURAL_PROBED` is sealed into the cycle ledger; a refutation
stops at `STRUCTURAL_REFUTED`. Absence within the bound is explicitly not a
proof, and the task verifier must still compare typed and prose claims.
Local fixtures found the first residue refutation at `p=99961` and the
cross-gate divisor-condition refutation at `p=4037881` (witness divisors
`739`, `1355`). Historical cycles are not relabeled. See
`docs/operations/MATH_PILOT_PROPOSAL_FALSIFICATION_2026-09-29.md`.

## Known-answer proof benchmark lane (2026-09-29)

After an authenticated browser run of IMO 1988 Problem 6 produced a complete
Vieta-descent attempt and two supportive AI reviews, the Owner asked for the
next implementation and commit/push. The historical case remains `OPEN` /
`PARTIAL`; it was not rewritten. A prospective `BENCHMARK_PROOF` type now has
a fixed sealed contract, a review-only holdout reference/rubric, distinct UI,
and an AI-supported positive classification only when both fresh role reports
align, quote the attempt, and leave no gap. This is not a formal checker or a
novel discovery. A local negative-control argument based on finite enumeration
was challenged by both Codex-local review contexts. Unit/integration suites,
typecheck and build passed; the browser showed the new section while live
dispatch remained disabled. A fresh browser-submitted benchmark run and formal
replay of its generated proof remain open gates. Details and evidence boundary:
`docs/operations/MATH_PILOT_IMO1988Q6_BENCHMARK_2026-09-29.md`.

## TIP-033 mathematical research kernel v2 foundation (2026-09-29)

The Owner requested the AI-native method upgrade and LaTeX UI. A read-only
proof-obligation DAG now projects gap, claim, falsification, proof and prior-art
work from integrity-valid cycles; its state vocabulary never promotes AI review
or finite computation to theorem status. Planner/verifier contexts receive
bounded prior-obligation memory, and an exact normalized hypothesis repeat
stops before further source/solver calls. Math Pilot renders explicit TeX in
statements and retained attempts/reviews with safe source fallback; the sealed
text and historical digests are unchanged. A separate display formula for the
IMO benchmark does not modify its contract. No paid API or new live research
cycle was launched. Lean formal replay, semantic formalization alignment,
independent-model provenance and a multi-branch scheduler remain explicit open
gates in `docs/contractor/tips/TIP-033_MATH_RESEARCH_KERNEL_V2.md`.
Local evidence and open verification gates are in
`docs/verification/TIP-033_MATH_RESEARCH_KERNEL_V2_VERIFY_REPORT.md`.

The Owner next requested complete Math Pilot UI typography for archived
records. A display-only, conservative legacy notation adapter now typesets
bounded ASCII/Unicode equations in historical statements, proofs and reviews,
and main/cycle attempts expose their untouched sealed source in place. No
research record, digest or gate was changed. Unit (282), strict integration
(176), typecheck, lint, production build and isolated Math Pilot browser E2E
(2/2) passed; the live
authenticated browser showed the old IMO proof typeset and no 320px document
overflow. Unsupported notation remains verbatim rather than guessed.

## Public exact benchmark numerical addendum (2026-09-30)

The regular-101-gon public sample now has a digest-pinned, outward-rounded
integer-interval program. A fresh browser solver attempt timed out at its
240-second local Codex ceiling and remained `FAILED` (no retry, no claim of
benchmark success). Instead, an operator-requested, no-LLM worker job ran the
fixed program in an isolated Python container and attached an append-only,
case-bound certificate to the earlier sealed attempt with answer `4771880153`.
The authenticated Math Pilot UI displays the unique floor and full bounds.
The prior AI review remains `INCONCLUSIVE`; numerical closure is not a proof
of the geometric reduction, a blind score, or human sign-off. The local
worker was stopped after E2E; the web UI remains on port 3001. See
`docs/operations/MATH_PILOT_101GON_INTERVAL_CERTIFICATE_2026-09-30.md`.

## Bounded Lean formal-check gate (2026-09-30)

The local Math Pilot now offers a contract-bound formal attempt for the
even-square calibration and IMO 1988 Problem 6. A fresh Codex-local session
may supply Lean tactics, but cannot edit the trusted theorem declaration.
A digest-pinned Lean 4.10 container compiles the candidate in isolation and
audits transitive axioms. One bounded repair round may use sanitized compiler
feedback; every checked candidate is retained in an append-only trace. The
record is bound to the sealed contract, original model attempt, research
dossier, source and checker output; the UI shows the theorem, mapping, trace
count and digests. A dead-lettered job may be requested once more explicitly.

The authenticated browser smoke on the even-square calibration completed with
two checks and status `KERNEL_ACCEPTED_ALIGNMENT_PENDING`. This is **not**
formal certification of the informal problem, nor a research breakthrough or
benchmark pass. Independent statement alignment, a separately validated
checker replay, held-out benchmark scoring and broader open-problem lemma
formalization remain open. The web UI and research worker were restarted for
local testing on port 3001 after the production build. See
`docs/operations/MATH_PILOT_FORMAL_GATE_2026-09-30.md`.

## Fresh checker replay and operator alignment (2026-09-30)

The local formal pilot now has a second, operator-requested job that recompiles
the exact sealed Lean source and runs a separately built official
`lean4checker --fresh` at pinned Lean 4.10 commit in an immutable, no-network
container. The authenticated local browser run on the sealed even-square case
completed `REPLAY_ACCEPTED` with replay digest
`abdd57b971d1ed0a5811c8ba0e3a80d29fb0f4a23b7ff0495f1e5f779905c04d`.
The append-only replay record binds primary check, target, source,
checker image ID and output; read-time digest validation rejects tampering.
This is a fresh execution of the **same Lean kernel**, not validation by an
independent foundational system. A four-part, research-reviewer-operated
semantic-alignment checklist can then be stored with its own immutable digest
and audit event. The operator may report aligned, issue found, or unresolved;
the UI never promotes any of these to theorem/benchmark status. Tests include
container replay and transactional audit/immutability checks. The live
calibration still needs a human operator's own review before that particular
case has alignment evidence. Held-out suite,
distinct-model provenance, bounded portfolio, open-problem lemma proof, and
expert publication review remain open.

## Bounded portfolio browser E2E (2026-09-30)

The Owner requested the next proposed live local test. Math Pilot now exposes
an autonomous two-round portfolio launch on Erdős–Straus OPEN cases while
retaining the separate human-steered A-gate mode. The first sealed case
`2c110775-b7ca-4fc9-ab11-042f6aebe4af` stopped `MODEL_FAILURE` before
branch selection: the local Codex planner supplied an out-of-domain survey
bound and an inconsistent typed structural probe. That failed ledger remains
unchanged. The planner's structured-output domain and prompt were tightened,
and safe schema-path diagnostics were added without logging model text or
credentials. A fresh isolated planner check then produced two admissible
branches.

A second browser-created case for the same prime-residual question,
`8848a094-de78-43e6-9eea-557546504579`, completed root AI review and a
two-round portfolio cycle `4d8662f9-5abc-4e21-8033-271311cf124d`.
Portfolio digest:
`4cc04b5b817ec47db3e91b7cbe8a1ffffdca0dfc770c368ace51afb9be98c76f`.
The finite-falsification branch was `PRUNED` by the deterministic task-binding
check before its survey ran; the second, structural-lemma branch ended
`INCONCLUSIVE`. A separate exact counterexample-replay tool verified that
prime `7561` fails the A=3 first-denominator gate; a positive A=19 witness
was independently checked by exact integer arithmetic. Neither observation
proves the proposed universal A bound or the root conjecture. The cycle
stopped `ROUND_LIMIT` after 2/2 rounds, 10/14 started calls and 193,183 / 200,000
observed Codex-session tokens. The local worker was stopped with no research
job pending; the authenticated UI remains available on port 3001. A future
held-out theorem benchmark, genuine independent-model provenance, and a
general structural proof are still open gates. These live records are local
test evidence, not publication or deployment approval. No billing API was
used and no commit or push was requested in this turn.

## Erdős 242 strict replay and exact A=11 structure (2026-10-01)

The Owner selected Epoch's Erdős 242 and authorized continued local research.
Its public contract requires `n>2` and strictly distinct `x<y<z`; the older
local identity checker is retained separately. A new strict checker and
independent Python prime-sieve/positive-witness replay confirm 57,840 strict
tuples for all residual primes `p≡1 mod840` through `2·10^8`, with `A≤63` in
the fixed-first-denominator family. The auxiliary `A≤59` universal assertion
is already refuted at `p=171348241`, whose first recorded rescue is A=63.
These are finite method results, not a new verification record or an official
Epoch benchmark score. See `MATH_PILOT_ERDOS242_STRICT_2026-10-01.md`.

Continued work proved a complete unbounded **fixed-A=11** obstruction
classification on the residual-prime domain: pure quadratic splitting or an
explicit thin primitive-factor packet. The signed-exponent criterion uses
all factors of `B=px`, including p; an x-only criterion covers Type II only.
An explicit Type I construction rescues the thin packets with two same-
orientation nonresidue units. Independent TS residue-path and Python full
factor-pair programs agree on all 57,840 primes, with common manifest
`ec682c2652a0b82bd12c3ac41ff95cd16f7e0f3a60de2085fb189e5855d52cdc`.
Among the 16,495 A=3,7 survivors, A=11 opens for 10,404 (195 via Type I
rescue); 6,091 divide into 4,865 pure-QR and 1,226 thin obstructions.
The full survey already included Type I; this is a structural explanation,
not repair of previously omitted witnesses.

The 648 saturation-capped cyclic-group profiles were checked in Lean 4.10
by `decide`, with no axiom dependency, and recompiled/replayed by pinned
`lean4checker --fresh`. Only that **finite-group sublemma** is formalized;
the factorization bridge and unbounded prime theorem have the written proof
in `docs/operations/MATH_PILOT_A11_EXACT_STRUCTURE_2026-10-01.md`.
The surrounding divisor framework is established prior art, and a public
Type-II q=11 research note overlaps the x-only classification; no novelty
or root-conjecture solution is claimed. Local 309 unit tests, typecheck and
lint passed. No new browser/agent campaign, paid API, schema change, commit,
push or deployment occurred. The new classifier is a reusable local module;
it has not been attached as an authoritative event to an agent-cycle ledger.
The next mathematical target is coupling these exact A=11 survivor types
with later shifts, especially A=19 where 5 divides the fixed denominator,
under proposal-time exact falsification and primary-source comparison.

## A=19 obstruction frontier and Kneser packet bound (2026-10-01)

The Owner requested continued attack on the same local Erdős 242 target.
The fixed A=19 gate now has a written unbounded classification by twelve
maximal signed-exponent boxes in C18, using every factor of B=p(p+19)/4.
The forced factor 5 supplies a primitive even-log unit. The capped closed
downset has 230 profiles and 2,070 distinct coordinate-boundary checks.
A separate written Kneser argument proves that every mixed obstruction has
at most seven nonidentity-log valuation units; factors 1 mod19 remain
unrestricted. The corresponding prime-half-order argument yields the
necessary nine-unit bound at A=23. A fixed Python group replay checks all
closed capped profiles in C10/C18/C22 (8/230/6,562), including trivial
stabilizers and the cardinality inequalities; this is not a root proof.

Independent TS residue-path and Python B²-divisor programs agree on all
57,840 primes through 200 million, with manifest
`263965fa2e00035c61408848ca781cd20fed3fa26eb41b12d5d420b8a7f6a5c4`.
Of the 6,091 A=3,7,11 survivors, A=15 opens for 2,555. Of the remaining
3,536, A=19 opens for 2,031 (185 Type I rescues); 1,505 remain, comprising
1,090 pure-QR and 415 mixed A19 obstructions. These explain the earlier
finite survey, not new coverage. Prime 2521 independently fails all five
gates through A=19; prime 47041 first succeeds at A=19 via Type I. The
hard prime 171348241 is exactly A19 box 1 and still needs A=63 in the
existing full-family finite replay. A small packet is not a universal A bound.

The full Lean boundary proof exceeded the unchanged container resources:
several 180-second timeouts and a compact attempt killed with exit 137.
Its `finiteCertificate` definition remains as an explicit open obligation.
Three smaller source theorems check the 12 maximal misses, 30 minimal hits
and nine caps; the primary Lean compiler accepted these with only the
standard `propext` axiom dependency (not axiom-free, no sorry/user axioms).
The exact source was recompiled and `lean4checker --fresh` accepted it,
exit 0 with `HIVEOS_A19_FRESH_REPLAY_OK`; both executions use the same
Lean kernel, not independent foundations. Source SHA-256:
`f76520ffcb8e8e94cd357061a3ac601333b888dfc667e9eed3cd8ebac1558684`.
Factorization, full coverage, Kneser reasoning, semantic alignment and
publication/novelty acceptance are not all formalized or certified.

The new module and scripts are standalone local research tools, not an
authoritative event in a browser agent-cycle ledger. No historical case
was rewritten; no paid API, schema change, push or deployment occurred.
All 312 unit tests passed on the final rerun; an earlier concurrent run
timed out in the existing 5-second large-interval test without a code change
to that scenario. Typecheck, lint and diff checks passed. See
`docs/operations/MATH_PILOT_A19_OBSTRUCTION_FRONTIER_2026-10-01.md`.
Next scientific obligation: a cross-shift statement about the exact packet
and unrestricted neutral-factor classes, preflighted against retained hard
exclusions, not another unsupported universal small-A rescue assertion.

## Neutral cross-shift barrier and adaptive Type II experiment (2026-10-01)

The Owner authorized continued attack on the same Erdős 242 target. A written
elementary implication now explains simultaneous closed gates: for any finite
shift set S, take L=lcm(840,{A(A+1):A in S}), p=Lt+1, and
Q_A=L/(A+1)t+1. If p and every Q_A are prime (or each Q_A has only neutral
prime factors 1 mod A), then x_A=((A+1)/4)Q_A and all declared full Type I/II
gates close. Reducing a hypothetical B² divisor to a core divisor and its
complement yields 0<h+core<=2core<A, a contradiction. This general implication
is a written proof, not a Lean theorem or a novelty certificate.

The forms are admissible since t=0 mod every prime makes each form 1.
**Only assuming Dickson's prime-tuples conjecture** does this supply infinitely
many residual primes missing any fixed finite shift menu. An analogous
construction with L_J=lcm(840,{4u(a+u):coprime a,u<=J}) gives
ap+u=(a+u)Q_(a,u), with Q_(a,u) neutral mod4au and a+u<4au-1. Under Dickson,
every fixed modulator box is also blind infinitely often. Neither statement
is an unconditional infinitude result, root refutation, or proof that an
adaptive search succeeds. At J=8 the abstract family has L_J=1441440 and
44 distinct forms; no all-prime member was produced. The A<=63 family has
17 forms and L=237497037841103040; no all-prime member was produced there.

Two independent programs reproduce 11 actual all-prime neutral A11/A19
tuples below 200 million. Python additionally checks four **named**, separately
scoped five-gate neutral primes: 7689528001, 15048300961, 18307396801,
34907648161. It proves primality by exhaustive trial division, exhausts all
B² divisor pairs for A=3,7,11,15,19, and verifies strict positive alternative
Type II tuples for each. This is not a full-range verification at 35 billion.
The TypeScript search domain remains capped at 200 million.

The new standalone module searches the known sufficient Type II criterion
s|(ap+u), s=-1 mod4ua with coprime a,u<=8. Its construction has
v=(ap+u)/s, k=(s+1)/(4ua), A=(u+v)/a, and exact tuple
(uvk,apuk,apvk), sorted and checked for distinctness and exactly two
p-divisible denominators. Of the 1505 primes obstructed through A=19 in the
existing 57840-prime interval, the unit slice finds 1425; freeing a rescues
79 additional primes within this box; one full-box miss remains. Both final
TS and complete-divisor Python runs match canonical manifest
`3086c5bf7d5224c45b83e63a36c6682b192302f6e53e597c2f7f6fdbd630f877`.
This is alternative finite witness coverage, not extension of the earlier
A<=63 result or evidence of a universal depth bound.

Prime 131433121 refutes a universal depth-eight shortcut: all 43 coprime
pairs miss. It still has a fixed-A first success at A=27. A separate named
depth-nine exploration finds (a,u,s)=(4,9,143); the box-eight miss and callable
cap are preserved. Prime 171348241 obtains an alternative strict tuple
(43174360,5483143712,29591402569203040) from (a,u,s)=(4,1,127), with
shift A=1349199, not a small-shift improvement.

All 318 unit tests across 61 files passed on the final rerun; typecheck,
lint and diff checks passed. No new browser case/agent event, provider call,
schema change, commit, push or deployment occurred. These tools are not yet
sealed in an authoritative agent-cycle ledger. The next mathematical target
is a growth/escape lemma for adaptive parameters, preserving neutral families
and the full-box counterexample as controls; density tending to zero alone
cannot prove an empty exceptional set. Proofs, source attribution, reproduction
commands and hashes are in
`docs/operations/MATH_PILOT_NEUTRAL_CORRIDOR_2026-10-01.md`.

## 2026-10-01 — Divisor-led adaptive escape and fixed-menu barriers

Continuation approved by the user. Added standalone `math-divisor-led.ts`,
`erdos-straus-divisor-led.ts`, `verify-divisor-led.py` and six unit controls.
Inverse enumeration chooses s=3 mod4, m=(s+1)/4, a|m and derives the unique
positive u=(-ap) mod s (<s), requiring au|m and coprimality. Python instead
enumerates all coprime factor pairs. Exact sorted strict Type II identities
are checked; misses are `NOT_FOUND_IN_S_INTERVAL`, never root refutations.

With maxS=4095 declared before the scan, both implementations independently
regenerate all 1,505 A<=19 survivors among 57,840 residual primes through
200 million and find witnesses for all. Largest first s is 791 at p=159727681;
largest parameter among chosen first-s pairs is 63, not a minimum-depth claim.
All 1,505 also have prime-s candidates within 4095, so no global composite
necessity is claimed. Common canonical manifest SHA-256:
`1288a65e03ec8b17416621509bed04966430b1ee516aa34887d60095d211d45a`.
This is alternative-method coverage, not new root coverage beyond old A<=63.

Prime 131433121 has no normalized candidate at s<=142, then (a,u,s)=(4,9,143)
gives the earlier strict tuple. Its first prime candidate is 311 at (13,6).
The old bound-eight box miss is retained. Written determinant separation:
if s divides two normalized linear forms, it divides a0*u-a*u0; when
s>J*max(a0,u0), the only possible pair in the J box is the seed itself.
For (4,9,143), no depth-eight pair can share this particular divisor.
This excludes no other divisor or root solution. A divisor of p+1 cannot be
retargeted into a different normalized sufficient pair while retaining s.

An elementary unconditional fixed-DIVISOR-menu barrier was written:
for any finite S of s=3 mod4, p=1 mod lcm(840,S) prevents every construction
using those s, because 0<a+u<=au+1< s when au|(s+1)/4.
Dirichlet gives infinitely many such primes. This application does NOT remove
the Dickson qualifiers from the different fixed-A/fixed-pair neutral barriers,
nor exclude unbounded s or Type I. Concrete prime 351121 misses s<=19,
then opens at s=31. No novelty or Lean formalization is claimed.

Prime residue atlas: usable classes -u/a for coprime au|(q+1)/4 are quadratic
nonresidues at prime q=3 mod4, but generally not every nonresidue is usable.
At q=11, residues 2,6 are omitted; at q=127, eleven pairs yield only seven
classes, including collision (1,32) and (4,1) at residue95. Do not count pairs
as distinct classes without the relevant separation premise. Python replays
these atlases and 654 unit-retarget/97,266 determinant comparisons.

Final 324/324 unit tests in 62 files, typecheck and targeted ESLint passed.
No browser/agent-ledger event, paid API, schema change, commit/push/deployment.
These tools are not yet authoritative agent-cycle events. Written proofs,
sources, full reproduction commands, scope limits and source hashes are in
`docs/operations/MATH_PILOT_DIVISOR_LED_ESCAPE_2026-10-01.md`.

### 2026-10-01 — visible local exact-arithmetic workbench

User requested continuation with UI visibly open in Codex. Restored the existing
demo at `127.0.0.1:3001`, with `RESEARCH_CODEX_LOCAL_ENABLED=true` and
`MATH_PILOT_QUEUE_ENABLED=false`; no paid API or worker was started. Port 3000
was occupied by unrelated processes and was not modified. Existing authentication,
sealed cases, old bounded misses and agent-cycle histories were preserved.

Added `/w/[workspaceSlug]/research/math-tools`, linked from Math Pilot only in
development/test. Authentication, workspace membership and `research.read` precede
computation; staging/production are denied. This is a read-only diagnostic, not an
authoritative case, agent event, new research coverage or theorem acceptance.
GET scope is a residual prime <=200,000,000 and maxS 3..4095; malformed,
repeated, partial, composite and out-of-bound input is rejected before replay.

Each requested control runs TypeScript's divisor-led search plus a separate
Python factor-pair enumeration, exact integer identity and Type II check. The new
`scripts/operations/replay-divisor-led.py` source is pinned to SHA-256
`6bb0a58798a6b679ba4662fc4d5d8c0028cede1b8bbd684af514dd3d5c8758a2`.
Dispatch uses Python isolated flags, an environment allowlist, a ten-second
timeout and a 256 KB output cap. Strict output parsing binds scope, mode, first s,
construction, denominator tuple and identity digest. Drift, unavailable tools or
mismatches never display an independent PASS. No unreviewed model code executes.
Control links use ordinary GET navigation so selecting a control requests a
fresh replay; the form remounts on changed scope to avoid stale default values.

Observed browser E2E: p=131433121 at all-s bounds 142 (miss), 143 (strict witness);
prime-only bounds 143 (miss), 311 (strict witness). p=351121 at bounds 19 (miss)
and 31 (strict witness). All six independent replays matched. Composite 841 via
the form rendered a validation error without dispatch. Desktop formula rendered
through KaTeX. At 320px document width/scrollWidth were both 320; the long formula
has internal horizontal scrolling. Desktop viewport restored, visible tab kept
open at the 143 witness. No new discovery or independent expert/Lean certification.

Validation: typecheck and targeted ESLint passed; all 327 unit tests in 63 files
passed with `--maxWorkers=2`. Initial fully parallel run timed out one existing
large-interval survey at its 5-second test limit; no timeout or test was weakened.
No schema change, commit, push, billing or deployment in this step. The outstanding
research gap remains integrating reviewed tools as bounded, sealed agent-cycle
evidence, then pursuing a structural claim with literature and independent checks.

### 2026-10-01 — composite-character pruning and the remaining occupancy gap

User requested continued attack on Erdős 242. Added standalone reviewed
`math-divisor-character.ts`, TS character audit, independent Python audit, and
five unit tests. Original divisor-led source, old certificates and old bounded
misses were not changed. No paid API, worker, schema change, commit/push or deploy.

Written elementary proofs now cover: (1) every normalized coprime au|(s+1)/4
construction at s=3 mod4 requires Jacobi(p,s)=-1, INCLUDING composite s;
(2) exact eligible residues are bounded signed products of prime factors of
(s+1)/4, with product(2e+1) pairs but potentially colliding residues;
(3) first character-negative s for residual p=1 mod840 is min(q3,3q1), with
q3/q1 the least prime nonresidues in those mod4 classes;
(4) exact fixed-menu character-blind conditional reduced-class fraction 2^-r,
where external prime coordinates q=3 mod4 <=Y or q=1 mod4 with 3q<=Y are
independent. Dirichlet supplies infinitely many such primes for FIXED Y only.
This is not growing-menu coverage, a prime-frequency estimate or a root proof.

Novelty is NOT established. Salez 2014 Proposition 2/proof already uses the
Jacobi obstruction with modulus 4BCD-1; explicitly credit that prior art.
No Lean formalization or mathematical expert certification was obtained.

Independent implementations: TS signed exponent vectors/binary Jacobi versus
Python explicit factor pairs/prime-factor Euler characters. Every canonical row
matches across 256 moduli <=1023 and 131,072 residue slots; usable cells 3,774,
character-minus-one but unusable cells 49,363. Manifest SHA-256:
`d9bf1d537935602d95f8ac6db16144a8a69d7ab3049a53fb4277b22d5ef4343f`.
Raw TS, filtered TS and Python witness replay match four controls:
131433121 first character11/witness143; 351121 31/31; 171348241 51/83;
159727681 31/791. The hardest control retains74/skips124 of198 s values,
without changing construction or strict digest. No wall-clock speed claim.
348 additional raw/filtered comparisons for residual primes <=200,000 at
four bounds also match; this is finite regression, not a new global survey.

Observed visible browser: authenticated read-only math-tools at p159727681,
all-s bounds31 and790 miss; bound791 exact witness, all Python replays matched.
The new character code was NOT used by that workbench or agent ledger.
Visible tab kept open on 791 witness, screenshot
`/tmp/hive-character-gap-2026-10-01.jpg`. Queue remains disabled.

All332 unit tests in64 files, typecheck and targeted ESLint passed. Full proofs,
exact counts, source bindings, reproduction, prior art and restrictions:
`docs/operations/MATH_PILOT_COMPOSITE_CHARACTER_2026-10-01.md`.
Next obligation is occupancy/escape of bounded signed-product images across
varying s, not merely a least-nonresidue bound. Authoritative sealed in-loop
tool integration remains an explicit open product gap before AI classification.

### 2026-10-01 — complete single-prime-core exclusions for two hard primes

User authorized continued attack. Added standalone `math-divisor-occupancy.ts`,
TS audit, independent Python replay and six unit tests. Old sources, sealed
cases, witnesses, bounded misses and review classifications remain unchanged.
No paid API, worker, schema change, new browser campaign, Git push or deployment.

Exact modular hierarchy now distinguishes R_s (bounded signed-exponent image),
-H_s (negative coset of the core-prime-generated subgroup), and all Jacobi -1
classes. Negative-character misses divide into subgroup obstructions (persist
even with unbounded exponents at THAT s) and exponent-window obstructions.
Finite audit s<=1023: 131072 residue slots, 3774 eligible, 12427 subgroup misses,
36936 window misses; full TS BFS/signed-exponent and Python power-cycle/factor-pair
rows match manifest `97cfb0a73d4dfb8b478a56cebbe0fecbfa00b60d95ea964ea3cdf30958351d6c`.
Prime cyclic membership equation must NOT be treated as sufficient on composite s.

Written single-core theorem: for m=ell^e, R_s consists of -ell^f, -e<=f<=e,
with size min(ord_s(ell),2e+1). Dyadic cores saturate at order e+2, including
composite Mersenne-type s; odd-prime cores have order>2e+1 and do not saturate.
All canonical eligible residues are >=(s-1)/2. Hence, for a FIXED p, every
single-core modulus s>2p+1 is excluded. For e=1, exact eligibility is
s|(p+1), s|(p+4), or s|(4p+1), with s=4ell-1 and ell prime. Enumerating these
three divisor sets plus all e>=2 powers up to m<=(p+1)/2 is therefore complete.

Both independent programs prove NO normalized single-core eligibility for
p131433121 and p159727681 at ANY s, not merely s<=4095. Candidate moduli
checked:1180 and1277; other degree-one candidates and all infinite tails are
excluded by the written criteria. Exact row digests respectively
`0b107f83e216b5a23f12de4fd93c2cd90e8dc057079daa0d5637b79dad0d60d5`
and `08a5e3f0bc6baa11a099762c08331a772378baf32aa3065ab9d9ccca0db451a5`.
These are RESTRICTED-FAMILY exclusions, not Erdős–Straus counterexamples:
old mixed-core witnesses at s143 (m36) and s791 (m198) remain valid.
Positive controls: p351121 hits only s31; p171348241 hits s127 and3235 in
the single-core family, both exact strict tuples independently checked.

Dyadic ancestry d|t, d>=3, s_t=2^t-1 yields exact coset projection. Residual
p excludes t3 and4, so a first dyadic eligible exponent must be prime>=5
(not necessarily a prime modulus). All dyadic exponents are decidable per p
via the increasing minimum residue 2^(t-1)-1. Both hard primes have no hit.

Primary-source comparison found explicit overlap with CENTL author-owned
MULTIPLICATIVE-TRAP-COSET and DYADIC-TRAP-LATTICE notes. No novelty certified.
Their T_m={-d,-4d:d|m} equals our R_s on prime-power cores but may be smaller
on mixed cores; their full saturation classification was NOT imported as a
theorem for our larger family. Classical finite-field cyclicity is cited to MIT.
Written proofs are not Lean/formal or expert-independent certification.

Final338 unit tests in65 files passed with maxWorkers1; typecheck, targeted
lint and diff checks passed. One earlier overlapping maxWorkers2 run hit the
unchanged five-second large-interval timeout; no weakening was made. New
isolated six-test suite passed. UI kept open at p159727681/s791 mixed-core
witness, but the new tools are not browser or authoritative agent-ledger events.
Full proof, sources, controls, reproducible commands and fingerprints:
`docs/operations/MATH_PILOT_SINGLE_CORE_EXCLUSION_2026-10-01.md`.
Next mathematical target: mixed-core occupancy/escape using at least two
prime generators; preflight against these complete exclusions, do not recycle
single-core or dyadic universality. Sealed in-loop tool integration remains open.

## 2026-10-01 — Mixed-core support milestone and Pell collision regression

Continued local Erdős242 research without paid API, deployment, commit/push,
or automatic agent-ledger promotion. Historical pinned raw divisor/character/
occupancy implementations and bounds are unchanged.

New `math-mixed-core.ts` + pinned isolated `replay-mixed-core.py` independently
match all four support controls, strict identity digests, complete single-core
row manifests, 1024 finite collision rows and a Pell counterexample.
For p131433121 and p159727681, the minimum number of DISTINCT primes dividing
m is EXACTLY2 across ALL s in the declared normalized family: support-zero
miss (s3), previous complete single-core exclusion, and two-core strict
witnesses respectively s143/m36/a4/u9 and s1135/m284/a4/u71. The latter has
v562917/k1 and denominators39967107,45362661404,359653708021908.
Controls p351121 and p171348241 correctly remain minimum1; a bounded two-core
miss stays UNRESOLVED. These classifications do not add new root coverage.

Written bound for m=2^a*prod(ell_i^b_i), a>=2:
|R_s| <= P-E, P=(2a+1)*prod(2b_i+1), E=(a-1)*prod(b_i+1).
Proof: directed chains inside the signed exponent box, with kernel vector
(a+2,b_i) from 4m=1 mods. This is an UPPER bound, not equality, independence,
or a hitting guarantee. Finite m<=1024 all attained the bound, but m1224/s4895
does NOT:105pairs,12known edges,93bound,92actualresidues. Coprime reversed
pairs(72,17)/(17,72) collide at3739. The negative Pell equation
(X-2Y)^2-5Y^2=-1 provides infinitely many additional mixed-sign collisions
outside the positive-chain relation, with CRT signs -1/+1 on X-Y/X+Y.
Do not recycle the disproved universal equality or infer coverage from P.

Browser `research/math-tools#mixed-core` now computes/displays the fixed
structural packet plus live Python replay, KaTeX, bilingual scope/negative
controls. Auth + research.read + development/test gates preserved; invalid
scope dispatches neither computation nor Python. This is READ-ONLY and NOT an
authoritative agent-loop event. Current visible tab is authenticated p159/s791
at the mixed-core panel on127.0.0.1:3001. No research worker was started.

Final343unit tests/66files pass maxWorkers1; typecheck/targeted lint/diff pass.
Browser compositep841 rejection and valid re-run verified; desktop1366px no
horizontal document overflow or KaTeX errors. No mobile/production/formal/
novelty/closed-agent-E2E claim. Source pin:
9da0dfd3774d9ea2162d5a31fd18c3d82d398ecf918ccae19acfbfffa64297a5.
Full proof, prior-art boundaries, manifests, commands:
`docs/operations/MATH_PILOT_MIXED_CORE_COLLISIONS_2026-10-01.md`.
Reproduce with `node --import tsx scripts/operations/erdos-straus-mixed-core.ts`
(tsx CLI IPC pipe was sandbox-denied; the import entry point succeeds).
Next: study extra kernel/CRT collisions and prove a targeted mixed-core
hitting/lower-bound criterion; integrate independently replayed evidence into
the actual agent protocol before autonomous reuse. No novelty certified.

### 2026-10-01 — TIP-033A mixed-core pre-planner evidence integration

Implemented the existing next priority in the bounded local cycle: new
Erdős–Straus round1 retains a root-bound MIXED_CORE_EVIDENCE event after the
method marker and before any model call. The fixed mixed-core packet is freshly
Python-replayed; UNAVAILABLE/MISMATCH stops with INTEGRITY_FAILURE and no model
dispatch. Canonical validation accepts JSONB key ordering but rejects altered
counts/scope, extra fields, rebound roots, duplicated/late evidence and calls
after a typed false claim. All persisted validation paths pass the stored root
digest. Historical traces without the new marker remain readable unchanged.

Planner/portfolio, task verifier, solver, critic and adversary receive the same
envelope. Two exact mixedCoreClaim IDs are checked before sources/verifier/
solver: ALL_RESIDUAL_PRIMES_HAVE_NORMALIZED_SINGLE_CORE_RESCUE and
KNOWN_RELATION_BOUND_IS_EXACT_FOR_EVERY_MIXED_CORE. They append
MIXED_CORE_CLAIM_REFUTED and reuse STRUCTURAL_REFUTED branch pruning. This is NOT
semantic detection of paraphrases. New Codex output supplies an ID or null;
historical proposals lacking the field retain digest compatibility.

Cycle UI shows retained replay/scope/digests/refutations when an event exists;
otherwise explicitly says no mixed-core evidence is retained. Workbench is
still read-only, not an agent event. Inner packet scope describes its diagnostic
origin; outer envelope records consumption in the cycle without promotion.
Browser inspected both current preview and historical cycle warning, zero
KaTeX errors/document overflow at desktop. No live new cycle was submitted, so
the retained-event panel still needs a live visual scenario. Queue remains off.

Final351unit/67files and8strictintegration/1file PASS; typecheck, targeted lint
and diff checks PASS. Integration exclusively hiveos_test; planner sees the
already committed evidence, five roles share its digest, typed refutation
blocks all downstream calls, injected UNAVAILABLE produces zero model calls.
No new scientific claim, formal/novelty acceptance, paid API, migration, worker
startup, production build, commit/push or deployment. New subscription campaign
is deferred, not counted as complete autonomous research E2E.

Contract: docs/contractor/tips/TIP-033A_MIXED_CORE_AGENT_EVIDENCE.md.
Report: docs/verification/TIP-033A_MIXED_CORE_AGENT_EVIDENCE_VERIFY_REPORT.md.
Next: run a new bounded cycle for a narrower mixed-core hitting condition or
extra CRT/kernel collision characterization, avoiding both disproved universal
assertions and preserving formal/literature gates before breakthrough claims.
