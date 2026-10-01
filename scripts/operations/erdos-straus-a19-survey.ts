import { createHash } from "node:crypto";

import { analyzeA11ResidualPrime } from "../../src/modules/research-sandbox/math-a11-structure";
import { analyzeA19ResidualPrime } from "../../src/modules/research-sandbox/math-a19-structure";
import { isPrimeInSurvey, searchResidualPrime } from "../../src/modules/research-sandbox/math-certificates";
import { analyzeTwoGateResidualPrime } from "../../src/modules/research-sandbox/math-two-gate-structure";

const args = process.argv.slice(2);
if (args.length !== 1 || !/^--limit=\d+$/.test(args[0]!)) throw new Error("Use --limit=841..200000000");
const limit = Number(args[0]!.split("=")[1]);
if (!Number.isSafeInteger(limit) || limit < 841 || limit > 200_000_000) throw new RangeError("Invalid limit");
const manifest = createHash("sha256");
const counts: Record<string, number> = {};
const afterA11: Record<string, number> = {};
const afterA15: Record<string, number> = {};
const joint: Record<string, number> = {};
const examples: Record<string, ReturnType<typeof analyzeA19ResidualPrime>> = {};
let primeCount = 0;
for (let p = 841; p <= limit; p += 840) {
  if (!isPrimeInSurvey(p)) continue;
  const a19 = analyzeA19ResidualPrime(p);
  const a11 = analyzeA11ResidualPrime(p);
  const threeGateClosed = analyzeTwoGateResidualPrime(p).bothObstructed && a11.status === "OBSTRUCTED";
  const throughA15Closed = threeGateClosed && searchResidualPrime(p, 15).firstA === null;
  const key = a19.status === "OBSTRUCTED" ? (a19.obstructionBoxes.includes(5) ? "QR_ONLY" : "MIXED_OBSTRUCTION")
    : a19.typeIIStatus === "OBSTRUCTED" ? "TYPE_I_RESCUE" : "TYPE_II_OPEN";
  counts[key] = (counts[key] ?? 0) + 1;
  if (threeGateClosed) {
    afterA11[key] = (afterA11[key] ?? 0) + 1;
    const pair = `${a11.obstruction}/${key}`;
    joint[pair] = (joint[pair] ?? 0) + 1;
    examples[`afterA11/${pair}`] ??= a19;
  }
  if (throughA15Closed) {
    afterA15[key] = (afterA15[key] ?? 0) + 1;
    examples[`afterA15/${key}`] ??= a19;
  }
  examples[key] ??= a19;
  manifest.update(JSON.stringify({ n: p, status: a19.status, typeIIStatus: a19.typeIIStatus,
    weights: a19.weights, obstructionBoxes: a19.obstructionBoxes, a11Obstruction: a11.obstruction,
    threeGateClosed, throughA15Closed }), "utf8");
  primeCount++;
}
process.stdout.write(`${JSON.stringify({ limit, primeCount, counts, afterA3A7A11: afterA11,
  afterThroughA15: afterA15, joint, examples, manifestDigest: manifest.digest("hex"),
  scope: "Exact finite cross-gate measurements; no universal rescue or novelty claim." }, null, 2)}\n`);
