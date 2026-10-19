import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { performance } from "node:perf_hooks";
import { z } from "zod";

import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { buildLrcCoverCertificate, verifyLrcCoverCertificate, lrcCoverScopeSchema,
  lrcCoverCertificateSchema, lrcCoverSummarySchema, lrcCoverScopeDigest,
  type LrcCoverScope, type LrcCoverSummary } from "./math-lrc-cover-bound";

export const LRC_COVER_REPLAY_SCRIPT_SHA256 = "8d7ebb7e05d0c2476700118c9119224bf8841df53d9513102820d292428146b4";
const sha256 = (text: string) => createHash("sha256").update(text, "utf8").digest("hex");
const digest = z.string().regex(/^[a-f0-9]{64}$/);
const method = z.literal("LRC_COVER_PYTHON_TREE_REPLAY_V1");
const status = z.enum(["COMPLETE", "PARTIAL"]);
const outputSchema = z.object({ method, summary: lrcCoverSummarySchema }).strict();
export const lrcCoverEvidenceSchema = z.object({
  version: z.literal(1), rootContractDigest: digest, scopeDigest: digest,
  certificate: lrcCoverCertificateSchema, primary: lrcCoverSummarySchema,
  independent: z.object({ method, status, scriptDigest: digest, outputDigest: digest,
    summary: lrcCoverSummarySchema }).strict(), evidenceDigest: digest,
}).strict();
export type LrcCoverEvidence = z.infer<typeof lrcCoverEvidenceSchema>;
export type LrcCoverRunOptions = { maxNodes?: number; maxWork?: number; timeoutMs?: number; maxBytes?: number };

function outputBytes(summary: LrcCoverSummary): string {
  const ordered = { status: summary.status, scopeDigest: summary.scopeDigest,
    certificateDigest: summary.certificateDigest, totalTuples: summary.totalTuples,
    classifiedTuples: summary.classifiedTuples, witnessTuples: summary.witnessTuples,
    gcdTuples: summary.gcdTuples, survivorTuples: summary.survivorTuples,
    unresolvedTuples: summary.unresolvedTuples, nodeCount: summary.nodeCount,
    leafCount: summary.leafCount, coverLeaves: summary.coverLeaves, gcdLeaves: summary.gcdLeaves,
    survivorLeaves: summary.survivorLeaves, unresolvedLeaves: summary.unresolvedLeaves,
    survivors: summary.survivors.map((row) => ({ digits: row.digits, residues: row.residues })),
    lowerDependency: summary.lowerDependency, errors: summary.errors };
  return `${JSON.stringify({ method: "LRC_COVER_PYTHON_TREE_REPLAY_V1", summary: ordered })}\n`;
}

/** Pure retained integrity/arithmetic check. PARTIAL is displayable, never a
 * complete-classification or agent-success gate. Unsigned receipts require a
 * trusted collector; source/output hashes do not attest external execution. */
export function validateRetainedLrcCoverEvidence(raw: unknown, expectedScope: unknown, rootContractDigest: string,
  options: { timeoutMs?: number } = {}): boolean {
  const started = performance.now();
  try {
    const timeoutMs = z.object({ timeoutMs: z.number().int().min(0).max(10000) }).strict()
      .parse({ timeoutMs: 10000, ...options }).timeoutMs;
    if (Buffer.byteLength(JSON.stringify(raw), "utf8") > 32 * 1024 * 1024) return false;
    const envelope = lrcCoverEvidenceSchema.parse(raw);
    const scope = lrcCoverScopeSchema.parse(expectedScope);
    const { evidenceDigest, ...body } = envelope;
    const remaining = Math.max(0, Math.floor(timeoutMs - (performance.now() - started)));
    const primary = verifyLrcCoverCertificate(envelope.certificate, scope, rootContractDigest, { timeoutMs: remaining });
    const valid = digest.safeParse(rootContractDigest).success && envelope.rootContractDigest === rootContractDigest &&
      envelope.scopeDigest === lrcCoverScopeDigest(scope) && sha256(canonicalJson(body)) === evidenceDigest &&
      primary.status !== "INVALID" && primary.status === envelope.independent.status &&
      BigInt(primary.classifiedTuples) + BigInt(primary.unresolvedTuples) === BigInt(primary.totalTuples) &&
      ((primary.status === "COMPLETE" && primary.unresolvedTuples === "0") ||
        (primary.status === "PARTIAL" && BigInt(primary.unresolvedTuples) > BigInt(0))) &&
      primary.lowerDependency === "LOWER_LRC_12_DECLARED_NOT_REPLAYED" &&
      envelope.independent.scriptDigest === LRC_COVER_REPLAY_SCRIPT_SHA256 &&
      envelope.independent.outputDigest === sha256(outputBytes(envelope.independent.summary)) &&
      canonicalJson(primary) === canonicalJson(envelope.primary) &&
      canonicalJson(primary) === canonicalJson(envelope.independent.summary);
    return valid && performance.now() - started < timeoutMs;
  } catch { return false; }
}

function runPython(source: string, request: unknown, timeoutMs: number): Promise<string> {
  const input = canonicalJson(request);
  if (Buffer.byteLength(input, "utf8") > 17_000_000) throw new Error("Cover replay input exceeds fixed bound");
  return new Promise((resolve, reject) => {
    const child = execFile("python3", ["-I", "-S", "-B", "-c", source], {
      shell: false, timeout: Math.min(10000, timeoutMs), killSignal: "SIGKILL", maxBuffer: 262_144, encoding: "utf8",
      env: { NODE_ENV: process.env.NODE_ENV, PATH: process.env.PATH ?? "/usr/bin:/bin", PYTHONDONTWRITEBYTECODE: "1" },
    }, (error, stdout, stderr) => {
      if (error || stderr.length || Buffer.byteLength(stdout, "utf8") > 262_144) reject(new Error("Cover replay process failed closed"));
      else resolve(stdout);
    });
    child.stdin?.on("error", () => reject(new Error("Cover replay input unavailable")));
    if (!child.stdin) { child.kill("SIGKILL"); reject(new Error("Cover replay input unavailable")); }
    else child.stdin.end(input);
  });
}

/** Explicit local collector execution only. Checked source bytes execute
 * directly, not via a reopened path; no foreign code or model tool input. */
export async function runLrcCoverEvidence(expectedScope: LrcCoverScope, rootContractDigest: string,
  options: LrcCoverRunOptions = {}): Promise<LrcCoverEvidence> {
  const started = performance.now();
  if ((process.env.NODE_ENV !== "development" && process.env.NODE_ENV !== "test") ||
    (process.env.DEPLOYMENT_ENV && process.env.DEPLOYMENT_ENV !== "development" && process.env.DEPLOYMENT_ENV !== "test")) {
    throw new Error("Cover certificate replay is restricted to local development/test");
  }
  const scope = lrcCoverScopeSchema.parse(expectedScope);
  digest.parse(rootContractDigest);
  const source = await readFile(join(process.cwd(), "scripts/operations/replay-lrc-cover-bound.py"), "utf8");
  if (sha256(source) !== LRC_COVER_REPLAY_SCRIPT_SHA256) throw new Error("Cover replay source drift");
  const certificate = buildLrcCoverCertificate(scope, rootContractDigest, options);
  const primary = verifyLrcCoverCertificate(certificate, scope, rootContractDigest);
  if (primary.status === "INVALID") throw new Error("Cover primary certificate invalid");
  const remaining = () => Math.floor(30000 - (performance.now() - started));
  if (remaining() <= 0) throw new Error("Cover replay aggregate deadline exceeded");
  const stdout = await runPython(source, { scope, rootContractDigest, certificate }, remaining());
  const output = outputSchema.parse(JSON.parse(stdout));
  if (output.summary.status === "INVALID" || canonicalJson(primary) !== canonicalJson(output.summary) ||
    stdout !== outputBytes(output.summary)) throw new Error("Cover independent replay disagreement");
  const body = { version: 1 as const, rootContractDigest, scopeDigest: lrcCoverScopeDigest(scope), certificate, primary,
    independent: { method: "LRC_COVER_PYTHON_TREE_REPLAY_V1" as const,
      status: status.parse(output.summary.status), scriptDigest: LRC_COVER_REPLAY_SCRIPT_SHA256,
      outputDigest: sha256(stdout), summary: output.summary } };
  const result = lrcCoverEvidenceSchema.parse({ ...body, evidenceDigest: sha256(canonicalJson(body)) });
  if (remaining() <= 0 || !validateRetainedLrcCoverEvidence(result, scope, rootContractDigest,
    { timeoutMs: Math.min(10000, remaining()) })) throw new Error("Cover replay final admission failed");
  if (remaining() <= 0) throw new Error("Cover replay final deadline exceeded");
  return result;
}
