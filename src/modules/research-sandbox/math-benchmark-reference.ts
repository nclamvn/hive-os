import { MATH_PILOT_BENCHMARK } from "./math-pilot";

/** Review-only holdout. Never include this metadata in a solver request. */
export const MATH_BENCHMARK_REFERENCE = {
  contract: MATH_PILOT_BENCHMARK,
  source: "International Mathematical Olympiad 1988, Problem 6",
  sourceUrl: "https://www.imo-official.org/problems/1988/",
  formalStatementUrl: "https://leanprover-community.github.io/mathlib4_docs/Archive/Imo/Imo1988Q6.html",
  expectedConclusion: "SUPPORTED_ARGUMENT" as const,
  reviewRubric: [
    "The theorem is known to be true; that fact does not validate this attempt. Review the supplied argument, not a proof you already know.",
    "Check the integer quotient and the universal quantifier over all positive a,b. A finite sample or a source citation is insufficient.",
    "For a Vieta-descent argument, verify the exact polynomial identities, integrality and positivity of the second root, strict decrease of a positive measure, and every boundary case. Do not supply a missing step on the author's behalf.",
    "An alternative complete proof may pass; do not require a particular named technique. If any essential inference is absent or circular, challenge the attempt even though the theorem itself is true.",
  ].join("\n"),
} as const;
