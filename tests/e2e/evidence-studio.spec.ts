import AxeBuilder from "@axe-core/playwright";
import {expect,test} from "@playwright/test";
import {signUpToDashboard,setLocale} from "./auth-helpers";
import {readFileSync} from "node:fs";
import {createElement} from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {EvidenceStudioPanel} from "@/components/research/evidence-studio-panel";
import {projectStudio,type SelectedQuery} from "@/modules/research-evidence-studio/presentation";
import {studioAnchor} from "@/modules/research-evidence-studio/annotations";
const runId="8ec3fa5b-d423-4055-85ba-c2764ace4fdf",missionId="c999b840-3b6a-4b8b-b99d-b567072c007b";
test.use({trace:"off",screenshot:"off"});
test("TIP081 anonymous and fresh cross-tenant refusal; no leaked original",async({page,browser})=>{
  const {dashboardUrl}=await signUpToDashboard(page,"TIP081 ENGINEERING_ONLY Refusal"),slug=new URL(dashboardUrl).pathname.split("/")[2],route=`/w/${slug}/research/evidence-studio?missionId=${missionId}&runId=${runId}`;
  await page.goto(route);const region=page.getByTestId("evidence-studio");await expect(region).toHaveAttribute("data-state","out-of-scope");await expect(region.locator("[data-studio-original]")).toHaveCount(0);await expect(region).not.toContainText("499999999972");
  const anonymous=await browser.newContext({baseURL:"http://127.0.0.1:3004"});try{const p=await anonymous.newPage();await p.goto(route);await expect(p).toHaveURL(/\/sign-in/);const r=await anonymous.request.get(`/api/w/${slug}/research/permutations/${runId}/export`);expect(r.status()).toBe(401);await r.dispose();}finally{await anonymous.close();}
  const denied=await page.request.get(`/api/w/${slug}/research/permutations/${runId}/export`);expect([403,404]).toContain(denied.status());await denied.dispose();
});
test("TIP081 empty/deep-link states, ordinary UI and 2x2x5 accessibility",async({page})=>{
  const {dashboardUrl}=await signUpToDashboard(page,"TIP081 ENGINEERING_ONLY Layout"),base=`${dashboardUrl}/research/evidence-studio`;await page.goto(base);const region=page.getByTestId("evidence-studio");await expect(region).toHaveAttribute("data-state","empty");
  for(const locale of ["vi","en"] as const){await setLocale(page,locale);for(const theme of ["light","dark"] as const){await page.evaluate(v=>localStorage.setItem("hive-appearance",v),theme);for(const width of [320,390,768,1280,1536]){await page.setViewportSize({width,height:900});await page.reload();await expect(page.locator("html")).toHaveAttribute("lang",locale);await expect(page.locator("html")).toHaveAttribute("data-theme",theme);await expect(region).toHaveAttribute("data-state","empty");expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);const scan=await new AxeBuilder({page}).include('[data-testid="evidence-studio"]').withTags(["wcag2a","wcag2aa"]).analyze();expect(scan.violations.filter(v=>v.impact==="serious"||v.impact==="critical")).toEqual([]);}}}
  await page.emulateMedia({reducedMotion:"reduce"});await page.goto(`${base}?missionId=${missionId}&runId=${runId}&view=proof&step=arithmetic&event=11`);await expect(region).toHaveAttribute("data-state","out-of-scope");await page.reload();await expect(region).toHaveAttribute("data-state","out-of-scope");await page.goto(`${base}?missionId=${missionId}&runId=${runId}&view=proof&event=12`);await expect(region).toHaveAttribute("data-state","out-of-scope");await page.goto(dashboardUrl);await expect(page.getByRole("heading",{level:1})).toBeVisible();
});
test("TIP081 ENGINEERING_RENDER_ONLY exact ready proof 2x2x5 scoped Axe and formula keyboard",async({page})=>{
  // Not authenticated completed-run acceptance: this is an explicitly labelled
  // component rendering control. No session extraction or owner impersonation.
  await page.goto("/sign-in");const origin="http://127.0.0.1:3004";
  const styles=await page.locator('link[rel="stylesheet"]').evaluateAll(nodes=>nodes.map(n=>(n as HTMLLinkElement).href));
  if(!styles.length||styles.some(s=>{const u=new URL(s);return u.origin!==origin||!u.pathname.startsWith("/_next/static/")||!u.pathname.endsWith(".css");}))throw new Error("TIP081_RENDER_STYLE_REFUSED");
  const body=readFileSync("artifacts/tip080/run-8ec3fa5b/completed-export.json","utf8"),model=projectStudio(body,studioAnchor.missionId),query:SelectedQuery={status:"selected",missionId,runId,view:"proof",step:"arithmetic",event:11};
  for(const locale of ["vi","en"] as const){for(const theme of ["light","dark"] as const){const markup=renderToStaticMarkup(createElement(EvidenceStudioPanel,{result:{status:"ready",model},query,slug:"engineering-render-only",locale}));for(const width of [320,390,768,1280,1536]){
    await page.setViewportSize({width,height:900});await page.setContent(`<!doctype html><html lang="${locale}" data-theme="${theme}"><head><title>TIP081 ENGINEERING_RENDER_ONLY</title>${styles.map(s=>`<link rel="stylesheet" href="${s}">`).join("")}</head><body><main>${markup}</main></body></html>`,{waitUntil:"networkidle"});
    const region=page.getByTestId("evidence-studio");await expect(region).toHaveAttribute("data-state","ready");await expect(region.locator('[data-proof-step="arithmetic"]')).toBeVisible();await expect(region.getByTestId("studio-formula").first().locator(".katex")).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
    const scan=await new AxeBuilder({page}).include('[data-testid="evidence-studio"]').withTags(["wcag2a","wcag2aa"]).analyze();expect(scan.violations.filter(v=>v.impact==="serious"||v.impact==="critical")).toEqual([]);
  }}}
  await page.setViewportSize({width:320,height:900});await page.emulateMedia({reducedMotion:"reduce"});const formula=page.getByTestId("studio-formula").first();await formula.focus();await expect(formula).toBeFocused();expect(await formula.evaluate(e=>getComputedStyle(e).outlineStyle)).not.toBe("none");await page.keyboard.press("Tab");await expect(formula).not.toBeFocused();await page.keyboard.press("Shift+Tab");await expect(formula).toBeFocused();
  test.info().annotations.push({type:"ENGINEERING_RENDER_ONLY",description:"Exact080 projection in owned static component DOM; not actual owner auth/read acceptance."});
});
