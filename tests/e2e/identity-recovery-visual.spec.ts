import path from "node:path";

import { test, type Page } from "@playwright/test";

import { setLocale, signUpToDashboard } from "./auth-helpers";

const DIR = path.resolve(__dirname, "../../artifacts/tip-021a/screenshots");
const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };

async function shoot(page: Page, name: string) {
  await page.screenshot({
    path: path.join(DIR, `${name}.png`),
    fullPage: false,
  });
}

async function capture(page: Page, name: string, url: string) {
  await setLocale(page, "en");
  await page.setViewportSize(DESKTOP);
  await page.goto(url);
  await shoot(page, `${name}-desktop`);
  await page.setViewportSize(MOBILE);
  await page.goto(url);
  await shoot(page, `${name}-390`);
}

test("capture recovery surfaces (evidence)", async ({ page }) => {
  await capture(page, "sign-up-check-email", "/check-email?intent=signup");
  await capture(page, "verify-email-success", "/verify-email?status=complete");
  await capture(page, "forgot-password", "/forgot-password");
  await capture(page, "reset-password", "/reset-password");
});

test("capture security settings (evidence)", async ({ page }) => {
  await signUpToDashboard(page);
  await page.setViewportSize(DESKTOP);
  await page.goto("/settings/security");
  await shoot(page, "security-settings-desktop");
  await page.setViewportSize(MOBILE);
  await page.goto("/settings/security");
  await shoot(page, "security-settings-390");
});
