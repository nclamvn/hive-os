import { performance } from "node:perf_hooks";
import { z } from "zod";
import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";
import { ALLIKVERE_GLOBAL_GAPS } from "./math-lrc-allikvere-report";
import { allikvereCoverReportSchema, type AllikvereCoverReport } from "./math-lrc-cover-report";
import { validateRetainedAllikvereFrontierReport, type AllikvereFrontierReport } from "./math-lrc-frontier-report";
import { mapResumeChildPrefix } from "./math-lrc-frontier";
import { type LrcCoverScope, type LrcCoverCertificate } from "./math-lrc-cover-bound";

export const LRC_UNIT_ACTION_METHOD = "LRC_KERNEL_UNIT_UNION_V1" as const;
export const LRC_UNIT_ACTION_CONTRACT_DIGEST = "93acc34e6cd0ca009fc9e6a7ab65df0ec801b0cf956874c355ee861967a255e9";
export const LRC_UNIT_ACTION_SOURCES = Object.freeze({
  basePath: "docs/research/lrc-allikvere-p199/retained-cover-report.json",
  baseRawSha256: "40ad2047e804b4ea741d55869eb79c25f089de3951175bc612426bcd9b9772a1",
  baseReportDigest: "97fa7dfa80beab4e03c2cc9264d5ab02eb3c8ac05b44d6fa8c6b9f73131d5cac",
  frontierPath: "docs/research/lrc-allikvere-p199/retained-frontier-report.json",
  frontierRawSha256: "a609fcf1fdd6c7d225568d1d830b6a09d069a8657fec7f5bc422f4d588865268",
  frontierReportDigest: "e1f1825b817e21b1672e64e025a1c4790d4e1518b94a9e1ab866cb757604f420" });
export const LRC_UNIT_ACTION_LIMITS = Object.freeze({ sourceLeavesTotal: 120000, candidateIntervalsTotal: 1500000,
  unionIntervalsTotal: 1500000, newMethodWork: 50000000, pureAdmissionMs: 60000, independentWrapperMs: 90000,
  independentStdoutBytes: 1048576, inputBytes: 83886080, retainedReportBytes: 1048576, collectorMs: 120000, examplesPerRow: 8 });
export const LRC_UNIT_ACTION_PARAMETERS = Object.freeze({ H: 398, M: 2786, radix: 7, axes: 13,
  totalTuples: "96889010407", t: Object.freeze([0, 2, 3, 4, 5, 6]) as readonly number[],
  s: Object.freeze([1, 797, 1195, 1593, 1991, 2389]) as readonly number[] });
const hex = z.string().regex(/^[a-f0-9]{64}$/);
const id = z.string().regex(/^[A-Za-z0-9_-]{1,80}$/);
const digits = z.array(z.number().int().min(0).max(6)).max(13);
const N = BigInt(LRC_UNIT_ACTION_PARAMETERS.totalTuples);
const decimal = z.string().regex(/^(0|[1-9][0-9]{0,10})$/).refine((n) => BigInt(n) <= N);
const rawDecimal = z.string().regex(/^(0|[1-9][0-9]{0,11})$/).refine((n) => BigInt(n) <= BigInt(6) * N);
export const lrcUnitIntervalSchema = z.object({ start: decimal, end: decimal }).strict()
  .refine((r) => BigInt(r.start) < BigInt(r.end), "Positive half-open interval required");
export type LrcUnitInterval = z.infer<typeof lrcUnitIntervalSchema>;
const unit = z.object({ t: z.number().int().min(0).max(6), s: z.number().int().min(1).max(2389) }).strict();
const count = z.number().int().min(0).max(1500000);
const planRow = z.object({ parentId: id, parentRootContractDigest: hex, parentScopeDigest: hex,
  parentCertificateDigest: hex, parentEvidenceDigest: hex, childJobDigests: z.array(hex).length(2),
  sourceLeafCount: z.number().int().min(1).max(120000), sourceSelectionDigest: hex }).strict();
export const lrcUnitActionPlanSchema = z.object({ version: z.literal(1), method: z.literal("LRC_KERNEL_UNIT_ACTION_PLAN_V1"),
  contractDigest: hex, baseReportDigest: hex, frontierReportDigest: hex, sourceManifestDigest: hex,
  units: z.array(unit).length(6), rows: z.array(planRow).length(4), planDigest: hex }).strict();
export type LrcUnitActionPlan = z.infer<typeof lrcUnitActionPlanSchema>;
export const lrcUnitActionRowSummarySchema = z.object({ parentId: id, status: z.enum(["COMPLETE", "PARTIAL"]),
  totalTuples: decimal, originalWitnessTuples: decimal, unionWitnessTuples: decimal, deltaWitnessTuples: decimal,
  remainingTuples: decimal, rawTransportTuples: rawDecimal, overlapTuples: rawDecimal,
  sourceLeafCount: count, candidateIntervals: count, unionIntervals: count, complementIntervals: count,
  unionDigest: hex, complementDigest: hex, unionExamples: z.array(lrcUnitIntervalSchema).max(8),
  complementExamples: z.array(lrcUnitIntervalSchema).max(8) }).strict();
export const lrcUnitActionSummarySchema = z.object({ version: z.literal(1), method: z.literal(LRC_UNIT_ACTION_METHOD),
  status: z.enum(["COMPLETE", "PARTIAL"]), planDigest: hex, baseReportDigest: hex, frontierReportDigest: hex,
  globalVerdict: z.literal("NOT_ESTABLISHED"), lowerDependency: z.literal("LOWER_LRC_12_DECLARED_NOT_REPLAYED"),
  uncoveredObligations: z.array(z.enum(ALLIKVERE_GLOBAL_GAPS)).length(5), rows: z.array(lrcUnitActionRowSummarySchema).length(4) }).strict();
export type LrcUnitActionSummary = z.infer<typeof lrcUnitActionSummarySchema>;
export function lrcUnitActionPlanDigest(raw: LrcUnitActionPlan | Omit<LrcUnitActionPlan, "planDigest">): string {
  const { planDigest: _digest, ...body } = raw as LrcUnitActionPlan; void _digest; return sha256(canonicalJson(body));
}
export const lrcUnitActionOutputBytes = (summary: LrcUnitActionSummary): string =>
  `${canonicalJson({ method: "LRC_UNIT_ACTION_PYTHON_UNION_V1", summary: lrcUnitActionSummarySchema.parse(summary) })}\n`;
type Charge = (cost?: number) => void;
const noCharge: Charge = () => {};
const pow7 = Array.from({ length: 14 }, (_, depth) => BigInt(7) ** BigInt(depth));
type Range = { start: bigint; end: bigint };
function range(prefix: number[], charge: Charge): Range {
  let code = BigInt(0);
  for (const digit of prefix) { charge(); code = BigInt(7) * code + BigInt(digit); }
  return { start: code * pow7[13 - prefix.length], end: (code + BigInt(1)) * pow7[13 - prefix.length] };
}
export function lrcUnitPrefixInterval(prefix: number[]): LrcUnitInterval {
  const r = range(digits.parse(prefix), noCharge); return { start: r.start.toString(), end: r.end.toString() };
}
function merge(ranges: Range[], charge: Charge): Range[] {
  ranges.sort((a, b) => { charge(); return a.start < b.start ? -1 : a.start > b.start ? 1 : a.end < b.end ? -1 : a.end > b.end ? 1 : 0; });
  const result: Range[] = [];
  for (const r of ranges) {
    charge(); const last = result.at(-1);
    if (last && r.start <= last.end) { if (r.end > last.end) last.end = r.end; }
    else result.push({ ...r });
  }
  return result;
}
const serializeRanges = (ranges: Range[]): LrcUnitInterval[] => ranges.map((r) => ({ start: r.start.toString(), end: r.end.toString() }));
/** Exact general interval helper, not a caller-selectable research domain. */
export function mergeLrcUnitIntervals(raw: LrcUnitInterval[]): LrcUnitInterval[] {
  const intervals = z.array(lrcUnitIntervalSchema).max(1500000).parse(raw);
  return serializeRanges(merge(intervals.map((r) => ({ start: BigInt(r.start), end: BigInt(r.end) })), noCharge));
}
function complement(union: Range[], charge: Charge): Range[] {
  const result: Range[] = []; let cursor = BigInt(0);
  for (const r of union) { charge(); if (r.start > cursor) result.push({ start: cursor, end: r.start }); cursor = r.end; }
  if (cursor < N) result.push({ start: cursor, end: N });
  return result;
}
export function complementLrcUnitIntervals(rawUnion: LrcUnitInterval[]): LrcUnitInterval[] {
  const intervals = z.array(lrcUnitIntervalSchema).max(1500000).parse(rawUnion);
  if (intervals.some((r, index) => index > 0 && BigInt(r.start) <= BigInt(intervals[index - 1].end))) throw new Error("Noncanonical interval union");
  return serializeRanges(complement(intervals.map((r) => ({ start: BigInt(r.start), end: BigInt(r.end) })), noCharge));
}
export function transportLrcUnitPrefix(prefix: number[], residues: number[], t: number): number[] {
  const p = digits.parse(prefix), r = z.array(z.number().int().min(1).max(397)).length(13).parse(residues);
  if (!LRC_UNIT_ACTION_PARAMETERS.t.includes(t)) throw new Error("Nonunit kernel action");
  return p.map((d, axis) => (((1 - t) * d + t * r[axis]) % 7 + 7) % 7);
}
function gcd(a: number, b: number): number { while (b) [a, b] = [b, a % b]; return a; }
/** This ONE time permutation is shared by every coordinate. Ring products
 * give (s*v)*j = v*(s*j) modulo M, hence preserve the signed-distance good
 * predicate. Inverse s sends any source good time to a target good time. */
function checkAction(scope: LrcCoverScope, charge: Charge): void {
  for (let index = 0; index < 6; index++) {
    const t = LRC_UNIT_ACTION_PARAMETERS.t[index], s = LRC_UNIT_ACTION_PARAMETERS.s[index]; charge();
    if (s !== 1 + 398 * t || gcd(s, 2786) !== 1 || s % 398 !== 1) throw new Error("Invalid unit algebra");
    const seen = new Set<number>();
    for (let j = 1; j <= 1393; j++) { charge(); const product = s * j % 2786; seen.add(Math.min(product, 2786 - product)); }
    if (seen.size !== 1393 || seen.has(0)) throw new Error("Not one folded-grid permutation");
    for (let axis = 0; axis < 13; axis++) {
      const images = new Set<number>(), r = scope.parentResidues[axis];
      for (let d = 0; d < 7; d++) {
        charge(); const image = (((1 - t) * d + t * r) % 7 + 7) % 7; images.add(image);
        if ((s * (r + 398 * d)) % 2786 !== (r + 398 * image) % 2786) throw new Error("Wrong same-coordinate action");
      }
      if (images.size !== 7) throw new Error("Nonbijective digit axis");
    }
  }
}
type Ref = { origin: "BASE" | "CHILD"; jobDigest: string | null; certificateDigest: string; nodeId: string; nodeDigest: string; prefix: number[] };
type Admitted = { base: AllikvereCoverReport; frontier: AllikvereFrontierReport };
function admit(baseRaw: unknown, frontierRaw: unknown, checkpoint: Charge): Admitted {
  checkpoint();
  if (Buffer.byteLength(JSON.stringify({ base: baseRaw, frontier: frontierRaw }), "utf8") > LRC_UNIT_ACTION_LIMITS.inputBytes) throw new Error("Source input limit");
  checkpoint();
  const frontier = validateRetainedAllikvereFrontierReport(frontierRaw, baseRaw); // old budgets unchanged, base checked once inside
  checkpoint();
  if (!frontier || frontier.reportDigest !== LRC_UNIT_ACTION_SOURCES.frontierReportDigest) throw new Error("Invalid or stale frontier source");
  const base = allikvereCoverReportSchema.parse(baseRaw);
  if (base.reportDigest !== LRC_UNIT_ACTION_SOURCES.baseReportDigest) throw new Error("Stale base source");
  return { base, frontier };
}
function extract(admitted: Admitted, charge: Charge): Ref[][] {
  const result: Ref[][] = []; let leafCount = 0;
  const { base, frontier } = admitted;
  for (let index = 0; index < 4; index++) {
    const row = base.rows[index + 4], refs: Ref[] = [];
    const add = (certificate: LrcCoverCertificate, target: number[] | null, jobDigest: string | null) => {
      for (const node of certificate.nodes) {
        charge(); if (node.kind !== "COVER_BOUND") continue;
        if (++leafCount > LRC_UNIT_ACTION_LIMITS.sourceLeavesTotal) throw new Error("Source leaf limit");
        refs.push({ origin: target ? "CHILD" : "BASE", jobDigest, certificateDigest: certificate.certificateDigest,
          nodeId: node.id, nodeDigest: sha256(canonicalJson(node)), prefix: target ? mapResumeChildPrefix(target, node.prefix) : [...node.prefix] });
      }
    };
    add(row.evidence.certificate, null, null);
    for (let offset = 0; offset < 2; offset++) {
      const job = frontier.evidence.packet.plan.jobs[index * 2 + offset];
      add(frontier.evidence.packet.children[index * 2 + offset].evidence.certificate, job.prefix, job.jobDigest);
    }
    result.push(refs);
  }
  return result;
}
function plan(admitted: Admitted, refs: Ref[][]): LrcUnitActionPlan {
  const { base, frontier } = admitted;
  const body = { version: 1 as const, method: "LRC_KERNEL_UNIT_ACTION_PLAN_V1" as const, contractDigest: LRC_UNIT_ACTION_CONTRACT_DIGEST,
    baseReportDigest: base.reportDigest, frontierReportDigest: frontier.reportDigest, sourceManifestDigest: base.sourceManifestDigest,
    units: LRC_UNIT_ACTION_PARAMETERS.t.map((t, index) => ({ t, s: LRC_UNIT_ACTION_PARAMETERS.s[index] })),
    rows: base.rows.slice(4).map((row, index) => ({ parentId: row.id, parentRootContractDigest: row.rootContractDigest,
      parentScopeDigest: row.evidence.scopeDigest, parentCertificateDigest: row.evidence.certificate.certificateDigest,
      parentEvidenceDigest: row.evidence.evidenceDigest, childJobDigests: frontier.evidence.packet.plan.jobs.slice(index * 2, index * 2 + 2).map((j) => j.jobDigest),
      sourceLeafCount: refs[index].length, sourceSelectionDigest: sha256(canonicalJson(refs[index])) })) };
  return lrcUnitActionPlanSchema.parse({ ...body, planDigest: lrcUnitActionPlanDigest(body) });
}
function budget(options: { timeoutMs?: number; maxWork?: number }) {
  return z.object({ timeoutMs: z.number().int().min(0).max(60000), maxWork: z.number().int().min(0).max(50000000) }).strict()
    .parse({ timeoutMs: 60000, maxWork: 50000000, ...options });
}
function observer(options: { timeoutMs?: number; maxWork?: number }): Charge {
  const started = performance.now(), limits = budget(options); let work = 0;
  return (cost = 1) => {
    if (performance.now() - started >= limits.timeoutMs) throw new Error("Unit observed deadline");
    if ((work += cost) > limits.maxWork) throw new Error("Unit logical work limit");
  };
}
export function deriveLrcUnitActionPlan(base: unknown, frontier: unknown): LrcUnitActionPlan {
  const charge = observer({}); const admitted = admit(base, frontier, charge), refs = extract(admitted, charge);
  const result = plan(admitted, refs); canonicalJson(result); charge(); return result;
}
/** Directly transforms EVERY admitted source leaf; no pre-union shortcut,
 * arbitrary caller subset or count multiplier is an admission authority. */
export function verifyLrcUnitActionPlan(rawPlan: unknown, base: unknown, frontier: unknown,
  options: { timeoutMs?: number; maxWork?: number } = {}): LrcUnitActionSummary | null {
  try {
    const charge = observer(options); charge();
    if (Buffer.byteLength(JSON.stringify({ plan: rawPlan, base, frontier }), "utf8") > LRC_UNIT_ACTION_LIMITS.inputBytes) return null;
    charge(); const claimed = lrcUnitActionPlanSchema.parse(rawPlan);
    const admitted = admit(base, frontier, charge), refs = extract(admitted, charge), expected = plan(admitted, refs);
    charge(); if (canonicalJson(claimed) !== canonicalJson(expected)) return null;
    const rows: LrcUnitActionSummary["rows"] = []; let candidates = 0, unionCount = 0;
    for (let index = 0; index < 4; index++) {
      const parent = admitted.base.rows[index + 4]; checkAction(parent.scope, charge);
      const ranges: Range[] = []; let original = BigInt(0), raw = BigInt(0);
      for (const ref of refs[index]) {
        charge(); const sourceRange = range(ref.prefix, charge); original += sourceRange.end - sourceRange.start;
        for (const t of LRC_UNIT_ACTION_PARAMETERS.t) {
          if (++candidates > LRC_UNIT_ACTION_LIMITS.candidateIntervalsTotal) throw new Error("Candidate interval limit");
          const prefix = ref.prefix.map((d, axis) => { charge(); return (((1 - t) * d + t * parent.scope.parentResidues[axis]) % 7 + 7) % 7; });
          const r = range(prefix, charge); ranges.push(r); raw += r.end - r.start;
        }
      }
      const previous = admitted.frontier.evidence.primary.rows[index].current.witnessTuples;
      if (original.toString() !== previous) throw new Error("Incomplete proven source extraction");
      const union = merge(ranges, charge), missing = complement(union, charge);
      if ((unionCount += union.length) > LRC_UNIT_ACTION_LIMITS.unionIntervalsTotal) throw new Error("Union interval limit");
      const covered = union.reduce((sum, r) => { charge(); return sum + r.end - r.start; }, BigInt(0));
      const remainder = missing.reduce((sum, r) => { charge(); return sum + r.end - r.start; }, BigInt(0));
      if (covered < original || covered > N || covered + remainder !== N || raw < covered) throw new Error("Coverage conservation");
      const allUnion = serializeRanges(union), allMissing = serializeRanges(missing); charge();
      rows.push({ parentId: parent.id, status: remainder === BigInt(0) ? "COMPLETE" : "PARTIAL", totalTuples: N.toString(),
        originalWitnessTuples: original.toString(), unionWitnessTuples: covered.toString(), deltaWitnessTuples: (covered - original).toString(),
        remainingTuples: remainder.toString(), rawTransportTuples: raw.toString(), overlapTuples: (raw - covered).toString(),
        sourceLeafCount: refs[index].length, candidateIntervals: ranges.length, unionIntervals: union.length, complementIntervals: missing.length,
        unionDigest: sha256(canonicalJson(allUnion)), complementDigest: sha256(canonicalJson(allMissing)),
        unionExamples: allUnion.slice(0, 8), complementExamples: allMissing.slice(0, 8) }); charge();
    }
    const result = lrcUnitActionSummarySchema.parse({ version: 1, method: LRC_UNIT_ACTION_METHOD,
      status: rows.every((row) => row.status === "COMPLETE") ? "COMPLETE" : "PARTIAL", planDigest: expected.planDigest,
      baseReportDigest: admitted.base.reportDigest, frontierReportDigest: admitted.frontier.reportDigest,
      globalVerdict: "NOT_ESTABLISHED", lowerDependency: "LOWER_LRC_12_DECLARED_NOT_REPLAYED",
      uncoveredObligations: [...ALLIKVERE_GLOBAL_GAPS], rows });
    lrcUnitActionOutputBytes(result); charge(); return result;
  } catch { return null; }
}
