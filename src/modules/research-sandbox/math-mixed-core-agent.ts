import { z } from "zod";
import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { sha256 } from "./integrity";
import { mixedCoreReplayProjection, mixedCoreResearchPacket } from "./math-mixed-core";
import { MIXED_CORE_REPLAY_SHA256, replayMixedCorePacket } from "./math-mixed-core-replay";

export const mixedCoreClaimSchema = z.enum([
  "ALL_RESIDUAL_PRIMES_HAVE_NORMALIZED_SINGLE_CORE_RESCUE",
  "KNOWN_RELATION_BOUND_IS_EXACT_FOR_EVERY_MIXED_CORE",
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

export const mixedCoreAgentEvidenceSchema = z.object({
  method: z.literal("ERDOS_STRAUS_MIXED_CORE_AGENT_EVIDENCE_V1"),
  rootContractDigest: digest,
  packet: packetSchema,
  replay: z.object({ status: z.enum(["PASS", "MISMATCH", "UNAVAILABLE"]),
    scriptDigest: z.literal(MIXED_CORE_REPLAY_SHA256), primaryDigest: digest,
    outputDigest: digest.nullable() }).strict(),
  evidenceDigest: digest,
}).strict().superRefine((record, ctx) => {
  const { evidenceDigest, ...body } = record;
  if (sha256(canonicalJson(body)) !== evidenceDigest || record.replay.primaryDigest !== record.packet.digest ||
    (record.replay.status === "PASS" && record.replay.outputDigest !== fixedV1().replayDigest) ||
    (record.replay.status === "UNAVAILABLE" && record.replay.outputDigest !== null)) {
    ctx.addIssue({ code: "custom", message: "Mixed-core binding/replay digest mismatch" });
  }
});
export type MixedCoreAgentEvidence = z.infer<typeof mixedCoreAgentEvidenceSchema>;

export async function runMixedCoreAgentEvidence(rootContractDigest: string): Promise<MixedCoreAgentEvidence> {
  digest.parse(rootContractDigest);
  const packet = mixedCoreResearchPacket(), replay = await replayMixedCorePacket(packet);
  const body = { method: "ERDOS_STRAUS_MIXED_CORE_AGENT_EVIDENCE_V1" as const, rootContractDigest, packet, replay };
  return mixedCoreAgentEvidenceSchema.parse({ ...body, evidenceDigest: sha256(canonicalJson(body)) });
}

export function validateMixedCoreAgentEvidence(value: unknown, rootContractDigest?: string): value is MixedCoreAgentEvidence {
  const result = mixedCoreAgentEvidenceSchema.safeParse(value);
  return result.success && (rootContractDigest === undefined || result.data.rootContractDigest === rootContractDigest);
}

/** Only these two precise typed universal assertions are mechanically refuted. */
export function mixedCoreRefutation(claim: MixedCoreClaim, evidence: MixedCoreAgentEvidence) {
  if (!validateMixedCoreAgentEvidence(evidence) || evidence.replay.status !== "PASS") return null;
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
  "When proposing one of the two EXACT universal assertions, set mixedCoreClaim to its registry ID. For every other hypothesis or a task studying why an assertion fails, set mixedCoreClaim:null. This typed check is not semantic-equivalence detection: independently review all prose and quantifiers.",
].join("\n");
