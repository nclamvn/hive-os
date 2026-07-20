import { existsSync } from "node:fs";
import path from "node:path";

import { expect, test } from "@playwright/test";

// DS-12 — visual regression evidence at the four locked viewport sizes.
const ARTIFACT_DIR = path.resolve(__dirname, "../../artifacts/tip-002");

const VIEWPORTS = [
  { name: "1536x1024-desktop", width: 1536, height: 1024 },
  { name: "1280x800-desktop", width: 1280, height: 800 },
  { name: "768x1024-tablet", width: 768, height: 1024 },
  { name: "390x844-mobile", width: 390, height: 844 },
] as const;

test.describe("DS-12 visual regression evidence", () => {
  for (const vp of VIEWPORTS) {
    test(`captures ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/");
      await page.getByRole("heading", { name: "Start a new mission" }).waitFor();

      // No unexpected horizontal overflow at any captured size.
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(1);

      const file = path.join(ARTIFACT_DIR, `${vp.name}.png`);
      await page.screenshot({ path: file, fullPage: true });
      expect(existsSync(file)).toBe(true);
    });
  }
});
