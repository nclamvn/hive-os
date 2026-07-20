import { getDb } from "./db";

export type DatabaseHealth =
  | { status: "ok"; latencyMs: number }
  | { status: "unreachable" };

export interface HealthReport {
  status: "ok" | "degraded";
  database: DatabaseHealth;
  checkedAt: string;
}

/**
 * Database connectivity boundary. Reports reachability only — no synthetic
 * uptime, scores, or metrics. Errors are contained here; connection details
 * never surface in the response.
 */
export async function checkDatabaseHealth(): Promise<DatabaseHealth> {
  const startedAt = performance.now();
  try {
    await getDb().$queryRaw`SELECT 1`;
    return {
      status: "ok",
      latencyMs: Math.round(performance.now() - startedAt),
    };
  } catch {
    return { status: "unreachable" };
  }
}

export async function getHealthReport(): Promise<HealthReport> {
  const database = await checkDatabaseHealth();
  return {
    status: database.status === "ok" ? "ok" : "degraded",
    database,
    checkedAt: new Date().toISOString(),
  };
}
