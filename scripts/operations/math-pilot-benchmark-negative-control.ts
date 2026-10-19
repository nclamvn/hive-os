/**
 * Opt-in local subscription-backed negative control. No application DB writes
 * and no paid API key. This deliberately invalid proof must not be accepted.
 */
import { CodexLocalMathReviewer } from "../../src/modules/research-sandbox/adapters/codex-local-review";
import { MATH_PILOT_BENCHMARK } from "../../src/modules/research-sandbox/math-pilot";

const argument = [
  "Let k=(a^2+b^2)/(ab+1), an integer. We checked all 1<=a,b<=500 and",
  "found that every quotient is a square. Any larger solution can be reduced",
  "to this range by Vieta jumping. Therefore every admissible quotient is a square.",
].join(" ");

const attempt = {
  providerName: "codex-local" as const,
  modelName: "gpt-6-sol",
  threadId: "negative-control-author-fixture",
  attemptType: "PROOF_ATTEMPT" as const,
  argument,
  candidateCounterexample: null,
  selfChecks: [],
  limitations: [],
  usage: { inputTokens: 0, cachedInputTokens: 0, outputTokens: 0, reasoningOutputTokens: 0 },
};

async function main() {
  const reviewer = new CodexLocalMathReviewer();
  const reports = await reviewer.review(MATH_PILOT_BENCHMARK, attempt);
  const passed = reports.every((report) => report.verdict !== "SUPPORTS" && report.unresolvedGap);
  process.stdout.write(JSON.stringify({
    gate: "KNOWN_ANSWER_FALSE_ACCEPT_CONTROL",
    passed: Boolean(passed),
    reports: reports.map((report) => ({ role: report.role, verdict: report.verdict,
      candidateConclusion: report.candidateConclusion, unresolvedGap: report.unresolvedGap,
      inputTokens: report.usage.inputTokens, outputTokens: report.usage.outputTokens })),
  }, null, 2) + "\n");
  if (!passed) process.exitCode = 1;
}

main().catch(() => {
  process.stderr.write("Known-answer negative control did not complete.\n");
  process.exitCode = 1;
});
