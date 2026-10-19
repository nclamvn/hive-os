# TIP-028 — In-procedure mathematical review desk

Status: implemented and locally verified; live independent acceptance pending.

## Decision

Review belongs inside each sealed Math Pilot dossier, not in a detached
administrative screen. The interface presents the contract and model-authored
attempt, then a source/provenance decision, then a separate mathematical
disposition. A source approval expressly does not certify a proof.

## Acceptance contract

| ID | Requirement |
| --- | --- |
| MATH-REVIEW-01 | Show the exact sealed statement, definitions, domain, assumptions, falsification/success criteria, exclusions, and attempt digest in the dossier. |
| MATH-REVIEW-02 | An authorized account distinct from the requester decides every retained finding, gives reasons and approves or rejects the source dossier in place. Missing external sources remain an honest-null record, not evidence of a theorem. |
| MATH-REVIEW-03 | Mathematical assessment is available only after source approval and digest/provider-job checks. The reviewer records five independent checks: statement fidelity; definitions/domain; argument/witness; adversarial attempts; evidence boundary. Each has a verdict and concrete note. |
| MATH-REVIEW-04 | A positive conclusion requires all five checks marked independently verified, a reasoned conclusion, independent verification notes and an explicit human attestation. Partial or inconclusive results can retain issues and gaps. |
| MATH-REVIEW-05 | The checklist and SHA-256 digest are append-only with the assessment and audit reference. A missing or mismatched checklist cannot pass calibration or enter authoring. |
| MATH-REVIEW-06 | Requesters see the pending handoff and member-management route, but no self-approval action. The local demo's two attempts remain pending until a real distinct reviewer acts. |
| MATH-REVIEW-07 | Any authoring import carries the mathematical conclusion, rationale, independent-check notes and ledger digest into the evidence section; partial/inconclusive results are explicitly marked as no theorem accepted. |

## Boundaries

The checklist is a structured human attestation, not a formal proof checker.
Server validation can ensure completeness, identity separation, digest integrity
and permitted transitions; it cannot establish that a reviewer actually proved
each mathematical step. A positive review is an auditable, bounded assessment.
For a genuinely open problem, `PARTIAL` and `INCONCLUSIVE` are first-class
outcomes and no system message should inflate them into theorem acceptance.

Existing historical assessments lacking the TIP-028 checklist remain readable
but do not satisfy the new calibration/import gate. Do not fabricate a reviewer,
backfill an attestation or mutate the two live pending attempts to make the
pilot appear complete.
