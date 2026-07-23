import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { signUpToDashboard } from "./auth-helpers";

async function box(locator: import("@playwright/test").Locator) {
  const b = await locator.boundingBox();
  if (!b) throw new Error("element has no bounding box");
  return b;
}

test.describe("HIVE OS app shell", () => {
  test("DS-02 desktop shell hierarchy is present", async ({ page }) => {
    await page.setViewportSize({ width: 1536, height: 1024 });
    await signUpToDashboard(page);

    await expect(page.getByTestId("sidebar-desktop")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1, name: "Dashboard" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Start a new mission" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Active missions" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "HIVE OS mission workflow" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Mission overview" })).toBeVisible();
    await expect(page.getByRole("region", { name: "System metrics" })).toBeVisible();
  });

  test("DS-03 right rail reflows below 1180px", async ({ page }) => {
    await signUpToDashboard(page);
    const composer = page.getByRole("heading", { name: "Start a new mission" });
    const rail = page.getByRole("heading", { name: "Mission overview" });

    await page.setViewportSize({ width: 1280, height: 900 });
    const composerWide = await box(composer);
    const railWide = await box(rail);
    expect(railWide.x).toBeGreaterThan(composerWide.x + composerWide.width - 40);

    await page.setViewportSize({ width: 1000, height: 900 });
    const composerNarrow = await box(composer);
    const railNarrow = await box(rail);
    expect(railNarrow.y).toBeGreaterThan(composerNarrow.y + composerNarrow.height);
    expect(Math.abs(railNarrow.x - composerNarrow.x)).toBeLessThan(40);
  });

  test("DS-04 sidebar becomes icon rail below 1024px", async ({ page }) => {
    await signUpToDashboard(page);

    await page.setViewportSize({ width: 1280, height: 900 });
    await expect(page.getByTestId("sidebar-desktop")).toBeVisible();
    await expect(page.getByTestId("sidebar-iconrail")).toBeHidden();

    await page.setViewportSize({ width: 900, height: 900 });
    await expect(page.getByTestId("sidebar-desktop")).toBeHidden();
    const rail = page.getByTestId("sidebar-iconrail");
    await expect(rail).toBeVisible();

    // Evidence Hub remains an unimplemented, focusable disabled control.
    const evidence = rail.getByRole("button", { name: /Evidence Hub/ });
    await expect(evidence).toHaveAttribute("title", /Evidence Hub/);
    const dashboard = rail.getByRole("link", { name: "Dashboard" });
    await expect(dashboard).toHaveAttribute("title", "Dashboard");
    const missions = rail.getByRole("link", { name: "Missions" });
    await expect(missions).toHaveAttribute("title", "Missions");
  });

  test("DS-05 table projection stacks below 820px", async ({ page }) => {
    await signUpToDashboard(page);

    await page.setViewportSize({ width: 1000, height: 900 });
    await expect(page.getByRole("columnheader", { name: "Mission" })).toBeVisible();
    await expect(page.getByTestId("missions-empty-stacked")).toBeHidden();

    await page.setViewportSize({ width: 800, height: 900 });
    await expect(page.getByRole("columnheader", { name: "Mission" })).toBeHidden();
    await expect(page.getByTestId("missions-empty-stacked")).toBeVisible();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test("DS-06 mobile drawer replaces sidebar below 768px", async ({ page }) => {
    await page.setViewportSize({ width: 500, height: 900 });
    await signUpToDashboard(page);

    await expect(page.getByTestId("sidebar-desktop")).toBeHidden();
    await expect(page.getByTestId("sidebar-iconrail")).toBeHidden();

    const menu = page.getByRole("button", { name: "Open navigation" });
    await expect(menu).toBeVisible();
    await expect(page.getByRole("dialog", { name: "Navigation" })).toBeHidden();

    await menu.click();
    await expect(page.getByRole("dialog", { name: "Navigation" })).toBeVisible();
  });

  test("DS-07 drawer keyboard open/close and focus return", async ({ page }) => {
    await page.setViewportSize({ width: 500, height: 900 });
    await signUpToDashboard(page);

    const menu = page.getByRole("button", { name: "Open navigation" });
    await menu.focus();
    await page.keyboard.press("Enter");

    const dialog = page.getByRole("dialog", { name: "Navigation" });
    await expect(dialog).toBeVisible();
    await expect(page.getByRole("button", { name: "Close navigation" })).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(menu).toBeFocused();
  });

  test("DS-08 no horizontal overflow at 390px", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await signUpToDashboard(page);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test("DS-09 mission composer is the first actionable main element", async ({ page }) => {
    await signUpToDashboard(page);
    const firstId = await page.evaluate(() => {
      const main = document.getElementById("main-content");
      if (!main) return null;
      const el = main.querySelector<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      return el?.id ?? null;
    });
    expect(firstId).toBe("mission-objective");
  });

  test("DS-10 no fabricated metric or mission fixture is rendered", async ({ page }) => {
    await signUpToDashboard(page);

    await expect(page.getByText("No active missions").first()).toBeVisible();
    await expect(page.getByText("Authoritative workspace totals")).toBeVisible();
    await expect(page.getByText("No mission selected")).toBeVisible();
    await expect(page.getByText("No measured resource usage")).toBeVisible();

    const text = await page.evaluate(() => {
      const main = document.getElementById("main-content");
      return main?.innerText ?? "";
    });
    expect(text).not.toMatch(/\d+(\.\d+)?%/);
    expect(text).not.toMatch(/\d{1,3}(,\d{3})+/);
  });

  test("DS-11 automated accessibility scan has no serious/critical violations", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1536, height: 1024 });
    await signUpToDashboard(page);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    const serious = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );
    expect(
      serious,
      serious.map((v) => `${v.id}: ${v.help}`).join("\n"),
    ).toEqual([]);
  });
});
