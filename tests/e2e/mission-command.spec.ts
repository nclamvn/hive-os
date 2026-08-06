import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

import { signUpToDashboard } from "./auth-helpers";

async function createMission(page: Page, workspaceUrl: string) {
  await page.goto(`${workspaceUrl}/missions/new`);
  await page.getByLabel("Mission title").fill("Enterprise trace mission");
  await page
    .getByLabel("Objective")
    .fill("Exercise the governed command surface.");
  await page.getByLabel("Scope").fill("Workspace-bounded records only.");
  await page
    .getByLabel("Success definition")
    .fill("A retained accountable trace.");
  await page.getByLabel("Requirement title").fill("Trace integrity");
  await page
    .getByLabel("Acceptance criteria")
    .fill("Every transition remains attributable.");
  await page.getByLabel("Obligation title").fill("Review the mission record");
  await page.getByRole("button", { name: "Create mission" }).click();
  await page.waitForURL(/\/missions\/[0-9a-f-]{36}/);
}

test.describe("TIP-023F enterprise mission command surface", () => {
  test("SURF-01/GRAPH-01/GRID-01/WORK-01 exposes one governed operating surface", async ({
    page,
  }) => {
    const { dashboardUrl } = await signUpToDashboard(
      page,
      "Enterprise Command QA",
    );
    await createMission(page, dashboardUrl);
    await page.goto(dashboardUrl);

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Mission Command",
      }),
    ).toBeVisible();
    await expect(page.getByLabel("Active scope")).toContainText(
      "Enterprise Command QA",
    );
    await expect(
      page.getByLabel("Active scope").locator("time"),
    ).toHaveAttribute("datetime");
    await expect(page.locator(".mission-grid > table")).toContainText(
      "Enterprise trace mission",
    );
    await expect(page.getByLabel("Context inspector")).toContainText(
      "Enterprise trace mission",
    );
    await expect(
      page.getByLabel("Context inspector").getByText("Continue the contract"),
    ).toBeVisible();

    await expect(
      page.getByRole("columnheader", { name: "Accountable" }),
    ).toBeVisible();
    await page
      .locator(".mission-grid > table")
      .getByLabel("Select M-0001")
      .check();
    await expect(page.getByText("1 selected")).toBeVisible();

    await page.getByRole("button", { name: "Graph" }).click();
    await expect(page).toHaveURL(/mode=graph/);
    await expect(page.getByLabel("Mission graph")).toContainText(
      "Enterprise trace mission",
    );

    await page.getByRole("button", { name: "Chronology" }).click();
    await expect(page).toHaveURL(/mode=chronology/);
    await expect(page.getByText("1 selected")).toBeVisible();

    await page.getByRole("button", { name: "Open command palette" }).click();
    const palette = page.getByRole("dialog", { name: "Command palette" });
    await expect(palette).toBeVisible();
    await expect(
      palette.getByRole("link", { name: "Define a new mission" }),
    ).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(palette).toBeHidden();

    await page.getByLabel("Saved view").selectOption("my-work");
    await expect(page).toHaveURL(/view=my-work/);
    await expect(
      page.getByText("No mission matches this operational view."),
    ).toBeVisible();
    await expect(page.getByText("Enterprise trace mission")).toBeHidden();
    await expect(page.getByLabel("Context inspector")).toContainText(
      "My accountable work",
    );
    await expect(page.getByLabel("Context inspector")).toContainText(
      "Query bound",
    );
    await page.getByRole("button", { name: "Reset operational view" }).click();
    await expect(page).not.toHaveURL(/view=my-work/);
    await expect(
      page.locator(".mission-chronology").getByText("Enterprise trace mission"),
    ).toBeVisible();
  });

  test("UI-02 remains overflow-free and accessible at 390px", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await signUpToDashboard(page, "Mobile Mission Command");

    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);

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
