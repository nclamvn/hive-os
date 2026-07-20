import { expect, test } from "@playwright/test";

test("health route reports database connectivity", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.status).toBe("ok");
  expect(body.database.status).toBe("ok");
  expect(typeof body.checkedAt).toBe("string");
});

test("app shell placeholder renders", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "HIVE OS" })).toBeVisible();
  await expect(page.getByText("Foundation established (TIP-001)")).toBeVisible();
});
