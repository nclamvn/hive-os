import AxeBuilder from "@axe-core/playwright";
import { createHash } from "node:crypto";
import { expect, test, type Page } from "@playwright/test";

import { signUpToDashboard } from "./auth-helpers";

async function createApprovedMission(page: Page) {
  const { dashboardUrl } = await signUpToDashboard(page, "Truth Operations");
  await page.goto(`${dashboardUrl}/missions/new`);
  await page.getByLabel("Mission title").fill("Material provenance review");
  await page.getByLabel("Objective").fill("Retain and assess exact evidence.");
  await page.getByLabel("Scope").fill("Governed local evidence.");
  await page.getByLabel("Success definition").fill("A sourced claim.");
  await page.getByLabel("Requirement title").fill("Exact evidence");
  await page.getByLabel("Acceptance criteria").fill("Every claim has an exact span.");
  await page.getByLabel("Obligation title").fill("Retain evidence");
  await page.getByRole("button", { name: "Create mission" }).click();
  await page.waitForURL(/\/missions\/[0-9a-f-]{36}/);
  await page.getByRole("button", { name: "Submit for review" }).click();
  await expect(page.getByRole("button", { name: "Approve contract" })).toBeVisible();
  await page.getByRole("button", { name: "Approve contract" }).click();
  await expect(page.getByText(/next stage Exploring/)).toBeVisible();
  return dashboardUrl;
}

test.describe("TIP-013 Truth Operations", () => {
  test("TO-01/03 captures exact evidence and creates a sourced claim", async ({
    page,
  }) => {
    const dashboardUrl = await createApprovedMission(page);
    await page.goto(`${dashboardUrl}/evidence`);
    await expect(page.getByRole("heading", { name: "Preserve before interpreting." })).toBeVisible();

    const source = page.getByRole("form", { name: "Register evidence source" });
    await source.getByLabel("Mission").selectOption({ index: 1 });
    await source.getByLabel("Source title").fill("Calibration report");
    await source.getByLabel("Canonical URI").fill("https://example.test/calibration");
    await source.getByLabel("Independence key").fill("lab-calibration");
    await source.getByRole("button", { name: "Save governed record" }).click();
    await expect(page.getByText("Calibration report").last()).toBeVisible();

    const fileIntake = page.getByRole("form", {
      name: "Attach evidence file",
    });
    await fileIntake.getByLabel("Evidence source").selectOption({ index: 1 });
    await fileIntake.getByLabel("Evidence file").setInputFiles({
      name: "bench.csv",
      mimeType: "text/csv",
      buffer: Buffer.from("axis,error_mm\npan,0.14\n", "utf8"),
    });
    await fileIntake
      .getByRole("button", { name: "Save governed record" })
      .click();
    await expect(page.getByText("Evidence file retained")).toBeVisible();

    const snapshot = page.getByRole("form", { name: "Capture immutable snapshot" });
    await snapshot.getByLabel("Evidence source").selectOption({ index: 1 });
    await snapshot
      .getByLabel("Captured content")
      .fill("The independently measured governed value is 42.");
    await snapshot.getByRole("button", { name: "Save governed record" }).click();
    await expect(page.getByText(/SHA-256 [a-f0-9]{64}/)).toBeVisible();

    const span = page.getByRole("form", { name: "Retain exact evidence span" });
    const manualDigest = createHash("sha256")
      .update("The independently measured governed value is 42.")
      .digest("hex")
      .slice(0, 10);
    const snapshotSelect = span.getByLabel("Snapshot");
    await expect(snapshotSelect.locator("option")).toHaveCount(3);
    const manualSnapshotId = await snapshotSelect
      .locator("option")
      .filter({ hasText: manualDigest })
      .getAttribute("value");
    await snapshotSelect.selectOption(manualSnapshotId!);
    await span.getByLabel("Exact quote").fill("governed value is 42");
    await span.getByRole("button", { name: "Save governed record" }).click();
    await expect(page.getByText("“governed value is 42”")).toBeVisible();

    await page.goto(`${dashboardUrl}/claims`);
    const claim = page.getByRole("form", { name: "Create governed claim" });
    await claim.getByLabel("Mission").selectOption({ index: 1 });
    await claim.getByLabel("Claim key").fill("CLM-001");
    await claim.getByLabel("Statement").fill("The governed value is 42.");
    await claim.getByLabel("Normalized value").fill("42");
    await claim.getByLabel("Evidence span").selectOption({ index: 1 });
    await claim.getByRole("button", { name: "Save governed record" }).click();
    await expect(page.getByText("sourced", { exact: true })).toBeVisible();
    await expect(page.getByText("The governed value is 42.").last()).toBeVisible();
  });

  test("TO-07/08 exposes truthful empty states without mobile overflow or a11y violations", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 844 });
    const { dashboardUrl } = await signUpToDashboard(page, "Truth Mobile");
    for (const path of ["/evidence", "/claims"]) {
      await page.goto(`${dashboardUrl}${path}`);
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(1);
    }
    await expect(page.getByText("Approve a Mission before creating claims.")).toBeVisible();
    const scan = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    expect(
      scan.violations.filter(
        (violation) =>
          violation.impact === "serious" || violation.impact === "critical",
      ),
    ).toEqual([]);
  });
});
