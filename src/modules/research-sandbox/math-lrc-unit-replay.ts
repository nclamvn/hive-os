import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { performance } from "node:perf_hooks";
import { z } from "zod";
import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { LRC_COVER_REPLAY_SCRIPT_SHA256 } from "./math-lrc-cover-replay";
import { LRC_FRONTIER_REPLAY_SCRIPT_SHA256 } from "./math-lrc-frontier-replay";
import { LRC_UNIT_ACTION_LIMITS, lrcUnitActionPlanSchema, lrcUnitActionSummarySchema,
  lrcUnitActionOutputBytes, verifyLrcUnitActionPlan, type LrcUnitActionPlan } from "./math-lrc-unit-action";

export const LRC_UNIT_REPLAY_SCRIPT_SHA256 = "e0c1cce7428adca12b6927529e4a84f551703ab32e1887ae5dd6dff17a24443f";
export const LRC_UNIT_COMPOSED_PROGRAM_SHA256 = "d8996f49ecf31cd803f49a276de962dec0a5ca19e5ed2c8867e9d1a79673fbe9";
const hash = (text: string) => createHash("sha256").update(text, "utf8").digest("hex");
const hex = z.string().regex(/^[a-f0-9]{64}$/);
const method = z.literal("LRC_UNIT_ACTION_PYTHON_UNION_V1");
const outputSchema = z.object({ method, summary: lrcUnitActionSummarySchema }).strict();
export const lrcUnitActionEvidenceSchema = z.object({ version: z.literal(1), plan: lrcUnitActionPlanSchema,
  primary: lrcUnitActionSummarySchema, independent: z.object({ method, status: z.enum(["COMPLETE", "PARTIAL"]),
    coverScriptDigest: hex, frontierScriptDigest: hex, scriptDigest: hex, programDigest: hex,
    outputDigest: hex, summary: lrcUnitActionSummarySchema }).strict(), evidenceDigest: hex }).strict();
export type LrcUnitActionEvidence = z.infer<typeof lrcUnitActionEvidenceSchema>;
export type LrcUnitReplayOptions = { timeoutMs?: number };

function budget(options: LrcUnitReplayOptions, maximum: number): number {
  return z.object({ timeoutMs: z.number().int().min(0).max(maximum) }).strict()
    .parse({ timeoutMs: maximum, ...options }).timeoutMs;
}

/** Pure source/arithmetic/receipt reconstruction. Never runs a tool or fetch.
 * Unsigned execution receipts assume trusted collection, not external attestation. */
export function validateRetainedLrcUnitActionEvidence(raw: unknown, base: unknown, frontier: unknown,
  options: LrcUnitReplayOptions = {}): boolean {
  const started = performance.now();
  try {
    const timeout = budget(options, LRC_UNIT_ACTION_LIMITS.pureAdmissionMs);
    const remaining = () => Math.floor(timeout - (performance.now() - started));
    if (remaining() <= 0 || Buffer.byteLength(JSON.stringify(raw), "utf8") > LRC_UNIT_ACTION_LIMITS.retainedReportBytes) return false;
    const envelope = lrcUnitActionEvidenceSchema.parse(raw);
    const { evidenceDigest, ...body } = envelope;
    if (remaining() <= 0 || hash(canonicalJson(body)) !== evidenceDigest || remaining() <= 0) return false;
    const checked = verifyLrcUnitActionPlan(envelope.plan, base, frontier, { timeoutMs: remaining() });
    if (!checked || remaining() <= 0) return false;
    const replay = envelope.independent;
    const valid = replay.coverScriptDigest === LRC_COVER_REPLAY_SCRIPT_SHA256 &&
      replay.frontierScriptDigest === LRC_FRONTIER_REPLAY_SCRIPT_SHA256 && replay.scriptDigest === LRC_UNIT_REPLAY_SCRIPT_SHA256 &&
      replay.programDigest === LRC_UNIT_COMPOSED_PROGRAM_SHA256 && replay.status === checked.status &&
      replay.outputDigest === hash(lrcUnitActionOutputBytes(checked)) && canonicalJson(envelope.primary) === canonicalJson(checked) &&
      canonicalJson(replay.summary) === canonicalJson(checked);
    canonicalJson(envelope);
    return valid && remaining() > 0;
  } catch { return false; }
}

function composeProgram(cover: string, frontier: string, driver: string): string {
  return `import hashlib as _lrc_hashlib\n_LRC_COVER_LITERAL = ${JSON.stringify(cover)}\n` +
    `_LRC_FRONTIER_LITERAL = ${JSON.stringify(frontier)}\n` +
    `if _lrc_hashlib.sha256(_LRC_COVER_LITERAL.encode()).hexdigest() != "${LRC_COVER_REPLAY_SCRIPT_SHA256}": raise ValueError("COVER_SOURCE_PIN")\n` +
    `if _lrc_hashlib.sha256(_LRC_FRONTIER_LITERAL.encode()).hexdigest() != "${LRC_FRONTIER_REPLAY_SCRIPT_SHA256}": raise ValueError("FRONTIER_SOURCE_PIN")\n` +
    `_LRC_COVER_NAMESPACE = {"__name__": "_lrc_cover_checked"}\n` +
    `exec(compile(_LRC_COVER_LITERAL, "<pinned048>", "exec"), _LRC_COVER_NAMESPACE)\n` +
    `_LRC_FRONTIER_NAMESPACE = {"__name__": "_lrc_frontier_checked", "_LRC_COVER_CHECK": _LRC_COVER_NAMESPACE["check"], "_LRC_COVER_SOURCE_SHA": "${LRC_COVER_REPLAY_SCRIPT_SHA256}"}\n` +
    `exec(compile(_LRC_FRONTIER_LITERAL, "<pinned049>", "exec"), _LRC_FRONTIER_NAMESPACE)\n` +
    `_LRC_FRONTIER_CHECK = _LRC_FRONTIER_NAMESPACE["check"]\n` +
    `_LRC_COVER_SOURCE_SHA = "${LRC_COVER_REPLAY_SCRIPT_SHA256}"\n` +
    `_LRC_FRONTIER_SOURCE_SHA = "${LRC_FRONTIER_REPLAY_SCRIPT_SHA256}"\n${driver}`;
}

function runPython(program: string, input: string, timeoutMs: number): Promise<string> {
  if (Buffer.byteLength(input, "utf8") > LRC_UNIT_ACTION_LIMITS.inputBytes) throw new Error("Unit replay transport exceeds bound");
  return new Promise((resolve, reject) => {
    const child = execFile("python3", ["-I", "-S", "-B", "-c", program], { shell: false, timeout: timeoutMs,
      killSignal: "SIGKILL", maxBuffer: LRC_UNIT_ACTION_LIMITS.independentStdoutBytes, encoding: "utf8",
      env: { NODE_ENV: process.env.NODE_ENV, PATH: process.env.PATH ?? "/usr/bin:/bin", PYTHONDONTWRITEBYTECODE: "1" },
    }, (error, stdout, stderr) => {
      if (error || stderr.length || Buffer.byteLength(stdout, "utf8") > LRC_UNIT_ACTION_LIMITS.independentStdoutBytes) {
        reject(new Error("Unit replay process failed closed"));
      } else resolve(stdout);
    });
    child.stdin?.on("error", () => reject(new Error("Unit replay input unavailable")));
    if (!child.stdin) { child.kill("SIGKILL"); reject(new Error("Unit replay input unavailable")); }
    else child.stdin.end(input);
  });
}

/** Explicit development/test-only execution of three pinned local sources.
 * No search producer, request/model code, foreign code, network or DB access. */
export async function runLrcUnitActionEvidence(base: unknown, frontier: unknown, rawPlan: LrcUnitActionPlan,
  options: LrcUnitReplayOptions = {}): Promise<LrcUnitActionEvidence> {
  const started = performance.now();
  if ((process.env.NODE_ENV !== "development" && process.env.NODE_ENV !== "test") ||
    (process.env.DEPLOYMENT_ENV && !["development", "test"].includes(process.env.DEPLOYMENT_ENV))) {
    throw new Error("Unit replay is restricted to local development/test");
  }
  const timeout = budget(options, LRC_UNIT_ACTION_LIMITS.independentWrapperMs);
  const remaining = () => Math.floor(timeout - (performance.now() - started));
  const checkpoint = () => { if (remaining() <= 0) throw new Error("Unit aggregate deadline exceeded"); };
  checkpoint();
  if (Buffer.byteLength(JSON.stringify({ base, frontier, plan: rawPlan }), "utf8") > LRC_UNIT_ACTION_LIMITS.inputBytes) throw new Error("Unit input exceeds bound");
  const plan = lrcUnitActionPlanSchema.parse(rawPlan);
  checkpoint();
  const primary = verifyLrcUnitActionPlan(plan, base, frontier, { timeoutMs: Math.min(60000, remaining()) });
  if (!primary) throw new Error("Unit primary transport invalid");
  checkpoint();
  const coverSource = await readFile(join(process.cwd(), "scripts/operations/replay-lrc-cover-bound.py"), "utf8");
  const frontierSource = await readFile(join(process.cwd(), "scripts/operations/replay-lrc-frontier.py"), "utf8");
  const driver = await readFile(join(process.cwd(), "scripts/operations/replay-lrc-unit-action.py"), "utf8");
  checkpoint();
  if (hash(coverSource) !== LRC_COVER_REPLAY_SCRIPT_SHA256 || hash(frontierSource) !== LRC_FRONTIER_REPLAY_SCRIPT_SHA256 ||
    hash(driver) !== LRC_UNIT_REPLAY_SCRIPT_SHA256) throw new Error("Unit replay source drift");
  const program = composeProgram(coverSource, frontierSource, driver);
  if (hash(program) !== LRC_UNIT_COMPOSED_PROGRAM_SHA256) throw new Error("Unit composed program drift");
  const input = canonicalJson({ base, frontier, plan });
  checkpoint();
  const stdout = await runPython(program, input, remaining());
  checkpoint();
  const output = outputSchema.parse(JSON.parse(stdout));
  if (canonicalJson(output.summary) !== canonicalJson(primary) || stdout !== lrcUnitActionOutputBytes(primary)) throw new Error("Unit independent replay disagreement");
  const body = { version: 1 as const, plan, primary, independent: { method: "LRC_UNIT_ACTION_PYTHON_UNION_V1" as const,
    status: primary.status, coverScriptDigest: LRC_COVER_REPLAY_SCRIPT_SHA256, frontierScriptDigest: LRC_FRONTIER_REPLAY_SCRIPT_SHA256,
    scriptDigest: LRC_UNIT_REPLAY_SCRIPT_SHA256, programDigest: LRC_UNIT_COMPOSED_PROGRAM_SHA256,
    outputDigest: hash(stdout), summary: output.summary } };
  const result = lrcUnitActionEvidenceSchema.parse({ ...body, evidenceDigest: hash(canonicalJson(body)) });
  checkpoint();
  if (!validateRetainedLrcUnitActionEvidence(result, base, frontier, { timeoutMs: Math.min(60000, remaining()) })) throw new Error("Unit final admission failed");
  checkpoint();
  return result;
}
