# TIP-033 — Mathematical research kernel v2

Status: **LOCAL FOUNDATION + BOUNDED FORMAL PILOT + BOUNDED PORTFOLIO IMPLEMENTED; SCIENTIFIC ACCEPTANCE OPEN** (2026-09-30).

## Objective and evidence ceiling

Turn the existing bounded Math Pilot from a linear, prose-heavy agent debate into
an evidence-directed research process. Agents may generate and challenge ideas;
neither agreement between agents nor a finite computation may certify an
unbounded theorem. The immutable problem contract and old research ledgers are
never rewritten. This TIP does not activate a paid provider, publish a result,
or authorize deployment.

The procedure distinguishes four independent questions:

1. **What exactly is claimed?** Preserve domain, quantifiers, definitions,
   implications and all dependencies. A derived subproblem is not the root.
2. **Can it be falsified?** Run an exact, bounded typed probe and a different
   fixed implementation where supported; bind both outputs to the ledger.
3. **Is there a proof?** Separate the model's informal argument from a proof
   checked by a formal kernel. A compiler result is not semantic alignment.
4. **Is it new and relevant?** Compare precise scope with captured primary
   sources; metadata or absence from a partial catalog is not novelty.

## Implemented foundation

- A deterministic, read-only obligation DAG is projected from each validated
  cycle ledger. For every proposed task it links the source review gap to a
  hypothesis, then to falsification, proof and prior-art obligations. Stable
  node IDs and the source ledger digest permit traceability without adding
  mutable theorem-status rows or changing historical events.
- States are intentionally non-promotional: `AI_REVIEWED`, `FINITE_REPLAYED`,
  `NOT_REFUTED_IN_BOUND`, `TYPED_REFUTATION` and `RESEARCH_ONLY` are not
  `FORMALLY_PROVED`. A typed probe refutes its typed predicate; prose
  equivalence is a separate task-verification question.
- The planner and separate task verifier receive retained obligation memory.
  An exactly repeated hypothesis, after Unicode/whitespace/case normalization,
  is stopped before source review and solver dispatch. This is an **exact-repeat
  resource gate**, not a semantic-equivalence detector; paraphrases still
  require adversarial review. The cap of eight prior cycles remains in force.
- The Math Pilot UI exposes the obligation map in each round, with honest
  status wording and no theorem badge. Explicit TeX delimiters in displayed
  statements, attempts and reviews are rendered through KaTeX; malformed TeX
  falls back to escaped source. Raw text and SHA-256-bound source data are
  unchanged. The benchmark's mathematical target has a separate presentation
  formula, not a revised contract.

### Historical mathematical notation presentation follow-up

The initial TeX renderer did not cover old sealed attempts written in plain
ASCII/Unicode notation. A conservative display-only adapter now recognizes
bounded expressions such as `a²+b²=k(ab+1)`, `P(a)=(a−b)(a−c)` and
`p≡1 (mod 840)` in prose fields. It preserves exact source bytes, leaves
ambiguous/unsupported prose untouched, and retains the original attempt behind
an in-place disclosure. Equations are KaTeX/MathML, with overflow confined to
the expression at narrow widths; mathematical headings carry their original
statement as an accessible label. The adapter does not parse or validate proof
content and does not change any existing digest, evidence status or gate.

## Formal-proof gate — bounded local pilot, not publication certification

Required order before any `FORMAL_PROVED` status may exist:

1. Seal a `FormalStatement` containing theorem namespace, formal source,
   imported library versions, exact natural-language contract digest and a
   human-readable quantifier/domain map. A separate semantic-alignment review
   must confirm that the formal statement neither weakens assumptions nor
   changes the conclusion. Human confirmation is required for publication-level
   claims; an AI alignment review alone may authorize exploration only.
2. Seal a `ProofCandidate` that names the formal statement digest. Execute
   untrusted source only in a digest-pinned, no-network, read-only-rootfs
   container with CPU, memory, time, process and output ceilings. No host Lean
   execution or model-authored shell commands.
3. Run Lean on the sealed source, then independently inspect the named theorem's
   transitive axiom dependencies. Reject `sorryAx`, user axioms, incomplete
   goals, mismatched theorem names, missing compiler/toolchain provenance and
   any source/output hash mismatch. Pin mathlib and Lean together. Retain the
   exact source, image digest, diagnostic output and result in the event chain.
4. Only a successful checker result **and** statement-alignment gate can label
   the formal statement as proved. The root problem inherits that status only
   when a separately checked implication from formal theorem to root contract
   closes every remaining obligation. Existing IMO/mathlib theorem pages are
   prior art, not replay of a newly generated proof.

The local pilot now implements a narrower version of steps 1–3 for two fixed
known-answer problems: it seals a contract-bound Lean target, accepts only
model-authored tactics, compiles in a pinned no-network Lean 4.10 image,
audits axioms, retains a bounded repair trace, and can replay the retained
`.olean` with a separately built, pinned `lean4checker --fresh`. The same
Lean kernel is used in both executions. An authenticated operator can record a
four-part, append-only semantic-alignment checklist, but no live case has been
attested yet. The system deliberately stops at
`KERNEL_ACCEPTED_ALIGNMENT_PENDING` / `REPLAY_ACCEPTED`, without
`FORMAL_PROVED`, root-contract inheritance, or a benchmark pass. It fails
closed when the runtime is missing. Details:
`docs/operations/MATH_PILOT_FORMAL_GATE_2026-09-30.md`.

The open-problem lane still needs formalization of useful intermediate lemmas,
the checked implication back to its root contract, and expert-independent
semantic/novelty review. See the [Lean axiom reference](https://lean-lang.org/doc/reference/latest/Axioms/)
for why compilation alone does not exclude `sorryAx`.

## Review provenance and public regression controls

New AI-review ledgers use version 3, and new in-cycle `REVIEWED` events carry
the same provenance without changing historical event digests. Each role
records its requested Codex CLI model, provider lane, context ID and the limited identity evidence type
`REQUESTED_CLI_MODEL`. The ledger remains append-only and digest-bound; old
versions 1 and 2 retain their original validation and digest. A distinct
requested model can be selected for ADVERSARY with
`MATH_REVIEW_ADVERSARY_MODEL` in the local research worker environment. The
default is still the same model in two fresh contexts. Requested settings are
not provider attestation, and two models from one subscription/provider are
not independent providers. The UI states this distinction explicitly.

`tsx scripts/operations/math-review-regression.ts` runs a frozen, SHA-256-bound
public suite: two valid proofs and three intentionally flawed proofs (finite
sample extrapolation, circular invocation and an invalid Vieta root-order
inference). Labels are supplied only to the scoring function, not to reviewer
prompts. The report includes false accept/reject counts, role verdicts,
observed tokens and elapsed time; named cases can be selected for a bounded
smoke test and `--repeat=2` or `--repeat=3` tests stability. This is
**development regression**, not a private held-out test or
an IMO capability estimate. A later independently curated held-out suite must
be versioned before evaluator exposure, repeated under recorded models and
compared with this public baseline. No public regression pass promotes a
theorem or closes human semantic/publication gates.

## Autonomous portfolio gate — bounded local implementation

For unsteered local cycles, one planner call proposes two or three distinct
*logical* branches. The server binds each branch to an exact root-review gap,
its review-digest-derived parent ID (or a matching prior cycle GAP obligation),
anticipated falsifier, information-gain estimate, declared executable tool
needs and a per-branch observed-token/time ceiling. Only tools available in
this cycle are admitted; a branch cannot claim Lean checking. A digest seals the entire
portfolio. The deterministic scheduler favors an executable falsification
before model-stated information gain, skips exact repeated claims, and selects
one branch per round. The existing durable cycle contract admits at most two
rounds: a third candidate is explicitly `NOT_RUN`, not a negative result.
There is no simultaneous model-call fan-out.

`PORTFOLIO_PLANNED`, `BRANCH_SELECTED`, `BRANCH_CLOSED` and
`PORTFOLIO_EXHAUSTED` are append-only, replay-validated events. A local typed
refutation, rejected task, sourced-known overlap, or branch resource ceiling
closes that branch and can advance the next pending branch within the global
envelope. Integrity, provider and frontier failures remain fail-closed.
Observed-token/time ceilings are checked **before** a call, not enforced
mid-call; one call may overshoot. The existing per-call timeout remains 4
minutes. Failure maps distinguish pruned, reviewed, failed and not-run branches.
Human-steered and historical linear cycles retain their original reading and
execution paths. No branch state certifies a theorem or novelty.

## Independent review gate — not yet implemented

Fresh contexts of `gpt-6-sol` are useful adversarial roles but not independent
models. A future review policy must record model family/provider separately
for each role, blind reviewers to each other's verdict until both complete,
and accept a stronger conclusion only after executable checks. A second model
can reduce correlated errors; it is still not a proof checker. The current
`agent-review-kernel` requires the same model identity, so merely changing the
reviewer model string would violate its contract. A schema/migration and
explicit compatibility tests are required before changing this policy.

## Human gates and evaluation

Routine hypothesis generation, falsification, proof attempts, source triage,
branch pruning and bounded computation should be AI-operated. Human approval is
reserved for the initial problem contract, a materially different research
direction/resource envelope, semantic alignment of a formal statement for a
high-impact claim, and external theorem/novelty publication. Humans should
not have to act as routine agent reviewers.

The known-answer lane must keep solutions/holdout proof out of solver context;
measure true accepts, false accepts on deliberately invalid proofs, time and
observed tokens across a *suite* rather than one IMO example. The open-problem
lane must separately measure replayed finite findings, independently checked
lemmas, source-scope agreement, repeated-task rate and false promotion rate.
One successful IMO 1988 Q6 attempt is not a general IMO capability estimate.

## Acceptance matrix

| Gate | Required evidence | Current state |
| --- | --- | --- |
| Obligation projection | Stable DAG, valid source ledger, no theorem promotion, duplicate gate | Implemented; unit tests |
| Mathematical typography | Explicit TeX, conservative historical notation, raw-source disclosure, escaped prose, invalid fallback, narrow-screen overflow | Implemented; unit/build/browser and 320px E2E overflow pass |
| Executable falsification | Typed bounded arithmetic and separate replay before review | Existing for Erdős–Straus; not general |
| Formal proof | Pinned Lean container, axiom audit, separate fresh kernel replay, semantic alignment, sealed result | Local calibration pilot implemented; operator/expert alignment and open-problem proof open |
| Independent models | Distinct recorded model provenance, blind review, negative controls | Per-role requested-model provenance and public controls implemented; provider attestation, private held-out suite and cross-provider independence open |
| Research portfolio | Sealed 2–3 candidate manifest, one branch per round, parent gap identities, per-branch ceilings, replayed event chain and failure map | Local implementation and unit/integration tests; live scientific yield unmeasured |
| Scientific acceptance | Formal/general proof or exact counterexample, complete scope and primary-literature review | Open |

The next evaluation slice is an independently curated, preregistered held-out
suite, repeated runs under recorded models and one observed portfolio run on a
versioned mathematical target. Do not add an automatic theorem badge or simply
raise the round/token limit. Preserve fail-closed behavior if a runtime is
missing, an external source is unavailable, or an agent call is ambiguous.

Verification details and unrelated dependency-audit findings are retained in
`docs/verification/TIP-033_MATH_RESEARCH_KERNEL_V2_VERIFY_REPORT.md`.
