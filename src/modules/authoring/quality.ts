import type {
  AuthoringCitation,
  AuthoringContent,
  AuthoringDocumentType,
  AuthoringQualityReport,
} from "./contracts";

type Issue = AuthoringQualityReport["issues"][number];

// Derived, not persisted: legacy v1 reports remain readable and unchanged.
const STYLE_CODES = new Set([
  "EM_DASH_FORBIDDEN", "EN_DASH_REVIEW", "AI_SLOP_PHRASE", "PARAGRAPH_TOO_DENSE",
  "AI_DISCLOSURE_TRACE",
]);

export function authoringIssueCategory(code: string): "CONTENT" | "STYLE" {
  return STYLE_CODES.has(code) ? "STYLE" : "CONTENT";
}

const AI_SLOP_PATTERNS: readonly RegExp[] = [
  /\bdelve(?:s|d)?\b/i,
  /\bgame[- ]changer\b/i,
  /\bin today'?s fast[- ]paced (?:world|landscape)\b/i,
  /\bseamlessly\b/i,
  /\bunlock(?:ing|s)? the potential\b/i,
  /\bnot only\b[^.!?]{0,120}\bbut also\b/i,
  /\bđóng vai trò (?:vô cùng |hết sức )?quan trọng\b/i,
  /\bbức tranh toàn cảnh\b/i,
  /\btrong bối cảnh hiện nay\b/i,
  /\bkhông chỉ\b[^.!?]{0,120}\bmà còn\b/i,
  /\bmang tính (?:đột phá|cách mạng)\b/i,
  /\btối ưu hóa một cách toàn diện\b/i,
];

const VAGUE_AUTHORITY =
  /\b(?:các chuyên gia|nhiều nghiên cứu|giới chuyên môn|researchers|experts|studies) (?:cho rằng|chỉ ra|khẳng định|show|suggest|agree|believe)\b/i;
const UNSUPPORTED_CERTAINTY =
  /(?<![\p{L}\p{N}])(?:chắc chắn|hoàn toàn|tuyệt đối|không có rủi ro|(?:đảm bảo|bảo đảm) 100%|guarantee(?:d|s)?|without risk|certainly|undeniably)(?![\p{L}\p{N}])/giu;
const TOOL_TRACE = /(?:turn\d+(?:search|fetch)\d+|:codex-file-citation|\[tool\]|<tool_call>)/i;
const QUANTITATIVE_CLAIM =
  /(?<![\p{L}\p{N}])\d+(?:[.,]\d+)*\s*(?:%|ha|km[2²]?|m[2²]|usd|vnd|tỷ|triệu|nghìn|giờ|ngày|tháng|năm|hours?|days?|years?)(?![\p{L}\p{N}])/giu;
const CITATION_MARKER = /\[@([A-Za-z0-9][A-Za-z0-9_.:-]{0,63})\]/g;

function isLocallyNegated(before: string) {
  return /(?:\b(?:not|never|cannot|can't|isn't|aren't|wasn't|weren't)(?: be)?|(?:không|chưa)(?: thể)?(?: được| đại diện)?)\s+$/iu.test(before);
}

function certaintyNeedsReview(value: string, match: RegExpMatchArray) {
  const before = value.slice(0, match.index);
  // Technical coordinate accuracy is not a promise of absolute certainty.
  if (match[0].toLowerCase() === "tuyệt đối" && /độ chính xác(?: đứng| ngang| tọa độ)?\s+$/iu.test(before)) return false;
  // Only local negated constructions are recognized. Later positive claims
  // are independently inspected, even within the same sentence.
  return !isLocallyNegated(before);
}

function isNegatedFullGuarantee(value: string, match: RegExpMatchArray) {
  if (!/^100(?:[.,]0+)?\s*%$/u.test(match[0])) return false;
  const before = value.slice(0, match.index);
  const guarantee = /(?:guarantee(?:d|s)?|đảm bảo|bảo đảm)\s*$/iu.exec(before);
  return Boolean(guarantee && isLocallyNegated(before.slice(0, guarantee.index)))
    || /^\s+(?:is|are) not guaranteed\b/iu.test(value.slice((match.index ?? 0) + match[0].length));
}

function isAttributedInput(value: string, match: RegExpMatchArray) {
  const before = value.slice(0, match.index);
  const after = value.slice((match.index ?? 0) + match[0].length);
  // Input provenance, not evidence of a measured result. No whole-sentence
  // exemption: an adjacent performance claim cannot inherit attribution.
  return /(?:theo (?:đầu vào|thông tin) (?:của |do )?người dùng(?: cung cấp)?,?\s*(?:diện tích(?: khảo sát)?|phạm vi) (?:là|khoảng)|according to (?:the )?user(?:'s)? input,?\s*(?:the )?(?:survey area|area|scope) (?:is|of)|user[- ]provided (?:survey area|area|scope)[: ])\s*$/iu.test(before)
    || /^\s*\((?:theo đầu vào của người dùng|user[- ]provided input)\)/iu.test(after);
}

function excerpt(value: string, index = 0) {
  return value
    .slice(Math.max(0, index - 80), Math.min(value.length, index + 180))
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 280);
}

function addPatternIssues(
  issues: Issue[],
  sectionKey: string | null,
  value: string,
) {
  for (const match of value.matchAll(/\u2014/g)) {
    issues.push({
      code: "EM_DASH_FORBIDDEN",
      severity: "NOTE",
      sectionKey,
      excerpt: excerpt(value, match.index),
    });
  }
  for (const match of value.matchAll(/\u2013/g)) {
    issues.push({
      code: "EN_DASH_REVIEW",
      severity: "NOTE",
      sectionKey,
      excerpt: excerpt(value, match.index),
    });
  }
  if (TOOL_TRACE.test(value)) {
    issues.push({
      code: "TOOL_TRACE_LEAK",
      severity: "BLOCKER",
      sectionKey,
      excerpt: excerpt(value, value.search(TOOL_TRACE)),
    });
  }
  for (const pattern of AI_SLOP_PATTERNS) {
    const index = value.search(pattern);
    if (index >= 0) {
      issues.push({
        code: "AI_SLOP_PHRASE",
        severity: "NOTE",
        sectionKey,
        excerpt: excerpt(value, index),
      });
    }
  }
  const authorityIndex = value.search(VAGUE_AUTHORITY);
  if (authorityIndex >= 0) {
    issues.push({
      code: "VAGUE_AUTHORITY",
      severity: "WARNING",
      sectionKey,
      excerpt: excerpt(value, authorityIndex),
    });
  }
  for (const match of value.matchAll(UNSUPPORTED_CERTAINTY)) {
    if (certaintyNeedsReview(value, match)) {
      issues.push({ code: "UNSUPPORTED_CERTAINTY", severity: "WARNING", sectionKey, excerpt: excerpt(value, match.index) });
    }
  }
}

function citationKeys(value: string): string[] {
  return [...value.matchAll(CITATION_MARKER)].map((match) =>
    match[1].toLowerCase(),
  );
}

function addCitationIssues(
  issues: Issue[],
  sectionKey: string,
  body: string,
  citations: readonly AuthoringCitation[],
) {
  const defined = new Set(citations.map((citation) => citation.key.toLowerCase()));
  for (const key of citationKeys(body)) {
    if (!defined.has(key)) {
      issues.push({
        code: "UNRESOLVED_CITATION",
        severity: "BLOCKER",
        sectionKey,
        excerpt: `[@${key}]`,
      });
    }
  }

  const sentences = body.split(/(?<=[.!?])\s+|\n+/).filter(Boolean);
  for (const sentence of sentences) {
    const unsupported = [...sentence.matchAll(QUANTITATIVE_CLAIM)].find(
      (match) => !isAttributedInput(sentence, match) && !isNegatedFullGuarantee(sentence, match),
    );
    if (unsupported && citationKeys(sentence).length === 0) {
      issues.push({
        code: "QUANTITATIVE_CLAIM_UNSOURCED",
        severity: "WARNING",
        sectionKey,
        excerpt: excerpt(sentence, unsupported.index),
      });
    }
    if (VAGUE_AUTHORITY.test(sentence) && citationKeys(sentence).length === 0) {
      issues.push({
        code: "AUTHORITY_CLAIM_UNSOURCED",
        severity: "BLOCKER",
        sectionKey,
        excerpt: excerpt(sentence),
      });
    }
  }
}

function addStructureIssues(
  issues: Issue[],
  type: AuthoringDocumentType,
  content: AuthoringContent,
) {
  const keys = new Set(content.sections.map((section) => section.key));
  const required: Partial<Record<AuthoringDocumentType, readonly string[]>> = {
    RESEARCH_PROPOSAL: ["methodology", "risk-limitations", "references"],
    RESEARCH_PAPER: ["methodology", "risk-limitations", "references"],
    TECHNICAL_PROPOSAL: ["verification", "risk-limitations"],
    CLIENT_PROPOSAL: ["acceptance", "risk-limitations"],
    COURSE_DOSSIER: ["outcomes", "assessment", "quality"],
  };
  for (const key of required[type] ?? ["risk-limitations"]) {
    if (!keys.has(key)) {
      issues.push({
        code: "RESPONSIBILITY_SECTION_MISSING",
        severity: "BLOCKER",
        sectionKey: null,
        excerpt: key,
      });
    }
  }
  for (const section of content.sections) {
    if (!section.body.trim()) {
      issues.push({
        code: "SECTION_EMPTY",
        severity: "BLOCKER",
        sectionKey: section.key,
        excerpt: section.heading,
      });
    }
    const paragraphs = section.body.split(/\n{2,}/);
    for (const paragraph of paragraphs) {
      const words = paragraph.trim().split(/\s+/).filter(Boolean).length;
      if (words > 220) {
        issues.push({
          code: "PARAGRAPH_TOO_DENSE",
          severity: "NOTE",
          sectionKey: section.key,
          excerpt: excerpt(paragraph),
        });
      }
    }
  }
}

export function assessAuthoringQuality(
  type: AuthoringDocumentType,
  content: AuthoringContent,
): AuthoringQualityReport {
  const issues: Issue[] = [];
  addPatternIssues(issues, null, `${content.title}\n${content.abstract}`);
  for (const section of content.sections) {
    addPatternIssues(issues, section.key, `${section.heading}\n${section.body}`);
    addCitationIssues(issues, section.key, section.body, content.citations);
  }
  addStructureIssues(issues, type, content);

  const used = new Set(
    content.sections.flatMap((section) => citationKeys(section.body)),
  );
  for (const citation of content.citations) {
    if (!used.has(citation.key.toLowerCase())) {
      issues.push({
        code: "CITATION_UNUSED",
        severity: "NOTE",
        sectionKey: null,
        excerpt: citation.key,
      });
    }
  }

  const contentIssues = issues.filter((issue) => authoringIssueCategory(issue.code) === "CONTENT");
  const blockerCount = contentIssues.filter((issue) => issue.severity === "BLOCKER").length;
  const warningCount = contentIssues.filter((issue) => issue.severity === "WARNING").length;
  const noteCount = issues.filter((issue) => issue.severity === "NOTE").length;
  const contentNoteCount = contentIssues.filter((issue) => issue.severity === "NOTE").length;
  const score = Math.max(0, 100 - blockerCount * 18 - warningCount * 5 - contentNoteCount);
  return {
    schema: "hive-os.authoring-quality.v1",
    status: blockerCount > 0 ? "FAIL" : warningCount > 0 ? "REVIEW" : "PASS",
    score,
    blockerCount,
    warningCount,
    noteCount,
    citedMarkerCount: content.sections.reduce(
      (count, section) => count + citationKeys(section.body).length,
      0,
    ),
    definedCitationCount: content.citations.length,
    issues,
  };
}

export function containsForbiddenPublishingTrace(content: AuthoringContent) {
  return assessAuthoringQuality("OTHER", content).issues.some(
    (issue) =>
      issue.severity === "BLOCKER" &&
      issue.code === "TOOL_TRACE_LEAK",
  );
}
