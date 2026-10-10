import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { createDomainProblemContract, prepareProblemContract, applicableDomainMethods } from "../research-core-v3";
import { evaluationDigest, EvaluationRefusal } from "./contracts";
import { fixedPilotPlan } from "./fixed-pilot";
import { sealPairedStudyPlan } from "./plan";

// DOMAIN-OWNED reviewed installation catalog. Only rows/imports extend for R3.
// Never expose candidate bytes or evaluator reference data in public UI props.
const catalog = [
  { id: "LINEAR_FIVE", label: { en: "Positive integer witness", vi: "Chứng chỉ số nguyên dương" }, adapterId: "INTEGER_WITNESS",
    input: { kind: "LINEAR_WITNESS", coefficients: ["1", "1"], rhs: "5" }, candidate: { kind: "INTEGER_WITNESS", values: ["2", "3"] } },
  { id: "TRIANGLE_CYCLE", label: { en: "Finite graph odd cycle", vi: "Chu trình lẻ trên đồ thị hữu hạn" }, adapterId: "FINITE_GRAPH",
    input: { kind: "ODD_CYCLE", vertexCount: 3, edges: [[0, 1], [0, 2], [1, 2]] }, candidate: { kind: "ODD_CYCLE", cycle: [0, 1, 2] } },
  { id: "BINOMIAL_IDENTITY", label: { en: "Exact polynomial identity", vi: "Đồng nhất thức đa thức chính xác" }, adapterId: "POLYNOMIAL_IDENTITY",
    input: { kind: "RATIONAL_IDENTITY", left: { factors: [[{ numerator: "1", denominator: "1" }, { numerator: "1", denominator: "1" }], [{ numerator: "1", denominator: "1" }, { numerator: "1", denominator: "1" }]] },
      right: { factors: [[{ numerator: "1", denominator: "1" }, { numerator: "2", denominator: "1" }, { numerator: "1", denominator: "1" }]] } },
    candidate: { kind: "IDENTITY_CERTIFICATE", leftCoefficients: [{ numerator: "1", denominator: "1" }, { numerator: "2", denominator: "1" }, { numerator: "1", denominator: "1" }],
      rightCoefficients: [{ numerator: "1", denominator: "1" }, { numerator: "2", denominator: "1" }, { numerator: "1", denominator: "1" }] } },
  { id: "RATIONAL_NEGATIVE_FLOOR", label: { en: "Exact rational enclosure and negative floor", vi: "Khoảng hữu tỉ và phần nguyên âm chính xác" }, adapterId: "RATIONAL_INTERVAL_FLOOR",
    input: { kind: "RATIONAL_EXPRESSION", expression: { op: "DIV", left: { op: "Q", numerator: "-7", denominator: "1" }, right: { op: "Q", numerator: "3", denominator: "1" } } },
    candidate: { kind: "INTERVAL_FLOOR_CERTIFICATE", inputDigest: evaluationDigest({ kind: "RATIONAL_EXPRESSION", expression: { op: "DIV", left: { op: "Q", numerator: "-7", denominator: "1" }, right: { op: "Q", numerator: "3", denominator: "1" } } }),
      lower: { numerator: "-5", denominator: "2" }, upper: { numerator: "-9", denominator: "4" }, floor: "-3" } },
];
export function controlledCampaignProfile(id: string) {
  const row = catalog.find(r => r.id === id);
  if (!row) throw new EvaluationRefusal("UNSUPPORTED", "Reviewed controlled profile unavailable");
  const prepared = createDomainProblemContract({ id: `controlled:${row.id}`, rootId: "PUBLIC_DOMAIN_TRANSFER_V3",
    target: row.label.en, mode: "ENGINEERING", adapterId: row.adapterId, input: row.input, obligationId: "exact-scope" });
  return { id: row.id, label: row.label, contract: prepared.contract,
    envelopeMethods: applicableDomainMethods(prepareProblemContract(prepared.contract), "exact-scope").map(card => card.id), candidateBytes: canonicalJson(row.candidate) };
}
export function publicCampaignProfiles() {
  return catalog.map(row => { const profile = controlledCampaignProfile(row.id); return { id: profile.id, label: profile.label, contract: profile.contract }; });
}
export function catalogTransferStudy(id: string) {
  const profile = controlledCampaignProfile(id), common = fixedPilotPlan();
  const { planDigest, ...body } = common; void planDigest;
  return sealPairedStudyPlan({ ...body,
    id: `TRANSFER_${id}`, purpose: "ARCHITECTURE_TRANSFER", tasks: [{ id: profile.id, contract: profile.contract,
      referenceDigest: evaluationDigest({ publicProfile: profile.id }), exposure: "PUBLIC_ENGINEERING_CONTROL",
      sourceExposureDigest: evaluationDigest({ public: true, definitions: profile.contract.definitions }),
      toolsetDigest: evaluationDigest({ tools: ["INSTALLED_EXACT_CHECKER"], adapter: profile.contract.domain.adapterId }) }],
    referenceSetDigest: evaluationDigest({ purpose: "ARCHITECTURE_TRANSFER", profile: profile.id }) });
}
