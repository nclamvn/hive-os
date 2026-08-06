import { existsSync } from "node:fs";
import path from "node:path";

import { expect, test } from "@playwright/test";

import { signUpToDashboard } from "./auth-helpers";

const DIR = path.resolve(__dirname, "../../artifacts/tip-008");

test("capture unified Control Room surfaces", async ({ page }) => {
  const { dashboardUrl } = await signUpToDashboard(page, "Control Room Visual");

  for (const viewport of [
    { name: "desktop", width: 1536, height: 1024 },
    { name: "mobile", width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto(`${dashboardUrl}/control-room`);
    await page
      .getByRole("heading", { name: "Continue where you left off." })
      .waitFor();

    const file = path.join(DIR, `control-room-${viewport.name}-viewport.png`);
    await page.screenshot({ path: file, fullPage: false });
    expect(existsSync(file)).toBe(true);

    await page.getByText("Execution and assurance details").click();
    await page
      .getByRole("heading", { name: "Verify before release" })
      .scrollIntoViewIfNeeded();
    const verificationFile = path.join(
      DIR,
      `verification-governance-${viewport.name}-viewport.png`,
    );
    await page.screenshot({ path: verificationFile, fullPage: false });
    expect(existsSync(verificationFile)).toBe(true);
  }
});
