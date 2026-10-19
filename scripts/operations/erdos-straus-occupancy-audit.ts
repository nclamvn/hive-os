import { createHash } from "node:crypto";
import { auditAllDyadicEligibility, auditAllPrimePowerCoreEligibility, classifyDivisorOccupancy, divisorOccupancyAtlas } from "../../src/modules/research-sandbox/math-divisor-occupancy";

const rows = [];
let subgroupMisses = 0, windowMisses = 0, eligible = 0, checked = 0;
const saturatedModuli = [], primePowerRows = [];
for (let s = 3; s <= 1023; s += 4) {
  const a = divisorOccupancyAtlas(s);
  rows.push([s, a.subgroup, a.usableResidues, a.subgroupObstructions, a.exponentWindowObstructions]);
  subgroupMisses += a.subgroupObstructions.length;
  windowMisses += a.exponentWindowObstructions.length;
  eligible += a.usableResidues.length;
  checked += s - 1;
  if (a.saturated) saturatedModuli.push(s);
  if (a.primePowerCore) primePowerRows.push([s, a.primePowerCore.prime, a.primePowerCore.exponent,
    a.primePowerCore.order, a.primePowerCore.predictedResidues, a.primePowerCore.saturated]);
}
const controls = [[131433121, 11], [159727681, 31], [159727681, 127], [159727681, 791], [131433121, 143], [171348241, 51]]
  .map(([p, s]) => {
    const c = classifyDivisorOccupancy(p, s);
    return [p, s, c.residue, c.character, c.classification, c.subgroupOrder, c.eligibleCount, c.primePowerTest];
  });
const dyadicControls = [351121, 131433121, 171348241, 159727681].map((p) => {
  const d = auditAllDyadicEligibility(p);
  return { p, firstT: d.firstT, hits: d.hits, cutoffT: d.cutoffT, tailMinimumResidue: d.tailMinimumResidue,
    status: d.status, rowsDigest: createHash("sha256").update(JSON.stringify(d.rows), "utf8").digest("hex") };
});
const primePowerControls = [351121, 131433121, 171348241, 159727681].map((p) => {
  const d = auditAllPrimePowerCoreEligibility(p);
  return { p, maxM: d.maxM, tailFromS: d.tailFromS, candidatesChecked: d.candidatesChecked, hits: d.hits,
    status: d.status, rowsDigest: createHash("sha256").update(JSON.stringify(d.rows), "utf8").digest("hex") };
});
console.log(JSON.stringify({ maxS: 1023, checkedResidues: checked, eligibleResidues: eligible,
  subgroupMisses, windowMisses, saturatedModuli, primePowerRows, controls, dyadicControls, primePowerControls,
  manifest: createHash("sha256").update(JSON.stringify(rows), "utf8").digest("hex") }));
