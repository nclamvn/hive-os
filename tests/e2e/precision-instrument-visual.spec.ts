import { existsSync } from "node:fs";
import path from "node:path";

import { expect, test } from "@playwright/test";

import { signUpToDashboard } from "./auth-helpers";
import { E2E_BASE_URL } from "./env";

const DIR = path.resolve(__dirname, "../../artifacts/tip-002a");
const VIEWPORTS = [
  { name: "390x844", width: 390, height: 844 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "1280x800", width: 1280, height: 800 },
  { name: "1536x1024", width: 1536, height: 1024 },
] as const;

test("captures the vi/en × light/dark dashboard matrix", async ({ page }) => {
  test.setTimeout(120_000);
  await signUpToDashboard(page, "Precision Instrument", "vi");

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
        await page.reload();
        await expect(page.locator("html")).toHaveAttribute("lang", locale);
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme);

        const overflow = await page.evaluate(
          () =>
            document.documentElement.scrollWidth -
            document.documentElement.clientWidth,
        );
        expect(overflow).toBeLessThanOrEqual(1);

        const file = path.join(DIR, `${locale}-${theme}-${viewport.name}.png`);
        await page.screenshot({ path: file, fullPage: false });
        expect(existsSync(file)).toBe(true);
      }
    }
  }
});
