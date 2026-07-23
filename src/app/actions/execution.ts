"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import type { ExecutionRole } from "@prisma/client";

import {
  createExecutionTip,
  ExecutionError,
  ExecutionErrorCode,
  importCompletionReport,
  issueManualRun,
  resolveExecutionDeviation,
  retryManualRun,
  type CompletionReportInput,
} from "@/modules/execution-fabric";
import { resolveWorkspaceContext } from "@/modules/identity-workspace";
import { MissionError, transitionMission } from "@/modules/mission-kernel";

export interface ExecutionActionResult {
  ok: boolean;
  error?: string;
}

const ROLES: readonly ExecutionRole[] = ["CONTRACTOR", "BUILDER", "VERIFIER"];

function text(data: FormData, key: string) {
  return String(data.get(key) ?? "").trim();
}

function message(error: unknown): string {
  if (error instanceof ExecutionError || error instanceof MissionError) {
    return `${error.code}: ${error.message}`;
  }
  if (error instanceof Error && "code" in error) return error.message;
  throw error;
}

function parseReport(data: FormData): CompletionReportInput {
  try {
    return JSON.parse(text(data, "report")) as CompletionReportInput;
  } catch {
    throw new ExecutionError(
      ExecutionErrorCode.InvalidReport,
      "Completion Report must be valid JSON",
    );
  }
}

function manualRun(data: FormData) {
  const roleInput = text(data, "executionRole") as ExecutionRole;
  if (!ROLES.includes(roleInput)) {
    throw new ExecutionError(
      ExecutionErrorCode.InvalidInput,
      "Execution role is invalid",
    );
  }
  return {
    executionRole: roleInput,
    providerName: text(data, "providerName"),
    modelName: text(data, "modelName"),
    instruction: String(data.get("instruction") ?? ""),
  };
}

async function run(
  slug: string,
  operation: (
    ctx: Awaited<ReturnType<typeof resolveWorkspaceContext>>,
  ) => Promise<unknown>,
): Promise<ExecutionActionResult> {
  try {
    const ctx = await resolveWorkspaceContext(await headers(), slug);
    await operation(ctx);
    revalidatePath(`/w/${slug}/execution`);
    revalidatePath(`/w/${slug}/missions`);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: message(error) };
  }
}

export async function openExplorationAction(
  slug: string,
  data: FormData,
): Promise<ExecutionActionResult> {
  return run(slug, (ctx) =>
    transitionMission(ctx, text(data, "missionId"), "EXPLORING", {
      reason: text(data, "reason"),
    }),
  );
}

export async function enterBuildingAction(
  slug: string,
  data: FormData,
): Promise<ExecutionActionResult> {
  return run(slug, (ctx) =>
    transitionMission(ctx, text(data, "missionId"), "BUILDING", {
      reason: text(data, "reason"),
    }),
  );
}

export async function createExecutionTipAction(
  slug: string,
  data: FormData,
): Promise<ExecutionActionResult> {
  const predecessorId = text(data, "predecessorTipId");
  return run(slug, (ctx) =>
    createExecutionTip(ctx, text(data, "missionId"), {
      code: text(data, "code"),
      title: text(data, "title"),
      description: text(data, "description"),
      skillVersionId: text(data, "skillVersionId"),
      predecessorTipIds: predecessorId ? [predecessorId] : [],
    }),
  );
}

export async function issueManualRunAction(
  slug: string,
  data: FormData,
): Promise<ExecutionActionResult> {
  return run(slug, (ctx) =>
    issueManualRun(ctx, text(data, "tipId"), manualRun(data)),
  );
}

export async function retryManualRunAction(
  slug: string,
  data: FormData,
): Promise<ExecutionActionResult> {
  return run(slug, (ctx) =>
    retryManualRun(ctx, text(data, "previousRunId"), manualRun(data)),
  );
}

export async function importCompletionReportAction(
  slug: string,
  data: FormData,
): Promise<ExecutionActionResult> {
  return run(slug, (ctx) =>
    importCompletionReport(ctx, text(data, "runId"), parseReport(data)),
  );
}

export async function resolveExecutionDeviationAction(
  slug: string,
  data: FormData,
): Promise<ExecutionActionResult> {
  return run(slug, (ctx) =>
    resolveExecutionDeviation(ctx, text(data, "deviationId"), {
      resolution: text(data, "resolution"),
      expectedVersion: Number.parseInt(text(data, "expectedVersion"), 10),
    }),
  );
}
