import { describe, expect, it } from "vitest";

import {
  authoringContentSchema,
  type AuthoringContent,
} from "@/modules/authoring/contracts";
import { hashAuthoringContent } from "@/modules/authoring/content-hash";
import { diffAuthoringContent } from "@/modules/authoring/diff";
import {
  renderAuthoringDocx,
  renderAuthoringPdf,
} from "@/modules/authoring/export";
import { assessAuthoringQuality } from "@/modules/authoring/quality";

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
  it("blocks em dash, unresolved citations and leaked tool traces", () => {
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
      renderAuthoringDocx(content, quality),
      renderAuthoringPdf(content, quality),
    ]);
    expect(docx.subarray(0, 2).toString()).toBe("PK");
    expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");
    expect(docx.length).toBeGreaterThan(5_000);
    expect(pdf.length).toBeGreaterThan(5_000);
  });
});
