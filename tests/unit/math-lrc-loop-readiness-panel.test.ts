import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { MathLrcLoopReadinessPanel } from "@/components/research/math-lrc-loop-readiness-panel";
import { readinessUiCaseId, readinessUiFixture } from "./math-lrc-loop-readiness-ui-fixture";
import type { LrcLoopReadinessDto } from "@/server/operations/math-lrc-loop-readiness";

const reloadHref = "/w/synthetic-lab/research/math-pilot?missionId=00000000-0000-4000-8000-000000000001&caseId=" + readinessUiCaseId;
const render = (locale = "en", readiness = readinessUiFixture()) => renderToStaticMarkup(createElement(MathLrcLoopReadinessPanel,
  { locale, readiness, reloadHref }));

describe("TIP070 passive readiness presentation (synthetic DTO controls)", () => {
  it.each(["vi", "en"])("%s renders legacy refusal, actual zero admitted records and closed gates", locale => {
    const html = render(locale);
    expect(html).toContain('id="math-lrc-loop-readiness"');
    expect(html).toContain("LEGACY_NOT_ADMISSIBLE"); expect(html).toContain("NOT_ADMITTED");
    expect(html).toContain("PLANNING_ONLY / G2_NOT_AUTHORIZED"); expect(html).toContain("dispatchAllowed: false; proofClosure: false");
    expect(html).toContain(locale === "vi" ? "0 hồ sơ method-unit được nhận" : "0 admitted method-unit records");
    expect(html).toContain(locale === "vi" ? "Không chạy lại hồ sơ 064" : "Do not retry the 064 record");
    expect(html).not.toMatch(/<button|<form|<input|<textarea|<progress|aria-valuenow/);
  });
  it("preserves process order and separates passive source hashes from fresh replay", () => {
    const html = render();
    const positions = ["Session and read access", "Scoped retained jobs", "Evidence admission", "Replay and new information", "Execution gate"].map(s => html.indexOf(s));
    expect(positions.every((position, index) => position >= 0 && (index === 0 || position > positions[index - 1]))).toBe(true);
    expect(html).toContain("VERIFIED_FIXED_37"); expect(html).toContain("not fresh execution or runtime coverage of 069/070 code");
    expect(html).toContain("Fresh finite replay: NOT_RUN"); expect(html).toContain("Independent information: NOT_BOUND; batch: NOT_BOUND");
    expect(html.match(/NOT_ESTABLISHED/g)?.length).toBe(4);
  });
  it("the native manual read-only link never prefetches and preserves the selected case", () => {
    const html = render();
    expect(html).toContain(reloadHref.replaceAll("&", "&amp;")); expect(html).toContain("Reload current selection");
    const source = readFileSync("src/components/research/math-lrc-loop-readiness-panel.tsx", "utf8");
    expect(source).toContain("<a href={reloadHref}"); expect(source).not.toContain("next/link");
  });
  it("renders proposed unroutable tasks with exact retained refs and escaped literal reasons", () => {
    const literal = String.raw`<script>bad()</script> $\href{javascript:bad}{x}$ date2026-10-04 b^-1*t`;
    const dto = readinessUiFixture({ admittedCount: 1,
      cases: [{ caseId: readinessUiCaseId, status: "ADMITTED", reason: "RETAINED_ADMITTED", retainedJobs: "VERIFIED" }],
      tasks: [{ id: "a".repeat(64), findingKind: "PREMISE", findingId: "LOWER_LRC_1_12", route: "UNROUTABLE", associations: [], proofClosure: false,
        sources: [{ bindingId: readinessUiCaseId, ledgerDigest: "b".repeat(64), role: "CRITIC", findingKind: "PREMISE", findingId: "LOWER_LRC_1_12",
          findingDigest: "c".repeat(64), status: "OPEN", reason: literal, route: "UNROUTABLE", associationIds: [] }] }] });
    const html = render("en", dto);
    expect(html).toContain("1 admitted method-unit records"); expect(html).toContain("PROPOSED / UNROUTABLE");
    expect(html).toContain("Not queued, executed or proof-obligation closure");
    for (const ref of [readinessUiCaseId, "a".repeat(64), "b".repeat(64), "c".repeat(64)]) expect(html).toContain(ref);
    expect(html).toContain("&lt;script&gt;bad()&lt;/script&gt;"); expect(html).toContain(literal.slice(literal.indexOf("$")));
    expect(html).not.toContain("<script>bad()"); expect(html).not.toContain('href="javascript:bad"');
    expect(html).not.toContain('encoding="application/x-tex"'); expect(html).toContain("G2_NOT_AUTHORIZED");
  });
  it.each(["UNAVAILABLE", "INVALID_INPUT", "SOURCE_REFUSED", "OPERATIONAL_REFUSED"] as const)("%s cannot fabricate records or task refs", status => {
    const html = render("en", readinessUiFixture({ status, session: "UNAVAILABLE", sources: "NOT_VERIFIED", cases: [], tasks: [], admittedCount: 0 }));
    expect(html).toContain(status); expect(html).toContain("No admitted task references");
    expect(html).not.toContain(readinessUiCaseId + " / "); expect(html).not.toContain("Retained reason");
  });
  it.each(["RETAINED_INCOMPLETE", "INPUT_BINDING_REFUSED", "JOB_BINDING_REFUSED", "RESULT_ANCHOR_REFUSED", "RETAINED_EVIDENCE_REFUSED",
    "SOURCE_PINS_REFUSED", "INPUT_CAP_REFUSED", "OPERATIONAL_REFUSED", "COHORT_REFUSED"])("%s has non-placeholder English and Vietnamese direction", reason => {
    const dto = readinessUiFixture({ cases: [{ caseId: readinessUiCaseId, status: "REFUSED", reason: reason as LrcLoopReadinessDto["cases"][number]["reason"], retainedJobs: "NOT_ADMITTED" }] });
    for (const locale of ["vi", "en"]) {
      const html = render(locale, dto); expect(html).not.toContain("The safe check is not established");
      expect(html).not.toContain("Lượt kiểm an toàn chưa được thiết lập"); expect(html).toContain("NOT_ADMITTED");
    }
  });
  it("keeps rendering pure and input data unchanged", () => {
    const dto = readinessUiFixture(), before = JSON.stringify(dto);
    const first = render("en", dto); expect(render("en", dto)).toBe(first); expect(JSON.stringify(dto)).toBe(before);
    expect(first).not.toContain("membershipId"); expect(first).not.toContain("commandId"); expect(first).not.toContain("grant");
  });
  it("uses the existing tokens with wrapping/mobile rows and no privileged runtime imports", () => {
    const source = readFileSync("src/components/research/math-lrc-loop-readiness-panel.tsx", "utf8");
    expect(source).toContain('import type { LrcLoopReadinessDto }');
    expect(source).toContain("min-w-0"); expect(source).toContain("[overflow-wrap:anywhere]"); expect(source).toContain("max-w-[76ch]");
    expect(source).toContain('aria-labelledby="math-lrc-loop-readiness-title" className="min-w-0 scroll-mt-24"');
    expect(source).toContain("sm:grid-cols-[13rem_minmax(0,1fr)]"); expect(source).toContain("border-warning-600");
    expect(source).not.toMatch(/useEffect|setInterval|setTimeout|fetch\(|getDb|loadLrcLoopReadiness|use client|dangerouslySetInnerHTML|gradient|font-mono/);
  });
});
