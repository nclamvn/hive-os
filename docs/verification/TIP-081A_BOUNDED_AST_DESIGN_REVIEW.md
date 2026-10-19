# TIP-081A — Bounded-consumer design review history

2026-10-07. Read-only document review, not product validation.
Reviewer: /root/ast_design_reader, fresh context containing document and review task.
No code edits, source acquisition, parser import/invocation, tests or runtime effects.

## First review — revision 1

All B1–B6 topics present; five specification gaps prevented an unambiguous
implementation contract. No expansion of runtime/math authority was identified.

1. “Exact schema” lacked full fields/types and deterministic canonical encoding.
2. Private replay and cross-version exclusion were obligations, not concrete seams.
3. State machine omitted producer-AST retirement and verifier replay; charge
   reclamation after reference retirement was ambiguous.
4. Depth+1 controls had no specified depth ceiling.
5. First codec/admission inventory was not distinguished from full grammar audit.

Reader correctly identified: design-only authority; stock Acorn inadmissible;
context-bound historical v1 seal; logical rather than RSS cap; controlled-driver
exclusion only; shared grammar common-mode risk; next synthetic codec/admission
route needs separate approval. Reader could not infer missing private seam details.

## Contractor revision 2

Appendix A defines descriptor/accepted/refusal purposes, exact nested fields/types,
seal exclusions, canonical encoding, timestamps, size/depth/schema limits and
synthetic-mode exceptions. No v1 rewrite or authority adoption.
Owner and independent replay algorithms are lexical in one new trusted module;
public caller callbacks/text-taking hooks remain prohibited. Controlled fresh
process/serial-driver protocol explicitly proves only its own v1 retirement.
Producer-summary/AST-retired/verifier states added; disposed producer allocations
remain conservatively reserved through replay, no GC claim or silent reclamation.
Depth128 specified. First-route inventory covers codec/admission only; complete
adapter audit remains separate and parser disabled.

These are design refinements within the approved design scope, not implemented
fixes or measured tests. Original real-source receipt/capture and frozen46pins
are not modified by this review.

## Second review — revision 2

Reviewer verdict: CLEAR for the five prior findings; no new blocking contradiction
within this re-review's scope. B1–B6 reader coverage6/6, document-level only.
Exact codec fields/canonical rules, private lexical replay, controlled-driver
retirement, unreclaimed producer charge, depth128 and scoped first inventory
answered the prior gaps. Shared grammar/ownership risks remain expressly declared.
No stock parser, actual-source parsing, runtime release or mathematical closure
follows from document clearance. Next route remains separately approved synthetic
codec/admission implementation, parser disabled. Main accepts this scoped review.
