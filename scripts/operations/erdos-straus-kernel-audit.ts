import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { mixedCoreKernelPacket } from "./mixed-core-kernel";

const packet = mixedCoreKernelPacket();
const script = resolve("scripts/operations/replay-mixed-core-kernel.py");
const result = spawnSync("python3", ["-I", "-S", "-B", script], { encoding: "utf8", timeout: 10000, maxBuffer: 256 * 1024 });
const primary = JSON.stringify(packet);
const hash = (text: string | Buffer) => createHash("sha256").update(text).digest("hex");
let status = "UNAVAILABLE";
if (!result.error && result.status === 0) {
  try { status = JSON.stringify(JSON.parse(result.stdout)) === primary ? "PASS" : "MISMATCH"; }
  catch { status = "MISMATCH"; }
}
console.log(JSON.stringify({ packet, replay: { status, packetDigest: hash(primary),
  replayStdoutDigest: hash(result.stdout ?? ""), scriptDigest: hash(readFileSync(script)) } }));
if (status !== "PASS") process.exitCode = 1;
