import { twoCoreTargetPacket } from "./two-core-target";
import { replayTwoCoreTargetPacket } from "./two-core-target-replay";

const packet = twoCoreTargetPacket();
const replay = replayTwoCoreTargetPacket(packet);
console.log(JSON.stringify({ packet, replay }));
if (replay.status !== "PASS") process.exitCode = 1;
