import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { signUpToDashboard } from "./auth-helpers";

async function openControlRoom(page: import("@playwright/test").Page) {
  const { dashboardUrl } = await signUpToDashboard(page, "Control Lab");
  await page.goto(`${dashboardUrl}/control-room`);
  await expect(
    page.getByRole("heading", { level: 1, name: "Control Room" }),
  ).toBeVisible();
}

test.describe("HIVE OS Control Room", () => {
  test("CR-01 leads with resumable work and retains the system map", async ({
    page,
  }) => {
    await openControlRoom(page);

    await expect(
      page.getByRole("heading", { name: "Continue where you left off." }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Define the first mission" }),
    ).toBeVisible();
    await page.getByRole("tab", { name: "System map" }).click();
    for (const plane of ["Mission", "Truth", "Execution", "Assurance"]) {
      await expect(
        page.getByRole("heading", { name: plane, exact: true }),
      ).toBeVisible();
    }
    await expect(
      page.getByText("available", { exact: true }).first(),
    ).toBeVisible();
    await expect(
      page.getByText("Data is updated from authoritative records"),
    ).toBeVisible();
  });

  test("CR-02 node selection updates the context inspector", async ({
    page,
  }) => {
    await openControlRoom(page);
    await page.getByRole("tab", { name: "System map" }).click();

    const inspector = page.getByRole("complementary", {
      name: "Context inspector",
    });
    await expect(
      inspector.getByRole("heading", { name: "Mission contracts" }),
    ).toBeVisible();
    const claimsNode = page.getByRole("button", {
      name: /Claims and disputes/,
    });
    await claimsNode.focus();
    await page.keyboard.press("Enter");
    await expect(
      inspector.getByRole("heading", { name: "Claims and disputes" }),
    ).toBeVisible();
    await expect(inspector.getByText("Silently choose a winner")).toBeVisible();
  });

  test("CR-03 operations and audit lenses show honest projections", async ({
    page,
  }) => {
    await openControlRoom(page);

    await expect(
      page.getByRole("heading", { name: "Define the first mission" }),
    ).toBeVisible();
    await expect(page.getByText("No unresolved signals")).toBeVisible();

    await page.getByRole("tab", { name: "Audit log" }).click();
    await expect(
      page.getByRole("heading", { name: "Governed event ledger" }),
    ).toBeVisible();
    await expect(page.getByText("Workspace Created")).toBeVisible();
  });

  test("CR-04 object finder is keyboard operable and returns focus", async ({
    page,
  }) => {
    await openControlRoom(page);

    const trigger = page.getByRole("button", { name: /Find governed objects/ });
    await trigger.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog", { name: "Find governed objects" });
    await expect(dialog).toBeVisible();
    const search = dialog.getByRole("textbox", {
      name: "Find governed objects",
    });
    await expect(search).toBeFocused();
    await search.fill("provenance");
    await expect(
      dialog.getByRole("button", { name: /Provenance/ }),
    ).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("CR-05 has no mobile overflow or serious accessibility violations", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openControlRoom(page);

    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    const serious = results.violations.filter(
      (violation) =>
        violation.impact === "serious" || violation.impact === "critical",
    );
    expect(
      serious,
      serious
        .map((violation) => `${violation.id}: ${violation.help}`)
        .join("\n"),
    ).toEqual([]);
  });

  test("CR-06 workspace header opens the real object finder", async ({
    page,
  }) => {
    await signUpToDashboard(page, "Finder Lab");
    const headerSearch = page.getByRole("searchbox", {
      name: "Find governed objects",
    });
    await headerSearch.fill("mission");
    await headerSearch.press("Enter");
    await expect(page).toHaveURL(/\/control-room\?find=1&q=mission$/);
    await expect(
      page.getByRole("dialog", { name: "Find governed objects" }),
    ).toBeVisible();
    await expect(
      page
        .getByRole("dialog", { name: "Find governed objects" })
        .getByRole("textbox", { name: "Find governed objects" }),
    ).toHaveValue("mission");
  });

  test("CR-10 finder copy stays on one line and ellipsizes when narrow", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 844 });
    await openControlRoom(page);

    const trigger = page.getByRole("button", { name: "Find governed objects" });
    const triggerCopy = trigger.locator("span");
    await expect(triggerCopy).toHaveCSS("white-space", "nowrap");
    await expect(triggerCopy).toHaveCSS("overflow", "hidden");
    await expect(triggerCopy).toHaveCSS("text-overflow", "ellipsis");

    await trigger.click();
    const search = page
      .getByRole("dialog", { name: "Find governed objects" })
      .getByRole("textbox", { name: "Find governed objects" });
    await expect(search).toHaveCSS("white-space", "nowrap");
    const placeholder = page.getByTestId("control-search-placeholder");
    await expect(placeholder).toHaveCSS("white-space", "nowrap");
    await expect(placeholder).toHaveCSS("overflow", "hidden");
    await expect(placeholder).toHaveCSS("text-overflow", "ellipsis");

    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test("CR-11 pointer focus removes blue input frame but keyboard focus remains visible", async ({
    page,
  }) => {
    await openControlRoom(page);

    const trigger = page.getByRole("button", { name: "Find governed objects" });
    await trigger.click();
    const search = page
      .getByRole("dialog", { name: "Find governed objects" })
      .getByRole("textbox", { name: "Find governed objects" });
    await expect(search).toBeFocused();
    await expect(search).toHaveCSS("outline-style", "none");
    await expect(search).toHaveCSS("box-shadow", "none");

    await page.keyboard.press("Escape");
    await page.keyboard.press("Tab");
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(search).toBeFocused();
    await expect(search).toHaveCSS("outline-style", "solid");
    await expect(search).toHaveCSS("outline-color", "rgb(49, 95, 232)");
  });

  test("CR-07 Skill Registry is operational without implying execution", async ({
    page,
  }) => {
    await openControlRoom(page);
    await page.getByRole("tab", { name: "System map" }).click();

    const registry = page.getByRole("button", { name: /Skill registry/ });
    await expect(
      registry.getByText("available", { exact: true }),
    ).toBeVisible();
    await registry.click();

    const inspector = page.getByRole("complementary", {
      name: "Context inspector",
    });
    await expect(
      inspector.getByRole("heading", { name: "Skill registry" }),
    ).toBeVisible();
    await expect(
      inspector.getByText("Deterministic Skill Registry"),
    ).toBeVisible();
    await expect(
      inspector.getByText("Execute a skill or mutate Mission and Truth state"),
    ).toBeVisible();
  });

  test("CR-08 Execution Fabric exposes the Manual Bridge without implying verification", async ({
    page,
  }) => {
    await openControlRoom(page);
    await page.getByRole("tab", { name: "System map" }).click();

    const bridgeNode = page.getByRole("button", { name: /Manual bridge/ });
    await expect(
      bridgeNode.getByText("available", { exact: true }),
    ).toBeVisible();
    await bridgeNode.click();
    const inspector = page.getByRole("complementary", {
      name: "Context inspector",
    });
    await expect(
      inspector.getByText("Treat a provider claim as independent verification"),
    ).toBeVisible();

    await page.getByRole("tab", { name: "Work" }).click();
    await page.getByText("Execution and assurance details").click();
    await expect(
      page.getByRole("heading", { name: "Manual Provider Bridge" }),
    ).toBeVisible();
    await expect(
      page.getByText(
        "Imported provider results are execution claims, not independent verification.",
      ),
    ).toBeVisible();
    await expect(page.getByLabel("Manual Bridge sequence")).toContainText(
      "Instruction",
    );
    await expect(page.getByText("No execution TIPs yet")).toBeVisible();
  });

  test("CR-09 Verification Governance is operational without implying public release", async ({
    page,
  }) => {
    await openControlRoom(page);
    await page.getByRole("tab", { name: "System map" }).click();

    const verification = page.getByRole("button", {
      name: /VER-31.*Verification/,
    });
    const release = page.getByRole("button", {
      name: /RLS-32.*Release governance/,
    });
    await expect(
      verification.getByText("available", { exact: true }),
    ).toBeVisible();
    await expect(release.getByText("available", { exact: true })).toBeVisible();

    await verification.click();
    const inspector = page.getByRole("complementary", {
      name: "Context inspector",
    });
    await expect(
      inspector.getByText("Deterministic Verification Governance Kernel"),
    ).toBeVisible();
    await expect(
      inspector.getByText(
        "Convert deferred or incomplete evidence into a pass",
      ),
    ).toBeVisible();

    await page.getByRole("tab", { name: "Work" }).click();
    await page.getByText("Execution and assurance details").click();
    await expect(
      page.getByRole("heading", { name: "Verify before release" }),
    ).toBeVisible();
    const sequence = page.getByLabel("Verification governance sequence");
    await expect(sequence).toContainText("Requirement coverage");
    await expect(sequence).toContainText("Release ceiling");
    await expect(page.getByText("No Verify Reports yet")).toBeVisible();
  });

  test("CR-12 finder returns real governed records, not only navigation modules", async ({
    page,
  }) => {
    const { dashboardUrl } = await signUpToDashboard(page, "Finder Records");
    await page.goto(`${dashboardUrl}/skills`);
    await page
      .getByText("Register a new skill contract", { exact: true })
      .click();
    const form = page.getByRole("form", { name: "Register skill contract" });
    await form.getByLabel("Stable skill key").fill("finder-proof");
    await form.getByLabel("Display name").fill("Finder Proof Contract");
    await form
      .getByLabel("Operator description")
      .fill("A real governed record discoverable by the workspace finder.");
    await form.getByLabel("Semantic version").fill("1.0.0");
    await form.getByLabel("Verifier key").fill("deterministic-finder");
    await form.getByLabel("Capabilities").fill("governed_search");
    await form.getByRole("button", { name: "Save governed record" }).click();
    await expect(page.getByText("Finder Proof Contract")).toBeVisible();
    await expect(page.getByText("active v1.0.0")).toBeVisible();

    await page.goto(`${dashboardUrl}/control-room?find=1`);
    const dialog = page.getByRole("dialog", { name: "Find governed objects" });
    await dialog
      .getByRole("textbox", { name: "Find governed objects" })
      .fill("finder-proof");
    const record = dialog.getByRole("link", { name: /Finder Proof Contract/ });
    await expect(record).toBeVisible();
    await expect(record).toContainText("Skill · finder-proof · Active");
    await record.click();
    await expect(page).toHaveURL(/\/skills$/);
  });

  test("CR-13 an approved mission exposes one direct next step", async ({
    page,
  }) => {
    const { dashboardUrl } = await signUpToDashboard(page, "Resume Work Lab");
    await page.goto(`${dashboardUrl}/missions/new`);
    await page.getByLabel("Mission title").fill("UAV crop health research");
    await page
      .getByLabel("Objective")
      .fill("Establish a governed evidence base for early crop diagnosis.");
    await page.getByLabel("Scope").fill("One bounded agricultural pilot.");
    await page
      .getByLabel("Success definition")
      .fill("A retained research record with attributable sources.");
    await page.getByTestId("mission-contract-details").locator("summary").click();
    await page.getByLabel("Requirement title").fill("Source integrity");
    await page
      .getByLabel("Acceptance criteria")
      .fill("Every material claim is linked to retained evidence.");
    await page.getByLabel("Obligation title").fill("Review evidence quality");
    await page.getByRole("button", { name: "Create draft mission" }).click();
    await page.waitForURL(/\/missions\/[0-9a-f-]{36}/);
    const missionId = page.url().match(/\/missions\/([0-9a-f-]{36})/)?.[1];
    expect(missionId).toBeTruthy();

    await page.getByRole("button", { name: "Submit for review" }).click();
    await page.getByRole("button", { name: "Approve contract" }).click();
    await expect(page.getByText(/next stage Exploring/)).toBeVisible();
    await page.goto(`${dashboardUrl}/control-room`);

    await expect(
      page.getByRole("heading", { name: "UAV crop health research" }),
    ).toBeVisible();
    const nextStep = page.getByRole("link", {
      name: "Start governed research",
    });
    await expect(nextStep).toHaveAttribute(
      "href",
      `${dashboardUrl.replace(/^https?:\/\/[^/]+/, "")}/research?missionId=${missionId}`,
    );
    await nextStep.click();
    await expect(page).toHaveURL(
      new RegExp(`/research\\?missionId=${missionId}$`),
    );
  });
});
