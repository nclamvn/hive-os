import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

import { signUpToDashboard } from "./auth-helpers";

async function createMission(page: Page, dashboardUrl: string) {
  await page.goto(`${dashboardUrl}/missions/new`);
  await page.getByLabel("Mission title").fill("Governed research proposal");
  await page.getByLabel("Objective").fill("Prepare an accountable proposal.");
  await page.getByLabel("Scope").fill("Retained evidence and bounded analysis.");
  await page.getByLabel("Success definition").fill("A reviewed publication package.");
  await page.getByTestId("mission-contract-details").locator("summary").click();
  await page.getByLabel("Requirement title").fill("Source quality");
  await page.getByLabel("Acceptance criteria").fill("Every material claim has a source.");
  await page.getByLabel("Obligation title").fill("Declare limitations");
  await page.getByRole("button", { name: "Create draft mission" }).click();
  await page.waitForURL(/\/missions\/[0-9a-f-]{36}/);
}

test("AUTH-E2E-01 creates, revises and quality-gates a governed proposal", async ({
  page,
}) => {
  const { dashboardUrl } = await signUpToDashboard(page, "Authoring QA");
  await createMission(page, dashboardUrl);
  await page.goto(`${dashboardUrl}/authoring`);

  await expect(page.getByRole("heading", { name: "Establish the evidence before the document is signed." })).toBeVisible();
  await page.getByLabel("Document title").fill("UAV forest survey proposal");
  await page.getByLabel("Document type").selectOption("RESEARCH_PROPOSAL");
  await page.getByRole("button", { name: "Open editorial workspace" }).click();
  await page.waitForURL(/\/authoring\/[0-9a-f-]{36}/);

  await expect(page.getByText("Publishing blocked")).toBeVisible();
  await expect(page.getByTitle("Resolve every blocking finding before export.").first()).toBeVisible();
  await page.getByLabel("Executive abstract").fill("A bounded proposal with retained evidence and explicit responsibility.");
  await page.getByLabel("Content").fill("The section records its claim, boundary and accountable owner.");
  const updatePanel = page.getByTestId("authoring-update-panel");
  await updatePanel.locator("summary").first().click();
  await page.getByLabel("Change request", { exact: true }).fill("Pending manual update context");
  await page.getByRole("button", { name: "Prepare context for Codex" }).click();
  await page.getByLabel("JSON update pack from Codex or author").fill("{}");
  await expect(page.getByLabel("Copy this context into Codex")).toHaveValue(/Pending manual update context/);
  await expect(page.getByLabel("JSON update pack from Codex or author")).toHaveValue("{}");
  await page.getByLabel("Change summary").fill("Add accountable section content");
  await page.getByRole("button", { name: "Save new revision" }).click();
  await expect(page.getByText("Revision 2 · DRAFT")).toBeVisible();
  // Only a successful persisted-revision transition remounts the manual panel.
  // Old request/packet/context and the stale "unsaved" message must not survive.
  await expect(updatePanel).not.toHaveAttribute("open");
  await updatePanel.locator("summary").first().click();
  await expect(page.getByLabel("Change request", { exact: true })).toHaveValue("");
  await expect(page.getByLabel("JSON update pack from Codex or author")).toHaveValue("");
  await expect(page.getByLabel("Copy this context into Codex")).toHaveCount(0);

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

test("AUTH-E2E-02 editor has no horizontal viewport overflow on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const { dashboardUrl } = await signUpToDashboard(page, "Authoring Mobile");
  await createMission(page, dashboardUrl);
  await page.goto(`${dashboardUrl}/authoring`);
  await page.getByLabel("Document title").fill("Mobile proposal");
  await page.getByRole("button", { name: "Open editorial workspace" }).click();
  await page.waitForURL(/\/authoring\/[0-9a-f-]{36}/);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});
