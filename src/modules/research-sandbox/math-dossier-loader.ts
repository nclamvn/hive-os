import type { WorkspaceContext } from "@/modules/identity-workspace";
import { validateRecordedMathAgentReview } from "./agent-review";
import { listMathPilotCases } from "./kernel";
import { calibratedCaseTypes } from "./math-pilot";
import { encodeDossierCursor, decodeDossierCursor, MATH_CALIBRATION_SCAN_LIMIT } from "./math-dossier-pagination";

type Case = Awaited<ReturnType<typeof listMathPilotCases>>[number];
/** A separate bounded evidence scan: presentation selection never enters this contract. */
export async function loadMathCalibrationReadiness(ctx: WorkspaceContext, missionId: string,
  providerName: string, modelName: string, load = listMathPilotCases) {
  const passed = new Set<"CALIBRATION_PROOF" | "CALIBRATION_COUNTEREXAMPLE">();
  let cursor = null as ReturnType<typeof decodeDossierCursor>;
  let inspected = 0;
  while (inspected < MATH_CALIBRATION_SCAN_LIMIT) {
    const batch: Case[] = await load(ctx, missionId, { calibration: { providerName, modelName, cursor },
      take: 20, includeJobs: false });
    inspected += batch.length;
    const evidence = batch.map((item) => ({ ...item,
      agentReviewValid: Boolean(validateRecordedMathAgentReview({ contract: item.contract,
        contractDigest: item.contractDigest, attempt: item.researchRun.mathModelAttempt,
        attemptDigest: item.researchRun.mathModelAttemptDigest, researchDigest: item.researchIntegrityDigest,
        review: item.agentReview })) }));
    for (const type of calibratedCaseTypes(evidence, providerName, modelName)) passed.add(type);
    if (passed.size === 2 || batch.length < 20) return { passed, complete: true, inspected };
    const last = batch.at(-1)!;
    cursor = decodeDossierCursor(encodeDossierCursor({ missionId, scopeId: "calibration",
      createdAt: last.createdAt.toISOString(), id: last.id }), missionId, "calibration");
  }
  // There may be older valid evidence: safety ceiling is NOT a definitive negative.
  return { passed: new Set<"CALIBRATION_PROOF" | "CALIBRATION_COUNTEREXAMPLE">(), complete: false, inspected };
}
