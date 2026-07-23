# TIP-014 — Templates and Skill Library

Status: `READY_WITH_DEFERRED — LOCAL VERIFIED`

Owner authorization: `2026-07-23`

## Task

Complete the operator-facing contract-template and Skill Registry surfaces.
Templates provide versioned, deterministic Mission draft defaults. Skill
Library exposes real workspace-scoped Skill and immutable SkillVersion records.

## Architecture decisions

- Built-in Mission templates are product configuration, versioned with the
  application and identified by stable keys. Applying one only pre-fills a
  draft; normal Mission Kernel creation, review, and approval remain required.
- Skill records remain PostgreSQL-authoritative and all mutations pass through
  the existing Skill Registry kernel.
- Registering a version never activates it implicitly.
- Activation and status changes remain explicit, reasoned, audited, and
  optimistic-concurrency protected.
- Friendly descriptions are primary in the UI; contract hashes, schemas,
  verifier bindings, resource ceilings, and failure states remain inspectable.
- No template or registry surface claims provider execution, verification, or
  release.

## Acceptance scenarios

| ID | Scenario | Expected |
| --- | --- | --- |
| TS-01 | Operator selects a built-in template | New Mission form receives deterministic defaults |
| TS-02 | Operator submits a templated draft | Normal governed Mission is created; no auto-approval |
| TS-03 | Owner registers a skill | Active immutable initial version appears with digest |
| TS-04 | Owner registers a candidate version | Candidate remains inert |
| TS-05 | Owner activates a candidate with reason | Active pointer changes and audit is retained |
| TS-06 | Viewer opens Skill Library | Read succeeds; management controls are absent |
| TS-07 | Foreign workspace identifier is submitted | Operation fails closed |
| TS-08 | 320px viewport and automated scan | No overflow or serious/critical violations |

## Local closure

Closed on `2026-07-23`.

- Four application-versioned templates cover Quick, Professional, Research,
  and Regulated Mission drafts.
- Template selection pre-fills editable contract fields and never bypasses
  Mission Kernel scoping, review, or approval.
- Skill Library exposes real workspace registry records and governed initial
  registration, inert candidate versions, explicit activation, lifecycle
  status, content digests, verifier bindings, and resource ceilings.
- Viewer permissions, tenant isolation, immutable versions, and stale
  activation protection remain enforced by the existing kernel.
- Desktop and 320px UI inspection passed with no horizontal overflow.
- Typecheck, lint, production build, 106 unit, 99 integration, and 55 E2E
  scenarios passed.
- Provider execution, billing, and remote CI were not changed.

See `docs/verification/TIP-014_VERIFY_REPORT.md`.
