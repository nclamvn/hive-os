import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({ locale: "en" as "en" | "vi", reviewerId: "reviewer", question: "Same exact question" }));
vi.mock("@/app/actions/research-sandbox", () => ({
  requestComputationRunAction: async () => {}, importApprovedResearchBundleAction: async () => {},
  requestResearchRunAction: async () => {}, reviewComputationRunAction: async () => {},
  reviewResearchRunAction: async () => {},
}));
vi.mock("@/components/shell/workspace-shell", () => ({ WorkspaceShell: ({ children }: { children: ReactNode }) => children }));
vi.mock("@/components/research/research-campaign-region", () => ({ ResearchCampaignRegion: () => createElement("p", null, "Engineering controls") }));
vi.mock("@/components/research/research-live-refresh", () => ({ ResearchLiveRefresh: () => null }));
vi.mock("@/i18n/server", () => ({ getTranslator: async () => ({ locale: state.locale }) }));
vi.mock("@/modules/identity-workspace", () => ({ hasCapability: () => true }));
vi.mock("@/server/env", () => ({ getEnv: () => ({ NODE_ENV: "test" }) }));
vi.mock("@/server/auth/workspace-page", () => ({ loadWorkspacePage: async () => ({
  ctx: { membership: { id: state.reviewerId, role: "OWNER" } },
}) }));
vi.mock("@/modules/research-sandbox/kernel", () => ({
  listResearchRuns: async () => [
    {
      id: "latest-failed", missionId: "m", question: state.question, createdAt: new Date(100), updatedAt: new Date(100),
      mission: { referenceCode: "M-1" }, sources: [], findings: [], job: null, status: "FAILED", failureCode: "INVALID_INPUT",
    },
    {
      id: "older-review", missionId: "m", question: state.question, createdAt: new Date(99), updatedAt: new Date(999),
      mission: { referenceCode: "M-1" }, sources: [], findings: [{ id: "f", kind: "HONEST_NULL", claim: "Original retained statement: x=1", exactExcerpt: "y=2", decision: { decision: "REJECT", rationale: "z=3" } }],
      job: null, status: "AWAITING_REVIEW", requestedByMembershipId: "author",
    },
    ...Array.from({ length: 6 }, (_, i) => ({
      id: `other-${i}`, missionId: "m", question: `Different question ${i}`, createdAt: new Date(90 - i), updatedAt: new Date(90 - i),
      mission: { referenceCode: "M-1" }, sources: [], findings: [], job: null, status: i === 5 ? "QUEUED" : "FAILED",
    })),
  ],
  listComputationRuns: async () => [],
  listResearchTargets: async () => ({ missions: [{ id: "m", referenceCode: "M-1", title: "Research" }], documents: [] }),
}));

import ResearchPage from "@/app/w/[workspaceSlug]/research/page";

async function render() {
  return renderToStaticMarkup(await ResearchPage({ params: Promise.resolve({ workspaceSlug: "lab" }), searchParams: Promise.resolve({}) }));
}

describe("research goal-to-result presentation", () => {
  beforeEach(() => { state.locale = "en"; state.reviewerId = "reviewer"; state.question = "Same exact question"; });

  it("renders the exact screenshot question and archived narratives with MathML", async () => {
    state.question = "Audit the finite Lonely Runner grid: N=6, M=42. For every speed tuple in the sealed Cartesian axes, find j in 0..M-1 with N*min(j*u mod M,M-j*u mod M)>=M for every speed, or certify absence on this grid only.";
    const html = await render();
    const headings = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map((match) => match[1]);
    const question = headings.find((heading) => heading.includes("Audit the finite Lonely Runner grid"));
    expect(question).toBeDefined();
    expect((question?.match(/<math\b/g) ?? [])).toHaveLength(4);
    expect(question).toContain("or certify absence on this grid only.");
    expect(question).toContain('title="N*min(j*u mod M,M-j*u mod M)&gt;=M"');
    for (const narrative of ["x=1", "y=2", "z=3"]) expect(html).toContain(`title="${narrative}"`);
  });

  it("puts the goal first and keeps original older attempts with review controls", async () => {
    const html = await render();
    expect(html.indexOf('id="new-research"')).toBeLessThan(html.indexOf('id="research-runs"'));
    expect(html.indexOf('id="research-runs"')).toBeLessThan(html.indexOf('id="research-entry-title"'));
    expect(html).toContain("Submit research request");
    expect(html).toContain("Recent attempts: 2");
    expect(html).toContain("Previous attempts · original records and review access retained");
    expect(html).toContain("Earlier attempts in progress or awaiting review: 1");
    expect(html).toContain('name="runId" value="older-review"');
    expect(html).toContain('name="rationale:f"');
    expect(html).toContain("Original retained statement");
    expect(html).toContain("No reliable result was found");
    expect(html).toContain("Older questions (2)");
    expect((html.match(/data-research-question-group/g) ?? [])).toHaveLength(7);
    expect(html).toMatch(/<details[^>]*><summary[^>]*>Technical details<\/summary>/);
    expect(html).not.toContain("<details open");
  });

  it("keeps the self-review boundary and bilingual explanations", async () => {
    state.locale = "vi";
    state.reviewerId = "author";
    const html = await render();
    expect(html).toContain("Gửi yêu cầu nghiên cứu");
    expect(html).toContain("Đây không phải kết luận đã được chứng minh");
    expect(html).toContain("Original retained statement");
    expect(html).not.toContain('name="rationale:f"');
  });
});
