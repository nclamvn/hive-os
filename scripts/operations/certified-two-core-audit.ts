import { loadCertifiedTwoCoreArtifact, verifyCertifiedTwoCoreArtifact } from "./certified-two-core-check";
import { replayCertifiedTwoCore } from "./certified-two-core-replay";

try {
  const decision = verifyCertifiedTwoCoreArtifact(loadCertifiedTwoCoreArtifact());
  const replay = replayCertifiedTwoCore(decision);
  console.log(JSON.stringify({ decision, replay }));
  if (replay.status !== "PASS") process.exitCode = 1;
} catch {
  console.log(JSON.stringify({ status: "UNAVAILABLE_OR_INCOMPLETE", scope: "No complete target decision certified; inspect fixed artifact unresolved inputs and integrity." }));
  process.exitCode = 1;
}
