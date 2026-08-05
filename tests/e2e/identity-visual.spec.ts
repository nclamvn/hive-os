import { existsSync } from "node:fs";
import path from "node:path";

import { expect, test, type Page } from "@playwright/test";

import {
  markEmailVerified,
  setLocale,
  signIn,
  signUp,
  signUpToDashboard,
  uniqueEmail,
} from "./auth-helpers";

const DIR = path.resolve(__dirname, "../../artifacts/tip-003");
const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };

async function shoot(page: Page, name: string) {
  const file = path.join(DIR, `${name}-viewport.png`);
  await page.screenshot({ path: file, fullPage: false });
  expect(existsSync(file)).toBe(true);
}

test("capture sign-in", async ({ page }) => {
  await setLocale(page, "en");
  await page.setViewportSize(DESKTOP);
  await page.goto("/sign-in");
  await page.getByRole("heading", { level: 1, name: "Sign in" }).waitFor();
  await shoot(page, "sign-in-desktop");
  await page.setViewportSize(MOBILE);
  await shoot(page, "sign-in-mobile");
});

test("capture onboarding", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  // TIP-021A: reach onboarding through the verified-then-signed-in flow.
  const email = uniqueEmail("onboard");
  await signUp(page, email);
  await markEmailVerified(email);
  await signIn(page, email);
  await page.waitForURL("**/onboarding");
  await shoot(page, "onboarding-desktop");
  await page.setViewportSize(MOBILE);
  await shoot(page, "onboarding-mobile");
});

test("capture workspace settings, members, audit", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  const { dashboardUrl } = await signUpToDashboard(page, "Evidence Lab");

  await page.goto(`${dashboardUrl}/settings/workspace`);
  await page
    .getByRole("heading", { level: 1, name: "Workspace settings" })
    .waitFor();
  await shoot(page, "settings-workspace-desktop");
  await page.setViewportSize(MOBILE);
  await shoot(page, "settings-workspace-mobile");

  await page.setViewportSize(DESKTOP);
  await page.goto(`${dashboardUrl}/settings/members`);
  await page.getByRole("heading", { level: 1, name: "Members" }).waitFor();
  await shoot(page, "settings-members-desktop");

  await page.goto(`${dashboardUrl}/settings/audit`);
  await page.getByRole("heading", { level: 1, name: "Audit" }).waitFor();
  await shoot(page, "settings-audit-desktop");
});
