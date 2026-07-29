import { getDb } from "./db";
import { writeOperationalEvent } from "./observability/operational-log";
import { getObjectStorage } from "./storage";

export type DatabaseHealth =
  | { status: "ok"; latencyMs: number }
  | { status: "unreachable" };

export interface HealthReport {
  status: "ok" | "degraded";
  database: DatabaseHealth;
  storage: { status: "ok" | "unreachable" };
  checkedAt: string;
}

/**
 * Database connectivity boundary. Reports reachability only — no synthetic
 * uptime, scores, or metrics. Errors are contained here; connection details
 * never surface in the response.
 */
export async function checkDatabaseHealth(
  correlationId?: string,
): Promise<DatabaseHealth> {
  const startedAt = performance.now();
  try {
    await getDb().$queryRaw`SELECT 1`;
    return {
      status: "ok",
      latencyMs: Math.round(performance.now() - startedAt),
    };
  } catch (error) {
    writeOperationalEvent({
      level: "error",
      event: "database.readiness_failed",
      outcome: "failure",
      component: "database",
      correlationId,
      errorType: error instanceof Error ? error.name : "UnknownError",
    });
    return { status: "unreachable" };
  }
}

export async function getHealthReport(
  correlationId?: string,
): Promise<HealthReport> {
  const [database, storage] = await Promise.all([
    checkDatabaseHealth(correlationId),
    checkObjectStorageHealth(correlationId),
  ]);
  return {
    status:
      database.status === "ok" && storage.status === "ok" ? "ok" : "degraded",
    database,
    storage,
    checkedAt: new Date().toISOString(),
  };
}

/**
 * Non-mutating dependency probe. A missing reserved object is healthy; an
 * authentication, network, or filesystem failure is not.
 */
export async function checkObjectStorageHealth(
  correlationId?: string,
): Promise<{
  status: "ok" | "unreachable";
}> {
  try {
    await getObjectStorage().head(".health/readiness");
    return { status: "ok" };
  } catch (error) {
    writeOperationalEvent({
      level: "error",
      event: "storage.readiness_failed",
      outcome: "failure",
      component: "storage",
      correlationId,
      errorType: error instanceof Error ? error.name : "UnknownError",
    });
    return { status: "unreachable" };
  }
}
