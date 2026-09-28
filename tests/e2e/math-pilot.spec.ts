import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

import { signUpToDashboard } from "./auth-helpers";

async function createMathMission(page: Page, dashboardUrl: string) {
  await page.goto(`${dashboardUrl}/missions/new`);
  await page.getByLabel("Mission title").fill("Mathematics pilot");
  await page.getByLabel("Objective").fill("Calibrate mathematical research before an open problem.");
  await page.getByLabel("Scope").fill("Elementary known-answer cases first.");
  await page.getByLabel("Success definition").fill("Independent assessment without proof inflation.");
  await page.getByLabel("Requirement title").fill("Frozen problem protocol");
  await page.getByLabel("Acceptance criteria").fill("Each problem statement has a stable digest.");
  await page.getByLabel("Obligation title").fill("Independent review");
  await page.getByRole("button", { name: "Create mission" }).click();
  await page.waitForURL(/\/missions\/[0-9a-f-]{36}/);
}

test("MATH-PILOT-01 queues a sealed calibration while the open problem remains gated", async ({ page }) => {
  const { dashboardUrl } = await signUpToDashboard(page, "Math Pilot QA");
  await createMathMission(page, dashboardUrl);
  await page.goto(`${dashboardUrl}/research`);
  await page.getByRole("link", { name: "Mathematics research pilot" }).click();
  await expect(page).toHaveURL(/\/research\/math-pilot/);
  await expect(page.locator("#main-content").getByRole("heading", { name: "Mathematics research pilot" })).toBeVisible();
  await expect(page.getByText("Unlocks only when both calibrations pass")).toBeVisible();
  await expect(page.getByLabel("Exact statement")).toHaveCount(0);
  await page.getByRole("button", { name: "Run this case" }).first().click();
  await expect(page.getByText("Contract digest:")).toBeVisible();
  await expect(page.getByText("QUEUED")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Review and acceptance desk" })).toBeVisible();
});

test("MATH-PILOT-02 remains accessible without mobile overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const { dashboardUrl } = await signUpToDashboard(page, "Math Pilot Mobile");
  await createMathMission(page, dashboardUrl);
  await page.goto(`${dashboardUrl}/research/math-pilot`);
  await page.getByRole("button", { name: "Run this case" }).first().click();
  await expect(page.getByRole("heading", { name: "Review and acceptance desk" })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  const scan = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  expect(scan.violations.filter((item) => item.impact === "serious" || item.impact === "critical")).toEqual([]);
});
