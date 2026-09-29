import katex from "katex";

import { parseResearchMathText } from "@/modules/research-sandbox/math-tex";

/** Rendering only: the raw TeX in the sealed research record is never changed. */
export function MathText({ text, className = "" }: { text: string; className?: string }) {
  return <span className={`math-rich-text whitespace-pre-wrap break-words ${className}`}>
    {parseResearchMathText(text).map((segment, index) => {
      if (segment.kind === "text") return <span key={index}>{segment.value}</span>;
      try {
        const html = katex.renderToString(segment.value, {
          displayMode: segment.display,
          output: "htmlAndMathml",
          trust: false,
          strict: "warn",
          maxExpand: 100,
          maxSize: 10,
          throwOnError: true,
        });
        return <span key={index} className={segment.display ? "math-tex-block" : "math-tex-inline"}
          title={segment.source} dangerouslySetInnerHTML={{ __html: html }} />;
      } catch {
        return <span key={index} title="Invalid or unsupported TeX">{segment.source}</span>;
      }
    })}
  </span>;
}
