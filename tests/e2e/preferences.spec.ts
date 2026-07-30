import { expect, test } from "@playwright/test";

import { signUpToDashboard } from "./auth-helpers";

test.describe("TIP-002A locale and appearance", () => {
  test("first visit is Vietnamese and follows the operating-system theme", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await signUpToDashboard(page, "Xưởng kiểm chứng", "vi");

    await expect(page.locator("html")).toHaveAttribute("lang", "vi");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(
      page.getByRole("heading", { level: 1, name: "Tổng quan" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Biến ý định thành sự thật có thể kiểm chứng.",
      }),
    ).toBeVisible();
  });

  test("explicit locale and appearance persist without losing composer input", async ({
    page,
  }) => {
    await signUpToDashboard(page, "Preference Lab", "en");

    const objective = page.getByLabel("Mission objective");
    await objective.fill("Preserve this objective across a locale refresh.");

    await page
      .getByTestId("preferences-compact")
      .getByRole("button", { name: "Language: EN" })
      .click();
    await expect(page.locator("html")).toHaveAttribute("lang", "vi");
    await expect(
      page.getByRole("heading", { level: 1, name: "Tổng quan" }),
    ).toBeVisible();
    await expect(page.getByLabel("Mục tiêu nhiệm vụ")).toHaveValue(
      "Preserve this objective across a locale refresh.",
    );

    await page
      .getByTestId("preferences-compact")
      .getByRole("button", { name: "Giao diện: Hệ thống" })
      .click();
    await page
      .getByTestId("preferences-compact")
      .getByRole("button", { name: "Giao diện: Sáng" })
      .click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    expect(
      await page.evaluate(() => localStorage.getItem("hive-appearance")),
    ).toBe("dark");

    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("lang", "vi");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });
});
