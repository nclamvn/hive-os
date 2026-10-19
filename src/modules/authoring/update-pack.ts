import { z } from "zod";
import { authoringContentSchema, type AuthoringContent } from "./contracts";

const amount = z.number().finite().min(0).max(1_000_000_000).nullable();
const quantityUnit = z.enum(["item", "ha", "km2", "m2"]);
const measureUnit = z.enum(["cm", "m", "km", "ha", "km2", "m2"]);
export const updatePackSchema = z.object({
  schema: z.literal("hive-os.authoring-update.v1"),
  documentId: z.string().min(1).max(128),
  baseRevision: z.number().int().positive(),
  request: z.string().trim().min(1).max(2_000),
  sourceContext: z.string().trim().min(1).max(5_000),
  unknowns: z.array(z.string().trim().min(1).max(500)).max(20),
  patches: z.array(z.object({
    sectionKey: z.string().min(1).max(64),
    oldBody: z.string().max(100_000),
    newBody: z.string().max(100_000),
  }).strict()).min(1).max(20),
  cost: z.object({
    currency: z.enum(["VND", "USD"]),
    lines: z.array(z.object({
      label: z.string().trim().min(1).max(200), quantity: amount, quantityUnit,
      unitPrice: amount, priceUnit: quantityUnit,
      excludedReason: z.string().trim().min(1).max(500).nullable(),
    }).strict()).min(1).max(30),
    claimedTotal: z.number().finite().min(0).max(1_000_000_000_000).nullable(),
  }).strict().nullable(),
  comparisons: z.array(z.object({
    label: z.string().trim().min(1).max(200), measured: amount, unit: measureUnit,
    threshold: amount, thresholdUnit: measureUnit,
    operator: z.enum(["AT_MOST", "AT_LEAST"]),
  }).strict()).max(20),
}).strict();

export type UpdatePack = z.infer<typeof updatePackSchema>;
export interface UpdateCheck { label: string; status: "MATCH" | "MISMATCH" | "NOT_MET" | "UNKNOWN" | "INVALID" | "EXCLUDED"; detail: string }
const units: Record<string, { dimension: string; factor: number }> = {
  item: { dimension: "count", factor: 1 },
  cm: { dimension: "length", factor: 0.01 }, m: { dimension: "length", factor: 1 }, km: { dimension: "length", factor: 1_000 },
  m2: { dimension: "area", factor: 1 }, ha: { dimension: "area", factor: 10_000 }, km2: { dimension: "area", factor: 1_000_000 },
};
// Exact decimal interpretation of JSON numbers, with bounded unit factors.
// This avoids floating-point boundary errors such as 57 cm versus 0.57 m.
function fraction(value: number): [bigint, bigint] {
  const [mantissa, exponent = "0"] = String(value).split("e");
  const decimals = mantissa.split(".")[1]?.length ?? 0;
  const scale = decimals - Number(exponent);
  const numerator = BigInt(mantissa.replace(".", ""));
  return scale >= 0 ? [numerator, BigInt(10) ** BigInt(scale)] : [numerator * BigInt(10) ** BigInt(-scale), BigInt(1)];
}
function convertedFraction(value: number, from: string, to: string): [bigint, bigint] {
  if (units[from].dimension !== units[to].dimension) throw new Error("Incompatible units");
  const [n, d] = fraction(value), [fn, fd] = fraction(units[from].factor), [tn, td] = fraction(units[to].factor);
  return [n * fn * td, d * fd * tn];
}
const cents = (n: bigint, d: bigint) => (n * BigInt(200) + d) / (BigInt(2) * d);

/** Bounded reviewer assistance only. Inputs are declarations, not verified measurements. */
export function checkUpdatePack(raw: unknown): UpdateCheck[] {
  const pack = updatePackSchema.parse(raw);
  const checks: UpdateCheck[] = [];
  if (pack.cost) {
    let totalCents = BigInt(0);
    let unknown = false;
    let invalid = false;
    for (const line of pack.cost.lines) {
      if (line.excludedReason) {
        checks.push({ label: line.label, status: "EXCLUDED", detail: line.excludedReason });
        continue;
      }
      if (units[line.quantityUnit].dimension !== units[line.priceUnit].dimension) {
        invalid = true;
        checks.push({ label: line.label, status: "INVALID", detail: "Incompatible quantity / price units" });
      } else if (line.quantity === null || line.unitPrice === null) {
        unknown = true;
        checks.push({ label: line.label, status: "UNKNOWN", detail: "Missing quantity or unit price; not counted as zero" });
      } else {
        const [qn, qd] = convertedFraction(line.quantity, line.quantityUnit, line.priceUnit);
        const [pn, pd] = fraction(line.unitPrice);
        const lineCents = cents(qn * pn, qd * pd);
        const value = Number(lineCents) / 100;
        if (lineCents > BigInt(100_000_000_000_000)) {
          invalid = true;
          checks.push({ label: line.label, status: "INVALID", detail: "Cost exceeds 1e12 limit" });
        } else {
          totalCents += lineCents;
          checks.push({ label: line.label, status: "MATCH", detail: `${line.quantity} ${line.quantityUnit} × ${line.unitPrice} ${pack.cost.currency}/${line.priceUnit} = ${value} ${pack.cost.currency}` });
        }
      }
    }
    if (totalCents > BigInt(100_000_000_000_000)) invalid = true;
    const total = Number(totalCents) / 100;
    const claimed = pack.cost.claimedTotal === null ? null : cents(...fraction(pack.cost.claimedTotal));
    checks.push({ label: `Total (${pack.cost.currency})`,
      status: invalid ? "INVALID" : claimed === null ? "UNKNOWN" : unknown ? "MISMATCH" : claimed === totalCents ? "MATCH" : "MISMATCH",
      detail: `${unknown ? "Known subtotal only" : "Calculated"}: ${total}; claimed: ${pack.cost.claimedTotal ?? "unknown"}. Two-decimal rounding per line, then sum.`,
    });
  }
  for (const c of pack.comparisons) {
    if (units[c.unit].dimension !== units[c.thresholdUnit].dimension) {
      checks.push({ label: c.label, status: "INVALID", detail: "Incompatible measurement / threshold units" });
    } else if (c.measured === null || c.threshold === null) {
      checks.push({ label: c.label, status: "UNKNOWN", detail: "Measurement or threshold not supplied; no acceptance claim" });
    } else {
      const [n, d] = convertedFraction(c.measured, c.unit, c.thresholdUnit);
      const [tn, td] = fraction(c.threshold);
      const value = Number(n) / Number(d);
      const matches = c.operator === "AT_MOST" ? n * td <= tn * d : n * td >= tn * d;
      checks.push({ label: c.label, status: matches ? "MATCH" : "NOT_MET", detail: `${c.measured} ${c.unit} = ${value} ${c.thresholdUnit}; ${c.operator === "AT_MOST" ? "≤" : "≥"} ${c.threshold} ${c.thresholdUnit}` });
    }
  }
  return checks;
}

export function parseUpdatePack(text: string): UpdatePack {
  if (text.length > 1_000_000) throw new Error("Update pack exceeds 1,000,000 characters");
  return updatePackSchema.parse(JSON.parse(text));
}

export function prepareAuthoringUpdate(raw: unknown, content: AuthoringContent, documentId: string, revision: number, locale: "en" | "vi", canWrite: boolean) {
  if (!canWrite) throw new Error(locale === "vi" ? "Không có quyền sửa tài liệu." : "Document write permission is required.");
  const pack = updatePackSchema.parse(raw);
  if (pack.documentId !== documentId || pack.baseRevision !== revision) throw new Error(locale === "vi" ? "Sai tài liệu hoặc phiên bản gốc." : "Document or base revision mismatch.");
  const keys = new Set<string>();
  for (const patch of pack.patches) {
    if (keys.has(patch.sectionKey)) throw new Error(`Duplicate section: ${patch.sectionKey}`);
    keys.add(patch.sectionKey);
    const section = content.sections.find((s) => s.key === patch.sectionKey);
    if (!section) throw new Error(`Unknown section: ${patch.sectionKey}`);
    if (section.body !== patch.oldBody) throw new Error(`Stale section: ${patch.sectionKey}`);
    if (patch.newBody === patch.oldBody) throw new Error(`Unchanged section: ${patch.sectionKey}`);
  }
  const checks = checkUpdatePack(pack);
  let appendixKey = `update-evidence-r${revision + 1}`;
  for (let i = 2; content.sections.some((s) => s.key === appendixKey); i++) appendixKey = `update-evidence-r${revision + 1}-${i}`;
  const heading = locale === "vi" ? "Phụ lục cập nhật: đầu vào và kiểm tra khai báo" : "Update appendix: declared inputs and checks";
  const limits = locale === "vi"
    ? "Kịch bản/đầu vào do người dùng hoặc Codex cung cấp, chưa xác minh độc lập. Kiểm số học không xác nhận dữ liệu thực địa, hiệu lực báo giá, phê duyệt thương mại hoặc nghiệm thu kỹ thuật. Các giá trị chưa biết không được tính là 0."
    : "Scenario/inputs supplied by the user or Codex, not independently verified. Arithmetic does not verify field data, quotation validity, commercial approval or technical acceptance. Unknown values are not zero.";
  const evidence = { schema: pack.schema, documentId, baseRevision: revision, request: pack.request, sourceContext: pack.sourceContext, unknowns: pack.unknowns, updatedSections: pack.patches.map((p) => p.sectionKey), cost: pack.cost, comparisons: pack.comparisons };
  const appendix = { key: appendixKey, heading, kind: "APPENDIX" as const,
    body: `${limits}\n\n${JSON.stringify(evidence, null, 2)}\n\n${checks.length ? checks.map((c) => `${c.status} | ${c.label}: ${c.detail}`).join("\n") : (locale === "vi" ? "Không có phép kiểm định lượng được cung cấp." : "No quantitative checks supplied.")}` };
  const next = authoringContentSchema.parse({ ...content, sections: [...content.sections.map((s) => {
    const patch = pack.patches.find((p) => p.sectionKey === s.key);
    return patch ? { ...s, body: patch.newBody } : s;
  }), appendix] });
  const blocked = checks.some((c) => c.status === "INVALID" || c.status === "MISMATCH");
  const summary = `${locale === "vi" ? "Cập nhật có hỗ trợ" : "Assisted update"} r${revision}: ${pack.request.slice(0, 400)} | ${pack.sourceContext.slice(0, 150)} | ${pack.patches.length} sections | ${checks.filter((c) => c.status === "MATCH").length} MATCH, ${checks.filter((c) => c.status === "UNKNOWN").length} UNKNOWN, ${checks.filter((c) => c.status === "NOT_MET").length} NOT_MET | ${appendixKey}`;
  return { pack, next, appendix, checks, blocked, summary };
}

export function applyAuthoringUpdate(raw: unknown, content: AuthoringContent, documentId: string, revision: number, locale: "en" | "vi", canWrite: boolean) {
  const result = prepareAuthoringUpdate(raw, content, documentId, revision, locale, canWrite);
  if (result.blocked) throw new Error(locale === "vi" ? "Sửa phép kiểm sai/không hợp lệ trước khi áp dụng." : "Correct mismatched or invalid checks before applying.");
  return result;
}
