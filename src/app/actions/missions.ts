"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import type { AssuranceProfile, GateResult } from "@prisma/client";

import { resolveWorkspaceContext } from "@/modules/identity-workspace";
import {
  addObligation,
  addRequirement,
  approveContract,
  createMission,
  evaluateGate,
  MissionError,
  requestCancellation,
  resolveDecision,
  submitContract,
  transitionMission,
  updateObligationStatus,
} from "@/modules/mission-kernel";

export interface ActionResult {
  ok: boolean;
  error?: string;
  errorCode?: string;
}

function toFailure(error: unknown): ActionResult {
  if (error instanceof MissionError) {
    return { ok: false, errorCode: error.code, error: error.message };
  }
  // Identity errors carry a message too.
  if (error instanceof Error && "code" in error) {
    return {
      ok: false,
      errorCode: String(error.code),
      error: error.message,
    };
  }
  throw error;
}

const PROFILES: readonly AssuranceProfile[] = [
  "QUICK",
  "PROFESSIONAL",
  "RESEARCH",
  "REGULATED",
];

/** Create a mission with a minimal complete draft contract, ready to submit. */
export async function createMissionAction(formData: FormData): Promise<void> {
  const slug = String(formData.get("slug") ?? "");
  const ctx = await resolveWorkspaceContext(await headers(), slug);

  const profileInput = String(
    formData.get("assuranceProfile") ?? "PROFESSIONAL",
  ) as AssuranceProfile;
  const profile = PROFILES.includes(profileInput)
    ? profileInput
    : "PROFESSIONAL";
  const weight = Number.parseInt(
    String(formData.get("obligationWeight") ?? "1"),
    10,
  );

  const mission = await createMission(ctx, {
    title: String(formData.get("title") ?? "").trim() || "Untitled mission",
    assuranceProfile: profile,
    objective: String(formData.get("objective") ?? ""),
    scope: String(formData.get("scope") ?? ""),
    successDefinition: String(formData.get("successDefinition") ?? ""),
  });
  const contractId = mission.currentContractId!;

  await addRequirement(ctx, contractId, {
    code: "REQ-001",
    title:
      String(formData.get("requirementTitle") ?? "").trim() ||
      "Primary requirement",
    description: String(
      formData.get("requirementTitle") ?? "Primary requirement",
    ),
    acceptanceCriteria:
      String(formData.get("requirementCriteria") ?? "").trim() ||
      "Defined by reviewer",
  });
  await addObligation(ctx, contractId, {
    code: "OBL-001",
    title:
      String(formData.get("obligationTitle") ?? "").trim() ||
      "Primary obligation",
    description: String(
      formData.get("obligationTitle") ?? "Primary obligation",
    ),
    weight: Number.isInteger(weight) && weight > 0 ? weight : 1,
    closureRule: "Manual closure by an authorized member",
  });

  // Advance the mission to SCOPED so it is ready for contract review.
  await transitionMission(ctx, mission.id, "INTAKE", {
    reason: "intake opened",
  });
  await transitionMission(ctx, mission.id, "SCOPED", {
    reason: "scoping complete",
  });

  redirect(`/w/${slug}/missions/${mission.id}`);
}

export async function submitContractAction(
  slug: string,
  missionId: string,
): Promise<ActionResult> {
  try {
    const ctx = await resolveWorkspaceContext(await headers(), slug);
    await submitContract(ctx, missionId);
    return { ok: true };
  } catch (error) {
    return toFailure(error);
  }
}

export async function approveContractAction(
  slug: string,
  missionId: string,
): Promise<ActionResult> {
  try {
    const ctx = await resolveWorkspaceContext(await headers(), slug);
    await approveContract(ctx, missionId);
    return { ok: true };
  } catch (error) {
    return toFailure(error);
  }
}

export async function updateObligationAction(
  slug: string,
  obligationId: string,
  next: "IN_PROGRESS" | "SATISFIED" | "BLOCKED" | "OPEN",
): Promise<ActionResult> {
  try {
    const ctx = await resolveWorkspaceContext(await headers(), slug);
    await updateObligationStatus(
      ctx,
      obligationId,
      next,
      `marked ${next.toLowerCase()}`,
    );
    return { ok: true };
  } catch (error) {
    return toFailure(error);
  }
}

export async function evaluateGateAction(
  slug: string,
  gateId: string,
  result: GateResult,
): Promise<ActionResult> {
  try {
    const ctx = await resolveWorkspaceContext(await headers(), slug);
    await evaluateGate(
      ctx,
      gateId,
      result,
      `evaluated ${result.toLowerCase()}`,
    );
    return { ok: true };
  } catch (error) {
    return toFailure(error);
  }
}

export async function requestCancellationAction(
  slug: string,
  missionId: string,
  reason: string,
): Promise<ActionResult> {
  try {
    const ctx = await resolveWorkspaceContext(await headers(), slug);
    await requestCancellation(
      ctx,
      missionId,
      reason || "requested cancellation",
    );
    return { ok: true };
  } catch (error) {
    return toFailure(error);
  }
}

export async function resolveDecisionAction(
  slug: string,
  decisionId: string,
  approve: boolean,
): Promise<ActionResult> {
  try {
    const ctx = await resolveWorkspaceContext(await headers(), slug);
    await resolveDecision(
      ctx,
      decisionId,
      approve,
      approve ? "approved" : "rejected",
    );
    return { ok: true };
  } catch (error) {
    return toFailure(error);
  }
}

export async function blockMissionAction(
  slug: string,
  missionId: string,
  reason: string,
): Promise<ActionResult> {
  try {
    const ctx = await resolveWorkspaceContext(await headers(), slug);
    await transitionMission(ctx, missionId, "BLOCKED", {
      reason: reason || "blocked",
    });
    return { ok: true };
  } catch (error) {
    return toFailure(error);
  }
}
