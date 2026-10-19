import { z } from "zod";
import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";
import authorBytes from "../../../docs/research/lrc-allikvere-p199/author-kill-logs.json";
import provenance from "../../../docs/research/lrc-allikvere-p199/provenance.json";
import rootReadme from "../../../docs/research/lrc-allikvere-p199/author-root-readme.json";
import { lrcModularScopeSchema, type LrcModularScope } from "./math-lrc-modular-certificates";
import { lrcModularEvidenceSchema, validateRetainedLrcModularEvidence } from "./math-lrc-modular-replay";

export const ALLIKVERE_REPORT_LIMITS = Object.freeze({ bytes: 64 * 1024 * 1024, milliseconds: 60000, rows: 6 });
export const ALLIKVERE_GLOBAL_GAPS = ["LEVEL1_ALL_ORBIT_COMPLETENESS_NOT_REPLAYED", "OTHER_PRIMES_NOT_REPLAYED",
  "FULL_TERMINAL_7_POWER_13_NOT_REPLAYED", "LOWER_LRC_12_NOT_REPLAYED", "ANALYTIC_PRODUCT_BOUND_NOT_REPLAYED"] as const;
const hex = z.string().regex(/^[a-f0-9]{64}$/);
const expectedMembers = [
  { name: "fourteen_lonely_runners/kill_gw_final.txt", size: 340, crc32: "9f630aca", sha256: "9a441e4a96750c519a53c8708292e816cb302eb1201f499882ba17e7cf6e9297" },
  { name: "fourteen_lonely_runners/kill_tight_final.txt", size: 894, crc32: "ca47ab33", sha256: "946ba9d5cb77db00bf52aa7831beef3fc12acb7136095601550b074687b24a18" },
] as const;
function crc32(bytes: Uint8Array): string {
  let crc = 0xffffffff;
  for (const byte of bytes) { crc ^= byte; for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0); }
  return ((crc ^ 0xffffffff) >>> 0).toString(16).padStart(8, "0");
}
type AuthorRow = { residues: number[]; terminalPrefix: number[]; aggregateNodesDeclared: number };
type AuthorLog = { name: string; sourceDigest: string; base: number[]; rows: AuthorRow[] };
/** Imported text is inert data. Exact byte identity, not the author's conclusion,
 * is trusted here. Aggregate author counters are never a branch certificate. */
export function importedAllikvereLogs(): AuthorLog[] {
  const readme = Buffer.from(rootReadme.bytesBase64, "base64");
  if (rootReadme.sha256 !== "532959514158484fdb3b2fb343b97131d841df9b0b35d39d323ea063c582f787" ||
    readme.length !== 6790 || sha256(readme.toString("utf8")) !== rootReadme.sha256 || crc32(readme) !== "d691de79" ||
    readme.toString("base64") !== rootReadme.bytesBase64 ||
    !readme.toString("utf8").includes("For p = 199\n  the working evidence sits directly at the root (`filt/`, `c12/`,\n  `kill_tight_final.txt`, `kill_gw_final.txt`)")) throw new Error("Archived prime-layout identity drift");
  if (authorBytes.version !== 1 || authorBytes.encoding !== "BASE64_EXACT_BYTES_CRLF" || authorBytes.members.length !== 2 ||
    provenance.archive.wholeArchiveVerified !== false || provenance.members.length !== 2) throw new Error("Imported author manifest drift");
  return expectedMembers.map((expected, index) => {
    const member = authorBytes.members[index], meta = provenance.members[index];
    const bytes = Buffer.from(member.bytesBase64, "base64");
    if (member.name !== expected.name || meta.name !== expected.name || member.sha256 !== expected.sha256 || meta.sha256 !== expected.sha256 ||
      bytes.length !== expected.size || meta.uncompressedBytes !== expected.size || meta.crc32 !== expected.crc32 || crc32(bytes) !== expected.crc32 ||
      sha256(bytes.toString("utf8")) !== expected.sha256 || bytes.toString("base64") !== member.bytesBase64) throw new Error("Imported author bytes failed binding");
    const text = bytes.toString("utf8");
    if (text.replaceAll("\r\n", "").includes("\n") || text.replaceAll("\r\n", "").includes("\r")) throw new Error("Author line endings changed");
    const baseMatch = /^base: ([0-9 ]+)\r\nlevel-2 improper lifts of tight tuple: ([0-9]+)\r\n/.exec(text);
    if (!baseMatch) throw new Error("Malformed author header");
    const vector = (value: string) => value.split(" ").map((n) => Number(n));
    const base = vector(baseMatch[1]);
    const rows = [...text.matchAll(/=== level-2 tuple: ([0-9 ]+)\r\nIMPROPER-BY-WITNESS region at depth 13 \(1 completions\), prefix: ([0-9 ]+)\r\n  nodes=([0-9]+)  witness_improper=1  improper_after_gcd7=0\r\n  => NO improper lift at l=14 over this level-2 component\r\n/g)]
      .map((match) => ({ residues: vector(match[1]), terminalPrefix: vector(match[2]), aggregateNodesDeclared: Number(match[3]) }));
    if (base.length !== 13 || rows.length !== Number(baseMatch[2]) || rows.some((r) => r.residues.length !== 13 || r.terminalPrefix.length !== 13 || r.terminalPrefix.some((d) => d < 0 || d > 6))) throw new Error("Malformed author vectors");
    return { name: expected.name, sourceDigest: expected.sha256, base, rows };
  });
}
export const ALLIKVERE_SOURCE_DIGEST = sha256(canonicalJson({ authorBytes, provenance, rootReadme }));
export const ALLIKVERE_PROVENANCE = provenance;
export const ALLIKVERE_ROOT_README_DIGEST = rootReadme.sha256;
export type AllikvereScopeDescriptor = { id: string; kind: "BINARY_FIBER" | "TERMINAL_SHARD"; authorMember: string;
  scope: LrcModularScope; rootContractDigest: string; authorSurvivors: number[][]; authorTerminalPrefix: number[] | null };
/** Exactly two full binary lifts and four restricted 49-point terminal shards.
 * Coordinate labels and repeats survive untouched; no orbit normalization. */
export function allikvereImportedScopes(): AllikvereScopeDescriptor[] {
  const logs = importedAllikvereLogs();
  const gw = logs[0], tight = logs[1];
  const rows: Omit<AllikvereScopeDescriptor, "rootContractDigest">[] = [];
  for (const [label, log] of [["tight", tight], ["gw", gw]] as const) {
    rows.push({ id: `p199-${label}-level2`, kind: "BINARY_FIBER", authorMember: log.name,
      scope: lrcModularScopeSchema.parse({ version: 1, totalRunners: 14, prime: 199, parentLevel: 1, targetLevel: 2,
        parentResidues: log.base, digitAxes: log.base.map(() => [0, 1]), sourceDigest: log.sourceDigest,
        lowerDependency: "LOWER_LRC_12_DECLARED_NOT_REPLAYED" }), authorSurvivors: log.rows.map((r) => r.residues), authorTerminalPrefix: null });
  }
  for (const [label, log] of [["tight", tight], ["gw", gw]] as const) log.rows.forEach((row, index) => {
    rows.push({ id: `p199-${label}-terminal-${index}`, kind: "TERMINAL_SHARD", authorMember: log.name,
      scope: lrcModularScopeSchema.parse({ version: 1, totalRunners: 14, prime: 199, parentLevel: 2, targetLevel: 14,
        parentResidues: row.residues, digitAxes: row.terminalPrefix.map((digit, a) => a < 11 ? [digit] : [0, 1, 2, 3, 4, 5, 6]),
        sourceDigest: log.sourceDigest, lowerDependency: "LOWER_LRC_12_DECLARED_NOT_REPLAYED" }), authorSurvivors: [], authorTerminalPrefix: row.terminalPrefix });
  });
  if (rows.length !== 6) throw new Error("Imported six-scope manifest drift");
  return rows.map((row) => ({ ...row, rootContractDigest: sha256(canonicalJson({ method: "ALLIKVERE_IMPORTED_MODULAR_FIBERS_V1", sourceManifestDigest: ALLIKVERE_SOURCE_DIGEST, ...row })) }));
}
const descriptorSchema = z.object({ id: z.string().max(64), kind: z.enum(["BINARY_FIBER", "TERMINAL_SHARD"]), authorMember: z.string().max(128),
  scope: lrcModularScopeSchema, rootContractDigest: hex, authorSurvivors: z.array(z.array(z.number().int()).length(13)).max(3),
  authorTerminalPrefix: z.array(z.number().int()).length(13).nullable() }).strict();
const rowSchema = descriptorSchema.extend({ evidence: lrcModularEvidenceSchema, authorSurvivorListMatched: z.boolean().nullable() }).strict();
export const allikvereRetainedReportSchema = z.object({ version: z.literal(1), method: z.literal("ALLIKVERE_IMPORTED_MODULAR_FIBERS_V1"),
  status: z.literal("COMPLETE"), generatedAt: z.string().datetime(), sourceManifestDigest: hex, archiveWholeVerified: z.literal(false),
  globalVerdict: z.literal("NOT_ESTABLISHED"), lowerDependency: z.literal("LOWER_LRC_12_DECLARED_NOT_REPLAYED"),
  uncoveredObligations: z.array(z.enum(ALLIKVERE_GLOBAL_GAPS)).length(5), rows: z.array(rowSchema).length(6), reportDigest: hex }).strict();
export type AllikvereRetainedReport = z.infer<typeof allikvereRetainedReportSchema>;
export function allikvereReportDigest(raw: Omit<AllikvereRetainedReport, "reportDigest"> | AllikvereRetainedReport): string {
  const { reportDigest: _digest, ...body } = raw as AllikvereRetainedReport; void _digest; return sha256(canonicalJson(body));
}
export function sameAllikvereResidueSets(left: number[][], right: number[][]): boolean {
  const key = (rows: number[][]) => rows.map((r) => r.join(",")).sort(); return canonicalJson(key(left)) === canonicalJson(key(right));
}
/** Pure arithmetic and immutable-local-envelope validation. No filesystem,
 * network or subprocess; hashes do not attest a compromised collector. */
export function validateRetainedAllikvereReport(raw: unknown): AllikvereRetainedReport | null {
  try {
    if (Buffer.byteLength(JSON.stringify(raw), "utf8") > ALLIKVERE_REPORT_LIMITS.bytes) return null;
    const report = allikvereRetainedReportSchema.parse(raw);
    if (report.sourceManifestDigest !== ALLIKVERE_SOURCE_DIGEST || report.reportDigest !== allikvereReportDigest(report) ||
      canonicalJson(report.uncoveredObligations) !== canonicalJson(ALLIKVERE_GLOBAL_GAPS)) return null;
    const expected = allikvereImportedScopes();
    for (let index = 0; index < 6; index++) {
      const { evidence, authorSurvivorListMatched, ...descriptor } = report.rows[index];
      if (canonicalJson(descriptor) !== canonicalJson(expected[index]) || !validateRetainedLrcModularEvidence(evidence, descriptor.scope, descriptor.rootContractDigest)) return null;
      if (descriptor.kind === "BINARY_FIBER" ? authorSurvivorListMatched !== true || !sameAllikvereResidueSets(evidence.primary.survivors.map((s) => s.residues), descriptor.authorSurvivors)
        : authorSurvivorListMatched !== null) return null;
      if (evidence.primary.totalTuples !== (descriptor.kind === "BINARY_FIBER" ? 8192 : 49)) return null;
    }
    return report;
  } catch { return null; }
}
