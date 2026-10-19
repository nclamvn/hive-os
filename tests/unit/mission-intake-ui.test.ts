import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MissionIntakeForm, suggestedMissionContract } from "@/components/mission/mission-intake-form";
import { sidebarWorkspaceBase } from "@/components/shell/sidebar-content";
import { getMissionTemplate } from "@/modules/mission-templates";

describe("mission intake navigation", () => {
  it.each(["/w/lab", "/w/lab/", "/w/lab/research?find=1", "/w/lab#mission-composer"])("keeps a workspace-scoped base from %s", (href) => {
    expect(sidebarWorkspaceBase(href)).toBe("/w/lab");
  });
  it.each(["/", "#mission-composer", "/workspaces", "https://outside.example/w/lab", "/w/"])("does not invent workspace context for %s", (href) => {
    expect(sidebarWorkspaceBase(href)).toBeNull();
  });
});

describe("progressive mission draft", () => {
  it("derives a draft from human inputs without claiming a result", () => {
    expect(suggestedMissionContract("  My question  ", "  A bounded answer  ", "en")).toEqual({
      requirementTitle: "My question", requirementCriteria: "A bounded answer",
      obligationTitle: "Review evidence and limitations before accepting the result",
    });
    expect(suggestedMissionContract("", "", "vi").requirementTitle).toBe("");
  });
  it.each(["en", "vi"] as const)("foregrounds four fields and preserves editable contract controls in %s", (locale) => {
    const html = renderToStaticMarkup(createElement(MissionIntakeForm, { workspaceSlug: "lab", locale, defaultProfile: "RESEARCH", action: async () => {} }));
    const beforeDetails = html.split("<details")[0];
    for (const field of ["title", "objective", "scope", "successDefinition"]) expect(beforeDetails).toContain(`name="${field}"`);
    for (const field of ["requirementTitle", "requirementCriteria", "obligationTitle", "assuranceProfile", "obligationWeight"]) {
      expect(beforeDetails).not.toContain(`name="${field}"`);
      expect(html).toContain(`name="${field}"`);
    }
    expect(html).not.toMatch(/<details[^>]* open/);
    expect(html).toContain('data-testid="mission-contract-details"');
    expect(html).toContain(locale === "vi" ? "không tự chạy AI" : "does not run AI");
    expect(html).toContain(locale === "vi" ? "không phải kế hoạch do AI tạo" : "not an AI-generated plan");
  });
  it("retains the selected template's full draft details and weight", () => {
    const template = getMissionTemplate("rapid-operational-brief")!;
    const html = renderToStaticMarkup(createElement(MissionIntakeForm, { workspaceSlug: "lab", locale: "en", defaultProfile: "RESEARCH", template, action: async () => {} }));
    for (const value of [template.objective, template.scope, template.requirementTitle, template.requirementCriteria, template.obligationTitle]) expect(html).toContain(value);
    expect(html).toContain('value="QUICK" selected=""');
    expect(html).toContain('step="1"');
  });
});
