import { describe, expect, it } from "vitest";
import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";
import { prepareProblemContract, admitCandidate, createHostVerifier } from "@/modules/research-sandbox/research-core-v3";
import { campaignDigest, initialCampaignState, reduceCampaignEvent } from "@/modules/research-sandbox/research-campaign/ledger";
import { zeroResources, type CampaignView, type CampaignStage } from "@/modules/research-sandbox/research-campaign/contracts";
import { fixedPilotPlan, fixedPublicControls, fixedControlledCandidate, assertFixedPilotReferences } from "@/modules/research-sandbox/research-evaluation-v3/fixed-pilot";
import { sealPairedStudyPlan, verifyPairedStudyPlan, studySlots, slotBinding, publicArmProjection } from "@/modules/research-sandbox/research-evaluation-v3/plan";
import { boundedObservation, evaluationDigest, ratio } from "@/modules/research-sandbox/research-evaluation-v3/contracts";
import { gradeRecord, validateHistoricalGrade } from "@/modules/research-sandbox/research-evaluation-v3/evaluator";
import { projectCampaignMeasurements } from "@/modules/research-sandbox/research-evaluation-v3/event-projection";
import { derivePairedReport } from "@/modules/research-sandbox/research-evaluation-v3/report";
import { buildBlindedDossier, verifyBlindedDossier } from "@/modules/research-sandbox/research-evaluation-v3/dossier";
import { validateFeedback } from "@/modules/research-sandbox/research-evaluation-v3/feedback";
import { catalogTransferStudy, controlledCampaignProfile, publicCampaignProfiles } from "@/modules/research-sandbox/research-evaluation-v3/fixed-campaign-catalog";

const pin=sha256("SYNTHETIC_UNIT_SOURCE_NOT_REVIEWED_RELEASE"), epoch="unit-epoch";
const clone=<T>(v:T):T=>JSON.parse(JSON.stringify(v));
function fixture(taskIndex=0, arm:"DIRECT_WITH_TOOLS"|"METHOD_ASSISTED"="DIRECT_WITH_TOOLS", finish=true, tokens:number|null=17,
  options:{actualModel?:string;actualVersion?:string;requestedVersion?:string}={}) {
  let plan=fixedPilotPlan();if(options.requestedVersion){const {planDigest,...body}=plan;void planDigest;plan=sealPairedStudyPlan({...body,requestedModelVersion:options.requestedVersion});}
  const task=plan.tasks[taskIndex],prepared=prepareProblemContract(task.contract),o=prepared.contract.obligations[0];
  const bytes=fixedControlledCandidate(task.id),candidate=admitCandidate(prepared,o.id,bytes);
  const envelope={version:3 as const,provider:"CONTROLLED_LOCAL" as const,requestedModel:plan.requestedModel,...(plan.requestedModelVersion?{requestedModelVersion:plan.requestedModelVersion}:{}),methods:["TEST_METHOD"],total:plan.ceilings.total,
    perCall:plan.ceilings.perCall,stop:{maxRounds:2,maxNoInformation:2,deadlineAt:"2026-10-05T20:00:00.000Z"},
    recovery:{replacementDeliveries:1,verifierReplays:1,diagnosticIncidents:2,diagnosticReadBytes:2097152,diagnosticMilliseconds:20000},evaluation:slotBinding(plan,task.id,arm),postgrade:{...plan.ceilings.postgrade,total:{...plan.ceilings.postgrade.total,calls:0 as const,tokens:0 as const}}};
  const view:CampaignView={id:`${task.id}:${arm}`,organizationId:"org",workspaceId:"work",missionId:"mission",version:1,
    contract:prepared.contract,contractDigest:prepared.contractDigest,envelope,envelopeDigest:campaignDigest(envelope),sourceBundleDigest:pin,authorityEpoch:epoch,
    status:"QUEUED",state:initialCampaignState(envelope),events:[],complete:true,eventCut:{sequence:0,digest:pin},revokedAt:null};
  const append=(eventType:string,detail:Record<string,unknown>,milliseconds?:number)=>{
    const sequence=view.events.length+1,createdAt=new Date(Date.UTC(2026,9,5,1,0,0)+ (milliseconds ?? sequence*100)).toISOString();
    const state=reduceCampaignEvent(view.state,envelope,eventType,detail),payload={state,detail};
    const body={campaignId:view.id,organizationId:view.organizationId,workspaceId:view.workspaceId,sequence,eventType,actionKey:`unit:${sequence}`,
      payload,previousDigest:view.events.at(-1)?.digest??null,jobId:null,createdAt};
    const digest=campaignDigest(body);view.events.push({id:`event${sequence}`,...body,digest});view.state=state;view.status=state.status;view.eventCut={sequence,digest};
  };
  append("APPROVED",{resources:zeroResources()});
  const stage:CampaignStage={contractDigest:prepared.contractDigest,rootId:prepared.contract.rootId,obligationId:o.id,adapterId:prepared.contract.domain.adapterId,adapterVersion:1,
    actionId:"action",attemptId:"attempt",round:1,methodId:"TEST_METHOD",delivery:1,fence:"NOT_CROSSED",candidateKey:null,candidateDigest:null,candidateBytes:null,
    sourceBundleDigest:pin,inputDigest:prepared.inputDigest,predicateDigest:campaignDigest(o.predicate),checkerSourceDigest:pin,authorityEpoch:epoch,runtimeSourceDigest:pin,
    checkerReservations:0,startedAt:null,returnedAt:null,receipt:null,closure:null};
  append("RESERVED",{stage,resources:{...zeroResources(),calls:1,tokens:100}});
  append("STARTED",{actionId:"action",delivery:1,startedAt:"2026-10-05T01:00:00.300Z",runtimeSourceDigest:pin,checkerSourceDigest:pin,queueLatencyMilliseconds:null});
  if(!finish)return {plan,view,append,bytes,grade:null};
  append("RESULT_RETAINED",{actionId:"action",candidateKey:`work/research-campaign/${view.id}/attempt.json`,candidateDigest:candidate.candidateDigest,
    candidateBytes:Buffer.byteLength(bytes),returnedAt:"2026-10-05T01:00:00.400Z",observedTokens:tokens,attestedModel:options.actualModel??plan.requestedModel,
    attestedModelVersion:options.actualVersion??null,elapsedMilliseconds:12.5});
  append("CHECK_RESERVED",{resources:{...zeroResources(),checkerOperations:1000}});
  const verifier=createHostVerifier({runtimeSourceDigest:pin,sourceBundleDigest:pin,authorityEpoch:epoch,checkerSourceDigests:{[prepared.contract.domain.adapterId]:pin},reserveCheck:()=>{}});
  const receipt=verifier.verify({prepared,obligationId:o.id,candidate,attemptId:"attempt",inputDigest:prepared.inputDigest}),closure=verifier.projectClosure(prepared,o.id,receipt);
  append("VERIFIED",{receipt,closure});
  const cutDigest=view.eventCut.digest,actionId="evaluation";
  append("EVALUATION_RESERVED",{actionId,cutDigest,resources:{...zeroResources(),checkerOperations:1000,computeMilliseconds:1000,readBytes:1000,writeBytes:1000}});
  append("EVALUATION_STARTED",{actionId,cutDigest});
  // This synthetic fixture uses a freshly checked host receipt. Production
  // performs an additional independent postgrade, exercised by integration QA.
  const grade=gradeRecord({campaignId:view.id,preregistrationDigest:plan.planDigest,taskId:task.id,artifactDigest:candidate.candidateDigest,
    candidateDigest:candidate.candidateDigest,cutDigest,actionId,receipt,closure,reason:receipt.reason});
  append("EVALUATION_RETAINED",{actionId,cutDigest,grade,gradeDigest:evaluationDigest(grade)});
  return {plan,view,append,bytes,grade};
}

describe("TIP076C preregistered plans and bounded projections",()=>{
  it("retains fixed twelve tasks with three invalid controls",()=>{const p=fixedPilotPlan();expect(p.tasks).toHaveLength(12);expect(fixedPublicControls.filter(c=>!c.valid)).toHaveLength(3);assertFixedPilotReferences(p);});
  it("creates twenty-four slots and alternates first arm",()=>{const slots=studySlots(fixedPilotPlan());expect(slots).toHaveLength(24);expect(slots.slice(0,4).map(s=>s.arm)).toEqual(["DIRECT_WITH_TOOLS","METHOD_ASSISTED","METHOD_ASSISTED","DIRECT_WITH_TOOLS"]);});
  it("matches ceilings and exposures rather than realized consumption",()=>{const p=fixedPilotPlan();expect(publicArmProjection(p,p.tasks[0].id,"DIRECT_WITH_TOOLS")).toEqual(publicArmProjection(p,p.tasks[0].id,"METHOD_ASSISTED"));});
  it("public solver projection contains no reference or controlled answer",()=>{const p=fixedPilotPlan(),s=JSON.stringify(publicArmProjection(p,p.tasks[0].id,"DIRECT_WITH_TOOLS"));expect(s).not.toContain("referenceDigest");expect(s).not.toContain("INTEGER_WITNESS\",\"values");});
  it("refuses changed sealed ceiling",()=>{const p=clone(fixedPilotPlan());p.ceilings.total.tokens++;expect(()=>verifyPairedStudyPlan(p)).toThrow();});
  it("refuses duplicate task identity",()=>{const {planDigest,...body}=clone(fixedPilotPlan());void planDigest;body.tasks[1]=body.tasks[0];expect(()=>sealPairedStudyPlan(body)).toThrow();});
  it("refuses coherent reference relabeling",()=>{const {planDigest,...body}=clone(fixedPilotPlan());void planDigest;body.tasks[0].referenceDigest=pin;expect(()=>assertFixedPilotReferences(sealPairedStudyPlan(body))).toThrow();});
  it("zero denominator is UNDEFINED rather than zero",()=>expect(ratio(0,0).status).toBe("UNDEFINED"));
  it("observational decimals are admitted without changing integer scientific intake",()=>expect(boundedObservation({milliseconds:1.25},1000)).toEqual({milliseconds:1.25}));
  it("observational getters are refused without executing",()=>{let calls=0;expect(()=>boundedObservation({get duration(){calls++;return 1;}},1000)).toThrow();expect(calls).toBe(0);});
  it("observational proxies are refused without executing",()=>{let calls=0;const raw=new Proxy({},{ownKeys(){calls++;return [];}});expect(()=>boundedObservation(raw,1000)).toThrow();expect(calls).toBe(0);});
  it("observational cycles and nonfinite durations refuse",()=>{const o:{self?:unknown}={};o.self=o;expect(()=>boundedObservation(o,1000)).toThrow();expect(()=>boundedObservation({milliseconds:Infinity},1000)).toThrow();});
  it("observational structural and byte ceilings refuse before cloning",()=>{expect(()=>boundedObservation({items:Array(1025).fill(0)},1048576)).toThrow();expect(()=>boundedObservation({text:"x".repeat(200)},100)).toThrow();});
  it("retains missing arms in denominator",()=>{const r=derivePairedReport(fixedPilotPlan(),[]);expect(r.intentionToTestArms).toBe(24);expect(r.arms[0].admittedDenominator).toBe(12);expect(r.pilotRouting).toBe("INCONCLUSIVE_INCOMPLETE");});
  it("small transfer has dynamic denominator and no pilot promotion",()=>{const r=derivePairedReport(catalogTransferStudy("LINEAR_FIVE"),[]);expect(r.intentionToTestArms).toBe(2);expect(r.pilotRouting).toBe("NOT_ELIGIBLE_ARCHITECTURE_TRANSFER_ONLY");});
  it("catalog public projections omit controlled candidates",()=>{expect(JSON.stringify(publicCampaignProfiles())).not.toContain("candidateBytes");expect(controlledCampaignProfile("LINEAR_FIVE").candidateBytes).toBeTruthy();});
});
describe("TIP076C durable accounting and postgrade provenance",()=>{
  it("fresh exact scoped synthetic receipt is historically bound",()=>{const f=fixture();validateHistoricalGrade(f.view,f.grade!);expect(f.grade!.status).toBe("ACCEPTED_EXACT_SCOPE");});
  it("invalid plausible candidate is rejected not accepted",()=>{const f=fixture(3);validateHistoricalGrade(f.view,f.grade!);expect(f.grade!.status).toBe("REJECTED");});
  it("START fence is not evidence of actual provider invocation",()=>{const t=projectCampaignMeasurements(fixture(0,"DIRECT_WITH_TOOLS",false).view);expect(t.dispatchFences).toMatchObject({status:"KNOWN",value:1});expect(t.actualCalls.status).toBe("UNKNOWN");expect(t.unknownUsageActions).toBe(1);});
  it("missing usage remains unknown while known partial sum retained",()=>{const t=projectCampaignMeasurements(fixture(0,"DIRECT_WITH_TOOLS",true,null).view);expect(t.tokenUsage.status).toBe("UNKNOWN");expect(t.knownTokens).toBe(0);});
  it("uses actual retained monotonic elapsed milliseconds",()=>expect(projectCampaignMeasurements(fixture().view).activeProcessingMilliseconds).toMatchObject({status:"KNOWN",value:12.5}));
  it("retained return window is not presented as pure CPU or provider-only duration",()=>{const t=projectCampaignMeasurements(fixture().view);expect(t.activeProcessingMilliseconds).toMatchObject({provenance:"HOST_PROVIDER_RETURN_WINDOW_INCLUDING_SOURCE_SCAN_AND_RETENTION"});expect(t.pureCpuMilliseconds.status).toBe("UNKNOWN");expect(t.queueCoverage).toBe("FIRST_STAGE_ONLY");});
  it("does not guess version price queue or user minutes",()=>{const t=projectCampaignMeasurements(fixture().view);for(const x of [t.actualModelVersion,t.monetaryCost,t.queueLatencyMilliseconds,t.userMinutes])expect(x.status).toBe("UNKNOWN");});
  it("later dossier work does not extend arm wall duration",()=>{const f=fixture(),before=projectCampaignMeasurements(f.view).wallMilliseconds;f.append("DOSSIER_RESERVED",{actionId:"d",cutDigest:f.view.eventCut.digest,resources:zeroResources()},100000);expect(projectCampaignMeasurements(f.view).wallMilliseconds).toEqual(before);});
  it("grader charges are outside permanent arm charges",()=>{const t=projectCampaignMeasurements(fixture().view);expect(t.reservations.checkerOperations).toBe(1000);expect(t.postgradeReservations.checkerOperations).toBe(1000);});
  it("coherent grade candidate substitution refuses against ledger",()=>{const f=fixture(),g=clone(f.grade!);g.artifactDigest=pin;expect(()=>validateHistoricalGrade(f.view,g)).toThrow();});
  it.each(["attemptId","inputDigest","checkerSourceDigest","sourceBundleDigest","runtimeSourceDigest","authorityEpoch","adapterId","rootId"] as const)("coherent historical receipt %s substitution refuses",key=>{
    const f=fixture(),g=clone(f.grade!);(g.receipt as unknown as Record<string,unknown>)[key]=sha256("different");const {receiptDigest,...body}=g.receipt!;void receiptDigest;g.receipt!.receiptDigest=evaluationDigest(body);g.closure!.receiptDigest=g.receipt!.receiptDigest;
    const retained=f.view.events.at(-1)!;retained.payload.detail.grade=g;retained.payload.detail.gradeDigest=evaluationDigest(g);expect(()=>validateHistoricalGrade(f.view,g)).toThrow();
  });
  it("forged cut refuses despite self-consistent grade digest",()=>{const f=fixture(),g=clone(f.grade!);g.cutDigest=pin;expect(()=>validateHistoricalGrade(f.view,g)).toThrow();});
  it("campaign event hash drift refuses",()=>{const f=fixture();f.view.events[2].createdAt="2026-10-05T00:00:00.000Z";expect(()=>projectCampaignMeasurements(f.view)).toThrow();});
  it("matched report rejects provider-version ceiling drift",()=>{const f=fixture();f.view.envelope.requestedModelVersion="invented";expect(()=>derivePairedReport(f.plan,[{campaign:f.view,grade:f.grade}])).toThrow();});
  it("known actual model mismatch makes pilot not comparable",()=>{const a=fixture(),b=fixture(0,"METHOD_ASSISTED",true,17,{actualModel:"OTHER_ACTUAL_MODEL"});const r=derivePairedReport(a.plan,[{campaign:a.view,grade:a.grade},{campaign:b.view,grade:b.grade}]);expect(r.pilotRouting).toBe("NOT_COMPARABLE_ATTESTED_IDENTITY");});
  it("known actual version disagreement makes pilot not comparable",()=>{const a=fixture(0,"DIRECT_WITH_TOOLS",true,17,{actualVersion:"v1"}),b=fixture(0,"METHOD_ASSISTED",true,17,{actualVersion:"v2"});expect(derivePairedReport(a.plan,[{campaign:a.view,grade:a.grade},{campaign:b.view,grade:b.grade}]).identityComparability).toBe("NOT_COMPARABLE_ATTESTED_IDENTITY");});
  it("actual version violating known requested version refuses comparable routing",()=>{const f=fixture(0,"DIRECT_WITH_TOOLS",true,17,{requestedVersion:"v1",actualVersion:"v2"});expect(derivePairedReport(f.plan,[{campaign:f.view,grade:f.grade}]).pilotRouting).toBe("NOT_COMPARABLE_ATTESTED_IDENTITY");});
  it("full fixed synthetic pilot has eighteen accepted and zero false accepts, not AI superiority",()=>{
    const rows=studySlots(fixedPilotPlan()).map(s=>{const f=fixture(fixedPilotPlan().tasks.findIndex(t=>t.id===s.taskId),s.arm);return {campaign:f.view,grade:f.grade};});
    const r=derivePairedReport(fixedPilotPlan(),rows);expect(r.arms.map(a=>a.accepted)).toEqual([9,9]);expect(r.arms.map(a=>a.falseAccepts)).toEqual([0,0]);expect(r.interventionReduction.status).toBe("UNDEFINED");expect(r.statisticalSuperiority).toBe("NOT_ESTABLISHED");
  });
});
describe("TIP076C blinded scoped export and explicit feedback",()=>{
  const owned=fixture(),ownedDossier=buildBlindedDossier(owned.view,owned.grade!,owned.bytes);
  const dossier=()=>clone(ownedDossier);
  const feedback=()=>{const d=dossier();return {version:3,dossierDigest:d.dossierDigest,dossierToken:d.token,participantId:"test-participant",participantKind:"SYNTHETIC_ENGINEERING",
    consent:{granted:true,purpose:"SCOPED_RESEARCH_PRODUCT_EVALUATION",recordedAt:"2026-10-05T01:00:00.000Z",scope:"THIS_DOSSIER_ONLY",externalSharing:false},independentFromResearchRequester:true,
    taskCompleted:true,errorsEncountered:0,interventionMinutes:null,willingnessToReuse:"YES",comment:"Synthetic control, not a real user"};};
  it("export omits arm provider usage identities",()=>{const d=dossier();verifyBlindedDossier(d);expect(JSON.stringify(d)).not.toContain("DIRECT_WITH_TOOLS");expect(JSON.stringify(d)).not.toContain("CONTROLLED_FIXED_RESPONSE");});
  it("export original candidate bytes retained without normalization",()=>expect(dossier().candidate).toBe(fixedControlledCandidate("integer-sum-five")));
  it("tampered export digest refuses",()=>{const d=dossier();d.target="changed";expect(()=>verifyBlindedDossier(d)).toThrow();});
  it("wrong original candidate refuses",()=>{const f=fixture();expect(()=>buildBlindedDossier(f.view,f.grade!,canonicalJson({fake:true}))).toThrow();});
  it("synthetic feedback never satisfies real user acceptance",()=>{const f=validateFeedback(feedback(),dossier(),"test-participant");expect(f.eligibleForEmpiricalAcceptance).toBe(false);expect(f.realParticipantValidation).toBe("EXCLUDED_SYNTHETIC");expect(f.minuteProvenance).toBe("UNKNOWN");});
  it("self-reported time is labelled not host observation",()=>{const f=feedback();f.interventionMinutes=3 as never;expect(validateFeedback(f,dossier(),"test-participant").minuteProvenance).toBe("SELF_REPORT");});
  it("self-declared real participant still requires independent validation",()=>{const f=feedback();f.participantKind="REAL_SELF_REPORTED";expect(validateFeedback(f,dossier(),"test-participant").realParticipantValidation).toBe("PENDING_INDEPENDENT_HUMAN_VALIDATION");});
  it("authenticated identity mismatch refuses",()=>expect(()=>validateFeedback(feedback(),dossier(),"other")).toThrow());
  it("consent absent refuses",()=>{const f=feedback();f.consent.granted=false;expect(()=>validateFeedback(f,dossier(),"test-participant")).toThrow();});
  it("external sharing permission cannot be inferred",()=>{const f=feedback();f.consent.externalSharing=true;expect(()=>validateFeedback(f,dossier(),"test-participant")).toThrow();});
  it("cross-dossier token refuses",()=>{const f=feedback();f.dossierToken=pin;expect(()=>validateFeedback(f,dossier(),"test-participant")).toThrow();});
});
