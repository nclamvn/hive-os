import { randomUUID } from "node:crypto";

import { expect, type Page } from "@playwright/test";
import pg from "pg";

import { E2E_BASE_URL, E2E_ENV } from "./env";

export function uniqueEmail(prefix = "e2e"): string {
  return `${prefix}-${randomUUID()}@test.local`;
}

export const E2E_PASSWORD = "password12345";

export interface SignedUp {
  email: string;
  dashboardUrl: string;
}

export async function setLocale(
  page: Page,
  locale: "vi" | "en",
): Promise<void> {
  await page.context().addCookies([
    {
      name: "hive-locale",
      value: locale,
      url: E2E_BASE_URL,
      sameSite: "Lax",
    },
  ]);
}

/**
 * Mark a credential user's email verified directly in the test database.
 * TIP-021A requires a verified email before a session; E2E flows that need an
 * authenticated dashboard verify out-of-band (as if the user clicked the link)
 * rather than depending on captured mail from the app process.
 */
export async function markEmailVerified(email: string): Promise<void> {
  const client = new pg.Client({
    connectionString: E2E_ENV.DATABASE_MIGRATION_URL,
  });
  await client.connect();
  try {
    await client.query(
      'UPDATE "user" SET email_verified = true WHERE email = $1',
      [email],
    );
  } finally {
    await client.end();
  }
}

/** Fill and submit the sign-up form; lands on the neutral check-email page. */
export async function signUp(
  page: Page,
  email: string,
  locale: "vi" | "en" = "en",
): Promise<void> {
  await setLocale(page, locale);
  await page.goto("/sign-up");
  await page
    .getByLabel(locale === "vi" ? "Họ và tên" : "Name")
    .fill("E2E User");
  await page.getByLabel("Email").fill(email);
  await page
    .getByLabel(locale === "vi" ? "Mật khẩu" : "Password", { exact: true })
    .fill(E2E_PASSWORD);
  await page
    .getByRole("button", {
      name: locale === "vi" ? "Tạo tài khoản" : "Create account",
    })
    .click();
  await page.waitForURL(/\/check-email/, { timeout: 20_000 });
}

/** Sign in an existing verified user via the sign-in form. */
export async function signIn(
  page: Page,
  email: string,
  locale: "vi" | "en" = "en",
): Promise<void> {
  await setLocale(page, locale);
  await page.goto("/sign-in");
  await page.getByLabel("Email").fill(email);
  await page
    .getByLabel(locale === "vi" ? "Mật khẩu" : "Password", { exact: true })
    .fill(E2E_PASSWORD);
  await page
    .getByRole("button", {
      name: locale === "vi" ? "Đăng nhập" : "Sign in",
    })
    .click();
}

/**
 * Sign up a fresh user, verify the email, sign in, provision a workspace, and
 * leave the page on the workspace dashboard. Returns the email and dashboard URL.
 */
export async function signUpToDashboard(
  page: Page,
  workspaceName = "E2E Workspace",
  locale: "vi" | "en" = "en",
): Promise<SignedUp> {
  const email = uniqueEmail();
  await signUp(page, email, locale);
  await markEmailVerified(email);
  await signIn(page, email, locale);

  await page.waitForURL("**/onboarding", { timeout: 20_000 });
  await page
    .getByLabel(locale === "vi" ? "Tên không gian làm việc" : "Workspace name")
    .fill(workspaceName);
  await page
    .getByRole("button", {
      name: locale === "vi" ? "Tạo không gian làm việc" : "Create workspace",
    })
    .click();

  await page.waitForURL(/\/w\//, { timeout: 20_000 });
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: locale === "vi" ? "Trung tâm điều hành" : "Mission Command",
    }),
  ).toBeVisible();
  return { email, dashboardUrl: page.url() };
}
