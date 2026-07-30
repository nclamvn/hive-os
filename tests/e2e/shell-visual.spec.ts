import { existsSync } from "node:fs";
import path from "node:path";

import { expect, test } from "@playwright/test";

import { signUpToDashboard } from "./auth-helpers";

// DS-12 — visual regression evidence at the four locked viewport sizes.
// Two variants per size: exact-viewport (fullPage: false) and full-page flow.
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
      await signUpToDashboard(page);
      await page
        .getByRole("heading", {
          name: "One scope. Every accountable trace.",
        })
        .waitFor();

      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(1);

      const viewportFile = path.join(ARTIFACT_DIR, `${vp.name}-viewport.png`);
      await page.screenshot({ path: viewportFile, fullPage: false });
      expect(existsSync(viewportFile)).toBe(true);

      const fullFile = path.join(ARTIFACT_DIR, `${vp.name}-fullpage.png`);
      await page.screenshot({ path: fullFile, fullPage: true });
      expect(existsSync(fullFile)).toBe(true);
    });
  }
});
