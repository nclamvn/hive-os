import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { signUpToDashboard } from "./auth-helpers";

test.describe("TIP-010/011 product surfaces", () => {
  test("DB-01 Mission Command renders authoritative totals and governed context", async ({
    page,
  }) => {
    const { dashboardUrl } = await signUpToDashboard(page, "Product Surface");
    await expect(page.getByLabel("Operational totals")).toContainText("Missions0");
    await expect(page.getByLabel("Active scope")).toContainText("Product Surface");
    await expect(page.getByText("No selection")).toBeVisible();
    await expect(page.getByText("No mission matches this operational view.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Open command palette" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Reports" })).toBeVisible();
    expect(dashboardUrl).toMatch(/\/w\//);
  });

  test("OBS-01/REP-01 expose honest manifest-backed empty states", async ({
    page,
  }) => {
    const { dashboardUrl } = await signUpToDashboard(page, "Governed Publication");
    await page.goto(`${dashboardUrl}/observatory`);
    await expect(
      page.getByRole("heading", {
        name: "Public truth begins at the release manifest.",
      }),
    ).toBeVisible();
    await expect(page.getByText("No public releases")).toBeVisible();

    await page.goto(`${dashboardUrl}/reports`);
    await expect(page.getByRole("heading", { name: "Verify Reports" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Release bundles" })).toBeVisible();
    await expect(page.getByText("No Verify Reports")).toBeVisible();
    await expect(page.getByText("No release bundles")).toBeVisible();

    const scan = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    expect(
      scan.violations.filter(
        (violation) =>
          violation.impact === "serious" || violation.impact === "critical",
      ),
    ).toEqual([]);
  });

  test("OBS-02 remains overflow-free on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const { dashboardUrl } = await signUpToDashboard(page, "Mobile Publication");
    for (const path of ["", "/observatory", "/reports"]) {
      await page.goto(`${dashboardUrl}${path}`);
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(1);
    }
  });
});
