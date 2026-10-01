import { createHash } from "node:crypto";

import { isPrimeInSurvey, MAX_RESIDUAL_SURVEY_N, searchResidualPrime } from "../../src/modules/research-sandbox/math-certificates";

function option(name: string, fallback: number): number {
  const values = process.argv.slice(2).filter((arg) => arg.startsWith(`--${name}=`));
  if (values.length > 1) throw new Error(`Duplicate --${name}`);
  if (!values.length) return fallback;
  const value = Number(values[0]!.split("=")[1]);
  if (!Number.isSafeInteger(value)) throw new Error(`Invalid --${name}`);
  return value;
}

const limit = option("limit", 1_000_000);
const maxA = option("max-a", 107);
const full = process.argv.includes("--full");
if (process.argv.slice(2).some((arg) => !/^--(?:limit|max-a)=/.test(arg) && arg !== "--full")) {
  throw new Error("Unknown survey option");
}
if (limit < 841 || limit > MAX_RESIDUAL_SURVEY_N || maxA < 3 || maxA > 107 || maxA % 4 !== 3) {
  throw new Error("Survey bounds: 841 <= limit <= 200,000,000 and 3 <= max-a <= 107, max-a ≡ 3 mod 4");
}

const records = [] as ReturnType<typeof searchResidualPrime>[];
for (let n = 841; n <= limit; n += 840) {
  if (isPrimeInSurvey(n)) records.push(searchResidualPrime(n, maxA));
}
const distribution: Record<string, number> = {};
for (const record of records) {
  const key = record.firstA === null ? "UNRESOLVED_WITHIN_BOUND" : String(record.firstA);
  distribution[key] = (distribution[key] ?? 0) + 1;
}
const methodVersion = "ERDOS_STRAUS_RESIDUAL_SURVEY_V1";
const manifestDigest = createHash("sha256").update(JSON.stringify({ methodVersion, limit, maxA, records }), "utf8").digest("hex");
const hardCases = records.filter((record) => record.firstA === null || record.firstA > 7);
process.stdout.write(`${JSON.stringify({
  method: "Exact factor-pair enumeration for x=(p+A)/4; all divisors of (px)^2 with d<=px",
  methodVersion,
  domain: "Prime p ≡ 1 (mod 840), 841 <= p <= limit",
  limit, maxA, primeCount: records.length, distribution, hardCaseCount: hardCases.length,
  hardestA: Math.max(...records.map((record) => record.firstA ?? 0)),
  firstHardCases: hardCases.slice(0, 20),
  unresolved: records.filter((record) => record.firstA === null).map((record) => record.n),
  ...(full ? { records } : {}),
  manifestDigest,
  interpretation: "Bounded exact computation only. Not a proof of the Erdős–Straus conjecture or a novelty claim.",
}, null, 2)}\n`);
