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

  await expect(
    page.getByRole("heading", { level: 1, name: "Đăng nhập" }),
  ).toBeVisible();
  await expect(page.getByLabel("Mật khẩu", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Quên mật khẩu?" }),
  ).toBeVisible();

  await page.getByLabel("Ngôn ngữ").selectOption("en");
  await expect(
    page.getByRole("heading", { level: 1, name: "Sign in" }),
  ).toBeVisible();
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

test("L10N-03 sign-in controls, brand, panel and footer share one center axis", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1156, height: 900 });
  await setLocale(page, "vi");
  await page.goto("/sign-in");

  const shell = await page.getByTestId("auth-shell").boundingBox();
  expect(shell).not.toBeNull();
  const shellCenter = shell!.x + shell!.width / 2;
  for (const testId of [
    "auth-preferences",
    "auth-brand",
    "auth-panel",
    "auth-footer",
  ]) {
    const box = await page.getByTestId(testId).boundingBox();
    expect(box).not.toBeNull();
    expect(Math.abs(box!.x + box!.width / 2 - shellCenter)).toBeLessThanOrEqual(
      1,
    );
  }
});
