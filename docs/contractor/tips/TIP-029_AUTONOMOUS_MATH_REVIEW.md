# TIP-029 — Autonomous mathematical peer review (local pilot)

Status: implemented locally. This is research triage, not a theorem certificate.

## Decision

The Math Pilot no longer requires a second account merely to exercise its
AI-native research loop. A completed `codex-local` attempt enters a separate,
durable review job. Two fresh Codex contexts take distinct roles: an argument
critic checks the proposed reasoning, and an adversary searches for a failed
step or counterexample. The result is an append-only, digest-bound review
ledger displayed inside the same dossier. The existing human review lane
remains available and is never impersonated by an agent.

## Acceptance contract

| ID | Requirement |
| --- | --- |
| MATH-AI-01 | Dispatch AI review automatically after a completed local Codex attempt; allow an explicit backfill request for retained historical attempts. The original attempt job must be complete. |
| MATH-AI-02 | Run the two roles in fresh, read-only, ephemeral Codex sessions with allowlisted environment, no application secrets, no browser-supplied prompt override, and a strict response schema. Retain role, model, session, usage, checks, exact attempt quote, disagreement/gap and reasoning. |
| MATH-AI-03 | Bind the ledger to the sealed contract, retained attempt and research dossier with SHA-256 digests. Persist it with the durable job and audit event. Forbid update/delete of the record; reject tampered/missing data at use sites. |
| MATH-AI-04 | The two fixed known-answer calibrations pass only if both roles agree and the narrow deterministic witness oracle confirms the result. They must match the same Mission/provider/model before unlocking an open case. |
| MATH-AI-05 | An open-problem result with a gap or disagreement is `INCONCLUSIVE`. Even an agreed partial result is at most `PARTIAL`/`AI_REVIEWED`; no AI-only open case becomes a certified theorem. |
| MATH-AI-06 | AI-reviewed material may enter Authoring as explicitly labeled AI assessment with the review digest and without inventing a source finding. Ordinary source-research imports retain their approved-finding requirement. |
| MATH-AI-07 | The UI shows queue/failure/result, role-specific reasoning, digests, and the scientific boundary. No second member is presented as mandatory for the local AI lane. |

## Operational and scientific boundaries

This uses the machine's ChatGPT/Codex sign-in for local acceptance testing, not
a production model API. Two roles in separate sessions of the same model are
not independent models or independent mathematicians. Exact-quote grounding,
schema checks and digests establish traceability, not soundness of a novel
proof. The deterministic oracle covers only the two sealed elementary
calibrations; it cannot validate a general mathematical conjecture.

The dispatch fence is written before invoking either review model. An
interrupted or ambiguous review is terminal: do not replay it automatically.
Failed and inconclusive dossiers remain visible. A later research iteration
must be a new, linked contract/attempt with its own budget and evidence; it
must not overwrite a prior conclusion. Production autonomy additionally
needs controlled provider identity, a hard spend/resource budget, formal
verification where possible, adversarial diversity, and an escalation path
for consequential theorem claims. Billing, Git and deployment remain paused.
