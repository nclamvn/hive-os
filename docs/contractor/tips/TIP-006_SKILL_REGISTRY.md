# TIP-006 — Skill Registry

Status: `IMPLEMENTED — READY_WITH_DEFERRED`

Authorized by the Owner on 2026-07-23.

## Task

Implement the workspace-scoped registry for immutable, versioned executable
skill contracts. A registered contract declares capabilities, input/output
schemas, required evidence, failure states, verifier binding, bounded resource
estimates and assurance compatibility.

TIP-006 does not execute skills. Skill runs, providers, queues, retries,
artifacts, completion reports and resource metering remain outside this TIP and
belong to TIP-007 or later.

## Acceptance Criteria

- A Skill has a workspace-unique stable key and an explicitly activated
  SkillVersion.
- Every SkillVersion is immutable, content-hashed and contains all metadata
  required by the approved Blueprint.
- Registering a new version never changes the active version implicitly.
- Activating a version is explicit, audited, concurrency-safe and rejects stale
  expected versions.
- Contract validation is deterministic and rejects malformed semantic versions,
  duplicate or invalid capabilities, empty evidence/failure/assurance sets,
  invalid schemas, verifier bindings and resource estimates.
- Deterministic discovery returns only active versions compatible with every
  required capability and the requested assurance profile.
- Workspace isolation and centralized role permissions apply to every query and
  mutation without leaking cross-workspace object existence.
- Runtime database permissions and triggers prevent update/delete of immutable
  SkillVersion rows.
- Control Room reports only real workspace-scoped registry counts and marks the
  registry available only after implementation.
- Deterministic unit, integration, concurrency and E2E tests reproduce these
  invariants.

## Required contract shape

```yaml
skill_key: refinery
version: 1.2.0
capabilities:
  - web_evidence_ingestion
  - deterministic_registry
input_schema:
  type: object
output_schema:
  type: object
required_evidence:
  - source_snapshot
  - exact_span
failure_states:
  - OPEN_INCOMPLETE
verifier:
  kind: deterministic
  verifier_key: registry-hygiene
resource_estimate:
  max_duration_seconds: 900
  max_memory_mb: 1024
assurance_compatibility:
  - RESEARCH
  - REGULATED
```

## Authority and state rules

1. PostgreSQL rows and SkillVersion content hashes are authoritative.
2. SkillVersion rows are append-only.
3. Skill is the governed mutable projection that points to one active version.
4. A new version is inert until an authorized actor activates it.
5. Stale activation attempts fail closed; they never overwrite a newer choice.
6. Discovery is read-only and deterministic. It never invokes a provider,
   executes a tool or mutates Mission/Truth state.
7. Models may propose contracts or plans but cannot register or activate them
   directly.

## Verification

- Contract rules: `SKL-U01` through `SKL-U05`.
- Registry, isolation, lifecycle and concurrency: `SKL-01` through `SKL-09`.
- Control Room projection: `CR-I01` and `CR-07`.
- Local technical health: 91 unit, 80 integration and 41 E2E tests pass.
- Fresh-install and TIP-005-to-TIP-006 upgrade rehearsals pass.
- Detailed evidence and deferred obligations:
  `docs/verification/TIP-006_VERIFY_REPORT.md`.
