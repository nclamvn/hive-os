import type { Prisma } from "@prisma/client";

import { AuditEventType, writeAuditEvent } from "@/modules/identity-workspace";
import { withOrganizationTenant } from "@/server/tenant-context";
import { getEnv } from "@/server/env";

import { digestMathAgentLedger, evaluateMathAgentReview, mathAgentLedgerSchema, mathAgentReportSchema, type MathAgentReport } from "./agent-review";
import { mathModelAttemptSchema } from "./contracts";
import { ResearchSandboxError } from "./errors";
import { digestResearchResult, researchDossierDigest } from "./integrity";
import { digestMathPilotContract, mathPilotContractSchema } from "./math-pilot";
import type { ExactReplay } from "./math-exact-replay";
import type { ExactInterval } from "./math-exact-interval";
import { validateRetainedLrcEvidence, type LrcCertificateEvidence } from "./math-lrc-replay";
import type { CodexLocalMathReviewer } from "./adapters/codex-local-review";
import { assertLrcCampaignBinding, guardedLrcCampaignCall, lrcCampaignLedgerReference, requireLrcCampaignCapability } from "./math-lrc-campaign-integration";
import { assertLrcProofUnitAttemptBinding, lrcProofUnitLedgerReference, prepareLrcProofUnitReviewInput,
  validateLrcProofUnitReviewOutput, validatePreparedLrcProofUnitLiveInput, validLrcProofUnitUsage } from "./math-lrc-proof-unit-live";
import { snapshotLrcCampaignValue, unchangedLrcCampaignSnapshot } from "./math-lrc-campaign";
import {requireMethodUnitExecutionAuthority,type MethodUnitJobRuntime} from "@/server/operations/math-method-unit-authority";
import {runMethodUnitOrderedReview} from "@/server/operations/math-method-unit-review-orchestration";
import {assertLrcMethodUnitAttemptBinding} from "./math-lrc-method-unit-live";
import {lrcMethodUnitLedgerReference} from "./math-lrc-method-unit-review";

interface AgentReviewJobInput {
  organizationId: string;
  actorUserId: string;
  workerId: string;
  jobId: string;
  expectedVersion: number;
  correlationId: string;
  signal?: AbortSignal;
  proofUnitTarget?: {caseId:string;runId:string};
  methodUnit?:MethodUnitJobRuntime;
  reviewer: { modelName: string; roleModels?: { CRITIC: string; ADVERSARY: string };
    reviewRole?: CodexLocalMathReviewer["reviewRole"];
    reviewProofUnitRole?: CodexLocalMathReviewer["reviewProofUnitRole"];
    reviewMethodUnitRole?:CodexLocalMathReviewer["reviewMethodUnitRole"];
    review: (contract: ReturnType<typeof mathPilotContractSchema.parse>,
    attempt: ReturnType<typeof mathModelAttemptSchema.parse>, exactReplay?: ExactReplay,
    exactInterval?: ExactInterval, lrcEvidence?: LrcCertificateEvidence) => Promise<[MathAgentReport, MathAgentReport]> };
}

export async function executeMathPilotAgentReviewJob(input: AgentReviewJobInput) {
  const loaded = await withOrganizationTenant(input.organizationId, input.actorUserId, async (tx) => {
    const job = await tx.durableJob.findFirst({
      where: { id: input.jobId, organizationId: input.organizationId, jobType: "math-pilot.codex-local.review",
        status: "RUNNING", lockedBy: input.workerId, version: input.expectedVersion, leaseExpiresAt: { gt: new Date() } },
    });
    if (!job || job.attempts !== 1) throw new ResearchSandboxError("JOB_CONFLICT", "AI review lease or single-dispatch fence is invalid");
    const payload = job.payload as Record<string, unknown>;
    if (typeof payload.caseId !== "string") throw new ResearchSandboxError("INVALID_INPUT", "AI review job has no case identity");
    const pilotCase = await tx.mathPilotCase.findFirst({
      where: { id: payload.caseId, organizationId: input.organizationId, workspaceId: job.workspaceId! },
      include: { agentReview: true, researchRun: { include: {
        sources: { orderBy: [{ canonicalUri: "asc" }, { id: "asc" }] },
        findings: { include: { decision: true }, orderBy: [{ findingKey: "asc" }, { id: "asc" }] },
      } } },
    });
    if (!pilotCase || pilotCase.agentReview) throw new ResearchSandboxError("INVALID_TRANSITION", "AI review is missing or already retained");
    if(input.proofUnitTarget && (pilotCase.id!==input.proofUnitTarget.caseId || pilotCase.researchRun.id!==input.proofUnitTarget.runId ||
      !mathPilotContractSchema.safeParse(pilotCase.contract).data?.lrcProofUnitScope))
      throw new ResearchSandboxError("INTEGRITY_FAILURE","One-shot proof-unit review payload points outside its exact target");
    const run = pilotCase.researchRun;
    const attemptJob = run.jobId ? await tx.durableJob.findFirst({
      where: { id: run.jobId, organizationId: input.organizationId, status: "SUCCEEDED",
        jobType: "math-pilot.codex-local.execute" }, select: { id: true, result: true },
    }) : null;
    const contract = mathPilotContractSchema.safeParse(pilotCase.contract);
    const rawContract=pilotCase.contract as Record<string,unknown>;
    if(("lrcMethodUnitScope" in rawContract||String(rawContract.version)==="4")&&!contract.success)throw new ResearchSandboxError("INTEGRITY_FAILURE","Malformed method contract cannot enter generic review");
    const attempt = mathModelAttemptSchema.safeParse(run.mathModelAttempt);
    if(contract.data?.lrcMethodUnitScope){
      requireMethodUnitExecutionAuthority(input.methodUnit?.authority,{caseId:pilotCase.id,runId:run.id});
      if(!input.reviewer.reviewMethodUnitRole||input.signal?.aborted||Object.keys(payload).length!==1||input.reviewer.modelName!=="gpt-6-sol"||input.reviewer.roleModels&&Object.values(input.reviewer.roleModels).some(m=>m!=="gpt-6-sol"))throw new ResearchSandboxError("INVALID_TRANSITION","Method review requires its scoped captured lane");
    } else if(input.methodUnit||attempt.success&&["lrcMethodUnitEvidence","lrcMethodUnitFeedback","lrcMethodUnitFiniteSeed"].some(k=>k in attempt.data))throw new ResearchSandboxError("INTEGRITY_FAILURE","Method fields/runtime cannot enter a legacy review");
    if (!["AWAITING_REVIEW", "APPROVED"].includes(run.status) || run.providerName !== "codex-local" ||
      !contract.success || digestMathPilotContract(contract.data) !== pilotCase.contractDigest ||
      !attemptJob || !attempt.success || digestResearchResult(attempt.data) !== run.mathModelAttemptDigest ||
      (attemptJob.result as Record<string, unknown> | null)?.mathModelAttemptDigest !== run.mathModelAttemptDigest ||
      attempt.data.modelName !== run.modelName) {
      throw new ResearchSandboxError("INTEGRITY_FAILURE", "Sealed AI review inputs are not valid");
    }
    if (contract.data.lrcFiniteScope
      ? !validateRetainedLrcEvidence(attempt.data.lrcEvidence, contract.data.lrcFiniteScope, pilotCase.contractDigest)
      : attempt.data.lrcEvidence !== undefined) {
      throw new ResearchSandboxError("INTEGRITY_FAILURE", "Retained LRC certificate is missing, partial or drifted before AI review");
    }
    if (contract.data.lrcFiniteScope && !["development", "test"].includes(process.env.NODE_ENV ?? "")) {
      throw new ResearchSandboxError("INVALID_TRANSITION", "Finite LRC review is restricted to local development/test");
    }
    if(contract.data.lrcCampaignScope) {
      requireLrcCampaignCapability(getEnv().LRC_CAMPAIGN_LOCAL_ENABLED);
      assertLrcCampaignBinding(contract.data,attempt.data.lrcCampaignEvidence,attempt.data);
      if(!input.reviewer.reviewRole) throw new ResearchSandboxError("INTEGRITY_FAILURE","Campaign requires a per-role review seam before the dispatch fence");
    } else if(attempt.data.lrcCampaignEvidence !== undefined) throw new ResearchSandboxError("INTEGRITY_FAILURE","Unexpected campaign evidence");
    const proofBinding={contractDigest:pilotCase.contractDigest,caseId:pilotCase.id,runId:run.id,requestedModelName:run.modelName};
    if(contract.data.lrcMethodUnitScope)assertLrcMethodUnitAttemptBinding(attempt.data,proofBinding);
    const proofInputs=contract.data.lrcProofUnitScope ? (()=> {
      requireLrcCampaignCapability(getEnv().LRC_CAMPAIGN_LOCAL_ENABLED);
      if(input.signal?.aborted || !input.reviewer.reviewProofUnitRole || input.reviewer.modelName!=="gpt-6-sol" ||
        input.reviewer.roleModels && Object.values(input.reviewer.roleModels).some(model=>model!=="gpt-6-sol"))
        throw new ResearchSandboxError("INVALID_TRANSITION","Proof-unit review requires live per-role transport and remaining budget");
      assertLrcProofUnitAttemptBinding(attempt.data,proofBinding);
      // Both complete bounded payloads are admitted before the single-dispatch fence.
      return ["CRITIC","ADVERSARY"].map(role=>prepareLrcProofUnitReviewInput({...proofBinding,
        role:role as "CRITIC"|"ADVERSARY",solverAttempt:attempt.data,solverAttemptDigest:run.mathModelAttemptDigest!}));
    })() : undefined;
    if(!proofInputs && (attempt.data.lrcProofUnitEvidence!==undefined || attempt.data.lrcProofUnitFeedback!==undefined))
      throw new ResearchSandboxError("INTEGRITY_FAILURE","Unexpected proof-unit fields before review");
    // An expired lease must never trigger a second subscription-backed review.
    if(!contract.data.lrcMethodUnitScope)await tx.durableJob.update({ where: { id: job.id }, data: { maxAttempts: 1 } });
    return { caseId: pilotCase.id, runId: run.id, contract: contract.data, contractDigest: pilotCase.contractDigest,
      attempt: attempt.data, attemptJobId:attemptJob.id,attemptDigest: run.mathModelAttemptDigest!, researchDigest: researchDossierDigest(run),proofInputs,proofBinding,
      diagnosticBinding:{organizationId:input.organizationId,workspaceId:pilotCase.workspaceId,missionId:pilotCase.missionId,actorUserId:input.actorUserId,caseId:pilotCase.id,runId:run.id,commandId:run.commandId,outboxId:job.outboxEventId!,jobId:job.id,attemptNumber:1 as const,claimedVersion:input.expectedVersion} };
  });

  const exactReplay = loaded.contract.caseType === "BENCHMARK_EXACT"
    ? await (await import("./math-exact-replay-runner")).runExactBenchmarkReplay({ code: loaded.attempt.computationPython,
      claimedAnswer: loaded.attempt.exactAnswer, image: getEnv().MATH_EXACT_REPLAY_IMAGE })
    : undefined;
  const exactInterval = loaded.contract.caseType === "BENCHMARK_EXACT"
    ? await (await import("./math-exact-interval-runner")).runExactInterval101Gon({ image: getEnv().MATH_EXACT_REPLAY_IMAGE })
    : undefined;
  const lrcEvidence = loaded.attempt.lrcEvidence;
  const campaign=loaded.attempt.lrcCampaignEvidence;
  const proofEvidence=loaded.attempt.lrcProofUnitEvidence;
  const checkProof=()=> {if(proofEvidence) {
    if(input.signal?.aborted) throw new ResearchSandboxError("INVALID_TRANSITION","Proof-unit observation budget expired");
    assertLrcProofUnitAttemptBinding(loaded.attempt,loaded.proofBinding);
  }};
  let methodFenceSet=false;
  const method=loaded.contract.lrcMethodUnitScope?await runMethodUnitOrderedReview({runtime:input.methodUnit!,binding:loaded.proofBinding,diagnosticBinding:loaded.diagnosticBinding,attempt:loaded.attempt,attemptDigest:loaded.attemptDigest,signal:input.signal,review:(prepared,capture)=>input.reviewer.reviewMethodUnitRole!(prepared,capture),
    fence:()=>withOrganizationTenant(input.organizationId,input.actorUserId,async tx=>{
      requireMethodUnitExecutionAuthority(input.methodUnit!.authority,loaded.proofBinding);
      const job=await tx.durableJob.findFirst({where:{id:input.jobId,organizationId:input.organizationId,jobType:"math-pilot.codex-local.review",status:"RUNNING",lockedBy:input.workerId,version:input.expectedVersion,leaseExpiresAt:{gt:new Date()}}});
      const payload=job?.payload as Record<string,unknown>|null;
      const current=await tx.mathPilotCase.findFirst({where:{id:loaded.caseId,organizationId:input.organizationId,workspaceId:loaded.diagnosticBinding.workspaceId},include:{researchRun:true}});
      const solverJob=await tx.durableJob.findFirst({where:{id:loaded.attemptJobId,organizationId:input.organizationId,jobType:"math-pilot.codex-local.execute",status:"SUCCEEDED"},select:{id:true,result:true}});
      if(input.signal?.aborted||!job||job.attempts!==1||!payload||Object.keys(payload).length!==1||payload.caseId!==loaded.caseId||!current||current.researchRun.id!==loaded.runId||current.researchRun.jobId!==loaded.attemptJobId||current.researchRun.mathModelAttemptDigest!==loaded.attemptDigest||!["AWAITING_REVIEW","APPROVED"].includes(current.researchRun.status)||!solverJob||(solverJob.result as Record<string,unknown>|null)?.mathModelAttemptDigest!==loaded.attemptDigest||current.contractDigest!==loaded.contractDigest||digestMathPilotContract(mathPilotContractSchema.parse(current.contract))!==loaded.contractDigest||digestResearchResult(current.researchRun.mathModelAttempt)!==loaded.attemptDigest)throw new ResearchSandboxError("JOB_CONFLICT","Method review ownership/input changed before fence");
      if(!methodFenceSet){await tx.durableJob.update({where:{id:job.id},data:{maxAttempts:1}});methodFenceSet=true;}
    })}):undefined;
  const reports: [MathAgentReport,MathAgentReport] = method?method.reports:proofEvidence ? await (async()=> {
    const result:MathAgentReport[]=[];
    for(const prepared of loaded.proofInputs!) {
      checkProof();
      const host={prepared,attempt:loaded.attempt};
      const snapshot=snapshotLrcCampaignValue(host);
      const report=await guardedLrcCampaignCall(host,view=>input.reviewer.reviewProofUnitRole!(view.prepared,view.attempt));
      checkProof();
      if(!unchangedLrcCampaignSnapshot(host,snapshot) || !validatePreparedLrcProofUnitLiveInput(prepared,
        {...loaded.proofBinding,role:prepared.role,solverAttempt:loaded.attempt,solverAttemptDigest:loaded.attemptDigest}) ||
        "lrcProofUnitInput" in report || "lrcProofUnitEvidence" in report || report.role!==prepared.role ||
        !report.threadId?.trim() || !validLrcProofUnitUsage(report.usage) || report.threadId===loaded.attempt.threadId || result.some(prior=>prior.threadId===report.threadId))
        throw new ResearchSandboxError("INTEGRITY_FAILURE","Proof-unit review host echo, input drift or context reuse");
      validateLrcProofUnitReviewOutput({role:report.role,verdict:report.verdict,candidateConclusion:report.candidateConclusion,
        exactQuote:report.exactQuote,reasoning:report.reasoning,checks:report.checks,unresolvedGap:report.unresolvedGap,
        lrcProofUnitFeedback:report.lrcProofUnitFeedback},report.role);
      result.push(mathAgentReportSchema.parse({...report,lrcProofUnitInput:prepared}));
    }
    return result as [MathAgentReport,MathAgentReport];
  })() : campaign ? await (async()=> {
    const result:MathAgentReport[]=[];
    for(const role of ["CRITIC","ADVERSARY"] as const) {
      assertLrcCampaignBinding(loaded.contract,campaign,loaded.attempt);
      const report=await guardedLrcCampaignCall({contract:loaded.contract,attempt:loaded.attempt,campaign},view=>
        input.reviewer.reviewRole!(role,view.contract,view.attempt,null,null,null,null,undefined,undefined,null,null,undefined,view.campaign));
      assertLrcCampaignBinding(loaded.contract,campaign,loaded.attempt);
      if(report.role!==role || report.threadId===loaded.attempt.threadId || result.some(prior=>prior.threadId===report.threadId))
        throw new ResearchSandboxError("INTEGRITY_FAILURE","Campaign review context reused or role substituted");
      result.push(report);
    }
    return result as [MathAgentReport,MathAgentReport];
  })() : await input.reviewer.review(loaded.contract, loaded.attempt, exactReplay, exactInterval, lrcEvidence);
  const verdict = evaluateMathAgentReview({ contract: loaded.contract, contractDigest: loaded.contractDigest,
    caseId:loaded.caseId,runId:loaded.runId,attempt: loaded.attempt, reports, exactReplay, exactInterval,
    ...(method?{finiteEvidence:method.finiteEvidence,finiteSourcePins:input.methodUnit!.finiteSourcePins,reviewJobId:input.jobId}:{}) });
  const roleModels = input.reviewer.roleModels ?? {
    CRITIC: input.reviewer.modelName, ADVERSARY: input.reviewer.modelName,
  };
  const ledger = mathAgentLedgerSchema.parse({ version: method?7:proofEvidence ? 6 : campaign ? 5 : lrcEvidence ? 4 : 3,
    reviewerModels: reports.map((report) => ({ role: report.role,
      providerName: "codex-local", identityEvidence: "REQUESTED_CLI_MODEL",
      requestedModelName: roleModels[report.role], threadId: report.threadId })), reports,
    ...(exactReplay ? { exactReplay } : {}), ...(exactInterval ? { exactInterval } : {}),
    ...(campaign ? {lrcCampaignEvidence:lrcCampaignLedgerReference(campaign)} : {}),
    ...(proofEvidence ? {lrcProofUnitEvidence:lrcProofUnitLedgerReference(proofEvidence)} : {}),
    ...(method?{lrcMethodUnitEvidence:lrcMethodUnitLedgerReference(loaded.attempt.lrcMethodUnitEvidence),lrcMethodUnitFiniteEvidence:method.finiteEvidence}:{}),
    ...(lrcEvidence ? { lrcEvidence: { scopeDigest: lrcEvidence.scopeDigest,
      certificateDigest: lrcEvidence.certificate.certificateDigest, evidenceDigest: lrcEvidence.evidenceDigest } } : {}), ...verdict });
  const ledgerDigest = digestMathAgentLedger(ledger);

  return withOrganizationTenant(input.organizationId, input.actorUserId, async (tx) => {
    checkProof();
    await tx.$queryRaw`SELECT 1::INTEGER AS locked FROM pg_advisory_xact_lock(hashtextextended(${`${input.organizationId}:math-agent-review:${loaded.caseId}`}, 0))`;
    const job = await tx.durableJob.findFirst({
      where: { id: input.jobId, organizationId: input.organizationId, jobType: "math-pilot.codex-local.review",
        status: "RUNNING", lockedBy: input.workerId, version: input.expectedVersion, leaseExpiresAt: { gt: new Date() } },
    });
    if (!job) throw new ResearchSandboxError("JOB_CONFLICT", "AI review lease expired before retention");
    if(proofEvidence||method) {
      const currentPayload=job.payload as Record<string,unknown>|null;
      if(job.attempts!==1 || !currentPayload || Object.keys(currentPayload).length!==1 || currentPayload.caseId!==loaded.caseId)
        throw new ResearchSandboxError("JOB_CONFLICT","Proof-unit review payload changed before retention");
    }
    const pilotCase = await tx.mathPilotCase.findFirst({
      where: { id: loaded.caseId, organizationId: input.organizationId, workspaceId: job.workspaceId! },
      include: { agentReview: true, researchRun: { include: {
        sources: { orderBy: [{ canonicalUri: "asc" }, { id: "asc" }] },
        findings: { include: { decision: true }, orderBy: [{ findingKey: "asc" }, { id: "asc" }] },
      } } },
    });
    if (!pilotCase || pilotCase.agentReview || pilotCase.contractDigest !== loaded.contractDigest ||
      pilotCase.researchRun.mathModelAttemptDigest !== loaded.attemptDigest ||
      researchDossierDigest(pilotCase.researchRun) !== loaded.researchDigest) {
      throw new ResearchSandboxError("INTEGRITY_FAILURE", "AI review inputs changed during review");
    }
    if(campaign) {
      const currentContract=mathPilotContractSchema.parse(pilotCase.contract);
      if(digestMathPilotContract(currentContract)!==loaded.contractDigest || digestResearchResult(pilotCase.researchRun.mathModelAttempt)!==loaded.attemptDigest)
        throw new ResearchSandboxError("INTEGRITY_FAILURE","Campaign retained inputs drifted");
      assertLrcCampaignBinding(currentContract,campaign,pilotCase.researchRun.mathModelAttempt);
    }
    if(proofEvidence) {
      const currentContract=mathPilotContractSchema.parse(pilotCase.contract);
      if(digestMathPilotContract(currentContract)!==loaded.contractDigest || digestResearchResult(pilotCase.researchRun.mathModelAttempt)!==loaded.attemptDigest)
        throw new ResearchSandboxError("INTEGRITY_FAILURE","Proof-unit retained inputs drifted");
      assertLrcProofUnitAttemptBinding(pilotCase.researchRun.mathModelAttempt,loaded.proofBinding);
      checkProof();
    }
    if(method){requireMethodUnitExecutionAuthority(input.methodUnit!.authority,loaded.proofBinding);if(input.signal?.aborted||digestMathPilotContract(mathPilotContractSchema.parse(pilotCase.contract))!==loaded.contractDigest||digestResearchResult(pilotCase.researchRun.mathModelAttempt)!==loaded.attemptDigest)throw new ResearchSandboxError("INTEGRITY_FAILURE","Method inputs changed before retention");assertLrcMethodUnitAttemptBinding(pilotCase.researchRun.mathModelAttempt,loaded.proofBinding);}
    const review = await tx.mathPilotAgentReview.create({ data: {
      organizationId: input.organizationId, workspaceId: pilotCase.workspaceId, missionId: pilotCase.missionId,
      caseId: pilotCase.id, conclusion: ledger.conclusion, disposition: ledger.disposition,
      contractDigest: loaded.contractDigest, attemptDigest: loaded.attemptDigest,
      researchDigest: loaded.researchDigest, ledger: ledger as Prisma.InputJsonValue,
      ledgerDigest, jobId: job.id,
    } });
    await writeAuditEvent(tx, {
      workspaceId: pilotCase.workspaceId, actorUserId: input.actorUserId,
      eventType: AuditEventType.MathPilotAgentReviewed, entityType: "MathPilotCase", entityId: pilotCase.id,
      correlationId: input.correlationId,
      payload: { caseId: pilotCase.id, runId: loaded.runId, disposition: ledger.disposition,
        conclusion: ledger.conclusion, ledgerDigest, attemptDigest: loaded.attemptDigest },
    });
    await tx.durableJob.update({ where: { id: job.id }, data: {
      status: "SUCCEEDED", result: { caseId: pilotCase.id, disposition: ledger.disposition, ledgerDigest },
      lockedBy: null, leaseExpiresAt: null, completedAt: new Date(), version: { increment: 1 },
    } });
    await tx.durableJobEvent.create({ data: {
      organizationId: input.organizationId, workspaceId: pilotCase.workspaceId, jobId: job.id,
      eventType: "SUCCEEDED", attemptNumber: job.attempts, workerId: input.workerId,
    } });
    return review;
  });
}
