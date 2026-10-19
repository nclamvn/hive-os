# HIVE OS — Forward Roadmap (TIP-020 → TIP-025)

Status: `SUPERSEDED IN PART — ENTERPRISE CORE IN PROGRESS (2026-07-30)`

Recorded: `2026-07-28`

This roadmap is accepted as directional intent only. Each TIP requires explicit
Owner authorization. TIP-021C-A was subsequently completed as a local,
provider-neutral production contract. On 2026-07-29 the Owner authorized the
bounded TIP-022 pilot-readiness build; this authorization does not start a real
pilot, select external infrastructure, connect a model provider, or authorize
production/public release. TIP-020 Part B (RRC-1) remains
`BLOCKED_EXTERNAL`.

On 2026-07-30, after the TIP-022Q X-Ray, the Owner directed HIVE OS to mature
its enterprise core logic and operating interface before cloud, connectors or
AI. The proposed replacement sequence is recorded in
`11_ENTERPRISE_CORE_VISION.md`, `12_ENTERPRISE_CORE_BLUEPRINT.md`, and
`13_ENTERPRISE_CORE_TASK_GRAPH.md`. The Owner approved the Blueprint and
separately authorized TIP-023A through TIP-023D. Later Enterprise Core TIPs
remain gated by their own bounded handovers.

This document captures the Owner's strategic verdict as a durable repository
record. A governed-truth system must record its own forward strategy, not leave
it in chat history. Individual TIPs are specified in
`docs/contractor/tips/`; this is the sequencing and rationale layer.

## Verdict

HIVE OS is not short of kernels: 8 core modules, ~273 tests, 13 migrations, a
signed Local RC. The binding weaknesses are no longer architecture or feature
count, but:

1. Reproducibility outside the Builder machine is unproven.
2. No real production operation.
3. No customer has received measured value.
4. No proprietary data/workflow moat has formed.

A governance contradiction must be resolved first: `G3: HOLD` while
TIP-005…TIP-019 completed and `G6: PASS local`. A "governed truth" product must
hold its own build history to the same standard — reconcile or transparently
account for every gate.

## Sequence

### TIP-020 — Governance Reconciliation & Remote Reproducibility _(next; not a feature)_

- **A. Reconcile** TIP-005…019 via an Owner Decision (local-only continuation
  exception), then split the gate ledger onto a LOCAL/REMOTE axis with
  `PASS_PROVISIONAL` until remote CI is green. **Part A ratified by the Owner
  2026-07-28 (DEC-009, DEC-010 APPROVED; gate ledger LOCKED). See
  `tips/TIP-020_GOVERNANCE_RECONCILIATION.md`.**
- **B. Remote reproducibility:** clear GitHub billing, run full workflow on the
  RC commit, branch protection on `main`, required checks, signed RC tag, SBOM +
  dependency inventory, stored artifacts/migration manifest/test report. Prove
  clean checkout → install → migrate → test → build.
- **Gate `RRC-1`:** passes only when a clean runner recreates the product with
  no reliance on local machine state.

### TIP-021 — Production Readiness _(no AI yet — make it live outside the laptop)_

| Axis          | Must complete                                               |
| ------------- | ----------------------------------------------------------- |
| Environments  | dev, test, staging, production separated                    |
| Database      | managed PostgreSQL, migration procedure, connection pooling |
| Storage       | S3-compatible prod bucket, encryption + lifecycle           |
| Secrets       | secret manager, rotation, no manual `.env`                  |
| Recovery      | automated backup, restore drill, explicit RPO/RTO           |
| Observability | logs, traces, metrics, alerting, correlation ID             |
| Security      | email verification, password reset, session revocation      |
| Tenancy       | consider PostgreSQL RLS for workspace-scoped tables         |
| Operations    | incident runbook, migration rollback, maintenance mode      |
| Performance   | load test, slow-query monitoring, production SLO            |
| Governance    | data retention, export, deletion, legal hold                |

**Gates:** `PROD-01` fresh staging deploy · `PROD-02` backup/restore ·
`PROD-03` zero-downtime/controlled migration · `PROD-04` tenant isolation
negative test · `PROD-05` incident drill · `PROD-06` production security review.

### TIP-022 — Real-World Pilot _(pilot-readiness build authorized 2026-07-29)_

Do not sell HIVE OS as a general "OS". Pick a narrow, high-pain wedge:

**Governed Engineering Change & Verification Dossier** — pilot inside RtR on a
real technical change (UAV, simulator, flight controller, gimbal, sensor stack).

Flow: change request → contract → requirement → spec & test evidence → claim →
decision → execution TIP → independent verification → release authorization →
immutable release manifest.

Team: 1 Owner, 1–2 engineers, 1 QA/verifier, 1 production/ops; 3–5 real missions
in 30 days.

**Value metrics (not agents/tokens):** decision cycle time; evidence-retrieval
time; rework from missing/wrong spec; % requirements with full evidence +
verification; material decisions without an accountable actor; release claims
without traceable source; defects caught before production.

**Targets:** ≥30% faster change approval; ≥50% faster dossier retrieval; 100% of
material decisions with actor+reason+evidence; 100% of release-manifest claims
with provenance; zero silent contract edits.

**North Star — Governed Decision Throughput:** released missions per month with
complete contract, evidence, verification, and signoff.

Local readiness implementation now includes the RtR engineering-change
template, governed evidence file intake, complete mission dossier export,
ledger-derived pilot measurement, and a fail-closed controlled-environment
rehearsal. A real pilot remains pending a named workspace, real functional-team
attestation, and 3–5 real missions.

### TIP-023 — Evidence Ingestion & Connectors _(superseded number; capability deferred)_

Priority candidates: Google Drive/Docs, GitHub, Slack (context, not auto-truth),
standard file import, API/webhook for simulator/test bench.

**Hard rule:** a connector only creates `EvidenceSource` + `Snapshot`. It never
creates a proved claim, never passes a gate, never mutates mission state.
Ingested sources carry: source identity, timestamp, immutable snapshot, content
hash, importer identity, extraction version, provenance to the original record.

### TIP-024 — Governed AI Copilot _(superseded number; capability deferred)_

TIP-024A Query Trust Foundation was authorized on 2026-08-04 as a bounded,
provider-free prerequisite. It adds strict QueryPlan, trusted-scope,
registry-candidate, uncertainty-disposition and golden-evaluation contracts.
It does not start the AI Copilot, persist an enterprise ontology, select a
retrieval engine or claim enterprise question-answering accuracy.

Highest-value tasks: extract requirements from spec; detect conflicting
requirements; propose claims from evidence; find unsourced claims; surface
supporting/contradicting sources; propose falsification criteria; assess missing
contract fields; generate verification plans; check completion reports against
acceptance criteria; detect version deviations; summarize decisions with
provenance.

**AI must not:** approve contracts, mark claims PROVED, pass gates, waive
obligations, sign releases, edit old ledgers, or hide honest-null. Every model
output is `PROPOSAL` / `DRAFT` / `EXTRACTION` / `ASSESSMENT` — never authority.

**AI gate:** golden dataset from real missions; per-task precision/recall;
provenance correctness; hallucination rate; human acceptance rate; cost/latency;
verifier-rejection rate; fail-closed when evidence is insufficient.

### TIP-025 — Productization & Commercial Layer _(superseded number; capability deferred)_

Onboarding by use case; industry workspace templates; tenant administration;
billing & usage metering; audit export; retention policy; support console;
service status; privacy-safe product analytics; docs & training; terms/privacy/
DPA/security package; deployment options (cloud, private cloud, on-prem).

Package by **assurance profile**, not feature count:

| Tier         | Audience                             | Value                                                            |
| ------------ | ------------------------------------ | ---------------------------------------------------------------- |
| Professional | Product/engineering teams            | Contract, decision, execution trace                              |
| Research     | R&D / deeptech                       | Claim, evidence, falsification, independent verification         |
| Regulated    | Defense, health, finance, compliance | Separation of duties, immutable audit, signoff, release manifest |

## The real moat

Not agent count or dashboards. It compounds from: battle-tested industry mission
templates; the evidence graph (source→claim→decision→release); verification
scenarios proven on real data; golden datasets from real defects/disputes;
policy packs (Research, Regulated, per-org); organizational memory that survives
staff turnover; release manifests answering "why do we trust this?" in minutes.

## Do NOT build yet

New kernels; a hundred-skill marketplace; many AI providers; autonomous
multi-agent; massive analytics dashboards; a large public Observatory; dozens of
unused templates; complex social/collaboration; pretty metrics unlinked to
outcome. **Architecture is currently ahead of market evidence** — adding
features grows maintenance surface faster than value.

## 90-day plan

- **Day 1–14:** reconcile governance history; clear billing; remote CI green;
  signed RC tag; staging deploy; basic backup/restore + monitoring; close email
  verification / password reset.
- **Day 15–45:** run the RtR pilot; 3–5 real missions; weekly ledger-based
  review; measure cycle time, rework, evidence coverage; log friction (no vibe
  UI changes).
- **Day 46–70:** build only the 2–3 connectors that remove the most manual work;
  tune templates from pilot data; add needed import/export & management reports;
  harden tenancy + production ops.
- **Day 71–90:** add AI Copilot for the 2 highest-ROI tasks; benchmark on the
  pilot golden dataset; run a second pilot with a different team; standardize
  onboarding, pricing hypothesis, sales narrative.

## Final priority order

1. Governance reconciliation
2. Remote CI reproducibility
3. Production reliability and security
4. One real high-value pilot
5. Evidence connectors
6. Governed AI assistance
7. Commercial packaging
8. Broader scale

HIVE OS gets stronger not by adding modules, but by proving three things: it can
be reproduced, it can be operated safely, and it helps an organization decide
faster while knowing exactly why the decision is trustworthy.
