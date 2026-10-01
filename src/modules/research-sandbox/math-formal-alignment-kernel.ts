import type { Prisma } from "@prisma/client";

import { requireWorkspaceAuthorization, organizationIdForWorkspace } from "@/modules/authorization";
import { AuditEventType, type WorkspaceContext, writeAuditEvent } from "@/modules/identity-workspace";
import { withOrganizationTenant } from "@/server/tenant-context";

import { ResearchSandboxError } from "./errors";
import { researchDossierDigest } from "./integrity";
import { deriveFormalAlignmentReport, digestFormalAlignmentRecord,
  formalAlignmentInputSchema, FORMAL_ALIGNMENT_CHECKS } from "./math-formal-alignment";
import { validateRecordedMathFormalAttempt } from "./math-formal-record";
import { validateRecordedMathFormalReplay } from "./math-formal-replay-record";

/** A deliberately human, local semantic gate; it never changes theorem status. */
export async function attestMathPilotFormalAlignment(ctx: WorkspaceContext, raw: unknown) {
  await requireWorkspaceAuthorization(ctx, "research.review");
  const parsed = formalAlignmentInputSchema.safeParse(raw);
  if (!parsed.success) throw new ResearchSandboxError("INVALID_INPUT", "Formal alignment checklist is incomplete");
  const input = parsed.data;
  const organizationId = await organizationIdForWorkspace(ctx.workspace.id);
  return withOrganizationTenant(organizationId, ctx.user.id, async (tx) => {
    await tx.$queryRaw<Array<{ locked: number }>>`
      SELECT 1::INTEGER AS locked
      FROM pg_advisory_xact_lock(hashtextextended(${`${organizationId}:math-formal-alignment:${input.formalAttemptId}`}, 0))
    `;
    const attempt = await tx.mathPilotFormalAttempt.findFirst({
      where: { id: input.formalAttemptId, organizationId, workspaceId: ctx.workspace.id },
      include: { replay: true, alignment: true, case: { include: { researchRun: { include: {
        sources: { orderBy: [{ canonicalUri: "asc" }, { id: "asc" }] },
        findings: { include: { decision: true }, orderBy: [{ findingKey: "asc" }, { id: "asc" }] },
      } } } } },
    });
    if (!attempt || attempt.alignment || !attempt.replay) {
      throw new ResearchSandboxError("NOT_FOUND", "Formal alignment case is absent or already reviewed");
    }
    const formal = validateRecordedMathFormalAttempt({ record: attempt,
      contractDigest: attempt.case.contractDigest,
      attemptDigest: attempt.case.researchRun.mathModelAttemptDigest,
      researchDigest: researchDossierDigest(attempt.case.researchRun) });
    const replay = validateRecordedMathFormalReplay({ replay: attempt.replay, formalAttempt: attempt });
    if (!formal || formal.check.status !== "KERNEL_ACCEPTED_ALIGNMENT_PENDING" ||
      !replay || replay.status !== "REPLAY_ACCEPTED") {
      throw new ResearchSandboxError("INTEGRITY_FAILURE", "Bound compiler and fresh checker evidence is required");
    }
    const report = deriveFormalAlignmentReport(input);
    const binding = {
      formalAttemptId: attempt.id, contractDigest: attempt.contractDigest,
      targetDigest: attempt.targetDigest, sourceDigest: attempt.proofSourceDigest,
      replayDigest: attempt.replay.resultDigest, reviewerMembershipId: ctx.membership.id, report,
    };
    const record = await tx.mathPilotFormalAlignment.create({ data: {
      organizationId, workspaceId: ctx.workspace.id, missionId: attempt.missionId,
      caseId: attempt.caseId, ...binding, report: report as Prisma.InputJsonValue,
      reportDigest: digestFormalAlignmentRecord(binding),
    } });
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.MathPilotFormalAlignmentAttested,
      entityType: "MathPilotFormalAttempt",
      entityId: attempt.id,
      correlationId: ctx.correlationId,
      payload: {
        caseId: attempt.caseId,
        formalAttemptId: attempt.id,
        status: report.status,
        contractDigest: attempt.contractDigest,
        targetDigest: attempt.targetDigest,
        replayDigest: attempt.replay.resultDigest,
        reportDigest: record.reportDigest,
      },
    });
    return record;
  });
}

export { FORMAL_ALIGNMENT_CHECKS };
