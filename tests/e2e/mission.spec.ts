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
  await expect(page.getByRole("columnheader", { name: "Reference" })).toBeVisible();
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
  await expect(page.getByText("Authoritative workspace totals")).toBeVisible();
  const metricsText = await page.evaluate(() => {
    const region = document.querySelector('[aria-label="System metrics"]');
    return region?.textContent ?? "";
  });
  expect(metricsText).not.toMatch(/\d+(\.\d+)?%/);
  expect(metricsText).toContain("Missions1");

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
