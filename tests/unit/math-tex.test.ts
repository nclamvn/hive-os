import { describe, expect, it } from "vitest";

import { parseMathText, parseResearchMathText } from "@/modules/research-sandbox/math-tex";

describe("explicit TeX parsing", () => {
  it("retains prose and recognizes inline and display math without rewriting source", () => {
    expect(parseMathText(String.raw`If \(a+b\) is even, $$a^2+b^2$$ follows.`)).toEqual([
      { kind: "text", value: "If " },
      { kind: "math", value: "a+b", source: String.raw`\(a+b\)`, display: false },
      { kind: "text", value: " is even, " },
      { kind: "math", value: "a^2+b^2", source: "$$a^2+b^2$$", display: true },
      { kind: "text", value: " follows." },
    ]);
  });

  it("leaves unmatched, escaped and currency delimiters as literal text", () => {
    const source = String.raw`Cost $20 and \$x stays literal; unfinished $a+b`;
    expect(parseMathText(source)).toEqual([{ kind: "text", value: source }]);
    const price = "Cost $20 and $30 today";
    expect(parseMathText(price)).toEqual([{ kind: "text", value: price }]);
  });

  it("does not parse expressions beyond the size ceiling", () => {
    const source = `$$${"x".repeat(2_001)}$$`;
    expect(parseMathText(source)).toEqual([{ kind: "text", value: source }]);
  });
});

describe("historical mathematical prose display", () => {
  it("typesets high-confidence spans from the sealed IMO proof without changing source", () => {
    const source = "Set c=ka−b. The equation a²+b²=k(ab+1) gives bc=a²−k. Since P(a)=(2−k)a²−k<0 and a≤b, we have c<a<b.";
    const segments = parseResearchMathText(source);
    expect(segments.filter((segment) => segment.kind === "math").map((segment) => segment.source)).toEqual([
      "c=ka−b", "a²+b²=k(ab+1)", "bc=a²−k", "P(a)=(2−k)a²−k<0", "a≤b", "c<a<b",
    ]);
    expect(segments.map((segment) => segment.kind === "math" ? segment.source : segment.value).join("")).toBe(source);
  });

  it("keeps explicit TeX, English prose, unsupported notation and digest labels intact", () => {
    const source = String.raw`Claim \(x^2+y^2\) follows from a²+b²=k(ab+1). SHA-256: abc123; no $20 fee.`;
    const segments = parseResearchMathText(source);
    expect(segments.filter((segment) => segment.kind === "math").map((segment) => segment.source)).toEqual([
      String.raw`\(x^2+y^2\)`, "a²+b²=k(ab+1)",
    ]);
    expect(segments.map((segment) => segment.kind === "math" ? segment.source : segment.value).join("")).toBe(source);
  });

  it("covers a complete archived Vieta-descent paragraph without changing its words", () => {
    const source = "Suppose a counterexample exists, and choose one with a+b minimal. Swap a and b if necessary so a≤b. Its quotient k is a positive nonsquare integer, hence k≥2. Set c=ka−b. The equation a²+b²=k(ab+1) gives bc=a²−k. If c=0, then k=a², a contradiction. If c<0, then b≥ka+1>k, while b(−c)=k−a²<k, also a contradiction. Thus c>0. Now P(t)=t²−kat+a²−k has roots b and c. Since P(a)=(2−k)a²−k<0 and a≤b, the factorization P(a)=(a−b)(a−c) implies c<a<b. Finally, P(c)=0 gives a²+c²=k(ac+1).";
    const segments = parseResearchMathText(source);
    const formulas = segments.filter((segment) => segment.kind === "math").map((segment) => segment.source);
    expect(formulas).toContain("P(a)=(a−b)(a−c)");
    expect(formulas).toContain("b≥ka+1>k");
    expect(formulas).toContain("a²+c²=k(ac+1)");
    expect(formulas.length).toBeGreaterThanOrEqual(15);
    expect(segments.map((segment) => segment.kind === "math" ? segment.source : segment.value).join("")).toBe(source);
  });

  it("keeps powers attached to parenthesized expressions", () => {
    const segments = parseResearchMathText("(nx)^2=p²x² and z=(N/d)y.");
    expect(segments.filter((segment) => segment.kind === "math").map((segment) => segment.source)).toEqual([
      "(nx)^2=p²x²", "z=(N/d)y",
    ]);
  });

  it("does not typeset prose hyphenation and keeps grouped digits and congruences legible", () => {
    const source = "A per-A audit tested 10,000,000<p≤20,000,000 and p≡1 (mod 840).";
    const segments = parseResearchMathText(source);
    expect(segments.filter((segment) => segment.kind === "math").map((segment) => segment.source)).toEqual([
      "10,000,000<p≤20,000,000", "p≡1 (mod 840)",
    ]);
    expect(segments.filter((segment) => segment.kind === "math").map((segment) => segment.value)).toEqual([
      "10{,}000{,}000<p\\le 20{,}000{,}000", "p\\equiv 1\\pmod{840}",
    ]);
  });
});
