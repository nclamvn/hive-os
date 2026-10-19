import * as fs from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { describe, expect, it, vi } from "vitest";

import {
  authoringContentSchema,
  qualityReportSchema,
  type AuthoringContent,
} from "@/modules/authoring/contracts";
import { hashAuthoringContent } from "@/modules/authoring/content-hash";
import { diffAuthoringContent } from "@/modules/authoring/diff";
import {
  renderAuthoringDocx,
  renderAuthoringPdf,
} from "@/modules/authoring/export";
import { assessAuthoringQuality, authoringIssueCategory, containsForbiddenPublishingTrace } from "@/modules/authoring/quality";

vi.mock("node:fs", { spy: true });

function publishableContent(): AuthoringContent {
  return {
    title: "Đề án giám sát rừng bằng UAV",
    abstract:
      "Tài liệu xác định phạm vi khảo sát, phương pháp kiểm chứng và trách nhiệm nghiệm thu.",
    sections: [
      {
        key: "context",
        heading: "Bối cảnh và mục tiêu",
        kind: "NARRATIVE",
        body: "Mục tiêu là lập hồ sơ hiện trạng có thể truy nguyên cho khu vực khảo sát [@source-1].",
      },
      {
        key: "methodology",
        heading: "Phương pháp",
        kind: "METHODOLOGY",
        body: "Nhóm thực hiện lập tuyến bay, kiểm tra dữ liệu tại hiện trường và đối soát ảnh theo quy trình đã phê duyệt [@source-1].",
      },
      {
        key: "risk-limitations",
        heading: "Rủi ro, giới hạn và trách nhiệm",
        kind: "RISK",
        body: "Chủ nhiệm chịu trách nhiệm xác nhận phạm vi. Dữ liệu thiếu hoặc bị mây che được ghi nhận là giới hạn, không được suy diễn thành kết quả.",
      },
      {
        key: "references",
        heading: "Tài liệu tham khảo",
        kind: "EVIDENCE",
        body: "Nguồn kỹ thuật được khai báo bằng mã [@source-1].",
      },
    ],
    citations: [
      {
        key: "source-1",
        title: "Quy trình kỹ thuật khảo sát",
        authors: "Nhóm kỹ thuật",
        year: "2026",
        publisher: "Đơn vị chủ trì",
        canonicalUri: "https://example.com/source-1",
        locator: "Mục 3",
        evidenceSourceId: null,
        researchRunId: null,
        researchSourceId: null,
        sourceDigest: null,
      },
    ],
    computationalArtifacts: [],
    researchImports: [],
  };
}

describe("governed authoring quality", () => {
  it("advises on em dashes but blocks unresolved citations and leaked tool traces", () => {
    const content = publishableContent();
    content.sections[0].body =
      "Kết luận này — chưa đủ dữ liệu [@missing]. turn7search2";
    const report = assessAuthoringQuality("RESEARCH_PROPOSAL", content);
    expect(report.status).toBe("FAIL");
    expect(report.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining([
        "EM_DASH_FORBIDDEN",
        "UNRESOLVED_CITATION",
        "TOOL_TRACE_LEAK",
      ]),
    );
  });

  it("flags formulaic prose and unsupported quantitative claims for review", () => {
    const content = publishableContent();
    content.sections[0].body =
      "Trong bối cảnh hiện nay, phạm vi dự kiến là 1.000 ha.";
    const report = assessAuthoringQuality("RESEARCH_PROPOSAL", content);
    expect(report.status).toBe("REVIEW");
    expect(report.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining([
        "AI_SLOP_PHRASE",
        "QUANTITATIVE_CLAIM_UNSOURCED",
      ]),
    );
  });

  it("requires accountability sections before publishing", () => {
    const content = publishableContent();
    content.sections = content.sections.filter(
      (section) => section.key !== "risk-limitations",
    );
    const report = assessAuthoringQuality("RESEARCH_PROPOSAL", content);
    expect(report.issues).toContainEqual(
      expect.objectContaining({
        code: "RESPONSIBILITY_SECTION_MISSING",
        severity: "BLOCKER",
      }),
    );
  });

  it("blocks publication when any retained section is empty", () => {
    const content = publishableContent();
    content.sections[1].body = "";
    const report = assessAuthoringQuality("RESEARCH_PROPOSAL", content);
    expect(report.status).toBe("FAIL");
    expect(report.issues).toContainEqual(
      expect.objectContaining({ code: "SECTION_EMPTY", severity: "BLOCKER" }),
    );
  });

  it("produces a stable content hash and a section-level diff", () => {
    const before = publishableContent();
    const after = structuredClone(before);
    after.sections[0].body += " Phạm vi được xác nhận trước khi bay.";
    expect(hashAuthoringContent(before)).toBe(hashAuthoringContent(before));
    expect(hashAuthoringContent(after)).not.toBe(hashAuthoringContent(before));
    const diff = diffAuthoringContent(before, after);
    expect(diff.changedSectionCount).toBe(1);
    expect(diff.sections[0]).toMatchObject({ status: "MODIFIED", wordDelta: 8 });
  });

  it("retains approved research provenance as an inseparable content contract", () => {
    const content = publishableContent();
    const runId = "run-approved-1";
    const sourceId = "source-approved-1";
    content.sections.push({
      key: "research-run-1",
      heading: "Bằng chứng nghiên cứu đã duyệt",
      kind: "EVIDENCE",
      body: "Kết luận đã được rà soát [@research-source].",
    });
    content.citations.push({
      key: "research-source",
      title: "Nguồn nghiên cứu",
      authors: "",
      year: "2026",
      publisher: "Cơ quan chuyên môn",
      canonicalUri: "https://example.com/research-source",
      locator: `Research snapshot SHA-256 ${"c".repeat(64)}`,
      evidenceSourceId: null,
      researchRunId: runId,
      researchSourceId: sourceId,
      sourceDigest: "c".repeat(64),
    });
    content.researchImports.push({
      runId,
      approvedDigest: "d".repeat(64),
      sectionKeys: ["research-run-1"],
      sourceIds: [sourceId],
      findingIds: ["finding-approved-1"],
    });
    expect(authoringContentSchema.safeParse(content).success).toBe(true);
    content.citations = content.citations.filter(
      (citation) => citation.researchSourceId !== sourceId,
    );
    expect(authoringContentSchema.safeParse(content).success).toBe(false);
  });

  it("renders publishable Vietnamese DOCX and PDF files", async () => {
    const content = publishableContent();
    const quality = assessAuthoringQuality("RESEARCH_PROPOSAL", content);
    expect(quality.blockerCount).toBe(0);
    const [docx, pdf] = await Promise.all([
      renderAuthoringDocx(content, "RESEARCH_PROPOSAL"),
      renderAuthoringPdf(content, "RESEARCH_PROPOSAL"),
    ]);
    expect(docx.subarray(0, 2).toString()).toBe("PK");
    expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");
    expect(docx.length).toBeGreaterThan(5_000);
    expect(pdf.length).toBeGreaterThan(5_000);
  });

  it.skipIf(spawnSync("pdftotext", ["-v"]).status !== 0)("preserves unsupported PDF arrows/comparators through narrow ASCII fallback", async () => {
    const content = publishableContent();
    content.title += " → hồ sơ";
    content.abstract = "Ngưỡng ≤ giới hạn, kết quả ≥ đầu vào.";
    content.sections[0].heading += " ← phạm vi";
    content.sections[0].body = "Kiểm tra → thử lại ← rà soát. Đo ≤ ngưỡng; chất lượng ≥ yêu cầu. Phép nhân × và tiếng Việt Đ giữ nguyên.";
    const original = JSON.stringify(content);
    const pdf = await renderAuthoringPdf(content, "RESEARCH_PROPOSAL");
    const extracted = execFileSync("pdftotext", ["-", "-"], { input: pdf }).toString("utf8");
    for (const symbol of ["->", "<-", "<=", ">=", "×", "Đ"]) expect(extracted).toContain(symbol);
    for (const unsupported of ["→", "←", "≤", "≥", "\uFFFD"]) expect(extracted).not.toContain(unsupported);
    expect(extracted).toContain("Kiểm tra");
    expect(JSON.stringify(content)).toBe(original);
  });

  it("loads traced TTF assets from a relocated runtime root without module resolution", async () => {
    const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
    const fixture = fs.mkdtempSync(join(tmpdir(), `codex-tmp-authoring-fonts-${date}-`));
    const relativeFonts = "node_modules/notosans-fontface/fonts";
    const fontDirectory = join(fixture, relativeFonts);
    try {
      fs.mkdirSync(fontDirectory, { recursive: true });
      for (const file of ["NotoSans-Regular.ttf", "NotoSans-Bold.ttf"]) {
        fs.copyFileSync(join(process.cwd(), relativeFonts, file), join(fontDirectory, file));
      }
      // Only the traced assets exist here: no package.json or synthetic (rsc) path.
      const cwd = vi.spyOn(process, "cwd").mockReturnValue(fixture);
      const readFile = vi.mocked(fs.readFileSync);
      readFile.mockClear();
      try {
        const content = publishableContent();
        const pdf = await renderAuthoringPdf(content, "RESEARCH_PROPOSAL");
        expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");
        expect(readFile).toHaveBeenCalledWith(join(fontDirectory, "NotoSans-Regular.ttf"));
        expect(readFile).toHaveBeenCalledWith(join(fontDirectory, "NotoSans-Bold.ttf"));
        expect(readFile.mock.calls.some(([file]) => String(file).includes(".afm"))).toBe(false);
      } finally {
        readFile.mockRestore();
        cwd.mockRestore();
      }
    } finally {
      fs.rmSync(fixture, { recursive: true, force: true });
    }
  });
});

describe("current editorial precision", () => {
  function reportFor(body: string) {
    const content = publishableContent();
    content.sections[0].body = body;
    return assessAuthoringQuality("RESEARCH_PROPOSAL", content);
  }

  it.each([
    "Không thể đảm bảo 100%, nhưng cần kiểm chứng.",
    "We cannot guarantee 100%.",
    "100% is not guaranteed.",
    "Theo đầu vào của người dùng, diện tích khảo sát là 1.000 ha; chưa chốt phương án.",
    "According to user input, the survey area is 1,000 ha.",
    "User-provided area: 1000 ha.",
    "Diện tích là 1000 ha (theo đầu vào của người dùng).",
  ])("recognizes only directly attributed input: %s", (body) => {
    expect(reportFor(body).issues.map((issue) => issue.code)).not.toContain("QUANTITATIVE_CLAIM_UNSOURCED");
  });

  it.each([
    "Theo đầu vào của người dùng, diện tích khảo sát là 1.000 ha, độ chính xác đạt 99%.",
    "Không thể đảm bảo 100%, nhưng độ chính xác đạt 99%.",
    "We cannot guarantee 100%, but accuracy is 99%.",
    "Đảm bảo 100%.",
    "Theo đầu vào của người dùng, diện tích khảo sát là 1.000 ha và độ chính xác đạt 99%.",
    "Theo đầu vào của người dùng, diện tích khảo sát là 1.000 ha; độ chính xác đạt 99%.",
    "According to user input, the survey area is 1,000 ha and accuracy is 99%.",
    "According to user input, the survey area is 1,000 ha. Accuracy is 99%.",
    "Độ chính xác đạt 99,5%.",
    "Accuracy is 99.5%.",
    "Chi phí là 1.000.000 VND.",
    "Diện tích là 1,000.5 ha.",
    "Chỉ diện tích 1.000 ha đã được xác nhận.",
  ])("retains unsupported measurement review: %s", (body) => {
    expect(reportFor(body).issues.map((issue) => issue.code)).toContain("QUANTITATIVE_CLAIM_UNSOURCED");
  });

  it.each([
    "Đánh giá độ chính xác đứng tuyệt đối và tương đối.",
    "Đánh giá độ chính xác tuyệt đối/tương đối.",
    "Measure absolute and relative vertical accuracy.",
    "Vùng thử không đại diện chắc chắn cho mọi vùng AOI.",
    "Không đảm bảo 100% tại hiện trường.",
    "Performance is not guaranteed.",
    "We cannot guarantee success.",
  ])("does not mistake technical or negated language for certainty: %s", (body) => {
    expect(reportFor(body).issues.map((issue) => issue.code)).not.toContain("UNSUPPORTED_CERTAINTY");
  });

  it.each([
    "Đánh giá độ chính xác đứng tuyệt đối và tương đối; chắc chắn đạt yêu cầu.",
    "Không đảm bảo 100% tại hiện trường, nhưng chắc chắn đạt yêu cầu.",
    "Performance is not guaranteed, but delivery is guaranteed.",
    "Measure absolute accuracy; performance is guaranteed at 100%.",
    "Chắc chắn đạt yêu cầu.",
    "Giải pháp hoàn toàn không có rủi ro.",
  ])("still reviews a separate positive certainty claim: %s", (body) => {
    expect(reportFor(body).issues.map((issue) => issue.code)).toContain("UNSUPPORTED_CERTAINTY");
  });

  it("keeps all style advice out of content score/status and allows transparent AI disclosure", () => {
    const content = publishableContent();
    const baseline = assessAuthoringQuality("RESEARCH_PROPOSAL", content);
    content.sections[0].body += ` — RGB–SfM. In today's fast-paced world. ${"word ".repeat(230)}`;
    content.sections[1].body += " Generated by AI. Do AI tạo.";
    const report = assessAuthoringQuality("RESEARCH_PROPOSAL", content);
    expect(report).toMatchObject({ score: baseline.score, status: "PASS", blockerCount: 0, warningCount: 0 });
    expect(report.issues.map((issue) => issue.code)).toEqual(expect.arrayContaining(["EM_DASH_FORBIDDEN", "EN_DASH_REVIEW", "AI_SLOP_PHRASE", "PARAGRAPH_TOO_DENSE"]));
    expect(report.issues.map((issue) => issue.code)).not.toContain("AI_DISCLOSURE_TRACE");
    expect(containsForbiddenPublishingTrace(content)).toBe(false);
    content.sections[0].body += " turn7search2";
    expect(containsForbiddenPublishingTrace(content)).toBe(true);
  });

  it("preserves strict historical v1 data and derives categories conservatively", () => {
    const stored = { ...assessAuthoringQuality("RESEARCH_PROPOSAL", publishableContent()), score: 82, status: "FAIL", blockerCount: 1,
      issues: [{ code: "EM_DASH_FORBIDDEN", severity: "BLOCKER", sectionKey: "context", excerpt: "A — B" }] };
    expect(qualityReportSchema.parse(stored)).toEqual(stored);
    expect(authoringIssueCategory("EM_DASH_FORBIDDEN")).toBe("STYLE");
    expect(authoringIssueCategory("AI_DISCLOSURE_TRACE")).toBe("STYLE");
    expect(authoringIssueCategory("FUTURE_UNKNOWN_ISSUE")).toBe("CONTENT");
    expect(qualityReportSchema.safeParse({ ...stored, category: "STYLE" }).success).toBe(false);
  });

  it.each(["B_DRAFT", "B_FINAL"])("checks the retained UAV %s fixture, not a rewritten approximation", (name) => {
    const fixture = JSON.parse(fs.readFileSync(join(process.cwd(), `artifacts/qa/button-ab-20261014/${name}.json`), "utf8")) as { title: string; sections: { key: string; body: string }[] };
    const content = publishableContent();
    content.title = fixture.title;
    content.sections = fixture.sections.map((section) => ({ ...section, heading: section.key, kind: "NARRATIVE" }));
    content.citations = ["S1", "S2", "S3"].map((key) => ({ ...content.citations[0], key }));
    const report = assessAuthoringQuality("TECHNICAL_PROPOSAL", content);
    expect(report.blockerCount).toBe(0);
    expect(report.issues.map((issue) => issue.code)).not.toContain("UNSUPPORTED_CERTAINTY");
    if (name === "B_FINAL") expect(report).toMatchObject({ score: 100, status: "PASS", warningCount: 0 });
    else {
      expect(report.warningCount).toBe(1); // Draft input was not explicitly attributed.
      expect(report.issues.filter((issue) => authoringIssueCategory(issue.code) === "STYLE").length).toBeGreaterThan(0);
    }
  });

  it.each([renderAuthoringDocx, renderAuthoringPdf])("exports style-only content under current rules without any saved-report authority", async (render) => {
    const content = publishableContent();
    content.sections[0].body += " Text — with an em dash. Generated by AI.";
    const before = JSON.stringify(content);
    expect((await render(content, "RESEARCH_PROPOSAL")).length).toBeGreaterThan(5000);
    expect(JSON.stringify(content)).toBe(before);
  });

  it.each([renderAuthoringDocx, renderAuthoringPdf])("fails closed on real current content blockers and the actual document type", async (render) => {
    for (const body of ["Broken [@missing].", "Raw turn7search2", "", "Experts agree this is safe."]) {
      const content = publishableContent();
      content.sections[0].body = body;
      await expect(render(content, "RESEARCH_PROPOSAL")).rejects.toMatchObject({ code: "AUTHORING_QUALITY_BLOCKED" });
    }
    const content = publishableContent();
    // OTHER would pass; TECHNICAL_PROPOSAL requires a verification section.
    await expect(render(content, "TECHNICAL_PROPOSAL")).rejects.toMatchObject({ code: "AUTHORING_QUALITY_BLOCKED" });
  });
});
