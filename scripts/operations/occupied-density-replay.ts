import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { performance } from "node:perf_hooks";
import { OCCUPIED_DENSITY_PINS, occupiedDensityHash, compareOccupiedDensityReplay, verifyOccupiedDensityPacket } from "./occupied-density-check";

export const OCCUPIED_DENSITY_REPLAY_SHA256 = "04a1f3b1a7a47ee2e97856dbc4595abb21e3f92bacd684e929c81f6ebdf46b1b";
export const OCCUPIED_DENSITY_REPLAY_LIMITS = { timeout: 60000, maxBuffer: 8388608, maxPairChecks: 50000000, maxWorkSteps: 50000000, maxStateInsertions: 2000000, checkerWorkCeiling: 50000000 } as const;
const hash = (v: Buffer|string) => createHash("sha256").update(v).digest("hex");
const dependencies = { primary: "scripts/operations/block-coverage.ts", checker: "scripts/operations/block-coverage-check.ts", replay: "scripts/operations/block-coverage-replay.py" };

/** Local collector receipt, not an externally signed execution attestation.
 * The child verifies and executes its own identical pinned baseline bytes.
 * PATH-selected Python is not authenticated; observed deadline is not JS preemption. */
export function replayOccupiedDensity(primary: unknown) {
  const start = performance.now();
  let observedScriptDigest: string|null = null, verifiedScriptDigest: string|null = null, primaryDigest: string|null = null, outputDigest: string|null = null, outputBytes = 0;
  let effectiveTimeout: number = OCCUPIED_DENSITY_REPLAY_LIMITS.timeout, effectiveBuffer: number = OCCUPIED_DENSITY_REPLAY_LIMITS.maxBuffer;
  const observedDependencyDigests: Record<keyof typeof dependencies,string|null> = {primary:null,checker:null,replay:null};
  const verifiedDependencyDigests: Record<keyof typeof dependencies,string|null> = {primary:null,checker:null,replay:null};
  const result = (status: "PASS"|"MISMATCH"|"PARTIAL"|"UNAVAILABLE", reason: string, replay: unknown = null) => {
    const elapsedMs = Math.round(performance.now()-start);
    if (status === "PASS" && elapsedMs >= effectiveTimeout) { status = "UNAVAILABLE"; reason = "WRAPPER_TIME_LIMIT"; }
    return {method:"FIXED_PYTHON_OCCUPIED_DENSITY_REPLAY_V1",status,reason,expectedScriptDigest:OCCUPIED_DENSITY_REPLAY_SHA256,observedScriptDigest,verifiedScriptDigest,
      expectedDependencyDigests:OCCUPIED_DENSITY_PINS,observedDependencyDigests,verifiedDependencyDigests,primaryDigest,outputDigest,outputBytes,elapsedMs,limits:OCCUPIED_DENSITY_REPLAY_LIMITS,appliedProcessLimits:{timeout:effectiveTimeout,maxBuffer:effectiveBuffer},replay,
      scope:"FIXED_191_EXPOSED_DENSITY_ADD_ON_NOT_ROOT_OR_MINIMUM_OR_NOVELTY"};
  };
  if (!verifyOccupiedDensityPacket(primary)) return result("MISMATCH","PRIMARY_INVARIANT_INVALID");
  primaryDigest = primary.packetDigest;
  effectiveTimeout = Math.min(effectiveTimeout, primary.limits.seconds*1000);
  effectiveBuffer = Math.min(effectiveBuffer, primary.limits.maxOutputBytes);
  if (primary.status !== "COMPLETE") return result("PARTIAL","PRIMARY_PARTIAL");
  try {
    const source = readFileSync(resolve("scripts/operations/occupied-density-replay.py"));
    observedScriptDigest = hash(source);
    if (observedScriptDigest !== OCCUPIED_DENSITY_REPLAY_SHA256) return result("UNAVAILABLE","SOURCE_PIN_MISMATCH");
    verifiedScriptDigest = observedScriptDigest;
    for (const name of Object.keys(dependencies) as Array<keyof typeof dependencies>) {
      observedDependencyDigests[name] = hash(readFileSync(resolve(dependencies[name])));
      if (observedDependencyDigests[name] !== OCCUPIED_DENSITY_PINS[name]) return result("UNAVAILABLE","DEPENDENCY_PIN_MISMATCH");
      verifiedDependencyDigests[name] = observedDependencyDigests[name];
    }
    const remaining = effectiveTimeout-(performance.now()-start);
    if (remaining <= 0) return result("UNAVAILABLE","WRAPPER_TIME_LIMIT");
    const {checkerWorkCeiling,...tightening} = primary.limits; void checkerWorkCeiling;
    const child = spawnSync("python3",["-I","-S","-B","-c",source.toString("utf8")],{encoding:"utf8",input:JSON.stringify(tightening),timeout:Math.max(1,Math.floor(remaining)),maxBuffer:effectiveBuffer,
      env:{PATH:process.env.PATH??"/usr/bin:/bin",PYTHONDONTWRITEBYTECODE:"1",NODE_ENV:"test"}});
    outputBytes = Buffer.byteLength(child.stdout??""); outputDigest = outputBytes ? hash(child.stdout) : null;
    if (child.error || child.status !== 0) return result("UNAVAILABLE","REPLAY_PROCESS_FAILED_OR_LIMITED");
    if (outputBytes > effectiveBuffer) return result("UNAVAILABLE","REPLAY_OUTPUT_LIMIT");
    let raw: unknown; try { raw = JSON.parse(child.stdout); } catch { return result("MISMATCH","REPLAY_JSON_INVALID"); }
    if (!verifyOccupiedDensityPacket(raw)) return result("MISMATCH","REPLAY_INVARIANT_INVALID");
    const verdict = compareOccupiedDensityReplay(primary,raw);
    if (performance.now()-start >= effectiveTimeout) return result("UNAVAILABLE","WRAPPER_TIME_LIMIT");
    return result(verdict,verdict === "PASS" ? "EXACT_BASELINE_AND_ALL_DENSITY_ROWS_AGREE" : verdict === "PARTIAL" ? "REPLAY_PARTIAL" : "FULL_INVARIANT_MISMATCH",raw);
  } catch { return result("UNAVAILABLE","REPLAY_IO_UNAVAILABLE"); }
}
export const occupiedDensityReplayReceiptDigest = (value: ReturnType<typeof replayOccupiedDensity>) => occupiedDensityHash(value);
