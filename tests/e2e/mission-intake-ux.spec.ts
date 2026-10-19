import { expect, test } from "@playwright/test";

import { signUpToDashboard } from "./auth-helpers";

const copy = {
  en: { newMission: "New mission", open: "Open navigation", navigation: "Navigation", title: "Mission title", objective: "Objective", scope: "Scope", success: "Success definition", requirement: "Requirement title", criteria: "Acceptance criteria", obligation: "Obligation title", submit: "Create draft mission", submitReview: "Submit for review", draft: "Draft" },
  vi: { newMission: "Nhiệm vụ mới", open: "Mở điều hướng", navigation: "Điều hướng", title: "Tên nhiệm vụ", objective: "Mục tiêu", scope: "Phạm vi", success: "Định nghĩa thành công", requirement: "Tên yêu cầu", criteria: "Tiêu chí chấp nhận", obligation: "Tên nghĩa vụ", submit: "Tạo nhiệm vụ nháp", submitReview: "Gửi rà soát", draft: "Bản nháp" },
} as const;

for (const locale of ["en", "vi"] as const) {
  test(`mission intake: responsive navigation, editable drafts and real saved contract (${locale})`, async ({ page }, testInfo) => {
    const labels = copy[locale];
    const { dashboardUrl } = await signUpToDashboard(page, `Intake UX ${locale}`, locale);
    const newUrl = `${dashboardUrl}/missions/new`;

    for (const width of [1440, 900, 390]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`${dashboardUrl}/research`);
      let navigation = page.getByTestId(width === 1440 ? "sidebar-desktop" : "sidebar-iconrail");
      if (width === 390) {
        await page.getByRole("button", { name: labels.open, exact: true }).click();
        navigation = page.getByRole("dialog", { name: labels.navigation, exact: true });
      }
      const newMission = navigation.getByRole("link", { name: labels.newMission, exact: true });
      await expect(newMission).toHaveAttribute("href", new URL(newUrl).pathname);
      await newMission.click();
      await expect(page).toHaveURL(newUrl);
      const details = page.getByTestId("mission-contract-details");
      await expect(details).not.toHaveAttribute("open", "");
      for (const label of [labels.title, labels.objective, labels.scope, labels.success]) {
        await expect(page.getByLabel(label, { exact: true })).toBeVisible();
      }
      for (const label of [labels.requirement, labels.criteria, labels.obligation]) {
        await expect(page.getByLabel(label, { exact: true })).toBeHidden();
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
      await page.screenshot({ path: testInfo.outputPath(`mission-intake-${locale}-${width}.png`), fullPage: true });
    }

    const title = `Synthetic intake ${locale}`;
    const result = "A bounded answer with retained evidence and explicit gaps.";
    await page.getByLabel(labels.title, { exact: true }).fill(title);
    await page.getByLabel(labels.objective, { exact: true }).fill("Inspect the synthetic mission intake workflow only.");
    await page.getByLabel(labels.scope, { exact: true }).fill("Isolated test data; no model, research or provider execution.");
    await page.getByLabel(labels.success, { exact: true }).fill(result);
    const details = page.getByTestId("mission-contract-details");
    await details.locator("summary").click();
    await expect(page.getByLabel(labels.requirement, { exact: true })).toHaveValue(title);
    await expect(page.getByLabel(labels.criteria, { exact: true })).toHaveValue(result);
    await page.getByLabel(labels.requirement, { exact: true }).fill("");
    await details.locator("summary").click();

    const posts: string[] = [];
    page.on("request", (request) => { if (request.method() === "POST") posts.push(request.url()); });
    await page.getByRole("button", { name: labels.submit, exact: true }).click();
    await expect(details).toHaveAttribute("open", "");
    await expect(page.getByLabel(labels.requirement, { exact: true })).toBeFocused();
    await expect(page).toHaveURL(newUrl);
    expect(posts).toEqual([]);

    // Start a fresh form to test untouched suggestions, not repaired overrides.
    await page.reload();
    await page.getByLabel(labels.title, { exact: true }).fill(title);
    await page.getByLabel(labels.objective, { exact: true }).fill("Inspect the synthetic mission intake workflow only.");
    await page.getByLabel(labels.scope, { exact: true }).fill("Isolated test data; no model, research or provider execution.");
    await page.getByLabel(labels.success, { exact: true }).fill(result);
    await expect(details).not.toHaveAttribute("open", "");
    await page.getByRole("button", { name: labels.submit, exact: true }).click();
    await page.waitForURL(/\/missions\/[0-9a-f-]{36}/);
    const detailUrl = page.url();
    await page.goto(`${detailUrl}?view=contract`);
    // A fresh server navigation must expose the persisted requirement and criteria.
    await expect(page.getByText(`REQ-001 · ${title}`, { exact: true })).toBeVisible();
    await expect(page.getByText(result, { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Inspect the synthetic mission intake workflow only.", { exact: true })).toBeVisible();
    await expect(page.getByText("v1 · " + labels.draft, { exact: true })).toBeVisible();
    expect(posts.length).toBe(1);
  });
}
