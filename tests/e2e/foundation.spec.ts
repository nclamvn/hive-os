import { expect, test } from "@playwright/test";

test("health route reports database connectivity", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.status).toBe("ok");
  expect(body.database.status).toBe("ok");
  expect(body.storage.status).toBe("ok");
  expect(typeof body.checkedAt).toBe("string");
});

test("PRC-03 liveness is process-only and readiness checks dependencies", async ({
  request,
}) => {
  const live = await request.get("/api/health/live");
  expect(live.status()).toBe(200);
  expect((await live.json()).status).toBe("ok");

  const ready = await request.get("/api/health/ready");
  expect(ready.status()).toBe(200);
  const report = await ready.json();
  expect(report.database.status).toBe("ok");
  expect(report.storage.status).toBe("ok");
});

test("PRC-04 correlation IDs are validated and propagated", async ({
  request,
}) => {
  const valid = await request.get("/api/health/live", {
    headers: { "x-correlation-id": "pilot-request-001" },
  });
  expect(valid.headers()["x-correlation-id"]).toBe("pilot-request-001");

  const malformed = await request.get("/api/health/live", {
    headers: { "x-correlation-id": "unsafe value with spaces" },
  });
  expect(malformed.headers()["x-correlation-id"]).toMatch(/^[0-9a-f-]{36}$/);
});

test("unauthenticated root redirects to sign-in", async ({ page }) => {
  await page.goto("/");
  await page.waitForURL("**/sign-in");
  await expect(
    page.getByRole("heading", { level: 1, name: "Đăng nhập" }),
  ).toBeVisible();
});
