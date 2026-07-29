# TIP-022: RtR Real-World Pilot Readiness

## HEADER

- TIP-ID: TIP-022
- Project: HIVE OS
- Module: Mission Templates, Truth, Governed Exports, Pilot Operations
- Depends on: TIP-021C-A
- Priority: P0
- Authorized by: Owner, 2026-07-29

## CONTEXT

- Working directory: `/Users/os/hiveos`
- Pilot wedge: Governed Engineering Change & Verification Dossier
- Pilot environment: provider-neutral local or controlled environment
- Patterns to follow:
  - Workspace-scoped authority and non-disclosing not-found behavior
  - Immutable source snapshots and SHA-256 addressed records
  - Existing object-storage abstraction for local and S3-compatible storage
  - Existing governed JSON export routes and private no-store responses
  - Real ledger projections only; unavailable values remain explicitly unavailable

## TASK

Prepare HIVE OS to run a narrow RtR engineering-change pilot before adding a
model provider API. Deliver the minimum product and operational capabilities
needed to create a representative mission, attach real files, retrieve one
complete dossier, measure the governed workflow from retained records, and
rehearse the pilot environment.

## REQUIREMENTS

### REQ-022-01: Deeptech engineering-change template

Provide a built-in Professional-assurance template for a bounded UAV, simulator,
flight-controller, gimbal, or sensor-stack change. It must prefill the mission
objective, scope, success definition, a testable primary requirement, and a
closure obligation without submitting or approving the contract.

### REQ-022-02: Evidence file intake

An authorized member can attach PDF, CSV, TXT, JSON, Markdown, PNG, JPEG, or
WebP evidence to an existing mission source. The system must validate media
type and size, compute the digest from exact bytes, persist bytes through the
configured object-storage adapter, and create an immutable Snapshot linked to
the source, mission, workspace, actor, capture time, storage reference, and
access-controlled source.

Text-like files must retain their exact decoded text for span extraction.
Binary files must retain an explicit, deterministic descriptor instead of
fabricated extracted content. Failed database persistence must trigger
best-effort object cleanup. User filenames must never determine filesystem
paths.

### REQ-022-03: Complete mission dossier export

An authorized reader can download a deterministic, versioned JSON dossier for
one mission. It must include the mission and contract lineage, requirements,
inputs, obligations, gates and runs, decisions, escalations, truth records and
provenance, execution records and artifacts metadata, verification records,
signoffs, evidence ceilings, release records, and mission-scoped audit events.

The dossier must include a SHA-256 integrity manifest over its canonical
content, omit raw stored object bodies and secrets, enforce tenant isolation,
and return a non-disclosing not-found result for foreign or unknown missions.

### REQ-022-04: Pilot measurement report

An authorized reader can inspect and download a mission-scoped pilot report
derived only from authoritative timestamps and ledgers. The report must expose:

- phase durations when both boundary timestamps exist;
- requirement evidence and verification coverage;
- material-decision accountability;
- release-claim provenance;
- retained rework signals such as retries, deviations, disputes, and failed
  verification scenarios;
- dossier completeness and a governed-throughput eligibility result.

Metrics that cannot be derived from existing records, including human search
time or defects outside HIVE OS, must be reported as unavailable with a reason,
never estimated or synthesized.

### REQ-022-05: Controlled-environment rehearsal

Provide an executable readiness check and operator runbook that verify the
local/provider-neutral environment contract, required configuration categories,
health, storage access, database migration state, pilot roles, backup/restore
procedure, tenant-isolation test reference, and dry-run sequence.

The check must distinguish local readiness from externally unverified staging
or production capabilities. It must not claim provider selection, DNS, managed
secrets, production SLO/RPO/RTO, remote CI, or public release.

## ACCEPTANCE CRITERIA

1. Given the template catalog, when the engineering-change template is selected,
   then a draft mission is prefilled and no lifecycle gate is bypassed.
2. Given an allowed file within the size limit, when an authorized member
   uploads it, then exact bytes are stored under a workspace-scoped digest key
   and an immutable Snapshot is created with matching SHA-256.
3. Given a disallowed type, empty file, oversized file, Viewer role, foreign
   source, or storage failure, when upload is attempted, then the request fails
   closed without a valid Snapshot.
4. Given a mission with retained records, when its dossier is exported, then
   the schema and integrity hash are stable and every returned record belongs
   to that workspace and mission.
5. Given a foreign or unknown mission ID, when dossier or pilot metrics are
   requested, then the response does not disclose object existence.
6. Given incomplete workflow history, when pilot metrics are generated, then
   missing measurements are explicitly unavailable and no synthetic values
   appear.
7. Given complete retained workflow records, when pilot metrics are generated,
   then coverage, accountability, provenance, rework signals, and throughput
   eligibility are deterministically derived.
8. Given the supported local environment, when the readiness command runs,
   then it returns machine-readable checks and a non-zero status for failed
   required checks.
9. Typecheck, lint, production build, relevant unit/integration tests, and
   bounded UI/E2E scenarios pass.

## CONSTRAINTS

- Do not add a generic chat surface, model-provider adapter, autonomous agent,
  connector marketplace, new kernel, billing, or broad analytics dashboard.
- Do not mutate governed state from imported or generated content.
- Do not infer text from PDF or image bytes in this TIP.
- Do not expose raw object-storage keys to unauthorized users.
- Do not introduce synthetic pilot data or silently coerce unavailable metrics
  to zero.
- Do not mark external staging, remote CI, production, or public release ready
  without real provider, region, secret, and execution evidence.
- Preserve VN as the default locale and system-following appearance behavior.

## REPORT FORMAT

Create a Completion Report and Verify Report after implementation. Record
external infrastructure as `BLOCKED_EXTERNAL` or `UNVERIFIED_EXTERNAL` where
applicable.
