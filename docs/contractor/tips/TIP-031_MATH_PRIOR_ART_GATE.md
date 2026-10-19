# TIP-031 — Source-bound prior-art gate for autonomous mathematics

Status: local implementation, bounded first catalog. This closes the specific
false-gap failure observed in the first live Erdős–Straus cycle; it is **not** a
complete autonomous literature-review or theorem-proving system.

## Incident and correction

TIP-030 retained a root critique that incorrectly treated `n ≡ 5 (mod 12)` as
unresolved. Its task verifier compared novelty only with prior internal tasks.
The solver then reconstructed a valid decomposition for that class, but the
class is already covered by the published `n ≡ 2 (mod 3)` identity. Since
`5 ≡ 2 (mod 3)`, it was progress in execution, not a new mathematical result.

The historical proposal, review and token-limit stop remain immutable. The
existing dossier now marks that task as known *retrospectively* and links its
source. New rounds receive source-bound facts in both planner and verifier
contexts, record the exact partial catalog in the digest-chained event trace,
and deterministically reject an explicitly targeted congruence class wholly
contained in a known class before dispatching the solver. The check is narrow:
an unparsed task is `UNKNOWN`, never automatically called novel.

## Boundaries

- The three curated facts cover Erdős–Straus `n ≡ 2 (mod 3)`, `n ≡ 3 (mod 4)`
  and `n ≡ 5 (mod 8)`.
  The `mod 3` class is documented by Kishan, Rani and Agarwal (2011):
  https://scialert.net/fulltext/?doi=aja.2011.31.37 . The `mod 4` and `mod 8`
  classes follow from the displayed identities in Tao's account:
  https://terrytao.wordpress.com/2011/07/07/on-the-number-of-solutions-to-4p-1n_1-1n_2-1n_3/ .
- Catalog coverage is partial and versioned through the code and per-round
  event payload. It is not a live web search, bibliographic completeness
  certificate, different-model review, Lean proof, or human attestation.
- A valid candidate identity, a finite search and agreement between LLM roles
  remain separate from a new theorem. Existing `INCONCLUSIVE` root and stopped
  cycle remain unchanged. No paid API, billing, Git push or deployment is part
  of this step.

## Next architecture gates

1. Build a problem-scoped literature intake that captures source text,
   canonical URI, publication metadata, exact cited passages and content
   digests; a second agent should challenge relevance and quantifier matching.
   Retrieval-augmented premise selection is supported by the LeanDojo paper:
   https://arxiv.org/abs/2306.15626 . A model's recollection is not evidence.
2. Give each candidate a machine-checkable obligation when feasible: exact
   rational/algebraic identity checks, reproducible exhaustive search with a
   declared bound, or a Lean statement and kernel-checked proof. Formal
   feedback is central to AlphaProof's published approach:
   https://research.google/pubs/olympiad-level-formal-mathematical-reasoning-with-reinforcement-learning/ .
3. Search several independent strategies under a common resource scheduler,
   retaining failures and counterexamples, then score only via executable
   evaluators before AI critique. This follows the evaluator-backed principle
   in FunSearch: https://www.nature.com/articles/s41586-023-06924-6 .
4. Require source novelty, exact verification, adversarial review and a
   provenance-bound acceptance record before promoting any claim. A distinct
   provider or mathematician may strengthen confidence but neither substitutes
   for a proof checker where one is available.

The present TIP implements the first correction and its guard, not gates 1–4
as a completed general research platform.
