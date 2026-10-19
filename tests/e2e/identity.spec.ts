import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { signUpToDashboard, uniqueEmail } from "./auth-helpers";
import { E2E_BASE_URL } from "./env";

async function openAccountMenu(page: import("@playwright/test").Page) {
  await page
    .getByTestId("sidebar-desktop")
    .locator("details > summary")
    .click();
}

test("ID-01 allowed sign-up creates an identity and reaches the dashboard", async ({
  page,
}) => {
  const { email } = await signUpToDashboard(page);
  await expect(
    page.getByRole("heading", { level: 1, name: "Mission Command" }),
  ).toBeVisible();
  await expect(
    page.getByTestId("sidebar-desktop").getByText(email),
  ).toBeVisible();
});

test("ID-03 sign-out then sign-in works", async ({ page }) => {
  const { email } = await signUpToDashboard(page);

  await openAccountMenu(page);
  await page.getByRole("button", { name: "Sign out" }).click();
  await page.waitForURL("**/sign-in");

  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("password12345");
  await page.getByRole("button", { name: "Sign in" }).click();

  await page.waitForURL(/\/w\//);
  await expect(
    page.getByRole("heading", { level: 1, name: "Mission Command" }),
  ).toBeVisible();
});

test("ID-04 unauthenticated users cannot access workspace routes", async ({
  page,
}) => {
  await page.goto("/w/some-workspace-slug");
  await page.waitForURL("**/sign-in");
  await expect(
    page.getByRole("heading", { level: 1, name: "Đăng nhập" }),
  ).toBeVisible();
});

test("ID-19 the authenticated shell shows only real user and workspace state", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const { email } = await signUpToDashboard(page, "Realtime Lab");
  const sidebar = page.getByTestId("sidebar-desktop");
  await expect(sidebar.getByText("E2E User")).toBeVisible();
  await expect(sidebar.getByText(email)).toBeVisible();
  await expect(
    sidebar.getByRole("region", { name: "Workspace" }),
  ).toContainText("Realtime Lab");
  await sidebar.getByText("E2E User").click();
  const accountSecurity = sidebar.getByRole("link", {
    name: "Account security",
  });
  await expect(accountSecurity).toBeVisible();
  await expect(sidebar.getByRole("button", { name: "Sign out" })).toBeVisible();
  await accountSecurity.click();
  await expect(page).toHaveURL(/\/settings\/security$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Security" }),
  ).toBeVisible();
});

test("ID-21 a malicious next parameter cannot redirect off-site", async ({
  page,
}) => {
  const { email } = await signUpToDashboard(page);
  await openAccountMenu(page);
  await page.getByRole("button", { name: "Sign out" }).click();
  await page.waitForURL("**/sign-in");

  await page.goto("/sign-in?next=https://evil.example/phish");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("password12345");
  await page.getByRole("button", { name: "Sign in" }).click();

  await page.waitForURL(/\/w\//);
  expect(page.url().startsWith(`${E2E_BASE_URL}/`)).toBe(true);
});

test("ID-22 auth and settings surfaces have no serious/critical a11y violations", async ({
  page,
}) => {
  await page.goto("/sign-in");
  const signIn = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  expect(
    signIn.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    ),
  ).toEqual([]);

  const { dashboardUrl } = await signUpToDashboard(page);
  await page.goto(`${dashboardUrl}/settings/members`);
  await expect(
    page.getByRole("heading", { level: 1, name: "Members" }),
  ).toBeVisible();
  const settings = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  expect(
    settings.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    ),
  ).toEqual([]);
});

test("ID-23 sign-in and sign-out are fully keyboard operable", async ({
  page,
}) => {
  const { email } = await signUpToDashboard(page);
  await openAccountMenu(page);
  await page.getByRole("button", { name: "Sign out" }).click();
  await page.waitForURL("**/sign-in");

  // Operate the sign-in form entirely by keyboard.
  await page.getByLabel("Email").focus();
  await page.keyboard.type(email);
  await page.keyboard.press("Tab");
  await page.keyboard.type("password12345");
  await page.keyboard.press("Enter");

  await page.waitForURL(/\/w\//);

  // Sign out reachable and operable by keyboard.
  const accountSummary = page
    .getByTestId("sidebar-desktop")
    .locator("details > summary");
  await accountSummary.focus();
  await page.keyboard.press("Enter");
  const signOut = page.getByRole("button", { name: "Sign out" });
  await signOut.focus();
  await expect(signOut).toBeFocused();
  await page.keyboard.press("Enter");
  await page.waitForURL("**/sign-in");
});

test("ID-23 invitation creation surfaces a single-use link (keyboard reachable)", async ({
  page,
}) => {
  const { dashboardUrl } = await signUpToDashboard(page);
  await page.goto(`${dashboardUrl}/settings/members`);

  const emailInput = page.getByLabel("Email");
  await emailInput.focus();
  await expect(emailInput).toBeFocused();
  await page.keyboard.type(uniqueEmail("invitee"));
  await page.getByRole("button", { name: "Create invitation" }).click();

  await expect(page.getByText(/shown once/i)).toBeVisible();
  await expect(page.getByText(/\/invitations\//)).toBeVisible();
});

test("ID-24 OBL-UI-001 governed scope remains keyboard-scrollable below 768px", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await signUpToDashboard(page);

  const scope = page.getByRole("region", { name: "Active scope" });
  await expect(scope).toBeVisible();
  await expect(scope).toHaveAttribute("tabindex", "0");
  const geometry = await scope.evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
  }));
  expect(geometry.clientWidth).toBeLessThanOrEqual(390);
  expect(geometry.scrollWidth).toBeGreaterThan(geometry.clientWidth);
});
