import { expect, test } from "@playwright/test";

import { signUpToDashboard } from "./auth-helpers";

test("research sections share the workspace grid without horizontal overflow", async ({ page }, testInfo) => {
  const { dashboardUrl } = await signUpToDashboard(page, "Research layout");
  await page.goto(`${dashboardUrl}/missions/new`);
  await page.getByLabel("Mission title").fill("Research interface layout review");
  await page.getByLabel("Objective").fill("Check the research request form at desktop and mobile widths.");
  await page.getByLabel("Scope").fill("Interface only; no research execution or provider calls.");
  await page.getByLabel("Success definition").fill("Aligned sections and readable request fields without overflow.");
  await page.getByTestId("mission-contract-details").locator("summary").click();
  await page.getByLabel("Requirement title").fill("Responsive request form");
  await page.getByLabel("Acceptance criteria").fill("All sections share the workspace grid at 1440, 900 and 390 pixels.");
  await page.getByLabel("Obligation title").fill("Inspect visual evidence");
  await page.getByRole("button", { name: "Create draft mission" }).click();
  await page.waitForURL(/\/missions\/[0-9a-f-]{36}/);
  await page.goto(`${dashboardUrl}/research`);
  await expect(page.getByRole("textbox", { name: "Outcome you need" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Submit research request" })).toBeVisible();
  await expect(page.getByText("Mode: request a worker run", { exact: true })).toBeVisible();
  await expect(page.getByText("Execution readiness is not confirmed.", { exact: false })).toBeVisible();
  const campaignDisclosure = page.locator("details").filter({
    has: page.locator("summary", { hasText: "Expert: campaigns and test tools" }),
  });
  await expect(campaignDisclosure).not.toHaveAttribute("open", "");
  const sections = [
    page.locator('section[aria-labelledby="research-entry-title"]'),
    page.locator("#new-research"),
    page.locator('section[aria-labelledby="research-runs"]'),
  ];
  for (const section of sections) await expect(section).toBeVisible();
  await expect.poll(async () => {
    const [entry, goal, recent] = await Promise.all(sections.map((section) => section.boundingBox()));
    return Boolean(entry && goal && recent && goal.y < recent.y && recent.y < entry.y);
  }, { message: "Goal comes first, followed by work, then examples" }).toBe(true);

  for (const width of [1440, 900, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await expect.poll(async () => {
      const boxes = await Promise.all(sections.map((section) => section.boundingBox()));
      if (boxes.some((box) => box === null)) return Infinity;
      const edges = boxes.map((box) => ({ left: box!.x, right: box!.x + box!.width }));
      return Math.max(
        Math.max(...edges.map((edge) => edge.left)) - Math.min(...edges.map((edge) => edge.left)),
        Math.max(...edges.map((edge) => edge.right)) - Math.min(...edges.map((edge) => edge.right)),
      );
    }, { message: `Research section edges align at ${width}px` }).toBeLessThanOrEqual(1);
    await expect.poll(() => page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth,
    ), { message: `No page overflow at ${width}px` }).toBeLessThanOrEqual(1);
    if (width === 1440 || width === 390) {
      await page.screenshot({ path: testInfo.outputPath(`research-layout-${width}.png`), fullPage: true });
    }
  }
});

test("research entry and account actions stay usable across desktop, tablet and mobile", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  const { dashboardUrl } = await signUpToDashboard(page, "Research handoff");
  await page.goto(`${dashboardUrl}/research`);
  await expect(page.getByRole("heading", { name: "Cases, examples and workbenches" })).toBeVisible();
  await page.getByRole("link", { name: "Poly19 proof and evidence", exact: false }).first().click();
  await expect(page).toHaveURL(/\/research\/poly19/);
  await expect(page.getByRole("heading", { level: 1, name: "Native Poly19 demonstration" })).toBeVisible();
  await expect(page.getByTestId("sidebar-desktop").getByRole("link", { name: "Research", exact: true }))
    .toHaveAttribute("aria-current", "page");

  await page.setViewportSize({ width: 900, height: 900 });
  const rail = page.getByTestId("sidebar-iconrail");
  await rail.locator("summary").click();
  await expect(rail.getByRole("link", { name: "Account security" })).toBeVisible();
  await expect(rail.getByRole("button", { name: "Sign out", exact: true })).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  const menu = page.getByRole("button", { name: "Open navigation" });
  await menu.click();
  const dialog = page.getByRole("dialog", { name: "Navigation", exact: true });
  const account = dialog.locator("summary").last();
  await account.focus();
  await page.keyboard.press("Tab");
  await expect(dialog.getByRole("button", { name: "Close navigation" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(account).toBeFocused();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
  await expect(dialog.getByRole("link", { name: "Account security" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(menu).toBeFocused();

  await menu.click();
  await expect(dialog).toBeVisible();
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  await page.setViewportSize({ width: 900, height: 900 });
  await expect(dialog).toBeHidden();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await expect(page.locator("#main-content")).toBeFocused();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(dialog).toBeHidden();
  await menu.click();
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
});
