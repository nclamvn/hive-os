# Math Pilot public exact-answer benchmark lane

Date: 2026-09-29. Scope: local mathematics pilot only.

## Why this lane exists

The browser test of Epoch AI's public FrontierMath Tier 1 101-gon sample produced
a plausible finite expression for the expected perimeter, but the old OPEN lane
forbade tools. It retained a PARTIAL attempt and two INCONCLUSIVE AI reviews.
Neither record was edited or reclassified.

The new `BENCHMARK_EXACT` lane is a fixed, digest-sealed version of that public
problem. It is available only after both model-matched calibrations pass. The
published answer and review rubric live in a separate review-only module and
are not placed in the solver request. The problem and solution are credited to
[Epoch AI](https://epoch.ai/frontiermath/tiers-1-4/benchmark-problems). This
public sample is potentially contaminated and **cannot count as an official
blind FrontierMath benchmark score**.

## Procedure and safety boundaries

The worker validates the sealed case contract and forwards its case type to
the solver adapter before dispatch. Earlier local attempts did not receive
this field and therefore used the generic math prompt; they are retained as
historical diagnostics, not scored exact-lane runs. A dead-letter AI review
does not silently retry a subscription-backed call or rewrite its attempt; it
is shown as failed, while a new browser-started case may proceed.

1. The Codex-local solver may use local Python arithmetic in its empty,
   read-only sandbox. It may not browse or read local research files. It must
   submit the argument, a decimal integer (or null), and bounded stdlib-only
   Python source defining `answer()` whenever it proposes executable code,
   even if it cannot yet compute the answer. If the model instead embeds the
   source at the end of its argument, a narrow intake adapter copies that
   exact source into the computation field **before** sealing and marks its
   origin `EXTRACTED_FROM_ARGUMENT`; the original argument is unchanged.
   This never supplies an answer on the model's behalf. The attempt and usage
   are retained with their existing digest.
2. A separate worker re-executes the submitted code in a digest-pinned Python
   Docker image with no network, read-only root, no privileges, an unprivileged
   user, 256 MiB memory, 0.75 CPU, 64 processes, 30-second wall limit and
   4 KiB combined output limit. The replay result binds the image reference,
   code digest, claimed integer and observed integer into the review ledger.
3. Only after the attempt is sealed does the review kernel compare the claimed
   integer with the published answer. A matching integer and replay are both
   necessary for a favorable AI-supported classification. Two fresh AI review
   contexts must also support the argument without a recorded gap.
4. The UI separates proposed answer, submitted code, replay status and AI
   disposition. A program that computes an integer without a solver-claimed
   answer is marked `COMPUTED`, not `PASS`, and cannot get a favorable verdict.
   It does not display the expected answer before the attempt.

The replay is independent **execution of the submitted program**, not an
independent mathematical derivation. A hard-coded or memorized public answer
can still match. The AI roles must inspect the geometric model and numerical
error control; their agreement is not a formal proof or a guarantee that the
floor is rigorously established. If Docker is not configured, the replay is
`UNAVAILABLE` and the case cannot receive a favorable AI classification.

## Verification record

- Prisma migration adds the new enum value without rewriting historical cases.
- Unit tests cover the sealed no-answer contract, answer/replay/reviewer gates,
  digest mismatch and the display-only `101-gon` typography correction.
- Integration tests cover pre-calibration denial, authorized case creation and
  duplicate-active-case denial.
- A real digest-pinned local Python container returned a matching `answer()`
  result for a small deterministic replay smoke test.
- The first live exact-lane case (`8613343b-99ba-4d8f-b28a-4e462fcfb8f2`)
  completed as `PARTIAL` / `INCONCLUSIVE`: the solver provided no typed answer
  or typed code, and both reviewers identified that gap. No benchmark pass was
  recorded. The solver did include an unsubmitted Python program in its prose;
  an **out-of-band diagnostic** replay of that code in the pinned container
  returned the published integer. This diagnostic is not part of the sealed
  case or its review ledger and is not a numerical-error certificate.
- A second browser-started case (`364ee8ce-1a3d-4db2-8d2c-8fe66185f72b`)
  also returned `PARTIAL`, with executable source only in prose and no claimed
  integer. It completed `INCONCLUSIVE`; the sealed replay recorded
  `FAIL/NO_CODE_OR_ANSWER`. This exposed the structured-output failure that
  motivated the pre-seal extraction adapter. Historical case data remain
  untouched.
- A third historical attempt (`d056dea8-66bc-4ebf-9422-49a45b9a6459`)
  also used the generic prompt because the worker omitted the sealed case
  type; its later AI-review job dead-lettered. Neither result was upgraded or
  retried in place. An integration assertion now fails if a local calibration
  reaches a provider without its case type.
- The first correctly routed browser E2E case
  (`b78e7029-9a3b-4966-b7cc-b22a7199b653`) returned a typed claimed
  integer `4771880153` and 2,735 characters of model-authored Python in the
  structured field (`MODEL_FIELD`). No answer literal appears in that code.
  The digest-bound Docker replay recorded `PASS/MATCH` and the same observed
  integer. One reviewer supported the derivation; the other challenged the
  asserted but unproved `10^-40` numerical-error bound. The sealed final
  classification is `INCONCLUSIVE`, not a benchmark pass or mathematical
  certificate. The exact replay code digest is
  `6202a1d0b2fa1864ef2b84365e80d214f1927d0f49d6ea8fc4b74c591a372b0e`.
