import { splitSupportPacket } from "./split-support-check";
import { replaySplitSupport } from "./split-support-replay";

try {
  const decision = splitSupportPacket(), replay = replaySplitSupport(decision);
  console.log(JSON.stringify({ decision, replay }));
  if (replay.status !== "PASS") process.exitCode = 1;
} catch {
  console.log(JSON.stringify({ status: "UNAVAILABLE_OR_INCOMPLETE", scope: "Fixed split rays failed closed; no complete decision implied." }));
  process.exitCode = 1;
}
