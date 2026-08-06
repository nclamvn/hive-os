import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

import { signUpToDashboard } from "./auth-helpers";

async function createMission(page: Page, dashboardUrl: string) {
  await page.goto(`${dashboardUrl}/missions/new`);
  await page.getByLabel("Mission title").fill("Governed research dossier");
  await page.getByLabel("Objective").fill("Retain cited research findings.");
  await page.getByLabel("Scope").fill("Primary and independent sources.");
  await page.getByLabel("Success definition").fill("Independently reviewed findings.");
  await page.getByLabel("Requirement title").fill("Source integrity");
  await page.getByLabel("Acceptance criteria").fill("Every finding has an exact source span.");
  await page.getByLabel("Obligation title").fill("Independent review");
  await page.getByRole("button", { name: "Create mission" }).click();
  await page.waitForURL(/\/missions\/[0-9a-f-]{36}/);
}

test("TIP-024D-E2E-01 guides a bounded research request and reports the honest worker state", async ({ page }) => {
  const { dashboardUrl } = await signUpToDashboard(page, "Research QA");
  await createMission(page, dashboardUrl);
  await page.goto(`${dashboardUrl}/research`);
  await expect(page.getByRole("heading", { name: "Know what to do. Know what the system is doing." })).toBeVisible();
  await expect(page.getByText("A worker claims work automatically after the research adapter is activated.")).toBeVisible();
  await expect(page.getByLabel("Query plan, one query per line")).not.toBeVisible();
  await expect(page.getByText("Open advanced Jupyter, CAS, or LaTeX tools")).toBeVisible();
  await expect(page.getByLabel("Immutable input reference")).not.toBeVisible();
  await page.getByLabel("Research question").fill("What retained evidence is required?");
  await page.getByLabel("Scope and exclusion criteria").fill("Official protocols; exclude unsupported summaries.");
  await page.getByRole("button", { name: "Assign to worker" }).click();
  await expect(page.getByText("Waiting for worker").first()).toBeVisible();
  await expect(page.getByText("Live tracking, refreshing every 5 seconds")).toBeVisible();
  await expect(page.getByText(/The worker will claim this automatically/).first()).toBeVisible();
  const scan = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  expect(scan.violations.filter((item) => item.impact === "serious" || item.impact === "critical")).toEqual([]);
});

test("TIP-024D-E2E-02 guided research has no horizontal overflow on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const { dashboardUrl } = await signUpToDashboard(page, "Research Mobile");
  await createMission(page, dashboardUrl);
  await page.goto(`${dashboardUrl}/research`);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
