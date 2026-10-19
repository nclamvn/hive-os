import { z } from "zod";
import type { AuthoringSection } from "./contracts";
import { checkUpdatePack, updatePackSchema, type UpdatePack } from "./update-pack";

// These are declared-input/calculation classifications, never source attestation.
// In particular, a TEST heading, APPENDIX kind, or literal MATCH grants nothing.
const empirical = /(?:đã\s+(?:đo|đạt|xác minh|kiểm chứng|thanh toán)|đo được|thực tế|thực địa|độ chính xác|hiệu năng|hiệu suất|đảm bảo|bảo đảm|\b(?:measured|observed|verified|actual(?:ly)?|paid|invoiced|billed|achiev(?:ed|es)|accuracy|performance|guarantee(?:d)?|field results?)\b)/iu;
const areaValue = /\s(?:ha|km[2²]|m[2²])$/iu;
const moneyValue = /\s(?:VND|USD)$/iu;

export function isDeclaredQuantity(sentence: string, match: RegExpMatchArray) {
  const before = sentence.slice(0, match.index);
  const after = sentence.slice(match.index! + match[0].length).split(";")[0];
  if (empirical.test(before.slice(before.lastIndexOf(";") + 1) + after)) return false;
  if (areaValue.test(match[0]) && /(?:diện tích (?:đầu vào|giả lập)(?: vẫn)?(?: là|:)|yêu cầu (?:thật )?ban đầu (?:chỉ )?nêu|(?:input|synthetic|simulated)(?: survey)? area(?: remains| is|:)|original (?:user )?(?:request|brief) (?:stated|specified))\s*$/iu.test(before)) return true;
  if (moneyValue.test(match[0]) && /(?:tổng (?:các dòng )?báo giá (?:thử|giả lập)(?: trước thuế)? (?:là|=)|(?:synthetic|simulated|test) quote (?:pre-tax )?total (?:is|=))\s*$/iu.test(before)) return true;
  // A local, explicitly synthetic quote/request may declare costs and area
  // operands. Never extend that scope to performance, time, percentages, or
  // another sentence. Actual/measured claims in the sentence prevent exemption.
  if (!areaValue.test(match[0]) && !moneyValue.test(match[0])) return false;
  const cue = /(?:(?:dự toán|báo giá|áp dụng) (?:giả lập|tổng hợp|thử)|(?:synthetic|simulated|test) (?:quote|budget)|apply (?:the )?(?:synthetic|simulated) quote)[^.!?\n:]{0,160}:/iu.exec(before);
  if (!cue) return false;
  const declaredPrefix = before.slice(cue.index + cue[0].length);
  const localPrefix = declaredPrefix.slice(Math.max(declaredPrefix.lastIndexOf(";"), declaredPrefix.lastIndexOf(",")) + 1).trim();
  // Later clauses need their own cost-input syntax. A header cannot turn
  // "supplier invoiced 900 USD" into a declared hypothetical price.
  return declaredPrefix.trim() === ""
    || moneyValue.test(match[0]) && (/[×*]\s*$|\bat\s*$/iu.test(localPrefix)
      || /(?:price|rate|costs?|budget|total|đơn giá|giá|dự toán|tổng)\s*(?:is|of|là|:|=)?\s*$/iu.test(localPrefix)
      || /(?:một|one|\d+)\s+(?:hạng mục|items?)\s*$/iu.test(localPrefix)
      || /^(?:loại|không cộng) (?:dòng|chi phí) [\p{L} -]{1,80}$/iu.test(localPrefix));
}

interface CalculationSpan { start: number; end: number; error: string | null; sourceExempt: boolean }
const numeric = String.raw`\d{1,15}(?:[.,]\d{1,3}){0,5}`;
const quantityUnit = String.raw`(?:km2|km²|m2|m²|ha|item|hạng mục)`;
const multiply = new RegExp(String.raw`(?<![\p{L}\p{N}.,])(${numeric})\s*(${quantityUnit})?\s*[×*]\s*(${numeric})\s*(VND|USD)(?:\s*\/\s*(${quantityUnit}))?\s*=\s*(${numeric})\s*\4(?![\p{L}\p{N}])`, "giu");
const addition = new RegExp(String.raw`(?<![\p{L}\p{N}.,])(${numeric}(?:\s*\+\s*${numeric}){1,7})\s*=\s*(${numeric})\s*(VND|USD)(?![\p{L}\p{N}])`, "giu");

function readNumber(raw: string, expression: string) {
  // Multiple grouped thousands establish the grouping character. Otherwise
  // accept plain integers or unambiguous <=2-place decimals, not locale guesses.
  const grouped = expression.match(/\d{1,3}([.,])\d{3}\1\d{3}(?!\d)/)?.[1];
  const value = grouped
    ? new RegExp(`^\\d{1,3}(?:\\${grouped}\\d{3})+$`).test(raw) ? Number(raw.split(grouped).join("")) : /^\d+$/.test(raw) ? Number(raw) : NaN
    : /^\d+(?:[.,]\d{1,2})?$/.test(raw) ? Number(raw.replace(",", ".")) : NaN;
  if (!Number.isFinite(value)) throw new Error("Ambiguous or unsupported number format");
  return value;
}

function unit(value: string | undefined): "item" | "ha" | "km2" | "m2" {
  return !value || /^(?:item|hạng mục)$/iu.test(value) ? "item" : value.toLowerCase().replace("²", "2") as "ha" | "km2" | "m2";
}

function costCheck(cost: UpdatePack["cost"]) {
  return checkUpdatePack({ schema: "hive-os.authoring-update.v1", documentId: "local-calculation", baseRevision: 1,
    request: "Review declared expression", sourceContext: "Expression operands, not verified data", unknowns: [],
    patches: [{ sectionKey: "expression", oldBody: "", newBody: "expression" }], cost, comparisons: [] });
}

/** Only two bounded, unit-aware cost expression forms, not a general evaluator. */
export function reviewDeclaredCalculations(sentence: string): CalculationSpan[] {
  const spans: CalculationSpan[] = [];
  const review = (match: RegExpMatchArray, build: () => UpdatePack["cost"]) => {
    let error: string | null = null;
    try {
      if (costCheck(build()).some((c) => c.status === "INVALID" || c.status === "MISMATCH")) error = match[0];
    } catch { error = match[0]; }
    // An empirical assertion may have correct arithmetic yet still need a
    // source. Only neutral/declared expressions lose the source warning.
    const start = match.index!, end = start + match[0].length;
    const clauseStart = sentence.lastIndexOf(";", start) + 1;
    const nextSeparator = sentence.indexOf(";", end);
    const clause = sentence.slice(clauseStart, nextSeparator < 0 ? sentence.length : nextSeparator);
    spans.push({ start, end, error, sourceExempt: !empirical.test(clause) });
  };
  for (const m of sentence.matchAll(multiply)) review(m, () => ({ currency: m[4].toUpperCase() as "VND" | "USD", claimedTotal: readNumber(m[6], m[0]),
    lines: [{ label: "Declared multiplication", quantity: readNumber(m[1], m[0]), quantityUnit: unit(m[2]), unitPrice: readNumber(m[3], m[0]), priceUnit: unit(m[5]), excludedReason: null }] }));
  for (const m of sentence.matchAll(addition)) review(m, () => ({ currency: m[3].toUpperCase() as "VND" | "USD", claimedTotal: readNumber(m[2], m[0]),
    lines: m[1].split(/\s*\+\s*/).map((n) => ({ label: "Declared summand", quantity: 1, quantityUnit: "item", unitPrice: readNumber(n, m[0]), priceUnit: "item", excludedReason: null })) }));
  return spans;
}

const evidenceSchema = updatePackSchema.omit({ patches: true }).extend({
  updatedSections: z.array(z.string().min(1).max(64)).min(1).max(20),
}).strict();

export function declaredEvidenceReview(section: AuthoringSection, sectionKeys: ReadonlySet<string>) {
  const unchanged = { text: section.body, invalid: false, calculationErrors: [] as string[] };
  if (section.kind !== "APPENDIX" || !section.body.includes('"hive-os.authoring-update.v1"')) return unchanged;
  if (section.body.length > 100_000) return { ...unchanged, invalid: true };
  try {
    const parts = section.body.split("\n\n");
    if (parts.length !== 3) throw new Error("Envelope boundaries changed");
    const evidence = evidenceSchema.parse(JSON.parse(parts[1]));
    if (new Set(evidence.updatedSections).size !== evidence.updatedSections.length || evidence.updatedSections.some((key) => key === section.key || !sectionKeys.has(key))) throw new Error("Unknown evidence target");
    const { updatedSections, ...common } = evidence;
    const checks = checkUpdatePack({ ...common, patches: updatedSections.map((key) => ({ sectionKey: key, oldBody: "", newBody: "declared" })) });
    const replay = checks.map((check) => `${check.status} | ${check.label}: ${check.detail}`).join("\n");
    if (checks.length ? parts[2] !== replay : !["No quantitative checks supplied.", "Không có phép kiểm định lượng được cung cấp."].includes(parts[2])) throw new Error("Check transcript does not match replay");
    // Scan every human/model string again, even in a schema-valid envelope.
    // Only typed numeric fields and replay-matching generated detail are
    // calculations/declarations. Labels, request, source and unknowns are NOT
    // trusted facts. The caller scans citations/tool traces in the ORIGINAL.
    return {
      text: [parts[0], evidence.request, evidence.sourceContext, ...evidence.unknowns,
        ...(evidence.cost?.lines.flatMap((line) => [line.label, line.excludedReason ?? ""]) ?? []),
        ...evidence.comparisons.map((comparison) => comparison.label)].join("\n"),
      invalid: false,
      calculationErrors: checks.filter((check) => check.status === "INVALID" || check.status === "MISMATCH").map((check) => `${check.label}: ${check.detail}`),
    };
  } catch { return { ...unchanged, invalid: true }; }
}
