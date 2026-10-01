import { mixedCoreReplayProjection, mixedCoreResearchPacket } from "../../src/modules/research-sandbox/math-mixed-core";
import { replayMixedCorePacket } from "../../src/modules/research-sandbox/math-mixed-core-replay";

async function main() {
  const packet = mixedCoreResearchPacket(), replay = await replayMixedCorePacket(packet);
  console.log(JSON.stringify({ evidence: mixedCoreReplayProjection(packet), packetDigest: packet.digest, replay }));
  if (replay.status !== "PASS") process.exitCode = 1;
}
void main().catch(() => { console.error("MIXED_CORE_AUDIT_NOT_VALIDATED"); process.exitCode = 1; });
