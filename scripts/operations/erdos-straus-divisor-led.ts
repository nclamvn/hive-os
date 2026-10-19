import { createHash } from "node:crypto";

import { analyzeA11ResidualPrime } from "../../src/modules/research-sandbox/math-a11-structure";
import { analyzeA19ResidualPrime } from "../../src/modules/research-sandbox/math-a19-structure";
import { isPrimeInSurvey, searchResidualPrime } from "../../src/modules/research-sandbox/math-certificates";
import { auditSharedDivisorSeparation, searchDivisorLed } from "../../src/modules/research-sandbox/math-divisor-led";
import { analyzeTwoGateResidualPrime } from "../../src/modules/research-sandbox/math-two-gate-structure";

const args = process.argv.slice(2);
if (args.length !== 1 || !/^--limit=\d+$/.test(args[0]!)) throw new Error("Use --limit=841..200000000");
const limit = Number(args[0]!.split("=")[1]);
if (!Number.isSafeInteger(limit) || limit < 841 || limit > 200_000_000) throw new RangeError("Invalid limit");
const maxS = 4095, manifest = createHash("sha256"), counts: Record<string, number> = {};
let primeCount = 0, survivors = 0, largestFirstS = 0, largestParameter = 0;
const examples: Record<string, unknown> = {};
for (let n = 841; n <= limit; n += 840) {
  if (!isPrimeInSurvey(n)) continue;
  primeCount++;
  if (!analyzeTwoGateResidualPrime(n).bothObstructed || analyzeA11ResidualPrime(n).status !== "OBSTRUCTED" ||
    analyzeA19ResidualPrime(n).status !== "OBSTRUCTED" || searchResidualPrime(n, 15).firstA !== null) continue;
  survivors++;
  const full = searchDivisorLed(n, maxS), prime = searchDivisorLed(n, maxS, "PRIME_ONLY_DIAGNOSTIC");
  const category = full.status !== "WITNESS" ? "S_INTERVAL_MISS" : prime.status !== "WITNESS"
    ? "COMPOSITE_REQUIRED_IN_INTERVAL" : "PRIME_ALSO_FOUND";
  counts[category] = (counts[category] ?? 0) + 1;
  if (full.construction) {
    if (full.firstS! > largestFirstS) { largestFirstS = full.firstS!; examples.largestFirstS = full; }
    const depth = Math.max(full.construction.a, full.construction.u);
    if (depth > largestParameter) { largestParameter = depth; examples.largestParameter = full; }
  }
  examples[category] ??= { n, full, prime };
  manifest.update(JSON.stringify({ n, category, firstS: full.firstS, primeFirstS: prime.firstS,
    construction: full.construction, witness: full.witness }));
}
const controls = [2521, 131041, 4037881, 10051441, 171348241, 131433121, 17907121]
  .map((n) => ({ all: searchDivisorLed(n, maxS), prime: searchDivisorLed(n, maxS, "PRIME_ONLY_DIAGNOSTIC") }));
process.stdout.write(`${JSON.stringify({ limit, maxS, primeCount, survivors, counts, largestFirstS, largestParameter,
  examples, controls, separation: auditSharedDivisorSeparation(131433121, 143, 4, 9, 8),
  manifestDigest: manifest.digest("hex"),
  scope: "Finite divisor-led Type II search; prime-only misses apply only within maxS. No root proof or novelty." }, null, 2)}\n`);
