import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { WorkspaceContext } from "@/modules/identity-workspace";
import type { AuthoringContent, AuthoringQualityReport } from "@/modules/authoring/contracts";

const mocks = vi.hoisted(() => ({ findMany: vi.fn(), findFirst: vi.fn() }));
vi.mock("@/modules/identity-workspace", () => ({ requireCapability: vi.fn(), NotFoundError: class extends Error {} }));
vi.mock("@/modules/research-sandbox/kernel", () => ({ getApprovedResearchBundle: vi.fn() }));
vi.mock("@/server/db", () => ({ getDb: () => ({ workspace: { findFirst: async () => ({ organizationId: "org" }) } }) }));
vi.mock("@/server/tenant-context", () => ({ withOrganizationTenant: (_org: string, _user: string, fn: (tx: unknown) => unknown) => fn({ authoringDocument: mocks, evidenceSource: { findMany: async () => [] } }) }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn() }) }));
vi.mock("@/app/actions/authoring", () => ({ saveAuthoringRevisionAction: vi.fn() }));

import { getAuthoringDocument, listAuthoringDocuments } from "@/modules/authoring/kernel";
import { AuthoringWorkspace } from "@/components/authoring/authoring-workspace";
import { getAuthoringCopy } from "@/i18n/authoring-copy";

const content: AuthoringContent = {
  title: "Saved document", abstract: "Bounded proposal.",
  sections: ["verification", "risk-limitations"].map((key) => ({ key, heading: key, kind: "NARRATIVE", body: "Review — retained." })),
  citations: [], computationalArtifacts: [], researchImports: [],
};
const historical: AuthoringQualityReport = {
  schema: "hive-os.authoring-quality.v1", status: "FAIL", score: 64, blockerCount: 2,
  warningCount: 0, noteCount: 0, citedMarkerCount: 0, definedCitationCount: 0,
  issues: content.sections.map((section) => ({ code: "EM_DASH_FORBIDDEN", severity: "BLOCKER", sectionKey: section.key, excerpt: section.body })),
};
const context = { workspace: { id: "ws" }, user: { id: "user" } } as WorkspaceContext;

beforeEach(() => vi.clearAllMocks());

describe("immutable history and current authoring surfaces", () => {
  it("lists current content checks while returning unchanged stored revision history", async () => {
    const row = { id: "doc", documentKey: "DOC-TEST", title: content.title, documentType: "TECHNICAL_PROPOSAL", status: "DRAFT", currentRevisionNumber: 1, mission: { referenceCode: "M-1", title: "Mission" },
      revisions: [{ ...content, id: "rev", revisionNumber: 1, qualityReport: historical, contentHash: "a".repeat(64), changeSummary: "Old save", createdAt: new Date() }] };
    mocks.findMany.mockResolvedValue([row]);
    mocks.findFirst.mockResolvedValue(row);
    const before = JSON.stringify(row);
    expect((await listAuthoringDocuments(context))[0].quality).toMatchObject({ score: 100, blockerCount: 0, status: "PASS" });
    expect((await getAuthoringDocument(context, "doc")).current?.quality).toEqual(historical);
    expect(JSON.stringify(row)).toBe(before);
    row.revisions[0].sections = row.revisions[0].sections.filter((section) => section.key !== "verification");
    expect((await listAuthoringDocuments(context))[0].quality?.status).toBe("FAIL");
  });

  it.each(["en", "vi"] as const)("renders split advice and recorded history labels in %s", (locale) => {
    const copy = getAuthoringCopy(locale);
    const html = renderToStaticMarkup(createElement(AuthoringWorkspace, {
      slug: "lab", documentId: "doc", documentType: "TECHNICAL_PROPOSAL", documentKey: "DOC-TEST", status: "DRAFT", revisionNumber: 1,
      content, revisions: [{ id: "rev", revisionNumber: 1, changeSummary: "Old save", createdAt: "2026-10-14", quality: historical }],
      changedSectionCount: 0, diffSections: [], evidenceSources: [], copy, locale, canWrite: true, canExport: true,
    }));
    for (const label of [copy.qualityHint, copy.contentFindings, copy.styleAdvice, copy.styleHint, copy.recordedScore, copy.exportSavedHint]) expect(html).toContain(label);
    expect(html).toContain("100/100");
    expect(html).toContain(">64</span>");
    expect(html).toContain('/api/w/lab/authoring/doc/export/pdf');
    expect(html).not.toContain('aria-disabled="true"');
  });
});
