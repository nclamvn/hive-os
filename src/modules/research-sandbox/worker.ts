import { completeJob, failJob } from "@/modules/command-runtime/jobs";
import { AuditEventType, writeAuditEvent } from "@/modules/identity-workspace/audit";
import { enforceManualProviderPolicy } from "@/modules/identity-workspace/policy";
import { withOrganizationTenant } from "@/server/tenant-context";
import { getEnv } from "@/server/env";

import {
  queryPlanSchema,
  mathModelAttemptSchema,
  researchProviderUsageSchema,
  resourceLimitsSchema,
  sourcePolicySchema,
  type ResearchProvider,
  type SandboxExecutor,
} from "./contracts";
import { ResearchSandboxError } from "./errors";
import { digestMathPilotContract, mathPilotContractSchema, resolveMathPilotContract, type MathPilotRequest } from "./math-pilot";
import { assertLrcCampaignBinding, assertNoProviderCampaignEvidence, guardedLrcCampaignCall, requireLrcCampaignCapability } from "./math-lrc-campaign-integration";
import { snapshotLrcCampaignValue, unchangedLrcCampaignSnapshot } from "./math-lrc-campaign";
import { assertLrcProofUnitAttemptBinding, assertLrcProofUnitLiveEvidence, createLrcProofUnitLiveEvidence, prepareLrcProofUnitSolverInput,
  validateLrcProofUnitSolverOutput } from "./math-lrc-proof-unit-live";
import { importLrcProofUnitIdentity } from "./math-lrc-proof-unit-identity";
import {randomUUID} from "node:crypto";
import {requireMethodUnitExecutionAuthority,beginMethodUnitStage,type MethodUnitJobRuntime} from "@/server/operations/math-method-unit-authority";
import {MethodUnitTransportCapture} from "@/server/operations/math-method-unit-transport";
import {assertLrcMethodUnitAttemptBinding,createLrcMethodUnitLiveEvidence,prepareLrcMethodUnitSolverInput,lrcMethodUnitSolverMathematics} from "./math-lrc-method-unit-live";
import {MathDiagnosticError} from "./math-transport-diagnostics";
import {
  digestResearchResult,
  validateResearchProviderResult,
  validateSandboxExecutorResult,
} from "./integrity";

interface WorkerJobInput {
  organizationId: string;
  actorUserId: string;
  workerId: string;
  jobId: string;
  expectedVersion: number;
  correlationId: string;
  signal?: AbortSignal;
  proofUnitTarget?: {caseId:string;runId:string};
  methodUnit?:MethodUnitJobRuntime;
  methodUnitProvider?:(capture:MethodUnitTransportCapture)=>ResearchProvider;
}

async function failWorkerJob(
  input: WorkerJobInput,
  run: { id: string; kind: "research" | "sandbox"; mathPilot?: boolean },
  error: unknown,
) {
  const code = error instanceof ResearchSandboxError || error instanceof MathDiagnosticError ? error.code : "INVALID_INPUT";
  const failed = await failJob({
    organizationId: input.organizationId,
    actorUserId: input.actorUserId,
    workerId: input.workerId,
    jobId: input.jobId,
    expectedVersion: input.expectedVersion,
    errorCode: code,
    errorMessage: run.kind === "research" ? "Research worker result was rejected" : "Sandbox worker result was rejected",
    // A timed-out or malformed paid math request may still be charged. Never
    // make an automatic second provider call for the same pilot case.
    retryable: !run.mathPilot && !["INTEGRITY_FAILURE", "PROVIDER_MISMATCH", "PROVIDER_ACCOUNTING_UNVERIFIED", "SANDBOX_LIMIT_EXCEEDED"].includes(code),
  });
  await withOrganizationTenant(input.organizationId, input.actorUserId, (tx) =>
    run.kind === "research"
      ? tx.researchRun.updateMany({
          where: { id: run.id, organizationId: input.organizationId, status: { in: ["QUEUED", "RUNNING"] } },
          data: { status: failed.status === "DEAD_LETTER" ? "FAILED" : "QUEUED", failureCode: code, version: { increment: 1 } },
        })
      : tx.computationRun.updateMany({
          where: { id: run.id, organizationId: input.organizationId, status: { in: ["QUEUED", "RUNNING"] } },
          data: { status: failed.status === "DEAD_LETTER" ? "FAILED" : "QUEUED", failureCode: code, version: { increment: 1 } },
        }),
  );
}

export async function executeResearchJob(
  input: WorkerJobInput & { provider: ResearchProvider },
) {
  const loaded = await withOrganizationTenant(input.organizationId, input.actorUserId, async (tx) => {
    const job = await tx.durableJob.findFirst({
      where: {
        id: input.jobId,
        organizationId: input.organizationId,
        status: "RUNNING",
        lockedBy: input.workerId,
        version: input.expectedVersion,
        leaseExpiresAt: { gt: new Date() },
        jobType: { in: ["research.run.execute", "math-pilot.codex-local.execute"] },
      },
    });
    if (!job) throw new ResearchSandboxError("JOB_CONFLICT", "Research job lease is invalid");
    const payload = job.payload as Record<string, unknown>;
    if (typeof payload.runId !== "string") throw new ResearchSandboxError("INVALID_INPUT", "Research job payload is invalid");
    const run = await tx.researchRun.findFirst({
      where: { id: payload.runId, organizationId: input.organizationId },
      include: { mathPilotCase: { select: { id: true, caseType: true, contract: true, contractDigest: true } } },
    });
    if (!run) throw new ResearchSandboxError("NOT_FOUND", "Research run not found");
    const rawContract=run.mathPilotCase?.contract as Record<string,unknown>|undefined;
    const parsedContract=mathPilotContractSchema.safeParse(rawContract);
    const methodMarker=rawContract&&("lrcMethodUnitScope" in rawContract||String(rawContract.version)==="4");
    if(methodMarker&&!parsedContract.success)throw new ResearchSandboxError("INTEGRITY_FAILURE","Malformed method contract cannot enter generic execution");
    const methodScope=parsedContract.data?.lrcMethodUnitScope;
    if(methodScope){
      requireMethodUnitExecutionAuthority(input.methodUnit?.authority,{caseId:run.mathPilotCase!.id,runId:run.id});
      if(!input.methodUnitProvider||input.signal?.aborted||job.attempts!==1||Object.keys(payload).length!==1||run.providerName!=="codex-local"||run.modelName!=="gpt-6-sol")
        throw new ResearchSandboxError("INVALID_TRANSITION","Method unit requires its authorized captured one-shot lane");
    } else if(input.methodUnit)throw new ResearchSandboxError("INTEGRITY_FAILURE","Method runtime cannot enter a legacy lane");
    if(input.proofUnitTarget && (run.id!==input.proofUnitTarget.runId || run.mathPilotCase?.id!==input.proofUnitTarget.caseId ||
      !mathPilotContractSchema.safeParse(run.mathPilotCase?.contract).data?.lrcProofUnitScope))
      throw new ResearchSandboxError("INTEGRITY_FAILURE","One-shot proof-unit solver payload points outside its exact target");
    const expectedJobType = run.providerName === "codex-local" && run.mathPilotCase
      ? "math-pilot.codex-local.execute"
      : "research.run.execute";
    if (job.jobType !== expectedJobType) throw new ResearchSandboxError("JOB_CONFLICT", "Research job type does not match the sealed provider route");
    await enforceManualProviderPolicy(tx, run.workspaceId, run.providerName, run.modelName);
    if (run.status === "AWAITING_REVIEW") return { job, run, alreadyComplete: true as const };
    if (!['QUEUED', 'RUNNING'].includes(run.status)) throw new ResearchSandboxError("INVALID_TRANSITION", "Research run cannot be executed in its current state");
    await tx.researchRun.update({
      where: { id: run.id },
      data: { status: "RUNNING", jobId: job.id, startedAt: run.startedAt ?? new Date(), failureCode: null, version: { increment: 1 } },
    });
    return { job, run, alreadyComplete: false as const };
  });

  try {
    const mathPilot: MathPilotRequest | undefined = loaded.run.mathPilotCase
      ? (() => {
          const pilotCase = loaded.run.mathPilotCase;
          const contract = mathPilotContractSchema.safeParse(pilotCase.contract);
          if (!contract.success || contract.data.caseType !== pilotCase.caseType ||
            digestMathPilotContract(contract.data) !== pilotCase.contractDigest) {
            throw new ResearchSandboxError("INTEGRITY_FAILURE", "Sealed math case contract is invalid before provider dispatch");
          }
          if(contract.data.lrcProofUnitScope) {
            const request={caseType:"LRC_PROOF_UNIT",preset:"ALLIKVERE_P83_PROOF_UNIT_V1"} as const;
            if(digestMathPilotContract(resolveMathPilotContract(request))!==pilotCase.contractDigest)
              throw new ResearchSandboxError("INTEGRITY_FAILURE","Proof-unit contract differs from fixed preset");
            return request;
          }
          if(contract.data.lrcMethodUnitScope){
            const request={caseType:"LRC_METHOD_UNIT",preset:"FEW_EXCEPTION_SHIFT_14_V1"} as const;
            if(digestMathPilotContract(resolveMathPilotContract(request))!==pilotCase.contractDigest)throw new ResearchSandboxError("INTEGRITY_FAILURE","Method contract differs from fixed preset");
            return request;
          }
          if(contract.data.lrcCampaignScope) {
            const request={caseType:"LRC_CAMPAIGN",preset:"ALLIKVERE_P83_14_V1"} as const;
            if(digestMathPilotContract(resolveMathPilotContract(request))!==pilotCase.contractDigest)
              throw new ResearchSandboxError("INTEGRITY_FAILURE","Campaign contract differs from fixed preset");
            return request;
          }
          return contract.data.caseType === "OPEN"
            ? { caseType: "OPEN", statement: contract.data.statement, definitions: contract.data.definitions,
                assumptions: contract.data.assumptions, falsificationCriterion: contract.data.falsificationCriterion,
                successCriterion: contract.data.successCriterion, exclusions: contract.data.exclusions,
                ...(contract.data.lrcFiniteScope ? { lrcFiniteScope: contract.data.lrcFiniteScope } : {}) }
            : { caseType: contract.data.caseType };
        })()
      : undefined;
    if (loaded.alreadyComplete) {
      const retainedScope = mathPilot?.caseType === "OPEN" ? mathPilot.lrcFiniteScope : undefined;
      const retained = mathModelAttemptSchema.safeParse(loaded.run.mathModelAttempt);
      if(mathPilot?.caseType==="LRC_METHOD_UNIT") {
        if(!retained.success||digestResearchResult(retained.data)!==loaded.run.mathModelAttemptDigest)throw new ResearchSandboxError("INTEGRITY_FAILURE","Completed method attempt digest invalid");
        assertLrcMethodUnitAttemptBinding(retained.data,{contractDigest:loaded.run.mathPilotCase!.contractDigest,caseId:loaded.run.mathPilotCase!.id,runId:loaded.run.id,requestedModelName:loaded.run.modelName});
      } else if(retained.success&&["lrcMethodUnitEvidence","lrcMethodUnitFeedback","lrcMethodUnitFiniteSeed"].some(k=>k in retained.data))throw new ResearchSandboxError("INTEGRITY_FAILURE","Method fields in legacy attempt");
      if(mathPilot?.caseType === "LRC_PROOF_UNIT") {
        requireLrcCampaignCapability(getEnv().LRC_CAMPAIGN_LOCAL_ENABLED);
        if(!retained.success || digestResearchResult(retained.data)!==loaded.run.mathModelAttemptDigest)
          throw new ResearchSandboxError("INTEGRITY_FAILURE","Completed proof-unit attempt digest invalid");
        assertLrcProofUnitAttemptBinding(retained.data,{
          contractDigest:loaded.run.mathPilotCase!.contractDigest,caseId:loaded.run.mathPilotCase!.id,
          runId:loaded.run.id,requestedModelName:loaded.run.modelName });
        validateLrcProofUnitSolverOutput({attemptType:retained.data.attemptType,argument:retained.data.argument,
          candidateCounterexample:retained.data.candidateCounterexample,selfChecks:retained.data.selfChecks,
          limitations:retained.data.limitations,lrcProofUnitFeedback:retained.data.lrcProofUnitFeedback});
      } else if(retained.success && (retained.data.lrcProofUnitEvidence!==undefined || retained.data.lrcProofUnitFeedback!==undefined))
        throw new ResearchSandboxError("INTEGRITY_FAILURE","Unexpected completed proof-unit evidence");
      if(mathPilot?.caseType === "LRC_CAMPAIGN") {
        requireLrcCampaignCapability(getEnv().LRC_CAMPAIGN_LOCAL_ENABLED);
        if(!retained.success || digestResearchResult(retained.data)!==loaded.run.mathModelAttemptDigest)
          throw new ResearchSandboxError("INTEGRITY_FAILURE","Completed campaign attempt digest invalid");
        assertLrcCampaignBinding(resolveMathPilotContract(mathPilot),retained.data.lrcCampaignEvidence,retained.data);
      } else if(loaded.run.mathModelAttempt && typeof loaded.run.mathModelAttempt === "object" &&
        "lrcCampaignEvidence" in loaded.run.mathModelAttempt)
        throw new ResearchSandboxError("INTEGRITY_FAILURE","Unexpected completed campaign evidence");
      const { validateRetainedLrcEvidence } = await import("./math-lrc-replay");
      if (retainedScope ? !retained.success || !validateRetainedLrcEvidence(retained.data.lrcEvidence,
        retainedScope, loaded.run.mathPilotCase!.contractDigest) : retained.success && retained.data.lrcEvidence !== undefined) {
        throw new ResearchSandboxError("INTEGRITY_FAILURE", "Existing attempt lacks valid sealed LRC evidence");
      }
      const existingUsage = researchProviderUsageSchema.safeParse(loaded.run.providerUsage);
      return completeJob({
        organizationId: input.organizationId,
        actorUserId: input.actorUserId,
        workerId: input.workerId,
        jobId: input.jobId,
        expectedVersion: input.expectedVersion,
        result: {
          runId: loaded.run.id,
          status: "AWAITING_REVIEW",
          providerUsage: existingUsage.success ? existingUsage.data : null,
          mathModelAttemptDigest: loaded.run.mathModelAttemptDigest,
        },
      });
    }
    if (loaded.run.providerUsage !== null || loaded.run.mathModelAttempt !== null) {
      throw new ResearchSandboxError("PROVIDER_ACCOUNTING_UNVERIFIED", "A prior provider call was charged or may have completed; automatic replay is forbidden");
    }
    if (input.provider.providerName !== loaded.run.providerName || input.provider.modelName !== loaded.run.modelName) {
      throw new ResearchSandboxError("PROVIDER_MISMATCH", "Connected research adapter does not match the requested provider identity");
    }
    const lrcScope = mathPilot?.caseType === "OPEN" ? mathPilot.lrcFiniteScope : undefined;
    const proofContract=mathPilot?.caseType === "LRC_PROOF_UNIT" ? resolveMathPilotContract(mathPilot) : null;
    const proofBinding={contractDigest:loaded.run.mathPilotCase?.contractDigest ?? "",caseId:loaded.run.mathPilotCase?.id ?? "",
      runId:loaded.run.id,requestedModelName:loaded.run.modelName};
    const methodEvidence=mathPilot?.caseType==="LRC_METHOD_UNIT"?createLrcMethodUnitLiveEvidence({solverInput:prepareLrcMethodUnitSolverInput(proofBinding)}):undefined;
    const checkMethod=()=>{if(methodEvidence){requireMethodUnitExecutionAuthority(input.methodUnit?.authority,proofBinding);if(input.signal?.aborted)throw new ResearchSandboxError("INVALID_TRANSITION","Method budget expired");}};
    let methodCapture:MethodUnitTransportCapture|undefined;
    if(methodEvidence){checkMethod();beginMethodUnitStage(input.methodUnit!.authority,proofBinding,"SOLVER");methodCapture=await MethodUnitTransportCapture.reserve(input.methodUnit!,{
      organizationId:input.organizationId,workspaceId:loaded.run.workspaceId,missionId:loaded.run.missionId,actorUserId:input.actorUserId,
      caseId:proofBinding.caseId,runId:proofBinding.runId,commandId:loaded.run.commandId,outboxId:loaded.job.outboxEventId!,jobId:loaded.job.id,
      dispatchId:randomUUID(),attemptNumber:1,claimedVersion:input.expectedVersion,role:"SOLVER"});await methodCapture.prepared(methodEvidence.solverInput);checkMethod();}
    const checkProofSignal=()=> {if(proofContract && input.signal?.aborted)
      throw new ResearchSandboxError("INVALID_TRANSITION","Proof-unit observation budget expired");};
    const proofEvidence=proofContract ? await (async()=> {
      checkProofSignal();requireLrcCampaignCapability(getEnv().LRC_CAMPAIGN_LOCAL_ENABLED);
      if(loaded.run.providerName!=="codex-local" || loaded.run.modelName!=="gpt-6-sol" || loaded.job.attempts!==1)
        throw new ResearchSandboxError("INVALID_TRANSITION","Proof-unit requires the fixed local Codex lane");
      const identityAdmission=await importLrcProofUnitIdentity();
      checkProofSignal();
      return createLrcProofUnitLiveEvidence({identityAdmission,solverInput:prepareLrcProofUnitSolverInput(proofBinding)});
    })() : undefined;
    const proofHost=proofEvidence ? {contract:proofContract,evidence:proofEvidence,binding:proofBinding} : null;
    const proofSnapshot=proofHost ? snapshotLrcCampaignValue(proofHost) : null;
    const checkProof=()=> {if(proofHost && proofSnapshot) {
      checkProofSignal();
      if(!unchangedLrcCampaignSnapshot(proofHost,proofSnapshot))
        throw new ResearchSandboxError("INTEGRITY_FAILURE","Proof-unit host inputs changed during dispatch");
      assertLrcProofUnitLiveEvidence(proofEvidence,proofBinding);
    }};
    const campaignContract=mathPilot?.caseType === "LRC_CAMPAIGN" ? resolveMathPilotContract(mathPilot) : null;
    const lrcCampaignEvidence=campaignContract ? await (async()=> {
      requireLrcCampaignCapability(getEnv().LRC_CAMPAIGN_LOCAL_ENABLED);
      if(loaded.run.providerName!=="codex-local") throw new ResearchSandboxError("INVALID_TRANSITION","Campaign requires local Codex lane");
      const {runLrcCampaignReference}=await import("./math-lrc-campaign-reference");
      const evidence=await runLrcCampaignReference(campaignContract.lrcCampaignScope!,loaded.run.mathPilotCase!.contractDigest,{permission:true});
      assertLrcCampaignBinding(campaignContract,evidence);return evidence;
    })() : undefined;
    const campaignHost=lrcCampaignEvidence ? {contract:loaded.run.mathPilotCase!.contract,evidence:lrcCampaignEvidence,
      caseId:loaded.run.mathPilotCase!.id,contractDigest:loaded.run.mathPilotCase!.contractDigest} : null;
    const campaignSnapshot=campaignHost ? snapshotLrcCampaignValue(campaignHost) : null;
    const checkCampaign=()=> {if(campaignHost && campaignSnapshot) {
      if(!unchangedLrcCampaignSnapshot(campaignHost,campaignSnapshot)) throw new ResearchSandboxError("INTEGRITY_FAILURE","Campaign host changed during dispatch");
      assertLrcCampaignBinding(campaignContract!,lrcCampaignEvidence);
    }};
    // Fixed trusted local tool BEFORE the single-dispatch model fence. A failed
    // certificate must not consume model authority or enter an immutable attempt.
    const lrcEvidence = lrcScope ? await (async () => {
      if (loaded.run.providerName !== "codex-local" || !["development", "test"].includes(process.env.NODE_ENV ?? "")) {
        throw new ResearchSandboxError("INVALID_TRANSITION", "Finite LRC evidence is restricted to the local Codex lane");
      }
      const { runLrcCertificateEvidence, validateRetainedLrcEvidence } = await import("./math-lrc-replay");
      const checked = await runLrcCertificateEvidence(lrcScope, loaded.run.mathPilotCase!.contractDigest);
      if (!validateRetainedLrcEvidence(checked, lrcScope, loaded.run.mathPilotCase!.contractDigest)) {
        throw new ResearchSandboxError("INTEGRITY_FAILURE", "LRC tool did not return complete root-bound evidence");
      }
      return checked;
    })() : undefined;
    if (loaded.run.mathPilotCase) {
      checkCampaign();checkProof();checkMethod();
      if (!getEnv().MATH_PILOT_QUEUE_ENABLED) {
        throw new ResearchSandboxError("INVALID_TRANSITION", "Math pilot provider dispatch is disabled");
      }
      await withOrganizationTenant(input.organizationId, input.actorUserId, async (tx) => {
        await tx.$queryRaw`SELECT id FROM research_run WHERE organization_id = ${input.organizationId} AND id = ${loaded.run.id} FOR UPDATE`;
        const current = await tx.researchRun.findUniqueOrThrow({ where: { id: loaded.run.id } });
        if(proofEvidence||methodEvidence) {
          const currentJob=await tx.durableJob.findFirst({where:{id:input.jobId,organizationId:input.organizationId,
            status:"RUNNING",lockedBy:input.workerId,version:input.expectedVersion,leaseExpiresAt:{gt:new Date()},jobType:"math-pilot.codex-local.execute"}});
          const currentPayload=currentJob?.payload as Record<string,unknown>|null;
          if(!currentJob || currentJob.attempts!==1 || !currentPayload || Object.keys(currentPayload).length!==1 || currentPayload.runId!==loaded.run.id)
            throw new ResearchSandboxError("JOB_CONFLICT","Proof-unit solver lease or payload changed before fence");
          const currentCase=await tx.mathPilotCase.findFirst({where:{id:proofBinding.caseId,organizationId:input.organizationId,researchRunId:current.id}});
          if(!currentCase || currentCase.contractDigest!==proofBinding.contractDigest ||
            digestMathPilotContract(mathPilotContractSchema.parse(currentCase.contract))!==proofBinding.contractDigest)
            throw new ResearchSandboxError("INTEGRITY_FAILURE","Proof-unit case changed before fence");
          checkProof();checkMethod();
        }
        if(campaignHost) {
          const currentCase=await tx.mathPilotCase.findFirst({where:{id:campaignHost.caseId,organizationId:input.organizationId,researchRunId:current.id}});
          if(!currentCase || currentCase.contractDigest!==campaignHost.contractDigest ||
            digestMathPilotContract(mathPilotContractSchema.parse(currentCase.contract))!==campaignHost.contractDigest)
            throw new ResearchSandboxError("INTEGRITY_FAILURE","Campaign case changed before fence");
          assertLrcCampaignBinding(mathPilotContractSchema.parse(currentCase.contract),lrcCampaignEvidence);
        }
        if (current.status !== "RUNNING" || current.jobId !== input.jobId || current.providerDispatchAttemptedAt !== null) {
          throw new ResearchSandboxError("PROVIDER_ACCOUNTING_UNVERIFIED", "Math provider dispatch may already have occurred; manual reconciliation is required");
        }
        await tx.researchRun.update({
          where: { id: current.id },
          data: { providerDispatchAttemptedAt: new Date(), version: { increment: 1 } },
        });
      });
    }
    if (loaded.run.providerName === "codex-local" && !loaded.run.mathPilotCase) {
      throw new ResearchSandboxError("INVALID_TRANSITION", "Local Codex is restricted to sealed math pilot cases");
    }
    const sourcePolicy = sourcePolicySchema.parse(loaded.run.sourcePolicy);
    const queryPlan = queryPlanSchema.parse(loaded.run.queryPlan);
    const providerInput={
        missionId: loaded.run.missionId,
        documentId: loaded.run.documentId,
        question: loaded.run.question,
        scope: loaded.run.scope,
        providerName: loaded.run.providerName,
        modelName: loaded.run.modelName,
        sourcePolicy,
        queryPlan,
        ...(mathPilot ? { mathPilot } : {}),
        ...(lrcEvidence ? { lrcEvidence } : {}),
        ...(lrcCampaignEvidence ? {lrcCampaignEvidence} : {}),
        ...(proofEvidence ? {lrcProofUnitInput:proofEvidence.solverInput} : {}),
        ...(methodEvidence?{lrcMethodUnitInput:methodEvidence.solverInput}:{}),
      };
    checkCampaign();checkProof();
    checkMethod();
    const provider=methodCapture?input.methodUnitProvider!(methodCapture):input.provider;
    if(provider.providerName!==loaded.run.providerName||provider.modelName!==loaded.run.modelName)throw new ResearchSandboxError("PROVIDER_MISMATCH","Method adapter identity differs");
    const providerOutput=lrcCampaignEvidence || proofEvidence || methodEvidence ? await guardedLrcCampaignCall(providerInput,view=>provider.execute(view)) : await provider.execute(providerInput);
    checkCampaign();checkProof();checkMethod();assertNoProviderCampaignEvidence(providerOutput);
    const rawAttempt=providerOutput.mathAttempt;
    if(methodCapture)methodCapture.requireReturned(rawAttempt);
    if(rawAttempt&&("lrcMethodUnitEvidence" in rawAttempt||"lrcMethodUnitInput" in rawAttempt||"lrcMethodUnitFiniteEvidence" in rawAttempt||!methodEvidence&&["lrcMethodUnitFeedback","lrcMethodUnitFiniteSeed"].some(k=>k in rawAttempt)))throw new ResearchSandboxError("INTEGRITY_FAILURE","Method host echo or cross-lane output");
    if(rawAttempt && ("lrcProofUnitEvidence" in rawAttempt || "lrcProofUnitInput" in rawAttempt ||
      (!proofEvidence && "lrcProofUnitFeedback" in rawAttempt)))
      throw new ResearchSandboxError("INTEGRITY_FAILURE","Provider cannot author proof-unit host fields or cross lanes");
    const result = validateResearchProviderResult(providerOutput,
      { providerName: loaded.run.providerName, modelName: loaded.run.modelName, sourcePolicy },
    );
    if (result.mathAttempt?.lrcEvidence !== undefined) {
      throw new ResearchSandboxError("INTEGRITY_FAILURE", "Provider output cannot author host LRC evidence");
    }
    const modelAttempt = result.mathAttempt ? mathModelAttemptSchema.parse({ ...result.mathAttempt,
      ...(lrcEvidence ? { lrcEvidence } : {}),...(lrcCampaignEvidence ? {lrcCampaignEvidence} : {}),
      ...(proofEvidence ? {lrcProofUnitEvidence:proofEvidence} : {}) }) : null;
    const retainedModelAttempt=methodEvidence&&modelAttempt?mathModelAttemptSchema.parse({...modelAttempt,lrcMethodUnitEvidence:methodEvidence}):modelAttempt;
    if(methodEvidence){if(!retainedModelAttempt)throw new ResearchSandboxError("INTEGRITY_FAILURE","Method output missing");lrcMethodUnitSolverMathematics(retainedModelAttempt);assertLrcMethodUnitAttemptBinding(retainedModelAttempt,proofBinding);}
    if(proofEvidence) {
      if(!modelAttempt) throw new ResearchSandboxError("INTEGRITY_FAILURE","Proof-unit mathematical output missing");
      validateLrcProofUnitSolverOutput({attemptType:modelAttempt.attemptType,argument:modelAttempt.argument,
        candidateCounterexample:modelAttempt.candidateCounterexample,selfChecks:modelAttempt.selfChecks,
        limitations:modelAttempt.limitations,lrcProofUnitFeedback:modelAttempt.lrcProofUnitFeedback});
      assertLrcProofUnitAttemptBinding(modelAttempt,proofBinding);
    }
    if(lrcCampaignEvidence) assertLrcCampaignBinding(campaignContract!,lrcCampaignEvidence,modelAttempt);
    if (loaded.run.providerName === "codex-local" && !modelAttempt) {
      throw new ResearchSandboxError("INVALID_INPUT", "Local Codex did not return a retained mathematical attempt");
    }
    const modelAttemptDigest = retainedModelAttempt ? digestResearchResult(retainedModelAttempt) : null;
    const resultDigest = digestResearchResult({
      provider: result.providerName,
      model: result.modelName,
      sources: result.sources.map((source, index) => ({
        key: source.key,
        canonicalUri: source.canonicalUri,
        title: source.title,
        publisher: source.publisher,
        mediaType: source.mediaType,
        contentDigest: source.contentDigest,
        sourceClass: source.sourceClass,
        capturedAt: source.capturedAt.toISOString(),
        provenance: result.provenances[index],
      })),
      findings: result.findings,
    });
    await withOrganizationTenant(input.organizationId, input.actorUserId, async (tx) => {
      await tx.$queryRaw`SELECT id FROM research_run WHERE organization_id = ${input.organizationId} AND id = ${loaded.run.id} FOR UPDATE`;
      const current = await tx.researchRun.findUniqueOrThrow({ where: { id: loaded.run.id } });
      checkCampaign();checkProof();checkMethod();
      if(proofEvidence||methodEvidence) {
        const currentJob=await tx.durableJob.findFirst({where:{id:input.jobId,organizationId:input.organizationId,
          status:"RUNNING",lockedBy:input.workerId,version:input.expectedVersion,leaseExpiresAt:{gt:new Date()},jobType:"math-pilot.codex-local.execute"}});
        const currentPayload=currentJob?.payload as Record<string,unknown>|null;
        if(!currentJob || currentJob.attempts!==1 || !currentPayload || Object.keys(currentPayload).length!==1 || currentPayload.runId!==loaded.run.id)
          throw new ResearchSandboxError("JOB_CONFLICT","Proof-unit solver lease or payload changed before retention");
        const currentCase=await tx.mathPilotCase.findFirst({where:{id:proofBinding.caseId,organizationId:input.organizationId,researchRunId:current.id}});
        if(!currentCase || currentCase.contractDigest!==proofBinding.contractDigest ||
          digestMathPilotContract(mathPilotContractSchema.parse(currentCase.contract))!==proofBinding.contractDigest)
          throw new ResearchSandboxError("INTEGRITY_FAILURE","Proof-unit case changed before retention");
        if(proofEvidence)assertLrcProofUnitLiveEvidence(modelAttempt!.lrcProofUnitEvidence,proofBinding);
        if(methodEvidence)assertLrcMethodUnitAttemptBinding(retainedModelAttempt,proofBinding);
      }
      if(campaignHost) {
        const currentCase=await tx.mathPilotCase.findFirst({where:{id:campaignHost.caseId,organizationId:input.organizationId,researchRunId:current.id}});
        if(!currentCase || currentCase.contractDigest!==campaignHost.contractDigest ||
          digestMathPilotContract(mathPilotContractSchema.parse(currentCase.contract))!==campaignHost.contractDigest)
          throw new ResearchSandboxError("INTEGRITY_FAILURE","Campaign case changed before retention");
        assertLrcCampaignBinding(mathPilotContractSchema.parse(currentCase.contract),lrcCampaignEvidence,modelAttempt);
      }
      if (current.status === "AWAITING_REVIEW") return;
      if (current.status !== "RUNNING" || current.jobId !== input.jobId) {
        throw new ResearchSandboxError("JOB_CONFLICT", "Research run is no longer owned by this job");
      }
      const sourceIds = new Map<string, string>();
      for (let index = 0; index < result.sources.length; index += 1) {
        const source = result.sources[index]!;
        const created = await tx.researchSourceSnapshot.create({
          data: {
            organizationId: input.organizationId,
            workspaceId: current.workspaceId,
            missionId: current.missionId,
            researchRunId: current.id,
            canonicalUri: source.canonicalUri,
            title: source.title,
            publisher: source.publisher,
            mediaType: source.mediaType,
            content: source.content,
            contentDigest: source.contentDigest,
            provenance: result.provenances[index]!,
            capturedAt: source.capturedAt,
          },
        });
        sourceIds.set(source.key, created.id);
      }
      for (const finding of result.findings) {
        await tx.researchFinding.create({
          data: {
            organizationId: input.organizationId,
            workspaceId: current.workspaceId,
            missionId: current.missionId,
            researchRunId: current.id,
            sourceId: finding.sourceKey ? sourceIds.get(finding.sourceKey) : null,
            findingKey: finding.key,
            kind: finding.kind,
            claim: finding.claim,
            exactExcerpt: finding.exactExcerpt,
            startOffset: finding.startOffset,
            endOffset: finding.endOffset,
            confidence: finding.confidence,
          },
        });
      }
      await tx.researchRun.update({
        where: { id: current.id },
        data: {
          status: "AWAITING_REVIEW",
          completedAt: new Date(),
          ...(modelAttempt ? {
            mathModelAttempt: retainedModelAttempt!,
            mathModelAttemptDigest: modelAttemptDigest!,
          } : {}),
          version: { increment: 1 },
        },
      });
      if (current.providerName === "codex-local" && loaded.run.mathPilotCase && modelAttempt) {
        await tx.outboxEvent.create({ data: {
          organizationId: input.organizationId, workspaceId: current.workspaceId,
          commandId: current.commandId, topic: "math-pilot.codex-local.review",
          aggregateType: "MathPilotCase", aggregateId: loaded.run.mathPilotCase.id,
          payload: { caseId: loaded.run.mathPilotCase.id },
        } });
      }
      await writeAuditEvent(tx, {
        workspaceId: current.workspaceId,
        actorUserId: input.actorUserId,
        actorMembershipId: null,
        eventType: AuditEventType.ResearchCompleted,
        entityType: "ResearchRun",
        entityId: current.id,
        correlationId: input.correlationId,
        payload: { runId: current.id, sourceCount: result.sources.length, findingCount: result.findings.length, resultDigest },
      });
    });
    return completeJob({
      organizationId: input.organizationId,
      actorUserId: input.actorUserId,
      workerId: input.workerId,
      jobId: input.jobId,
      expectedVersion: input.expectedVersion,
      result: {
        runId: loaded.run.id,
        resultDigest,
        sourceCount: result.sources.length,
        findingCount: result.findings.length,
        providerUsage: result.usage ?? null,
        mathModelAttemptDigest: modelAttemptDigest,
      },
    });
  } catch (error) {
    await failWorkerJob(input, { id: loaded.run.id, kind: "research", mathPilot: Boolean(loaded.run.mathPilotCase) }, error);
    throw error;
  }
}

export async function executeSandboxJob(
  input: WorkerJobInput & { executor: SandboxExecutor },
) {
  const loaded = await withOrganizationTenant(input.organizationId, input.actorUserId, async (tx) => {
    const job = await tx.durableJob.findFirst({
      where: {
        id: input.jobId,
        organizationId: input.organizationId,
        status: "RUNNING",
        lockedBy: input.workerId,
        version: input.expectedVersion,
        leaseExpiresAt: { gt: new Date() },
        jobType: "sandbox.run.execute",
      },
    });
    if (!job) throw new ResearchSandboxError("JOB_CONFLICT", "Sandbox job lease is invalid");
    const payload = job.payload as Record<string, unknown>;
    if (typeof payload.runId !== "string") throw new ResearchSandboxError("INVALID_INPUT", "Sandbox job payload is invalid");
    const run = await tx.computationRun.findFirst({ where: { id: payload.runId, organizationId: input.organizationId } });
    if (!run) throw new ResearchSandboxError("NOT_FOUND", "Computation run not found");
    if (run.status === "AWAITING_REVIEW") return { job, run, alreadyComplete: true as const };
    if (!['QUEUED', 'RUNNING'].includes(run.status)) throw new ResearchSandboxError("INVALID_TRANSITION", "Computation run cannot execute in its current state");
    await tx.computationRun.update({
      where: { id: run.id },
      data: { status: "RUNNING", jobId: job.id, startedAt: run.startedAt ?? new Date(), failureCode: null, version: { increment: 1 } },
    });
    return { job, run, alreadyComplete: false as const };
  });

  try {
    if (loaded.alreadyComplete) {
      return completeJob({
        organizationId: input.organizationId,
        actorUserId: input.actorUserId,
        workerId: input.workerId,
        jobId: input.jobId,
        expectedVersion: input.expectedVersion,
        result: { runId: loaded.run.id, status: "AWAITING_REVIEW", outputDigest: loaded.run.outputDigest ?? "" },
      });
    }
    if (input.executor.runtimeId !== loaded.run.runtimeId || input.executor.runtimeVersion !== loaded.run.runtimeVersion) {
      throw new ResearchSandboxError("PROVIDER_MISMATCH", "Connected sandbox adapter does not match the requested runtime identity");
    }
    const limits = resourceLimitsSchema.parse(loaded.run.resourceLimits);
    const networkAllowlist = Array.isArray(loaded.run.networkAllowlist)
      ? loaded.run.networkAllowlist.filter((item): item is string => typeof item === "string")
      : [];
    const result = validateSandboxExecutorResult(
      await input.executor.execute({
        missionId: loaded.run.missionId,
        documentId: loaded.run.documentId,
        researchRunId: loaded.run.researchRunId,
        kind: loaded.run.kind,
        runtimeId: loaded.run.runtimeId,
        runtimeVersion: loaded.run.runtimeVersion,
        entrypoint: loaded.run.entrypoint,
        networkPolicy: loaded.run.networkPolicy,
        networkAllowlist,
        resourceLimits: limits,
        inputReference: loaded.run.inputReference,
        inputDigest: loaded.run.inputDigest,
      }),
      {
        runtimeId: loaded.run.runtimeId,
        runtimeVersion: loaded.run.runtimeVersion,
        networkPolicy: loaded.run.networkPolicy,
        networkAllowlist,
        resourceLimits: limits,
      },
    );
    await withOrganizationTenant(input.organizationId, input.actorUserId, async (tx) => {
      await tx.$queryRaw`SELECT id FROM computation_run WHERE organization_id = ${input.organizationId} AND id = ${loaded.run.id} FOR UPDATE`;
      const current = await tx.computationRun.findUniqueOrThrow({ where: { id: loaded.run.id } });
      if (current.status === "AWAITING_REVIEW") return;
      if (current.status !== "RUNNING" || current.jobId !== input.jobId) throw new ResearchSandboxError("JOB_CONFLICT", "Computation run is no longer owned by this job");
      await tx.computationRun.update({
        where: { id: current.id },
        data: {
          status: "AWAITING_REVIEW",
          outputReference: result.outputReference,
          outputDigest: result.outputDigest,
          outputMediaType: result.outputMediaType,
          outputBytes: result.outputBytes,
          completedAt: new Date(),
          version: { increment: 1 },
        },
      });
      await writeAuditEvent(tx, {
        workspaceId: current.workspaceId,
        actorUserId: input.actorUserId,
        actorMembershipId: null,
        eventType: AuditEventType.SandboxCompleted,
        entityType: "ComputationRun",
        entityId: current.id,
        correlationId: input.correlationId,
        payload: {
          runId: current.id,
          outputDigest: result.outputDigest,
          outputBytes: result.outputBytes,
          isolationAttestation: result.isolationAttestation,
        },
      });
    });
    return completeJob({
      organizationId: input.organizationId,
      actorUserId: input.actorUserId,
      workerId: input.workerId,
      jobId: input.jobId,
      expectedVersion: input.expectedVersion,
      result: {
        runId: loaded.run.id,
        outputDigest: result.outputDigest,
        outputBytes: result.outputBytes,
        isolationAttestation: result.isolationAttestation,
      },
    });
  } catch (error) {
    await failWorkerJob(input, { id: loaded.run.id, kind: "sandbox" }, error);
    throw error;
  }
}
