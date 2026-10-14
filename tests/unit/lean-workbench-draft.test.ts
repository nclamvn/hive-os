import {describe,expect,it} from "vitest";
import {deleteLeanDraft,LEAN_DRAFT_LIFETIME_MS,leanDraftKey,parseLeanDraft,readLeanDraft,saveLeanDraft} from "@/components/research/lean-workbench-draft";
import type {LeanWorkbenchInputs} from "@/components/research/lean-workbench-state";

const input:LeanWorkbenchInputs={statement:"Prove the stated implication",adapterId:"NONE",domainInput:"",solver:' {"argument":"original bytes","certificate":null,"gaps":[]} ',critic:"",repair:""};
const now=100_000_000;
const encode=(changes:Record<string,unknown>={})=>JSON.stringify({version:1,savedAt:now,input,...changes});
function memory(){const values=new Map<string,string>();return {getItem:(key:string)=>values.get(key)??null,setItem:(key:string,value:string)=>{values.set(key,value);},removeItem:(key:string)=>{values.delete(key);}};}
describe("manual workbench input draft (never verification authority)",()=>{
  it("roundtrips exact raw input bytes and strips injected result/status/evidence",()=>{
    const restored=parseLeanDraft(encode({input:{...input,result:{verified:true}},status:"EXACT_SCOPE_VERIFIED",observation:{checks:99},receipt:"fake"}),now);
    expect(restored).toEqual({version:1,savedAt:now,input});
    expect(restored?.input.solver).toBe(input.solver);
  });
  it.each(["{","[]","null",encode({version:2}),encode({savedAt:now+1}),encode({savedAt:now-LEAN_DRAFT_LIFETIME_MS}),encode({input:{...input,adapterId:"UNKNOWN"}}),encode({input:{...input,solver:7}}),encode({input:{...input,statement:"x".repeat(12001)}})," ".repeat(550001)])("rejects malformed, expired or unbounded storage case %#",raw=>{expect(parseLeanDraft(raw,now)).toBeNull();});
  it("separates user and workspace without delimiter collisions",()=>{
    expect(new Set([leanDraftKey("user1","space1"),leanDraftKey("user2","space1"),leanDraftKey("user1","space2"),leanDraftKey("a:b","c"),leanDraftKey("a","b:c")]).size).toBe(5);
  });
  it("reads without writing and saves only on explicit invocation",()=>{
    const storage=memory(),key=leanDraftKey("u","w");
    expect(readLeanDraft(()=>storage,key,now)).toEqual({draft:null,error:false});
    expect(storage.getItem(key)).toBeNull();
    expect(saveLeanDraft(()=>storage,key,input,now)).toBe(true);
    expect(readLeanDraft(()=>storage,key,now).draft?.input).toEqual(input);
    expect(deleteLeanDraft(()=>storage,key)).toBe(true);
    expect(storage.getItem(key)).toBeNull();
  });
  it("removes invalid or expired draft only at the scoped key",()=>{
    const storage=memory();storage.setItem("ours",encode({savedAt:0}));storage.setItem("other","untouched");
    expect(readLeanDraft(()=>storage,"ours",now)).toEqual({draft:null,error:true});
    expect(storage.getItem("ours")).toBeNull();expect(storage.getItem("other")).toBe("untouched");
  });
  it("reports inaccessible storage and quota failure without throwing",()=>{
    const inaccessible=()=>{throw new Error("blocked");};
    expect(readLeanDraft(inaccessible,"key",now)).toEqual({draft:null,error:true});
    expect(saveLeanDraft(inaccessible,"key",input,now)).toBe(false);
    expect(deleteLeanDraft(inaccessible,"key")).toBe(false);
    const storage=memory();storage.setItem=()=>{throw new Error("quota");};
    expect(saveLeanDraft(()=>storage,"key",input,now)).toBe(false);
  });
});
