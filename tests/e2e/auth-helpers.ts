import { expect, type Page } from "@playwright/test";

let counter = 0;

export function uniqueEmail(prefix = "e2e"): string {
  counter += 1;
  return `${prefix}-${Date.now()}-${counter}@test.local`;
}

export interface SignedUp {
  email: string;
  dashboardUrl: string;
}

/**
 * Sign up a fresh user and provision a workspace, leaving the page on the
 * workspace dashboard. Returns the email and the dashboard URL.
 */
export async function signUpToDashboard(
  page: Page,
  workspaceName = "E2E Workspace",
): Promise<SignedUp> {
  const email = uniqueEmail();
  await page.goto("/sign-up");
  await page.getByLabel("Name").fill("E2E User");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("password12345");
  await page.getByRole("button", { name: "Create account" }).click();

  await page.waitForURL("**/onboarding");
  await page.getByLabel("Workspace name").fill(workspaceName);
  await page.getByRole("button", { name: "Create workspace" }).click();

  await page.waitForURL(/\/w\//);
  await expect(
    page.getByRole("heading", { level: 1, name: "Dashboard" }),
  ).toBeVisible();
  return { email, dashboardUrl: page.url() };
}
