import { afterEach,beforeEach,describe,expect,it,vi } from "vitest";
import { reduceCampaignEvent,initialCampaignState } from "@/modules/research-sandbox/research-campaign/ledger";
import { CampaignRefusal,zeroResources,type CampaignStage,type CampaignEnvelope } from "@/modules/research-sandbox/research-campaign/contracts";
import { assertControlledCampaignEnvironment } from "@/modules/research-sandbox/research-campaign/source-bundle";
import { campaignQaEnvelope } from "../fixtures/research-campaign-v3";
import { getEnv,resetEnvCache } from "@/server/env";

const pin="a".repeat(64);
const env=campaignQaEnvelope(["FIRST","SECOND"],2);
const stage:CampaignStage={contractDigest:pin,rootId:"root",obligationId:"o",adapterId:"INTEGER_WITNESS",adapterVersion:1,
  actionId:"c:round:1",attemptId:"attempt",round:1,methodId:"FIRST",delivery:1,fence:"NOT_CROSSED",candidateKey:null,candidateDigest:null,candidateBytes:null,
  sourceBundleDigest:pin,inputDigest:pin,predicateDigest:pin,checkerSourceDigest:pin,authorityEpoch:"epoch",runtimeSourceDigest:pin,
  checkerReservations:0,startedAt:null,returnedAt:null,receipt:null,closure:null};
const reserved=()=>reduceCampaignEvent(initialCampaignState(env),env,"RESERVED",{stage,resources:{...zeroResources(),calls:1,tokens:100}});
const started=()=>reduceCampaignEvent(reserved(),env,"STARTED",{actionId:stage.actionId,delivery:1,startedAt:new Date().toISOString(),runtimeSourceDigest:pin,checkerSourceDigest:pin,queueLatencyMilliseconds:17});
const retained=(tokens:number|null=10)=>reduceCampaignEvent(started(),env,"RESULT_RETAINED",{actionId:stage.actionId,candidateKey:"w/c/a.json",candidateDigest:pin,candidateBytes:8,returnedAt:new Date().toISOString(),observedTokens:tokens,attestedModel:null});
describe("TIP076B permanent campaign admission/recovery reducer",()=>{
  it("keeps failed delivery reservations permanently charged",()=>{
    const first=reserved(),second=reduceCampaignEvent(first,env,"DELIVERY_REPLACED",{resources:{...zeroResources(),calls:1,tokens:100}});
    expect(second.spent.calls).toBe(2);expect(second.spent.tokens).toBe(200);expect(second.replacements).toBe(1);
  });
  it("permits only one replacement of proven NOT_CROSSED",()=>{
    const second=reduceCampaignEvent(reserved(),env,"DELIVERY_REPLACED",{resources:zeroResources()});
    expect(()=>reduceCampaignEvent(second,env,"DELIVERY_REPLACED",{resources:zeroResources()})).toThrow(CampaignRefusal);
  });
  it("START cannot be classified as pre-effect from absent result",()=>expect(()=>reduceCampaignEvent(started(),env,"DELIVERY_REPLACED",{resources:zeroResources()})).toThrow(CampaignRefusal));
  it("START with unknown completion has UNKNOWN token usage",()=>{
    const value=started();expect(value.accountingComplete).toBe(false);expect(value.observedTokens).toBeNull();
  });
  it("actual known retained usage resolves this call's UNKNOWN",()=>{
    const value=retained();expect(value.observedTokens).toBe(10);expect(value.accountingComplete).toBe(true);
  });
  it("missing transport usage remains UNKNOWN, never zero",()=>expect(retained(null).observedTokens).toBeNull());
  it("requested identity never fabricates actual attestation",()=>expect(retained().attestedModel).toBeNull());
  it("TOTAL exhausted before effect",()=>expect(()=>reduceCampaignEvent(initialCampaignState({...env,total:{...env.total,calls:0}}),{...env,total:{...env.total,calls:0}},"RESERVED",{stage,resources:{...zeroResources(),calls:1}})).toThrow(CampaignRefusal));
  it("rejects unsafe negative accounting",()=>expect(()=>reduceCampaignEvent(initialCampaignState(env),env,"RESERVED",{stage,resources:{...zeroResources(),calls:-1}})).toThrow(CampaignRefusal));
  it("retained output cannot bypass checker reservation",()=>expect(()=>reduceCampaignEvent(retained(),env,"VERIFIED",{receipt:{},closure:{}})).toThrow(CampaignRefusal));
  it("checker replay charges both checks",()=>{
    let s=retained();s=reduceCampaignEvent(s,env,"CHECK_RESERVED",{resources:{...zeroResources(),checkerOperations:100}});
    s=reduceCampaignEvent(s,env,"CHECK_RESERVED",{resources:{...zeroResources(),checkerOperations:100}});
    expect(s.spent.checkerOperations).toBe(200);expect(s.verifierReplays).toBe(1);
    expect(()=>reduceCampaignEvent(s,env,"CHECK_RESERVED",{resources:zeroResources()})).toThrow(CampaignRefusal);
  });
  it("typed diagnostic quota is inside TOTAL",()=>{
    const s=reduceCampaignEvent(started(),env,"DIAGNOSTIC_RESERVED",{readBytes:4096,milliseconds:1000,resources:{...zeroResources(),readBytes:4096,computeMilliseconds:1000}});
    expect(s.spent.readBytes).toBe(4096);expect(s.diagnosticSpent.incidents).toBe(1);
  });
  it.each([[1048577,1000],[100,10001],[100,-1]])("diagnostic bounds refuse %s bytes/%s ms",(readBytes,milliseconds)=>{
    expect(()=>reduceCampaignEvent(started(),env,"DIAGNOSTIC_RESERVED",{readBytes,milliseconds,resources:zeroResources()})).toThrow(CampaignRefusal);
  });
  it("pause emits only a consequential prompt, no routine continuation",()=>{
    let s=reduceCampaignEvent(started(),env,"PAUSED",{failure:"TRANSPORT",reason:"UNKNOWN_EFFECT"});
    s=reduceCampaignEvent(s,env,"HUMAN_PROMPT",{taxonomy:"UNCERTAIN_EXTERNAL_EFFECT"});
    expect(s.consequentialPrompts).toBe(1);expect(s.routinePrompts).toBe(0);
  });
  it("terminal closure cannot be reopened by next round",()=>expect(()=>reduceCampaignEvent({...initialCampaignState(env),status:"COMPLETED"},env,"RESERVED",{stage,resources:zeroResources()})).toThrow(CampaignRefusal));
  it("postgrade remains separate from arm reservations",()=>{
    const envelope:CampaignEnvelope={...env,postgrade:{actions:2,total:{...zeroResources(),calls:0,tokens:0,readBytes:100,computeMilliseconds:100}}};
    const s=reduceCampaignEvent({...initialCampaignState(envelope),status:"COMPLETED"},envelope,"EVALUATION_RESERVED",{actionId:"eval",cutDigest:pin,resources:{...zeroResources(),readBytes:50}});
    expect(s.spent.readBytes).toBe(0);expect(s.postgradeSpent.readBytes).toBe(50);expect(s.status).toBe("COMPLETED");
    const effect=reduceCampaignEvent(s,envelope,"EVALUATION_STARTED",{actionId:"eval",cutDigest:pin});
    expect(reduceCampaignEvent(effect,envelope,"EVALUATION_RETAINED",{actionId:"eval",cutDigest:pin}).postgradePending).toBeNull();
  });
  it("postgrade cannot synthesize calls/tokens outside arm",()=>{
    const envelope:CampaignEnvelope={...env,postgrade:{actions:1,total:{...zeroResources(),calls:0,tokens:0}}};
    expect(()=>reduceCampaignEvent(initialCampaignState(envelope),envelope,"EVALUATION_RESERVED",{actionId:"eval",cutDigest:pin,resources:{...zeroResources(),calls:1}})).toThrow(CampaignRefusal);
  });
});
describe("TIP076B isolated QA guard",()=>{
  beforeEach(()=>{
    vi.stubEnv("NODE_ENV","test");vi.stubEnv("DEPLOYMENT_ENV","test");vi.stubEnv("RUNTIME_COMPONENT","web");
    vi.stubEnv("DATABASE_URL","postgresql://test@localhost:5433/hiveos_test");
    vi.stubEnv("BETTER_AUTH_SECRET","unit-guard-secret-at-least-16-chars");vi.stubEnv("NEXT_PHASE",undefined);
    resetEnvCache();
  });
  afterEach(()=>{vi.unstubAllEnvs();resetEnvCache();});
  it.each(["localhost","127.0.0.1"])("admits only validated runtime test snapshot on exact QA target %s",hostname=>{
    vi.stubEnv("DATABASE_URL",`postgresql://test@${hostname}:5433/hiveos_test`);expect(assertControlledCampaignEnvironment).not.toThrow();
  });
  it.each(["postgresql://test@localhost:5433/hiveos_dev","postgresql://test@localhost:5434/hiveos_test","postgresql://test@remote.example:5433/hiveos_test"])("refuses nonisolated target %s",url=>{
    vi.stubEnv("DATABASE_URL",url);expect(assertControlledCampaignEnvironment).toThrow(CampaignRefusal);
  });
  it("production cannot enable controlled provider with matching database",()=>{
    vi.stubEnv("NODE_ENV","production");vi.stubEnv("DEPLOYMENT_ENV","staging");vi.stubEnv("RUNTIME_COMPONENT","research-worker");
    expect(getEnv().NODE_ENV).toBe("production");expect(assertControlledCampaignEnvironment).toThrow(CampaignRefusal);
  });
  it("ordinary development cannot enable controlled provider with matching database",()=>{
    vi.stubEnv("NODE_ENV","development");vi.stubEnv("DEPLOYMENT_ENV","development");vi.stubEnv("AUTH_THROTTLE_SECRET","unit-guard-throttle-at-least-16-chars");
    expect(getEnv().NODE_ENV).toBe("development");expect(assertControlledCampaignEnvironment).toThrow(CampaignRefusal);
  });
  it("environment parse failure becomes sanitized authority refusal",()=>{
    vi.stubEnv("DATABASE_URL","mysql://do-not-expose-invalid-credential@example.invalid/db");
    try {assertControlledCampaignEnvironment();expect.unreachable();}catch(error){
      expect(error).toBeInstanceOf(CampaignRefusal);expect((error as CampaignRefusal).code).toBe("AUTHORITY");
      expect((error as Error).message).toBe("Local QA database required");expect(String(error)).not.toContain("do-not-expose");
    }
  });
  it("cached refused target cannot be bypassed by raw process mutation",()=>{
    vi.stubEnv("DATABASE_URL","postgresql://test@localhost:5433/hiveos_dev");getEnv();
    vi.stubEnv("DATABASE_URL","postgresql://test@localhost:5433/hiveos_test");expect(assertControlledCampaignEnvironment).toThrow(CampaignRefusal);
    resetEnvCache();expect(assertControlledCampaignEnvironment).not.toThrow();
  });
  it("reset revalidates changed target rather than carrying old QA permission",()=>{
    expect(assertControlledCampaignEnvironment).not.toThrow();vi.stubEnv("DATABASE_URL","postgresql://test@localhost:5433/hiveos_dev");
    expect(getEnv().DATABASE_URL).toBe("postgresql://test@localhost:5433/hiveos_test");
    resetEnvCache();expect(assertControlledCampaignEnvironment).toThrow(CampaignRefusal);
  });
});
