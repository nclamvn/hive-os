# Math Pilot: bounded formal-check gate (local pilot)

Status: implemented and tested locally; **not** a theorem-certification or production release gate.

## Why this gate exists

The existing AI reviewer can examine an informal proof, but agreement among AI
roles is not independent mathematical verification. This gate retains a second,
explicitly bounded artifact: model-authored Lean tactics inserted into a
**trusted, contract-bound theorem declaration**. The candidate cannot edit the
quantifiers or conclusion. The retained result is append-only and digest-bound
to the original contract, model attempt, research dossier, target declaration,
generated Lean source, and checker output.

The first two targets are the even-square calibration and IMO 1988 problem 6.
The open Erdős–Straus mission is intentionally **not** assigned a formal target:
its research question has not been reduced to an independently aligned formal
statement and no general proof is known here.

## Runtime and decision semantics

1. An authorized user requests the gate on a completed, integrity-valid local
   proof attempt. A durable command enqueues one case-bound job.
2. A fresh Codex-local model session supplies tactic lines only. It has no
   workspace tools and cannot choose the theorem statement.
3. Lean 4.10.0 runs in the pinned image
   `leanprovercommunity/mathlib@sha256:e251cad58fa2b8010782259d7df19eda2529dfbc1dcd0d511d3412d62eee7e3f`
   with no network, read-only root, dropped capabilities, unprivileged user,
   CPU/memory/PID/output/time ceilings, and a read-only source mount. Despite
   its image name, this pilot imports `Std`, **not mathlib**.
4. If the first candidate fails to compile, one fresh bounded model call may
   receive sanitized Lean diagnostics and submit a full replacement tactic.
   Both checked candidates and their model usage are retained in the append-only
   repair trace. A failed repair call preserves the first checker result.
5. Compiler diagnostics and `#print axioms` are parsed. Disallowed axioms,
   incomplete proofs (`sorry`/`sorryAx`), compiler errors, ambiguous output, or
   missing runtime fail closed. `REJECTED` describes this *candidate*, not the
   mathematical theorem.
6. The primary result remains `KERNEL_ACCEPTED_ALIGNMENT_PENDING`: Lean
   accepted the exact fixed statement under the recorded axiom audit. A second
   operator-requested job recompiles the exact retained source and invokes a
   separately built, commit-pinned `lean4checker --fresh` on the `.olean`. Its
   append-only result is bound to the primary check, source, target, checker
   image ID and checker output. `REPLAY_ACCEPTED` is stronger evidence of
   kernel acceptance, **not** a new mathematical conclusion: the checker still
   uses the Lean 4.10 kernel, and has not validated the informal-to-formal
   translation.
7. After an accepted replay, an authenticated research reviewer may record a
   four-part statement alignment checklist (domain/quantifiers, assumptions/
   definitions, exact conclusion, boundaries/notation). This is a local,
   append-only, digest-bound operator attestation with an audit event. Any
   issue or uncertainty remains visible; even `OPERATOR_ALIGNED` is not an
   independent expert review or permission to publish.

The UI exposes the formal declaration, informal-to-formal alignment map,
candidate tactics, checker replay, operator checklist, runtime images and
digests. No replay or checklist result changes the original research
conclusion or awards a benchmark pass.

## Explicit remaining gates

- Expert-independent mathematical review of the translation, including domain,
  positivity, divisibility and quotient semantics. The operator checklist is
  an aid, not an expert certificate. The live record remains pending until
  someone actually completes it; tests do not constitute an attestation.
- Diverse proof validation beyond Lean 4.10's own kernel, if a publication or
  high-assurance claim calls for it. `lean4checker --fresh` is a separate binary
  and fresh environment, not a different foundational checker.
- A held-out benchmark ladder with preregistered tasks, failure taxonomy and
  repeatability measurements. The public IMO and FrontierMath samples are
  development calibrations, not blind benchmark scores.
- A broader formalization strategy for useful intermediate lemmas on open
  problems. One successful calibration cannot certify the general agent method.

## Verification performed

- Unit checks for the trusted target registry and forbidden tactic syntax.
- Integration check of authorized request, idempotent dispatch, bound worker
  result, append-only persistence, and read-time integrity validation.
- Container checks for a positive elementary proof and a negative Lean compile,
  plus a positive `lean4checker --fresh` replay in the immutable local image,
  alongside the existing isolated-computation checks.
- An integration check of authorized replay dispatch, worker retention, digest
  tamper rejection, four-part operator attestation, immutable rows and audit.
- Typecheck, lint, and production build.

The authenticated local browser replay on the sealed even-square calibration
completed on 2026-09-30 with `REPLAY_ACCEPTED` and retained replay SHA-256
`abdd57b971d1ed0a5811c8ba0e3a80d29fb0f4a23b7ff0495f1e5f779905c04d`.
The UI still shows “alignment pending”; no operator attestation was made on
behalf of the user.

Run local pilot with `MATH_PILOT_QUEUE_ENABLED=true`,
`RESEARCH_CODEX_LOCAL_ENABLED=true`, `MATH_FORMAL_LEAN_IMAGE` set to the exact
digest above, and `MATH_FORMAL_REPLAY_IMAGE` set to the local immutable ID
produced by `scripts/math/build-formal-replay-image.sh`, on both web and
research worker. These local flags must not be silently enabled in staging or
production. The checker source is pinned to official lean4checker tag v4.10.0
and commit `0c3323271991c2dfe75f8be7d21bf93886419736`.
