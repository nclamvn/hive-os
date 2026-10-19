import { performance } from "node:perf_hooks";
import { readSync } from "node:fs";
import type { DualOptions } from "./dual-target";

function readTighterLimits(): Partial<Record<keyof Omit<DualOptions, "now" | "origin">, number>> {
  if (process.stdin.isTTY) return {};
  const bytes = Buffer.alloc(65_537); let length = 0;
  for (;;) { const count = readSync(0, bytes, length, bytes.length - length, null); length += count; if (length > 65_536) throw new RangeError("Bounded stdin limit65536 bytes"); if (!count) break; }
  const text = bytes.subarray(0, length).toString("utf8").trim(); if (!text) return {};
  const input: unknown = JSON.parse(text);
  if (input === null || typeof input !== "object" || Array.isArray(input) || Object.keys(input).join() !== "limits") throw new RangeError("Only tighter limits object accepted");
  const limits = (input as { limits: unknown }).limits;
  if (limits === null || typeof limits !== "object" || Array.isArray(limits) || Object.keys(limits).some((k) => !["seconds", "maxRows", "maxStateInsertions", "maxWork", "maxOutputBytes"].includes(k))) throw new RangeError("Only frozen resource keys accepted");
  return limits as Partial<Record<keyof Omit<DualOptions, "now" | "origin">, number>>;
}

async function main() {
  const origin = performance.now();
  if (process.argv.length !== 2) throw new RangeError("Fixed CLI accepts no expansion arguments");
  const limits = readTighterLimits();
  const { dualTargetPacket, sealDualPacket, DUAL_TARGET_LIMITS } = await import("./dual-target");
  const packet = dualTargetPacket({ ...limits, origin });
  packet.runtime.elapsedMs = performance.now() - origin;
  if (packet.status === "COMPLETE" && packet.runtime.elapsedMs >= Math.min(DUAL_TARGET_LIMITS.seconds, packet.limits.seconds) * 1000) { packet.status = "PARTIAL"; packet.reason = "TIME_LIMIT"; packet.pending = { phase: "FINALIZE" }; }
  sealDualPacket(packet); let output = JSON.stringify(packet);
  const observed = performance.now() - origin;
  packet.runtime.elapsedMs = observed;
  if (observed >= packet.limits.seconds * 1000 && packet.status === "COMPLETE") { packet.status = "PARTIAL"; packet.reason = "TIME_LIMIT"; packet.pending = { phase: "FINALIZE" }; }
  sealDualPacket(packet); output = JSON.stringify(packet);
  const finalObserved = performance.now() - origin;
  if (finalObserved >= packet.limits.seconds * 1000 && packet.status === "COMPLETE") { packet.status = "PARTIAL"; packet.reason = "TIME_LIMIT"; packet.pending = { phase: "FINALIZE" }; packet.runtime.elapsedMs = finalObserved; sealDualPacket(packet); output = JSON.stringify(packet); }
  if (Buffer.byteLength(output) > packet.limits.maxOutputBytes) throw new RangeError("Final CLI output limit");
  process.stdout.write(output); if (packet.status !== "COMPLETE") process.exitCode = 1;
}
void main().catch((error: unknown) => { process.stderr.write(`${error instanceof Error ? error.message : "UNAVAILABLE"}\n`); process.exitCode = 1; });
