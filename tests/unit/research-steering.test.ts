import { describe, expect, it } from "vitest";
import { requestResearchRunSchema } from "@/modules/research-sandbox/contracts";
import { isResearchSteeringConfigured, prepareResearchSteering, researchSteeringBrief, researchSteeringRequestSchema } from "@/modules/research-sandbox/research-steering";

const parent = () => ({ id: "parent", status: "AWAITING_REVIEW", queryPlan: { queries: ["q"], languages: ["en"] },
  findings: Array.from({ length: 12 }, (_, i) => ({ id: `f${String(i).padStart(2, "0")}`, kind: "SUPPORTING", claim: i === 0 ? "x".repeat(1_600) : "claim", sourceId: `s${String(i + 5).padStart(2, "0")}`, decision: i === 0 ? { decision: "APPROVED" } : null })),
  sources: Array.from({ length: 20 }, (_, i) => ({ id: `s${String(i).padStart(2, "0")}`, title: "Retained source", canonicalUri: `https://example.org/${i}`, contentDigest: "a".repeat(64) })),
});
describe("one-step strategic intent and bounded history", () => {
  it("requires natural-language human direction but accepts auto without equations or direction", () => {
    expect(researchSteeringRequestSchema.safeParse({ mode: "HUMAN", guidance: "  " }).success).toBe(false);
    expect(researchSteeringRequestSchema.parse({ mode: "HUMAN", guidance: "Compare the two assumptions" }).guidance).toBe("Compare the two assumptions");
    expect(researchSteeringRequestSchema.parse({ mode: "AUTO" })).toEqual({ mode: "AUTO", guidance: "", parentRunId: null });
  });
  it.each([{ mode: "SWARM" }, { mode: "AUTO", budget: "unlimited" }, { mode: "AUTO", guidance: "x".repeat(4001) }])("rejects expanded intent %j", (input) => {
    expect(researchSteeringRequestSchema.safeParse(input).success).toBe(false);
  });
  it("keeps old bounded request shape unchanged without injecting optional steering", () => {
    const request = requestResearchRunSchema.parse({ missionId: "m", question: "goal", scope: "scope", providerName: "openai", modelName: "model", sourcePolicy: {}, queryPlan: { queries: ["q"] }, idempotencyKey: "key" });
    expect(request.queryPlan).toEqual({ queries: ["q"], languages: ["vi", "en"] });
    expect("steering" in request).toBe(false);
  });
  it("preserves status and decisions without promoting historical claims to fresh evidence", () => {
    const result = prepareResearchSteering({ mode: "HUMAN", guidance: "Try a reduction", parentRunId: "parent" }, "child", parent());
    expect(result.rootRunId).toBe("parent"); expect(result.parentRunId).toBe("parent");
    expect(result.prior).toMatchObject({ status: "AWAITING_REVIEW", omittedFindings: 4, omittedSources: 12 });
    expect(result.prior?.findings[0]).toMatchObject({ claimTruncated: true, decision: "APPROVED" });
    expect(result.prior?.findings[0].claim).toHaveLength(1500);
  });
  it("selects source references of retained findings before unrelated sources, deterministically", () => {
    const a = parent(); const b = { ...a, findings: [...a.findings].reverse(), sources: [...a.sources].reverse() };
    const intent = { mode: "AUTO" as const, guidance: "", parentRunId: "parent" };
    expect(prepareResearchSteering(intent, "child", a)).toEqual(prepareResearchSteering(intent, "child", b));
    expect(prepareResearchSteering(intent, "child", a).prior?.sources.map((source) => source.id)).toEqual(["s05", "s06", "s07", "s08", "s09", "s10", "s11", "s12"]);
  });
  it("retains the same root across mode takeover and never mutates the parent", () => {
    const original = parent(); const before = JSON.stringify(original);
    const prepared = prepareResearchSteering({ mode: "AUTO", guidance: "", parentRunId: "parent" }, "child", original);
    const child = { ...original, id: "child", queryPlan: { ...original.queryPlan, steering: prepared } };
    expect(prepareResearchSteering({ mode: "HUMAN", guidance: "Different approach", parentRunId: "child" }, "next", child).rootRunId).toBe("parent");
    expect(JSON.stringify(original)).toBe(before);
  });
  it("does not treat an enabled unrelated tenant or absent credentials as ready", () => {
    const config = { RESEARCH_WORKER_ENABLED: true, RESEARCH_OPENAI_ENABLED: true, OPENAI_API_KEY: "test", RESEARCH_WORKER_ORGANIZATION_ID: "org", RESEARCH_WORKER_ACTOR_USER_ID: "actor" };
    expect(isResearchSteeringConfigured(config, "org")).toBe(true);
    expect(isResearchSteeringConfigured(config, "other")).toBe(false);
    for (const flag of ["RESEARCH_WORKER_ENABLED", "RESEARCH_OPENAI_ENABLED", "OPENAI_API_KEY", "RESEARCH_WORKER_ACTOR_USER_ID"] as const) {
      expect(isResearchSteeringConfigured({ ...config, [flag]: undefined }, "org")).toBe(false);
    }
  });
  it("exports usable context with omissions and source links, not only an inaccessible parent id", () => {
    const p = parent(); const snapshot = prepareResearchSteering({ mode: "AUTO", guidance: "", parentRunId: p.id }, "next", p).prior;
    const brief = researchSteeringBrief({ goal: "Original goal", mode: "AUTO", guidance: "", parentRunId: p.id,
      parent: { scope: "Original scope", sourcePolicy: { allowedDomains: ["example.org"] }, snapshot } });
    expect(brief).toContain("No model has been called"); expect(brief).toContain("Original scope");
    expect(brief).toContain("review=APPROVED"); expect(brief).toContain("TRUNCATED");
    expect(brief).toContain("https://example.org/5"); expect(brief).toContain("4 findings");
    expect(brief).toContain("not the complete dossier"); expect(brief).toContain("do not silently replace the goal");
  });
  it("refuses empty handoffs instead of creating misleading runnable briefs", () => {
    expect(() => researchSteeringBrief({ goal: " ", mode: "AUTO", guidance: "" })).toThrow();
    expect(() => researchSteeringBrief({ goal: "goal", mode: "HUMAN", guidance: "" })).toThrow();
  });
  it("exports new-goal source restrictions and queries, but inherited restrictions win on continuation", () => {
    const policy = { allowedDomains: ["fao.org"], primaryDomains: ["fao.org"], maxSources: 12, requirePrimary: true };
    const input = { goal: "Survey", mode: "AUTO" as const, guidance: "", sourcePolicy: policy, queries: ["forest survey"] };
    const brief = researchSteeringBrief(input);
    expect(brief).toContain("fao.org"); expect(brief).toContain("Số nguồn tối đa: 12"); expect(brief).toContain("forest survey");
    const inherited = researchSteeringBrief({ ...input, parent: { scope: "Fixed", sourcePolicy: { ...policy, allowedDomains: ["original.org"] }, snapshot: null } });
    expect(inherited).toContain("original.org");
  });
  it.each([{ maxSources: 0 }, { maxSources: 51 }, { maxSources: Number.NaN }, { allowedDomains: Array(51).fill("x.org") }])("refuses an invalid source boundary in host export %j", (policy) => {
    expect(() => researchSteeringBrief({ goal: "goal", mode: "AUTO", guidance: "", sourcePolicy: policy })).toThrow();
  });
});
