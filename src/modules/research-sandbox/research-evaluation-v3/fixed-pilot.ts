import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { createDomainProblemContract } from "../research-core-v3";
import { evaluationDigest, EvaluationRefusal, type StudyPlan } from "./contracts";
import { sealPairedStudyPlan } from "./plan";

// Fixed PUBLIC software controls. These never establish blind AI accuracy.
// Private evaluator labels/controlled return bytes are NOT a solver projection.
const q = (n: number) => ({ numerator: String(n), denominator: "1" });
const coefficients = (v: number[]) => v.map(q);
const poly = (left: number[][], right: number[][]) => ({ kind: "RATIONAL_IDENTITY", left: { factors: left.map(coefficients) }, right: { factors: right.map(coefficients) } });
const cert = (left: number[], right = left) => ({ kind: "IDENTITY_CERTIFICATE", leftCoefficients: coefficients(left), rightCoefficients: coefficients(right) });
export const fixedPublicControls = Object.freeze([
  { id: "integer-sum-five", adapter: "INTEGER_WITNESS", input: { kind: "LINEAR_WITNESS", coefficients: ["1", "1"], rhs: "5" }, candidate: { kind: "INTEGER_WITNESS", values: ["2", "3"] }, valid: true },
  { id: "integer-weighted", adapter: "INTEGER_WITNESS", input: { kind: "LINEAR_WITNESS", coefficients: ["2", "3"], rhs: "7" }, candidate: { kind: "INTEGER_WITNESS", values: ["2", "1"] }, valid: true },
  { id: "integer-finite-box", adapter: "INTEGER_WITNESS", input: { kind: "FINITE_LINEAR_REFUTATION", coefficients: ["2"], rhs: "3", maxValue: 4 }, candidate: { kind: "FINITE_EXHAUSTION", checkedAssignments: 4 }, valid: true },
  { id: "integer-invalid-parity", adapter: "INTEGER_WITNESS", input: { kind: "LINEAR_WITNESS", coefficients: ["2"], rhs: "3" }, candidate: { kind: "INTEGER_WITNESS", values: ["1"] }, valid: false },
  { id: "graph-edge", adapter: "FINITE_GRAPH", input: { kind: "COLORING", vertexCount: 2, edges: [[0, 1]], colorCount: 2 }, candidate: { kind: "COLORING", colors: [0, 1] }, valid: true },
  { id: "graph-path", adapter: "FINITE_GRAPH", input: { kind: "COLORING", vertexCount: 3, edges: [[0, 1], [1, 2]], colorCount: 2 }, candidate: { kind: "COLORING", colors: [0, 1, 0] }, valid: true },
  { id: "graph-odd-cycle", adapter: "FINITE_GRAPH", input: { kind: "ODD_CYCLE", vertexCount: 3, edges: [[0, 1], [0, 2], [1, 2]] }, candidate: { kind: "ODD_CYCLE", cycle: [0, 1, 2] }, valid: true },
  { id: "graph-invalid-triangle", adapter: "FINITE_GRAPH", input: { kind: "COLORING", vertexCount: 3, edges: [[0, 1], [0, 2], [1, 2]], colorCount: 2 }, candidate: { kind: "COLORING", colors: [0, 1, 0] }, valid: false },
  { id: "poly-binomial", adapter: "POLYNOMIAL_IDENTITY", input: poly([[1, 1], [1, 1]], [[1, 2, 1]]), candidate: cert([1, 2, 1]), valid: true },
  { id: "poly-difference", adapter: "POLYNOMIAL_IDENTITY", input: poly([[-1, 1], [1, 1]], [[-1, 0, 1]]), candidate: cert([-1, 0, 1]), valid: true },
  { id: "poly-constant", adapter: "POLYNOMIAL_IDENTITY", input: poly([[2], [3]], [[6]]), candidate: cert([6]), valid: true },
  { id: "poly-invalid-shift", adapter: "POLYNOMIAL_IDENTITY", input: poly([[1, 1]], [[2, 1]]), candidate: cert([1, 1], [2, 1]), valid: false },
]);
export const referenceSetDigest = evaluationDigest(fixedPublicControls.map(c => ({ id: c.id, valid: c.valid })));
export function assertFixedPilotReferences(plan: StudyPlan) {
  if (plan.referenceSetDigest !== referenceSetDigest || plan.tasks.length !== fixedPublicControls.length) throw new EvaluationRefusal("INTEGRITY", "Unreviewed fixed pilot reference set");
  for (const [index, task] of plan.tasks.entries()) {
    const control = fixedPublicControls[index];
    const contract = task.contract as { domain: { adapterId: string; input: unknown } };
    if (task.id !== control.id || contract.domain.adapterId !== control.adapter || evaluationDigest(contract.domain.input) !== evaluationDigest(control.input) ||
      task.referenceDigest !== evaluationDigest({ id: control.id, valid: control.valid })) throw new EvaluationRefusal("INTEGRITY", "Fixed control input/order/label binding drift");
  }
}
export function fixedControlledCandidate(taskId: string) {
  const control = fixedPublicControls.find(t => t.id === taskId);
  if (!control) throw new Error("Unknown controlled fixture task");
  return canonicalJson(control.candidate);
}
export function fixedPilotPlan(id = "PUBLIC_EXACT_SOFTWARE_PILOT_V3") {
  return sealPairedStudyPlan({ version: 3, id, purpose: "PUBLIC_PILOT_12",
    tasks: fixedPublicControls.map(c => ({ id: c.id, contract: createDomainProblemContract({ id: `${id}:${c.id}`, rootId: id,
      target: `Return an exact certificate for the sealed ${c.adapter} problem; if unsupported do not claim success.`, mode: "ENGINEERING",
      adapterId: c.adapter, input: c.input, obligationId: "exact-scope" }).contract,
      referenceDigest: evaluationDigest({ id: c.id, valid: c.valid }), exposure: "PUBLIC_ENGINEERING_CONTROL",
      sourceExposureDigest: evaluationDigest({ public: true, source: "SEALED_DEFINITIONS_ONLY" }),
      toolsetDigest: evaluationDigest({ tools: ["INSTALLED_EXACT_CHECKER"], adapter: c.adapter }) })),
    requestedProvider: "CONTROLLED_LOCAL", requestedModel: "CONTROLLED_FIXED_RESPONSE_V3", requestedModelVersion: null,
    seed: 7601, ceilings: { total: { calls: 4, tokens: 4000, checkerOperations: 2000000, computeMilliseconds: 300000, readBytes: 33554432, writeBytes: 8388608 },
      perCall: { tokens: 1000, milliseconds: 5000 }, wallMilliseconds: 120000, maxRounds: 2,
      postgrade: { actions: 8, total: { calls: 0, tokens: 0, checkerOperations: 2000000, computeMilliseconds: 120000, readBytes: 16777216, writeBytes: 4194304 } } },
    evaluatorVersion: "EXACT_SCOPED_POSTGRADER_V3", referenceSetDigest, ordering: "TASK_ORDER_ALTERNATING_FIRST_ARM",
    promotion: "ZERO_FALSE_ACCEPT_AND_PLUS_TWO_ACCEPTED_OR_MINUS_25_PERCENT_MEDIAN_INTERVENTIONS_NO_ACCEPTED_LOSS",
    liveExperiment: "NOT_RUN", heldOut: false, limits: "CONTROLLED_SOFTWARE_EVIDENCE_NOT_AI_SUPERIORITY_OR_REAL_USER_VALUE" });
}
