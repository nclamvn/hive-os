import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

import { signUpToDashboard } from "./auth-helpers";

const completeReport = JSON.stringify(
  {
    result: "DONE",
    summary: "Manual provider completed the governed execution package.",
    requirementCoverage: {
      implemented: 1,
      total: 1,
      missing: [],
      deferred: [],
    },
    scenarioResults: [],
    technicalHealth: {
      build: "NOT_RUN",
      typecheck: { errors: 0, warnings: 0 },
      lint: { errors: 0, warnings: 0 },
      unit: { passed: 0, failed: 0, skipped: 0 },
      integration: { passed: 0, failed: 0, skipped: 0 },
      e2e: { passed: 0, failed: 0, skipped: 0 },
      accessibilityViolations: 0,
      vulnerabilities: { critical: 0, high: 0, moderate: 0, low: 0 },
    },
    overallStatus: "READY",
    deviations: [],
    resourceUsage: [
      { metric: "duration_ms", quantity: 1200, unit: "ms" },
    ],
  },
  null,
  2,
);

async function createApprovedMission(page: Page, dashboardUrl: string) {
  await page.goto(`${dashboardUrl}/missions/new`);
  await page.getByLabel("Mission title").fill("Execution Operations QA");
  await page.getByLabel("Objective").fill("Complete one governed work package.");
  await page.getByLabel("Scope").fill("Local Manual Bridge only.");
  await page
    .getByLabel("Success definition")
    .fill("A strict Completion Report is retained.");
  await page.getByLabel("Requirement title").fill("Complete package");
  await page.getByLabel("Acceptance criteria").fill("Report is imported.");
  await page.getByLabel("Obligation title").fill("Retain execution evidence");
  await page.getByRole("button", { name: "Create mission" }).click();
  await page.waitForURL(/\/missions\/[0-9a-f-]{36}/);
  const missionUrl = page.url();
  await page.getByRole("button", { name: "Submit for review" }).click();
  await page.getByRole("button", { name: "Approve contract" }).click();
  await expect(page.getByText(/next stage Exploring/)).toBeVisible();
  return missionUrl;
}

async function registerExecutionSkill(page: Page, dashboardUrl: string) {
  await page.goto(`${dashboardUrl}/skills`);
  await page.getByText("Register a new skill contract", { exact: true }).click();
  const form = page.getByRole("form", { name: "Register skill contract" });
  await form.getByLabel("Stable skill key").fill("manual-builder");
  await form.getByLabel("Display name").fill("Manual Builder");
  await form
    .getByLabel("Operator description")
    .fill("Provider-independent governed implementation.");
  await form.getByLabel("Semantic version").fill("1.0.0");
  await form.getByLabel("Verifier key").fill("manual-completion");
  await form.getByLabel("Capabilities").fill("implementation_planning");
  await form.getByRole("button", { name: "Save governed record" }).click();
  await expect(page.getByText("active v1.0.0")).toBeVisible();
}

test.describe("TIP-015 Execution Operations", () => {
  test("EO-01..08 completes the governed Manual Bridge operating loop", async ({
    page,
  }) => {
    const { dashboardUrl } = await signUpToDashboard(page, "Execution Desk QA");
    const missionUrl = await createApprovedMission(page, dashboardUrl);
    await registerExecutionSkill(page, dashboardUrl);

    await page.goto(`${dashboardUrl}/execution`);
    await expect(
      page.getByRole("heading", {
        name: "Move work across the human boundary without losing truth.",
      }),
    ).toBeVisible();

    await page.getByText("Open Mission exploration", { exact: true }).click();
    const exploration = page.getByRole("form", {
      name: "Open Mission exploration",
    });
    await exploration.getByLabel("Approved Mission").selectOption({ index: 1 });
    await exploration.getByRole("button", { name: "Open exploration" }).click();
    // The successful refresh removes this form because the Mission is no
    // longer APPROVED. Assert the stable governed state instead of racing the
    // transient success message during the server-component refresh.
    await expect(exploration).toBeHidden();

    await page
      .getByText("Define execution work package", { exact: true })
      .click();
    const workPackage = page.getByRole("form", {
      name: "Define execution work package",
    });
    await workPackage
      .getByLabel("Exploring or building Mission")
      .selectOption({ index: 1 });
    await workPackage.getByLabel("Active skill contract").selectOption({ index: 1 });
    await workPackage.getByLabel("Package code").fill("TIP-001");
    await workPackage.getByLabel("Package title").fill("Governed implementation");
    await workPackage
      .getByLabel("Bounded description")
      .fill("Implement the accepted local package and retain exact output.");
    await workPackage.getByRole("button", { name: "Create work package" }).click();
    await expect(page.getByText("Execution work package created")).toBeVisible();

    await page.getByText("Issue immutable instruction", { exact: true }).click();
    const issue = page.getByRole("form", { name: "Issue manual instruction" });
    await issue.getByLabel("Ready work package").selectOption({ index: 1 });
    await issue.getByLabel("Provider name").fill("manual-operator");
    await issue.getByLabel("Model or operator").fill("external-model");
    await issue
      .getByLabel("Immutable instruction")
      .fill("# Governed package\nImplement the accepted scope exactly.");
    await issue.getByRole("button", { name: "Issue instruction" }).click();
    await expect(page.getByText("Awaiting external report")).toBeVisible();

    await page.getByText("Import Completion Report", { exact: true }).click();
    const report = page.getByRole("form", { name: "Import Completion Report" });
    await report.getByLabel("Awaiting attempt").selectOption({ index: 1 });
    await report.getByLabel("Strict report JSON").fill('{"result":"DONE"}');
    await report.getByRole("button", { name: "Import report" }).click();
    await expect(report.getByRole("alert")).toContainText(
      "COMPLETION_REPORT_INVALID",
    );
    await expect(page.getByText("Awaiting external report")).toBeVisible();

    await report.getByLabel("Strict report JSON").fill(completeReport);
    await report.getByRole("button", { name: "Import report" }).click();
    await page.getByText("Completion Report", { exact: true }).click();
    await expect(page.getByText("Manual provider completed the governed execution package.")).toBeVisible();

    await page.getByText("Enter governed building", { exact: true }).click();
    const building = page.getByRole("form", { name: "Enter governed building" });
    await building.getByLabel("Exploring Mission").selectOption({ index: 1 });
    await building.getByRole("button", { name: "Enter building" }).click();

    await page.goto(missionUrl);
    await expect(page.getByText("Building", { exact: true }).first()).toBeVisible();
  });

  test("EO-10 is accessible and overflow-free at 320px", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 844 });
    const { dashboardUrl } = await signUpToDashboard(page, "Execution Mobile");
    await page.goto(`${dashboardUrl}/execution`);
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      ),
    ).toBeLessThanOrEqual(1);
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
