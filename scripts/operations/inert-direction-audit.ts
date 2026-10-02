import { performance } from "node:perf_hooks";

if (process.argv.length !== 2) { console.error("Frozen inert-direction CLI accepts no arguments."); process.exitCode = 2; }
else void (async () => {
  const origin = performance.now();
  try {
    const { inertDirectionPacket, sealInertPacket } = await import("./inert-direction");
    const packet = inertDirectionPacket({ origin });
    let output = JSON.stringify(packet);
    if (performance.now() - origin >= packet.limits.seconds * 1000 && packet.status === "COMPLETE") {
      packet.status = "PARTIAL"; packet.reason = "TIME_LIMIT"; packet.pending = { phase: "FINALIZE" }; packet.runtime.elapsedMs = Math.round(performance.now() - origin); sealInertPacket(packet); output = JSON.stringify(packet);
    }
    if (Buffer.byteLength(output, "utf8") > packet.limits.maxOutputBytes) throw new Error("Final output cap");
    console.log(output); if (packet.status !== "COMPLETE") process.exitCode = 1;
  } catch { console.error("Inert-direction audit failed closed; no complete or root proof claim."); process.exitCode = 1; }
})();
