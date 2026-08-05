import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { signUpToDashboard } from "./auth-helpers";

test.describe("TIP-017 Settings Productization", () => {
  test("SET-01 saves effective policy and prefills Mission assurance", async ({
    page,
  }) => {
    const { dashboardUrl } = await signUpToDashboard(
      page,
      "Settings Policy QA",
    );
    await page.goto(`${dashboardUrl}/settings`);

    await expect(
      page.getByRole("heading", {
        name: "Define what this workspace may do before work begins.",
      }),
    ).toBeVisible();
    const form = page.getByRole("form", { name: "Workspace operating policy" });
    await form.getByLabel("Default Mission assurance").selectOption("RESEARCH");
    await form
      .getByLabel("Public release ceiling")
      .selectOption("INTERNAL_ONLY");
    await form
      .getByLabel("Manual provider policy")
      .selectOption("ALLOWLIST_MANUAL");
    await form
      .getByLabel("Allowed provider and model identifiers")
      .fill("approved-provider | builder-v1, verifier-v1");
    await form.getByRole("button", { name: "Save operating policy" }).click();
    await expect(page.getByText("Operating policy saved")).toBeVisible();

    await page.goto(`${dashboardUrl}/missions/new`);
    await expect(page.getByLabel("Assurance profile")).toHaveValue("RESEARCH");
  });

  test("SET-02 is accessible and overflow-free at 320px", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 844 });
    const { dashboardUrl } = await signUpToDashboard(page, "Settings Mobile");
    await page.goto(`${dashboardUrl}/settings`);

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

  test("L10N-SET-01 Vietnamese localizes settings and every settings tab", async ({
    page,
  }) => {
    const { dashboardUrl } = await signUpToDashboard(
      page,
      "Cài đặt tiếng Việt",
      "vi",
    );
    await page.goto(`${dashboardUrl}/settings`);

    await expect(
      page.getByRole("heading", {
        name: "Xác định quyền hạn trước khi công việc bắt đầu.",
      }),
    ).toBeVisible();
    const form = page.getByRole("form", {
      name: "Chính sách vận hành của không gian làm việc",
    });
    await expect(
      form.getByLabel("Hồ sơ bảo chứng mặc định cho nhiệm vụ"),
    ).toBeVisible();
    await expect(
      form.getByRole("button", { name: "Lưu chính sách vận hành" }),
    ).toBeVisible();
    await expect(page.getByText("Workspace control plane")).toHaveCount(0);

    await page.goto(`${dashboardUrl}/settings/workspace`);
    await expect(
      page.getByRole("heading", { name: "Hồ sơ không gian làm việc" }),
    ).toBeVisible();
    await expect(page.getByLabel("Tên không gian làm việc")).toBeVisible();

    await page.goto(`${dashboardUrl}/settings/members`);
    await expect(
      page.getByRole("heading", { name: "Mời thành viên" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Tạo lời mời" }),
    ).toBeVisible();

    await page.goto(`${dashboardUrl}/settings/audit`);
    await expect(
      page.getByRole("heading", { name: "Sự kiện kiểm toán" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Tải sổ cái" })).toBeVisible();
  });

  test("SET-03 audit ledger export is authenticated and workspace-scoped", async ({
    page,
  }) => {
    const { dashboardUrl } = await signUpToDashboard(
      page,
      "Settings Audit Export",
    );
    await page.goto(`${dashboardUrl}/settings/audit`);
    await expect(
      page.getByRole("link", { name: "Download ledger" }),
    ).toBeVisible();

    const workspaceSlug = new URL(dashboardUrl).pathname.split("/")[2];
    const response = await page.request.get(
      `/api/w/${workspaceSlug}/exports/audit`,
    );
    expect(response.status()).toBe(200);
    expect(response.headers()["content-disposition"]).toContain("attachment");
    await expect(response.json()).resolves.toMatchObject({
      schema: "hive-os.governed-export.v1",
      exportType: "audit-ledger",
      workspace: { slug: workspaceSlug },
    });
  });

  test("SET-04 export endpoints reject unauthenticated requests", async ({
    request,
  }) => {
    const response = await request.get(
      "/api/w/nonexistent-workspace/exports/audit",
    );
    expect(response.status()).toBe(401);
    await expect(response.json()).resolves.toEqual({
      error: "UNAUTHENTICATED",
    });
  });
});
