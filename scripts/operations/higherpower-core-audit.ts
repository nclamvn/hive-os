import { higherpowerCorePacket } from "./higherpower-core-check";
import { replayHigherpowerCore } from "./higherpower-core-replay";

try {
  const decision = higherpowerCorePacket(), replay = replayHigherpowerCore(decision);
  console.log(JSON.stringify({ decision, replay }));
  if (decision.status !== "COMPLETE" || replay.status !== "PASS") process.exitCode = 1;
} catch {
  console.log(JSON.stringify({ status: "UNAVAILABLE_OR_INCOMPLETE", scope: "Fixed higher-power family failed closed; no complete claim." }));
  process.exitCode = 1;
}
