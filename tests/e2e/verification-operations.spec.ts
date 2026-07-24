import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { signUpToDashboard } from "./auth-helpers";

test.describe("TIP-016 Verification Operations", () => {
  test("VO-01 exposes the complete governed release sequence honestly", async ({
    page,
  }) => {
    const { dashboardUrl } = await signUpToDashboard(
      page,
      "Verification Desk QA",
    );
    await page.goto(`${dashboardUrl}/verification`);

    await expect(
      page.getByRole("heading", {
        name: "Evidence becomes releasable only after it survives the gate.",
      }),
    ).toBeVisible();
    await expect(
      page.getByLabel("Verification and release sequence"),
    ).toContainText("01Scenario02Verifier03Report04Sign-off05Manifest06Release");
    await expect(page.getByText("No Verify Report yet")).toBeVisible();
    await page.getByText("Begin independent verification", { exact: true }).click();
    await expect(
      page.getByText(
        "A building Mission and an unused completed VERIFIER attempt are required.",
      ),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Verification" }),
    ).toHaveAttribute("href", /\/verification$/);
  });

  test("VO-02 is accessible and overflow-free at 320px", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 844 });
    const { dashboardUrl } = await signUpToDashboard(
      page,
      "Verification Mobile",
    );
    await page.goto(`${dashboardUrl}/verification`);

    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      ),
    ).toBeLessThanOrEqual(1);
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
});
