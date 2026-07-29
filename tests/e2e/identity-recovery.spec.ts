import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import {
  E2E_PASSWORD,
  markEmailVerified,
  signIn,
  signUp,
  signUpToDashboard,
  uniqueEmail,
} from "./auth-helpers";

async function expectNoSeriousA11y(page: import("@playwright/test").Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  const serious = results.violations.filter(
    (v) => v.impact === "serious" || v.impact === "critical",
  );
  expect(serious).toEqual([]);
}

async function expectNoHorizontalOverflow(
  page: import("@playwright/test").Page,
) {
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  );
  expect(overflow).toBe(false);
}

test("IR-03 an unverified user sees a verification-required state, not a session", async ({
  page,
}) => {
  const email = uniqueEmail();
  await signUp(page, email); // lands on /check-email, no session
  await signIn(page, email); // unverified: cannot sign in
  await expect(page.getByText(/isn.t verified yet/i)).toBeVisible();
  await expect(
    page.getByRole("button", { name: /resend verification/i }),
  ).toBeVisible();
});

test("forgot-password always shows the same neutral outcome", async ({
  page,
}) => {
  await page.goto("/forgot-password");
  await page.getByLabel("Email").fill(uniqueEmail("nobody"));
  await page.getByRole("button", { name: "Send reset link" }).click();
  await expect(page.getByRole("status")).toContainText(/if an account exists/i);
});

test("reset-password without a token fails truthfully", async ({ page }) => {
  await page.goto("/reset-password");
  await expect(page.getByText(/missing or invalid/i)).toBeVisible();
  await expect(
    page.getByRole("link", { name: /request a new reset link/i }),
  ).toBeVisible();
});

test("XC-01/XC-02 verify-email distinguishes direct visits from callbacks", async ({
  page,
}) => {
  await page.goto("/verify-email");
  await expect(
    page.getByRole("heading", { name: "Verification status unavailable" }),
  ).toBeVisible();
  await expect(page.getByText("Email verified")).not.toBeVisible();

  await page.goto("/verify-email?status=complete");
  await expect(
    page.getByRole("heading", { name: "Email verified" }),
  ).toBeVisible();
});

test("IR-37 a signed-in user can change their password", async ({ page }) => {
  await signUpToDashboard(page);
  await page.goto("/settings/security");
  await expect(
    page.getByRole("heading", { level: 1, name: "Security" }),
  ).toBeVisible();

  const newPassword = "rotated-password-12345";
  await page.getByLabel("Current password").fill(E2E_PASSWORD);
  await page.getByLabel("New password", { exact: true }).fill(newPassword);
  await page.getByLabel("Confirm new password").fill(newPassword);
  await page.getByRole("button", { name: "Update password" }).click();
  await expect(page.getByRole("status")).toContainText(/password changed/i);
});

test("IR-42 recovery forms are keyboard operable", async ({ page }) => {
  await page.goto("/forgot-password");
  await page.getByLabel("Email").focus();
  await page.keyboard.type(uniqueEmail());
  await page.keyboard.press("Enter");
  await expect(page.getByRole("status")).toBeVisible();
});

test("IR-41/IR-43 recovery pages pass a11y and have no overflow at 320px and 390px", async ({
  page,
}) => {
  const routes = [
    "/forgot-password",
    "/reset-password",
    "/check-email?intent=signup",
    "/verify-email",
    "/verify-email?status=complete",
    "/verify-email?error=invalid",
  ];
  for (const route of routes) {
    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto(route);
    await expectNoSeriousA11y(page);
    await expectNoHorizontalOverflow(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);
    await expectNoHorizontalOverflow(page);
  }
});

test("verified users reach the dashboard through the new flow", async ({
  page,
}) => {
  const email = uniqueEmail();
  await signUp(page, email);
  await markEmailVerified(email);
  await signIn(page, email);
  await page.waitForURL("**/onboarding");
  await expect(
    page.getByRole("heading", { level: 1, name: /workspace/i }),
  ).toBeVisible();
});
