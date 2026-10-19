# TIP-024A — Enterprise Query Trust Foundation

## Header

- TIP-ID: `TIP-024A`
- Project: HIVE OS Governed Intelligence Plane
- Module: Query Intelligence
- Depends on: TIP-005, TIP-023B, TIP-023C
- Priority: P0 foundation
- Status: `AUTHORIZED BY OWNER — 2026-08-04`

## Purpose

Establish a deterministic trust boundary for interpreting imperfect natural
language before any model provider, enterprise ontology, embedding index or
answer generator is selected. This TIP does not claim that HIVE OS can answer
enterprise questions; it makes future attempts bounded, measurable and
fail-closed.

## Requirements

| ID        | Requirement |
| --------- | ----------- |
| QTRUST-01 | Strict provider-neutral QueryPlan contract with bounded input |
| QTRUST-02 | Trusted scope and authorization remain outside analyzer control |
| QTRUST-03 | Registry-confirmed entity candidates and explicit uncertainty |
| QTRUST-04 | Deterministic retrieve/clarify/knowledge-gap disposition |
| QTRUST-05 | Golden evaluation contract with required and forbidden evidence |
| QTRUST-06 | No AI output gains governed authority |

## Task

1. Add a strict schema for analyzer output, query scope, entity candidates,
   trust policy and compiled QueryPlan.
2. Treat analyzer output as untrusted. It may describe language and intent but
   cannot nominate Organization, Workspace, Mission, permission or evidence
   identifiers.
3. Define a tenant-scoped bounded Entity Registry port. Only a future
   curator-confirmed registry adapter may emit entity IDs.
4. Compile one deterministic disposition: `RETRIEVE`, `CLARIFY`, or
   `KNOWLEDGE_GAP`.
5. Preserve `REQUIRED_AT_RETRIEVAL` authorization and
   `READ_ONLY_NON_AUTHORITATIVE` authority on every plan.
6. Add a versioned golden-dataset contract containing expected entity,
   disposition, answer state, required evidence and forbidden evidence.
7. Add evaluation metrics that fail on unsafe auto-retrieval or forbidden
   evidence disclosure.

## Acceptance criteria

### QTRUST-01 — Bounded strict contracts

Every collection and string has an explicit ceiling. Unknown fields fail
validation. Query plans are versioned and deterministic.

### QTRUST-02 — Scope cannot be injected

Analyzer output containing a Workspace or other undeclared authority field is
rejected. Scope is supplied through a separately validated trusted input.

### QTRUST-03 — Explicit uncertainty

Unknown entities produce a knowledge gap. Ambiguity, close candidates, medium
confidence, low interpretation confidence and deprecated entities require
clarification.

### QTRUST-04 — Retrieval is not authority

Even a confident plan remains read-only and requires scoped authorization at
retrieval. It cannot create or prove a Claim, pass a gate, approve a contract,
waive an obligation or sign a release.

### QTRUST-05 — Evaluation integrity

The evaluation contract detects missing/unexpected cases, wrong disposition,
wrong top entity, wrong answer state, missing required evidence, unsafe
auto-retrieval and forbidden evidence disclosure.

### QTRUST-06 — Regression

Typecheck, lint and the complete unit suite pass. No database migration,
external service or UI regression is introduced.

## Constraints and deferred boundary

- No model/provider call, credential, embedding, vector store or reranker.
- No persistent ontology or Entity Registry schema before real pilot data.
- No answer generation, citation verifier or learning-loop mutation.
- No reuse of governed search results by an external provider before
  authorization filtering is proven to occur before disclosure.
- The included four-case dataset is a contract fixture, not an enterprise
  accuracy benchmark or product-performance claim.
- Existing dirty visual artifacts remain outside scope.

## Reports

- `docs/verification/TIP-024A_COMPLETION_REPORT.md`
- `docs/verification/TIP-024A_VERIFY_REPORT.md`
