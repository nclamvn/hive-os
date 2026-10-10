import { createHash } from "node:crypto";
import { canonicalJson } from "@/modules/execution-fabric/contracts";

const digest = (value: unknown) => createHash("sha256").update(canonicalJson(value)).digest("hex");
const hash = /^[a-f0-9]{64}$/;
const freeze = <T>(value: T): T => { if (value && typeof value === "object") { Object.values(value).forEach(freeze); Object.freeze(value); } return value; };
export const LRC_MATCHED_FIXTURES = freeze([
  { id: "KNOWN_SHIFT_CONDITIONAL_LEMMA_V1", mode: "REPRODUCTION", oracle: "KNOWN_CONDITIONAL_AND_EXACT_FINITE_ONLY",
    statement: "For fourteen positive integer moving speeds, prime d and e nondivisible exceptions, assume LRC(m) for every 1<=m<=12, e>=2 and e*ceil(2d/15)<d. Reproduce the known conditional few-exception shift lemma without promoting finite phase controls to a universal real-time proof.",
    input: { d: 3, e: 2, unitResidues: [1, 1], offsets: [{ numerator: "1", denominator: "30" }, { numerator: "1", denominator: "3" }] } },
  { id: "INCOMPLETE_SHIFT_CERTIFICATE_V1", mode: "REPRODUCTION", oracle: "CERTIFICATE_REFUSED_NOT_LRC_REFUTED",
    statement: "Audit the exact d=5,e=4 phase certificate after its first OPEN cell in the unitResidue1 partition is removed and the body digest coherently recomputed. Refuse incomplete coverage, not the LRC theorem.",
    input: { d: 5, e: 4, unitResidues: [1, 1, 1, 1], offsets: [{ numerator: "0", denominator: "1" }, { numerator: "1", denominator: "5" }, { numerator: "2", denominator: "5" }, { numerator: "3", denominator: "5" }] } },
  { id: "SHIFT_SURVIVOR_LOWER_BOUND_PLUS_ONE_FINITE_V1", mode: "DISCOVERY", oracle: "EXACT_STRENGTHENED_FINITE_PREDICATE_REFUTATION_ONLY",
    statement: "Test the strengthened finite predicate: every admissible d=3,e=2 rational phase/unit instance has at least d-e*ceil(2d/15)+1=2 good shifts. A refutation applies only to this strengthened count, not the source bound or LRC.",
    input: { d: 3, e: 2, unitResidues: [1, 1], offsets: [{ numerator: "1", denominator: "30" }, { numerator: "1", denominator: "3" }], claimedMinimumGoodShifts: 2,
      linkage: { speeds: [1, 10, 3, 6, 9, 12, 15, 18, 21, 24, 27, 33, 36, 39], time: { numerator: "1", denominator: "30" } } } },
  { id: "BAD_SHIFT_OVERLAP_STRUCTURAL_GAIN_V1", mode: "DISCOVERY", oracle: "NONE_NOVELTY_PENDING",
    statement: "Propose an exact falsifiable structural condition on bad-shift overlaps that might improve the sufficient union bound. Retain domain, quantifiers, source difference, strongest objection and discriminating output. No successful conjecture is preset; dispatch requires separate exact-domain admission.",
    input: { supportedFiniteDomain: "d3/e2 or d5/e2..4", state: "NOT_DISPATCHABLE_WITHOUT_EXACT_DOMAIN_ADMISSION" } },
] as const);
export type LrcMatchedFixtureId = typeof LRC_MATCHED_FIXTURES[number]["id"];
export type LrcMatchedExposure = { unitDigest: string; sourceDataDigest: string; sourceLocator: string;
  checkerVersion: string; checkerSourceSha256: string; schemaDigest: string };
export const LRC_MATCHED_CAPS = freeze({
  originalDeadlineMs: 1_800_000, childDeadlineMs: 240_000, perRoleStdoutBytes: 1_048_576,
  preparedInputUtf8Bytes: 49_152, solverMathUtf8Bytes: 16_384, roleFindingsUtf8Bytes: 8_192,
  feedbackSummaryBytes: 1_024, findingReasonBytes: 256, hostAuditReportUtf8Bytes: 32_768,
  finite: { inputUtf8Bytes: 32_768, componentBits: 256, deadlineMs: 5_000, explicitOperations: 2_000_000,
    domain: ["d3/e2", "d5/e2", "d5/e3", "d5/e4"] },
} as const);

/** Offline preparation only. The exposure must come from the frozen host registry, never a provider. */
export function prepareMatchedMathBenchmarkManifest(id: LrcMatchedFixtureId, exposure: LrcMatchedExposure) {
  const fixture = LRC_MATCHED_FIXTURES.find(value => value.id === id);
  if (!fixture || ![exposure.unitDigest, exposure.sourceDataDigest, exposure.checkerSourceSha256, exposure.schemaDigest].every(value => hash.test(value)) ||
      !exposure.sourceLocator || !exposure.checkerVersion || Object.keys(exposure).sort().join() !==
      ["unitDigest", "sourceDataDigest", "sourceLocator", "checkerVersion", "checkerSourceSha256", "schemaDigest"].sort().join()) throw new Error("BENCHMARK_EXPOSURE_REFUSED");
  const common = { fixture, exposure, quantifiersConvention: "15_TOTAL_RUNNERS_14_POSITIVE_INTEGER_MOVING_SPEEDS_STRICT_BAD_1_OVER_15",
    sourceVisible: true, heldOut: false, requestedProvider: "codex-local", requestedModel: "gpt-6-sol",
    roleAllowance: ["SOLVER", "ADVERSARY", "CRITIC"], maxCalls: 3, retries: 0, network: false,
    tools: ["HOST_PINNED_FINITE_SHIFT_CHECKER"], formalKernel: "UNAVAILABLE", caps: LRC_MATCHED_CAPS };
  const body = { version: 1, id: "LRC_METHOD_MATCHED_OFFLINE_V1", fixtureId: id, executionAuthority: "NOT_AUTHORIZED",
    difference: "ORCHESTRATION_ONLY_NOT_ADDITIONAL_INFORMATION", laneOrder: ["SOLVER", "ADVERSARY", "HOST_FINITE_CHECK", "CRITIC"],
    criticAdversaryProse: false, criticFiniteSummaryBytes: 1_024,
    arms: [{ arm: "DIRECT_SOLVER", common: structuredClone(common) }, { arm: "METHOD_ASSISTED", common: structuredClone(common) }] };
  return { ...body, manifestDigest: digest(body) };
}
export type LrcMatchedManifest = ReturnType<typeof prepareMatchedMathBenchmarkManifest>;
export function prepareMatchedMathBenchmarkReport(manifest: LrcMatchedManifest) {
  return { version: 1, execution: "NOT_RUN", manifestDigest: manifest.manifestDigest, actualCalls: null,
    actualElapsedMs: null, actualUsage: null, roleContexts: null, actualCheckerResults: null,
    admittedMathematicalOutcomes: null, efficacyClaim: "NONE", heldOut: false } as const;
}

/** Refuses drift even after coherent hashes. NOT_RUN is not an empirical benchmark result. */
export function validateMatchedMathBenchmarkReport(raw: unknown, manifest: LrcMatchedManifest, expectedExposure: LrcMatchedExposure): boolean {
  try {
    const expected = prepareMatchedMathBenchmarkManifest(manifest.fixtureId, expectedExposure);
    return canonicalJson(manifest) === canonicalJson(expected) && canonicalJson(raw) === canonicalJson(prepareMatchedMathBenchmarkReport(expected));
  } catch { return false; }
}
