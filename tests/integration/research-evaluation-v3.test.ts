import { describe, expect, it } from "vitest";
import { getResearchCampaign } from "@/modules/research-sandbox/research-campaign/commands";
import { prepareProblemContract } from "@/modules/research-sandbox/research-core-v3";
import { fixedPilotPlan, fixedControlledCandidate } from "@/modules/research-sandbox/research-evaluation-v3/fixed-pilot";
import { catalogTransferStudy, controlledCampaignProfile } from "@/modules/research-sandbox/research-evaluation-v3/fixed-campaign-catalog";
import { evaluateRetainedPair, exportBlindedDossier, importFeedback, getCampaignEvidenceObservation } from "@/modules/research-sandbox/research-evaluation-v3/kernel";
import { asOwner, createUser } from "./helpers";
import { runStudy } from "../fixtures/research-paired-study-v3";

describe("TIP076C authenticated paired software measurement, not live AI efficacy",()=>{
  it("runs all fixed twelve matched tasks through actual durable worker and independent postgrader then scoped feedback",async()=>{
    const plan=fixedPilotPlan(),candidates=new Map(plan.tasks.map(task=>[prepareProblemContract(task.contract).contractDigest,fixedControlledCandidate(task.id)]));
    const f=await runStudy(plan,candidates);
    expect(f.report.intentionToTestArms).toBe(24);expect(f.report.arms.map(a=>a.accepted)).toEqual([9,9]);
    expect(f.report.arms.map(a=>a.falseAccepts)).toEqual([0,0]);expect(f.report.interventionReduction.status).toBe("UNDEFINED");
    expect(f.report.actualModelVersionEquality).toBe("UNKNOWN");expect(f.report.liveModelExperiment).toBe("NOT_RUN");
    const id=f.ids[0],before=await getResearchCampaign(f.owner,id);
    expect(before.state.postgradeActions).toBe(1);expect(before.state.postgradeSpent.checkerOperations).toBeGreaterThan(0);
    await expect(evaluateRetainedPair(f.owner,{campaignId:id,idempotencyKey:`grade:${id}`})).rejects.toThrow();
    expect((await getResearchCampaign(f.owner,id)).state.postgradeActions).toBe(1);
    const dossier=await exportBlindedDossier(f.owner,{campaignId:id,idempotencyKey:`export:${id}`});
    expect(JSON.stringify(dossier)).not.toContain("DIRECT_WITH_TOOLS");expect(dossier.wholeProblemSolved).toBe(false);
    const feedback=await importFeedback(f.owner,{campaignId:id,idempotencyKey:`feedback:${id}`,feedback:{version:3,dossierDigest:dossier.dossierDigest,dossierToken:dossier.token,
      participantId:f.owner.user.id,participantKind:"SYNTHETIC_ENGINEERING",consent:{granted:true,purpose:"SCOPED_RESEARCH_PRODUCT_EVALUATION",recordedAt:new Date().toISOString(),scope:"THIS_DOSSIER_ONLY",externalSharing:false},
      independentFromResearchRequester:false,taskCompleted:true,errorsEncountered:0,interventionMinutes:1.25,willingnessToReuse:"YES",comment:"Owned software control; no real user recruitment"}});
    expect(feedback.eligibleForEmpiricalAcceptance).toBe(false);expect(feedback.minuteProvenance).toBe("SELF_REPORT");
    const observation=await getCampaignEvidenceObservation(f.owner,id);expect(observation.grade?.status).toBe("ACCEPTED_EXACT_SCOPE");
    expect(observation.campaign.state.spent).toEqual(before.state.spent);expect(observation.campaign.state.postgradeActions).toBe(3);
    const foreign=await asOwner(await createUser("tip076-foreign-eval"));await expect(getCampaignEvidenceObservation(foreign,id)).rejects.toThrow();
    const boundGrade=f.grades[0];expect(boundGrade.receipt?.candidateDigest).toBe(before.state.stage?.candidateDigest);expect(boundGrade.receipt?.attemptId).toBe(before.state.stage?.attemptId);
  },90000);
  it("same paired path supports small transfer with missing usage retained, no zero or pilot promotion",async()=>{
    const plan=catalogTransferStudy("LINEAR_FIVE"),profile=controlledCampaignProfile("LINEAR_FIVE");
    const f=await runStudy(plan,new Map([[prepareProblemContract(profile.contract).contractDigest,profile.candidateBytes]]),true);
    expect(f.report.intentionToTestArms).toBe(2);expect(f.report.pilotRouting).toBe("NOT_ELIGIBLE_ARCHITECTURE_TRANSFER_ONLY");
    expect(f.report.records.every(r=>r.telemetry?.tokenUsage.status==="UNKNOWN")).toBe(true);
    expect(f.report.arms.every(a=>a.accounting==="INCOMPLETE")).toBe(true);
  },30000);
});
