import AxeBuilder from "@axe-core/playwright";
import { expect,test,type Page } from "@playwright/test";
import { signUpToDashboard,setLocale } from "./auth-helpers";

async function ownMission(page:Page,dashboardUrl:string) {
  await page.goto(`${dashboardUrl}/missions/new`);
  await page.getByLabel("Mission title").fill("TIP076 isolated engineering control");
  await page.getByLabel("Objective").fill("Observe exact own controlled campaign evidence; no mathematical root claim.");
  await page.getByLabel("Scope").fill("Public fixed software controls in isolated QA only.");
  await page.getByLabel("Success definition").fill("Retained worker receipt and independent post-run grade visible.");
  await page.getByLabel("Requirement title").fill("Exact scoped observation");
  await page.getByLabel("Acceptance criteria").fill("No global theorem or live superiority inferred.");
  await page.getByLabel("Obligation title").fill("Preserve retained charges and evidence");
  await page.getByRole("button",{name:"Create mission"}).click();
  await page.waitForURL(/\/missions\/[0-9a-f-]{36}/);
  const missionId=new URL(page.url()).pathname.split("/").at(-1)!;
  await page.goto(`${dashboardUrl}/research/math-pilot?missionId=${missionId}#research-campaign-v3`);
  return {missionId,url:page.url()};
}

test("TIP076D actual owned commands, worker checks and independent retained grades",async({page})=>{
  const {dashboardUrl,email}=await signUpToDashboard(page,"TIP076 Campaign Engineering");
  const {missionId}=await ownMission(page,dashboardUrl);
  test.info().annotations.push({type:"isolated-QA observation",description:JSON.stringify({email,dashboardUrl,missionId})});
  const region=page.locator("#research-campaign-v3");
  await expect(region.getByText("CONTROLLED_LOCAL · engineering only",{exact:true})).toBeVisible();
  const profiles=await region.locator('select[name="profileId"] option').evaluateAll(options=>options.map(o=>(o as HTMLOptionElement).value));
  expect(profiles.length).toBeGreaterThanOrEqual(3);
  // Catalog-owned values, no domain dispatch or candidate bytes in the browser.
  for(const profileId of profiles) {
    await test.step(`Retain exact catalog control ${profileId}`,async()=>{
      const previousId=new URL(page.url()).searchParams.get("campaignId");
      await region.locator('select[name="profileId"]').selectOption(profileId);
      await Promise.all([
        page.waitForURL(url=>url.pathname.endsWith("/research/math-pilot") && url.searchParams.get("missionId")===missionId && Boolean(url.searchParams.get("campaignId")) && url.searchParams.get("campaignId")!==previousId),
        region.getByRole("button",{name:"Run controlled campaign",exact:true}).click(),
      ]);
      const campaignId=new URL(page.url()).searchParams.get("campaignId")!;
      expect(campaignId).toMatch(/^[0-9a-f-]{36}$/);
      const article=region.locator(`article[data-campaign-id="${campaignId}"]`);
      await expect(article).toBeVisible();
      await expect(article.locator('[data-postgrade-status="ACCEPTED_EXACT_SCOPE"]')).toBeVisible();
      await expect(article.getByText("COMPLETED",{exact:true})).toBeVisible();
      await expect(article.getByText("VERIFIED / VERIFIED_EXACT_SCOPE",{exact:false})).toBeVisible();
      await expect(article.getByText("Candidate attempts preserved: 1",{exact:false})).toHaveCount(1);
      await expect(article.getByText("Separate post-run reservations",{exact:true})).toBeVisible();
      await expect(article.getByText("SIMULATED test accounting",{exact:false})).toBeVisible();
      await page.reload();
      await expect(article).toBeVisible();
      await expect(article.locator('[data-postgrade-status="ACCEPTED_EXACT_SCOPE"]')).toBeVisible();
      await expect(article.getByRole("button",{name:"Revoke campaign authority"})).toHaveCount(0);
    });
  }
  for(const width of [1280,390,320]) {
    await page.setViewportSize({width,height:844});await page.reload();
    await expect(region.locator('[data-postgrade-status="ACCEPTED_EXACT_SCOPE"]')).toBeVisible();
    await expect(region.getByRole("heading",{name:"Exact target",exact:true})).toBeVisible();
    await expect(region.getByRole("heading",{name:"Open obligations",exact:true})).toBeVisible();
    await expect(region.getByRole("heading",{name:"Next action",exact:true})).toBeVisible();
    await expect(region.getByRole("heading",{name:"Checked scope",exact:true})).toBeVisible();
    await expect(region.getByText("UNKNOWN",{exact:true})).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
    await page.screenshot({path:`artifacts/tip076/retained-campaign-${width}.png`,fullPage:false});
  }
  await expect(region.getByText("Live comparative superiority: NOT_RUN",{exact:false})).toBeVisible();
  await expect(region.locator('input[name="provider"],input[name="candidateBytes"]')).toHaveCount(0);
});

test("TIP076D existing math pilot remains accessible across locale/theme/mobile",async({page})=>{
  const {dashboardUrl}=await signUpToDashboard(page,"TIP076 Campaign Layout");
  await ownMission(page,dashboardUrl);
  const region=page.locator("#research-campaign-v3");
  for(const locale of ["en","vi"] as const) {
    await setLocale(page,locale);
    for(const theme of ["light","dark"] as const) {
      await page.evaluate(value=>localStorage.setItem("hive-appearance",value),theme);
      for(const width of [1280,390,320]) {
        await page.setViewportSize({width,height:844});await page.reload();
        await expect(page.locator("html")).toHaveAttribute("lang",locale);
        await expect(page.locator("html")).toHaveAttribute("data-theme",theme);
        await expect(region.getByRole("button",{name:locale==="vi"?"Chạy chiến dịch đối chứng":"Run controlled campaign"})).toBeVisible();
        expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
        await page.screenshot({path:`artifacts/tip076/${locale}-${theme}-${width}.png`,fullPage:false});
      }
    }
  }
  await setLocale(page,"en");await page.reload();
  await expect(page.getByRole("button",{name:"Run this case"}).first()).toBeVisible();
  await expect(page.locator(".katex").first()).toBeVisible();
  await region.getByRole("button",{name:"Run controlled campaign"}).focus();
  await expect(region.getByRole("button",{name:"Run controlled campaign"})).toBeFocused();
  const scan=await new AxeBuilder({page}).include("#research-campaign-v3").withTags(["wcag2a","wcag2aa"]).analyze();
  expect(scan.violations.filter(v=>v.impact==="serious"||v.impact==="critical")).toEqual([]);
});
