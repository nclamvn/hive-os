import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { isNavigationActive } from "@/components/shell/navigation";
import { ResearchEntryPoints } from "@/components/shell/research-entry-points";
import { getResearchCopy } from "@/i18n/research-copy";

describe("workspace navigation", () => {
  it.each(["research", "settings", "authoring", "missions", "reports"])(
    "keeps the %s section selected on nested routes", (segment) => {
      expect(isNavigationActive(`/w/lab/${segment}/detail`, `/w/lab/${segment}`)).toBe(true);
      expect(isNavigationActive(`/w/lab/${segment}`, `/w/lab/${segment}`)).toBe(true);
      expect(isNavigationActive(`/w/lab/${segment}-other`, `/w/lab/${segment}`)).toBe(false);
    },
  );
  it("does not select the dashboard or another workspace for a child route", () => {
    expect(isNavigationActive("/w/lab/research/kakeya", "/w/lab")).toBe(false);
    expect(isNavigationActive("/w/other/research/kakeya", "/w/lab/research")).toBe(false);
    expect(isNavigationActive("/w/lab", "/w/lab")).toBe(true);
  });
});

describe("research entry points", () => {
  const render = (locale: "vi" | "en", localToolsAvailable = true, canRequest = true) =>
    renderToStaticMarkup(createElement(ResearchEntryPoints, {
      locale, workspaceSlug: "lab", missionId: "mission/one", localToolsAvailable, canRequest,
    }));

  it.each(["vi", "en"] as const)("explains scope and keeps navigation read-only in %s", (locale) => {
    const html = render(locale);
    expect(html).toContain(locale === "vi" ? "Hồ sơ, ví dụ và bàn làm việc" : "Cases, examples and workbenches");
    expect(html).toContain(locale === "vi" ? "Không phải trình chứng minh Lean" : "not the Lean proof assistant");
    expect(html).toContain(locale === "vi" ? "không tự chạy mô hình" : "does not run a model");
    expect(html).toContain("/research/math-pilot?missionId=mission%2Fone");
    expect(html).toContain("/research/poly19?missionId=mission%2Fone#poly19-showcase");
    expect(html).toContain('aria-labelledby="research-entry-title"');
    expect(html).not.toContain("<form");
    expect(html).not.toContain("<button");
  });
  it("does not advertise development-only routes outside development/test", () => {
    const html = render("en", false);
    expect(html).not.toContain('href="/w/lab/research/lean"');
    expect(html).not.toContain('href="/w/lab/research/kakeya"');
    expect(html).toContain("experimental links are hidden");
    expect(html).toContain('/research/poly19?');
  });
  it("does not advertise the request workbench to read-only researchers", () => {
    const html = render("vi", true, false);
    expect(html).not.toContain('href="/w/lab/research/lean"');
    expect(html).toContain('href="/w/lab/research/kakeya"');
  });
});

describe("research execution copy", () => {
  it.each(["vi", "en"] as const)("does not imply an enabled autonomous provider in %s", (locale) => {
    const copy = getResearchCopy(locale);
    expect(copy.startResearch).toBe(locale === "vi" ? "Gửi yêu cầu nghiên cứu" : "Submit research request");
    expect(copy.requestModeHint).toContain(locale === "vi" ? "không có nghĩa AI đã bắt đầu" : "does not mean AI has started");
    expect(copy.automaticGuardrails).toContain(locale === "vi" ? "cấu hình, bật và cấp quyền" : "configured, enabled, and authorized");
    expect(copy.automaticGuardrails).toContain(locale === "vi" ? "nhập thủ công" : "manually imported");
    expect(copy.workerNotice).toContain(locale === "vi" ? "không có nghĩa tác vụ đã chạy" : "not evidence of execution");
    expect(copy.nextActions.QUEUED).toContain(locale === "vi" ? "đang chờ worker" : "waiting for a worker");
    expect(copy.subtitle).not.toMatch(/lo phần còn lại|handles the workflow/);
    expect(copy.nextActions.QUEUED).not.toMatch(/sẽ tự bắt đầu|will start automatically/);
  });
});
