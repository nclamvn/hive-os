/** Public, versioned local regression controls. Not a blind or independent benchmark. */
import { CodexLocalMathReviewer } from "../../src/modules/research-sandbox/adapters/codex-local-review";
import { MATH_REVIEW_REGRESSION_CASES, MATH_REVIEW_REGRESSION_SUITE_DIGEST,
  scoreMathReviewRegression } from "../../src/modules/research-sandbox/math-review-regression";

async function main() {
  const arguments_ = process.argv.slice(2);
  const repeatArgument = arguments_.find((item) => item.startsWith("--repeat="));
  const repeats = repeatArgument ? Number(repeatArgument.slice("--repeat=".length)) : 1;
  if (!Number.isInteger(repeats) || repeats < 1 || repeats > 3 ||
    arguments_.filter((item) => item.startsWith("--repeat=")).length > 1) {
    throw new Error("--repeat must be an integer from 1 to 3");
  }
  const selected = arguments_.filter((item) => item !== repeatArgument);
  const cases = selected.length ? MATH_REVIEW_REGRESSION_CASES.filter((item) => selected.includes(item.id))
    : MATH_REVIEW_REGRESSION_CASES;
  if (!cases.length || selected.some((id) => !cases.some((item) => item.id === id))) {
    throw new Error(`Unknown case. Options: ${MATH_REVIEW_REGRESSION_CASES.map((item) => item.id).join(", ")}`);
  }
  const reviewer = new CodexLocalMathReviewer("codex", "gpt-6-sol",
    process.env.MATH_REVIEW_ADVERSARY_MODEL ?? "gpt-6-sol");
  const results = [];
  for (let repetition = 1; repetition <= repeats; repetition += 1) {
    for (const fixture of cases) {
      const start = performance.now();
      const reports = await reviewer.review(fixture.contract, fixture.attempt);
      results.push({ repetition, ...scoreMathReviewRegression({ caseId: fixture.id, reports,
        elapsedMs: Math.round(performance.now() - start) }) });
    }
  }
  const falseAccepts = results.filter((item) => item.falseAccept).length;
  const falseRejects = results.filter((item) => item.falseReject).length;
  process.stdout.write(JSON.stringify({ suite: "PUBLIC_REGRESSION_V1", suiteDigest: MATH_REVIEW_REGRESSION_SUITE_DIGEST,
    selectedCaseIds: cases.map((item) => item.id), repetitions: repeats,
    completeSuite: cases.length === MATH_REVIEW_REGRESSION_CASES.length,
    reviewerRequestedModels: reviewer.roleModels, falseAccepts, falseRejects,
    observedTokens: results.reduce((sum, item) => sum + item.observedTokens, 0),
    elapsedMs: results.reduce((sum, item) => sum + item.elapsedMs, 0), results }, null, 2) + "\n");
  if (falseAccepts || falseRejects) process.exitCode = 1;
}

main().catch((error) => {
  process.stderr.write(`Review regression did not complete: ${error instanceof Error ? error.message : "unknown error"}\n`);
  process.exitCode = 1;
});
