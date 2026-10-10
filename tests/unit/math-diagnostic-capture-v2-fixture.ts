import {randomUUID} from "node:crypto";
import {mkdtemp,mkdir,realpath} from "node:fs/promises";
import {join} from "node:path";
import {MathDiagnosticCaptureV2Store,type LrcCaptureV2Fence} from "@/server/operations/math-diagnostic-capture-v2";
import {durableDigest,durableJson,type LrcDurableDescriptor,type LrcDurableBinding,type LrcPreCriticReceipt,type LrcPostLedgerReceipt} from "@/modules/research-sandbox/math-lrc-durable-replay";
import {cockpitFixture} from "./math-lrc-research-cockpit-fixture";
import {canonicalJson,sha256} from "@/modules/execution-fabric/contracts";
import {mathModelAttemptSchema} from "@/modules/research-sandbox/contracts";
import {createLrcMethodUnitLiveEvidence,prepareLrcMethodUnitSolverInput,prepareLrcMethodUnitReviewInput,type LrcMethodUnitPreparation} from "@/modules/research-sandbox/math-lrc-method-unit-live";
import {buildLrcMethodUnitFiniteEvidence,LRC_METHOD_UNIT_DIGEST} from "@/modules/research-sandbox/math-lrc-method-unit";
export const H="a".repeat(64),J="b".repeat(64),K="c".repeat(64);
export const CEILING={scope:"FINITE_ONLY" as const,globalLrc:"NOT_ESTABLISHED" as const,realTime:"NOT_ESTABLISHED" as const,formal:"NOT_ESTABLISHED" as const,external:"NOT_ESTABLISHED" as const,novelty:"NOT_ESTABLISHED" as const};
export async function captureFixture(options:{fence?:LrcCaptureV2Fence;fault?:(stage:string)=>Promise<void>;now?:()=>number}={}) {
 const parent=await realpath(await mkdtemp("/private/tmp/hive071-store-")),root=join(parent,"captures"),now=options.now??(()=>10000),base=cockpitFixture();
 const context={actorUserId:"actor",organizationId:"org",workspaceId:"workspace",missionId:"mission"};
 const solverJob=randomUUID(),reviewJob=randomUUID(),reviewOutbox=randomUUID();
 const claim=(role:"SOLVER"|"ADVERSARY"|"CRITIC")=>({role,jobId:role==="SOLVER"?solverJob:reviewJob,outboxId:role==="SOLVER"?randomUUID():reviewOutbox,dispatchId:randomUUID(),workerId:"worker",claimedVersion:1,leaseExpiresAt:45000,attemptNumber:1 as const});
 const binding:LrcDurableBinding={context,caseId:randomUUID(),runId:randomUUID(),commandId:randomUUID(),solver:claim("SOLVER"),adversary:claim("ADVERSARY"),critic:claim("CRITIC")};
 const live={caseId:binding.caseId,runId:binding.runId,contractDigest:base.contractDigest,requestedModelName:"gpt-6-sol" as const},solverInput=prepareLrcMethodUnitSolverInput(live);
 const attempt=mathModelAttemptSchema.parse({...mathModelAttemptSchema.parse(base.attempt),lrcMethodUnitEvidence:createLrcMethodUnitLiveEvidence({solverInput})}),attemptDigest=sha256(canonicalJson(attempt));
 const pins=base.finiteSourcePins!,rawFinite=buildLrcMethodUnitFiniteEvidence({pins,seed:attempt.lrcMethodUnitFiniteSeed,binding:{caseId:binding.caseId,runId:binding.runId,reviewJobId:reviewJob,contractDigest:base.contractDigest,solverAttemptDigest:attemptDigest,adversaryReportDigest:K}});
 if(rawFinite.status!=="CHECKED_FINITE"||rawFinite.inputDigest===null||rawFinite.certificateDigest===null||rawFinite.seedDigest===null||rawFinite.checker===null||rawFinite.checker.outputDigest===null)throw new Error("Fixture finite did not check");
 const finite={...rawFinite,seedDigest:rawFinite.seedDigest,inputDigest:rawFinite.inputDigest,certificateDigest:rawFinite.certificateDigest,checker:{...rawFinite.checker,outputDigest:rawFinite.checker.outputDigest}};
 const descriptor:LrcDurableDescriptor={version:"LRC_DURABLE_DESCRIPTOR_V2",context,approvedNonce:randomUUID(),executableManifestDigest:H,contractDigest:base.contractDigest,sourcePins:{"src/modules/research-sandbox/math-lrc-method-unit.ts":pins.producerSourceSha256,"src/modules/research-sandbox/math-lrc-shift-replay.ts":K},predicateId:"FEW_EXCEPTION_SHIFT_14_V1",seedDigest:finite.seedDigest,unitDigest:LRC_METHOD_UNIT_DIGEST,createdAt:9000,expiresAt:50000};
 const store=new MathDiagnosticCaptureV2Store({mode:"fixture",fixtureRoot:root,fence:options.fence??(async()=>{}),now,fault:options.fault});
 return {parent,root,store,descriptor,binding,now,live,attempt,attemptDigest,solverInput,pins,finite};
}
export async function stagedFixture(options:Parameters<typeof captureFixture>[0]={}) {
 const f=await captureFixture(options),bootstrap=await f.store.reserveThreeRoles(f.descriptor),active=await f.store.bind(bootstrap,f.binding),description=await f.store.describe(active);
 const finite=f.finite,bytes=durableJson(finite,32768);await f.store.writeFinite(active,bytes,durableDigest(bytes));
 const metrics={checkerCalls:2 as const,originalOperations:100,replayOperations:200,originalElapsedMs:1,replayElapsedMs:2,aggregateElapsedMs:3};
 const pre:LrcPreCriticReceipt={version:"LRC_PRECRITIC_REPLAY_V2",descriptorDigest:description.descriptorDigest,bindingDigest:description.bindingDigest!,finiteByteDigest:durableDigest(bytes),finiteRecordDigest:finite.recordDigest,inputDigest:finite.inputDigest,certificateDigest:finite.certificateDigest,seedDigest:finite.seedDigest,unitDigest:finite.unitDigest,replayInputDigest:finite.inputDigest,originalResultDigest:finite.checker.outputDigest,replayResultDigest:finite.checker.outputDigest,replayCheckerVersion:"FIXTURE_REPLAY",replayCheckerSourceDigest:K,solverAttemptDigest:f.attemptDigest,adversaryReportDigest:K,metrics,replayId:randomUUID(),createdAt:10000,expiresAt:40000,...CEILING};
 return {...f,bootstrap,active,bytes,pre,metrics};
}
export async function preFixture(options:Parameters<typeof captureFixture>[0]={}) {
 const f=await stagedFixture(options),preDigest=await f.store.writePreCriticReceipt(f.active,f.pre);
 const inputs:string[]=[],preparedBytes:string[]=[],transports:string[]=[];
 for(const role of ["SOLVER","ADVERSARY","CRITIC"] as const){const expected:LrcMethodUnitPreparation={...f.live,role,...(role!=="SOLVER"?{solverAttempt:f.attempt,solverAttemptDigest:f.attemptDigest}:{}),...(role==="CRITIC"?{finiteEvidence:f.finite,finiteSourcePins:f.pins}:{})};const prepared=role==="SOLVER"?f.solverInput:prepareLrcMethodUnitReviewInput({...expected,role});const r=await f.store.writeRoleCapture(f.active,role,durableJson(prepared,49152),Buffer.from("fixture only"),expected);inputs.push(r.roleInputDigest);preparedBytes.push(r.preparedByteDigest);transports.push(r.transportManifestDigest);}
 const postHandle=await f.store.purpose(f.active,"POST_COMMIT");
 const post:LrcPostLedgerReceipt={version:"LRC_POSTLEDGER_ADMISSION_V2",descriptorDigest:f.pre.descriptorDigest,bindingDigest:f.pre.bindingDigest,preCriticReceiptDigest:preDigest,ledgerDigest:H,ledgerVersion:7,reviewDigest:H,dossierDigest:H,workerResultDigest:H,solverAttemptDigest:f.attemptDigest,adversaryReportDigest:K,roleInputDigests:inputs as [string,string,string],preparedByteDigests:preparedBytes as [string,string,string],transportManifestDigests:transports as [string,string,string],finalFiniteMetrics:{...f.metrics,aggregateElapsedMs:5},createdAt:10000,expiresAt:40000,dispatchAllowed:false,proofClosure:false,...CEILING};
 return {...f,postHandle,post,preDigest};
}
export async function makeRoot(f:{root:string}){await mkdir(f.root,{mode:0o700});}
