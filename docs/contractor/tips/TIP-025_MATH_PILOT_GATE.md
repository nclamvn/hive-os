# TIP-025 — Mathematics Pilot Gate

Status: implemented locally; live provider calibration pending.

## Objective

Before an unsolved mathematics problem is queued, HIVE OS must prove that its
governed research workflow can preserve an exact problem statement, retain
sources, require independent review, and classify two known-answer cases
without silently calling a plausible answer a proof.

## Product contract

1. A math case belongs to an authorized Mission and an ordinary ResearchRun.
2. The server fixes both calibration statements; the browser cannot replace
   them. The worker receives the statement and neutral scope, never the
   expected calibration label.
3. An open case requires a statement, definitions, assumptions, falsification
   criterion, success criterion, and exclusions. The canonical contract is
   SHA-256 sealed and append-only. A database trigger also freezes ResearchRun
   question, scope, source policy, query plan, provider, model and requester.
4. The existing research review approves only source-bound findings. A
   separate, append-only MathPilotAssessment records a human classification,
   rationale, and independently performed checks. The requester cannot assess
   their own case.
5. An open case can be queued only after both calibration types have an
   approved, digest-valid research dossier and the expected independent
   classification for the same Mission, provider and model.
6. Authoring import of a math-pilot dossier is blocked until its separate
   assessment exists and is bound to the approved research digest.
7. `SUPPORTED_ARGUMENT` is not a formal theorem certificate. A novel theorem
   claim still requires domain-expert review and, where appropriate, a
   separate formal proof check against the intended statement.

## Calibration cases

- General argument: every even integer has an even square.
- Counterexample: the assertion that every prime is odd.

The positive/negative oracle is kept in the server-side gate. It is not sent
in the worker input. These elementary cases calibrate workflow honesty; they
are not a frontier-mathematics benchmark and do not certify autonomous theorem
proving.

## Acceptance

| ID | Criterion |
| --- | --- |
| MATH-01 | Open case is denied before both calibrations |
| MATH-02 | Same Mission/provider/model and exact contract/digest are required |
| MATH-03 | Self-assessment and second assessment are denied |
| MATH-04 | Immutable contract, approved research and assessment are separately retained |
| MATH-05 | Math authoring import waits for assessment |
| MATH-06 | Local DB migration, RLS, unit, integration, UI and accessibility pass |
| MATH-07 | Live worker completes both cases with provider usage and human attestation |

`MATH-07` is intentionally deferred until runtime credentials, a distinct
service actor, a second human reviewer and the owner's pilot budget are
available. A fake adapter passing integration tests does not satisfy it.
