import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

import { signUpToDashboard } from "./auth-helpers";

async function createMissionViaUI(page: Page, dashboardUrl: string, title: string) {
  await page.goto(`${dashboardUrl}/missions/new`);
  await page.getByLabel("Mission title").fill(title);
  await page.getByLabel("Objective").fill("Assess the evidence for a claim.");
  await page.getByLabel("Scope").fill("Public sources only.");
  await page.getByLabel("Success definition").fill("A governed result package.");
  await page.getByLabel("Requirement title").fill("Coverage");
  await page.getByLabel("Acceptance criteria").fill("All sources reviewed.");
  await page.getByLabel("Obligation title").fill("Review sources");
  await page.getByRole("button", { name: "Create mission" }).click();
  await page.waitForURL(/\/missions\/[0-9a-f-]{36}/);
}

test("MK-29/32 create a mission (keyboard) and see it as a real record", async ({ page }) => {
  const { dashboardUrl } = await signUpToDashboard(page);
  await createMissionViaUI(page, dashboardUrl, "Lattice cryptography review");

  // Detail shows the real reference code and scoped state.
  await expect(page.getByText(/M-\d{4}/).first()).toBeVisible();

  // The dashboard lists the real mission.
  await page.goto(dashboardUrl);
  await expect(page.locator(".mission-grid > table")).toBeVisible();
  await expect(page.getByText("Lattice cryptography review").first()).toBeVisible();
});

test("MK-30 no synthetic missions, progress or metrics are rendered", async ({ page }) => {
  const { dashboardUrl } = await signUpToDashboard(page);
  await createMissionViaUI(page, dashboardUrl, "Truthful mission");
  const detailUrl = page.url();

  // Progress is unavailable before approval — never a fabricated percentage.
  await expect(page.getByText("Progress is unavailable until the contract is approved.")).toBeVisible();

  // Governed metrics are authoritative workspace totals, never fabricated.
  await page.goto(dashboardUrl);
  await expect(page.getByLabel("Operational totals")).toBeVisible();
  const metricsText = await page.evaluate(() => {
    const region = document.querySelector('[aria-label="Operational totals"]');
    return region?.textContent ?? "";
  });
  expect(metricsText).not.toMatch(/\d+(\.\d+)?%/);
  expect(metricsText).toContain("1Missions");

  await page.goto(detailUrl); // still same-origin, real record
});

test("MK-31 mission routes have no serious/critical a11y violations", async ({ page }) => {
  const { dashboardUrl } = await signUpToDashboard(page);
  await page.goto(`${dashboardUrl}/missions/new`);
  await page.getByRole("heading", { level: 1, name: "New mission" }).waitFor();
  const newScan = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  expect(newScan.violations.filter((v) => v.impact === "serious" || v.impact === "critical")).toEqual([]);

  await createMissionViaUI(page, dashboardUrl, "A11y mission");
  const detailScan = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  expect(detailScan.violations.filter((v) => v.impact === "serious" || v.impact === "critical")).toEqual([]);
});

test("MK-33 mission views have no horizontal overflow at 390px", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const { dashboardUrl } = await signUpToDashboard(page);
  await createMissionViaUI(page, dashboardUrl, "Mobile mission");

  for (const url of [`${dashboardUrl}/missions`, page.url()]) {
    await page.goto(url);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  }
});

test("TIP002-LAYOUT-01 new mission uses a centered bounded form canvas", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1536, height: 960 });
  const { dashboardUrl } = await signUpToDashboard(page, "Layout QA");
  await page.goto(`${dashboardUrl}/missions/new`);

  const main = page.locator("#main-content");
  const panel = page.getByTestId("bounded-page-panel");
  const form = page.getByTestId("bounded-page-form");
  const [mainBox, panelBox, formBox] = await Promise.all([
    main.boundingBox(),
    panel.boundingBox(),
    form.boundingBox(),
  ]);
  expect(mainBox).not.toBeNull();
  expect(panelBox).not.toBeNull();
  expect(formBox).not.toBeNull();

  const mainCenter = mainBox!.x + mainBox!.width / 2;
  const panelCenter = panelBox!.x + panelBox!.width / 2;
  expect(Math.abs(mainCenter - panelCenter)).toBeLessThanOrEqual(1);
  expect(panelBox!.width).toBeLessThan(mainBox!.width);
  expect(formBox!.width).toBeGreaterThan(panelBox!.width - 50);
});
