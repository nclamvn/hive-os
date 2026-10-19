import { describe, expect, it } from "vitest";

import {
  calibratedCaseTypes,
  MATH_REVIEW_CRITERIA,
  mathPilotAssessmentSchema,
  digestMathReviewChecklist,
  digestMathPilotContract,
  mathPilotRequestSchema,
  mathPilotScope,
  MATH_PILOT_CALIBRATIONS,
  MATH_PILOT_BENCHMARK,
  MATH_PILOT_EXACT_BENCHMARK,
  resolveMathPilotContract,
} from "@/modules/research-sandbox/math-pilot";

function passedCase(caseType: "CALIBRATION_PROOF" | "CALIBRATION_COUNTEREXAMPLE") {
  const contract = MATH_PILOT_CALIBRATIONS[caseType];
  const reviewChecklist = {
    version: 1 as const,
    independentVerification: true as const,
    checks: MATH_REVIEW_CRITERIA.map((criterion) => ({ criterion, verdict: "VERIFIED" as const, note: `Checked ${criterion} independently.` })),
  };
  return {
    caseType,
    contract,
    contractDigest: digestMathPilotContract(contract),
    approvedIntegrityValid: true,
    researchRun: {
      status: "APPROVED",
      approvedDigest: "a".repeat(64),
      providerName: "openai",
      modelName: "gpt-5.6-sol",
      question: contract.statement,
      scope: mathPilotScope(contract),
    },
    assessment: {
      conclusion: caseType === "CALIBRATION_PROOF" ? "SUPPORTED_ARGUMENT" : "VALID_COUNTEREXAMPLE",
      researchDigest: "a".repeat(64),
      reviewChecklist,
      reviewChecklistDigest: digestMathReviewChecklist(reviewChecklist),
    },
  };
}

describe("math pilot gate", () => {
  it("requires a complete independent ledger before a positive mathematical disposition", () => {
    const checklist = {
      version: 1 as const,
      independentVerification: true as const,
      checks: MATH_REVIEW_CRITERIA.map((criterion) => ({ criterion, verdict: "VERIFIED" as const, note: `Checked ${criterion} independently.` })),
    };
    const assessment = {
      caseId: "case-1", conclusion: "SUPPORTED_ARGUMENT", rationale: "Each step is justified.",
      verificationNotes: "I reconstructed the argument from the definitions.", reviewChecklist: checklist,
    };
    expect(mathPilotAssessmentSchema.safeParse(assessment).success).toBe(true);
    expect(digestMathReviewChecklist(checklist)).toMatch(/^[a-f0-9]{64}$/);
    expect(mathPilotAssessmentSchema.safeParse({ ...assessment, reviewChecklist: { ...checklist, independentVerification: false } }).success).toBe(false);
    expect(mathPilotAssessmentSchema.safeParse({ ...assessment, reviewChecklist: { ...checklist, checks: checklist.checks.slice(1) } }).success).toBe(false);
    expect(mathPilotAssessmentSchema.safeParse({ ...assessment, reviewChecklist: { ...checklist, checks: checklist.checks.map((check, index) => index ? check : { ...check, verdict: "ISSUE_FOUND" }) } }).success).toBe(false);
    expect(mathPilotAssessmentSchema.safeParse({ ...assessment, conclusion: "INCONCLUSIVE", reviewChecklist: { ...checklist, checks: checklist.checks.map((check, index) => index ? check : { ...check, verdict: "NOT_CHECKED" }) } }).success).toBe(true);
  });
  it("freezes a deterministic brief without sending the hidden expected label", () => {
    const first = resolveMathPilotContract({ caseType: "CALIBRATION_COUNTEREXAMPLE" });
    const second = resolveMathPilotContract({ caseType: "CALIBRATION_COUNTEREXAMPLE" });
    expect(digestMathPilotContract(first)).toBe(digestMathPilotContract(second));
    expect(mathPilotScope(first)).not.toContain("VALID_COUNTEREXAMPLE");
    expect(mathPilotScope(first)).not.toContain("2 is");
  });

  it("seals a distinct known-answer benchmark without exposing its source or reference to the solver", () => {
    const contract = resolveMathPilotContract({ caseType: "BENCHMARK_PROOF" });
    expect(contract).toEqual(MATH_PILOT_BENCHMARK);
    expect(contract.caseType).toBe("BENCHMARK_PROOF");
    expect(digestMathPilotContract(contract)).toBe(digestMathPilotContract(resolveMathPilotContract({ caseType: "BENCHMARK_PROOF" })));
    expect(mathPilotScope(contract)).not.toMatch(/IMO|Vieta|jumping|known.answer|mathlib/i);
    expect(mathPilotRequestSchema.safeParse({ caseType: "BENCHMARK_PROOF", statement: "forged" }).success).toBe(false);
  });

  it("seals a public exact-answer problem without its published answer", () => {
    const contract = resolveMathPilotContract({ caseType: "BENCHMARK_EXACT" });
    expect(contract).toEqual(MATH_PILOT_EXACT_BENCHMARK);
    expect(digestMathPilotContract(contract)).toBe(digestMathPilotContract(resolveMathPilotContract({ caseType: "BENCHMARK_EXACT" })));
    expect(mathPilotScope(contract)).not.toContain("4771880153");
    expect(mathPilotRequestSchema.safeParse({ caseType: "BENCHMARK_EXACT", statement: "forged" }).success).toBe(false);
  });

  it("rejects a forged or incomplete open protocol", () => {
    expect(mathPilotRequestSchema.safeParse({ caseType: "OPEN", statement: "P" }).success).toBe(false);
    expect(mathPilotRequestSchema.safeParse({ caseType: "CALIBRATION_PROOF", statement: "other" }).success).toBe(false);
  });

  it("requires both exact calibration contracts, model identity, approved digest and correct independent labels", () => {
    const proof = passedCase("CALIBRATION_PROOF");
    const trap = passedCase("CALIBRATION_COUNTEREXAMPLE");
    expect(calibratedCaseTypes([proof, trap], "openai", "gpt-5.6-sol").size).toBe(2);
    expect(calibratedCaseTypes([proof, { ...trap, assessment: { ...trap.assessment, conclusion: "SUPPORTED_ARGUMENT" } }], "openai", "gpt-5.6-sol").size).toBe(1);
    expect(calibratedCaseTypes([proof, { ...trap, contractDigest: "0".repeat(64) }], "openai", "gpt-5.6-sol").size).toBe(1);
    expect(calibratedCaseTypes([proof, { ...trap, researchRun: { ...trap.researchRun, modelName: "other" } }], "openai", "gpt-5.6-sol").size).toBe(1);
    expect(calibratedCaseTypes([proof, { ...trap, assessment: { ...trap.assessment, researchDigest: "b".repeat(64) } }], "openai", "gpt-5.6-sol").size).toBe(1);
    expect(calibratedCaseTypes([proof, { ...trap, researchRun: { ...trap.researchRun, status: "QUEUED" } }], "openai", "gpt-5.6-sol").size).toBe(1);
    expect(calibratedCaseTypes([proof, { ...trap, approvedIntegrityValid: false }], "openai", "gpt-5.6-sol").size).toBe(1);
  });
});
