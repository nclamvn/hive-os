import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { MathText } from "@/components/research/math-text";
import { splitExactBenchmarkArgument } from "@/modules/research-sandbox/math-tex";

describe("research math renderer", () => {
  it("renders the compound grid expression as one accessible, keyboard-scrollable formula", () => {
    const text = "N*min(j*u mod M,M-j*u mod M)>=M";
    const html = renderToStaticMarkup(createElement(MathText, { text }));
    expect((html.match(/<math\b/g) ?? [])).toHaveLength(1);
    expect(html).toContain('tabindex="0"');
    expect(html).toContain("min");
    expect(html).toContain("mod");
    expect(html).toContain("≥");
    expect(html).toContain('title="N*min(j*u mod M,M-j*u mod M)&gt;=M"');
    const short = renderToStaticMarkup(createElement(MathText, { text: "N=6" }));
    expect(short).not.toContain("tabindex");
  });

  it("renders explicit TeX with accessible MathML and preserves escaped prose", () => {
    const html = renderToStaticMarkup(createElement(MathText,
      { text: String.raw`For \(a^2+b^2\), <script>bad()</script>` }));
    expect(html).toContain("katex");
    expect(html).toContain("<math");
    expect(html).toContain("&lt;script&gt;bad()&lt;/script&gt;");
    expect(html).not.toContain("<script>");
  });

  it("falls back to the literal source for unsupported TeX commands", () => {
    const html = renderToStaticMarkup(createElement(MathText,
      { text: String.raw`\(\includegraphics{https://example.invalid/x}\)` }));
    expect(html).toContain("includegraphics");
    expect(html).not.toContain("<img");
  });

  it("renders archived Unicode equations as accessible mathematics and leaves prose escaped", () => {
    const source = "For a²+b²=k(ab+1), <script>bad()</script> is not a proof.";
    const html = renderToStaticMarkup(createElement(MathText, { text: source }));
    expect(html).toContain("<math");
    expect(html).toContain("a²+b²=k(ab+1)");
    expect(html).toContain("&lt;script&gt;bad()&lt;/script&gt;");
    expect(html).not.toContain("<script>");
  });

  it("keeps the geometric word 101-gon as prose rather than subtraction", () => {
    const html = renderToStaticMarkup(createElement(MathText,
      { text: "Draw diagonals of a regular 101-gon." }));
    expect(html).toContain("101-gon");
    expect(html).not.toContain("<math");
  });

  it("keeps Python source out of legacy math rendering without changing the sealed text", () => {
    const source = "The expected perimeter is E=101(I_s+p sum I_k).\n\nfrom decimal import Decimal\n\ndef answer():\n    return 7*11";
    const display = splitExactBenchmarkArgument(source);
    expect(display.prose).toContain("E=101");
    expect(display.embeddedCode).toContain("def answer():");
    expect(display.prose + "\n\n" + display.embeddedCode).toBe(source);
    expect(splitExactBenchmarkArgument("A proof can mention import statements in prose.").embeddedCode).toBeNull();
  });
});
