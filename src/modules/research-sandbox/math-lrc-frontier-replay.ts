import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { performance } from "node:perf_hooks";
import { z } from "zod";
import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { LRC_COVER_REPLAY_SCRIPT_SHA256 } from "./math-lrc-cover-replay";
import { LRC_FRONTIER_LIMITS, lrcFrontierPacketSchema, lrcFrontierSummarySchema,
  lrcFrontierOutputBytes, verifyResumeComposition, type LrcFrontierPacket } from "./math-lrc-frontier";

export const LRC_FRONTIER_REPLAY_SCRIPT_SHA256 = "3dd6f02b2207e6a1e1d724a6403a55af932cae211b645f1243c1e2acdecdb3e2";
export const LRC_FRONTIER_COMPOSED_PROGRAM_SHA256 = "16cd594ffa4f644dd3db251a8ece148b3f0959e57712db2ca0718669d2ebd2bf";
const hash = (text: string) => createHash("sha256").update(text, "utf8").digest("hex");
const hex = z.string().regex(/^[a-f0-9]{64}$/);
const method = z.literal("LRC_FRONTIER_PYTHON_COMPOSITION_V1");
const outputSchema = z.object({ method, summary: lrcFrontierSummarySchema }).strict();
export const lrcFrontierEvidenceSchema = z.object({ version: z.literal(1), packet: lrcFrontierPacketSchema,
  primary: lrcFrontierSummarySchema, independent: z.object({ method, status: z.enum(["COMPLETE", "PARTIAL"]),
    coverScriptDigest: hex, scriptDigest: hex, programDigest: hex, outputDigest: hex,
    summary: lrcFrontierSummarySchema }).strict(), evidenceDigest: hex }).strict();
export type LrcFrontierEvidence = z.infer<typeof lrcFrontierEvidenceSchema>;
export type LrcFrontierReplayOptions = { timeoutMs?: number };

function budget(options: LrcFrontierReplayOptions, maximum: number): number {
  return z.object({ timeoutMs: z.number().int().min(0).max(maximum) }).strict()
    .parse({ timeoutMs: maximum, ...options }).timeoutMs;
}

/** Pure arithmetic/integrity admission; no process or file access. The unsigned
 * receipt depends on a trusted local collector, not external execution attestation. */
export function validateRetainedLrcFrontierEvidence(raw: unknown, base: unknown,
  options: LrcFrontierReplayOptions = {}): boolean {
  const started = performance.now();
  try {
    const timeout = budget(options, LRC_FRONTIER_LIMITS.pureCompositionMs);
    const remaining = () => Math.floor(timeout - (performance.now() - started));
    if (remaining() <= 0 || Buffer.byteLength(JSON.stringify(raw), "utf8") > LRC_FRONTIER_LIMITS.retainedReportBytes) return false;
    const envelope = lrcFrontierEvidenceSchema.parse(raw);
    const { evidenceDigest, ...body } = envelope;
    if (remaining() <= 0 || hash(canonicalJson(body)) !== evidenceDigest || remaining() <= 0) return false;
    const checked = verifyResumeComposition(envelope.packet, base, { timeoutMs: remaining() });
    if (!checked || remaining() <= 0) return false;
    const replay = envelope.independent;
    const valid = replay.coverScriptDigest === LRC_COVER_REPLAY_SCRIPT_SHA256 &&
      replay.scriptDigest === LRC_FRONTIER_REPLAY_SCRIPT_SHA256 && replay.programDigest === LRC_FRONTIER_COMPOSED_PROGRAM_SHA256 &&
      replay.status === checked.status && replay.outputDigest === hash(lrcFrontierOutputBytes(checked)) &&
      canonicalJson(envelope.primary) === canonicalJson(checked) && canonicalJson(replay.summary) === canonicalJson(checked);
    canonicalJson(envelope); // final observed serialization, not a hard CPU preemption claim
    return valid && remaining() > 0;
  } catch { return false; }
}

function composeProgram(cover: string, driver: string): string {
  return `import hashlib as _lrc_hashlib\n_LRC_COVER_LITERAL = ${JSON.stringify(cover)}\n` +
    `if _lrc_hashlib.sha256(_LRC_COVER_LITERAL.encode()).hexdigest() != "${LRC_COVER_REPLAY_SCRIPT_SHA256}": raise ValueError("SOURCE_PIN")\n` +
    `_LRC_COVER_NAMESPACE = {"__name__": "_lrc_cover_checked"}\n` +
    `exec(compile(_LRC_COVER_LITERAL, "<pinned048>", "exec"), _LRC_COVER_NAMESPACE)\n` +
    `_LRC_COVER_CHECK = _LRC_COVER_NAMESPACE["check"]\n` +
    `_LRC_COVER_SOURCE_SHA = "${LRC_COVER_REPLAY_SCRIPT_SHA256}"\n${driver}`;
}

function runPython(program: string, input: string, timeoutMs: number): Promise<string> {
  if (Buffer.byteLength(input, "utf8") > 83886080) throw new Error("Frontier transport exceeds bound");
  return new Promise((resolve, reject) => {
    const child = execFile("python3", ["-I", "-S", "-B", "-c", program], {
      shell: false, timeout: timeoutMs, killSignal: "SIGKILL", maxBuffer: LRC_FRONTIER_LIMITS.independentStdoutBytes,
      encoding: "utf8", env: { NODE_ENV: process.env.NODE_ENV, PATH: process.env.PATH ?? "/usr/bin:/bin", PYTHONDONTWRITEBYTECODE: "1" },
    }, (error, stdout, stderr) => {
      if (error || stderr.length || Buffer.byteLength(stdout, "utf8") > LRC_FRONTIER_LIMITS.independentStdoutBytes) {
        reject(new Error("Frontier replay process failed closed"));
      } else resolve(stdout);
    });
    child.stdin?.on("error", () => reject(new Error("Frontier replay input unavailable")));
    if (!child.stdin) { child.kill("SIGKILL"); reject(new Error("Frontier replay input unavailable")); }
    else child.stdin.end(input);
  });
}

/** Explicit local execution of TWO pinned sources, as verified literal bytes.
 * No producer, model code, URL, foreign author code or reopened executable path. */
export async function runLrcFrontierEvidence(base: unknown, rawPacket: LrcFrontierPacket,
  options: LrcFrontierReplayOptions = {}): Promise<LrcFrontierEvidence> {
  const started = performance.now();
  if ((process.env.NODE_ENV !== "development" && process.env.NODE_ENV !== "test") ||
    (process.env.DEPLOYMENT_ENV && !["development", "test"].includes(process.env.DEPLOYMENT_ENV))) {
    throw new Error("Frontier replay is restricted to local development/test");
  }
  const timeout = budget(options, LRC_FRONTIER_LIMITS.independentWrapperMs);
  const remaining = () => Math.floor(timeout - (performance.now() - started));
  const checkpoint = () => { if (remaining() <= 0) throw new Error("Frontier aggregate deadline exceeded"); };
  checkpoint();
  if (Buffer.byteLength(JSON.stringify(rawPacket), "utf8") > LRC_FRONTIER_LIMITS.compositionBytes) throw new Error("Frontier packet exceeds bound");
  const packet = lrcFrontierPacketSchema.parse(rawPacket);
  checkpoint();
  const primary = verifyResumeComposition(packet, base, { timeoutMs: Math.min(30000, remaining()) });
  if (!primary) throw new Error("Frontier primary composition invalid");
  checkpoint();
  const cover = await readFile(join(process.cwd(), "scripts/operations/replay-lrc-cover-bound.py"), "utf8");
  const driver = await readFile(join(process.cwd(), "scripts/operations/replay-lrc-frontier.py"), "utf8");
  checkpoint();
  if (hash(cover) !== LRC_COVER_REPLAY_SCRIPT_SHA256 || hash(driver) !== LRC_FRONTIER_REPLAY_SCRIPT_SHA256) throw new Error("Frontier replay source drift");
  const program = composeProgram(cover, driver);
  if (hash(program) !== LRC_FRONTIER_COMPOSED_PROGRAM_SHA256) throw new Error("Frontier composed program drift");
  const input = canonicalJson({ base, packet });
  checkpoint();
  const stdout = await runPython(program, input, remaining());
  checkpoint();
  const output = outputSchema.parse(JSON.parse(stdout));
  if (canonicalJson(output.summary) !== canonicalJson(primary) || stdout !== lrcFrontierOutputBytes(primary)) throw new Error("Frontier independent replay disagreement");
  const body = { version: 1 as const, packet, primary, independent: {
    method: "LRC_FRONTIER_PYTHON_COMPOSITION_V1" as const, status: primary.status,
    coverScriptDigest: LRC_COVER_REPLAY_SCRIPT_SHA256, scriptDigest: LRC_FRONTIER_REPLAY_SCRIPT_SHA256,
    programDigest: LRC_FRONTIER_COMPOSED_PROGRAM_SHA256, outputDigest: hash(stdout), summary: output.summary } };
  const result = lrcFrontierEvidenceSchema.parse({ ...body, evidenceDigest: hash(canonicalJson(body)) });
  checkpoint();
  if (!validateRetainedLrcFrontierEvidence(result, base, { timeoutMs: Math.min(30000, remaining()) })) throw new Error("Frontier final admission failed");
  checkpoint();
  return result;
}
