import { describe, expect, it } from "vitest";

import {
  digestMathAgentLedger,
  evaluateMathAgentReview,
  mathAgentLedgerSchema,
  validateRecordedMathAgentReview,
  type MathAgentReport,
} from "@/modules/research-sandbox/agent-review";
import { digestResearchResult } from "@/modules/research-sandbox/integrity";
import { digestMathPilotContract, MATH_PILOT_BENCHMARK, MATH_PILOT_CALIBRATIONS, MATH_PILOT_EXACT_BENCHMARK } from "@/modules/research-sandbox/math-pilot";
import { sha256 } from "@/modules/research-sandbox/integrity";
import { EXACT_INTERVAL_101GON_PROGRAM_DIGEST, exactIntervalOutputDigest } from "@/modules/research-sandbox/math-exact-interval";

const usage = { inputTokens: 100, cachedInputTokens: 0, outputTokens: 50, reasoningOutputTokens: 10 };
const argument = "Let n = 2k for an integer k. Then n^2 = 4k^2 = 2(2k^2), which is even.";
const attempt = {
  providerName: "codex-local" as const, modelName: "gpt-6-sol", threadId: "author-thread",
  attemptType: "PROOF_ATTEMPT" as const, argument, candidateCounterexample: null,
  selfChecks: [], limitations: [], usage,
};

function reports(conclusion: MathAgentReport["candidateConclusion"] = "SUPPORTED_ARGUMENT"): [MathAgentReport, MathAgentReport] {
  return (["CRITIC", "ADVERSARY"] as const).map((role) => ({
    role, verdict: "SUPPORTS" as const, candidateConclusion: conclusion,
    exactQuote: "n^2 = 4k^2", reasoning: "The arbitrary integer k gives an even factorization, and no finite sample is being used.",
    checks: ["Substituted the general even-integer witness and checked the algebraic identity."],
    unresolvedGap: null, threadId: `${role}-thread`, usage,
  })) as [MathAgentReport, MathAgentReport];
}

describe("autonomous math review boundary", () => {
  it("allows a bounded AI-reviewed proof calibration without claiming formal proof", () => {
    const contract = MATH_PILOT_CALIBRATIONS.CALIBRATION_PROOF;
    const verdict = evaluateMathAgentReview({ contract, contractDigest: digestMathPilotContract(contract), attempt, reports: reports() });
    expect(verdict).toMatchObject({ disposition: "AI_REVIEWED", conclusion: "SUPPORTED_ARGUMENT",
      oracle: { contractValid: true, groundedQuotes: true, calibrationWitnessValid: true } });
    const ledger = mathAgentLedgerSchema.parse({ version: 1, reviewerModelName: "gpt-6-sol", reports: reports(), ...verdict });
    const review = {
      disposition: verdict.disposition, conclusion: verdict.conclusion,
      contractDigest: digestMathPilotContract(contract), attemptDigest: digestResearchResult(attempt),
      researchDigest: "a".repeat(64), ledger, ledgerDigest: digestMathAgentLedger(ledger),
    };
    expect(validateRecordedMathAgentReview({ contract, contractDigest: review.contractDigest,
      attempt, attemptDigest: review.attemptDigest, researchDigest: review.researchDigest, review })).not.toBeNull();
    expect(validateRecordedMathAgentReview({ contract, contractDigest: review.contractDigest,
      attempt, attemptDigest: review.attemptDigest, researchDigest: "b".repeat(64), review })).toBeNull();
    expect(validateRecordedMathAgentReview({ contract, contractDigest: review.contractDigest,
      attempt, attemptDigest: review.attemptDigest, researchDigest: review.researchDigest,
      review: { ...review, ledgerDigest: "0".repeat(64) } })).toBeNull();
  });

  it("records per-role requested model provenance without rewriting legacy ledgers", () => {
    const contract = MATH_PILOT_CALIBRATIONS.CALIBRATION_PROOF;
    const pair = reports();
    const verdict = evaluateMathAgentReview({ contract,
      contractDigest: digestMathPilotContract(contract), attempt, reports: pair });
    const ledger = mathAgentLedgerSchema.parse({ version: 3, reports: pair,
      reviewerModels: pair.map((report) => ({ role: report.role,
        providerName: "codex-local", identityEvidence: "REQUESTED_CLI_MODEL",
        requestedModelName: report.role === "CRITIC" ? "gpt-6-sol" : "gpt-6-astra",
        threadId: report.threadId })), ...verdict });
    const review = { disposition: verdict.disposition, conclusion: verdict.conclusion,
      contractDigest: digestMathPilotContract(contract), attemptDigest: digestResearchResult(attempt),
      researchDigest: "a".repeat(64), ledger, ledgerDigest: digestMathAgentLedger(ledger) };
    const input = { contract, contractDigest: review.contractDigest, attempt,
      attemptDigest: review.attemptDigest, researchDigest: review.researchDigest, review };
    expect(validateRecordedMathAgentReview(input)).not.toBeNull();
    expect(mathAgentLedgerSchema.safeParse({ ...ledger, reviewerModels: [
      { ...ledger.reviewerModels![0], threadId: "fabricated-context" }, ledger.reviewerModels![1],
    ] }).success).toBe(false);
    expect(validateRecordedMathAgentReview({ ...input, review: { ...review,
      ledger: { ...ledger, reviewerModels: [
        { ...ledger.reviewerModels![0], requestedModelName: "another-model" }, ledger.reviewerModels![1],
      ] } } })).toBeNull();
    expect(mathAgentLedgerSchema.safeParse({ ...ledger, reviewerModelName: "gpt-6-sol" }).success).toBe(false);
  });

  it("fails closed on disagreement, ungrounded quotations, or missing proof witness", () => {
    const contract = MATH_PILOT_CALIBRATIONS.CALIBRATION_PROOF;
    const base = { contract, contractDigest: digestMathPilotContract(contract), attempt };
    expect(evaluateMathAgentReview({ ...base, reports: [reports()[0], { ...reports()[1], verdict: "CHALLENGES", unresolvedGap: "The general inference remains unjustified." }] }).disposition).toBe("INCONCLUSIVE");
    expect(evaluateMathAgentReview({ ...base, reports: [reports()[0], { ...reports()[1], exactQuote: "a fabricated exact quote" }] }).disposition).toBe("INCONCLUSIVE");
    expect(evaluateMathAgentReview({ ...base, attempt: { ...attempt, argument: "A few examples are even, so the claim follows." }, reports: reports() }).disposition).toBe("INCONCLUSIVE");
    expect(evaluateMathAgentReview({ ...base, reports: [reports()[0], { ...reports()[1], threadId: reports()[0].threadId }] }).disposition).toBe("INCONCLUSIVE");
    expect(evaluateMathAgentReview({ ...base, reports: [{ ...reports()[0], threadId: attempt.threadId }, reports()[1]] }).disposition).toBe("INCONCLUSIVE");
  });

  it("requires the actual prime-2 witness; an open case stays only a candidate", () => {
    const contract = MATH_PILOT_CALIBRATIONS.CALIBRATION_COUNTEREXAMPLE;
    const counter = { ...attempt, attemptType: "COUNTEREXAMPLE_ATTEMPT" as const,
      argument: "The number 2 is prime and it is not odd, so it refutes the universal claim.", candidateCounterexample: "2" };
    const pair = reports("VALID_COUNTEREXAMPLE").map((report) => ({ ...report, exactQuote: "2 is prime" })) as [MathAgentReport, MathAgentReport];
    expect(evaluateMathAgentReview({ contract, contractDigest: digestMathPilotContract(contract), attempt: counter, reports: pair })).toMatchObject({ disposition: "AI_REVIEWED", conclusion: "VALID_COUNTEREXAMPLE" });
    expect(evaluateMathAgentReview({ contract, contractDigest: digestMathPilotContract(contract), attempt: { ...counter, candidateCounterexample: "3" }, reports: pair }).disposition).toBe("INCONCLUSIVE");
    const open = { ...contract, caseType: "OPEN" as const, statement: "An unproved research conjecture" };
    expect(evaluateMathAgentReview({ contract: open, contractDigest: digestMathPilotContract(open), attempt: counter, reports: pair })).toMatchObject({ disposition: "AI_REVIEWED", conclusion: "PARTIAL", oracle: { calibrationWitnessValid: null } });
  });

  it("classifies the known-answer benchmark separately but fails closed on a challenged or wrong attempt", () => {
    const contract = MATH_PILOT_BENCHMARK;
    const proof = { ...attempt, argument: "Let k be the integer quotient. Suppose k is nonsquare, so k >= 2, and choose a positive solution minimizing a+b with a <= b. Set c=ka-b. From a^2+b^2=k(ab+1), we have bc=a^2-k. If c=0 then k=a^2, contradiction. If c<0, then b=ka-c>k while b(-c)=k-a^2<k, contradiction. Thus c>0. The polynomial P(t)=t^2-kat+a^2-k has roots b,c and P(a)=(2-k)a^2-k<0. As a<=b, (a-b)(a-c)<0 forces 0<c<a<b. The same identity holds for (a,c) with quotient k, contradicting minimality of a+b. Hence k is a square." };
    const pair = reports().map((report) => ({ ...report, exactQuote: "Let k be the integer quotient" })) as [MathAgentReport, MathAgentReport];
    const base = { contract, contractDigest: digestMathPilotContract(contract), attempt: proof };
    const accepted = evaluateMathAgentReview({ ...base, reports: pair });
    expect(accepted).toMatchObject({ disposition: "AI_REVIEWED", conclusion: "SUPPORTED_ARGUMENT",
      oracle: { calibrationWitnessValid: null, benchmarkReferenceValid: true } });
    expect(evaluateMathAgentReview({ ...base, attempt: { ...proof, attemptType: "PARTIAL" }, reports: pair }).disposition).toBe("INCONCLUSIVE");
    expect(evaluateMathAgentReview({ ...base, reports: [pair[0], { ...pair[1], verdict: "CHALLENGES", unresolvedGap: "The claimed descent is not actually established." }] }).disposition).toBe("INCONCLUSIVE");
    expect(evaluateMathAgentReview({ ...base, contract: { ...contract, statement: "An altered theorem" }, reports: pair }).disposition).toBe("INCONCLUSIVE");
  });

  it("requires answer match, isolated replay and two supporting reviews for a public numeric sample", () => {
    const code = "def answer():\n    return 4771880153\n";
    const numeric = { ...attempt, argument: "A complete expectation derivation and certified precision give the requested floor.",
      exactAnswer: "4771880153", computationPython: code };
    const pair = reports().map((report) => ({ ...report, exactQuote: "A complete expectation derivation" })) as [MathAgentReport, MathAgentReport];
    const replay = { method: "DOCKER_PYTHON_ANSWER_REPLAY_V1" as const, status: "PASS" as const,
      codeDigest: sha256(code), image: `python@sha256:${"a".repeat(64)}`,
      claimedAnswer: numeric.exactAnswer, observedAnswer: numeric.exactAnswer, reason: "MATCH" as const };
    const scale = BigInt(10) ** BigInt(80);
    const intervalOutput = { method: "INTERVAL_101GON_V1" as const, scaleDigits: 80 as const,
      lowerScaled: String(BigInt(numeric.exactAnswer) * scale + BigInt(1)),
      upperScaled: String((BigInt(numeric.exactAnswer) + BigInt(1)) * scale - BigInt(1)),
      floor: numeric.exactAnswer, eventCount: 80_850, crossingWidthScaled: "1" };
    const interval = { ...intervalOutput, status: "CERTIFIED" as const, reason: "UNIQUE_FLOOR" as const,
      programDigest: EXACT_INTERVAL_101GON_PROGRAM_DIGEST, image: replay.image,
      outputDigest: exactIntervalOutputDigest(JSON.stringify(intervalOutput)) };
    const base = { contract: MATH_PILOT_EXACT_BENCHMARK,
      contractDigest: digestMathPilotContract(MATH_PILOT_EXACT_BENCHMARK), attempt: numeric, reports: pair };
    expect(evaluateMathAgentReview({ ...base, exactReplay: replay, exactInterval: interval })).toMatchObject({
      disposition: "AI_REVIEWED", oracle: { exactAnswerMatch: true, exactReplayValid: true, exactIntervalValid: true },
    });
    const upgradedVerdict = evaluateMathAgentReview({ ...base, exactReplay: replay, exactInterval: interval });
    const upgradedLedger = mathAgentLedgerSchema.parse({ version: 2, reviewerModelName: numeric.modelName,
      reports: pair, exactReplay: replay, exactInterval: interval, ...upgradedVerdict });
    const upgradedReview = { disposition: upgradedVerdict.disposition, conclusion: upgradedVerdict.conclusion,
      contractDigest: base.contractDigest, attemptDigest: digestResearchResult(numeric),
      researchDigest: "a".repeat(64), ledger: upgradedLedger, ledgerDigest: digestMathAgentLedger(upgradedLedger) };
    expect(validateRecordedMathAgentReview({ contract: base.contract, contractDigest: base.contractDigest,
      attempt: numeric, attemptDigest: upgradedReview.attemptDigest,
      researchDigest: upgradedReview.researchDigest, review: upgradedReview })).not.toBeNull();
    expect(validateRecordedMathAgentReview({ contract: base.contract, contractDigest: base.contractDigest,
      attempt: numeric, attemptDigest: upgradedReview.attemptDigest,
      researchDigest: upgradedReview.researchDigest,
      review: { ...upgradedReview, ledger: { ...upgradedLedger,
        exactInterval: { ...interval, lowerScaled: "1" } } } })).toBeNull();
    expect(evaluateMathAgentReview({ ...base, exactReplay: replay })).toMatchObject({
      disposition: "INCONCLUSIVE", oracle: { exactIntervalValid: false },
    });
    const legacyVerdict = evaluateMathAgentReview({ ...base, exactReplay: replay, legacyExactReview: true });
    expect(legacyVerdict.disposition).toBe("AI_REVIEWED");
    const legacyLedger = mathAgentLedgerSchema.parse({ version: 1, reviewerModelName: numeric.modelName,
      reports: pair, exactReplay: replay, ...legacyVerdict });
    const legacyReview = { ...upgradedReview, disposition: legacyVerdict.disposition,
      conclusion: legacyVerdict.conclusion, ledger: legacyLedger, ledgerDigest: digestMathAgentLedger(legacyLedger) };
    expect(validateRecordedMathAgentReview({ contract: base.contract, contractDigest: base.contractDigest,
      attempt: numeric, attemptDigest: legacyReview.attemptDigest,
      researchDigest: legacyReview.researchDigest, review: legacyReview })).not.toBeNull();
    expect(evaluateMathAgentReview({ ...base, exactReplay: replay,
      exactInterval: { ...interval, upperScaled: "1" } }).disposition).toBe("INCONCLUSIVE");
    expect(evaluateMathAgentReview(base).disposition).toBe("INCONCLUSIVE");
    expect(evaluateMathAgentReview({ ...base, attempt: { ...numeric, exactAnswer: null },
      exactReplay: { ...replay, status: "COMPUTED", claimedAnswer: null, reason: "UNCLAIMED_ANSWER" }, exactInterval: interval }).disposition).toBe("INCONCLUSIVE");
    expect(evaluateMathAgentReview({ ...base, attempt: { ...numeric, exactAnswer: "4771880152" }, exactReplay: replay, exactInterval: interval }).disposition).toBe("INCONCLUSIVE");
    expect(evaluateMathAgentReview({ ...base, exactReplay: { ...replay, codeDigest: "b".repeat(64) }, exactInterval: interval }).disposition).toBe("INCONCLUSIVE");
    expect(evaluateMathAgentReview({ ...base, reports: [pair[0], { ...pair[1], verdict: "CHALLENGES", unresolvedGap: "The geometric reduction is unsupported." }], exactReplay: replay, exactInterval: interval }).disposition).toBe("INCONCLUSIVE");
  });
});
