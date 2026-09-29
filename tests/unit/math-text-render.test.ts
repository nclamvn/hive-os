import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { MathText } from "@/components/research/math-text";

describe("research math renderer", () => {
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
});
