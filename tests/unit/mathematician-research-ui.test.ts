import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { ResearchDirectionForm } from "@/components/research/research-direction-form";
import { prepareMathematicalResearchNote } from "@/components/research/research-note";
import { MathText } from "@/components/research/math-text";
import { SidebarContent } from "@/components/shell/sidebar-content";

vi.mock("@/app/actions/research-sandbox", () => ({ requestResearchStepAction: vi.fn() }));
vi.mock("@/app/actions/lean-research", () => ({ simulateDirectedResearchAction: vi.fn() }));
vi.mock("@/components/preferences/preferences-provider", () => ({ usePreferences: () => ({ locale: "vi", t: (key: string) => key }) }));
vi.mock("next/navigation", () => ({ usePathname: () => "/w/lab/research" }));
const props = { slug: "lab", draftScope: {userId:"user",workspaceId:"workspace"}, locale: "vi" as const, missionId: "", missions: [], documents: [], parents: [], configured: false, simulationAvailable: true, idempotencyKey: "example" };
describe("mathematician desk separates research from operation", () => {
  it.each(["vi", "en"] as const)("default desk is plain %s and drafts without a mission", (locale) => {
    const html = renderToStaticMarkup(createElement(ResearchDirectionForm, { ...props, locale }));
    expect(html).toContain(locale === "vi" ? "Bài toán và kết quả mong muốn" : "Problem and intended result");
    expect(html).toContain(locale === "vi" ? "AI chưa được kết nối" : "AI is not connected");
    expect(html).toContain(locale === "vi" ? "Chuẩn bị ghi chú nghiên cứu" : "Prepare research note");
    expect(html).toContain('name="intent"'); expect(html).toContain('name="guidance"');
    expect(html).not.toMatch(/API adapter|Adapter API|runtime|JSON|scripted calls|Kiểm tra lõi gọn/);
    expect(html).not.toContain('name="solver"'); expect(html).not.toContain('name="certificate"');
    expect(html).toContain(locale === "vi" ? "Lưu bản nháp trong tab" : "Save draft in tab");
    expect(html).toContain(locale === "vi" ? "24 giờ" : "24 hours");
    expect(html).toContain(locale === "vi" ? "Về kiểm chứng toán học" : "About mathematical verification");
    expect(html).toContain("Lean 4.10");
    expect(html).toContain(locale === "vi" ? "chưa kết nối chức năng kiểm Lean" : "not connected to arbitrary-problem Lean checking");
    expect(html).toContain('id="research-references"');
  });
  it("operation remains explicit and retains simulator disclosure", () => {
    const html = renderToStaticMarkup(createElement(ResearchDirectionForm, { ...props, operational: true }));
    expect(html).toContain("Adapter API"); expect(html).toContain("API giả lập");
    expect(html).toContain("không LLM thật"); expect(html).toContain("Tạo hồ sơ cho agent");
  });
  it("configured default action honestly requests literature, never claims to solve mathematics", () => {
    const html = renderToStaticMarkup(createElement(ResearchDirectionForm, { ...props, configured: true }));
    expect(html).toContain("Yêu cầu tìm tài liệu"); expect(html).toContain("không giải hay kiểm chứng bài toán");
    expect(html).not.toContain("gpt-5.6");
  });
  it("uses real related-work/document titles, reserving internal codes for operation", () => {
    const withContext = { ...props, missionId: "m", missions: [{ id: "m", referenceCode: "M-0004", title: "My mathematical project" }], documents: [{ id: "d", missionId: "m", documentKey: "DOC-ABC", title: "Existing proof notes" }] };
    const html = renderToStaticMarkup(createElement(ResearchDirectionForm, withContext));
    expect(html).toContain("My mathematical project"); expect(html).toContain("Existing proof notes");
    expect(html).not.toContain("M-0004"); expect(html).not.toContain("DOC-ABC");
    const operation = renderToStaticMarkup(createElement(ResearchDirectionForm, { ...withContext, operational: true }));
    expect(operation).toContain("M-0004"); expect(operation).toContain("DOC-ABC");
  });
  it("research references stay in the same mathematical desk; general authoring remains unchanged elsewhere", () => {
    const shell = { homeHref: "/w/lab", account: { name: "Researcher", email: "researcher@example.test" }, footerSlot: createElement("button", null, "Sign out") };
    const research = renderToStaticMarkup(createElement(SidebarContent, { ...shell, researcherMode: true }));
    expect(research).toContain("Tài liệu tham khảo"); expect(research).toContain('href="/w/lab/research#research-references"');
    expect(research).not.toContain('href="/w/lab/authoring"'); expect(research).toContain("Sign out"); expect(research).toContain("Researcher");
    const regular = renderToStaticMarkup(createElement(SidebarContent, shell));
    expect(regular).toContain('href="/w/lab/authoring"');
  });
});
describe("mathematical research note is user content, not a host prompt or fabricated answer", () => {
  const input = { goal: "Study $a^2+b^2=k(ab+1)$ under the stated assumptions.", mode: "HUMAN" as const, guidance: "Try a descent using $c=ka-b$, without assuming positivity.",
    sourcePolicy: { allowedDomains: ["arxiv.org"], primaryDomains: ["arxiv.org"], requirePrimary: true, maxSources: 12 } };
  it.each(["vi", "en"] as const)("preserves exact input and source limits in readable %s", (locale) => {
    const note = prepareMathematicalResearchNote(input, locale);
    expect(note).toContain(input.goal); expect(note).toContain(input.guidance); expect(note).toContain("arxiv.org"); expect(note).toContain("12");
    expect(note).toContain(locale === "vi" ? "không sinh câu trả lời AI" : "No AI answer");
    expect(note).toContain(locale === "vi" ? "chưa được lưu" : "not saved to the server");
    expect(note).not.toMatch(/Return JSON|RESEARCH_STEERING|Perform exactly|steeringContextData|SOLVER|API adapter/);
  });
  it("validates boundaries and preserves inherited source restrictions over caller edits", () => {
    const note = prepareMathematicalResearchNote({ ...input, parent: { scope: "Original assumptions", sourcePolicy: { ...input.sourcePolicy, allowedDomains: ["original.example"] }, snapshot: null } }, "en");
    expect(note).toContain("original.example"); expect(note).toContain("Original assumptions");
    expect(() => prepareMathematicalResearchNote({ ...input, sourcePolicy: { maxSources: 51 } }, "en")).toThrow();
    expect(() => prepareMathematicalResearchNote({ ...input, guidance: "" }, "vi")).toThrow();
  });
  it("retains the selected existing document title without claiming its contents were read or attached", () => {
    const note = prepareMathematicalResearchNote({ ...input, relatedDocument: { title: "Notes on a possible descent" } }, "en");
    expect(note).toContain("Notes on a possible descent"); expect(note).toContain("not been read or verified"); expect(note).toContain("not an uploaded attachment");
    const inherited = prepareMathematicalResearchNote({ ...input, relatedDocument: { title: null }, parent: { scope: "Original scope", sourcePolicy: input.sourcePolicy, snapshot: null } }, "vi");
    expect(inherited).toContain("tiêu đề chưa có"); expect(inherited).not.toContain("undefined");
  });
  it("renders actual entered formulas with existing safe math and retains malformed/hostile input", () => {
    const note = prepareMathematicalResearchNote(input, "en");
    const html = renderToStaticMarkup(createElement(MathText, { text: note }));
    expect(html).toContain("katex");
    const hostile = '<script>alert(1)</script> $\\href{javascript:alert(1)}{X}$ $$\\unknown{a}$$';
    const safe = renderToStaticMarkup(createElement(MathText, { text: hostile }));
    expect(safe).not.toContain("<script>"); expect(safe).not.toContain('href="javascript:'); expect(safe).toContain("\\unknown");
  });
});
