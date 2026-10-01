import { randomUUID } from "node:crypto";

import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Prisma } from "@prisma/client";

import { createAuthoringDocument, getAuthoringDocument, importApprovedResearchBundle } from "@/modules/authoring";
import { claimJobs, dispatchOutboxBatch } from "@/modules/command-runtime";
import { createMission } from "@/modules/mission-kernel";
import { canonicalJson } from "@/modules/execution-fabric/contracts";
import type { FrontierDossier } from "@/modules/research-sandbox/math-frontier";
import { validateMixedCoreAgentEvidence } from "@/modules/research-sandbox/math-mixed-core-agent";
import * as mixedCoreAgent from "@/modules/research-sandbox/math-mixed-core-agent";
import { lemmaDraft } from "../fixtures/math-lemma-graph";

vi.mock("@/modules/research-sandbox/math-method-map", async (original) => {
  const actual = await original<typeof import("@/modules/research-sandbox/math-method-map")>();
  return { ...actual, buildResearchMethodPacket: (root: Parameters<typeof actual.buildResearchMethodPacket>[0], digest: string) =>
    actual.buildResearchMethodPacket(root, digest, { statusLoader: async () => { throw new Error("offline integration fixture"); } }) };
});
import { executeMathPilotAgentReviewJob } from "@/modules/research-sandbox/agent-review-kernel";
import {
  assessMathPilotCase,
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
  it("schedules a sealed portfolio across two independently checked rejected branches", async () => {
    const owner = await asOwner(await createUser("math-portfolio-owner"));
    const workspace = await getDb().workspace.findUniqueOrThrow({ where: { id: owner.workspace.id } });
    const mission = await createMission(owner, { title: "Portfolio cycle admission" });
    const usage = { inputTokens: 100, cachedInputTokens: 0, outputTokens: 50, reasoningOutputTokens: 10 };
    for (const caseType of ["CALIBRATION_PROOF", "CALIBRATION_COUNTEREXAMPLE"] as const) {
      const calibration = await requestResearchRun(owner, { ...requestFor(mission.id, { caseType }, "gpt-6-sol"),
        providerName: "codex-local" });
      expect(calibration.status).toBe("SUCCEEDED");
      await dispatchOutboxBatch({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
        workerId: "portfolio-dispatcher" });
      const [calibrationJob] = await claimJobs({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
        workerId: "portfolio-worker", jobTypes: ["math-pilot.codex-local.execute"] });
      const argument = caseType === "CALIBRATION_PROOF"
        ? "Let n=2k. Then n^2=4k^2=2(2k^2), which is even."
        : "The number 2 is prime, since its only positive divisors are 1 and 2, but 2 is not odd.";
      await executeResearchJob({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
        workerId: "portfolio-worker", jobId: calibrationJob!.id, expectedVersion: calibrationJob!.version,
        correlationId: owner.correlationId,
        provider: { providerName: "codex-local", modelName: "gpt-6-sol", async execute() {
          return { providerName: this.providerName, modelName: this.modelName, sources: [],
            findings: [{ key: "no-source", kind: "HONEST_NULL" as const, claim: "No external source captured.",
              sourceKey: null, exactExcerpt: "", startOffset: null, endOffset: null, confidence: 0 }],
            mathAttempt: { providerName: "codex-local" as const, modelName: "gpt-6-sol", threadId: "portfolio-calibration",
              attemptType: caseType === "CALIBRATION_PROOF" ? "PROOF_ATTEMPT" as const : "COUNTEREXAMPLE_ATTEMPT" as const,
              argument, candidateCounterexample: caseType === "CALIBRATION_PROOF" ? null : "2",
              selfChecks: [], limitations: [], usage } };
        } },
      });
      await dispatchOutboxBatch({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
        workerId: "portfolio-dispatcher" });
      const [calibrationReviewJob] = await claimJobs({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
        workerId: "portfolio-worker", jobTypes: ["math-pilot.codex-local.review"] });
      await executeMathPilotAgentReviewJob({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
        workerId: "portfolio-worker", jobId: calibrationReviewJob!.id, expectedVersion: calibrationReviewJob!.version,
        correlationId: owner.correlationId, reviewer: { modelName: "gpt-6-sol", async review() {
          return (["CRITIC", "ADVERSARY"] as const).map((role) => ({ role,
            verdict: "SUPPORTS" as const,
            candidateConclusion: caseType === "CALIBRATION_PROOF" ? "SUPPORTED_ARGUMENT" as const : "VALID_COUNTEREXAMPLE" as const,
            exactQuote: caseType === "CALIBRATION_PROOF" ? "n^2=4k^2" : "2 is prime",
            reasoning: "The exact elementary derivation or counterexample was checked.",
            checks: ["Checked the exact quantifier and explicit witness."], unresolvedGap: null,
            threadId: `${role}-portfolio-calibration`, usage,
          })) as Awaited<ReturnType<Parameters<typeof executeMathPilotAgentReviewJob>[0]["reviewer"]["review"]>>;
        } } });
    }
    const requested = await requestResearchRun(owner, {
      ...requestFor(mission.id, openRequest, "gpt-6-sol"), providerName: "codex-local",
    });
    expect(requested.status).toBe("SUCCEEDED");
    const runId = String(requested.status === "SUCCEEDED" ? requested.outcome.runId : "");
    await dispatchOutboxBatch({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
      workerId: "portfolio-dispatcher" });
    const [attemptJob] = await claimJobs({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
      workerId: "portfolio-worker", jobTypes: ["math-pilot.codex-local.execute"] });
    await executeResearchJob({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
      workerId: "portfolio-worker", jobId: attemptJob!.id, expectedVersion: attemptJob!.version,
      correlationId: owner.correlationId,
      provider: { providerName: "codex-local", modelName: "gpt-6-sol", async execute() {
        return { providerName: this.providerName, modelName: this.modelName, sources: [],
          findings: [{ key: "no-source", kind: "HONEST_NULL" as const, claim: "No external source captured.",
            sourceKey: null, exactExcerpt: "", startOffset: null, endOffset: null, confidence: 0 }],
          mathAttempt: { providerName: "codex-local" as const, modelName: "gpt-6-sol", threadId: "portfolio-root",
            attemptType: "PARTIAL" as const, argument: "Finite examples do not prove the universal implication.",
            candidateCounterexample: null, selfChecks: [], limitations: ["General case unresolved."], usage } };
      } },
    });
    const rootCase = (await listMathPilotCases(owner, mission.id)).find((item) => item.researchRunId === runId)!;
    await dispatchOutboxBatch({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
      workerId: "portfolio-dispatcher" });
    const [reviewJob] = await claimJobs({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
      workerId: "portfolio-worker", jobTypes: ["math-pilot.codex-local.review"] });
    const gap = "The universal implication from class C to P remains unproved.";
    await executeMathPilotAgentReviewJob({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
      workerId: "portfolio-worker", jobId: reviewJob!.id, expectedVersion: reviewJob!.version,
      correlationId: owner.correlationId, reviewer: { modelName: "gpt-6-sol", async review() {
        return (["CRITIC", "ADVERSARY"] as const).map((role) => ({ role,
          verdict: "CHALLENGES" as const, candidateConclusion: "PARTIAL" as const,
          exactQuote: "Finite examples do not prove the universal implication",
          reasoning: "The statement is universal and finite inspection does not establish it.",
          checks: ["Quantified root statement checked."], unresolvedGap: gap,
          threadId: `portfolio-root-${role}`, usage,
        })) as Awaited<ReturnType<Parameters<typeof executeMathPilotAgentReviewJob>[0]["reviewer"]["review"]>>;
      } } });
    const request = await requestMathResearchCycle(owner, { caseId: rootCase.id,
      maxRounds: 2, maxObservedTokens: 20_000 });
    expect(request.status).toBe("SUCCEEDED");
    const proposalBase = { sourceGap: gap,
      falsificationPlan: "Find one admissible object that fails the proposed condition.",
      successEvidence: "A checked counterexample or an independently verified conditional argument.",
      rationale: "This line probes the unresolved implication without claiming to solve the root problem.",
      exactSurveyPlan: null, structuralProbePlan: null };
    const branches = [
      { strategy: "STRUCTURAL_LEMMA" as const, proposal: { ...proposalBase,
        hypothesis: "Every admissible object in a defined subclass has a necessary invariant for P.",
        taskStatement: "Derive a necessary invariant for property P in a defined subclass of C." },
        anticipatedFalsifier: "An admissible object in the subclass violating the invariant.",
        expectedInformationGain: "HIGH" as const, toolNeeds: ["SOURCE_REVIEW" as const] },
      { strategy: "FORMALIZATION" as const, proposal: { ...proposalBase,
        hypothesis: "A formal statement of the class C axioms may expose a missing premise for P.",
        taskStatement: "Formalize the class C axioms and identify the missing premise for P." },
        anticipatedFalsifier: "A model of the axioms that contradicts the proposed premise.",
        expectedInformationGain: "MEDIUM" as const, toolNeeds: ["SOURCE_REVIEW" as const] },
    ];
    let portfolioCalls = 0;
    let verifierCalls = 0;
    const agents = { modelName: "gpt-6-sol",
      async proposePortfolio() { portfolioCalls += 1; return { output: { branches },
        threadId: "portfolio-planner", usage }; },
      async propose(): Promise<never> { throw new Error("Linear planner must not run"); },
      async buildFrontierDossier() { return frontierFixture; },
      async assessFrontier(role: "SOURCE_ANALYST" | "SOURCE_CHALLENGER") {
        return { output: frontierAssessment, threadId: `${role}-${verifierCalls}`, usage };
      },
      async verify(_root: unknown, _gaps: string[], _prior: string[], proposal: { sourceGap: string }) {
        verifierCalls += 1;
        expect(_gaps).toContain(gap);
        return { output: { decision: "REJECT" as const, sourceGap: proposal.sourceGap,
          scopeCheck: "The task has not specified a complete formal domain.",
          noveltyCheck: "Not established by the partial source capture.",
          falsifiabilityCheck: "A candidate falsifier was stated but not certified.",
          unresolvedRisk: "Independent verification rejected this branch." },
          threadId: `portfolio-verifier-${verifierCalls}`, usage };
      },
      async solve(): Promise<never> { throw new Error("Rejected branch must not reach solver"); },
      async reviewRole(): Promise<never> { throw new Error("Rejected branch must not reach review"); },
    };
    for (const round of [1, 2]) {
      await dispatchOutboxBatch({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
        workerId: "portfolio-dispatcher" });
      const [roundJob] = await claimJobs({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
        workerId: "portfolio-worker", jobTypes: ["math-pilot.cycle.round"], leaseSeconds: 1800 });
      expect(roundJob).toBeDefined();
      await executeMathResearchCycleRound({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
        workerId: "portfolio-worker", jobId: roundJob!.id, expectedVersion: roundJob!.version, agents });
      const [cycle] = await listMathResearchCycles(owner, mission.id);
      expect(cycle.trace).not.toBeNull();
      expect(cycle.completedRounds).toBe(round);
      expect(cycle.trace?.filter((event) => event.phase === "PORTFOLIO_PLANNED")).toHaveLength(1);
      expect(cycle.trace?.filter((event) => event.phase === "BRANCH_CLOSED")).toHaveLength(round);
      expect(cycle.status).toBe(round === 1 ? "QUEUED" : "STOPPED");
    }
    const [cycle] = await listMathResearchCycles(owner, mission.id);
    expect(portfolioCalls).toBe(1);
    expect(verifierCalls).toBe(2);
    expect(cycle.stopReason).toBe("VERIFICATION_REJECTED");
    expect(cycle.trace?.find((event) => event.phase === "PORTFOLIO_EXHAUSTED"))
      .toMatchObject({ branches: [{ state: "PRUNED" }, { state: "PRUNED" }] });
  });
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
      expect(reviewed.agentReview?.ledger).toMatchObject({ version: 3,
        reviewerModels: [{ role: "CRITIC", requestedModelName: "gpt-6-sol" },
          { role: "ADVERSARY", requestedModelName: "gpt-6-sol" }] });
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
        async verify(_root, _gaps, _prior, proposal, _priorArt, _steering, _findings, sourceAssessments) {
          expect(sourceAssessments).toHaveLength(2);
          return { output: { decision: "ACCEPT" as const,
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
      "CALL_STARTED", "FRONTIER_REVIEWED", "FRONTIER_GATE", "CALL_STARTED", "VERIFIED", "CALL_STARTED", "ATTEMPTED", "CERTIFICATE_CHECKED",
      "CALL_STARTED", "REVIEWED", "CALL_STARTED", "REVIEWED", "ROUND_CLOSED",
    ]);
    expect(cycle.trace?.filter((event) => event.phase === "REVIEWED")).toEqual([
      expect.objectContaining({ role: "CRITIC", reviewerModel: expect.objectContaining({
        identityEvidence: "REQUESTED_CLI_MODEL", requestedModelName: "gpt-6-sol" }) }),
      expect.objectContaining({ role: "ADVERSARY", reviewerModel: expect.objectContaining({
        identityEvidence: "REQUESTED_CLI_MODEL", requestedModelName: "gpt-6-sol" }) }),
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

    const erdosRequest: MathPilotRequest = {
      caseType: "OPEN",
      statement: "For every prime p ≡ 1 (mod 840), does 4/p = 1/x + 1/y + 1/z hold?",
      definitions: "p is prime. x,y,z are strictly positive integers.",
      assumptions: "Exact integer and rational arithmetic applies.",
      falsificationCriterion: "A certified prime counterexample would refute the statement.",
      successCriterion: "A general proof or checked counterexample is required.",
      exclusions: "Finite surveys cannot prove the universal statement.",
    };
    const erdosRun = await requestResearchRun(owner, {
      ...requestFor(mission.id, erdosRequest, "gpt-6-sol"), providerName: "codex-local",
    });
    expect(erdosRun.status).toBe("SUCCEEDED");
    const erdosRunId = String(erdosRun.status === "SUCCEEDED" ? erdosRun.outcome.runId : "");
    await dispatchOutboxBatch({ organizationId: workspace.organizationId, actorUserId: owner.user.id, workerId: "cycle-dispatcher" });
    const [erdosJob] = await claimJobs({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
      workerId: "cycle-worker", jobTypes: ["math-pilot.codex-local.execute"] });
    await executeResearchJob({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
      workerId: "cycle-worker", jobId: erdosJob!.id, expectedVersion: erdosJob!.version,
      correlationId: owner.correlationId,
      provider: { providerName: "codex-local", modelName: "gpt-6-sol", async execute() {
        return { providerName: this.providerName, modelName: this.modelName, sources: [],
          findings: [{ key: "no-source", kind: "HONEST_NULL" as const, claim: "No source captured in this fixture.",
            sourceKey: null, exactExcerpt: "", startOffset: null, endOffset: null, confidence: 0 }],
          mathAttempt: { providerName: "codex-local" as const, modelName: "gpt-6-sol", threadId: "erdos-root",
            attemptType: "PARTIAL" as const, argument: "The first two denominator gates do not settle every prime in the residual class.",
            candidateCounterexample: null, selfChecks: [], limitations: ["No universal proof."], usage } };
      } },
    });
    const erdosCase = (await listMathPilotCases(owner, mission.id)).find((item) => item.researchRunId === erdosRunId)!;
    await dispatchOutboxBatch({ organizationId: workspace.organizationId, actorUserId: owner.user.id, workerId: "cycle-dispatcher" });
    const [erdosReviewJob] = await claimJobs({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
      workerId: "cycle-worker", jobTypes: ["math-pilot.codex-local.review"] });
    const erdosGap = "The first two denominator gates leave a residual prime class without a general proof.";
    await executeMathPilotAgentReviewJob({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
      workerId: "cycle-worker", jobId: erdosReviewJob!.id, expectedVersion: erdosReviewJob!.version,
      correlationId: owner.correlationId, reviewer: { modelName: "gpt-6-sol", async review() {
        return (["CRITIC", "ADVERSARY"] as const).map((role) => ({ role,
          verdict: "CHALLENGES" as const, candidateConclusion: "PARTIAL" as const,
          exactQuote: "do not settle every prime", reasoning: "The claim is universal, but the attempt covers only two gates.",
          checks: ["Compared finite gates to the original universal quantifier."], unresolvedGap: erdosGap,
          threadId: `${role}-erdos`, usage,
        })) as Awaited<ReturnType<Parameters<typeof executeMathPilotAgentReviewJob>[0]["reviewer"]["review"]>>;
      } } });
    await expect(requestMathResearchCycle(owner, { caseId: erdosCase.id, maxRounds: 1,
      maxObservedTokens: 60_000, steering: { focus: "STRUCTURAL_LEMMA", targetA: 11,
        note: "Seek a conditional lemma.", confirmed: false } })).rejects.toMatchObject({ code: "INVALID_INPUT" });
    const steered = await requestMathResearchCycle(owner, { caseId: erdosCase.id, maxRounds: 1,
      maxObservedTokens: 60_000, steering: { focus: "STRUCTURAL_LEMMA", targetA: 11,
        note: "Seek a conditional lemma.", confirmed: true } });
    expect(steered.status).toBe("SUCCEEDED");
    if (steered.status === "SUCCEEDED") expect(steered.outcome).toMatchObject({ strategyPolicy: {
      policyId: "ADAPTIVE_RESEARCH_V1", rootContractDigest: erdosCase.contractDigest,
    } });
    expect(await requestMathResearchCycle(owner, { caseId: erdosCase.id, maxRounds: 1,
      maxObservedTokens: 60_000, steering: { focus: "STRUCTURAL_LEMMA", targetA: 15,
        note: "Change target while active.", confirmed: true } })).toMatchObject({ status: "FAILED" });
    const noSource = { coverage: "PARTIAL_NOT_NOVELTY_CERTIFICATE" as const, sources: [],
      discovery: { provider: "CROSSREF" as const, query: "residual prime gate", status: "UNAVAILABLE" as const, candidates: [] } };
    const noSourceDossier: FrontierDossier = { ...noSource, dossierDigest: sha256(canonicalJson(noSource)) };
    await dispatchOutboxBatch({ organizationId: workspace.organizationId, actorUserId: owner.user.id, workerId: "cycle-dispatcher" });
    const [steeredJob] = await claimJobs({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
      workerId: "cycle-worker", jobTypes: ["math-pilot.cycle.round"], leaseSeconds: 1800 });
    const firstTask = "For every prime p≡1 (mod 840) with A=3 and A=7 obstructed, establish or refute a later-gate criterion at A=11.";
    await executeMathResearchCycleRound({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
      workerId: "cycle-worker", jobId: steeredJob!.id, expectedVersion: steeredJob!.version,
      agents: { modelName: "gpt-6-sol",
        async propose(_root, _gaps, _tasks, _priorArt, steering) {
          expect(steering).toMatchObject({ focus: "STRUCTURAL_LEMMA", targetA: 11, approvedByUserId: owner.user.id });
          return { output: { sourceGap: erdosGap,
            hypothesis: "For prime p≡1 (mod 840), A=3 and A=7 obstructions might imply a test at A=11.",
            taskStatement: firstTask, falsificationPlan: "Find a prime contradicting the precise conditional criterion.",
            successEvidence: "Give a proof or an exact counterexample to the conditional lemma.",
            rationale: "The later gate may explain the residual class without claiming the root theorem." },
          threadId: "steered-planner-11", usage };
        },
        async buildFrontierDossier() { return noSourceDossier; },
        async assessFrontier() { throw new Error("No source means frontier reviewers must not run"); },
        async verify() { throw new Error("Source hold must stop before task verification"); },
        async solve() { throw new Error("Source hold must stop before solving"); },
        async reviewRole() { throw new Error("Source hold must stop before peer review"); },
      },
    });
    const firstSteered = (await listMathResearchCycles(owner, mission.id)).find((item) => item.rootCaseId === erdosCase.id)!;
    expect(firstSteered).toMatchObject({ status: "STOPPED", stopReason: "FRONTIER_HOLD" });
    expect(firstSteered.trace?.[0]).toMatchObject({ phase: "ADAPTIVE_POLICY_DECLARED" });
    expect(firstSteered.trace?.find((event) => event.phase === "HUMAN_STEERED")).toMatchObject({ steering: { targetA: 11 } });
    expect(firstSteered.trace?.find((event) => event.phase === "RESEARCH_METHOD_MAP")).toMatchObject({
      packet: { rootDigest: erdosCase.contractDigest, corpusCoverage: "PARTIAL_CURATED_NOT_EXHAUSTIVE" } });
    const nextSteered = await requestMathResearchCycle(owner, { caseId: erdosCase.id, maxRounds: 1,
      maxObservedTokens: 60_000, steering: { focus: "STRUCTURAL_LEMMA", targetA: 15,
        note: "Move to the next gate after reviewing the hold.", confirmed: true } });
    expect(nextSteered.status).toBe("SUCCEEDED");
    const erdosCycles = (await listMathResearchCycles(owner, mission.id)).filter((item) => item.rootCaseId === erdosCase.id);
    expect(erdosCycles).toHaveLength(2);
    expect(erdosCycles[0]).toMatchObject({ status: "QUEUED" });
    expect(erdosCycles[1]!.trace?.find((event) => event.phase === "HUMAN_STEERED")).toMatchObject({ steering: { targetA: 11 } });
    await dispatchOutboxBatch({ organizationId: workspace.organizationId, actorUserId: owner.user.id, workerId: "cycle-dispatcher" });
    const [secondSteeredJob] = await claimJobs({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
      workerId: "cycle-worker", jobTypes: ["math-pilot.cycle.round"], leaseSeconds: 1800 });
    await executeMathResearchCycleRound({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
      workerId: "cycle-worker", jobId: secondSteeredJob!.id, expectedVersion: secondSteeredJob!.version,
      agents: { modelName: "gpt-6-sol",
        async propose(_root, _gaps, previousTasks, _priorArt, steering) {
          expect(previousTasks).toContain(firstTask);
          expect(steering).toMatchObject({ focus: "STRUCTURAL_LEMMA", targetA: 15 });
          return { output: { sourceGap: erdosGap,
            hypothesis: "For prime p≡1 (mod 840), A=3 and A=7 obstructions might still permit an A=15 gate.",
            taskStatement: "For every prime p≡1 (mod 840) with A=3 and A=7 obstructed, establish or refute a later-gate criterion at A=15.",
            falsificationPlan: "Find a prime contradicting the precise conditional criterion.",
            successEvidence: "Give a proof or exact counterexample to the conditional lemma.",
            rationale: "This follows the human's new gate without treating the prior hold as a theorem." },
          threadId: "steered-planner-15", usage };
        },
        async buildFrontierDossier() { return noSourceDossier; },
        async assessFrontier() { throw new Error("No source means frontier reviewers must not run"); },
        async verify() { throw new Error("Source hold must stop before task verification"); },
        async solve() { throw new Error("Source hold must stop before solving"); },
        async reviewRole() { throw new Error("Source hold must stop before peer review"); },
      },
    });
    expect((await listMathResearchCycles(owner, mission.id)).filter((item) => item.rootCaseId === erdosCase.id)
      .map((item) => item.status)).toEqual(["STOPPED", "STOPPED"]);

    const replayCampaign = await requestMathResearchCycle(owner, { caseId: erdosCase.id, maxRounds: 1,
      maxObservedTokens: 60_000, steering: { focus: "STRUCTURAL_LEMMA", targetA: 11,
        note: "Test the distinct square-gate conditional at p=131041 with typed replay before review.", confirmed: true } });
    expect(replayCampaign.status).toBe("SUCCEEDED");
    await dispatchOutboxBatch({ organizationId: workspace.organizationId, actorUserId: owner.user.id, workerId: "cycle-dispatcher" });
    const [replayJob] = await claimJobs({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
      workerId: "cycle-worker", jobTypes: ["math-pilot.cycle.round"], leaseSeconds: 1800 });
    let replaySeenByReviewers = 0;
    const mixedDigests: string[] = [];
    await executeMathResearchCycleRound({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
      workerId: "cycle-worker", jobId: replayJob!.id, expectedVersion: replayJob!.version,
      agents: { modelName: "gpt-6-sol",
        async propose(_root, _gaps, _tasks, _prior, _steering, _findings, _dossier, _obligations, mixed) {
          expect(validateMixedCoreAgentEvidence(mixed, erdosCase.contractDigest)).toBe(true);
          expect(mixed?.replay.status).toBe("PASS");
          expect(mixed?.method).toBe("ERDOS_STRAUS_MIXED_CORE_AGENT_EVIDENCE_V3");
          if (mixed?.method === "ERDOS_STRAUS_MIXED_CORE_AGENT_EVIDENCE_V3") {
            expect(mixed.kernel.replay.status).toBe("PASS");
            expect(mixed.power.replay).toMatchObject({ status: "PASS",
              primaryDigest: "0077816c13c6f6ff6fbb490d220396a63cc92f07e0e9bde24a316b5077ee85a9",
              outputDigest: "0077816c13c6f6ff6fbb490d220396a63cc92f07e0e9bde24a316b5077ee85a9" });
            expect(mixed.kernel.packet.rows.find((row) => row.m === 132840)).toMatchObject({
              sIsPrime: true, knownRelationBound: 527, residueCount: 525 });
          }
          mixedDigests.push(mixed!.evidenceDigest);
          const retained = await withOrganizationTenant(workspace.organizationId, owner.user.id,
            (tx) => tx.mathResearchCycleEvent.findMany({
              where: { jobId: replayJob!.id }, orderBy: { sequence: "asc" } }));
          expect(retained.map((event) => event.phase).indexOf("MIXED_CORE_EVIDENCE")).toBeLessThan(
            retained.map((event) => event.phase).indexOf("CALL_STARTED"));
          return { output: { sourceGap: erdosGap,
          hypothesis: "For prime p≡1 (mod 840), the square and A=3/A=7 obstructions may force A=11 to succeed.",
          taskStatement: "For prime p≡1 (mod 840), at A=11 refute the square plus A=3/A=7 obstruction implication at p=131041.",
          falsificationPlan: "Check primality and every fixed first-denominator gate through A=11.",
          successEvidence: "An independently replayed typed prime/A exclusion plus review of the square premise.",
          rationale: "A concrete falsifier tests the new conditional, not the original equation." },
          threadId: "replay-planner", usage }; },
        async buildFrontierDossier() { return frontierFixture; },
        async assessFrontier(role, _root, _proposal, _dossier, mixed) {
          mixedDigests.push(mixed!.evidenceDigest);
          return { output: frontierAssessment, threadId: `${role}-replay-source`, usage };
        },
        async verify(_root, _gaps, _prior, proposal, _art, _steering, _findings, _assessments, _dossier, _probe, _obligations, mixed) {
          mixedDigests.push(mixed!.evidenceDigest);
          return { output: { decision: "ACCEPT" as const,
          sourceGap: proposal.sourceGap, scopeCheck: "The proposed falsifier is narrower than the prime root.",
          noveltyCheck: "No novelty is inferred from a partial source capture.",
          falsifiabilityCheck: "The concrete prime and fixed A=11 exclusion can be replayed.",
          unresolvedRisk: "The replay does not decide unrestricted Erdős–Straus." },
          threadId: "replay-verifier", usage }; },
        async solve(_contract, _proposal, _computation, _gate, mixed) {
          mixedDigests.push(mixed!.evidenceDigest);
          return { providerName: "codex-local" as const, modelName: "gpt-6-sol",
          threadId: "replay-solver", attemptType: "COUNTEREXAMPLE_ATTEMPT" as const,
          argument: "p=131041 refutes the auxiliary A=11 implication, not the root conjecture.",
          candidateCounterexample: "p=131041", erdosStrausGateCounterexample: { prime: 131_041, failedThroughA: 11 },
          selfChecks: ["Check the square premise separately."], limitations: ["Only the fixed-A family is excluded."], usage }; },
        async reviewRole(role, _contract, _attempt, _computation, _replay, counterexampleReplay, _dossier, mixed) {
          mixedDigests.push(mixed!.evidenceDigest);
          expect(counterexampleReplay).toMatchObject({ status: "PASS", candidate: { prime: 131_041, failedThroughA: 11 } });
          replaySeenByReviewers += 1;
          return { role, verdict: "CHALLENGES" as const, candidateConclusion: "PARTIAL" as const,
            exactQuote: "p=131041 refutes the auxiliary A=11 implication",
            reasoning: "The independent tool certifies bounded gate failure; the exact lemma premise needs separate review.",
            checks: ["Inspected the typed independent replay before assigning a conclusion."],
            unresolvedGap: "Find a different structural relation beyond A=11.", threadId: `${role}-replay`, usage };
        },
      },
    });
    expect(replaySeenByReviewers).toBe(2);
    expect(mixedDigests).toHaveLength(7);
    expect(new Set(mixedDigests).size).toBe(1);
    const replayCycle = (await listMathResearchCycles(owner, mission.id))
      .find((item) => item.rootCaseId === erdosCase.id && item.trace?.some((event) => event.phase === "COUNTEREXAMPLE_REPLAY"));
    expect(replayCycle?.trace?.map((event) => event.phase).indexOf("COUNTEREXAMPLE_REPLAY")).toBeLessThan(
      replayCycle!.trace!.map((event) => event.phase).indexOf("REVIEWED"));
    expect(replayCycle?.trace?.find((event) => event.phase === "COUNTEREXAMPLE_REPLAY"))
      .toMatchObject({ phase: "COUNTEREXAMPLE_REPLAY", report: { status: "PASS" } });

    const rejectedCampaign = await requestMathResearchCycle(owner, { caseId: erdosCase.id, maxRounds: 1,
      maxObservedTokens: 60_000, steering: { focus: "STRUCTURAL_LEMMA", targetA: 23,
        note: "Replay p=131041/A=11 first, then reject a false A=23 exclusion.", confirmed: true,
        replayCandidate: { prime: 131_041, failedThroughA: 11 } } });
    expect(rejectedCampaign.status).toBe("SUCCEEDED");
    await dispatchOutboxBatch({ organizationId: workspace.organizationId, actorUserId: owner.user.id, workerId: "cycle-dispatcher" });
    const [rejectedJob] = await claimJobs({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
      workerId: "cycle-worker", jobTypes: ["math-pilot.cycle.round"], leaseSeconds: 1800 });
    let invalidCandidateReviews = 0;
    await executeMathResearchCycleRound({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
      workerId: "cycle-worker", jobId: rejectedJob!.id, expectedVersion: rejectedJob!.version,
      agents: { modelName: "gpt-6-sol",
        async propose(_root, _gaps, _prior, _priorArt, _steering, priorFindings) {
          expect(priorFindings?.[0]).toMatchObject({ prime: 131_041, failedThroughA: 11,
            structuralFacts: { a3Square: true, a3NoPrime2Mod3: true, a7NoDivisor5Mod7: true } });
          return { output: { sourceGap: "Find a different structural relation beyond A=11.",
          hypothesis: "For prime p≡1 (mod 840), obstructions at A=3, A=7, A=11, A=15 and A=19 may control A=23.",
          taskStatement: "For prime p≡1 (mod 840) surviving A=3, A=7, A=11, A=15 and A=19, test a distinct cross-gate criterion at A=23.",
          falsificationPlan: "Find a typed prime and exhaust every gate through A=23.",
          successEvidence: "A replayed bounded exclusion is required before review.",
          rationale: "The claim is distinct from the rejected A=11 square lemma." },
          threadId: "reject-planner", usage }; },
        async buildFrontierDossier() { return frontierFixture; },
        async assessFrontier(role) { return { output: frontierAssessment, threadId: `${role}-reject-source`, usage }; },
        async verify(_root, _gaps, _prior, proposal) { return { output: { decision: "ACCEPT" as const,
          sourceGap: proposal.sourceGap, scopeCheck: "The test preserves the prime-residual root.",
          noveltyCheck: "The captured passages do not certify novelty.",
          falsifiabilityCheck: "The proposed A=23 failure is a concrete arithmetic claim.",
          unresolvedRisk: "A bounded failure would not refute the unrestricted conjecture." },
          threadId: "reject-verifier", usage }; },
        async solve() { return { providerName: "codex-local" as const, modelName: "gpt-6-sol",
          threadId: "reject-solver", attemptType: "COUNTEREXAMPLE_ATTEMPT" as const,
          argument: "The model incorrectly asserts that p=131041 fails through A=23.",
          candidateCounterexample: "p=131041", erdosStrausGateCounterexample: { prime: 131_041, failedThroughA: 23 },
          selfChecks: [], limitations: ["The fixed-A family is the only scope."], usage }; },
        async reviewRole() { invalidCandidateReviews += 1; throw new Error("Invalid certificate must stop before AI review"); },
      },
    });
    expect(invalidCandidateReviews).toBe(0);
    const rejectedCycle = (await listMathResearchCycles(owner, mission.id))
      .find((item) => item.rootCaseId === erdosCase.id && item.stopReason === "COUNTEREXAMPLE_REJECTED");
    expect(rejectedCycle?.trace?.find((event) => event.phase === "COUNTEREXAMPLE_REPLAY"))
      .toMatchObject({ phase: "COUNTEREXAMPLE_REPLAY", report: { status: "FAIL" } });
    expect(rejectedCycle?.trace?.find((event) => event.phase === "PRIOR_COUNTEREXAMPLE_REPLAY"))
      .toMatchObject({ phase: "PRIOR_COUNTEREXAMPLE_REPLAY", report: { status: "PASS" } });
    expect(rejectedCycle!.trace!.map((event) => event.phase).indexOf("PRIOR_COUNTEREXAMPLE_REPLAY"))
      .toBeLessThan(rejectedCycle!.trace!.map((event) => event.phase).indexOf("PROPOSED"));
    expect(rejectedCycle?.trace?.some((event) => event.phase === "REVIEWED")).toBe(false);

    const badSeedCampaign = await requestMathResearchCycle(owner, { caseId: erdosCase.id, maxRounds: 1,
      maxObservedTokens: 60_000, steering: { focus: "STRUCTURAL_LEMMA", targetA: 27,
        note: "A bad prior seed must be rejected before any AI planner call.", confirmed: true,
        replayCandidate: { prime: 131_041, failedThroughA: 23 } } });
    expect(badSeedCampaign.status).toBe("SUCCEEDED");
    await dispatchOutboxBatch({ organizationId: workspace.organizationId, actorUserId: owner.user.id, workerId: "cycle-dispatcher" });
    const [badSeedJob] = await claimJobs({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
      workerId: "cycle-worker", jobTypes: ["math-pilot.cycle.round"], leaseSeconds: 1800 });
    await executeMathResearchCycleRound({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
      workerId: "cycle-worker", jobId: badSeedJob!.id, expectedVersion: badSeedJob!.version,
      agents: { modelName: "gpt-6-sol",
        async propose() { throw new Error("A false seed must stop before planner dispatch"); },
        async buildFrontierDossier() { throw new Error("A false seed must stop before source discovery"); },
        async assessFrontier() { throw new Error("A false seed must stop before source review"); },
        async verify() { throw new Error("A false seed must stop before task verification"); },
        async solve() { throw new Error("A false seed must stop before solver dispatch"); },
        async reviewRole() { throw new Error("A false seed must stop before peer review"); },
      },
    });
    const badSeedCycle = (await listMathResearchCycles(owner, mission.id))
      .find((item) => item.rootCaseId === erdosCase.id && item.trace?.some((event) =>
        event.phase === "HUMAN_STEERED" && event.steering.targetA === 27));
    expect(badSeedCycle).toMatchObject({ status: "STOPPED", stopReason: "COUNTEREXAMPLE_REJECTED" });
    expect(badSeedCycle?.trace?.find((event) => event.phase === "PRIOR_COUNTEREXAMPLE_REPLAY"))
      .toMatchObject({ phase: "PRIOR_COUNTEREXAMPLE_REPLAY", report: { status: "FAIL" } });
    expect(badSeedCycle?.trace?.some((event) => event.phase === "CALL_STARTED")).toBe(false);

    const probedCampaign = await requestMathResearchCycle(owner, { caseId: erdosCase.id, maxRounds: 1,
      maxObservedTokens: 60_000, steering: { focus: "STRUCTURAL_LEMMA", targetA: 23,
        note: "Falsify the typed A=23 residue implication before task acceptance.", confirmed: true } });
    expect(probedCampaign.status).toBe("SUCCEEDED");
    await dispatchOutboxBatch({ organizationId: workspace.organizationId, actorUserId: owner.user.id, workerId: "cycle-dispatcher" });
    const [probedJob] = await claimJobs({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
      workerId: "cycle-worker", jobTypes: ["math-pilot.cycle.round"], leaseSeconds: 1800 });
    let probedBaselineCalls = 0;
    await executeMathResearchCycleRound({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
      workerId: "cycle-worker", jobId: probedJob!.id, expectedVersion: probedJob!.version,
      agents: { modelName: "gpt-6-sol",
        async propose(_root, gaps) { return { output: { sourceGap: gaps[0]!,
          hypothesis: "For prime p≡1 (mod 840), if A=3, A=7, A=11, A=15, A=19 and A=23 all fail, then p≡4 (mod 23).",
          taskStatement: "For prime p≡1 (mod 840), test the A=3, A=7, A=11, A=15, A=19, A=23 failure implication p≡4 (mod 23) at A=23.",
          falsificationPlan: "Find a prime surviving A=23 with residue other than four modulo 23.",
          successEvidence: "A general proof of the exact implication would be required.",
          rationale: "The typed predicate makes a specific cross-gate implication falsifiable before solver dispatch.",
          exactSurveyPlan: null,
          structuralProbePlan: { kind: "FAILED_GATE_FORCES_PRIME_RESIDUE" as const,
            targetA: 23, failedThroughA: 23, upperInclusive: 4_037_881,
            expectedPrimeResidue: 4, divisorConditions: [], nonmultipleConditions: [] } },
          threadId: "probe-planner", usage }; },
        // New policy needs one offline baseline before the planner can generate
        // a predicate. Refutation must still block every subsequent source role.
        async buildFrontierDossier() { probedBaselineCalls += 1; return frontierFixture; },
        async assessFrontier() { throw new Error("Refuted hypothesis must stop before source calls"); },
        async verify() { throw new Error("Refuted hypothesis must stop before task verifier"); },
        async solve() { throw new Error("Refuted hypothesis must stop before solver"); },
        async reviewRole() { throw new Error("Refuted hypothesis must stop before AI review"); },
      },
    });
    const probedCycle = (await listMathResearchCycles(owner, mission.id))
      .find((item) => item.rootCaseId === erdosCase.id && item.stopReason === "STRUCTURAL_REFUTED");
    expect(probedCycle?.trace?.find((event) => event.phase === "STRUCTURAL_PROBED"))
      .toMatchObject({ phase: "STRUCTURAL_PROBED", report: { status: "REFUTED",
        independentReplay: { status: "PASS" } } });
    expect(probedCycle?.trace?.filter((event) => event.phase === "CALL_STARTED")).toHaveLength(1);
    expect(probedBaselineCalls).toBe(1);
    expect(probedCycle?.trace?.filter((event) => event.phase === "RESEARCH_FRONTIER_BASELINE")).toHaveLength(1);
    expect(probedCycle?.trace?.filter((event) => event.phase === "CALL_STARTED")).toMatchObject([{ role: "PLANNER" }]);
    expect(probedCycle?.trace?.some((event) => ["FRONTIER_DOSSIER", "FRONTIER_REVIEWED", "FRONTIER_GATE",
      "VERIFIED", "ATTEMPTED", "REVIEWED"].includes(event.phase))).toBe(false);

    const mixedCampaign = await requestMathResearchCycle(owner, { caseId: erdosCase.id, maxRounds: 1,
      maxObservedTokens: 60_000, steering: { focus: "STRUCTURAL_LEMMA", targetA: 23,
        note: "Reject prime-modulus occupancy equality using retained V3 evidence, not model opinion.", confirmed: true } });
    expect(mixedCampaign.status).toBe("SUCCEEDED");
    await dispatchOutboxBatch({ organizationId: workspace.organizationId, actorUserId: owner.user.id, workerId: "cycle-dispatcher" });
    const [mixedJob] = await claimJobs({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
      workerId: "cycle-worker", jobTypes: ["math-pilot.cycle.round"], leaseSeconds: 1800 });
    let mixedBaselineCalls = 0;
    await executeMathResearchCycleRound({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
      workerId: "cycle-worker", jobId: mixedJob!.id, expectedVersion: mixedJob!.version,
      agents: { modelName: "gpt-6-sol",
        async propose(_root, gaps, _tasks, _art, _steering, _findings, _gate, _obligations, mixed) {
          expect(validateMixedCoreAgentEvidence(mixed, erdosCase.contractDigest)).toBe(true);
          return { output: { sourceGap: gaps[0]!,
            hypothesis: "The known-relation bound is exact for every prime modulus s=4m-1.",
            taskStatement: "At A=23, prove that the normalized known-relation bound is exact for every prime modulus s=4m-1.",
            falsificationPlan: "Inspect m=132840/s=531359 in the independently replayed kernel packet.",
            successEvidence: "A general occupancy theorem with prime quantifiers, not a bounded scan.",
            rationale: "This fixture deliberately asserts an exactly registered false statement to test pre-dispatch rejection.",
            mixedCoreClaim: "KNOWN_RELATION_BOUND_IS_EXACT_FOR_EVERY_PRIME_MODULUS" as const },
            threadId: "mixed-planner", usage };
        },
        async buildFrontierDossier() { mixedBaselineCalls += 1; return frontierFixture; },
        async assessFrontier() { throw new Error("Mixed-core refutation must precede source calls"); },
        async verify() { throw new Error("Mixed-core refutation must precede verifier"); },
        async solve() { throw new Error("Mixed-core refutation must precede solver"); },
        async reviewRole() { throw new Error("Mixed-core refutation must precede review"); },
      } });
    const mixedCycle = (await listMathResearchCycles(owner, mission.id)).find((item) =>
      item.events.some((event) => event.jobId === mixedJob!.id));
    expect(mixedCycle?.trace?.map((event) => event.phase)).toContain("MIXED_CORE_CLAIM_REFUTED");
    expect(mixedCycle?.trace?.find((event) => event.phase === "MIXED_CORE_CLAIM_REFUTED"))
      .toMatchObject({ claim: "KNOWN_RELATION_BOUND_IS_EXACT_FOR_EVERY_PRIME_MODULUS" });
    expect(mixedCycle?.stopReason).toBe("STRUCTURAL_REFUTED");
    expect(mixedCycle?.trace?.filter((event) => event.phase === "CALL_STARTED")).toHaveLength(1);
    expect(mixedBaselineCalls).toBe(1);
    expect(mixedCycle?.trace?.filter((event) => event.phase === "RESEARCH_FRONTIER_BASELINE")).toHaveLength(1);
    expect(mixedCycle?.trace?.filter((event) => event.phase === "CALL_STARTED")).toMatchObject([{ role: "PLANNER" }]);
    expect(mixedCycle?.trace?.some((event) => ["FRONTIER_DOSSIER", "FRONTIER_REVIEWED", "FRONTIER_GATE",
      "VERIFIED", "ATTEMPTED", "REVIEWED"].includes(event.phase))).toBe(false);
    expect(mixedCycle?.trace?.find((event) => event.phase === "MIXED_CORE_EVIDENCE"))
      .toMatchObject({ evidence: { method: "ERDOS_STRAUS_MIXED_CORE_AGENT_EVIDENCE_V3",
        rootContractDigest: erdosCase.contractDigest, replay: { status: "PASS" }, kernel: { replay: { status: "PASS" } },
        power: { replay: { status: "PASS", primaryDigest: "0077816c13c6f6ff6fbb490d220396a63cc92f07e0e9bde24a316b5077ee85a9",
          outputDigest: "0077816c13c6f6ff6fbb490d220396a63cc92f07e0e9bde24a316b5077ee85a9" } } } });

    // Fault injection into the replay boundary, not an LLM/provider simulation.
    const retainedMixed = mixedCycle!.trace!.find((event) => event.phase === "MIXED_CORE_EVIDENCE")!.evidence;
    const { evidenceDigest: _retainedDigest, ...retainedBody } = retainedMixed;
    void _retainedDigest;
    const failedBody = { ...retainedBody, replay: { ...retainedMixed.replay, status: "UNAVAILABLE" as const, outputDigest: null } };
    const unavailable = { ...failedBody, evidenceDigest: sha256(canonicalJson(failedBody)) };
    expect(retainedMixed.method).toBe("ERDOS_STRAUS_MIXED_CORE_AGENT_EVIDENCE_V3");
    if (retainedMixed.method !== "ERDOS_STRAUS_MIXED_CORE_AGENT_EVIDENCE_V3") throw new Error("Missing V3 fixture");
    const kernelFailures = (["MISMATCH", "UNAVAILABLE"] as const).map((status) => {
      const failed = { ...retainedBody, kernel: { ...retainedMixed.kernel,
        replay: { ...retainedMixed.kernel.replay, status,
          outputDigest: status === "UNAVAILABLE" ? null : "b".repeat(64) } } };
      return mixedCoreAgent.mixedCoreAgentEvidenceSchema.parse({ ...failed, evidenceDigest: sha256(canonicalJson(failed)) });
    });
    const powerFailures = (["MISMATCH", "UNAVAILABLE", "PARTIAL"] as const).map((status) => {
      const failed = { ...retainedBody, power: { ...retainedMixed.power,
        packet: status === "PARTIAL" ? null : retainedMixed.power.packet,
        failure: status === "PARTIAL" ? "CHECKER_PARTIAL" as const : "REPLAY_FAILED" as const,
        replay: { ...retainedMixed.power.replay, status,
          primaryDigest: status === "PARTIAL" ? sha256("TEST_ONLY_ATTEMPTED_PARTIAL_G_PREFIX_NOT_COMPLETE")
            : retainedMixed.power.replay.primaryDigest,
          scriptDigest: status === "MISMATCH" ? retainedMixed.power.replay.scriptDigest : null,
          outputDigest: status === "MISMATCH" ? "b".repeat(64) : null } } };
      return mixedCoreAgent.mixedCoreAgentEvidenceSchema.parse({ ...failed, evidenceDigest: sha256(canonicalJson(failed)) });
    });
    for (const fault of [unavailable, ...kernelFailures, ...powerFailures]) {
      const replayFault = vi.spyOn(mixedCoreAgent, "runMixedCoreAgentEvidence").mockResolvedValue(fault);
      try {
        const held = await requestMathResearchCycle(owner, { caseId: erdosCase.id, maxRounds: 1,
          maxObservedTokens: 60_000, steering: { focus: "STRUCTURAL_LEMMA", targetA: 23,
            note: "Verify fail-closed retention when independent mixed-core replay is unavailable.", confirmed: true } });
        expect(held.status).toBe("SUCCEEDED");
        await dispatchOutboxBatch({ organizationId: workspace.organizationId, actorUserId: owner.user.id, workerId: "cycle-dispatcher" });
        const [heldJob] = await claimJobs({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
          workerId: "cycle-worker", jobTypes: ["math-pilot.cycle.round"], leaseSeconds: 1800 });
        const forbidden = async () => { throw new Error("Unavailable replay must block every model call"); };
        await executeMathResearchCycleRound({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
          workerId: "cycle-worker", jobId: heldJob!.id, expectedVersion: heldJob!.version,
          agents: { modelName: "gpt-6-sol", propose: forbidden, verify: forbidden, solve: forbidden,
            reviewRole: forbidden, buildFrontierDossier: forbidden, assessFrontier: forbidden } });
        const heldCycle = (await listMathResearchCycles(owner, mission.id)).find((item) =>
          item.events.some((event) => event.jobId === heldJob!.id));
        expect(heldCycle?.stopReason).toBe("INTEGRITY_FAILURE");
        expect(heldCycle?.trace?.some((event) => event.phase === "CALL_STARTED")).toBe(false);
        expect(heldCycle?.trace?.find((event) => event.phase === "MIXED_CORE_EVIDENCE")?.evidence).toEqual(fault);
      } finally { replayFault.mockRestore(); }
    }

    // Fresh autonomous requests require policy V2/portfolio V3, unlike the
    // intentionally historical-compatible human-steered fixtures above.
    // A root with prior cycles intentionally cannot start an unsteered cycle.
    // Do not bypass that gate merely to test the new graph policy.
    const blockedAutonomous = await requestMathResearchCycle(owner, { caseId: erdosCase.id, maxRounds: 1, maxObservedTokens: 60_000 });
    expect(blockedAutonomous, "Prior cycles must retain the unsteered admission fence").toMatchObject({ status: "FAILED", errorCode: "COMMAND_FAILED" });
    const graphRoot = await requestResearchRun(owner, {
      ...requestFor(mission.id, erdosRequest, "gpt-6-sol"), providerName: "codex-local",
    });
    expect(graphRoot, JSON.stringify(graphRoot)).toMatchObject({ status: "SUCCEEDED" });
    const graphRunId = String(graphRoot.status === "SUCCEEDED" ? graphRoot.outcome.runId : "");
    await dispatchOutboxBatch({ organizationId: workspace.organizationId, actorUserId: owner.user.id, workerId: "cycle-dispatcher" });
    const [graphRootJob] = await claimJobs({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
      workerId: "cycle-worker", jobTypes: ["math-pilot.codex-local.execute"] });
    await executeResearchJob({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
      workerId: "cycle-worker", jobId: graphRootJob!.id, expectedVersion: graphRootJob!.version,
      correlationId: owner.correlationId,
      provider: { providerName: "codex-local", modelName: "gpt-6-sol", async execute() {
        return { providerName: this.providerName, modelName: this.modelName, sources: [],
          findings: [{ key: "no-source", kind: "HONEST_NULL" as const, claim: "No source captured in this graph fixture.",
            sourceKey: null, exactExcerpt: "", startOffset: null, endOffset: null, confidence: 0 }],
          mathAttempt: { providerName: "codex-local" as const, modelName: "gpt-6-sol", threadId: "graph-root",
            attemptType: "PARTIAL" as const, argument: "The first two denominator gates do not settle every prime in the residual class.",
            candidateCounterexample: null, selfChecks: [], limitations: ["No universal proof."], usage } };
      } },
    });
    const graphCase = (await listMathPilotCases(owner, mission.id)).find((item) => item.researchRunId === graphRunId)!;
    expect(graphCase.id).not.toBe(erdosCase.id);
    expect(graphCase.contractDigest).toBe(erdosCase.contractDigest);
    await dispatchOutboxBatch({ organizationId: workspace.organizationId, actorUserId: owner.user.id, workerId: "cycle-dispatcher" });
    const [graphRootReviewJob] = await claimJobs({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
      workerId: "cycle-worker", jobTypes: ["math-pilot.codex-local.review"] });
    await executeMathPilotAgentReviewJob({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
      workerId: "cycle-worker", jobId: graphRootReviewJob!.id, expectedVersion: graphRootReviewJob!.version,
      correlationId: owner.correlationId, reviewer: { modelName: "gpt-6-sol", async review() {
        return (["CRITIC", "ADVERSARY"] as const).map((role) => ({ role,
          verdict: "CHALLENGES" as const, candidateConclusion: "PARTIAL" as const,
          exactQuote: "do not settle every prime", reasoning: "The claim is universal, but the attempt covers only two gates.",
          checks: ["Compared finite gates to the original universal quantifier."], unresolvedGap: erdosGap,
          threadId: `${role}-graph-root`, usage,
        })) as Awaited<ReturnType<Parameters<typeof executeMathPilotAgentReviewJob>[0]["reviewer"]["review"]>>;
      } } });
    const autonomous = await requestMathResearchCycle(owner, { caseId: graphCase.id, maxRounds: 1, maxObservedTokens: 60_000 });
    expect(autonomous, JSON.stringify(autonomous)).toMatchObject({ status: "SUCCEEDED" });
    if (autonomous.status === "SUCCEEDED") expect(autonomous.outcome).toMatchObject({ strategyPolicy: { policyId: "ADAPTIVE_RESEARCH_V2" } });
    await dispatchOutboxBatch({ organizationId: workspace.organizationId, actorUserId: owner.user.id, workerId: "cycle-dispatcher" });
    const [graphJob] = await claimJobs({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
      workerId: "cycle-worker", jobTypes: ["math-pilot.cycle.round"], leaseSeconds: 1800 });
    const graphBindings: string[] = [];
    const graphProposal = { sourceGap: erdosGap,
      hypothesis: "An unproved support-sensitive structural invariant may connect the entire residual prime domain to a construction.",
      taskStatement: "Investigate a support-sensitive structural implication for every prime p congruent to 1 modulo 840 in the exact sealed root domain.",
      falsificationPlan: "Find a complete premise instance violating the proposed support-sensitive condition.",
      successEvidence: "A scoped independently scrutinized argument, with every missing assumption retained.",
      rationale: "This fixture tests a declared root bridge, not a finite survey or a claim of theorem success.",
      exactSurveyPlan: null, structuralProbePlan: null, mixedCoreClaim: null };
    const graphBranch = { strategy: "STRUCTURAL_LEMMA", proposal: graphProposal,
      anticipatedFalsifier: "A complete premise instance fails the proposed support-sensitive conclusion.", expectedInformationGain: "HIGH",
      toolNeeds: ["SOURCE_REVIEW"], methodId: "SUPPORT_UNIFORM_BRIDGE", methodFamily: "GLOBAL_BRIDGE",
      rootContribution: { kind: "ROOT_BRIDGE", statement: "Propose an explicit missing implication toward the sealed universal root." },
      applicabilityAssumptions: "Every support assumption remains a proposed mathematical premise, not a fact.",
      discriminatingExperiment: { question: "Can an exact support invariant bridge the residual prime domain?",
        supportOutcome: "Retain a candidate argument for independent scrutiny, not theorem acceptance.",
        refutationOutcome: "Retire only the exact checked predicate and preserve unmatched prose uncertainty.",
        inconclusiveOutcome: "Record the unproved bridge and route later to another method family." },
      requiredTools: ["PROOF_ATTEMPT"], evaluationScope: "UNVALIDATED_RESEARCH", lemmaGraph: lemmaDraft(graphProposal.hypothesis) };
    await executeMathResearchCycleRound({ organizationId: workspace.organizationId, actorUserId: owner.user.id,
      workerId: "cycle-worker", jobId: graphJob!.id, expectedVersion: graphJob!.version,
      agents: { modelName: "gpt-6-sol",
        async proposePortfolio(_root, _gaps, _tasks, _art, _findings, _dossier, _obligations, _mixed, strategy) {
          expect(strategy?.policyId).toBe("ADAPTIVE_RESEARCH_V2");
          return { output: { version: 3, branches: [graphBranch, { ...graphBranch,
            methodId: "TAO_LOCAL_OBSTRUCTION", methodFamily: "LOCAL_OBSTRUCTION",
            proposal: { ...graphProposal, hypothesis: "A separate local structural obstruction may expose the unproved support assumption." } }] },
          threadId: "graph-planner", usage };
        },
        async propose() { throw new Error("Autonomous graph portfolio must not fall into unstructured proposal"); },
        async buildFrontierDossier() { return frontierFixture; },
        async assessFrontier(role, _root, _proposal, _dossier, _mixed, strategy) {
          expect(strategy?.lemmaGraph?.rootContractDigest).toBe(graphCase.contractDigest);
          graphBindings.push(strategy!.lemmaGraph!.graphDigest);
          return { output: frontierAssessment, threadId: `graph-${role}`, usage };
        },
        async verify(_root, _gaps, _prior, proposal, _art, _steering, _findings, _assessments, _dossier, _probe, _obligations, _mixed, strategy) {
          graphBindings.push(strategy!.lemmaGraph!.graphDigest);
          return { output: { decision: "ACCEPT", sourceGap: proposal.sourceGap,
            scopeCheck: "The proposed scope keeps the root quantifiers while its implication remains unproved.",
            noveltyCheck: "Literature novelty remains unestablished; only bounded exploratory permission is given.",
            falsifiabilityCheck: "A complete premise instance could distinguish the proposed invariant.",
            unresolvedRisk: "All graph edges and mathematical premises still need independent proof." }, threadId: "graph-verifier", usage };
        },
        async solve(_contract, _evidence, _replay, _dossier, _mixed, strategy) {
          graphBindings.push(strategy!.lemmaGraph!.graphDigest);
          return { providerName: "codex-local", modelName: "gpt-6-sol", threadId: "graph-solver", attemptType: "INCONCLUSIVE",
            argument: "The universal structural implication remains unproved; this is a bounded software fixture.",
            candidateCounterexample: null, selfChecks: [], limitations: ["No root theorem has been established."], usage };
        },
        async reviewRole(role, _contract, attempt, _evidence, _replay, _counterexample, _dossier, _mixed, strategy) {
          graphBindings.push(strategy!.lemmaGraph!.graphDigest);
          return { role, verdict: "INCONCLUSIVE", candidateConclusion: "INCONCLUSIVE", exactQuote: attempt.argument,
            reasoning: "The graph retains an unproved universal structural bridge; no finite observation or AI agreement closes it.",
            checks: ["The claimed graph implication still lacks independent semantic alignment."], unresolvedGap: erdosGap, threadId: `graph-${role}`, usage };
        },
      } });
    expect(graphBindings).toHaveLength(6); expect(new Set(graphBindings).size).toBe(1);
    const graphCycle = (await listMathResearchCycles(owner, mission.id)).find((item) => item.events.some((event) => event.jobId === graphJob!.id));
    expect(graphCycle).toMatchObject({ callsStarted: 7, stopReason: "ROUND_LIMIT", completedRounds: 1 });
    expect(graphCycle?.trace?.find((event) => event.phase === "PORTFOLIO_PLANNED")?.portfolio.version).toBe(3);
    expect(graphCycle?.trace?.find((event) => event.phase === "ROUND_CLOSED")).toMatchObject({ disposition: "INCONCLUSIVE" });

    // An AI-reviewed OPEN dossier remains AWAITING_REVIEW for the separate human
    // lane. A terminal cycle must not prevent a fresh, immutable root experiment.
    const nextRoot = await requestResearchRun(owner, {
      ...requestFor(mission.id, openRequest, "gpt-6-sol"), providerName: "codex-local",
    });
    expect(nextRoot.status).toBe("SUCCEEDED");
    // The new queued root still fences concurrent duplicate dispatches.
    const concurrentRoot = await requestResearchRun(owner, {
      ...requestFor(mission.id, openRequest, "gpt-6-sol"), providerName: "codex-local",
    });
    expect(concurrentRoot.status).toBe("FAILED");
  }, 180_000);

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
        async execute(input) {
          expect(input.mathPilot).toEqual({ caseType: "CALIBRATION_PROOF" });
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
    const benchmarkTooEarly = await requestResearchRun(owner, requestFor(mission.id, { caseType: "BENCHMARK_PROOF" }));
    expect(benchmarkTooEarly.status).toBe("FAILED");
    expect((await requestResearchRun(owner, requestFor(mission.id, { caseType: "BENCHMARK_EXACT" }))).status).toBe("FAILED");
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
    const benchmark = await requestResearchRun(owner, requestFor(mission.id, { caseType: "BENCHMARK_PROOF" }));
    expect(benchmark.status, JSON.stringify(benchmark)).toBe("SUCCEEDED");
    const benchmarkCase = (await listMathPilotCases(owner, mission.id)).find((item) => item.caseType === "BENCHMARK_PROOF");
    expect(benchmarkCase?.contract).toEqual(resolveMathPilotContract({ caseType: "BENCHMARK_PROOF" }));
    expect((await requestResearchRun(owner, requestFor(mission.id, { caseType: "BENCHMARK_PROOF" }))).status).toBe("FAILED");
    const numeric = await requestResearchRun(owner, requestFor(mission.id, { caseType: "BENCHMARK_EXACT" }));
    expect(numeric.status).toBe("SUCCEEDED");
    const numericCase = (await listMathPilotCases(owner, mission.id)).find((item) => item.caseType === "BENCHMARK_EXACT");
    expect(numericCase?.contract).toEqual(resolveMathPilotContract({ caseType: "BENCHMARK_EXACT" }));
    expect((await requestResearchRun(owner, requestFor(mission.id, { caseType: "BENCHMARK_EXACT" }))).status).toBe("FAILED");
    const opened = await requestResearchRun(owner, requestFor(mission.id, openRequest));
    expect(opened.status).toBe("SUCCEEDED");
    const cases = await listMathPilotCases(owner, mission.id);
    expect(cases).toHaveLength(5);
    expect(cases[0].caseType).toBe("OPEN");

    await expect(ownerQuery(`UPDATE math_pilot_case SET contract = '{}'::jsonb WHERE id = '${cases[0].id}'`))
      .rejects.toThrow(/append-only/i);
    await expect(ownerQuery(`UPDATE research_run SET question = 'changed' WHERE id = '${cases[0].researchRunId}'`))
      .rejects.toThrow(/immutable/i);
  });
});
