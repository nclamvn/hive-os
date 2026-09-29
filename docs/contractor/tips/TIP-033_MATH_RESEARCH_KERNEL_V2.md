# TIP-033 — Mathematical research kernel v2

Status: **LOCAL FOUNDATION IMPLEMENTED; FORMAL AND PORTFOLIO GATES OPEN** (2026-09-29).

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

## Formal-proof gate — not yet implemented

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

No Lean executable or pinned Lean/mathlib runtime is currently configured in
the local pilot. The product must say `FORMAL_CHECK_UNAVAILABLE`, not silently
fall back to model review. See the [Lean axiom reference](https://lean-lang.org/doc/reference/latest/Axioms/)
for why compilation alone does not exclude `sorryAx`.

## Autonomous portfolio gate — not yet implemented

Move from one selected task per round to at most three concurrent *logical*
branches (not unbounded simultaneous paid calls). Each branch must have a
typed target, parent obligation IDs, anticipated falsifier, expected
information gain, declared tool needs and an observed-token/time ceiling.
The scheduler should prefer a branch that can eliminate more uncertainty with
an exact test, retain at least one mathematically different line of attack,
and stop dominated or already refuted branches. No branch may mutate a
different branch's sealed evidence. On exhaustion, the system returns a
structured failure map and asks the human only for a new research direction or
resource authorization. It never invents a theorem to close the run.

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
| Formal proof | Pinned Lean/mathlib container, axiom audit, semantic alignment, sealed result | Open |
| Independent models | Distinct recorded model provenance, blind review, negative controls | Open |
| Research portfolio | Bounded branch scheduler and durable branch dependencies | Open |
| Scientific acceptance | Formal/general proof or exact counterexample, complete scope and primary-literature review | Open |

The next implementation slice should be the formal-statement/semantic-alignment
contract and pinned checker, **not** an automatic theorem badge or a higher
round/token limit. Then change review provenance and build the bounded portfolio
on the same obligation IDs. Preserve fail-closed behavior if a runtime is
missing, an external source is unavailable, or an agent call is ambiguous.

Verification details and unrelated dependency-audit findings are retained in
`docs/verification/TIP-033_MATH_RESEARCH_KERNEL_V2_VERIFY_REPORT.md`.
