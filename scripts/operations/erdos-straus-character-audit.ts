import { createHash } from "node:crypto";
import { divisorCharacterAtlas, divisorMenuCharacterBarrier, firstCharacterDivisor, jacobiSymbol, searchCharacterFiltered } from "../../src/modules/research-sandbox/math-divisor-character";
import { searchDivisorLed } from "../../src/modules/research-sandbox/math-divisor-led";

const rows = [];
let checkedResidues = 0, eligibleResidues = 0, negativeMisses = 0;
for (let s = 3; s <= 1023; s += 4) {
  const atlas = divisorCharacterAtlas(s);
  rows.push([s, atlas.pairCount, atlas.usableResidues, atlas.negativeCharacterResidues]);
  checkedResidues += s - 1; eligibleResidues += atlas.usableResidues.length;
  negativeMisses += atlas.negativeCharacterMisses.length;
}
const controls = [131433121, 351121, 171348241, 159727681].map((p) => {
  const threshold = firstCharacterDivisor(p, 4095);
  const evidence = searchDivisorLed(p, 4095);
  const filtered = searchCharacterFiltered(p, 4095);
  for (const key of ["status", "firstS", "construction", "witness", "strictDigest"] as const) {
    if (JSON.stringify(evidence[key]) !== JSON.stringify(filtered[key])) throw new Error(`Filtered search drift: ${key}`);
  }
  const primeCharacters = [3, 5, 7, 11, 13, 19].map((q) => [q, jacobiSymbol(p, q)]);
  return { p, firstCharacterS: threshold.firstS, firstWitnessS: evidence.firstS, primeCharacters,
    witness: evidence.witness, strictDigest: evidence.strictDigest,
    checkedS: filtered.checkedS, skippedS: filtered.skippedS };
});
const barriers = [19, 63, 143, 255, 1023].map((bound) => {
  const b = divisorMenuCharacterBarrier(bound);
  return { maxS: bound, rank: b.rank, denominator: b.blindClassDenominator, externalPrimes: b.externalPrimes };
});
console.log(JSON.stringify({ maxS: 1023, checkedResidues, eligibleResidues, negativeMisses,
  manifest: createHash("sha256").update(JSON.stringify(rows), "utf8").digest("hex"), controls, barriers }, null, 2));
