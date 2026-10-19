import { describe, expect, it, vi } from "vitest";
vi.mock("@/modules/research-sandbox/kernel", () => ({ listMathPilotCases: vi.fn() }));
vi.mock("@/modules/research-sandbox/agent-review", () => ({ validateRecordedMathAgentReview: () => false }));
import { loadMathCalibrationReadiness } from "@/modules/research-sandbox/math-dossier-loader";
import { MATH_PILOT_CALIBRATIONS, MATH_REVIEW_CRITERIA, digestMathPilotContract, digestMathReviewChecklist,
  mathPilotScope } from "@/modules/research-sandbox/math-pilot";
const missionId = "00000000-0000-4000-8000-000000000001";
function evidence(type: keyof typeof MATH_PILOT_CALIBRATIONS, index: number, accepted = true) {
  const contract = MATH_PILOT_CALIBRATIONS[type];
  const reviewChecklist = { version: 1 as const, independentVerification: true as const,
    checks: MATH_REVIEW_CRITERIA.map((criterion) => ({ criterion, verdict: "VERIFIED" as const, note: "An independently checked test-only criterion." })) };
  return { id: `00000000-0000-4000-8000-${String(index).padStart(12, "0")}`, createdAt: new Date(2026, 0, 1, 0, 0, index), caseType: type,
    contract, contractDigest: digestMathPilotContract(contract), approvedIntegrityValid: accepted,
    researchRun: { status: "APPROVED", providerName: "test-provider", modelName: "test-model", approvedDigest: "a".repeat(64),
      question: contract.statement, scope: mathPilotScope(contract) }, agentReview: null,
    assessment: { conclusion: type === "CALIBRATION_PROOF" ? "SUPPORTED_ARGUMENT" : "VALID_COUNTEREXAMPLE",
      researchDigest: "a".repeat(64), reviewChecklist, reviewChecklistDigest: digestMathReviewChecklist(reviewChecklist) } };
}
type Loader = NonNullable<Parameters<typeof loadMathCalibrationReadiness>[4]>;
describe("selector independent bounded calibration", () => {
  it("finds older valid evidence beyond a recent page of invalid candidate records", async () => {
    const load = vi.fn().mockResolvedValueOnce(Array.from({ length: 20 }, (_, i) => evidence("CALIBRATION_PROOF", i + 1, false)))
      .mockResolvedValueOnce([evidence("CALIBRATION_PROOF", 21), evidence("CALIBRATION_COUNTEREXAMPLE", 22)]);
    const result = await loadMathCalibrationReadiness({} as never, missionId, "test-provider", "test-model", load as Loader);
    expect(result.complete).toBe(true); expect(result.passed.size).toBe(2); expect(result.inspected).toBe(22);
    expect(load.mock.calls[1]?.[2]).toMatchObject({ take: 20, includeJobs: false,
      calibration: { providerName: "test-provider", modelName: "test-model", cursor: { scopeId: "calibration" } } });
  });
  it("does not treat the 200 candidate safety ceiling as a definitive failure or partial pass", async () => {
    const load = vi.fn().mockResolvedValue(Array.from({ length: 20 }, (_, i) => evidence("CALIBRATION_PROOF", i + 1)));
    const result = await loadMathCalibrationReadiness({} as never, missionId, "test-provider", "test-model", load as Loader);
    expect(result.complete).toBe(false); expect(result.passed.size).toBe(0); expect(result.inspected).toBe(200);
    expect(load).toHaveBeenCalledTimes(10);
  });
  it("propagates read failure rather than presenting an empty successful calibration scan", async () => {
    const load = vi.fn().mockRejectedValue(new Error("database unavailable"));
    await expect(loadMathCalibrationReadiness({} as never, missionId, "test-provider", "test-model", load as Loader)).rejects.toThrow("database unavailable");
  });
});
