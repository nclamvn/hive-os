"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  AuthoringError,
  createAuthoringDocument,
  saveAuthoringRevision,
  type AuthoringContent,
  type AuthoringDocumentType,
} from "@/modules/authoring";
import { resolveWorkspaceContext } from "@/modules/identity-workspace";

export interface AuthoringActionResult {
  ok: boolean;
  error?: string;
  errorCode?: string;
  revisionNumber?: number;
}
function failure(error: unknown): AuthoringActionResult {
  if (error instanceof AuthoringError) {
    return { ok: false, error: error.message, errorCode: error.code };
  }
  if (error instanceof Error && "code" in error) {
    return { ok: false, error: error.message, errorCode: String(error.code) };
  }
  throw error;
}

export async function createAuthoringDocumentAction(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const ctx = await resolveWorkspaceContext(await headers(), slug);
  const document = await createAuthoringDocument(ctx, {
    missionId: String(formData.get("missionId") ?? ""),
    title: String(formData.get("title") ?? ""),
    documentType: String(formData.get("documentType") ?? "OTHER") as AuthoringDocumentType,
    locale: String(formData.get("locale") ?? "vi"),
  });
  redirect(`/w/${slug}/authoring/${document.id}`);
}

export async function saveAuthoringRevisionAction(
  slug: string,
  input: AuthoringContent & {
    documentId: string;
    expectedRevisionNumber: number;
    changeSummary: string;
  },
): Promise<AuthoringActionResult> {
  try {
    const ctx = await resolveWorkspaceContext(await headers(), slug);
    const result = await saveAuthoringRevision(ctx, input);
    return { ok: true, revisionNumber: result.revisionNumber };
  } catch (error) {
    return failure(error);
  }
}
