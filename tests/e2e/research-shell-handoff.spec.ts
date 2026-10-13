import { expect, test } from "@playwright/test";

import { signUpToDashboard } from "./auth-helpers";

test("research entry and account actions stay usable across desktop, tablet and mobile", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  const { dashboardUrl } = await signUpToDashboard(page, "Research handoff");
  await page.goto(`${dashboardUrl}/research`);
  await expect(page.getByRole("heading", { name: "Choose where to start" })).toBeVisible();
  await page.getByRole("link", { name: "Poly19 proof and evidence", exact: false }).first().click();
  await expect(page).toHaveURL(/\/research\/poly19/);
  await expect(page.getByRole("heading", { level: 1, name: "Native Poly19 demonstration" })).toBeVisible();
  await expect(page.getByTestId("sidebar-desktop").getByRole("link", { name: "Research", exact: true }))
    .toHaveAttribute("aria-current", "page");

  await page.setViewportSize({ width: 900, height: 900 });
  const rail = page.getByTestId("sidebar-iconrail");
  await rail.locator("summary").click();
  await expect(rail.getByRole("link", { name: "Account security" })).toBeVisible();
  await expect(rail.getByRole("button", { name: "Sign out", exact: true })).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  const menu = page.getByRole("button", { name: "Open navigation" });
  await menu.click();
  const dialog = page.getByRole("dialog", { name: "Navigation", exact: true });
  const account = dialog.locator("summary").last();
  await account.focus();
  await page.keyboard.press("Tab");
  await expect(dialog.getByRole("button", { name: "Close navigation" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(account).toBeFocused();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
  await expect(dialog.getByRole("link", { name: "Account security" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(menu).toBeFocused();

  await menu.click();
  await expect(dialog).toBeVisible();
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  await page.setViewportSize({ width: 900, height: 900 });
  await expect(dialog).toBeHidden();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await expect(page.locator("#main-content")).toBeFocused();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(dialog).toBeHidden();
  await menu.click();
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
});
