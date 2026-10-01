import { createHash } from "node:crypto";

import { analyzeA11ResidualPrime } from "../../src/modules/research-sandbox/math-a11-structure";
import { isPrimeInSurvey } from "../../src/modules/research-sandbox/math-certificates";
import { analyzeTwoGateResidualPrime } from "../../src/modules/research-sandbox/math-two-gate-structure";

const args = process.argv.slice(2);
if (args.length !== 1 || !/^--limit=\d+$/.test(args[0]!)) throw new Error("Use --limit=841..200000000");
const limit = Number(args[0]!.split("=")[1]);
if (!Number.isSafeInteger(limit) || limit < 841 || limit > 200_000_000) throw new RangeError("Invalid limit");
const manifest = createHash("sha256");
const counts: Record<string, number> = {};
const survivors: Record<string, number> = {};
const examples: Record<string, ReturnType<typeof analyzeA11ResidualPrime>> = {};
let primeCount = 0;
for (let p = 841; p <= limit; p += 840) {
  if (!isPrimeInSurvey(p)) continue;
  const result = analyzeA11ResidualPrime(p);
  const twoGateClosed = analyzeTwoGateResidualPrime(p).bothObstructed;
  const key = result.obstruction ?? (result.typeIIStatus === "OBSTRUCTED" ? "TYPE_I_RESCUE" : "TYPE_II_OPEN");
  counts[key] = (counts[key] ?? 0) + 1;
  if (twoGateClosed) survivors[key] = (survivors[key] ?? 0) + 1;
  examples[key] ??= result;
  manifest.update(JSON.stringify({ n: p, status: result.status, typeIIStatus: result.typeIIStatus,
    obstruction: result.obstruction, weights: result.weights, twoGateClosed }), "utf8");
  primeCount += 1;
}
process.stdout.write(`${JSON.stringify({ limit, primeCount, counts, afterA3A7: survivors, examples,
  manifestDigest: manifest.digest("hex"), scope: "Exact fixed-A=11 classification; no claim that all later gates open." }, null, 2)}\n`);
