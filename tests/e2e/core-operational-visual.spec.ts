import { existsSync } from "node:fs";
import path from "node:path";

import { expect, test } from "@playwright/test";

import { signUpToDashboard } from "./auth-helpers";
import { E2E_BASE_URL } from "./env";

const DIR = path.resolve(__dirname, "../../artifacts/tip-002b");
const ROUTES = [
  ["missions", "missions"],
  ["truth", "evidence"],
  ["execution", "execution"],
  ["verification", "verification"],
  ["control", "control-room"],
] as const;
const VIEWPORTS = [
  { name: "390x844", width: 390, height: 844 },
  { name: "1440x960", width: 1440, height: 960 },
] as const;

test("captures the TIP-002B core vi/en × light/dark matrix", async ({
  page,
}) => {
  test.setTimeout(180_000);
  await signUpToDashboard(page, "Core Operational Matrix", "vi");
  const workspacePath = new URL(page.url()).pathname.replace(/\/$/, "");

  for (const locale of ["vi", "en"] as const) {
    await page.context().addCookies([
      {
        name: "hive-locale",
        value: locale,
        url: E2E_BASE_URL,
        sameSite: "Lax",
      },
    ]);
    for (const theme of ["light", "dark"] as const) {
      await page.evaluate((value) => {
        localStorage.setItem("hive-appearance", value);
      }, theme);
      for (const viewport of VIEWPORTS) {
        await page.setViewportSize(viewport);
        for (const [surface, route] of ROUTES) {
          await page.goto(`${E2E_BASE_URL}${workspacePath}/${route}`);
          await expect(page.locator("html")).toHaveAttribute("lang", locale);
          await expect(page.locator("html")).toHaveAttribute(
            "data-theme",
            theme,
          );
          await expect(page.locator("main")).toBeVisible();

          const overflow = await page.evaluate(
            () =>
              document.documentElement.scrollWidth -
              document.documentElement.clientWidth,
          );
          expect(overflow).toBeLessThanOrEqual(1);

          const file = path.join(
            DIR,
            `${surface}-${locale}-${theme}-${viewport.name}.png`,
          );
          await page.screenshot({ path: file, fullPage: false });
          expect(existsSync(file)).toBe(true);
        }
      }
    }
  }
});
