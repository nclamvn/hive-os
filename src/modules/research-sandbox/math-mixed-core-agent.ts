import { z } from "zod";
import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { sha256 } from "./integrity";
import { mixedCoreReplayProjection, mixedCoreResearchPacket } from "./math-mixed-core";
import { MIXED_CORE_REPLAY_SHA256, replayMixedCorePacket } from "./math-mixed-core-replay";
import { mixedCoreKernelPacket } from "./math-mixed-core-kernel";
import { MIXED_CORE_KERNEL_REPLAY_SHA256, replayMixedCoreKernelPacket } from "./math-mixed-core-kernel-replay";
import { mixedCorePowerEvidenceSchema, MIXED_CORE_V3_SCOPE } from "./math-mixed-core-power";

export const mixedCoreClaimSchema = z.enum([
  "ALL_RESIDUAL_PRIMES_HAVE_NORMALIZED_SINGLE_CORE_RESCUE",
  "KNOWN_RELATION_BOUND_IS_EXACT_FOR_EVERY_MIXED_CORE",
  "KNOWN_RELATION_BOUND_IS_EXACT_FOR_EVERY_PRIME_MODULUS",
]);
export type MixedCoreClaim = z.infer<typeof mixedCoreClaimSchema>;
const digest = z.string().regex(/^[a-f0-9]{64}$/);

// Fixed V1 evidence, not an arbitrary model-generated packet or executable plan.
let fixedPacketCanonical: string | null = null;
let fixedReplayDigest: string | null = null;
function fixedV1() {
  if (fixedPacketCanonical === null) {
    const expected = mixedCoreResearchPacket();
    fixedPacketCanonical = canonicalJson(expected);
    fixedReplayDigest = sha256(JSON.stringify(mixedCoreReplayProjection(expected)));
  }
  return { packetCanonical: fixedPacketCanonical, replayDigest: fixedReplayDigest! };
}
const packetSchema = z.custom<ReturnType<typeof mixedCoreResearchPacket>>((value) => {
  try { return canonicalJson(value) === fixedV1().packetCanonical; }
  catch { return false; }
}, "Fixed mixed-core V1 packet does not replay");

const v1BodySchema = z.object({
  method: z.literal("ERDOS_STRAUS_MIXED_CORE_AGENT_EVIDENCE_V1"),
  rootContractDigest: digest,
  packet: packetSchema,
  replay: z.object({ status: z.enum(["PASS", "MISMATCH", "UNAVAILABLE"]),
    scriptDigest: z.literal(MIXED_CORE_REPLAY_SHA256), primaryDigest: digest,
    outputDigest: digest.nullable() }).strict(),
  evidenceDigest: digest,
}).strict();
function checkBaseline(record: z.infer<typeof v1BodySchema>, ctx: z.RefinementCtx) {
  const { evidenceDigest, ...body } = record;
  if (sha256(canonicalJson(body)) !== evidenceDigest || record.replay.primaryDigest !== record.packet.digest ||
    (record.replay.status === "PASS" && record.replay.outputDigest !== fixedV1().replayDigest) ||
    (record.replay.status === "UNAVAILABLE" && record.replay.outputDigest !== null)) {
    ctx.addIssue({ code: "custom", message: "Mixed-core binding/replay digest mismatch" });
  }
}
export const mixedCoreAgentEvidenceV1Schema = v1BodySchema.superRefine(checkBaseline);
let kernelCanonical: string | null = null;
let kernelDigest: string | null = null;
function fixedKernel() {
  if (kernelCanonical === null) {
    const packet = mixedCoreKernelPacket();
    kernelCanonical = canonicalJson(packet);
    kernelDigest = sha256(JSON.stringify(packet));
  }
  return { canonical: kernelCanonical, digest: kernelDigest! };
}
const kernelPacketSchema = z.custom<ReturnType<typeof mixedCoreKernelPacket>>((value) => {
  try { return canonicalJson(value) === fixedKernel().canonical; } catch { return false; }
}, "Fixed collision-kernel packet does not replay");
export const MIXED_CORE_V2_SCOPE = "Root-bound cycle consumption of fixed V1 baseline and collision-kernel diagnostics; no formal, novelty, root theorem or target-hitting promotion";
const v2BodySchema = v1BodySchema.extend({
  method: z.literal("ERDOS_STRAUS_MIXED_CORE_AGENT_EVIDENCE_V2"),
  scope: z.literal(MIXED_CORE_V2_SCOPE),
  kernel: z.object({ packet: kernelPacketSchema, replay: z.object({
    status: z.enum(["PASS", "MISMATCH", "UNAVAILABLE"]),
    scriptDigest: z.literal(MIXED_CORE_KERNEL_REPLAY_SHA256), primaryDigest: digest,
    outputDigest: digest.nullable(),
  }).strict() }).strict(),
}).strict();
function checkV2(record: z.infer<typeof v2BodySchema> | z.infer<typeof v3BodySchema>, ctx: z.RefinementCtx) {
  const { evidenceDigest, ...body } = record;
  if (sha256(canonicalJson(body)) !== evidenceDigest || record.replay.primaryDigest !== record.packet.digest ||
    (record.replay.status === "PASS" && record.replay.outputDigest !== fixedV1().replayDigest) ||
    (record.replay.status === "UNAVAILABLE" && record.replay.outputDigest !== null) ||
    record.kernel.replay.primaryDigest !== fixedKernel().digest ||
    (record.kernel.replay.status === "PASS" && record.kernel.replay.outputDigest !== fixedKernel().digest) ||
    (record.kernel.replay.status === "UNAVAILABLE" && record.kernel.replay.outputDigest !== null)) {
    ctx.addIssue({ code: "custom", message: "Mixed-core V2 binding/replay digest mismatch" });
  }
}
export const mixedCoreAgentEvidenceV2Schema = v2BodySchema.superRefine(checkV2);
const v3BodySchema = v2BodySchema.extend({
  method: z.literal("ERDOS_STRAUS_MIXED_CORE_AGENT_EVIDENCE_V3"),
  scope: z.literal(MIXED_CORE_V3_SCOPE),
  power: mixedCorePowerEvidenceSchema,
}).strict();
export const mixedCoreAgentEvidenceV3Schema = v3BodySchema.superRefine(checkV2);
export const mixedCoreAgentEvidenceSchema = z.union([mixedCoreAgentEvidenceV1Schema, mixedCoreAgentEvidenceV2Schema, mixedCoreAgentEvidenceV3Schema]);
export type MixedCoreAgentEvidence = z.infer<typeof mixedCoreAgentEvidenceSchema>;
export type MixedCoreMethod = "MIXED_CORE_REPLAY_V1" | "MIXED_CORE_REPLAY_V2" | "MIXED_CORE_REPLAY_V3";
export function mixedCoreEvidencePassed(evidence: MixedCoreAgentEvidence) {
  return evidence.replay.status === "PASS" &&
    (evidence.method === "ERDOS_STRAUS_MIXED_CORE_AGENT_EVIDENCE_V1" || evidence.kernel.replay.status === "PASS") &&
    (evidence.method !== "ERDOS_STRAUS_MIXED_CORE_AGENT_EVIDENCE_V3" || evidence.power.replay.status === "PASS");
}
export function mixedCoreEvidenceMatchesMethod(evidence: MixedCoreAgentEvidence, method: MixedCoreMethod) {
  return evidence.method === `ERDOS_STRAUS_MIXED_CORE_AGENT_EVIDENCE_${method.slice(-2)}`;
}

export async function runMixedCoreAgentEvidence(rootContractDigest: string, method: MixedCoreMethod = "MIXED_CORE_REPLAY_V1"): Promise<MixedCoreAgentEvidence> {
  digest.parse(rootContractDigest);
  const packet = mixedCoreResearchPacket(), replay = await replayMixedCorePacket(packet);
  const body = { method: "ERDOS_STRAUS_MIXED_CORE_AGENT_EVIDENCE_V1" as const, rootContractDigest, packet, replay };
  if (method !== "MIXED_CORE_REPLAY_V1") {
    const kernelPacket = mixedCoreKernelPacket();
    const v2 = { ...body, method: "ERDOS_STRAUS_MIXED_CORE_AGENT_EVIDENCE_V2" as const,
      scope: MIXED_CORE_V2_SCOPE, kernel: { packet: kernelPacket, replay: await replayMixedCoreKernelPacket(kernelPacket) } };
    if (method === "MIXED_CORE_REPLAY_V3") {
      // Dynamic Node-only boundary: retained schema/trace/page reads never run G.
      const { runMixedCorePowerEvidence } = await import("@/server/research/mixed-core-power-evidence");
      const v3 = { ...v2, method: "ERDOS_STRAUS_MIXED_CORE_AGENT_EVIDENCE_V3" as const,
        scope: MIXED_CORE_V3_SCOPE, power: runMixedCorePowerEvidence() };
      return mixedCoreAgentEvidenceV3Schema.parse({ ...v3, evidenceDigest: sha256(canonicalJson(v3)) });
    }
    return mixedCoreAgentEvidenceV2Schema.parse({ ...v2, evidenceDigest: sha256(canonicalJson(v2)) });
  }
  return mixedCoreAgentEvidenceSchema.parse({ ...body, evidenceDigest: sha256(canonicalJson(body)) });
}

export function validateMixedCoreAgentEvidence(value: unknown, rootContractDigest?: string): value is MixedCoreAgentEvidence {
  const result = mixedCoreAgentEvidenceSchema.safeParse(value);
  return result.success && (rootContractDigest === undefined || result.data.rootContractDigest === rootContractDigest);
}

/** Exact registry IDs only; prime-only equality requires retained V2 or V3 evidence. */
export function mixedCoreRefutation(claim: MixedCoreClaim, evidence: MixedCoreAgentEvidence) {
  if (!validateMixedCoreAgentEvidence(evidence) || !mixedCoreEvidencePassed(evidence)) return null;
  if (claim === "KNOWN_RELATION_BOUND_IS_EXACT_FOR_EVERY_PRIME_MODULUS") return evidence.method !== "ERDOS_STRAUS_MIXED_CORE_AGENT_EVIDENCE_V1"
    ? { claim, counterexample: "m=132840, prime s=531359: 567 pairs minus 40 known edges gives bound 527 but exactly 525 ratio classes; no root refutation" } : null;
  return claim === "ALL_RESIDUAL_PRIMES_HAVE_NORMALIZED_SINGLE_CORE_RESCUE"
    ? { claim, counterexample: "p=131433121 and p=159727681: complete single-core exclusion plus strict two-core witnesses; normalized family only" }
    : { claim, counterexample: "m=1224, s=4895: known-relation bound 93 but exactly 92 ratio classes; not an Erdős–Straus counterexample" };
}

export const MIXED_CORE_AGENT_MANDATE = [
  "mixedCoreEvidence is a root-bound fixed-tool packet whose positive arithmetic and finite exclusion manifests were independently Python-replayed before this agent call.",
  "The inner packet's read-only scope describes its diagnostic producer. This separate evidence envelope is retained in the cycle ledger without promoting any scientific conclusion.",
  "Minimum support 2 counts distinct primes dividing m only in the declared normalized family, not all Type I/II solutions or denominator optimality.",
  "The packet's complete single-core exclusions use finite checks plus a written monotone tail argument. This is not Lean, novelty, a root solution, or a human scientific sign-off.",
  "The known-relation occupancy expression is an UPPER bound, not an equality or a coverage lower bound. m=1224/s=4895 has 105 pairs, bound 93 and only 92 classes; the Pell collision refutes universal equality.",
  "Do not recycle either refuted universal assertion, including paraphrases. Seek a genuinely narrower hitting condition or an explanation of additional CRT/kernel collisions. A local counterexample to occupancy equality is not an Erdős–Straus counterexample.",
  "When proposing any EXACT registered universal assertion, set mixedCoreClaim to its registry ID. For every other hypothesis or a task studying why an assertion fails, set mixedCoreClaim:null. This typed check is not semantic-equivalence detection: independently review all prose and quantifiers.",
].join("\n");

/** Do not leak newer unretained evidence into historical V1 agent contexts. */
export function mixedCoreAgentMandate(evidence: MixedCoreAgentEvidence) {
  if (evidence.method === "ERDOS_STRAUS_MIXED_CORE_AGENT_EVIDENCE_V1") return MIXED_CORE_AGENT_MANDATE;
  const kernelMandate = [MIXED_CORE_AGENT_MANDATE,
    "This V2 envelope's unchanged V1 baseline and kernel supplement were BOTH freshly replayed. All roles receive this same root-bound envelope. V1 alone does not refute the prime-only equality assertion.",
    "V2 has SIX fixed kernel atlases and NINE finite polynomial controls, not an independent replay of the million-row discovery scan. The infinite family m=8d(8d+1)(16d+1), d>=1 and R<=P-E-tau(d) have a WRITTEN proof, not a finite-to-infinite inference or formal acceptance.",
    "Prime counterexamples m132840/s531359 (527 versus 525), m360696/s1442783 (535 versus 533) disprove prime-only equality; extra collisions are not CRT-only. Energy P+2W gives R>=max(1,P-W,ceil(P²/(P+2W))), not a guarantee of hitting the named prime target.",
  ].join("\n");
  if (evidence.method === "ERDOS_STRAUS_MIXED_CORE_AGENT_EVIDENCE_V2") return kernelMandate;
  return [kernelMandate,
    "This V3 envelope adds the unchanged fixed G packet with fresh independent Python replay. Baseline, kernel AND power must PASS before any agent call; every existing role receives the same sealed root-bound V3 data.",
    "Power evidence decides exactly FOUR targets p=131433121,159727681,351121,171348241 in the normalized family m=2^a*ell^b, a>=1,b>=2,ell odd PRIME, for all a,b,ell,s through WRITTEN min-residue bounds. It is not arbitrary odd-composite split-support coverage, a global root theorem, formal acceptance, or established novelty.",
    "With B=2^a,q=ell^b the written bound is minR>=max(3B-1,ceil(4Bq/(B+1))-1), hence B<=(p+1)/3 and q<=floor((p+1)(B+1)/(4B))<=floor(3(p+1)/8). Do not extend that prime-power bound to several odd prime factors: q15/p19 is a countercontrol.",
    "The fixed replay has 71951 cores/10738865 signed-pair slots, FIVE hit cores/five canonical strict representatives, and TWO translated-only b3 hits p131433121/m1000/s3999 and p351121/m108/s431. These are not all solutions or new root coverage. The q81 core uses ell3/b4, not a composite ell9/b2.",
    "No hit for p159727681 in the ENTIRE b>=2 prime-power family does NOT exclude that root: the retained V1 baseline has the freshly replayed m284/s1135,A4/U71/k1 rescue (b1). The separate prior-research q99/m198/s791,A3/U11 rescue is NOT replayed or retained as a V3 power witness; perform a fresh scoped check before relying on it. Arbitrary composite split factors are outside G's scope. Seek a support-preserving structural mechanism without recycling a rejected global assertion.",
  ].join("\n");
}
