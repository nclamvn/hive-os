import { randomUUID } from "node:crypto";

import { beforeEach, describe, expect, it } from "vitest";
import type { Prisma } from "@prisma/client";

import { createAuthoringDocument, getAuthoringDocument, importApprovedResearchBundle } from "@/modules/authoring";
import { claimJobs, dispatchOutboxBatch } from "@/modules/command-runtime";
import { createMission } from "@/modules/mission-kernel";
import { canonicalJson } from "@/modules/execution-fabric/contracts";
import type { FrontierDossier } from "@/modules/research-sandbox/math-frontier";
import {
  assessMathPilotCase,
  executeMathPilotAgentReviewJob,
  executeResearchJob,
  getApprovedResearchBundle,
  listMathPilotCases,
  MATH_REVIEW_CRITERIA,
  mathPilotScope,
  MATH_PILOT_CALIBRATIONS,
  requestResearchRun,
  requestMathPilotAgentReview,
  requestMathResearchCycle,
  listMathResearchCycles,
  executeMathResearchCycleRound,
  resolveMathPilotContract,
  reviewResearchRun,
  sha256,
  type MathPilotRequest,
  type ResearchProvider,
} from "@/modules/research-sandbox";
import { getDb } from "@/server/db";
import { OpenAIResearchProvider } from "@/modules/research-sandbox/adapters/openai-research";
import { withOrganizationTenant } from "@/server/tenant-context";

import { asOwner, contextForMembership, createUser, ownerQuery, truncateAll } from "./helpers";

const frontierPassage = "The finite-object problem asks whether axiom A implies property P for admissible objects.";
const frontierSource = {
  id: "test-source", canonicalUri: "https://example.org/primary/finite-objects", title: "Finite object problem",
  authors: "Test author", publicationYear: 2024, version: "v1", captureMethod: "CURATED_PRIMARY_EXCERPT" as const,
  scope: "ROOT_DOMAIN" as const, content: frontierPassage, contentDigest: sha256(frontierPassage),
  exactQuote: "whether axiom A implies property P", startOffset: frontierPassage.indexOf("whether axiom A implies property P"),
  endOffset: frontierPassage.indexOf("whether axiom A implies property P") + "whether axiom A implies property P".length,
};
const frontierContent = { coverage: "PARTIAL_NOT_NOVELTY_CERTIFICATE" as const, sources: [frontierSource],
  discovery: { provider: "CROSSREF" as const, query: "finite object axiom A property P", status: "COMPLETE" as const, candidates: [] } };
const frontierFixture: FrontierDossier = { ...frontierContent, dossierDigest: sha256(canonicalJson(frontierContent)) };
const frontierAssessment = { sourceIds: ["test-source"], relevance: "RELEVANT" as const,
  quantifiers: "MATCH" as const, overlap: "NOT_SHOWN_IN_CAPTURED_SOURCES" as const,
  explanation: "The captured passage states the root question but does not settle the proposed bounded task." };

beforeEach(async () => {
  await truncateAll();
});

async function addReviewer(owner: Awaited<ReturnType<typeof asOwner>>) {
  const user = await createUser("math-reviewer");
  const workspace = await getDb().workspace.findUniqueOrThrow({ where: { id: owner.workspace.id } });
  await withOrganizationTenant(workspace.organizationId, owner.user.id, async (tx) => {
    const ownerOrgMembership = await tx.organizationMembership.findUniqueOrThrow({
      where: { organizationId_userId: { organizationId: workspace.organizationId, userId: owner.user.id } },
    });
    await tx.organizationMembership.create({
      data: { organizationId: workspace.organizationId, userId: user.id, role: "ADMIN", createdById: owner.user.id },
    });
    await tx.membership.create({
      data: { workspaceId: workspace.id, userId: user.id, role: "ADMIN", createdById: owner.user.id },
    });
    await tx.scopedGrant.create({
      data: {
        organizationId: workspace.organizationId,
        subjectType: "USER",
        subjectUserId: user.id,
        role: "ORG_ADMIN",
        effect: "ALLOW",
        scopeType: "ORGANIZATION",
        grantedByOrganizationMembershipId: ownerOrgMembership.id,
        reason: "Independent math pilot reviewer",
      },
    });
  });
  return contextForMembership(user, workspace.id);
}

function requestFor(missionId: string, mathPilot: MathPilotRequest, modelName = "research-v1") {
  const contract = resolveMathPilotContract(mathPilot);
  return {
    missionId,
    documentId: null,
    question: contract.statement,
    scope: mathPilotScope(contract),
    providerName: "test-research",
    modelName,
    sourcePolicy: { allowedDomains: [], primaryDomains: [], requirePrimary: false, maxSources: 5 },
    queryPlan: { queries: [contract.statement], languages: ["en"] },
    mathPilot,
    idempotencyKey: `math:${randomUUID()}`,
  };
}

const openRequest: MathPilotRequest = {
  caseType: "OPEN",
  statement: "Does property P hold for every object in class C?",
  definitions: "C and P are fixed in the attached Mission contract.",
  assumptions: "Use standard classical logic.",
  falsificationCriterion: "One member of C without P would refute the claim.",
  successCriterion: "A general proof or a checked counterexample.",
  exclusions: "Finite samples alone do not prove a universal statement.",
};

function verifiedChecklist() {
  return {
    version: 1 as const,
    independentVerification: true as const,
    checks: MATH_REVIEW_CRITERIA.map((criterion) => ({
      criterion,
      verdict: "VERIFIED" as const,
      note: `Test-only independent check of ${criterion}; not a live scientific attestation.`,
    })),
  };
}

describe("Math pilot gate", () => {
  it("closes both Codex-local calibrations through role-separated AI review without a second member", async () => {
    const owner = await asOwner(await createUser("math-ai-native-owner"));
    const workspace = await getDb().workspace.findUniqueOrThrow({ where: { id: owner.workspace.id } });
    const mission = await createMission(owner, { title: "Autonomous math calibration" });
    const usage = { inputTokens: 100, cachedInputTokens: 0, outputTokens: 50, reasoningOutputTokens: 10 };
    for (const caseType of ["CALIBRATION_PROOF", "CALIBRATION_COUNTEREXAMPLE"] as const) {
      const requested = await requestResearchRun(owner, {
        ...requestFor(mission.id, { caseType }, "gpt-6-sol"), providerName: "codex-local",
      });
      expect(requested.status).toBe("SUCCEEDED");
      const runId = String(requested.status === "SUCCEEDED" ? requested.outcome.runId : "");
      await dispatchOutboxBatch({ organizationId: workspace.organizationId, actorUserId: owner.user.id, workerId: "ai-dispatcher" });
      const [attemptJob] = await claimJobs({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
        workerId: "ai-worker", jobTypes: ["math-pilot.codex-local.execute"] });
      const argument = caseType === "CALIBRATION_PROOF"
        ? "Let n=2k for an integer k. Then n^2=4k^2=2(2k^2), so the square is even."
        : "The number 2 is prime because its positive divisors are 1 and 2, but 2 is not odd.";
      await executeResearchJob({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
        workerId: "ai-worker", jobId: attemptJob!.id, expectedVersion: attemptJob!.version,
        correlationId: owner.correlationId,
        provider: { providerName: "codex-local", modelName: "gpt-6-sol", async execute() {
          return { providerName: this.providerName, modelName: this.modelName, sources: [],
            findings: [{ key: "no-source", kind: "HONEST_NULL" as const, claim: "No external source was captured.",
              sourceKey: null, exactExcerpt: "", startOffset: null, endOffset: null, confidence: 0 }],
            mathAttempt: { providerName: "codex-local" as const, modelName: "gpt-6-sol", threadId: "attempt-thread",
              attemptType: caseType === "CALIBRATION_PROOF" ? "PROOF_ATTEMPT" as const : "COUNTEREXAMPLE_ATTEMPT" as const,
              argument, candidateCounterexample: caseType === "CALIBRATION_PROOF" ? null : "2",
              selfChecks: [], limitations: [], usage } };
        } },
      });
      const [pilotCase] = (await listMathPilotCases(owner, mission.id)).filter((item) => item.researchRunId === runId);
      expect(pilotCase.agentReviewJobStatus).toBe("PENDING");
      await dispatchOutboxBatch({ organizationId: workspace.organizationId, actorUserId: owner.user.id, workerId: "ai-dispatcher" });
      const [reviewJob] = await claimJobs({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
        workerId: "ai-worker", jobTypes: ["math-pilot.codex-local.review"] });
      await executeMathPilotAgentReviewJob({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
        workerId: "ai-worker", jobId: reviewJob!.id, expectedVersion: reviewJob!.version,
        correlationId: owner.correlationId,
        reviewer: { modelName: "gpt-6-sol", async review() {
          return (["CRITIC", "ADVERSARY"] as const).map((role) => ({
            role, verdict: "SUPPORTS" as const,
            candidateConclusion: caseType === "CALIBRATION_PROOF" ? "SUPPORTED_ARGUMENT" as const : "VALID_COUNTEREXAMPLE" as const,
            exactQuote: caseType === "CALIBRATION_PROOF" ? "n^2=4k^2" : "2 is prime",
            reasoning: "The argument was checked against the exact domain and the elementary witness is explicit.",
            checks: ["Checked the exact general witness or the smallest valid prime counterexample."],
            unresolvedGap: null, threadId: `${role}-fresh-thread`, usage,
          })) as Awaited<ReturnType<NonNullable<Parameters<typeof executeMathPilotAgentReviewJob>[0]["reviewer"]>["review"]>>;
        } },
      });
      const reviewed = (await listMathPilotCases(owner, mission.id)).find((item) => item.id === pilotCase.id)!;
      expect(reviewed.researchRun.status).toBe("AWAITING_REVIEW");
      expect(reviewed.agentReview).toMatchObject({ disposition: "AI_REVIEWED",
        conclusion: caseType === "CALIBRATION_PROOF" ? "SUPPORTED_ARGUMENT" : "VALID_COUNTEREXAMPLE" });
      const bundle = await getApprovedResearchBundle(owner, runId);
      expect(bundle.mathAssessment).toMatchObject({ reviewMethod: "AI" });
      if (caseType === "CALIBRATION_PROOF") {
        const document = await createAuthoringDocument(owner, {
          missionId: mission.id, title: "AI review trace", documentType: "RESEARCH_PROPOSAL", locale: "en",
        });
        await importApprovedResearchBundle(owner, { runId, documentId: document.id, locale: "en" });
        const authored = await getAuthoringDocument(owner, document.id);
        const body = authored.current?.content.sections.map((section) => section.body).join("\n") ?? "";
        expect(body).toContain("AI assessment, not a certified proof");
        expect(body).toContain(reviewed.agentReview!.ledgerDigest);
      }
      expect((await requestMathPilotAgentReview(owner, pilotCase.id)).status).toBe("FAILED");
      await expect(ownerQuery(`UPDATE math_pilot_agent_review SET disposition = 'INCONCLUSIVE' WHERE case_id = '${pilotCase.id}'`))
        .rejects.toThrow(/append-only|immutable/i);
    }
    const opened = await requestResearchRun(owner, {
      ...requestFor(mission.id, openRequest, "gpt-6-sol"), providerName: "codex-local",
    });
    expect(opened.status).toBe("SUCCEEDED");
    const openRunId = String(opened.status === "SUCCEEDED" ? opened.outcome.runId : "");
    await dispatchOutboxBatch({ organizationId: workspace.organizationId, actorUserId: owner.user.id, workerId: "cycle-dispatcher" });
    const [openJob] = await claimJobs({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
      workerId: "cycle-worker", jobTypes: ["math-pilot.codex-local.execute"] });
    const rootArgument = "Finite examples of property P have been checked, but the implication from class C to P remains unproved.";
    await executeResearchJob({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
      workerId: "cycle-worker", jobId: openJob!.id, expectedVersion: openJob!.version,
      correlationId: owner.correlationId,
      provider: { providerName: "codex-local", modelName: "gpt-6-sol", async execute() {
        return { providerName: this.providerName, modelName: this.modelName, sources: [],
          findings: [{ key: "no-source", kind: "HONEST_NULL" as const, claim: "No external mathematical source was captured.",
            sourceKey: null, exactExcerpt: "", startOffset: null, endOffset: null, confidence: 0 }],
          mathAttempt: { providerName: "codex-local" as const, modelName: "gpt-6-sol", threadId: "root-author",
            attemptType: "PARTIAL" as const, argument: rootArgument, candidateCounterexample: null,
            selfChecks: ["Only finite examples were checked."], limitations: ["The general implication is unproved."], usage } };
      } },
    });
    const rootCase = (await listMathPilotCases(owner, mission.id)).find((item) => item.researchRunId === openRunId)!;
    await dispatchOutboxBatch({ organizationId: workspace.organizationId, actorUserId: owner.user.id, workerId: "cycle-dispatcher" });
    const [rootReviewJob] = await claimJobs({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
      workerId: "cycle-worker", jobTypes: ["math-pilot.codex-local.review"] });
    const gap = "The implication from class C to property P has not been proved for arbitrary objects.";
    await executeMathPilotAgentReviewJob({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
      workerId: "cycle-worker", jobId: rootReviewJob!.id, expectedVersion: rootReviewJob!.version,
      correlationId: owner.correlationId, reviewer: { modelName: "gpt-6-sol", async review() {
        return (["CRITIC", "ADVERSARY"] as const).map((role) => ({ role,
          verdict: "CHALLENGES" as const, candidateConclusion: "PARTIAL" as const,
          exactQuote: "the implication from class C to P remains unproved",
          reasoning: "Finite instances do not establish the general implication for arbitrary members of class C.",
          checks: ["Compared the finite observations to the universally quantified root statement."],
          unresolvedGap: gap, threadId: `${role}-root`, usage,
        })) as Awaited<ReturnType<Parameters<typeof executeMathPilotAgentReviewJob>[0]["reviewer"]["review"]>>;
      } } });
    const requestedCycle = await requestMathResearchCycle(owner, { caseId: rootCase.id,
      maxRounds: 2, maxObservedTokens: 20_000 });
    expect(requestedCycle.status).toBe("SUCCEEDED");
    expect((await requestMathResearchCycle(owner, { caseId: rootCase.id, maxRounds: 2,
      maxObservedTokens: 20_000 })).commandId).toBe(requestedCycle.commandId);
    await expect(requestMathResearchCycle(owner, { caseId: rootCase.id, maxRounds: 1,
      maxObservedTokens: 60_000 })).rejects.toMatchObject({ code: "IDEMPOTENCY_CONFLICT" });
    await dispatchOutboxBatch({ organizationId: workspace.organizationId, actorUserId: owner.user.id, workerId: "cycle-dispatcher" });
    const [roundJob] = await claimJobs({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
      workerId: "cycle-worker", jobTypes: ["math-pilot.cycle.round"], leaseSeconds: 1800 });
    const task = "Check objects in class C of size at most four for a concrete failure of property P.";
    await executeMathResearchCycleRound({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
      workerId: "cycle-worker", jobId: roundJob!.id, expectedVersion: roundJob!.version,
      agents: { modelName: "gpt-6-sol",
        async buildFrontierDossier() { return frontierFixture; },
        async assessFrontier(role) { return { output: frontierAssessment, threadId: `${role}-child`, usage }; },
        async propose() { return { output: { sourceGap: gap,
          hypothesis: "Small objects may expose a concrete obstruction to property P.", taskStatement: task,
          falsificationPlan: "Find one object in class C of size at most four lacking property P.",
          successEvidence: "Produce a checked finite witness or say no witness was found at this bound.",
          rationale: "A bounded search may clarify the gap without asserting the universal root theorem." },
          threadId: "planner-child", usage }; },
        async verify(_root, _gaps, _prior, proposal) { return { output: { decision: "ACCEPT" as const,
          sourceGap: proposal.sourceGap, scopeCheck: "The task preserves the class C and property P definitions.",
          noveltyCheck: "The bounded task is distinct from the universal root statement.",
          falsifiabilityCheck: "A concrete finite object can refute this bounded claim.",
          unresolvedRisk: "A finite check cannot prove the universal root theorem." }, threadId: "verifier-child", usage }; },
        async solve() { return { providerName: "codex-local" as const, modelName: "gpt-6-sol", threadId: "solver-child",
          attemptType: "PARTIAL" as const, argument: "No obstruction was found among inspected objects, but coverage is not established.",
          candidateCounterexample: null, selfChecks: ["No general claim was inferred."],
          limitations: ["The bounded enumeration has no independent certificate."], usage }; },
        async reviewRole(role) { return { role, verdict: "CHALLENGES" as const,
          candidateConclusion: "PARTIAL" as const, exactQuote: "coverage is not established",
          reasoning: "The claimed inspection lacks an exhaustive certificate and cannot settle the root theorem.",
          checks: ["Checked the gap between inspected objects and all admissible objects."],
          unresolvedGap: "The bounded enumeration needs an independently checkable coverage certificate.",
          threadId: `${role}-child`, usage }; },
      },
    });
    let [cycle] = await listMathResearchCycles(owner, mission.id);
    expect(cycle).toMatchObject({ rootCaseId: rootCase.id, status: "QUEUED", stopReason: null,
      completedRounds: 1, callsStarted: 7, observedTokens: 1050 });
    expect(cycle.trace?.map((event) => event.phase)).toEqual([
      "PRIOR_ART", "CALL_STARTED", "PROPOSED", "FRONTIER_DOSSIER", "CALL_STARTED", "FRONTIER_REVIEWED",
      "CALL_STARTED", "FRONTIER_REVIEWED", "FRONTIER_GATE", "CALL_STARTED", "VERIFIED", "CALL_STARTED", "ATTEMPTED",
      "CALL_STARTED", "REVIEWED", "CALL_STARTED", "REVIEWED", "ROUND_CLOSED",
    ]);
    expect((await withOrganizationTenant(workspace.organizationId, owner.user.id, (tx) =>
      tx.durableJob.findUniqueOrThrow({ where: { id: roundJob!.id } }))).status).toBe("SUCCEEDED");
    await expect(ownerQuery(`UPDATE math_research_cycle SET root_contract_digest = '${"0".repeat(64)}' WHERE id = '${cycle.id}'`))
      .rejects.toThrow(/sealed fields are immutable/i);
    await expect(ownerQuery(`UPDATE math_research_cycle SET calls_started = 0 WHERE id = '${cycle.id}'`))
      .rejects.toThrow(/accounting is monotonic/i);
    await dispatchOutboxBatch({ organizationId: workspace.organizationId, actorUserId: owner.user.id, workerId: "cycle-dispatcher" });
    const [nextJob] = await claimJobs({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
      workerId: "cycle-worker", jobTypes: ["math-pilot.cycle.round"], leaseSeconds: 1800 });
    const nextGap = "The bounded enumeration needs an independently checkable coverage certificate.";
    let inappropriateSolveCalls = 0;
    await executeMathResearchCycleRound({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
      workerId: "cycle-worker", jobId: nextJob!.id, expectedVersion: nextJob!.version,
      agents: { modelName: "gpt-6-sol",
        async buildFrontierDossier() { return frontierFixture; },
        async assessFrontier(role) { return { output: frontierAssessment, threadId: `${role}-next`, usage }; },
        async propose() { return { output: { sourceGap: nextGap,
          hypothesis: "An automated enumeration might create a coverage certificate.",
          taskStatement: "Generate an exhaustive coverage certificate for objects in C of size at most four.",
          falsificationPlan: "Find an admissible object omitted by the proposed enumeration.",
          successEvidence: "A reproducible exhaustive list with an independently checked count is required.",
          rationale: "A certificate could close the preceding bounded-search review gap." },
          threadId: "planner-next", usage }; },
        async verify(_root, _gaps, _prior, proposal) { return { output: { decision: "REJECT" as const,
          sourceGap: proposal.sourceGap,
          scopeCheck: "The proposed task does not yet specify a sound enumeration algorithm.",
          noveltyCheck: "The proposal is distinct but insufficiently specified for execution.",
          falsifiabilityCheck: "An omitted object would be a falsifier, but coverage cannot be audited.",
          unresolvedRisk: "No independently checkable enumeration method has been supplied." },
          threadId: "verifier-next", usage }; },
        async solve() { inappropriateSolveCalls += 1; throw new Error("Rejected task must not run"); },
        async reviewRole() { throw new Error("Rejected task must not be reviewed"); },
      },
    });
    expect(inappropriateSolveCalls).toBe(0);
    [cycle] = await listMathResearchCycles(owner, mission.id);
    expect(cycle).toMatchObject({ status: "STOPPED", stopReason: "VERIFICATION_REJECTED",
      completedRounds: 1, callsStarted: 11, observedTokens: 1650 });
    expect(cycle.trace?.at(-1)).toMatchObject({ phase: "STOPPED", round: 2, reason: "VERIFICATION_REJECTED" });
    await expect(ownerQuery(`UPDATE math_research_cycle_event SET phase = 'CORRUPTED' WHERE cycle_id = '${cycle.id}'`))
      .rejects.toThrow(/append-only|immutable/i);
    await expect(ownerQuery(`UPDATE math_research_cycle SET status = 'QUEUED' WHERE id = '${cycle.id}'`))
      .rejects.toThrow(/terminal math research cycle is immutable/i);
  });

  it("routes Codex-local math to a distinct job and retains an unverified model attempt", async () => {
    const owner = await asOwner(await createUser("math-codex-owner"));
    const reviewer = await addReviewer(owner);
    const workspace = await getDb().workspace.findUniqueOrThrow({ where: { id: owner.workspace.id } });
    const mission = await createMission(owner, { title: "Local subscription bridge" });
    const requested = await requestResearchRun(owner, {
      ...requestFor(mission.id, { caseType: "CALIBRATION_PROOF" }, "gpt-6-sol"),
      providerName: "codex-local",
    });
    expect(requested.status).toBe("SUCCEEDED");
    const runId = String(requested.status === "SUCCEEDED" ? requested.outcome.runId : "");
    await dispatchOutboxBatch({ organizationId: workspace.organizationId, actorUserId: owner.user.id, workerId: "codex-dispatcher" });
    const [job] = await claimJobs({
      organizationId: workspace.organizationId, actorUserId: owner.user.id,
      workerId: "codex-worker", jobTypes: ["math-pilot.codex-local.execute"],
    });
    expect(job?.jobType).toBe("math-pilot.codex-local.execute");
    await executeResearchJob({
      organizationId: workspace.organizationId, actorUserId: owner.user.id,
      workerId: "codex-worker", jobId: job!.id, expectedVersion: job!.version,
      correlationId: owner.correlationId,
      provider: {
        providerName: "codex-local", modelName: "gpt-6-sol",
        async execute() {
          return {
            providerName: this.providerName, modelName: this.modelName,
            sources: [],
            findings: [{
              key: "no-external-source", kind: "HONEST_NULL" as const,
              claim: "The model attempt has no externally captured source span.",
              sourceKey: null, exactExcerpt: "", startOffset: null, endOffset: null, confidence: 0,
            }],
            mathAttempt: {
              providerName: "codex-local" as const, modelName: "gpt-6-sol", threadId: "test-thread",
              attemptType: "PROOF_ATTEMPT" as const,
              argument: "Let n=2k. Then n²=2(2k²), so it is even.",
              candidateCounterexample: null,
              selfChecks: ["2k² is an integer"], limitations: ["Not human verified"],
              usage: { inputTokens: 100, cachedInputTokens: 20, outputTokens: 40, reasoningOutputTokens: 10 },
            },
          };
        },
      },
    });
    const retained = await withOrganizationTenant(workspace.organizationId, owner.user.id, async (tx) => ({
      run: await tx.researchRun.findUniqueOrThrow({ where: { id: runId }, include: { findings: true } }),
      job: await tx.durableJob.findUniqueOrThrow({ where: { id: job!.id } }),
    }));
    expect(retained.run.status).toBe("AWAITING_REVIEW");
    expect(retained.run.mathModelAttempt).toMatchObject({ attemptType: "PROOF_ATTEMPT" });
    expect(retained.run.mathModelAttemptDigest).toMatch(/^[a-f0-9]{64}$/);
    expect(retained.job.result).toMatchObject({ mathModelAttemptDigest: retained.run.mathModelAttemptDigest });
    expect(await listMathPilotCases(owner, mission.id)).toHaveLength(1);
    await reviewResearchRun(reviewer, {
      runId, decision: "APPROVED", rationale: "The absence of external source evidence is explicitly recorded.",
      findings: [{ findingId: retained.run.findings[0]!.id, decision: "ACCEPTED", rationale: "Honest null checked." }],
    });
    const [pilotCase] = await listMathPilotCases(owner, mission.id);
    await expect(assessMathPilotCase(reviewer, {
      caseId: pilotCase.id, conclusion: "SUPPORTED_ARGUMENT",
      rationale: "Correct parity derivation.", verificationNotes: "Reworked the algebra.",
    })).rejects.toMatchObject({ code: "INVALID_INPUT" });
    await expect(assessMathPilotCase(reviewer, {
      caseId: pilotCase.id, conclusion: "SUPPORTED_ARGUMENT",
      rationale: "Correct parity derivation.", verificationNotes: "Reworked the algebra.",
      reviewChecklist: {
        ...verifiedChecklist(),
        checks: verifiedChecklist().checks.map((check, index) => index === 2 ? { ...check, verdict: "ISSUE_FOUND" } : check),
      },
    })).rejects.toMatchObject({ code: "INVALID_INPUT" });
    await assessMathPilotCase(reviewer, {
      caseId: pilotCase.id, conclusion: "SUPPORTED_ARGUMENT",
      rationale: "The algebra establishes the parity claim for any even integer.",
      verificationNotes: "Independently rewrote n=2k and confirmed 2k² is integral. Test-only reviewer, not live attestation.",
      reviewChecklist: verifiedChecklist(),
    });
    const recorded = (await listMathPilotCases(owner, mission.id))[0]?.assessment;
    expect(recorded?.conclusion).toBe("SUPPORTED_ARGUMENT");
    expect(recorded?.reviewChecklistDigest).toMatch(/^[a-f0-9]{64}$/);
    const document = await createAuthoringDocument(owner, {
      missionId: mission.id, title: "Math review trace", documentType: "RESEARCH_PROPOSAL", locale: "en",
    });
    await importApprovedResearchBundle(reviewer, { runId, documentId: document.id, locale: "en" });
    const authored = await getAuthoringDocument(reviewer, document.id);
    const importedBody = authored.current?.content.sections.map((section) => section.body).join("\n") ?? "";
    expect(importedBody).toContain("Mathematical review: SUPPORTED_ARGUMENT");
    expect(importedBody).toContain(recorded!.reviewChecklistDigest!);
    await expect(ownerQuery(`UPDATE math_pilot_assessment SET review_checklist_digest = '${"0".repeat(64)}' WHERE case_id = '${pilotCase.id}'`))
      .rejects.toThrow(/append-only|immutable/i);
    await expect(ownerQuery(`UPDATE research_run SET math_model_attempt = '{}'::jsonb WHERE id = '${runId}'`))
      .rejects.toThrow(/immutable/i);
  });

  it("rejects assessment when an OpenAI-shaped run has no verified provider usage", async () => {
    const owner = await asOwner(await createUser("math-accounting-owner"));
    const reviewer = await addReviewer(owner);
    const workspace = await getDb().workspace.findUniqueOrThrow({ where: { id: owner.workspace.id } });
    const mission = await createMission(owner, { title: "Accounting gate" });
    const requested = await requestResearchRun(owner, {
      ...requestFor(mission.id, { caseType: "CALIBRATION_PROOF" }, "gpt-5.6-sol"),
      providerName: "openai",
    });
    expect(requested.status).toBe("SUCCEEDED");
    const runId = String(requested.status === "SUCCEEDED" ? requested.outcome.runId : "");
    await dispatchOutboxBatch({ organizationId: workspace.organizationId, actorUserId: owner.user.id, workerId: "accounting-dispatcher" });
    const [job] = await claimJobs({
      organizationId: workspace.organizationId, actorUserId: owner.user.id,
      workerId: "accounting-worker", jobTypes: ["research.run.execute"],
    });
    expect(job).toBeDefined();
    const body = "If n=2k, then n squared equals 4k squared, which is even.";
    const excerpt = "n squared equals 4k squared";
    await executeResearchJob({
      organizationId: workspace.organizationId, actorUserId: owner.user.id,
      workerId: "accounting-worker", jobId: job!.id, expectedVersion: job!.version,
      correlationId: owner.correlationId,
      provider: {
        providerName: "openai", modelName: "gpt-5.6-sol",
        async execute() {
          return {
            providerName: this.providerName, modelName: this.modelName,
            sources: [{
              key: "s1", canonicalUri: "https://math.example/accounting", title: "Elementary mathematics",
              publisher: "Independent source", mediaType: "text/plain", content: body,
              contentDigest: sha256(body), sourceClass: "SECONDARY" as const,
              capturedAt: new Date("2026-09-28T00:00:00.000Z"),
            }],
            findings: [{
              key: "f1", kind: "SUPPORTING" as const, claim: body, sourceKey: "s1", exactExcerpt: excerpt,
              startOffset: body.indexOf(excerpt), endOffset: body.indexOf(excerpt) + excerpt.length,
              confidence: 0.9,
            }],
          };
        },
      },
    });
    const run = await withOrganizationTenant(workspace.organizationId, owner.user.id, (tx) =>
      tx.researchRun.findUniqueOrThrow({ where: { id: runId }, include: { findings: true } }),
    );
    await reviewResearchRun(reviewer, {
      runId, decision: "APPROVED", rationale: "Checked the exact excerpt independently.",
      findings: [{ findingId: run.findings[0]!.id, decision: "ACCEPTED", rationale: "Exact arithmetic excerpt verified." }],
    });
    const [pilotCase] = (await listMathPilotCases(owner, mission.id)).filter((item) => item.researchRunId === runId);
    await expect(assessMathPilotCase(reviewer, {
      caseId: pilotCase.id, conclusion: "SUPPORTED_ARGUMENT",
      rationale: "The parity argument is valid over all even integers.",
      verificationNotes: "Reworked the algebra independently; accounting remains missing.",
      reviewChecklist: verifiedChecklist(),
    })).rejects.toMatchObject({ code: "PROVIDER_ACCOUNTING_UNVERIFIED" });
    await expect(getApprovedResearchBundle(reviewer, runId)).rejects.toMatchObject({ code: "INVALID_TRANSITION" });
  });

  it("does not automatically retry a failed paid math-provider attempt", async () => {
    const owner = await asOwner(await createUser("math-no-retry-owner"));
    const workspace = await getDb().workspace.findUniqueOrThrow({ where: { id: owner.workspace.id } });
    const mission = await createMission(owner, { title: "No automatic replay" });
    const requested = await requestResearchRun(owner, requestFor(mission.id, { caseType: "CALIBRATION_PROOF" }));
    expect(requested.status).toBe("SUCCEEDED");
    const runId = String(requested.status === "SUCCEEDED" ? requested.outcome.runId : "");
    await dispatchOutboxBatch({ organizationId: workspace.organizationId, actorUserId: owner.user.id, workerId: "failure-dispatcher" });
    const [job] = await claimJobs({ organizationId: workspace.organizationId, actorUserId: owner.user.id, workerId: "failure-worker", jobTypes: ["research.run.execute"] });
    await expect(executeResearchJob({
      organizationId: workspace.organizationId, actorUserId: owner.user.id,
      workerId: "failure-worker", jobId: job!.id, expectedVersion: job!.version,
      correlationId: owner.correlationId,
      provider: {
        providerName: "test-research", modelName: "research-v1",
        async execute() {
          const dispatched = await withOrganizationTenant(workspace.organizationId, owner.user.id, (tx) =>
            tx.researchRun.findUniqueOrThrow({ where: { id: runId }, select: { providerDispatchAttemptedAt: true } }),
          );
          expect(dispatched.providerDispatchAttemptedAt).not.toBeNull();
          throw new Error("ambiguous provider timeout");
        },
      },
    })).rejects.toThrow("ambiguous provider timeout");
    const retained = await withOrganizationTenant(workspace.organizationId, owner.user.id, async (tx) => ({
      run: await tx.researchRun.findUniqueOrThrow({ where: { id: runId } }),
      job: await tx.durableJob.findUniqueOrThrow({ where: { id: job!.id } }),
    }));
    expect(retained.job.status).toBe("DEAD_LETTER");
    expect(retained.run.status).toBe("FAILED");
    expect(retained.run.providerDispatchAttemptedAt).not.toBeNull();
    await expect(ownerQuery(`UPDATE research_run SET provider_dispatch_attempted_at = NULL WHERE id = '${runId}'`))
      .rejects.toThrow(/immutable/i);
  });

  it("retains verified response usage before finishing a real-provider-shaped job", async () => {
    const owner = await asOwner(await createUser("math-usage-owner"));
    const workspace = await getDb().workspace.findUniqueOrThrow({ where: { id: owner.workspace.id } });
    const mission = await createMission(owner, { title: "Usage retention" });
    const requested = await requestResearchRun(owner, {
      ...requestFor(mission.id, { caseType: "CALIBRATION_PROOF" }, "gpt-5.6-sol"),
      providerName: "openai",
    });
    expect(requested.status).toBe("SUCCEEDED");
    const runId = String(requested.status === "SUCCEEDED" ? requested.outcome.runId : "");
    await dispatchOutboxBatch({ organizationId: workspace.organizationId, actorUserId: owner.user.id, workerId: "usage-dispatcher" });
    const [job] = await claimJobs({
      organizationId: workspace.organizationId, actorUserId: owner.user.id,
      workerId: "usage-worker", jobTypes: ["research.run.execute"],
    });
    expect(job).toBeDefined();
    const provider = new OpenAIResearchProvider({
      apiKey: "test-only",
      modelName: "gpt-5.6-sol",
      apiFetch: async () => new Response(JSON.stringify({
        id: "resp_usage_test", model: "gpt-5.6-sol", status: "completed",
        usage: { input_tokens: 100, output_tokens: 40, total_tokens: 140 },
        output: [{ type: "message", content: [{ type: "output_text", text: JSON.stringify({
          sources: [],
          findings: [{ key: "null", kind: "HONEST_NULL", claim: "No verifiable exact span found.", sourceUrl: null, exactExcerpt: "", confidence: 0 }],
        }) }] }],
      }), { status: 200 }),
      onUsage: async (usage) => {
        await withOrganizationTenant(workspace.organizationId, owner.user.id, (tx) =>
          tx.researchRun.update({ where: { id: runId }, data: { providerUsage: usage as Prisma.InputJsonValue } }),
        );
      },
    });
    await executeResearchJob({
      organizationId: workspace.organizationId, actorUserId: owner.user.id,
      workerId: "usage-worker", jobId: job!.id, expectedVersion: job!.version,
      correlationId: owner.correlationId, provider,
    });
    const retained = await withOrganizationTenant(workspace.organizationId, owner.user.id, async (tx) => ({
      run: await tx.researchRun.findUniqueOrThrow({ where: { id: runId } }),
      job: await tx.durableJob.findUniqueOrThrow({ where: { id: job!.id } }),
    }));
    expect(retained.run.providerUsage).toMatchObject({ responseId: "resp_usage_test", inputTokens: 100, outputTokens: 40 });
    expect(retained.job.result).toMatchObject({ providerUsage: { responseId: "resp_usage_test" } });
  });

  it("refuses a second active calibration request for the same Mission and model", async () => {
    const owner = await asOwner(await createUser("math-duplicate-owner"));
    const mission = await createMission(owner, { title: "Bounded calibration" });
    const first = await requestResearchRun(owner, requestFor(mission.id, { caseType: "CALIBRATION_PROOF" }));
    expect(first.status).toBe("SUCCEEDED");
    const second = await requestResearchRun(owner, requestFor(mission.id, { caseType: "CALIBRATION_PROOF" }));
    expect(second.status).toBe("FAILED");
    expect(await listMathPilotCases(owner, mission.id)).toHaveLength(1);
  });

  it("blocks an open case until both independently assessed calibrations pass for the same model", async () => {
    const owner = await asOwner(await createUser("math-owner"));
    const reviewer = await addReviewer(owner);
    const workspace = await getDb().workspace.findUniqueOrThrow({ where: { id: owner.workspace.id } });
    const mission = await createMission(owner, { title: "Mathematics pilot" });

    const tooEarly = await requestResearchRun(owner, requestFor(mission.id, openRequest));
    expect(tooEarly.status).toBe("FAILED");
    expect(await listMathPilotCases(owner, mission.id)).toHaveLength(0);

    for (const caseType of ["CALIBRATION_PROOF", "CALIBRATION_COUNTEREXAMPLE"] as const) {
      const requested = await requestResearchRun(owner, requestFor(mission.id, { caseType }));
      expect(requested.status).toBe("SUCCEEDED");
      const runId = String(requested.status === "SUCCEEDED" ? requested.outcome.runId : "");
      const [pilotCase] = (await listMathPilotCases(owner, mission.id)).filter((item) => item.researchRunId === runId);
      expect(pilotCase.contractDigest).toMatch(/^[a-f0-9]{64}$/);
      expect(pilotCase.contract).toMatchObject(MATH_PILOT_CALIBRATIONS[caseType]);

      await dispatchOutboxBatch({ organizationId: workspace.organizationId, actorUserId: owner.user.id, workerId: "math-dispatcher" });
      const [job] = await claimJobs({
        organizationId: workspace.organizationId,
        actorUserId: owner.user.id,
        workerId: "math-worker",
        jobTypes: ["research.run.execute"],
      });
      expect(job).toBeDefined();
      const body = caseType === "CALIBRATION_PROOF"
        ? "If n=2k, then n squared equals 4k squared, which is even."
        : "The number 2 is prime because its positive divisors are 1 and 2, and it is even.";
      const excerpt = caseType === "CALIBRATION_PROOF" ? "n squared equals 4k squared" : "The number 2 is prime";
      const provider: ResearchProvider = {
        providerName: "test-research",
        modelName: "research-v1",
        async execute(input) {
          expect(input.question).toBe(MATH_PILOT_CALIBRATIONS[caseType].statement);
          expect(input.scope).not.toContain("VALID_COUNTEREXAMPLE");
          const start = body.indexOf(excerpt);
          return {
            providerName: this.providerName,
            modelName: this.modelName,
            sources: [{
              key: "s1", canonicalUri: "https://math.example/lesson", title: "Elementary mathematics",
              publisher: "Independent source", mediaType: "text/plain", content: body,
              contentDigest: sha256(body), sourceClass: "SECONDARY", capturedAt: new Date("2026-09-28T00:00:00.000Z"),
            }],
            findings: [{
              key: "f1", kind: "SUPPORTING", claim: body, sourceKey: "s1", exactExcerpt: excerpt,
              startOffset: start, endOffset: start + excerpt.length, confidence: 0.9,
            }],
          };
        },
      };
      await executeResearchJob({
        organizationId: workspace.organizationId, actorUserId: owner.user.id,
        workerId: "math-worker", jobId: job!.id, expectedVersion: job!.version,
        correlationId: owner.correlationId, provider,
      });
      const run = await withOrganizationTenant(workspace.organizationId, owner.user.id, (tx) =>
        tx.researchRun.findUniqueOrThrow({ where: { id: runId }, include: { findings: true } }),
      );
      await reviewResearchRun(reviewer, {
        runId, decision: "APPROVED", rationale: "Source and exact excerpt checked independently.",
        findings: [{ findingId: run.findings[0]!.id, decision: "ACCEPTED", rationale: "Exact excerpt verified." }],
      });
      await expect(getApprovedResearchBundle(reviewer, runId)).rejects.toMatchObject({ code: "INVALID_TRANSITION" });
      const assessment = {
        caseId: pilotCase.id,
        conclusion: caseType === "CALIBRATION_PROOF" ? "SUPPORTED_ARGUMENT" : "VALID_COUNTEREXAMPLE",
        rationale: "The elementary argument was checked against the definitions.",
        verificationNotes: "Reworked the arithmetic and divisor check independently; this is a human classification, not a formal certificate.",
        reviewChecklist: verifiedChecklist(),
      } as const;
      await expect(assessMathPilotCase(owner, assessment)).rejects.toMatchObject({ code: "SEPARATION_OF_DUTIES" });
      await assessMathPilotCase(reviewer, assessment);
      const approved = await getApprovedResearchBundle(reviewer, runId);
      expect(approved.digest).toMatch(/^[a-f0-9]{64}$/);
      expect(approved.mathAssessment).toMatchObject({
        conclusion: assessment.conclusion,
        reviewChecklistDigest: expect.stringMatching(/^[a-f0-9]{64}$/),
      });
      await expect(assessMathPilotCase(reviewer, assessment)).rejects.toMatchObject({ code: "INVALID_TRANSITION" });
    }

    const wrongModel = await requestResearchRun(owner, requestFor(mission.id, openRequest, "other-model"));
    expect(wrongModel.status).toBe("FAILED");
    const opened = await requestResearchRun(owner, requestFor(mission.id, openRequest));
    expect(opened.status).toBe("SUCCEEDED");
    const cases = await listMathPilotCases(owner, mission.id);
    expect(cases).toHaveLength(3);
    expect(cases[0].caseType).toBe("OPEN");

    await expect(ownerQuery(`UPDATE math_pilot_case SET contract = '{}'::jsonb WHERE id = '${cases[0].id}'`))
      .rejects.toThrow(/append-only/i);
    await expect(ownerQuery(`UPDATE research_run SET question = 'changed' WHERE id = '${cases[0].researchRunId}'`))
      .rejects.toThrow(/immutable/i);
  });
});
