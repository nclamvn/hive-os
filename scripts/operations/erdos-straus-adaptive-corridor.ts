import { createHash } from "node:crypto";

import { analyzeA11ResidualPrime } from "../../src/modules/research-sandbox/math-a11-structure";
import { analyzeA19ResidualPrime } from "../../src/modules/research-sandbox/math-a19-structure";
import { analyzeNeutralCorridor, neutralCorridorFamily, searchModulatorBox } from "../../src/modules/research-sandbox/math-adaptive-corridor";
import { isPrimeInSurvey, searchResidualPrime } from "../../src/modules/research-sandbox/math-certificates";
import { analyzeTwoGateResidualPrime } from "../../src/modules/research-sandbox/math-two-gate-structure";

const args = process.argv.slice(2);
if (args.length !== 1 || !/^--limit=\d+$/.test(args[0]!)) throw new Error("Use --limit=841..200000000");
const limit = Number(args[0]!.split("=")[1]);
if (!Number.isSafeInteger(limit) || limit < 841 || limit > 200_000_000) throw new RangeError("Invalid limit");
const manifest = createHash("sha256");
const counts: Record<string, number> = {}, depths: Record<string, number> = {};
const examples: Record<string, unknown> = {};
let primeCount = 0, survivorCount = 0;
for (let p = 841; p <= limit; p += 840) {
  if (!isPrimeInSurvey(p)) continue;
  primeCount++;
  if (!analyzeTwoGateResidualPrime(p).bothObstructed || analyzeA11ResidualPrime(p).status !== "OBSTRUCTED" ||
    analyzeA19ResidualPrime(p).status !== "OBSTRUCTED" || searchResidualPrime(p, 15).firstA !== null) continue;
  survivorCount++;
  const unit = searchModulatorBox(p, 8, "UNIT_MODULATOR"), full = searchModulatorBox(p, 8);
  const category = full.status === "NOT_FOUND_IN_BOX" ? "BOX_MISS" : unit.status === "WITNESS" ? "UNIT_SLICE_FOUND" : "FREE_MODULATOR_NEEDED_IN_BOX";
  if (unit.status === "WITNESS" && full.status !== "WITNESS") throw new Error("Search boxes are inconsistent");
  counts[category] = (counts[category] ?? 0) + 1;
  depths[String(full.minimumDepth)] = (depths[String(full.minimumDepth)] ?? 0) + 1;
  examples[category] ??= { unit, full };
  const row = { n: p, category, unitDepth: unit.minimumDepth, depth: full.minimumDepth,
    construction: full.construction, witness: full.witness };
  manifest.update(JSON.stringify(row), "utf8");
}
const family = neutralCorridorFamily([11, 19]), neutralTuples = [];
for (let t = 1; BigInt(family.spacing) * BigInt(t) + BigInt(1) <= BigInt(limit); t++) {
  const tuple = analyzeNeutralCorridor([11, 19], t);
  if (tuple) neutralTuples.push(tuple);
}
const controls = [2521, 131041, 4037881, 10051441, 171348241].map((p) => searchModulatorBox(p, 8));
process.stdout.write(`${JSON.stringify({ limit, bound: 8, primeCount, survivorCount, counts, depths,
  examples, controls, neutralTuples, manifestDigest: manifest.digest("hex"),
  scope: "Finite alternative Type II witnesses and neutral tuples; no universal parameter bound, novelty or new coverage claim." }, null, 2)}\n`);
