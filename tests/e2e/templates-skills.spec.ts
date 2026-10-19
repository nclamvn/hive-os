import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { signUpToDashboard } from "./auth-helpers";

test.describe("TIP-014 Templates and Skill Library", () => {
  test("TS-01/02 applies deterministic defaults without bypassing Mission governance", async ({
    page,
  }) => {
    const { dashboardUrl } = await signUpToDashboard(page, "Template QA");
    await page.goto(`${dashboardUrl}/templates`);
    await expect(
      page.getByRole("heading", { name: "Start governed. Stay editable." }),
    ).toBeVisible();
    await page
      .getByRole("link", {
        name: "Use Research evidence synthesis template",
      })
      .click();

    await expect(page.getByLabel("Assurance profile")).toHaveValue("RESEARCH");
    await expect(page.getByLabel("Objective")).toHaveValue(
      "Answer the research question using reproducible evidence synthesis.",
    );
    await expect(page.getByLabel("Mission title")).toHaveValue("");

    await page.getByLabel("Mission title").fill("Evidence synthesis QA");
    await page.getByRole("button", { name: "Create draft mission" }).click();
    await page.waitForURL(/\/missions\/[0-9a-f-]{36}/);
    await expect(
      page.getByText("Scoped", { exact: true }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Submit for review" }),
    ).toBeVisible();
  });

  test("L10N-TPL-01 Vietnamese localizes the catalog and template draft", async ({
    page,
  }) => {
    const { dashboardUrl } = await signUpToDashboard(
      page,
      "Mẫu tiếng Việt",
      "vi",
    );
    await page.goto(`${dashboardUrl}/templates`);
    await expect(
      page.getByRole("heading", {
        name: "Khởi đầu có quản trị. Luôn có thể chỉnh sửa.",
      }),
    ).toBeVisible();
    await expect(page.getByText("Rapid operational brief")).toHaveCount(0);
    await page
      .getByRole("link", {
        name: "Dùng mẫu Tổng hợp bằng chứng nghiên cứu",
      })
      .click();

    await expect(page.getByLabel("Hồ sơ bảo chứng")).toHaveValue("RESEARCH");
    await expect(page.getByLabel("Mục tiêu")).toHaveValue(
      "Trả lời câu hỏi nghiên cứu bằng quy trình tổng hợp bằng chứng có thể tái lập.",
    );
    await expect(page.getByLabel("Tên nhiệm vụ")).toHaveValue("");
  });

  test("TS-03/05 registers, versions and explicitly activates a skill", async ({
    page,
  }) => {
    const { dashboardUrl } = await signUpToDashboard(page, "Skill QA");
    await page.goto(`${dashboardUrl}/skills`);
    await page
      .getByText("Register a new skill contract", { exact: true })
      .click();

    const register = page.getByRole("form", {
      name: "Register skill contract",
    });
    await register.getByLabel("Stable skill key").fill("evidence-refinery");
    await register.getByLabel("Display name").fill("Evidence Refinery");
    await register
      .getByLabel("Operator description")
      .fill("Retains bounded evidence and deterministic registry output.");
    await register.getByLabel("Semantic version").fill("1.0.0");
    await register.getByLabel("Verifier key").fill("registry-hygiene");
    await register
      .getByLabel("Capabilities")
      .fill("evidence_ingestion, deterministic_registry");
    await register
      .getByRole("button", { name: "Save governed record" })
      .click();
    await expect(page.getByText("Evidence Refinery")).toBeVisible();
    await expect(page.getByText("active v1.0.0")).toBeVisible();

    await page.getByText("Contract governance", { exact: true }).click();
    const candidate = page.getByRole("form", {
      name: "Register version for evidence-refinery",
    });
    await candidate.getByLabel("Semantic version").fill("1.1.0");
    await candidate.getByLabel("Verifier key").fill("registry-hygiene");
    await candidate
      .getByLabel("Capabilities")
      .fill("evidence_ingestion, deterministic_registry, registry_audit");
    await candidate
      .getByRole("button", { name: "Save governed record" })
      .click();
    await expect(page.getByText("2 immutable versions")).toBeVisible();

    const activation = page.getByRole("form", {
      name: "Activate version for evidence-refinery",
    });
    await activation.getByLabel("Candidate version").selectOption({
      label: "v1.1.0",
    });
    await activation
      .getByLabel("Activation reason")
      .fill("Approved registry audit capability.");
    await activation
      .getByRole("button", { name: "Save governed record" })
      .click();
    await expect(page.getByText("active v1.1.0")).toBeVisible();
  });

  test("L10N-SKL-01 Vietnamese localizes the skill registry and forms", async ({
    page,
  }) => {
    const { dashboardUrl } = await signUpToDashboard(
      page,
      "Kỹ năng tiếng Việt",
      "vi",
    );
    await page.goto(`${dashboardUrl}/skills`);

    await expect(
      page.getByRole("heading", {
        name: "Biết rõ năng lực nào được phép chạy trước khi thực thi.",
      }),
    ).toBeVisible();
    await expect(page.getByText("Skill Library", { exact: true })).toHaveCount(
      0,
    );

    await page
      .getByText("Đăng ký hợp đồng kỹ năng mới", { exact: true })
      .click();
    const register = page.getByRole("form", {
      name: "Đăng ký hợp đồng kỹ năng",
    });
    await expect(register.getByLabel("Khóa kỹ năng ổn định")).toBeVisible();
    await expect(register.getByLabel("JSON Schema đầu vào")).toBeVisible();
    await expect(
      register.getByRole("button", { name: "Lưu bản ghi có quản trị" }),
    ).toBeVisible();
  });

  test("TIP022-UI-01 applies the RtR engineering-change pilot template", async ({
    page,
  }) => {
    const { dashboardUrl } = await signUpToDashboard(page, "RtR Pilot");
    await page.goto(`${dashboardUrl}/templates`);
    await page
      .getByRole("link", {
        name: "Use RtR engineering change dossier template",
      })
      .click();

    await expect(page.getByLabel("Assurance profile")).toHaveValue(
      "PROFESSIONAL",
    );
    await expect(page.getByLabel("Success definition")).toHaveValue(
      /immutable release manifest/,
    );
    await page.getByLabel("Mission title").fill("Gimbal control revision");
    await page.getByRole("button", { name: "Create draft mission" }).click();
    await page.waitForURL(/\/missions\/[0-9a-f-]{36}/);

    await page.goto(`${dashboardUrl}/reports`);
    await expect(page.getByText("Gimbal control revision")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Build dossier" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Pilot measurement" }),
    ).toBeVisible();
    await page.getByRole("link", { name: "View pilot report" }).click();
    await expect(
      page.getByRole("heading", { name: "Governed throughput eligibility" }),
    ).toBeVisible();
    await expect(page.getByText("not yet eligible")).toBeVisible();
  });

  test("TS-08 remains overflow-free and accessible at 320px", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 844 });
    const { dashboardUrl } = await signUpToDashboard(page, "Template Mobile");
    for (const path of ["/templates", "/skills"]) {
      await page.goto(`${dashboardUrl}${path}`);
      expect(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth -
            document.documentElement.clientWidth,
        ),
      ).toBeLessThanOrEqual(1);
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
});
