// Read-only local infrastructure check. It never reads or prints a provider key.
import "dotenv/config";
import { spawnSync } from "node:child_process";

import pg from "pg";

const output = {
  gate: "MATH_PILOT_LOCAL_PREFLIGHT",
  database: "NOT_READY",
  migration: "NOT_READY",
  runtimeAccountingMigration: "NOT_READY",
  codexLocalMigration: "NOT_READY",
  reviewDeskMigration: "NOT_READY",
  agentReviewMigration: "NOT_READY",
  controlledCycleMigration: "NOT_READY",
  frontierGateMigration: "NOT_READY",
  codexLocalMode: process.env.RESEARCH_CODEX_LOCAL_ENABLED === "true" ? "EXPLICITLY_ENABLED" : "DISABLED",
  codexSubscriptionLogin: "UNVERIFIED",
  retainedLocalModelAttempts: 0,
  retainedAgentReviews: 0,
  rowLevelSecurity: "NOT_READY",
  docker: "NOT_READY",
  queue: process.env.MATH_PILOT_QUEUE_ENABLED === "true" ? "EXPLICITLY_ENABLED" : "DISABLED",
  worker: "UNVERIFIED",
  provider: "UNVERIFIED",
  independentReviewer: "UNVERIFIED",
  localAutonomousReview: "NOT_ESTABLISHED",
  hardUsdBudgetControl: "NOT_ESTABLISHED",
  calibration: "NOT_CERTIFIED",
  readyForLiveOpenProblem: false,
};

const rawUrl = process.env.DATABASE_MIGRATION_URL ?? process.env.DATABASE_URL;
if (!rawUrl) {
  output.database = "MISSING_LOCAL_DATABASE_URL";
  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
  process.exitCode = 1;
} else {
  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    output.database = "INVALID_LOCAL_DATABASE_URL";
  }
  if (url && !["localhost", "127.0.0.1", "::1", "[::1]"].includes(url.hostname)) {
    output.database = "REFUSED_NON_LOCAL_DATABASE";
  } else if (url && !["hiveos_dev", "hiveos_test"].includes(url.pathname.slice(1))) {
    output.database = "REFUSED_NON_PILOT_DATABASE";
  } else if (url) {
    const client = new pg.Client({ connectionString: rawUrl, connectionTimeoutMillis: 3_000 });
    try {
      await client.connect();
      output.database = "READY";
      const migration = await client.query(
        "SELECT finished_at IS NOT NULL AS applied FROM _prisma_migrations WHERE migration_name = '20260928120000_math_pilot_gate' ORDER BY started_at DESC LIMIT 1",
      );
      output.migration = migration.rows[0]?.applied === true ? "READY" : "NOT_APPLIED";
      const accounting = await client.query(
        "SELECT migration_name, finished_at IS NOT NULL AS applied FROM _prisma_migrations WHERE migration_name IN ('20260928130000_math_pilot_provider_usage', '20260928140000_math_pilot_dispatch_fence')",
      );
      output.runtimeAccountingMigration = accounting.rows.length === 2 && accounting.rows.every((row) => row.applied === true)
        ? "READY"
        : "NOT_APPLIED";
      const codexLocal = await client.query(
        "SELECT finished_at IS NOT NULL AS applied FROM _prisma_migrations WHERE migration_name = '20260928150000_codex_local_math_attempt' ORDER BY started_at DESC LIMIT 1",
      );
      output.codexLocalMigration = codexLocal.rows[0]?.applied === true ? "READY" : "NOT_APPLIED";
      const reviewDesk = await client.query(
        "SELECT finished_at IS NOT NULL AS applied FROM _prisma_migrations WHERE migration_name = '20260928160000_math_review_desk' ORDER BY started_at DESC LIMIT 1",
      );
      output.reviewDeskMigration = reviewDesk.rows[0]?.applied === true ? "READY" : "NOT_APPLIED";
      const agentReview = await client.query(
        "SELECT finished_at IS NOT NULL AS applied FROM _prisma_migrations WHERE migration_name = '20260928170000_math_agent_review' ORDER BY started_at DESC LIMIT 1",
      );
      output.agentReviewMigration = agentReview.rows[0]?.applied === true ? "READY" : "NOT_APPLIED";
      const controlledCycle = await client.query(
        "SELECT migration_name, finished_at IS NOT NULL AS applied FROM _prisma_migrations WHERE migration_name IN ('20260928180000_math_research_cycle', '20260928181000_math_research_cycle_guard', '20260928182000_math_research_cycle_terminal_guard')",
      );
      output.controlledCycleMigration = controlledCycle.rows.length === 3 && controlledCycle.rows.every((row) => row.applied === true)
        ? "READY" : "NOT_APPLIED";
      const frontierGate = await client.query(
        "SELECT finished_at IS NOT NULL AS applied FROM _prisma_migrations WHERE migration_name = '20260928183000_math_frontier_gate' ORDER BY started_at DESC LIMIT 1",
      );
      output.frontierGateMigration = frontierGate.rows[0]?.applied === true ? "READY" : "NOT_APPLIED";
      if (output.codexLocalMigration === "READY") {
        const retained = await client.query(
          "SELECT COUNT(*)::INTEGER AS count FROM research_run WHERE provider_name = 'codex-local' AND math_model_attempt_digest IS NOT NULL",
        );
        output.retainedLocalModelAttempts = retained.rows[0]?.count ?? 0;
      }
      if (output.agentReviewMigration === "READY") {
        const retained = await client.query("SELECT COUNT(*)::INTEGER AS count FROM math_pilot_agent_review");
        output.retainedAgentReviews = retained.rows[0]?.count ?? 0;
        output.localAutonomousReview = output.retainedAgentReviews > 0 ? "RETAINED_NOT_CERTIFIED" : "NOT_RUN";
      }
      const policies = await client.query(
        "SELECT relname, relrowsecurity, relforcerowsecurity FROM pg_class WHERE relname IN ('math_pilot_case', 'math_pilot_assessment', 'math_pilot_agent_review', 'math_research_cycle', 'math_research_cycle_event') ORDER BY relname",
      );
      output.rowLevelSecurity = policies.rows.length === 5 && policies.rows.every((row) => row.relrowsecurity && row.relforcerowsecurity)
        ? "READY"
        : "NOT_READY";
    } catch {
      output.database = "UNREACHABLE_OR_INSUFFICIENT_PRIVILEGE";
    } finally {
      await client.end().catch(() => undefined);
    }
  }
}

const docker = spawnSync("docker", ["info", "--format", "{{.ServerVersion}}"], {
  encoding: "utf8",
  timeout: 5_000,
});
output.docker = docker.status === 0 ? "AVAILABLE" : "UNAVAILABLE";

if (output.database === "READY" && output.codexLocalMode === "EXPLICITLY_ENABLED") {
  const login = spawnSync("codex", ["login", "status"], { encoding: "utf8", timeout: 5_000 });
  output.codexSubscriptionLogin = login.status === 0 &&
    /Logged in using ChatGPT/i.test(`${login.stdout ?? ""}\n${login.stderr ?? ""}`)
    ? "READY"
    : "NOT_READY";
}

// A queued job or a configured key is not proof of an active, healthy worker.
// A retained AI review is evidence of local execution, not formal theorem
// certification or proof that a production worker is healthy right now.
if (output.database !== "READY" || output.migration !== "READY" || output.runtimeAccountingMigration !== "READY" || output.codexLocalMigration !== "READY" || output.reviewDeskMigration !== "READY" || output.agentReviewMigration !== "READY" || output.controlledCycleMigration !== "READY" || output.frontierGateMigration !== "READY" || output.rowLevelSecurity !== "READY") {
  process.exitCode = 1;
}
process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
