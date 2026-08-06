import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

import { signUpToDashboard } from "./auth-helpers";

async function createMission(page: Page) {
  const { dashboardUrl } = await signUpToDashboard(page, "Mission Dossier");
  await page.goto(`${dashboardUrl}/missions/new`);
  await page.getByLabel("Mission title").fill("Governed materials review");
  await page.getByLabel("Objective").fill("Assess retained evidence.");
  await page.getByLabel("Scope").fill("Local governed records.");
  await page
    .getByLabel("Success definition")
    .fill("A bounded and reviewable result.");
  await page.getByLabel("Requirement title").fill("Evidence coverage");
  await page
    .getByLabel("Acceptance criteria")
    .fill("Every accepted statement has retained evidence.");
  await page.getByLabel("Obligation title").fill("Review evidence");
  await page.getByRole("button", { name: "Create mission" }).click();
  await page.waitForURL(/\/missions\/[0-9a-f-]{36}/);
  return page.url();
}

test.describe("TIP-009 Mission Workspace", () => {
  test("MW-01..04 exposes nine deep-linked honest lenses", async ({ page }) => {
    const detailUrl = await createMission(page);
    await expect(page.getByRole("heading", { name: "Mission brief" })).toBeVisible();
    await expect(page.getByLabel("Mission lifecycle")).toBeVisible();

    const lenses = [
      ["contract", "Approved intent"],
      ["research", "Recent provenance edges"],
      ["evidence", "Evidence ledger"],
      ["claims", "Claims and insights"],
      ["build", "Governed execution"],
      ["verify", "Verify Reports"],
      ["decisions", "Decision ledger"],
      ["release", "Governed releases"],
    ] as const;
    for (const [view, heading] of lenses) {
      await page.goto(`${detailUrl}?view=${view}`);
      await expect(page.getByRole("heading", { name: heading }).first()).toBeVisible();
    }

    await page.goto(`${detailUrl}?view=not-a-real-lens`);
    await expect(page.getByRole("heading", { name: "Mission brief" })).toBeVisible();
  });

  test("MW-07/08 remains accessible and overflow-free on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const detailUrl = await createMission(page);
    for (const view of ["overview", "research", "build", "verify", "release"]) {
      await page.goto(`${detailUrl}?view=${view}`);
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(1);
    }
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

  test("MW-09 distinguishes manual progress from a live background worker", async ({
    page,
  }) => {
    await createMission(page);
    await page.getByRole("button", { name: "Submit for review" }).click();
    await expect(
      page.getByRole("button", { name: "Approve contract" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Approve contract" }).click();
    await expect(page.getByRole("button", { name: "Start" })).toBeVisible();
    await page.getByRole("button", { name: "Start" }).click();

    await expect(page.getByText("Manual work in progress")).toBeVisible();
    await expect(page.getByText("NO BACKGROUND JOB")).toBeVisible();
    await expect(page.getByText("In progress", { exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: /Open Research/ })).toHaveAttribute(
      "href",
      /\/research\?missionId=/,
    );
  });
});
