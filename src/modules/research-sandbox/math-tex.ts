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
    if (/^[A-Z]{2,3}-\d+$/.test(raw) || /^\d+-(?:gon|gons)$/i.test(raw)) continue;
    if (/^[A-Za-z]{2,3}-[A-Za-z]$/.test(raw)) continue;
    if (/^(?:for|to|and)\d*(?:[/*−+\-]|$)/i.test(raw) || /[−\-](?:to|for)\d/.test(raw)) continue;
    if (index > last) segments.push({ kind: "text", value: source.slice(last, index) });
    segments.push({ kind: "math", value: legacyToTeX(raw), source: raw, display: false });
    last = index + raw.length;
    count++;
  }
  if (last < source.length) segments.push({ kind: "text", value: source.slice(last) });
  return segments;
}

// One bounded legacy notation family, not a general expression parser. Recognize
// the entire modular-distance inequality before the simple-expression adapter;
// otherwise that adapter would render disconnected fragments of its arguments.
const modularDistance = /^([A-Za-z])\s*[*×]\s*min\(\s*([A-Za-z])\s*[*×]\s*([A-Za-z])\s+mod\s+([A-Za-z])\s*,\s*\4\s*[-−]\s*\2\s*[*×]\s*\3\s+mod\s+\4\s*\)\s*(?:>=|≥)\s*\4$/;
const legacySpecialSpan = /```[\s\S]*?(?:```|$)|`[^`\n]*`|https?:\/\/[^\s<>]+|<\/?[A-Za-z](?:[^<>"']|"[^"]*"|'[^']*')*>|(?<![\p{L}\p{N}_])(?:[A-Za-z]\s*[*×]\s*min\([^()\n]{0,180}\)(?:\s*(?:>=|≥|<=|≤|>|=)\s*[A-Za-z0-9_]+(?:\s*[-+*/×−]\s*[A-Za-z0-9_]+)*)?|[A-Za-z]\s*[*×]\s*min\([^\n.]{0,180}(?=$|\n|\.)|[A-Za-z]\s+in\s+0\s*\.\.\s*[A-Za-z]\s*[-−]\s*1)(?![\p{L}\p{N}_])/gu;

function historicalSegments(source: string): MathTextSegment[] {
  const segments: MathTextSegment[] = [];
  let last = 0;
  for (const match of source.matchAll(legacySpecialSpan)) {
    segments.push(...legacySegments(source.slice(last, match.index)));
    const raw = match[0];
    const distance = raw.length <= MAX_LEGACY_EXPRESSION_LENGTH ? modularDistance.exec(raw) : null;
    const range = /^([A-Za-z])\s+in\s+0\s*\.\.\s*([A-Za-z])\s*[-−]\s*1$/.exec(raw);
    if (distance) {
      const [, scale, time, speed, modulus] = distance;
      const residue = `${time}\\cdot ${speed}\\bmod ${modulus}`;
      segments.push({ kind: "math", source: raw, display: false,
        value: `${scale}\\cdot\\min\\left(${residue},${modulus}-${residue}\\right)\\ge ${modulus}` });
    } else if (range) {
      segments.push({ kind: "math", source: raw, display: false,
        value: `${range[1]}\\in\\{0,\\ldots,${range[2]}-1\\}` });
    } else {
      // Unsupported members and non-mathematical URLs/tags/code stay literal.
      segments.push({ kind: "text", value: raw });
    }
    last = match.index + raw.length;
  }
  segments.push(...legacySegments(source.slice(last)));
  return segments;
}

/** Presentation-only adapter for historical records without TeX delimiters. */
export function parseResearchMathText(source: string): MathTextSegment[] {
  const result: MathTextSegment[] = [];
  for (const segment of parseMathText(source).flatMap((part) => part.kind === "text" ? historicalSegments(part.value) : [part])) {
    const previous = result.at(-1);
    if (previous?.kind === "text" && segment.kind === "text") previous.value += segment.value;
    else result.push(segment);
  }
  return result;
}

/** Display-only split for legacy exact-benchmark attempts that embedded Python
 * in their argument instead of the sealed computationPython field. */
export function splitExactBenchmarkArgument(source: string): { prose: string; embeddedCode: string | null } {
  const marker = /\n\n(?=(?:from\s+[A-Za-z][\w.]*\s+import\s+|import\s+[A-Za-z][\w.]*\s*|def\s+[A-Za-z_]\w*\s*\())/g;
  for (const match of source.matchAll(marker)) {
    const candidate = source.slice(match.index + match[0].length);
    if (/^def\s+answer\s*\(/m.test(candidate)) {
      return { prose: source.slice(0, match.index).trimEnd(), embeddedCode: candidate };
    }
  }
  return { prose: source, embeddedCode: null };
}
