import { randomUUID } from "node:crypto";

import { getEnv } from "../../src/server/env";
import { parseDockerRuntimeRegistry } from "../../src/modules/research-sandbox/adapters/runtime-registry";
import {
  runResearchSandboxWorkerCycle,
} from "../../src/server/workers/research-sandbox-cycle";

async function main() {
  const env = getEnv();
  if (env.RUNTIME_COMPONENT !== "research-worker") {
    throw new Error("RUNTIME_COMPONENT must be research-worker");
  }
  if (!env.RESEARCH_WORKER_ENABLED) {
    throw new Error("RESEARCH_WORKER_ENABLED must be true");
  }

  let stopping = false;
  process.on("SIGINT", () => {
    stopping = true;
  });
  process.on("SIGTERM", () => {
    stopping = true;
  });

  const config = {
    organizationId: env.RESEARCH_WORKER_ORGANIZATION_ID!,
    actorUserId: env.RESEARCH_WORKER_ACTOR_USER_ID!,
    workerId: env.RESEARCH_WORKER_ID,
    openai: env.RESEARCH_OPENAI_ENABLED
      ? { apiKey: env.OPENAI_API_KEY!, projectId: env.OPENAI_PROJECT }
      : undefined,
    dockerRuntimes: env.SANDBOX_DOCKER_ENABLED
      ? parseDockerRuntimeRegistry(env.SANDBOX_RUNTIME_REGISTRY_JSON!)
      : undefined,
    claimFirst: env.RESEARCH_WORKER_CLAIM_FIRST,
  };

  process.stdout.write(`${JSON.stringify({
    event: "research_sandbox_worker_started",
    workerId: config.workerId,
    organizationId: config.organizationId,
    researchAdapterEnabled: Boolean(config.openai),
    sandboxAdapterEnabled: Boolean(config.dockerRuntimes?.length),
    claimFirst: config.claimFirst,
    pollMs: env.RESEARCH_WORKER_POLL_MS,
  })}\n`);

  if (process.argv.includes("--validate-startup-contract=TIP-024D")) {
    return;
  }

  while (!stopping) {
    const result = await runResearchSandboxWorkerCycle({
      ...config,
      correlationId: randomUUID(),
    });
    process.stdout.write(
      `${JSON.stringify({ event: "research_sandbox_worker_cycle", ...result })}\n`,
    );
    if (!stopping) {
      await new Promise((resolve) =>
        setTimeout(resolve, env.RESEARCH_WORKER_POLL_MS),
      );
    }
  }

  process.stdout.write(`${JSON.stringify({
    event: "research_sandbox_worker_stopped",
    workerId: config.workerId,
  })}\n`);
}

void main().catch((error: unknown) => {
  process.stderr.write(
    `${JSON.stringify({
      event: "research_sandbox_worker_fatal",
      errorType: error instanceof Error ? error.name : "UnknownError",
    })}\n`,
  );
  process.exitCode = 1;
});
