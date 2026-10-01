import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { promisify } from "node:util";
import { z } from "zod";

import { isPrimeInSurvey } from "./math-certificates";
import type { DivisorLedEvidence } from "./math-divisor-led";

export const DIVISOR_REPLAY_SCRIPT_SHA256 = "6bb0a58798a6b679ba4662fc4d5d8c0028cede1b8bbd684af514dd3d5c8758a2";
const sha256 = (value: string) => createHash("sha256").update(value, "utf8").digest("hex");
const positive = z.number().int().positive().safe();
const decimal = z.string().regex(/^[1-9][0-9]{0,39}$/);
export const divisorReplaySchema = z.object({
  n: positive, maxS: positive, mode: z.enum(["ALL", "PRIME_ONLY_DIAGNOSTIC"]),
  status: z.enum(["WITNESS", "NOT_FOUND_IN_S_INTERVAL"]), firstS: positive.nullable(),
  construction: z.object({ a: positive, u: positive, s: positive, v: positive, k: positive, shift: positive }).strict().nullable(),
  witness: z.object({ n: decimal, x: decimal, y: decimal, z: decimal }).strict().nullable(),
  strictDigest: z.string().regex(/^[a-f0-9]{64}$/).nullable(),
}).strict();

/** No coercion of repeated, partial, exponential, or out-of-scope query values. */
export function parseDivisorLabQuery(query: Record<string, string | string[] | undefined>) {
  if ([query.n, query.maxS, query.mode].every((v) => v === undefined)) {
    return { n: 131433121, maxS: 143, mode: "ALL" as const };
  }
  const parsed = z.object({
    n: z.string().regex(/^[1-9][0-9]{0,8}$/).transform(Number),
    maxS: z.string().regex(/^[1-9][0-9]{0,3}$/).transform(Number),
    mode: z.enum(["ALL", "PRIME_ONLY_DIAGNOSTIC"]),
  }).parse({ n: query.n, maxS: query.maxS, mode: query.mode });
  if (parsed.n < 841 || parsed.n > 200000000 || parsed.n % 840 !== 1 || !isPrimeInSurvey(parsed.n) ||
      parsed.maxS < 3 || parsed.maxS > 4095) throw new RangeError("Invalid local diagnostic scope");
  return parsed;
}

export function compareDivisorReplay(primary: DivisorLedEvidence, raw: unknown): string[] {
  const other = divisorReplaySchema.parse(raw);
  const fields = ["n", "maxS", "mode", "status", "firstS", "construction", "witness", "strictDigest"] as const;
  return fields.filter((key) => JSON.stringify(primary[key]) !== JSON.stringify(other[key]));
}

export async function replayDivisorLab(primary: DivisorLedEvidence): Promise<{
  status: "PASS" | "MISMATCH" | "UNAVAILABLE"; scriptDigest: string;
  outputDigest: string | null; primaryDigest: string; mismatches: string[];
}> {
  const base = { scriptDigest: DIVISOR_REPLAY_SCRIPT_SHA256, primaryDigest: primary.digest };
  try {
    // Revalidate scope independently of the UI before spawning a fixed, reviewed program.
    parseDivisorLabQuery({ n: String(primary.n), maxS: String(primary.maxS), mode: primary.mode });
    const script = join(process.cwd(), "scripts/operations/replay-divisor-led.py");
    if (sha256(await readFile(script, "utf8")) !== DIVISOR_REPLAY_SCRIPT_SHA256) {
      return { ...base, status: "UNAVAILABLE", outputDigest: null, mismatches: ["SCRIPT_FINGERPRINT_CHANGED"] };
    }
    const { stdout } = await promisify(execFile)("python3", ["-I", "-S", "-B", script,
      "--n", String(primary.n), "--max-s", String(primary.maxS), "--mode", primary.mode], {
      timeout: 10_000, maxBuffer: 256_000,
      env: { NODE_ENV: process.env.NODE_ENV, PATH: process.env.PATH ?? "/usr/bin:/bin", PYTHONDONTWRITEBYTECODE: "1" },
    });
    const mismatches = compareDivisorReplay(primary, JSON.parse(stdout));
    return { ...base, status: mismatches.length ? "MISMATCH" : "PASS", outputDigest: sha256(stdout), mismatches };
  } catch {
    // Never expose process errors, environment values, or stdout from an invalid tool response.
    return { ...base, status: "UNAVAILABLE", outputDigest: null, mismatches: ["REPLAY_NOT_VALIDATED"] };
  }
}
