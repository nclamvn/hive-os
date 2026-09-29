export type MathTextSegment =
  | { kind: "text"; value: string }
  | { kind: "math"; value: string; source: string; display: boolean };

const MAX_EXPRESSION_LENGTH = 2_000;
const MAX_LEGACY_EXPRESSION_LENGTH = 180;
const MAX_LEGACY_SEGMENTS = 100;

// A deliberately small grammar for archived ASCII/Unicode mathematical prose.
// Long identifiers, arbitrary TeX, natural-language words and nested parentheses
// are outside it: in doubt, keep the source as text instead of guessing notation.
const legacyParenthesis = String.raw`\([A-Za-z0-9²³⁴^+−*/×]{1,24}\)`;
const legacyAtom = String.raw`(?:[A-Za-z]{1,3}(?:\d+)?(?:${legacyParenthesis})?|\d+(?:,\d{3})*[A-Za-z]{0,2}|${legacyParenthesis})(?:[²³⁴]|\^\d+)?`;
const legacyFactor = String.raw`(?:${legacyParenthesis}${legacyAtom}|(?:[A-Za-z](?:[²³⁴]|\^\d+)){2,3}|${legacyAtom})`;
const legacyOperator = String.raw`[+−\-×*/=<>≤≥≡]`;
const legacyExpression = new RegExp(
  String.raw`(?<![\p{L}\p{N}_])${legacyFactor}(?:\s*${legacyOperator}\s*${legacyFactor})+(?:\s*\(mod\s+\d+\))?(?![\p{L}\p{N}_])`,
  "gu",
);

function escaped(source: string, index: number): boolean {
  let slashes = 0;
  for (let cursor = index - 1; cursor >= 0 && source[cursor] === "\\"; cursor--) slashes++;
  return slashes % 2 === 1;
}

/** Parse only explicit TeX delimiters. Prose and malformed expressions stay verbatim. */
export function parseMathText(source: string): MathTextSegment[] {
  const segments: MathTextSegment[] = [];
  let textStart = 0;
  let index = 0;
  while (index < source.length) {
    if (escaped(source, index)) { index++; continue; }
    const delimiter = source.startsWith("$$", index) ? ["$$", "$$", true] as const
      : source.startsWith("\\[", index) ? ["\\[", "\\]", true] as const
      : source.startsWith("\\(", index) ? ["\\(", "\\)", false] as const
      : source[index] === "$" ? ["$", "$", false] as const : null;
    if (!delimiter) { index++; continue; }
    const [open, close, display] = delimiter;
    const start = index + open.length;
    let end = source.indexOf(close, start);
    while (end >= 0 && escaped(source, end)) end = source.indexOf(close, end + close.length);
    const body = end >= 0 ? source.slice(start, end) : "";
    if (end < 0 || !body.trim() || body.length > MAX_EXPRESSION_LENGTH ||
      (!display && open === "$" && (/^\s|\s$/.test(body) || /^\d+(?:[.,]\d+)?$/.test(body) ||
        (/^\d/.test(body) && /\s/.test(body))))) {
      index += open.length;
      continue;
    }
    if (index > textStart) segments.push({ kind: "text", value: source.slice(textStart, index) });
    segments.push({ kind: "math", value: body, source: source.slice(index, end + close.length), display });
    index = end + close.length;
    textStart = index;
  }
  if (textStart < source.length) segments.push({ kind: "text", value: source.slice(textStart) });
  return segments;
}

function legacyToTeX(source: string): string {
  return source
    .replaceAll("²", "^2").replaceAll("³", "^3").replaceAll("⁴", "^4")
    .replaceAll("−", "-").replaceAll("≤", String.raw`\le `)
    .replaceAll("≥", String.raw`\ge `).replaceAll("≡", String.raw`\equiv `)
    .replaceAll("×", String.raw`\times `)
    .replace(/(?<=\d),(?=\d{3}(?:\D|$))/g, "{,}")
    .replace(/\s*\(mod\s+(\d+)\)/g, (_, modulus: string) => String.raw`\pmod{${modulus}}`);
}

function legacySegments(source: string): MathTextSegment[] {
  const segments: MathTextSegment[] = [];
  let last = 0;
  let count = 0;
  legacyExpression.lastIndex = 0;
  for (const match of source.matchAll(legacyExpression)) {
    if (count >= MAX_LEGACY_SEGMENTS) break;
    const raw = match[0];
    const index = match.index;
    if (raw.length > MAX_LEGACY_EXPRESSION_LENGTH) continue;
    const angleOpen = source.lastIndexOf("<", index);
    const angleClose = source.lastIndexOf(">", index);
    if (angleOpen > angleClose) {
      const tagEnd = source.indexOf(">", angleOpen);
      if (tagEnd >= index && /^<\/?[A-Za-z][^<>]*>$/.test(source.slice(angleOpen, tagEnd + 1))) continue;
    }
    // A bare hyphen between an abbreviation and a number is not math.
    if (/^[A-Z]{2,3}-\d+$/.test(raw)) continue;
    if (/^[A-Za-z]{2,3}-[A-Za-z]$/.test(raw)) continue;
    if (index > last) segments.push({ kind: "text", value: source.slice(last, index) });
    segments.push({ kind: "math", value: legacyToTeX(raw), source: raw, display: false });
    last = index + raw.length;
    count++;
  }
  if (last < source.length) segments.push({ kind: "text", value: source.slice(last) });
  return segments;
}

/** Presentation-only adapter for historical records without TeX delimiters. */
export function parseResearchMathText(source: string): MathTextSegment[] {
  return parseMathText(source).flatMap((segment) => segment.kind === "text" ? legacySegments(segment.value) : [segment]);
}
