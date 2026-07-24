import type {
  AssuranceProfile,
  Prisma,
  ProviderPolicyMode,
  PublicReleasePolicy,
  WorkspaceStorageMode,
} from "@prisma/client";
import { z } from "zod";

import { getDb } from "@/server/db";

import { AuditEventType, type DbClient, writeAuditEvent } from "./audit";
import type { WorkspaceContext } from "./context";
import { InvariantError } from "./errors";
import { requireCapability } from "./workspace";

const providerSchema = z
  .object({
    providerName: z.string().trim().min(1).max(120),
    modelNames: z.array(z.string().trim().min(1).max(160)).min(1).max(100),
  })
  .strict();

const policySchema = z
  .object({
    defaultAssuranceProfile: z.enum([
      "QUICK",
      "PROFESSIONAL",
      "RESEARCH",
      "REGULATED",
    ]),
    providerPolicyMode: z.enum(["OPEN_MANUAL", "ALLOWLIST_MANUAL"]),
    allowedProviders: z.array(providerSchema).max(100),
    artifactRetentionDays: z.number().int().min(30).max(36_500),
    evidenceRetentionDays: z.number().int().min(30).max(36_500),
    auditRetentionDays: z.number().int().min(365).max(36_500),
    publicReleasePolicy: z.enum(["INTERNAL_ONLY", "GOVERNED_PUBLIC"]),
  })
  .strict();

export interface AllowedProvider {
  providerName: string;
  modelNames: string[];
}

export interface WorkspacePolicyInput {
  defaultAssuranceProfile: AssuranceProfile;
  providerPolicyMode: ProviderPolicyMode;
  allowedProviders: AllowedProvider[];
  artifactRetentionDays: number;
  evidenceRetentionDays: number;
  auditRetentionDays: number;
  publicReleasePolicy: PublicReleasePolicy;
}

export interface WorkspacePolicyView extends WorkspacePolicyInput {
  workspaceId: string;
  storageMode: WorkspaceStorageMode;
  version: number;
  updatedAt: Date | null;
}

export const DEFAULT_WORKSPACE_POLICY: WorkspacePolicyView = {
  workspaceId: "",
  defaultAssuranceProfile: "PROFESSIONAL",
  providerPolicyMode: "OPEN_MANUAL",
  allowedProviders: [],
  storageMode: "DATABASE",
  artifactRetentionDays: 2_555,
  evidenceRetentionDays: 2_555,
  auditRetentionDays: 2_555,
  publicReleasePolicy: "GOVERNED_PUBLIC",
  version: 0,
  updatedAt: null,
};

function validatePolicy(input: WorkspacePolicyInput): WorkspacePolicyInput {
  const result = policySchema.safeParse(input);
  if (!result.success) {
    throw new InvariantError(
      `Workspace policy is invalid: ${result.error.issues
        .map((issue) => issue.path.join(".") || "(root)")
        .join(", ")}`,
      "WORKSPACE_POLICY_INVALID",
    );
  }

  const providers = result.data.allowedProviders.map((provider) => ({
    providerName: provider.providerName.trim(),
    modelNames: [...new Set(provider.modelNames.map((model) => model.trim()))],
  }));
  const providerKeys = providers.map((provider) =>
    provider.providerName.toLowerCase(),
  );
  if (new Set(providerKeys).size !== providerKeys.length) {
    throw new InvariantError(
      "Provider names must be unique",
      "WORKSPACE_POLICY_INVALID",
    );
  }
  if (
    result.data.providerPolicyMode === "ALLOWLIST_MANUAL" &&
    providers.length === 0
  ) {
    throw new InvariantError(
      "Allowlist mode requires at least one provider and model",
      "WORKSPACE_POLICY_INVALID",
    );
  }
  return { ...result.data, allowedProviders: providers };
}

function providersFromJson(value: Prisma.JsonValue): AllowedProvider[] {
  const result = z.array(providerSchema).safeParse(value);
  if (!result.success) {
    throw new InvariantError(
      "Stored workspace provider policy is invalid",
      "WORKSPACE_POLICY_INVALID",
    );
  }
  return result.data;
}

export async function getWorkspacePolicy(
  ctx: WorkspaceContext,
): Promise<WorkspacePolicyView> {
  requireCapability(ctx, "workspace.read");
  const policy = await getDb().workspacePolicy.findUnique({
    where: { workspaceId: ctx.workspace.id },
  });
  if (!policy) {
    return { ...DEFAULT_WORKSPACE_POLICY, workspaceId: ctx.workspace.id };
  }
  return {
    workspaceId: policy.workspaceId,
    defaultAssuranceProfile: policy.defaultAssuranceProfile,
    providerPolicyMode: policy.providerPolicyMode,
    allowedProviders: providersFromJson(policy.allowedProviders),
    storageMode: policy.storageMode,
    artifactRetentionDays: policy.artifactRetentionDays,
    evidenceRetentionDays: policy.evidenceRetentionDays,
    auditRetentionDays: policy.auditRetentionDays,
    publicReleasePolicy: policy.publicReleasePolicy,
    version: policy.version,
    updatedAt: policy.updatedAt,
  };
}

export async function updateWorkspacePolicy(
  ctx: WorkspaceContext,
  input: WorkspacePolicyInput,
): Promise<WorkspacePolicyView> {
  requireCapability(ctx, "workspace.update");
  const value = validatePolicy(input);

  return getDb().$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM "workspace" WHERE id = ${ctx.workspace.id} FOR UPDATE`;
    const policy = await tx.workspacePolicy.upsert({
      where: { workspaceId: ctx.workspace.id },
      create: {
        workspaceId: ctx.workspace.id,
        ...value,
        allowedProviders:
          value.allowedProviders as unknown as Prisma.InputJsonArray,
        updatedByMembershipId: ctx.membership.id,
      },
      update: {
        ...value,
        allowedProviders:
          value.allowedProviders as unknown as Prisma.InputJsonArray,
        updatedByMembershipId: ctx.membership.id,
        version: { increment: 1 },
      },
    });
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.WorkspacePolicyUpdated,
      entityType: "WorkspacePolicy",
      entityId: ctx.workspace.id,
      correlationId: ctx.correlationId,
      payload: {
        defaultAssuranceProfile: policy.defaultAssuranceProfile,
        providerPolicyMode: policy.providerPolicyMode,
        allowedProviderCount: value.allowedProviders.length,
        artifactRetentionDays: policy.artifactRetentionDays,
        evidenceRetentionDays: policy.evidenceRetentionDays,
        auditRetentionDays: policy.auditRetentionDays,
        publicReleasePolicy: policy.publicReleasePolicy,
      },
    });
    return {
      workspaceId: policy.workspaceId,
      defaultAssuranceProfile: policy.defaultAssuranceProfile,
      providerPolicyMode: policy.providerPolicyMode,
      allowedProviders: value.allowedProviders,
      storageMode: policy.storageMode,
      artifactRetentionDays: policy.artifactRetentionDays,
      evidenceRetentionDays: policy.evidenceRetentionDays,
      auditRetentionDays: policy.auditRetentionDays,
      publicReleasePolicy: policy.publicReleasePolicy,
      version: policy.version,
      updatedAt: policy.updatedAt,
    };
  });
}

export async function enforceManualProviderPolicy(
  db: DbClient,
  workspaceId: string,
  providerName: string,
  modelName: string,
): Promise<void> {
  const policy = await db.workspacePolicy.findUnique({
    where: { workspaceId },
    select: { providerPolicyMode: true, allowedProviders: true },
  });
  if (!policy || policy.providerPolicyMode === "OPEN_MANUAL") return;

  const providers = providersFromJson(policy.allowedProviders);
  const provider = providers.find(
    (item) =>
      item.providerName.toLowerCase() === providerName.trim().toLowerCase(),
  );
  const allowed = provider?.modelNames.some(
    (model) => model.toLowerCase() === modelName.trim().toLowerCase(),
  );
  if (!allowed) {
    throw new InvariantError(
      "Provider and model are not permitted by workspace policy",
      "PROVIDER_POLICY_BLOCKED",
    );
  }
}
