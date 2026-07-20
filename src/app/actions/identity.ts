"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import type { Role } from "@prisma/client";

import {
  acceptInvitation,
  changeMemberRole,
  createInvitation,
  ForbiddenError,
  InvariantError,
  NotFoundError,
  provisionWorkspace,
  requireAuthenticatedUser,
  resolveWorkspaceContext,
  revokeInvitation,
  suspendMember,
  UnauthenticatedError,
  updateWorkspaceName,
} from "@/modules/identity-workspace";

export interface ActionResult {
  ok: boolean;
  error?: string;
  /** Set only by the invite action, once, for display to the inviter. */
  token?: string;
}

function toMessage(error: unknown): string {
  if (
    error instanceof ForbiddenError ||
    error instanceof InvariantError ||
    error instanceof NotFoundError ||
    error instanceof UnauthenticatedError
  ) {
    return error.message;
  }
  throw error;
}

const VALID_ROLES: readonly Role[] = ["OWNER", "ADMIN", "MEMBER", "VIEWER"];

export async function createWorkspaceAction(formData: FormData): Promise<void> {
  const user = await requireAuthenticatedUser(await headers());
  const name = String(formData.get("name") ?? "");
  const workspace = await provisionWorkspace(user, name);
  redirect(`/w/${workspace.slug}`);
}

export async function acceptInvitationAction(
  token: string,
): Promise<ActionResult & { slug?: string }> {
  try {
    const user = await requireAuthenticatedUser(await headers());
    const result = await acceptInvitation(user, token);
    return { ok: true, slug: result.workspaceSlug };
  } catch (error) {
    return { ok: false, error: toMessage(error) };
  }
}

export async function updateWorkspaceNameAction(
  slug: string,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const ctx = await resolveWorkspaceContext(await headers(), slug);
    await updateWorkspaceName(ctx, String(formData.get("name") ?? ""));
    return { ok: true };
  } catch (error) {
    return { ok: false, error: toMessage(error) };
  }
}

export async function inviteMemberAction(
  slug: string,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const ctx = await resolveWorkspaceContext(await headers(), slug);
    const roleInput = String(formData.get("role") ?? "MEMBER") as Role;
    const role = VALID_ROLES.includes(roleInput) ? roleInput : "MEMBER";
    const invitation = await createInvitation(ctx, {
      email: String(formData.get("email") ?? ""),
      role,
    });
    return { ok: true, token: invitation.rawToken };
  } catch (error) {
    return { ok: false, error: toMessage(error) };
  }
}

export async function revokeInvitationAction(
  slug: string,
  invitationId: string,
): Promise<ActionResult> {
  try {
    const ctx = await resolveWorkspaceContext(await headers(), slug);
    await revokeInvitation(ctx, invitationId);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: toMessage(error) };
  }
}

export async function changeRoleAction(
  slug: string,
  membershipId: string,
  role: Role,
): Promise<ActionResult> {
  try {
    const ctx = await resolveWorkspaceContext(await headers(), slug);
    const next = VALID_ROLES.includes(role) ? role : "MEMBER";
    await changeMemberRole(ctx, membershipId, next);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: toMessage(error) };
  }
}

export async function suspendMemberAction(
  slug: string,
  membershipId: string,
): Promise<ActionResult> {
  try {
    const ctx = await resolveWorkspaceContext(await headers(), slug);
    await suspendMember(ctx, membershipId);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: toMessage(error) };
  }
}
