import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createHash } from "node:crypto";
import { higherpowerCorePacket } from "../../../scripts/operations/higherpower-core-check";
import { replayHigherpowerCore } from "../../../scripts/operations/higherpower-core-replay";
import { mixedCorePowerEvidenceSchema, mixedCorePowerPacketSchema,
  MIXED_CORE_POWER_PACKET_SHA256, MIXED_CORE_POWER_PYTHON_SHA256, MIXED_CORE_POWER_CHECKER_SHA256,
  type MixedCorePowerEvidence } from "@/modules/research-sandbox/math-mixed-core-power";

/** Node-only fixed execution boundary, called by the cycle before any agent.
 * Never invoked by retained trace validation or page rendering. Frozen G code
 * supplies its existing 30s/target and Python 30s/256KiB limits unchanged. */
export function runMixedCorePowerEvidence(): MixedCorePowerEvidence {
  if (typeof window !== "undefined") throw new Error("Power replay is server-only");
  const hash = (value: string | Buffer) => createHash("sha256").update(value).digest("hex");
  let checkerDigest: string | null = null, primaryDigest: string | null = null;
  const failed = (status: "UNAVAILABLE" | "PARTIAL" | "MISMATCH", failure: MixedCorePowerEvidence["failure"]) =>
    mixedCorePowerEvidenceSchema.parse({ expectedPacketDigest: MIXED_CORE_POWER_PACKET_SHA256,
      expectedCheckerDigest: MIXED_CORE_POWER_CHECKER_SHA256, checkerDigest, packet: null,
      replay: { status, expectedScriptDigest: MIXED_CORE_POWER_PYTHON_SHA256,
        scriptDigest: null, primaryDigest, outputDigest: null }, failure });
  try {
    checkerDigest = hash(readFileSync(resolve("scripts/operations/higherpower-core-check.ts")));
    if (checkerDigest !== MIXED_CORE_POWER_CHECKER_SHA256) return failed("UNAVAILABLE", "CHECKER_UNAVAILABLE");
    const packet = higherpowerCorePacket();
    primaryDigest = hash(JSON.stringify(packet));
    if (packet.status !== "COMPLETE") return failed("PARTIAL", "CHECKER_PARTIAL");
    if (primaryDigest !== MIXED_CORE_POWER_PACKET_SHA256 || !mixedCorePowerPacketSchema.safeParse(packet).success)
      return failed("MISMATCH", "PACKET_DRIFT");
    const replay = replayHigherpowerCore(packet);
    return mixedCorePowerEvidenceSchema.parse({ expectedPacketDigest: MIXED_CORE_POWER_PACKET_SHA256,
      expectedCheckerDigest: MIXED_CORE_POWER_CHECKER_SHA256, checkerDigest, packet,
      replay: { ...replay, expectedScriptDigest: MIXED_CORE_POWER_PYTHON_SHA256 },
      failure: replay.status === "PASS" ? null : "REPLAY_FAILED" });
  } catch { return failed("UNAVAILABLE", "CHECKER_UNAVAILABLE"); }
}
