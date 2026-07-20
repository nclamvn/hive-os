# BLUEPRINT — HIVE OS v0.1

Status: `READY FOR HOMEOWNER APPROVAL`

## 1. Architecture decision

Use a **modular monolith** for v0.1. Maintain strict domain modules and ports so execution workers, storage, model providers, and verification engines can be split later without premature distributed-system overhead.

Recommended family of technologies:

- Next.js App Router web application.
- TypeScript strict mode.
- PostgreSQL as authoritative transactional store.
- ORM selected after SCAN; schema and migrations must be deterministic and reviewed.
- Tailwind CSS plus accessible headless primitives.
- Server-side actions/API routes behind typed service boundaries.
- Background job abstraction with an in-process development adapter and durable production adapter.
- Object storage abstraction for snapshots, reports, source files, certificates, and release bundles.
- Playwright for critical workflows; unit/integration tests for kernels and state transitions.

Exact versions are locked by the Builder in the repository lockfile after SCAN and must not be upgraded silently during a TIP.

## 2. Bounded contexts

### Identity & Workspace
Users, workspace, roles, permissions, invitations, audit identity.

### Mission Kernel
Mission intake, mission contract, objective, scope, assumptions, constraints, assurance profile, workflow state, gates, obligations, decisions, escalations.

### Truth Kernel
Claims, claim states, facts, insights, falsification criteria, evidence sources, snapshots, evidence spans, disputes, honest-null semantics, provenance edges.

### Skill Runtime
Skill registry, versions, capability declaration, input/output schemas, required evidence, verifier bindings, resource estimates, compatibility.

### Execution Fabric
Contractor runs, Builder runs, TIPs, completion reports, artifacts, deviations, provider adapters, queues, retries, resource metering.

### Verification & Governance
Verification runs, scenario results, requirement coverage, corruption tests, sign-offs, evidence ceiling, release policy, immutable release manifest.

### Observatory
Read-only governed publication of missions, claims, results, methods, limitations, and artifacts explicitly marked public.

## 3. Mission lifecycle

`DRAFT → INTAKE → SCOPED → CONTRACT_REVIEW → APPROVED → EXPLORING → BUILDING → VERIFYING → REVIEW → RELEASED`

Terminal or side states:

`PARTIAL · BLOCKED · REFUTED · CANCELLED · ARCHIVED`

A mission can contain branches with their own states:

`HYPOTHESIS → TESTING → SUPPORTED | VALIDATED_BOUNDED | PROVED_INTERNAL | REFUTED | OPEN | BLOCKED_COMPUTE`

State transitions are executed by deterministic kernel rules. Models may propose transitions but cannot directly mutate governed status.

## 4. Assurance profiles

### Quick
Single review path, basic tests, minimum audit artifacts.

### Professional
Contractor review, Builder tests, requirement coverage, decision log.

### Research
Cross-model roles, evidence and falsification gates, independent verifier path, claim ledger, governed release.

### Regulated
Research profile plus access control, required human sign-offs, immutable manifests, stricter retention, export controls, and domain-specific validation.

## 5. Provider strategy

Provider-independent interfaces:

- `ContractorProvider`
- `BuilderProvider`
- `VerifierProvider`
- `ToolRunner`

Initial operational mode may be `MANUAL_BRIDGE`:

1. OS creates an immutable Contractor or Builder instruction artifact.
2. Operator sends it to Sol or Claude Code.
3. Returned report is uploaded/imported.
4. Parser validates required fields.
5. Kernel records the run and continues.

Later API adapters must preserve the exact same artifacts and state transitions.

## 6. Core data objects

- Workspace
- User
- Membership
- Mission
- MissionContract
- Requirement
- Assumption
- Constraint
- MissionInput
- Hypothesis
- FalsificationCriterion
- Claim
- ClaimVersion
- EvidenceSource
- Snapshot
- EvidenceSpan
- ProvenanceEdge
- Dispute
- HonestNullRecord
- Gate
- GateRun
- Obligation
- Decision
- Escalation
- Skill
- SkillVersion
- SkillRun
- TIP
- CompletionReport
- AgentRun
- Artifact
- VerificationRun
- VerificationScenario
- CorruptionTestRun
- Release
- ReleaseManifest
- AuditEvent
- ResourceUsage

Every governed object has immutable ID, workspace ID, created-by identity, timestamps, version, status, and audit linkage.

## 7. Skill contracts

A skill is a versioned executable contract, not prose documentation.

Required metadata:

```yaml
id: refinery
version: 1.2
capabilities: [web_evidence_ingestion, deterministic_registry]
input_schema: ...
output_schema: ...
required_evidence: ...
failure_states: ...
verifier: ...
resource_estimate: ...
assurance_compatibility: [research, regulated]
```

Initial skills:

- `refinery`
- `registry-hygiene`
- `vibecode`
- `hive-research`

The user selects intent, not skill names. Planner chooses a skill plan and explains the result at a product level.

## 8. Deterministic truth rules

- No claim without source, explicit internal owner, or explicit hypothesis status.
- No `corroborated` without two independent qualifying sources.
- Contradictory values produce `disputed`; tier never silently resolves.
- No evidence span without exact snapshot match when extraction requires verbatim support.
- `honest-null` is a valid state and is never auto-filled.
- Model prose cannot directly set `PROVED_INTERNAL`, `CORROBORATED`, `RELEASED`, or verification PASS.
- Timeout or capped search yields `OPEN_INCOMPLETE`, never `EMPTY_CERTIFIED`.
- Public release cannot exceed claim evidence ceiling or access level.

## 9. Required pages

### Dashboard
Mission composer, active missions, current mission overview, decision-required feed, real system metrics, workflow summary.

### New Mission / Contract
Natural language input, attachments, mission type, system understanding, adaptive questions, contract review, approval.

### Mission Workspace
Overview, Contract, Research Graph, Evidence, Claims, Build, Verify, Decisions, Release.

### Evidence Hub
Sources, snapshots, exact evidence spans, extraction labels, source independence, disputes.

### Claims & Insights
Stateful table, filters, provenance inspector, falsification, review cadence, access level.

### Verification
Requirement coverage, scenarios, technical health, verifier runs, corruption results, unresolved failures.

### Observatory
Governed public records only; no internal or unapproved claim leakage.

### Reports
Mission reports, release bundles, audit exports.

### Templates
Mission contract templates by domain and assurance profile.

### Skill Library
Capabilities and health for operators; end users see friendly descriptions rather than internal implementation detail.

### Settings
Workspace, roles, providers, storage, assurance defaults, retention, public release policy.

## 10. Security and data boundaries

- Workspace isolation at every query boundary.
- Server-side authorization, not UI-only hiding.
- Secrets never enter prompts, artifacts, logs, or Completion Reports.
- Snapshot and artifact downloads use scoped access.
- Public Observatory reads only release manifests and public projections.
- Sensitive insight fields obey access-level export rules.
- Append-only audit events for governed transitions.

## 11. Build milestones

### M0 — Foundation
Repo health, architecture skeleton, design tokens, CI, database base, auth decision.

### M1 — Mission Loop
Create mission, contract, approve, show lifecycle and decisions.

### M2 — Truth Loop
Ingest evidence, claims, provenance, disputes, honest-null, falsification.

### M3 — Execution Loop
Skill plan, TIP, manual Contractor/Builder bridge, reports, artifacts.

### M4 — Verification Loop
Requirement coverage, verifier runs, corruption runs, release gating.

### M5 — Product Surface
Locked dashboard, mission workspace, Observatory, reporting, responsive/accessibility pass.

## Approval rule

Homeowner must respond exactly `APPROVED` before TIPs beyond SCAN/bootstrap are executed. Any material change to bounded contexts, state semantics, data authority, trust boundaries, or visual language returns to VISION.
