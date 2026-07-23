"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import type { AssuranceProfile, SkillStatus } from "@prisma/client";

import { resolveWorkspaceContext } from "@/modules/identity-workspace";
import {
  activateSkillVersion,
  changeSkillStatus,
  registerSkill,
  registerSkillVersion,
  SkillRegistryError,
  SkillRegistryErrorCode,
  type SkillContractInput,
} from "@/modules/skill-runtime";

export interface SkillActionResult {
  ok: boolean;
  error?: string;
}

const ASSURANCE: readonly AssuranceProfile[] = [
  "QUICK",
  "PROFESSIONAL",
  "RESEARCH",
  "REGULATED",
];
const STATUSES: readonly SkillStatus[] = ["ACTIVE", "DEPRECATED", "ARCHIVED"];

function text(data: FormData, key: string) {
  return String(data.get(key) ?? "").trim();
}

function tokens(data: FormData, key: string) {
  return text(data, key)
    .split(/[\s,]+/)
    .map((value) => value.trim())
    .filter(Boolean);
}

function objectSchema(data: FormData, key: string): unknown {
  try {
    return JSON.parse(text(data, key));
  } catch {
    throw new SkillRegistryError(
      SkillRegistryErrorCode.InvalidContract,
      `${key} must be valid JSON`,
    );
  }
}

function positiveInteger(data: FormData, key: string) {
  return Number.parseInt(text(data, key), 10);
}

function invalidContract(message: string): never {
  throw new SkillRegistryError(
    SkillRegistryErrorCode.InvalidContract,
    message,
  );
}

function contract(data: FormData): SkillContractInput {
  const assuranceInput = data.getAll("assuranceCompatibility").map(String);
  if (
    assuranceInput.some(
      (value) => !ASSURANCE.includes(value as AssuranceProfile),
    )
  ) {
    invalidContract("assuranceCompatibility contains an invalid profile");
  }
  const assuranceCompatibility = assuranceInput as AssuranceProfile[];
  const verifierKindInput = text(data, "verifierKind");
  if (
    !["DETERMINISTIC", "HUMAN", "EXTERNAL"].includes(verifierKindInput)
  ) {
    invalidContract("verifierKind is invalid");
  }
  const verifierKind = verifierKindInput as
    | "DETERMINISTIC"
    | "HUMAN"
    | "EXTERNAL";

  return {
    semanticVersion: text(data, "semanticVersion"),
    capabilities: tokens(data, "capabilities"),
    inputSchema: objectSchema(data, "inputSchema"),
    outputSchema: objectSchema(data, "outputSchema"),
    requiredEvidence: tokens(data, "requiredEvidence"),
    failureStates: tokens(data, "failureStates"),
    verifierBinding: {
      kind: verifierKind,
      verifierKey: text(data, "verifierKey"),
    },
    resourceEstimate: {
      maxDurationSeconds: positiveInteger(data, "maxDurationSeconds"),
      maxMemoryMb: positiveInteger(data, "maxMemoryMb"),
    },
    assuranceCompatibility,
  };
}

function message(error: unknown) {
  if (error instanceof SkillRegistryError) {
    return `${error.code}: ${error.message}`;
  }
  if (error instanceof Error && "code" in error) return error.message;
  throw error;
}

async function run(
  slug: string,
  operation: (
    ctx: Awaited<ReturnType<typeof resolveWorkspaceContext>>,
  ) => Promise<unknown>,
): Promise<SkillActionResult> {
  try {
    const ctx = await resolveWorkspaceContext(await headers(), slug);
    await operation(ctx);
    revalidatePath(`/w/${slug}/skills`);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: message(error) };
  }
}

export async function registerSkillAction(
  slug: string,
  data: FormData,
): Promise<SkillActionResult> {
  return run(slug, (ctx) =>
    registerSkill(
      ctx,
      {
        skillKey: text(data, "skillKey"),
        displayName: text(data, "displayName"),
        description: text(data, "description"),
      },
      contract(data),
    ),
  );
}

export async function registerSkillVersionAction(
  slug: string,
  skillId: string,
  data: FormData,
): Promise<SkillActionResult> {
  return run(slug, (ctx) => registerSkillVersion(ctx, skillId, contract(data)));
}

export async function activateSkillVersionAction(
  slug: string,
  skillId: string,
  data: FormData,
): Promise<SkillActionResult> {
  return run(slug, (ctx) =>
    activateSkillVersion(ctx, skillId, text(data, "skillVersionId"), {
      expectedVersion: positiveInteger(data, "expectedVersion"),
      reason: text(data, "reason"),
    }),
  );
}

export async function changeSkillStatusAction(
  slug: string,
  skillId: string,
  data: FormData,
): Promise<SkillActionResult> {
  const statusInput = text(data, "status") as SkillStatus;
  if (!STATUSES.includes(statusInput)) {
    return {
      ok: false,
      error: `${SkillRegistryErrorCode.Invariant}: Skill status is invalid`,
    };
  }
  return run(slug, (ctx) =>
    changeSkillStatus(ctx, skillId, statusInput, {
      expectedVersion: positiveInteger(data, "expectedVersion"),
      reason: text(data, "reason"),
    }),
  );
}
