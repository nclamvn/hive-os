import { describe, expect, it } from "vitest";

import { getDb } from "@/server/db";
import { checkDatabaseHealth } from "@/server/health";

describe("database foundation (hiveos_test)", () => {
  it("reports a healthy connectivity boundary", async () => {
    const health = await checkDatabaseHealth();
    expect(health.status).toBe("ok");
    if (health.status === "ok") {
      expect(health.latencyMs).toBeGreaterThanOrEqual(0);
    }
  });

  it("has the committed foundation migration applied", async () => {
    const rows = await getDb().$queryRaw<
      { migration_name: string }[]
    >`SELECT migration_name FROM _prisma_migrations WHERE finished_at IS NOT NULL ORDER BY migration_name`;
    expect(rows.map((r) => r.migration_name)).toContain(
      "20260720063545_foundation_bootstrap",
    );
  });

  it("can write and read the schema_bootstrap marker", async () => {
    const db = getDb();
    const created = await db.schemaBootstrap.create({
      data: { note: "integration-test marker" },
    });
    const found = await db.schemaBootstrap.findUnique({
      where: { id: created.id },
    });
    expect(found?.note).toBe("integration-test marker");
    await db.schemaBootstrap.delete({ where: { id: created.id } });
  });
});
