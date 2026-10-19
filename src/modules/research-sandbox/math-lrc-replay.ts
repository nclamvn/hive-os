import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { performance } from "node:perf_hooks";
import { z } from "zod";

import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { buildLrcCertificate, verifyLrcCertificate, lrcFiniteScopeSchema as lrcScopeSchema, lrcCertificateSchema,
  lrcVerificationSummarySchema as lrcSummarySchema, lrcScopeDigest, type LrcFiniteScope as LrcScope } from "./math-lrc-certificates";
import { propernessReportSchema, validateRetainedPropernessReport, compactPropernessFacts } from "./math-lrc-properness";
import { runFreshPropernessReport } from "./math-lrc-properness-replay";

export const LRC_REPLAY_SCRIPT_SHA256 = "280ec187a51e5873e6890b9c764d183513d1822d0f2d568fae3c16447bd6b099";
const sha256 = (value: string) => createHash("sha256").update(value, "utf8").digest("hex");
const hex = z.string().regex(/^[a-f0-9]{64}$/);
const method = z.literal("LRC_PYTHON_TREE_REPLAY_V1");
const pythonOutputSchema = z.object({ method, summary: lrcSummarySchema }).strict();
export const lrcCertificateEvidenceSchema = z.object({
  version: z.literal(1), rootContractDigest: hex, scopeDigest: hex,
  certificate: lrcCertificateSchema, primary: lrcSummarySchema,
  independent: z.object({ method, status: z.literal("PASS"), scriptDigest: hex,
    outputDigest: hex, summary: lrcSummarySchema }).strict(), properness: propernessReportSchema.optional(), evidenceDigest: hex,
}).strict();
export type LrcCertificateEvidence = z.infer<typeof lrcCertificateEvidenceSchema>;

/** All three role contexts receive the same retained facts, not certificate code. */
export function lrcEvidencePrompt(evidence: LrcCertificateEvidence): string {
  return `LRC_FINITE_GRID_CHECKED_V1: exact finite Cartesian/grid coverage only. A NO_GRID tuple has no witness on THIS grid; it is not a continuous-time LRC counterexample. PASS never establishes an unrestricted theorem, Allikvere full coverage, novelty, or human acceptance. Do not narrow the scope or invent source/tool execution. Trusted local replay is not an external signed attestation.\n${canonicalJson({
    rootContractDigest: evidence.rootContractDigest, scopeDigest: evidence.scopeDigest,
    certificateDigest: evidence.certificate.certificateDigest, evidenceDigest: evidence.evidenceDigest,
    primary: evidence.primary, independent: evidence.independent,
    ...(evidence.properness ? { properness: compactPropernessFacts(evidence.properness) } : {}),
  })}`;
}

/** Reproduce the fixed Python report's field order, including its final newline.
 * This checks retained byte consistency, not external execution attestation. */
function pythonBytes(summary: z.infer<typeof lrcSummarySchema>): string {
  const ordered = { status: summary.status, scopeDigest: summary.scopeDigest,
    certificateDigest: summary.certificateDigest, totalTuples: summary.totalTuples,
    coveredTuples: summary.coveredTuples, witnessTuples: summary.witnessTuples,
    gridExcludedTuples: summary.gridExcludedTuples, unresolvedTuples: summary.unresolvedTuples,
    nodeCount: summary.nodeCount, leafCount: summary.leafCount, gridLeaves: summary.gridLeaves,
    shiftLeaves: summary.shiftLeaves, crtLeaves: summary.crtLeaves,
    noGridLeaves: summary.noGridLeaves, unresolvedLeaves: summary.unresolvedLeaves, errors: summary.errors };
  return `${JSON.stringify({ method: "LRC_PYTHON_TREE_REPLAY_V1", summary: ordered })}\n`;
}

/** Pure retained-only integrity validation. Never reads files or spawns a tool.
 * Trusted immutable ledger retention is required: hashes are not signatures. */
export function validateRetainedLrcEvidence(raw: unknown, expectedScope: unknown, rootContractDigest: string): boolean {
  try {
    const envelope = lrcCertificateEvidenceSchema.parse(raw);
    const scope = lrcScopeSchema.parse(expectedScope);
    const { evidenceDigest, ...body } = envelope;
    const primary = verifyLrcCertificate(envelope.certificate, scope, rootContractDigest);
    return hex.safeParse(rootContractDigest).success && envelope.rootContractDigest === rootContractDigest &&
      envelope.scopeDigest === lrcScopeDigest(scope) && sha256(canonicalJson(body)) === evidenceDigest &&
      primary.status === "PASS" && primary.unresolvedTuples === 0 && primary.coveredTuples === primary.totalTuples &&
      envelope.independent.scriptDigest === LRC_REPLAY_SCRIPT_SHA256 &&
      envelope.independent.outputDigest === sha256(pythonBytes(envelope.independent.summary)) &&
      canonicalJson(primary) === canonicalJson(envelope.primary) &&
      canonicalJson(primary) === canonicalJson(envelope.independent.summary) &&
      (!envelope.properness || validateRetainedPropernessReport(envelope.properness, {scope,rootContractDigest}) !== null);
  } catch { return false; }
}

function executeVerifiedPython(source: string, request: unknown, timeoutMs: number): Promise<string> {
  const input = canonicalJson(request);
  if (Buffer.byteLength(input, "utf8") > 2_200_000) throw new Error("LRC replay input exceeds fixed bound");
  return new Promise((resolve, reject) => {
    // Execute the exact reviewed bytes already hashed, never re-open the path.
    const child = execFile("python3", ["-I", "-S", "-B", "-c", source], {
      shell: false, timeout: timeoutMs, killSignal: "SIGKILL", maxBuffer: 262_144, encoding: "utf8",
      env: { NODE_ENV: process.env.NODE_ENV, PATH: process.env.PATH ?? "/usr/bin:/bin", PYTHONDONTWRITEBYTECODE: "1" },
    }, (error, stdout, stderr) => {
      if (error || stderr.length || Buffer.byteLength(stdout, "utf8") > 262_144) reject(new Error("LRC replay process failed closed"));
      else resolve(stdout);
    });
    child.stdin?.on("error", () => reject(new Error("LRC replay input unavailable")));
    if (!child.stdin) { child.kill("SIGKILL"); reject(new Error("LRC replay input unavailable")); }
    else child.stdin.end(input);
  });
}

/** Trusted pre-solver local tool. Model text cannot choose source, process, or scope. */
export async function runLrcCertificateEvidence(expectedScope: LrcScope, rootContractDigest: string): Promise<LrcCertificateEvidence> {
  const started = performance.now();
  if ((process.env.NODE_ENV !== "development" && process.env.NODE_ENV !== "test") ||
    (process.env.DEPLOYMENT_ENV && process.env.DEPLOYMENT_ENV !== "development" && process.env.DEPLOYMENT_ENV !== "test")) {
    throw new Error("LRC certificate tool is restricted to local development/test");
  }
  const scope = lrcScopeSchema.parse(expectedScope);
  hex.parse(rootContractDigest);
  const source = await readFile(join(process.cwd(), "scripts/operations/replay-lrc-certificates.py"), "utf8");
  if (sha256(source) !== LRC_REPLAY_SCRIPT_SHA256) throw new Error("LRC replay source drift");
  const certificate = buildLrcCertificate(scope, rootContractDigest);
  const primary = verifyLrcCertificate(certificate, scope, rootContractDigest);
  if (primary.status !== "PASS") throw new Error("LRC primary certificate is incomplete or invalid");
  if (performance.now() - started >= 10_000) throw new Error("LRC replay deadline exceeded");
  const stdout = await executeVerifiedPython(source, { scope, rootContractDigest, certificate },
    Math.max(1, Math.floor(10_000 - (performance.now() - started))));
  const output = pythonOutputSchema.parse(JSON.parse(stdout));
  if (output.summary.status !== "PASS" || canonicalJson(primary) !== canonicalJson(output.summary) ||
    stdout !== pythonBytes(output.summary)) throw new Error("LRC independent replay disagreement");
  // New preparation must replay the conditional mechanism before any model call.
  // Old absent-field envelopes remain readable; they do not imply fresh replay.
  const properness = await runFreshPropernessReport({scope,rootContractDigest},
    Math.floor(10_000-(performance.now()-started)));
  const body = { version: 1 as const, rootContractDigest, scopeDigest: lrcScopeDigest(scope), certificate, primary,
    independent: { method: "LRC_PYTHON_TREE_REPLAY_V1" as const, status: "PASS" as const,
      scriptDigest: LRC_REPLAY_SCRIPT_SHA256, outputDigest: sha256(stdout), summary: output.summary }, properness };
  const result = lrcCertificateEvidenceSchema.parse({ ...body, evidenceDigest: sha256(canonicalJson(body)) });
  if (performance.now() - started >= 10_000 || Buffer.byteLength(stdout, "utf8") > 262_144 ||
    !validateRetainedLrcEvidence(result, scope, rootContractDigest)) throw new Error("LRC replay final admission failed");
  // Validation/hashing are part of the same outer observed deadline.
  if (performance.now() - started >= 10_000) throw new Error("LRC replay final deadline exceeded");
  return result;
}
