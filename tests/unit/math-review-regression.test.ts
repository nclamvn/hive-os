import { describe, expect, it } from "vitest";

import type { MathAgentReport } from "@/modules/research-sandbox/agent-review";
import { MATH_REVIEW_REGRESSION_CASES, MATH_REVIEW_REGRESSION_SUITE_DIGEST,
  scoreMathReviewRegression } from "@/modules/research-sandbox/math-review-regression";

function reports(caseId: string, verdict: MathAgentReport["verdict"]): [MathAgentReport, MathAgentReport] {
  const fixture = MATH_REVIEW_REGRESSION_CASES.find((item) => item.id === caseId)!;
  return (["CRITIC", "ADVERSARY"] as const).map((role) => ({
    role, verdict, candidateConclusion: "SUPPORTED_ARGUMENT" as const,
    exactQuote: fixture.attempt.argument.slice(0, 20),
    reasoning: "This fixture response tests the scoring boundary and does not evaluate the actual proof.",
    checks: ["Checked the scoring boundary against the sealed fixture label."],
    unresolvedGap: verdict === "SUPPORTS" ? null : "The claimed general inference is not established.",
    threadId: `${role}-${caseId}`, usage: { inputTokens: 10, cachedInputTokens: 0,
      outputTokens: 5, reasoningOutputTokens: 1 },
  })) as [MathAgentReport, MathAgentReport];
}

describe("public math-review regression suite", () => {
  it("freezes the public fixture set and includes valid and invalid proofs", () => {
    expect(MATH_REVIEW_REGRESSION_SUITE_DIGEST).toBe("55e05678bad7daf6abe6cf0a5c88017216d0e902770eb3d83bca3210ac027d31");
    expect(new Set(MATH_REVIEW_REGRESSION_CASES.map((item) => item.id)).size).toBe(MATH_REVIEW_REGRESSION_CASES.length);
    expect(MATH_REVIEW_REGRESSION_CASES.filter((item) => item.label === "VALID")).toHaveLength(2);
    expect(MATH_REVIEW_REGRESSION_CASES.filter((item) => item.label === "INVALID")).toHaveLength(3);
  });

  it("flags false acceptance separately from false rejection", () => {
    expect(scoreMathReviewRegression({ caseId: "imo-finite-sample-invalid",
      reports: reports("imo-finite-sample-invalid", "SUPPORTS"), elapsedMs: 100 })).toMatchObject({
      falseAccept: true, falseReject: false, correct: false, observedTokens: 30 });
    expect(scoreMathReviewRegression({ caseId: "imo-finite-sample-invalid",
      reports: reports("imo-finite-sample-invalid", "CHALLENGES"), elapsedMs: 100 })).toMatchObject({
      falseAccept: false, correct: true });
    expect(scoreMathReviewRegression({ caseId: "even-square-valid",
      reports: reports("even-square-valid", "CHALLENGES"), elapsedMs: 100 })).toMatchObject({
      falseReject: true, correct: false });
    expect(() => scoreMathReviewRegression({ caseId: "unknown", reports: reports("even-square-valid", "SUPPORTS"),
      elapsedMs: 0 })).toThrow(/Unknown regression case/);
  });
});
