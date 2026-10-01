import { z } from "zod";
import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { sha256 } from "./integrity";
import type { higherpowerCorePacket, higherpowerTargetAudit } from "../../../scripts/operations/higherpower-core-check";

// Fixed G bytes and their JSONB-order-independent equivalent. Validation never
// imports or executes the standalone enumeration/replay implementation.
export const MIXED_CORE_POWER_PACKET_SHA256 = "0077816c13c6f6ff6fbb490d220396a63cc92f07e0e9bde24a316b5077ee85a9";
export const MIXED_CORE_POWER_CANONICAL_SHA256 = "f1732889d2a7c0d2f425f282aa37e236539a1284ebec45bfd1f0d5625ef440f5";
export const MIXED_CORE_POWER_PYTHON_SHA256 = "4cfbb8c77a2d09c624eb9e2771de2efaea7fbe318d7e617c3ee0b7d57c582fad";
export const MIXED_CORE_POWER_CHECKER_SHA256 = "fb2f8cc44564f86c4bb8982ee28efbdcb914505ec8ccb77e8a22354b122945cd";
export const MIXED_CORE_V3_SCOPE = "Root-bound fixed FOUR-target full odd-prime-power evidence, a>=1,b>=2,ell odd PRIME; no arbitrary composite split-support exclusion, global root proof, formal acceptance or novelty";
type CompleteTarget = Extract<ReturnType<typeof higherpowerTargetAudit>, { status: "COMPLETE_FOR_FULL_ODD_PRIME_POWER_CORE" }>;
export type MixedCorePowerPacket = Omit<ReturnType<typeof higherpowerCorePacket>, "status" | "targets"> & {
  status: "COMPLETE"; targets: CompleteTarget[];
};
const digest = z.string().regex(/^[a-f0-9]{64}$/);
export const mixedCorePowerPacketSchema = z.custom<MixedCorePowerPacket>((value) => {
  try { return sha256(canonicalJson(value)) === MIXED_CORE_POWER_CANONICAL_SHA256; }
  catch { return false; }
}, "Power packet is not the exact COMPLETE fixed G packet (targets/limits/scope/content)");
export const mixedCorePowerEvidenceSchema = z.object({
  expectedPacketDigest: z.literal(MIXED_CORE_POWER_PACKET_SHA256),
  expectedCheckerDigest: z.literal(MIXED_CORE_POWER_CHECKER_SHA256),
  checkerDigest: digest.nullable(),
  packet: mixedCorePowerPacketSchema.nullable(),
  replay: z.object({
    status: z.enum(["PASS", "MISMATCH", "UNAVAILABLE", "PARTIAL"]),
    expectedScriptDigest: z.literal(MIXED_CORE_POWER_PYTHON_SHA256),
    scriptDigest: digest.nullable(), primaryDigest: digest.nullable(), outputDigest: digest.nullable(),
  }).strict(),
  failure: z.enum(["CHECKER_PARTIAL", "CHECKER_UNAVAILABLE", "PACKET_DRIFT", "REPLAY_FAILED"]).nullable(),
}).strict().superRefine((record, ctx) => {
  const r = record.replay;
  if ((r.status === "PASS" && (record.failure !== null || record.packet === null ||
      record.checkerDigest !== MIXED_CORE_POWER_CHECKER_SHA256 || r.scriptDigest !== MIXED_CORE_POWER_PYTHON_SHA256 ||
      r.primaryDigest !== MIXED_CORE_POWER_PACKET_SHA256 || r.outputDigest !== MIXED_CORE_POWER_PACKET_SHA256)) ||
    (r.status !== "PASS" && record.failure === null) ||
    (record.failure === "CHECKER_PARTIAL" && (r.status !== "PARTIAL" || record.packet !== null ||
      record.checkerDigest !== MIXED_CORE_POWER_CHECKER_SHA256 || r.primaryDigest === null ||
      r.primaryDigest === MIXED_CORE_POWER_PACKET_SHA256)) ||
    (record.failure === "CHECKER_UNAVAILABLE" && (r.status !== "UNAVAILABLE" || record.packet !== null)) ||
    (record.failure === "PACKET_DRIFT" && (r.status !== "MISMATCH" || record.packet !== null ||
      record.checkerDigest !== MIXED_CORE_POWER_CHECKER_SHA256 || r.primaryDigest === null ||
      r.scriptDigest !== null || r.outputDigest !== null)) ||
    (record.failure === "REPLAY_FAILED" && (record.packet === null ||
      record.checkerDigest !== MIXED_CORE_POWER_CHECKER_SHA256 ||
      (r.status !== "MISMATCH" && r.status !== "UNAVAILABLE") ||
      (r.status === "MISMATCH" && (r.scriptDigest !== MIXED_CORE_POWER_PYTHON_SHA256 || r.outputDigest === null)))) ||
    (record.packet !== null && r.primaryDigest !== MIXED_CORE_POWER_PACKET_SHA256) ||
    (r.status === "UNAVAILABLE" && (r.scriptDigest !== null || r.outputDigest !== null)) ||
    (r.status === "PARTIAL" && (record.packet !== null || record.failure !== "CHECKER_PARTIAL" ||
      r.scriptDigest !== null || r.outputDigest !== null)) ||
    (r.status === "MISMATCH" && record.failure !== "PACKET_DRIFT" && record.failure !== "REPLAY_FAILED")) {
    ctx.addIssue({ code: "custom", message: "Power packet/replay/source/completeness binding mismatch" });
  }
});
export type MixedCorePowerEvidence = z.infer<typeof mixedCorePowerEvidenceSchema>;
