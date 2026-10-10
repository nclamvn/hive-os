import { describe,expect,it } from "vitest";
import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { createDomainProblemContract,prepareProblemContract } from "@/modules/research-sandbox/research-core-v3";
import { catalogTransferStudy } from "@/modules/research-sandbox/research-evaluation-v3/fixed-campaign-catalog";
import { sealPairedStudyPlan } from "@/modules/research-sandbox/research-evaluation-v3/plan";
import { evaluationDigest } from "@/modules/research-sandbox/research-evaluation-v3/contracts";
import { getCampaignEvidenceObservation } from "@/modules/research-sandbox/research-evaluation-v3/kernel";
import { runStudy } from "../fixtures/research-paired-study-v3";

describe("R3 fourth-domain paired transfer through unchanged authenticated runtime",()=>{
  it("retains all eight arms: valid, false enclosure, wrong floor, and straddling, with UNKNOWN usage",async()=>{
    const r=(numerator:string,denominator="1")=>({numerator,denominator});
    const controls=[{id:"VALID",n:"-7",lower:r("-5","2"),upper:r("-9","4"),floor:"-3",expected:"VERIFIED"},
      {id:"FALSE_ENCLOSURE",n:"-8",lower:r("-2"),upper:r("-3","2"),floor:"-3",expected:"REJECTED"},
      {id:"WRONG_FLOOR",n:"-10",lower:r("-7","2"),upper:r("-13","4"),floor:"-3",expected:"REJECTED"},
      {id:"STRADDLE",n:"-11",lower:r("-4"),upper:r("-3"),floor:"-4",expected:"INCONCLUSIVE"}];
    const candidates=new Map<string,string>();
    const tasks=controls.map(c=>{
      const input={kind:"RATIONAL_EXPRESSION",expression:{op:"DIV",left:{op:"Q",...r(c.n)},right:{op:"Q",...r("3")}}};
      const p=createDomainProblemContract({id:`transfer:${c.id}`,rootId:"PUBLIC_DOMAIN_TRANSFER_V3",target:"Certificate for the floor of the exact sealed rational expression",mode:"ENGINEERING",adapterId:"RATIONAL_INTERVAL_FLOOR",input,obligationId:"exact-scope"});
      candidates.set(p.contractDigest,canonicalJson({kind:"INTERVAL_FLOOR_CERTIFICATE",inputDigest:p.inputDigest,lower:c.lower,upper:c.upper,floor:c.floor}));
      return {id:c.id,contract:p.contract,referenceDigest:evaluationDigest({control:c.id,expected:c.expected}),exposure:"PUBLIC_ENGINEERING_CONTROL" as const,
        sourceExposureDigest:evaluationDigest({public:true,input}),toolsetDigest:evaluationDigest({tools:["INSTALLED_EXACT_CHECKER"],adapter:p.contract.domain.adapterId})};
    });
    const {planDigest,...common}=catalogTransferStudy("RATIONAL_NEGATIVE_FLOOR");void planDigest;
    const plan=sealPairedStudyPlan({...common,id:"TRANSFER_RATIONAL_FOUR_CONTROLS",tasks,referenceSetDigest:evaluationDigest(controls.map(c=>({id:c.id,expected:c.expected}))),ceilings:{...common.ceilings,maxRounds:1}});
    const f=await runStudy(plan,candidates,true);
    expect(f.ids).toHaveLength(8);expect(f.report.intentionToTestArms).toBe(8);
    expect(f.report.pilotRouting).toBe("NOT_ELIGIBLE_ARCHITECTURE_TRANSFER_ONLY");
    for(const view of f.views){
      const c=controls.find(c=>`transfer:${c.id}`===view.contract.id)!;
      expect(view.state.stage?.receipt?.result).toBe(c.expected);
      expect(view.state.stage?.receipt?.refutation).toBeNull();
      expect(view.state.stage?.candidateDigest).toBe(evaluationDigest(JSON.parse(candidates.get(prepareProblemContract(view.contract).contractDigest)!)));
      expect(view.state.postgradeSpent.calls).toBe(0);
    }
    expect(f.grades.filter(g=>g.status==="ACCEPTED_EXACT_SCOPE")).toHaveLength(2);
    expect(f.grades.filter(g=>g.status==="REJECTED")).toHaveLength(4);
    expect(f.grades.filter(g=>g.status==="INCONCLUSIVE")).toHaveLength(2);
    expect(f.report.records.every(record=>record.telemetry?.tokenUsage.status==="UNKNOWN")).toBe(true);
    expect(f.report.arms.every(arm=>arm.accounting==="INCOMPLETE")).toBe(true);
    expect(f.views.every(v=>v.events.filter(e=>e.eventType==="STARTED").length===1)).toBe(true);
    expect(f.grades.every(g=>g.receipt?.checkerSourceDigest && g.receipt.candidateDigest===f.views.find(v=>v.id===g.campaignId)?.state.stage?.candidateDigest)).toBe(true);
    // The unchanged helper's views are the authenticated PRE-postgrade cut.
    // Re-read exact persisted evidence after grade; do not confuse fresh check
    // reservations with arm use, or remint authority from serialized receipts.
    for(const before of f.views){
      const observation=await getCampaignEvidenceObservation(f.owner,before.id),after=observation.campaign;
      expect(after.state.spent).toEqual(before.state.spent);
      expect(after.state.postgradeActions).toBe(1);
      expect(after.state.postgradeSpent.checkerOperations).toBeGreaterThan(0);
      expect(after.state.postgradeSpent.readBytes).toBeGreaterThan(0);
      expect(after.state.postgradeSpent.calls).toBe(0);expect(after.state.postgradeSpent.tokens).toBe(0);
      expect(after.events.filter(e=>e.eventType==="EVALUATION_RESERVED")).toHaveLength(1);
      expect(after.events.filter(e=>e.eventType==="EVALUATION_STARTED")).toHaveLength(1);
      expect(after.events.filter(e=>e.eventType==="EVALUATION_RETAINED")).toHaveLength(1);
      const grade=f.grades.find(g=>g.campaignId===before.id)!;
      expect(observation.grade).toEqual(grade);
      expect(observation.grade?.receipt?.sourceBundleDigest).toBe(after.sourceBundleDigest);
      expect(observation.grade?.receipt?.checkerSourceDigest).toBe(before.state.stage?.checkerSourceDigest);
      expect(observation.grade?.receipt?.candidateDigest).toBe(before.state.stage?.candidateDigest);
    }
  },90000);
});
