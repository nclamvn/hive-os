import { canonicalJson } from "@/modules/execution-fabric/contracts";

import { evaluateMathAgentReview, type MathAgentReport } from "./agent-review";
import { mathModelAttemptSchema } from "./contracts";
import { sha256 } from "./integrity";
import { digestMathPilotContract, MATH_PILOT_BENCHMARK, MATH_PILOT_CALIBRATIONS,
  type MathPilotContract } from "./math-pilot";

const usage = { inputTokens: 0, cachedInputTokens: 0, outputTokens: 0, reasoningOutputTokens: 0 };

function proof(argument: string, id: string) {
  return mathModelAttemptSchema.parse({ providerName: "codex-local", modelName: "gpt-6-sol",
    threadId: `regression-author-${id}`, attemptType: "PROOF_ATTEMPT", argument,
    candidateCounterexample: null, selfChecks: [], limitations: [], usage });
}

export const MATH_REVIEW_REGRESSION_CASES = [
  {
    id: "even-square-valid",
    label: "VALID" as const,
    contract: MATH_PILOT_CALIBRATIONS.CALIBRATION_PROOF,
    attempt: proof("For an arbitrary even integer n, write n=2k with k an integer. Then n^2=4k^2=2(2k^2), so n^2 is even.", "even-valid"),
  },
  {
    id: "imo-vieta-valid",
    label: "VALID" as const,
    contract: MATH_PILOT_BENCHMARK,
    attempt: proof("Let k=(a^2+b^2)/(ab+1) be an integer. Suppose k is nonsquare, so k>=2, and choose a positive solution minimizing a+b with a<=b. Set c=ka-b. From a^2+b^2=k(ab+1), we have bc=a^2-k. If c=0 then k=a^2, contradiction. If c<0, then b=ka-c>k while b(-c)=k-a^2<k, contradiction. Thus c>0. The polynomial P(t)=t^2-kat+a^2-k has roots b,c and P(a)=(2-k)a^2-k<0. As a<=b, (a-b)(a-c)<0 forces 0<c<a<b. The same identity holds for (a,c) with quotient k, contradicting minimality of a+b. Hence k is a square.", "imo-valid"),
  },
  {
    id: "imo-finite-sample-invalid",
    label: "INVALID" as const,
    contract: MATH_PILOT_BENCHMARK,
    attempt: proof("Let k=(a^2+b^2)/(ab+1), an integer. We checked all 1<=a,b<=500 and found that every quotient is a square. Any larger solution can be reduced to this range by Vieta jumping. Therefore every admissible quotient is a square.", "imo-finite"),
  },
  {
    id: "imo-circular-invalid",
    label: "INVALID" as const,
    contract: MATH_PILOT_BENCHMARK,
    attempt: proof("Let k=(a^2+b^2)/(ab+1). By the Vieta-jumping square-quotient theorem, k is a square for all positive integers a,b satisfying the divisibility condition. This is exactly the conclusion, and no further argument is needed.", "imo-circular"),
  },
  {
    id: "imo-root-order-invalid",
    label: "INVALID" as const,
    contract: MATH_PILOT_BENCHMARK,
    attempt: proof("Assume k>=2 is nonsquare and a<=b minimizes a+b. Put c=ka-b, the second integer root of P(t)=t^2-kat+a^2-k. Since P(a)<0, both roots b and c exceed a. Nevertheless (a,c) is a smaller positive solution with the same quotient k, contradicting minimality. Thus k is square.", "imo-order"),
  },
] as const satisfies ReadonlyArray<{ id: string; label: "VALID" | "INVALID";
  contract: MathPilotContract; attempt: ReturnType<typeof proof> }>;

export const MATH_REVIEW_REGRESSION_SUITE_DIGEST = sha256(canonicalJson({
  version: 1, cases: MATH_REVIEW_REGRESSION_CASES,
}));

export function scoreMathReviewRegression(input: { caseId: string;
  reports: [MathAgentReport, MathAgentReport]; elapsedMs: number }) {
  const fixture = MATH_REVIEW_REGRESSION_CASES.find((item) => item.id === input.caseId);
  if (!fixture || !Number.isFinite(input.elapsedMs) || input.elapsedMs < 0) {
    throw new Error("Unknown regression case or invalid duration");
  }
  const result = evaluateMathAgentReview({ contract: fixture.contract,
    contractDigest: digestMathPilotContract(fixture.contract), attempt: fixture.attempt,
    reports: input.reports });
  const accepted = result.disposition === "AI_REVIEWED";
  return {
    caseId: fixture.id, expectedValidity: fixture.label, observedDisposition: result.disposition,
    correct: fixture.label === "VALID" ? accepted : !accepted,
    falseAccept: fixture.label === "INVALID" && accepted,
    falseReject: fixture.label === "VALID" && !accepted,
    roleVerdicts: input.reports.map((report) => ({ role: report.role, verdict: report.verdict,
      requestedQuote: report.exactQuote, unresolvedGap: report.unresolvedGap,
      threadId: report.threadId, usage: report.usage })),
    observedTokens: input.reports.reduce((sum, report) => sum + report.usage.inputTokens + report.usage.outputTokens, 0),
    elapsedMs: input.elapsedMs,
  };
}
