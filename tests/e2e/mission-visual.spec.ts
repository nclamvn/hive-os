import { existsSync } from "node:fs";
import path from "node:path";

import { expect, test, type Page } from "@playwright/test";

import { signUpToDashboard } from "./auth-helpers";

const DIR = path.resolve(__dirname, "../../artifacts/tip-004");
const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };

async function shoot(page: Page, name: string) {
  const file = path.join(DIR, `${name}-viewport.png`);
  await page.screenshot({ path: file, fullPage: false });
  expect(existsSync(file)).toBe(true);
}

async function createMission(page: Page, dashboardUrl: string) {
  await page.goto(`${dashboardUrl}/missions/new`);
  await page.getByLabel("Mission title").fill("Lattice-based cryptography review");
  await page.getByLabel("Objective").fill("Assess the evidence for a technical claim and report limitations.");
  await page.getByLabel("Scope").fill("Public sources only.");
  await page.getByLabel("Success definition").fill("A governed result package with explicit limitations.");
  await page.getByLabel("Requirement title").fill("Source coverage");
  await page.getByLabel("Acceptance criteria").fill("All qualifying sources reviewed.");
  await page.getByLabel("Obligation title").fill("Review sources");
  await page.getByRole("button", { name: "Create mission" }).click();
  await page.waitForURL(/\/missions\/[0-9a-f-]{36}/);
}

test("capture mission surfaces", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  const { dashboardUrl } = await signUpToDashboard(page, "Evidence Lab");

  await createMission(page, dashboardUrl);
  const detailUrl = page.url();
  await shoot(page, "mission-detail-desktop");
  await page.setViewportSize(MOBILE);
  await shoot(page, "mission-detail-mobile");

  await page.setViewportSize(DESKTOP);
  await page.goto(`${dashboardUrl}/missions`);
  await page.getByRole("heading", { level: 1, name: "Missions" }).waitFor();
  await shoot(page, "missions-list-desktop");
  await page.setViewportSize(MOBILE);
  await shoot(page, "missions-list-mobile");

  await page.setViewportSize(DESKTOP);
  await page.goto(`${dashboardUrl}/missions/new`);
  await page.getByRole("heading", { level: 1, name: "New mission" }).waitFor();
  await shoot(page, "mission-new-desktop");

  expect(detailUrl).toContain("/missions/");
});
