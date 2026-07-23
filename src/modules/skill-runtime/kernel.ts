import { randomUUID } from "node:crypto";

import {
  Prisma,
  type AssuranceProfile,
  type SkillStatus,
} from "@prisma/client";

import {
  AuditEventType,
  type WorkspaceContext,
  writeAuditEvent,
} from "@/modules/identity-workspace";
import { getDb } from "@/server/db";

import {
  hashSkillContract,
  isSkillCompatible,
  type SkillContractInput,
  type SkillIdentityInput,
  validateSkillContract,
  validateSkillIdentity,
} from "./contracts";
import { requireSkillCapability } from "./context";
import { SkillRegistryError, SkillRegistryErrorCode } from "./errors";

async function loadSkill(ctx: WorkspaceContext, skillId: string) {
  const skill = await getDb().skill.findFirst({
    where: { id: skillId, workspaceId: ctx.workspace.id },
    include: { activeVersion: true },
  });
  if (!skill) {
    throw new SkillRegistryError(
      SkillRegistryErrorCode.NotFound,
      "Skill not found",
    );
  }
  return skill;
}

function mapConflict(error: unknown): never {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    throw new SkillRegistryError(
      SkillRegistryErrorCode.Conflict,
      "Skill key, semantic version or contract digest already exists",
    );
  }
  throw error;
}

export async function registerSkill(
  ctx: WorkspaceContext,
  identityInput: SkillIdentityInput,
  contractInput: SkillContractInput,
) {
  requireSkillCapability(ctx, "skills.manage");
  const identity = validateSkillIdentity(identityInput);
  const contract = validateSkillContract(contractInput);
  const contentHash = hashSkillContract(identity.skillKey, contract);
  const skillId = randomUUID();
  const versionId = randomUUID();

  try {
    return await getDb().$transaction(async (tx) => {
      await tx.skill.create({
        data: {
          id: skillId,
          workspaceId: ctx.workspace.id,
          skillKey: identity.skillKey,
          displayName: identity.displayName,
          description: identity.description,
          activeVersionId: versionId,
          createdByMembershipId: ctx.membership.id,
        },
      });
      await tx.skillVersion.create({
        data: {
          id: versionId,
          workspaceId: ctx.workspace.id,
          skillId,
          ...contract,
          verifierBinding:
            contract.verifierBinding as unknown as Prisma.InputJsonObject,
          resourceEstimate:
            contract.resourceEstimate as unknown as Prisma.InputJsonObject,
          contentHash,
          createdByMembershipId: ctx.membership.id,
        },
      });
      await writeAuditEvent(tx, {
        workspaceId: ctx.workspace.id,
        actorUserId: ctx.user.id,
        actorMembershipId: ctx.membership.id,
        eventType: AuditEventType.SkillCreated,
        entityType: "Skill",
        entityId: skillId,
        correlationId: ctx.correlationId,
        payload: {
          skillKey: identity.skillKey,
          activeVersion: contract.semanticVersion,
        },
      });
      await writeAuditEvent(tx, {
        workspaceId: ctx.workspace.id,
        actorUserId: ctx.user.id,
        actorMembershipId: ctx.membership.id,
        eventType: AuditEventType.SkillVersionRegistered,
        entityType: "SkillVersion",
        entityId: versionId,
        correlationId: ctx.correlationId,
        payload: {
          skillKey: identity.skillKey,
          semanticVersion: contract.semanticVersion,
          digest: contentHash,
        },
      });
      return tx.skill.findUniqueOrThrow({
        where: { id: skillId },
        include: { activeVersion: true },
      });
    });
  } catch (error) {
    mapConflict(error);
  }
}

export async function registerSkillVersion(
  ctx: WorkspaceContext,
  skillId: string,
  contractInput: SkillContractInput,
) {
  requireSkillCapability(ctx, "skills.manage");
  const skill = await loadSkill(ctx, skillId);
  const contract = validateSkillContract(contractInput);
  const contentHash = hashSkillContract(skill.skillKey, contract);

  try {
    return await getDb().$transaction(async (tx) => {
      const version = await tx.skillVersion.create({
        data: {
          workspaceId: ctx.workspace.id,
          skillId: skill.id,
          ...contract,
          verifierBinding:
            contract.verifierBinding as unknown as Prisma.InputJsonObject,
          resourceEstimate:
            contract.resourceEstimate as unknown as Prisma.InputJsonObject,
          contentHash,
          createdByMembershipId: ctx.membership.id,
        },
      });
      await writeAuditEvent(tx, {
        workspaceId: ctx.workspace.id,
        actorUserId: ctx.user.id,
        actorMembershipId: ctx.membership.id,
        eventType: AuditEventType.SkillVersionRegistered,
        entityType: "SkillVersion",
        entityId: version.id,
        correlationId: ctx.correlationId,
        payload: {
          skillKey: skill.skillKey,
          semanticVersion: version.semanticVersion,
          digest: version.contentHash,
        },
      });
      return version;
    });
  } catch (error) {
    mapConflict(error);
  }
}

export async function activateSkillVersion(
  ctx: WorkspaceContext,
  skillId: string,
  skillVersionId: string,
  input: { expectedVersion: number; reason: string },
) {
  requireSkillCapability(ctx, "skills.manage");
  const skill = await loadSkill(ctx, skillId);
  if (!input.reason.trim()) {
    throw new SkillRegistryError(
      SkillRegistryErrorCode.Invariant,
      "Activation reason is required",
    );
  }

  return getDb().$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM "skill" WHERE id = ${skill.id} FOR UPDATE`;
    const locked = await tx.skill.findFirstOrThrow({
      where: { id: skill.id, workspaceId: ctx.workspace.id },
      include: { activeVersion: true },
    });
    if (locked.version !== input.expectedVersion) {
      throw new SkillRegistryError(
        SkillRegistryErrorCode.StaleVersion,
        "Skill changed after it was read",
      );
    }
    const target = await tx.skillVersion.findFirst({
      where: {
        id: skillVersionId,
        skillId: locked.id,
        workspaceId: ctx.workspace.id,
      },
    });
    if (!target) {
      throw new SkillRegistryError(
        SkillRegistryErrorCode.NotFound,
        "Skill version not found",
      );
    }
    if (target.id === locked.activeVersionId) {
      throw new SkillRegistryError(
        SkillRegistryErrorCode.Invariant,
        "Skill version is already active",
      );
    }

    const updated = await tx.skill.update({
      where: { id: locked.id },
      data: {
        activeVersionId: target.id,
        status: "ACTIVE",
        version: { increment: 1 },
      },
      include: { activeVersion: true },
    });
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.SkillVersionActivated,
      entityType: "Skill",
      entityId: locked.id,
      correlationId: ctx.correlationId,
      payload: {
        skillKey: locked.skillKey,
        fromVersion: locked.activeVersion.semanticVersion,
        toVersion: target.semanticVersion,
        reason: input.reason,
      },
    });
    return updated;
  });
}

export async function changeSkillStatus(
  ctx: WorkspaceContext,
  skillId: string,
  status: SkillStatus,
  input: { expectedVersion: number; reason: string },
) {
  requireSkillCapability(ctx, "skills.manage");
  const skill = await loadSkill(ctx, skillId);
  if (!input.reason.trim()) {
    throw new SkillRegistryError(
      SkillRegistryErrorCode.Invariant,
      "Status-change reason is required",
    );
  }

  return getDb().$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM "skill" WHERE id = ${skill.id} FOR UPDATE`;
    const locked = await tx.skill.findFirstOrThrow({
      where: { id: skill.id, workspaceId: ctx.workspace.id },
    });
    if (locked.version !== input.expectedVersion) {
      throw new SkillRegistryError(
        SkillRegistryErrorCode.StaleVersion,
        "Skill changed after it was read",
      );
    }
    if (locked.status === "ARCHIVED") {
      throw new SkillRegistryError(
        SkillRegistryErrorCode.Invariant,
        "Archived skills are terminal",
      );
    }
    if (locked.status === status) {
      throw new SkillRegistryError(
        SkillRegistryErrorCode.Invariant,
        `Skill is already ${status}`,
      );
    }
    const updated = await tx.skill.update({
      where: { id: locked.id },
      data: {
        status,
        version: { increment: 1 },
      },
      include: { activeVersion: true },
    });
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.SkillStatusChanged,
      entityType: "Skill",
      entityId: locked.id,
      correlationId: ctx.correlationId,
      payload: {
        skillKey: locked.skillKey,
        from: locked.status,
        to: status,
        reason: input.reason,
      },
    });
    return updated;
  });
}

export async function listSkills(ctx: WorkspaceContext) {
  requireSkillCapability(ctx, "skills.read");
  return getDb().skill.findMany({
    where: { workspaceId: ctx.workspace.id },
    orderBy: { skillKey: "asc" },
    include: {
      activeVersion: true,
      versions: {
        orderBy: { createdAt: "asc" },
        select: { id: true, semanticVersion: true },
      },
      _count: { select: { versions: true } },
    },
  });
}

export async function getSkillRegistryEntry(
  ctx: WorkspaceContext,
  skillId: string,
) {
  requireSkillCapability(ctx, "skills.read");
  await loadSkill(ctx, skillId);
  return getDb().skill.findFirstOrThrow({
    where: { id: skillId, workspaceId: ctx.workspace.id },
    include: {
      activeVersion: true,
      versions: { orderBy: { createdAt: "asc" } },
    },
  });
}

export async function discoverCompatibleSkills(
  ctx: WorkspaceContext,
  input: {
    requiredCapabilities: string[];
    assuranceProfile: AssuranceProfile;
  },
) {
  requireSkillCapability(ctx, "skills.read");
  const required = [...new Set(input.requiredCapabilities)].sort();
  if (
    required.length !== input.requiredCapabilities.length ||
    required.some((capability) => !/^[a-z][a-z0-9_]*$/.test(capability))
  ) {
    throw new SkillRegistryError(
      SkillRegistryErrorCode.InvalidContract,
      "Required capabilities are invalid or duplicated",
    );
  }
  const skills = await getDb().skill.findMany({
    where: { workspaceId: ctx.workspace.id, status: "ACTIVE" },
    orderBy: { skillKey: "asc" },
    include: { activeVersion: true },
  });
  return skills.filter((skill) =>
    isSkillCompatible(
      {
        capabilities: skill.activeVersion.capabilities,
        assuranceCompatibility:
          skill.activeVersion.assuranceCompatibility,
      },
      required,
      input.assuranceProfile,
    ),
  );
}
