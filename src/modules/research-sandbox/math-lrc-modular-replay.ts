import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { performance } from "node:perf_hooks";
import { z } from "zod";

import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { buildLrcModularCertificate, verifyLrcModularCertificate, lrcModularScopeSchema,
  lrcModularCertificateSchema, lrcModularSummarySchema, lrcModularScopeDigest,
  type LrcModularScope } from "./math-lrc-modular-certificates";

export const LRC_MODULAR_REPLAY_SCRIPT_SHA256 = "1bbc0d48a8e89937ddc5cf053dd38ab14768489b3e802288ec70aa3ca6304e5d";
const sha256 = (text: string) => createHash("sha256").update(text, "utf8").digest("hex");
const digest = z.string().regex(/^[a-f0-9]{64}$/);
const method = z.literal("LRC_MODULAR_PYTHON_TREE_REPLAY_V1");
const outputSchema = z.object({ method, summary: lrcModularSummarySchema }).strict();
export const lrcModularEvidenceSchema = z.object({
  version: z.literal(1), rootContractDigest: digest, scopeDigest: digest,
  certificate: lrcModularCertificateSchema, primary: lrcModularSummarySchema,
  independent: z.object({ method, status: z.literal("COMPLETE"), scriptDigest: digest,
    outputDigest: digest, summary: lrcModularSummarySchema }).strict(), evidenceDigest: digest,
}).strict();
export type LrcModularEvidence = z.infer<typeof lrcModularEvidenceSchema>;

function outputBytes(summary: z.infer<typeof lrcModularSummarySchema>): string {
  const ordered = { status: summary.status, scopeDigest: summary.scopeDigest,
    certificateDigest: summary.certificateDigest, totalTuples: summary.totalTuples,
    classifiedTuples: summary.classifiedTuples, witnessTuples: summary.witnessTuples,
    gcdTuples: summary.gcdTuples, survivorTuples: summary.survivorTuples,
    unresolvedTuples: summary.unresolvedTuples, nodeCount: summary.nodeCount,
    leafCount: summary.leafCount, gridLeaves: summary.gridLeaves, gcdLeaves: summary.gcdLeaves,
    survivorLeaves: summary.survivorLeaves, unresolvedLeaves: summary.unresolvedLeaves,
    survivors: summary.survivors.map((row) => ({ digits: row.digits, residues: row.residues })),
    lowerDependency: summary.lowerDependency, errors: summary.errors };
  return `${JSON.stringify({ method: "LRC_MODULAR_PYTHON_TREE_REPLAY_V1", summary: ordered })}\n`;
}

/** Pure retained integrity check, no process/files/network. Local collector
 * retention is trusted; these hashes are not external execution attestation. */
export function validateRetainedLrcModularEvidence(raw: unknown, expectedScope: unknown, rootContractDigest: string): boolean {
  try {
    const envelope = lrcModularEvidenceSchema.parse(raw);
    const scope = lrcModularScopeSchema.parse(expectedScope);
    const { evidenceDigest, ...body } = envelope;
    const primary = verifyLrcModularCertificate(envelope.certificate, scope, rootContractDigest);
    return digest.safeParse(rootContractDigest).success && envelope.rootContractDigest === rootContractDigest &&
      envelope.scopeDigest === lrcModularScopeDigest(scope) && sha256(canonicalJson(body)) === evidenceDigest &&
      primary.status === "COMPLETE" && primary.classifiedTuples === primary.totalTuples && primary.unresolvedTuples === 0 &&
      primary.lowerDependency === "LOWER_LRC_12_DECLARED_NOT_REPLAYED" &&
      envelope.independent.scriptDigest === LRC_MODULAR_REPLAY_SCRIPT_SHA256 &&
      envelope.independent.outputDigest === sha256(outputBytes(envelope.independent.summary)) &&
      canonicalJson(primary) === canonicalJson(envelope.primary) &&
      canonicalJson(primary) === canonicalJson(envelope.independent.summary);
  } catch { return false; }
}

function runPython(source: string, request: unknown, timeoutMs: number): Promise<string> {
  const input = canonicalJson(request);
  if (Buffer.byteLength(input, "utf8") > 9_000_000) throw new Error("Modular replay input exceeds fixed bound");
  return new Promise((resolve, reject) => {
    const child = execFile("python3", ["-I", "-S", "-B", "-c", source], {
      shell: false, timeout: timeoutMs, killSignal: "SIGKILL", maxBuffer: 262_144, encoding: "utf8",
      env: { NODE_ENV: process.env.NODE_ENV, PATH: process.env.PATH ?? "/usr/bin:/bin", PYTHONDONTWRITEBYTECODE: "1" },
    }, (error, stdout, stderr) => {
      if (error || stderr.length || Buffer.byteLength(stdout, "utf8") > 262_144) reject(new Error("Modular replay process failed closed"));
      else resolve(stdout);
    });
    child.stdin?.on("error", () => reject(new Error("Modular replay input unavailable")));
    if (!child.stdin) { child.kill("SIGKILL"); reject(new Error("Modular replay input unavailable")); }
    else child.stdin.end(input);
  });
}

/** Explicit local CLI replay only, never invoked by a retained UI GET. */
export async function runLrcModularEvidence(expectedScope: LrcModularScope, rootContractDigest: string): Promise<LrcModularEvidence> {
  const started = performance.now();
  if ((process.env.NODE_ENV !== "development" && process.env.NODE_ENV !== "test") ||
    (process.env.DEPLOYMENT_ENV && process.env.DEPLOYMENT_ENV !== "development" && process.env.DEPLOYMENT_ENV !== "test")) {
    throw new Error("Modular certificate replay is restricted to local development/test");
  }
  const scope = lrcModularScopeSchema.parse(expectedScope);
  digest.parse(rootContractDigest);
  const source = await readFile(join(process.cwd(), "scripts/operations/replay-lrc-modular-certificates.py"), "utf8");
  if (sha256(source) !== LRC_MODULAR_REPLAY_SCRIPT_SHA256) throw new Error("Modular replay source drift");
  const certificate = buildLrcModularCertificate(scope, rootContractDigest);
  const primary = verifyLrcModularCertificate(certificate, scope, rootContractDigest);
  if (primary.status !== "COMPLETE") throw new Error("Modular primary certificate incomplete or invalid");
  if (performance.now() - started >= 10_000) throw new Error("Modular replay deadline exceeded");
  // Exact reviewed bytes execute directly, avoiding checked-path re-open drift.
  const stdout = await runPython(source, { scope, rootContractDigest, certificate },
    Math.max(1, Math.floor(10_000 - (performance.now() - started))));
  const output = outputSchema.parse(JSON.parse(stdout));
  if (output.summary.status !== "COMPLETE" || canonicalJson(primary) !== canonicalJson(output.summary) ||
    stdout !== outputBytes(output.summary)) throw new Error("Modular independent replay disagreement");
  const body = { version: 1 as const, rootContractDigest, scopeDigest: lrcModularScopeDigest(scope), certificate, primary,
    independent: { method: "LRC_MODULAR_PYTHON_TREE_REPLAY_V1" as const, status: "COMPLETE" as const,
      scriptDigest: LRC_MODULAR_REPLAY_SCRIPT_SHA256, outputDigest: sha256(stdout), summary: output.summary } };
  const result = lrcModularEvidenceSchema.parse({ ...body, evidenceDigest: sha256(canonicalJson(body)) });
  if (performance.now() - started >= 10_000 || !validateRetainedLrcModularEvidence(result, scope, rootContractDigest)) {
    throw new Error("Modular replay final admission failed");
  }
  if (performance.now() - started >= 10_000) throw new Error("Modular replay final deadline exceeded");
  return result;
}
