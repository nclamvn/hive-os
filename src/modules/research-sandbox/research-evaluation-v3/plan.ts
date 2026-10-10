import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { prepareProblemContract } from "../research-core-v3";
import { arms, evaluationDigest, parseEvaluation, studyBodySchema, studyPlanSchema, EvaluationRefusal,
  type Arm, type StudyPlan } from "./contracts";

export function sealPairedStudyPlan(raw: unknown): StudyPlan {
  const body = parseEvaluation(studyBodySchema, raw);
  const domains = new Map<string, number>();
  if (new Set(body.tasks.map(t => t.id)).size !== body.tasks.length) throw new EvaluationRefusal("INTEGRITY", "Duplicate paired task");
  for (const task of body.tasks) {
    const prepared = prepareProblemContract(task.contract);
    if (prepared.contract.mode !== "ENGINEERING" || prepared.contract.obligations.length !== 1) throw new EvaluationRefusal("AUTHORITY", "Pilot must remain exact single-obligation engineering");
    domains.set(prepared.contract.domain.adapterId, (domains.get(prepared.contract.domain.adapterId) ?? 0) + 1);
  }
  if (body.purpose === "PUBLIC_PILOT_12" && (body.tasks.length !== 12 || domains.size !== 3 || [...domains.values()].some(count => count !== 4))) throw new EvaluationRefusal("INTEGRITY", "Pilot requires four tasks in each of three domains");
  if (body.purpose === "ARCHITECTURE_TRANSFER" && body.tasks.length > 4) throw new EvaluationRefusal("RESOURCE", "Small architecture transfer is not a twelve-task pilot");
  if (body.ceilings.maxRounds > 2 || body.ceilings.total.calls < 1 || body.ceilings.total.tokens < 1 || body.ceilings.perCall.tokens > body.ceilings.total.tokens ||
    body.ceilings.perCall.milliseconds > body.ceilings.wallMilliseconds || body.ceilings.postgrade.total.calls !== 0 || body.ceilings.postgrade.total.tokens !== 0 ||
    body.ceilings.postgrade.total.checkerOperations < 1 || body.ceilings.postgrade.total.computeMilliseconds < 1 ||
    body.ceilings.postgrade.total.readBytes < 1 || body.ceilings.postgrade.total.writeBytes < 1) throw new EvaluationRefusal("RESOURCE", "Incoherent arm/grader allowances");
  return Object.freeze({ ...body, planDigest: evaluationDigest(body) });
}
export function verifyPairedStudyPlan(raw: unknown): StudyPlan {
  const plan = parseEvaluation(studyPlanSchema, raw);
  const { planDigest, ...body } = plan;
  const expected = sealPairedStudyPlan(body);
  if (planDigest !== expected.planDigest) throw new EvaluationRefusal("INTEGRITY", "Study preregistration seal changed");
  return expected;
}
export function studySlots(plan: StudyPlan) {
  verifyPairedStudyPlan(plan);
  return plan.tasks.flatMap((task, index) => (index % 2 === 0 ? arms : [...arms].reverse()).map((arm, ordinal) => ({
    pairId: `${plan.id}:${task.id}`, taskId: task.id, arm, order: index * 2 + ordinal, task,
  })));
}
export function publicArmProjection(plan: StudyPlan, taskId: string, arm: Arm) {
  verifyPairedStudyPlan(plan);
  const slot = studySlots(plan).find(s => s.taskId === taskId && s.arm === arm);
  if (!slot) throw new EvaluationRefusal("INTEGRITY", "Unknown preregistered slot");
  // Deliberately no reference digest, expected verdict, answer or grading rubric.
  return { contract: structuredClone(slot.task.contract), requestedProvider: plan.requestedProvider,
    requestedModel: plan.requestedModel, requestedModelVersion: plan.requestedModelVersion,
    seed: plan.seed, ceilings: structuredClone(plan.ceilings), sourceExposureDigest: slot.task.sourceExposureDigest,
    toolsetDigest: slot.task.toolsetDigest, exposure: slot.task.exposure };
}
export function slotBinding(plan: StudyPlan, taskId: string, arm: Arm) {
  const slot = studySlots(plan).find(s => s.taskId === taskId && s.arm === arm);
  if (!slot) throw new EvaluationRefusal("INTEGRITY", "Unknown preregistered slot");
  return { preregistrationDigest: plan.planDigest, pairId: slot.pairId, taskId, arm, exposureDigest: slot.task.sourceExposureDigest,
    toolsetDigest: slot.task.toolsetDigest, resourceCeilingDigest: evaluationDigest(plan.ceilings), seed: plan.seed, order: slot.order };
}
export function exactMatch(a: unknown, b: unknown) { return canonicalJson(a) === canonicalJson(b); }
