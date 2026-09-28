import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import {
  E2E_PASSWORD,
  markEmailVerified,
  setLocale,
  signIn,
  signUp,
  uniqueEmail,
} from "./auth-helpers";

test("L10N-01 identity recovery defaults to Vietnamese and switches completely to English", async ({
  page,
}) => {
  await page.context().clearCookies();
  await page.goto("/sign-in");

  // Automated and deployed runtimes must never receive the local demo pair.
  await expect(page.getByLabel("Email")).toBeEmpty();
  await expect(page.getByLabel("Mật khẩu", { exact: true })).toBeEmpty();
  await expect(page.getByRole("note")).toHaveCount(0);

  await expect(
    page.getByRole("heading", { level: 1, name: "Đăng nhập" }),
  ).toBeVisible();
  await expect(page.getByLabel("Mật khẩu", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Quên mật khẩu?" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Ngôn ngữ: VN" }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: "Sign in" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Language: EN" })).toBeVisible();
  await expect(page.getByLabel("Password", { exact: true })).toBeVisible();

  await page.goto("/forgot-password");
  await expect(
    page.getByRole("heading", { level: 1, name: "Reset password" }),
  ).toBeVisible();
  await page.getByLabel("Email").fill(uniqueEmail("locale"));
  await page.getByRole("button", { name: "Send reset link" }).click();
  await expect(page.getByRole("status")).toContainText("If an account exists");

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  expect(
    results.violations.filter(
      (violation) =>
        violation.impact === "serious" || violation.impact === "critical",
    ),
  ).toEqual([]);
});

test("L10N-02 Vietnamese onboarding and account security retain localized states", async ({
  page,
}) => {
  const email = uniqueEmail("locale-vi");
  await signUp(page, email, "vi");
  await markEmailVerified(email);
  await signIn(page, email, "vi");

  await page.waitForURL("**/onboarding");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Tạo không gian làm việc",
    }),
  ).toBeVisible();
  await page.getByLabel("Tên không gian làm việc").fill("Nghiệm thu P1");
  await page.getByRole("button", { name: "Tạo không gian làm việc" }).click();
  await page.waitForURL(/\/w\//);

  await page.goto("/settings/security");
  await expect(
    page.getByRole("heading", { level: 1, name: "Bảo mật" }),
  ).toBeVisible();
  await expect(
    page.getByText("Địa chỉ email của bạn đã được xác minh."),
  ).toBeVisible();

  await page.getByLabel("Mật khẩu hiện tại").fill(E2E_PASSWORD);
  await page.getByLabel("Mật khẩu mới", { exact: true }).fill("ngan");
  await page.getByLabel("Xác nhận mật khẩu mới").fill("khac");
  await page.getByRole("button", { name: "Cập nhật mật khẩu" }).click();
  await expect(
    page.getByText("Mật khẩu mới phải có từ 12 đến 128 ký tự.", {
      exact: true,
    }),
  ).toBeVisible();

  await setLocale(page, "en");
  await page.reload();
  await expect(
    page.getByRole("heading", { level: 1, name: "Security" }),
  ).toBeVisible();
  await expect(page.getByText("Your email address is verified.")).toBeVisible();
});

test("L10N-03 sign-in controls stay top-right while brand, panel and footer stay centered", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1156, height: 900 });
  await setLocale(page, "vi");
  await page.goto("/sign-in");
  await expect(page.getByRole("button", { name: "Ngôn ngữ: VN" })).toBeVisible();
  await page.getByRole("button", { name: "Giao diện: Hệ thống" }).click();
  await expect(page.getByRole("button", { name: "Giao diện: Sáng" })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: "Giao diện: Sáng" }).click();
  await expect(page.getByRole("button", { name: "Giao diện: Tối" })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "Giao diện: Tối" }).click();
  await expect(page.getByRole("button", { name: "Giao diện: Hệ thống" })).toBeVisible();

  const shell = await page.getByTestId("auth-shell").boundingBox();
  expect(shell).not.toBeNull();
  const shellCenter = shell!.x + shell!.width / 2;
  for (const testId of ["auth-brand", "auth-panel", "auth-footer"]) {
    const box = await page.getByTestId(testId).boundingBox();
    expect(box).not.toBeNull();
    expect(Math.abs(box!.x + box!.width / 2 - shellCenter)).toBeLessThanOrEqual(
      1,
    );
  }

  const controls = await page.getByTestId("auth-preferences").boundingBox();
  expect(controls).not.toBeNull();
  expect(controls!.y).toBeLessThan(50);
  expect(controls!.x).toBeGreaterThan(1156 - 130);

  await page.setViewportSize({ width: 390, height: 844 });
  const mobileControls = await page.getByTestId("auth-preferences").boundingBox();
  const mobileBrand = await page.getByTestId("auth-brand").boundingBox();
  expect(mobileControls).not.toBeNull();
  expect(mobileBrand).not.toBeNull();
  expect(mobileControls!.x).toBeGreaterThan(390 - 110);
  expect(mobileControls!.y + mobileControls!.height).toBeLessThan(mobileBrand!.y);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});
