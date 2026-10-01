import { loadSquareCoreArtifact, verifySquareCoreArtifact } from "./square-core-check";
import { replaySquareCore } from "./square-core-replay";

try {
  const decision = verifySquareCoreArtifact(loadSquareCoreArtifact());
  const replay = replaySquareCore(decision);
  console.log(JSON.stringify({ decision, replay }));
  if (replay.status !== "PASS" || decision.targets.some((t) => t.status === "PARTIAL")) process.exitCode = 1;
} catch {
  console.log(JSON.stringify({ status: "UNAVAILABLE_OR_CORRUPT", higherAorB: "UNCOMPUTED", scope: "No complete square-core slice decision certified." }));
  process.exitCode = 1;
}
