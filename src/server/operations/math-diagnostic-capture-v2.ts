import "server-only";
import { constants } from "node:fs";
import { open,mkdir,lstat,realpath,readdir,unlink } from "node:fs/promises";
import { dirname,join,resolve,parse } from "node:path";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import { AsyncLocalStorage } from "node:async_hooks";
import { LRC_DURABLE_V2_LIMITS as limits,durableDigest,durableJson,parseDurableBytes,lrcDurableDescriptorSchema,lrcDurableBindingSchema,lrcPreCriticReceiptSchema,lrcPostLedgerReceiptSchema,type LrcDurableDescriptor,type LrcDurableBinding,type LrcPreCriticReceipt,type LrcPostLedgerReceipt } from "@/modules/research-sandbox/math-lrc-durable-replay";
import { preparedLrcMethodUnitInputSchema,validatePreparedLrcMethodUnitInput,type LrcMethodUnitPreparation } from "@/modules/research-sandbox/math-lrc-method-unit-live";
import { diagnosticManifestSchema } from "@/modules/research-sandbox/math-transport-diagnostics";

export type LrcCaptureV2Purpose="BOOTSTRAP"|"ACTIVE_CAPTURE"|"POST_COMMIT";
export interface LrcCaptureV2Handle {readonly version:"OPAQUE_LRC_CAPTURE_V2"}
export type LrcCaptureV2Fence=(purpose:LrcCaptureV2Purpose,descriptor:Readonly<LrcDurableDescriptor>,binding:Readonly<LrcDurableBinding>|null)=>Promise<void>;
export class LrcCaptureV2Error extends Error {constructor(readonly code:string){super(code);this.name="LrcCaptureV2Error";}}
function refuse(code:string):never {throw new LrcCaptureV2Error(code);}
const slotName=/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
const roles=["SOLVER","ADVERSARY","CRITIC"] as const;
const v1=new Set(["reservation.json","prepared.json","stdout.bin","finite.json","manifest.json"]);
const v2=new Set(["reservation.json","binding.json","prepared.json","stdout.bin","finite.json","transport.json","replay.json","admission.json","commit.json"]);
const caps:Record<string,number>={"prepared.json":limits.preparedBytes,"stdout.bin":limits.stdoutBytes,"finite.json":limits.finiteBytes};
type Identity={dev:number;ino:number;uid:number};
type State={descriptor:LrcDurableDescriptor;descriptorDigest:string;binding:LrcDurableBinding|null;bindingDigest:string|null;ids:[string,string,string];finiteDigest:string|null;preDigest:string|null;postDigest:string|null;preparations:Partial<Record<typeof roles[number],LrcMethodUnitPreparation>>;sealed:boolean;failed:boolean};
type Entry={state:State;purpose:LrcCaptureV2Purpose};
function frozen<T>(value:T):T {if(value&&typeof value==="object"){Object.freeze(value);for(const child of Object.values(value))frozen(child);}return value;}
function clonePreparation(v:LrcMethodUnitPreparation):LrcMethodUnitPreparation{return frozen(JSON.parse(durableJson(v,limits.preparedBytes).toString("utf8")) as LrcMethodUnitPreparation);}
function clone<T>(value:T):T{return frozen(JSON.parse(durableJson(value).toString("utf8")) as T);}

/** Test-host storage construction only. No production mint, injected production fence, or private-root IO. */
export class MathDiagnosticCaptureV2Store {
  private readonly root:string;
  private readonly registry=new WeakMap<LrcCaptureV2Handle,Entry>();
  private readonly identities=new Map<string,Identity>();
  private readonly fence:LrcCaptureV2Fence;
  private readonly now:()=>number;
  private readonly fault:(stage:string)=>Promise<void>;
  private readonly ioScope=new AsyncLocalStorage<Entry>();
  constructor(options:{mode:"fixture";fixtureRoot:string;fence:LrcCaptureV2Fence;now?:()=>number;fault?:(stage:string)=>Promise<void>}|{mode:"production"}) {
    if(options.mode!=="fixture")refuse("AUTHENTICATION_REQUIRED");
    if(process.env.NODE_ENV!=="test"||!process.env.VITEST)refuse("FIXTURE_AUTHORITY_REFUSED");
    this.root=resolve(options.fixtureRoot);this.fence=options.fence;this.now=options.now??Date.now;this.fault=options.fault??(async()=>{});
    if(!this.root.startsWith("/private/tmp/")&&!this.root.startsWith(resolve(tmpdir())+"/"))refuse("FIXTURE_ROOT_REFUSED");
  }
  private handle(s:State,purpose:LrcCaptureV2Purpose){const h=Object.freeze({version:"OPAQUE_LRC_CAPTURE_V2" as const});this.registry.set(h,{state:s,purpose});return h;}
  private expiry(s:State){return Math.min(s.descriptor.expiresAt,...(s.binding?[s.binding.solver,s.binding.adversary,s.binding.critic].map(v=>v.leaseExpiresAt):[]));}
  private async io<T>(operation:()=>Promise<T>){const e=this.ioScope.getStore();if(!e)refuse("IO_PURPOSE_REQUIRED");await this.check(e.state,e.purpose);const value=await operation();await this.check(e.state,e.purpose);return value;}
  private async acquire(operation:()=>ReturnType<typeof open>){const e=this.ioScope.getStore();if(!e)refuse("IO_PURPOSE_REQUIRED");await this.check(e.state,e.purpose);const handle=await operation();try{await this.check(e.state,e.purpose);return handle;}catch(error){await handle.close();throw error;}}
  private async check(s:State,purpose:LrcCaptureV2Purpose) {
    if(s.failed)refuse("CAPTURE_QUARANTINED");
    if(this.now()<s.descriptor.createdAt||this.now()>=this.expiry(s))refuse("CAPTURE_EXPIRED");
    if(s.binding&&purpose==="ACTIVE_CAPTURE"&&roles.some((_,i)=>this.now()>=[s.binding!.solver,s.binding!.adversary,s.binding!.critic][i].leaseExpiresAt))refuse("OWNED_CLAIM_EXPIRED");
    await this.fence(purpose,clone(s.descriptor),s.binding?clone(s.binding):null);
  }
  private entry(h:LrcCaptureV2Handle,purpose:LrcCaptureV2Purpose){const e=this.registry.get(h);if(!e||e.purpose!==purpose)refuse("OPAQUE_PURPOSE_REFUSED");return e.state;}
  private async guarded<T>(h:LrcCaptureV2Handle,purpose:LrcCaptureV2Purpose,work:(s:State)=>Promise<T>):Promise<T> {
    const s=this.entry(h,purpose);await this.check(s,purpose);
    try{return await this.ioScope.run({state:s,purpose},async()=>{const result=await work(s);await this.check(s,purpose);return result;});}catch(error){s.failed=true;throw error;}
  }
  private async chain(path:string) {
    const ancestors:string[]=[];let p=path;while(p!==parse(p).root){ancestors.unshift(p);p=dirname(p);}
    for(const dir of ancestors){const st=await this.io(()=>lstat(dir));if(!st.isDirectory()||st.isSymbolicLink()||await this.io(()=>realpath(dir))!==dir)refuse("PATH_IDENTITY_REFUSED");
      const own=process.getuid?.();if(own!==undefined&&st.uid!==own&&st.uid!==0)refuse("PATH_OWNER_REFUSED");
      if((dir===this.root||dir.startsWith(this.root+"/"))&&((st.mode&0o777)!==0o700||st.uid!==own))refuse("PATH_OWNER_REFUSED");
      const old=this.identities.get(dir);if(old&&(old.dev!==st.dev||old.ino!==st.ino||old.uid!==st.uid))refuse("PATH_IDENTITY_REFUSED");
      this.identities.set(dir,{dev:st.dev,ino:st.ino,uid:st.uid});}
  }
  private async syncDir(dir:string){await this.chain(dir);const h=await this.acquire(()=>open(dir,constants.O_RDONLY|constants.O_NOFOLLOW));try{const s=await this.io(()=>h.stat()),p=this.identities.get(dir)!;if(s.dev!==p.dev||s.ino!==p.ino)refuse("PATH_IDENTITY_REFUSED");await this.io(()=>this.fault("directory-sync"));await this.io(()=>h.sync());await this.chain(dir);}finally{await h.close();}}
  private async create(dir:string,name:string,bytes:Buffer) {
    if(!v2.has(name)||bytes.length>(caps[name]??limits.controlBytes))refuse("INPUT_SIZE_LIMIT");
    await this.chain(dir);if(!caps[name]){let control=bytes.length;for(const f of await this.io(()=>readdir(dir))){if(!v2.has(f))refuse("UNKNOWN_CAPTURE_FILE");if(!caps[f])control+=(await this.io(()=>lstat(join(dir,f)))).size;}if(control>limits.controlBytes)refuse("CONTROL_QUOTA_EXHAUSTED");}
    await this.io(()=>this.fault("before-create:"+name));const path=join(dir,name),h=await this.acquire(()=>open(path,constants.O_WRONLY|constants.O_CREAT|constants.O_EXCL|constants.O_NOFOLLOW,0o600));
    try{const s=await this.io(()=>h.stat());if(!s.isFile()||s.nlink!==1||(s.mode&0o777)!==0o600||s.uid!==process.getuid?.())refuse("PATH_IDENTITY_REFUSED");
      for(let offset=0;offset<bytes.length;){await this.io(()=>this.fault("write:"+name));const r=await this.io(()=>h.write(bytes,offset,bytes.length-offset,null));if(!Number.isSafeInteger(r.bytesWritten)||r.bytesWritten<=0)refuse("CAPTURE_WRITE_FAILED");offset+=r.bytesWritten;}
      await this.io(()=>this.fault("file-sync:"+name));await this.io(()=>h.sync());const after=await this.io(()=>lstat(path));if(after.dev!==s.dev||after.ino!==s.ino||after.nlink!==1||after.isSymbolicLink())refuse("PATH_IDENTITY_REFUSED");await this.chain(dir);
    }finally{await h.close();}await this.syncDir(dir);
  }
  private async read(dir:string,name:string,cap=caps[name]??limits.controlBytes) {
    await this.chain(dir);const path=join(dir,name),before=await this.io(()=>lstat(path));
    if(!before.isFile()||before.isSymbolicLink()||before.nlink!==1||(before.mode&0o777)!==0o600||before.size>cap||before.uid!==process.getuid?.())refuse("CAPTURE_INTEGRITY_REFUSED");
    const h=await this.acquire(()=>open(path,constants.O_RDONLY|constants.O_NOFOLLOW));try{const initial=await this.io(()=>h.stat());if(initial.dev!==before.dev||initial.ino!==before.ino)refuse("PATH_IDENTITY_REFUSED");const chunks:Buffer[]=[];let size=0;
      for(;;){await this.io(()=>this.fault("read:"+name));const chunk=Buffer.alloc(Math.min(65536,cap+1-size)),r=await this.io(()=>h.read(chunk,0,chunk.length,null));if(!r.bytesRead)break;size+=r.bytesRead;if(size>cap)refuse("INPUT_SIZE_LIMIT");chunks.push(chunk.subarray(0,r.bytesRead));}
      const final=await this.io(()=>h.stat()),at=await this.io(()=>lstat(path));await this.chain(dir);
      if(size!==initial.size||final.ctimeMs!==initial.ctimeMs||final.mtimeMs!==initial.mtimeMs||at.dev!==initial.dev||at.ino!==initial.ino||at.nlink!==1||at.isSymbolicLink())refuse("CAPTURE_INTEGRITY_REFUSED");return Buffer.concat(chunks);
    }finally{await h.close();}
  }
  private async quota() {
    const names=await this.io(()=>readdir(this.root));if(names.length>101)refuse("QUOTA_EXHAUSTED");let count=0,bytes=0;const intents=new Set<string>(),groups=new Map<string,{signature:string;roles:Set<string>}>();
    for(const name of names){if(name==="quota.lock")continue;if(!slotName.test(name))refuse("UNKNOWN_ROOT_ENTRY");count++;const dir=join(this.root,name);await this.chain(dir);const files=await this.io(()=>readdir(dir));let actual=0,control=0;
      if(!files.includes("reservation.json"))refuse("INCOMPLETE_ALLOCATION");
      const raw=parseDurableBytes(await this.read(dir,"reservation.json"),limits.controlBytes);
      const isV2=!!raw&&typeof raw==="object"&&"version" in raw&&raw.version==="LRC_CAPTURE_RESERVATION_V2";
      if(isV2){const r=raw as Record<string,unknown>;if(Object.keys(r).some(k=>!["version","intentKey","descriptor","slotIds","role"].includes(k))||typeof r.intentKey!=="string"||!/^[a-f0-9]{64}$/.test(r.intentKey)||!Array.isArray(r.slotIds)||r.slotIds.length!==3||r.slotIds.some(i=>typeof i!=="string"||!slotName.test(i))||!roles.includes(r.role as typeof roles[number]))refuse("UNKNOWN_RESERVATION");
        const d=lrcDurableDescriptorSchema.parse(r.descriptor),ids=r.slotIds as string[];if(new Set(ids).size!==3||ids[roles.indexOf(r.role as typeof roles[number])]!==name||ids.some(id=>!names.includes(id))||r.intentKey!==durableDigest(durableDigest(durableJson(d))+":"+d.approvedNonce))refuse("UNKNOWN_RESERVATION");const signature=durableJson({descriptor:d,slotIds:ids}).toString(),prior=groups.get(r.intentKey);if(prior&&(prior.signature!==signature||prior.roles.has(String(r.role))))refuse("UNKNOWN_RESERVATION");const group=prior??{signature,roles:new Set<string>()};group.roles.add(String(r.role));groups.set(r.intentKey,group);intents.add(r.intentKey);
      }else {const m=diagnosticManifestSchema.parse(raw);if(m.captureId!==name||m.binding.dispatchId!==name)refuse("UNKNOWN_RESERVATION");}
      for(const f of files){if(!(isV2?v2:v1).has(f))refuse("UNKNOWN_CAPTURE_FILE");const cap=caps[f]??limits.controlBytes;const b=await this.read(dir,f,cap);actual+=b.length;if(!caps[f])control+=b.length;}
      if(control>limits.controlBytes)refuse("CONTROL_QUOTA_EXHAUSTED");bytes+=Math.max(actual,limits.slotBytes);}
    if([...groups.values()].some(g=>g.roles.size!==3))refuse("INCOMPLETE_ALLOCATION");return {count,bytes,intents};
  }
  async reserveThreeRoles(raw:unknown):Promise<LrcCaptureV2Handle> {
    durableJson(raw);const descriptor=clone(lrcDurableDescriptorSchema.parse(raw)),descriptorDigest=durableDigest(durableJson(descriptor));
    const s:State={descriptor,descriptorDigest,binding:null,bindingDigest:null,ids:[randomUUID(),randomUUID(),randomUUID()],finiteDigest:null,preDigest:null,postDigest:null,preparations:{},sealed:false,failed:false};
    await this.check(s,"BOOTSTRAP");
    return this.ioScope.run({state:s,purpose:"BOOTSTRAP"},()=>this.allocate(s));
  }
  private async allocate(s:State):Promise<LrcCaptureV2Handle> {
    const {descriptor,descriptorDigest}=s;
    // All descriptor + binding + both receipt worst-case control headroom is reserved pre-dispatch.
    if(durableJson(descriptor).length+8192>limits.controlBytes)refuse("CONTROL_PREFLIGHT_REFUSED");
    await this.chain(dirname(this.root));try{await this.io(()=>mkdir(this.root,{mode:0o700}));}catch(e){if((e as NodeJS.ErrnoException).code!=="EEXIST")throw e;}await this.chain(this.root);
    const lock=join(this.root,"quota.lock");let h;
    try{h=await this.acquire(()=>open(lock,constants.O_CREAT|constants.O_EXCL|constants.O_WRONLY|constants.O_NOFOLLOW,0o600));}catch{refuse("QUOTA_LOCK_UNAVAILABLE");}
    let lockStat:Awaited<ReturnType<typeof h.stat>>|null=null;let success=false;
    try{lockStat=await this.io(()=>h.stat());if(!lockStat.isFile()||lockStat.nlink!==1||(lockStat.mode&0o777)!==0o600||lockStat.uid!==process.getuid?.())refuse("PATH_IDENTITY_REFUSED");await this.io(()=>h.sync());await this.syncDir(this.root);const q=await this.quota(),intentKey=durableDigest(descriptorDigest+":"+descriptor.approvedNonce);
      if(q.intents.has(intentKey))refuse("INTENT_ALREADY_SPENT");if(q.count+3>limits.slots||q.bytes+3*limits.slotBytes>limits.rootBytes)refuse("QUOTA_EXHAUSTED");
      for(let i=0;i<3;i++){await this.check(s,"BOOTSTRAP");const dir=join(this.root,s.ids[i]);await this.io(()=>mkdir(dir,{mode:0o700}));await this.syncDir(this.root);await this.create(dir,"reservation.json",durableJson({version:"LRC_CAPTURE_RESERVATION_V2",intentKey,descriptor,slotIds:s.ids,role:roles[i]}));}
      await this.check(s,"BOOTSTRAP");success=true;return this.handle(s,"BOOTSTRAP");
    }catch(e){s.failed=true;throw e;}finally{await h.close();if(success&&lockStat){await this.chain(this.root);const actual=await this.io(()=>lstat(lock));if(actual.dev!==lockStat.dev||actual.ino!==lockStat.ino||actual.nlink!==1||actual.isSymbolicLink())refuse("PATH_IDENTITY_REFUSED");await this.io(()=>unlink(lock));await this.syncDir(this.root);}}
  }
  async bind(handle:LrcCaptureV2Handle,raw:unknown):Promise<LrcCaptureV2Handle> {
    return this.guarded(handle,"BOOTSTRAP",async s=>{if(s.binding)refuse("BINDING_ALREADY_EXISTS");durableJson(raw);const binding=clone(lrcDurableBindingSchema.parse(raw));if(durableJson(binding.context).toString()!==durableJson(s.descriptor.context).toString())refuse("CONTEXT_BINDING_MISMATCH");s.binding=binding;s.bindingDigest=durableDigest(durableJson(binding));await this.check(s,"ACTIVE_CAPTURE");await this.ioScope.run({state:s,purpose:"ACTIVE_CAPTURE"},async()=>{for(const id of s.ids)await this.create(join(this.root,id),"binding.json",durableJson(binding));});return this.handle(s,"ACTIVE_CAPTURE");});
  }
  async purpose(handle:LrcCaptureV2Handle,purpose:"POST_COMMIT"):Promise<LrcCaptureV2Handle> {const s=this.entry(handle,"ACTIVE_CAPTURE");if(!s.preDigest||!s.binding)refuse("PRECRITIC_RECEIPT_MISSING");await this.check(s,purpose);const h=this.handle(s,purpose);await this.check(s,purpose);return h;}
  async describe(handle:LrcCaptureV2Handle){const e=this.registry.get(handle);if(!e)refuse("OPAQUE_PURPOSE_REFUSED");return this.guarded(handle,e.purpose,async s=>({descriptor:clone(s.descriptor),descriptorDigest:s.descriptorDigest,binding:s.binding?clone(s.binding):null,bindingDigest:s.bindingDigest}));}
  async writeFinite(handle:LrcCaptureV2Handle,bytes:Buffer,expectedDigest:string){return this.guarded(handle,"ACTIVE_CAPTURE",async s=>{if(s.finiteDigest||!s.binding)refuse("FINITE_ALREADY_EXISTS");parseDurableBytes(bytes,limits.finiteBytes);if(durableDigest(bytes)!==expectedDigest)refuse("FINITE_BYTES_MISMATCH");await this.create(join(this.root,s.ids[2]),"finite.json",Buffer.from(bytes));s.finiteDigest=expectedDigest;});}
  async readStagedFinite(handle:LrcCaptureV2Handle){return this.guarded(handle,"ACTIVE_CAPTURE",async s=>{if(!s.finiteDigest)refuse("FINITE_MISSING");const b=await this.read(join(this.root,s.ids[2]),"finite.json");if(durableDigest(b)!==s.finiteDigest)refuse("FINITE_BYTES_MISMATCH");return b;});}
  async writeRoleCapture(handle:LrcCaptureV2Handle,role:typeof roles[number],prepared:Buffer,stdout:Buffer,expectedPreparation:LrcMethodUnitPreparation){return this.guarded(handle,"ACTIVE_CAPTURE",async s=>{
    const i=roles.indexOf(role);if(i<0||!s.binding||prepared.length>limits.preparedBytes||stdout.length>limits.stdoutBytes)refuse("ROLE_CAPTURE_REFUSED");
    durableJson(expectedPreparation,limits.preparedBytes);const expected=clonePreparation(expectedPreparation),parsed=preparedLrcMethodUnitInputSchema.parse(parseDurableBytes(prepared,limits.preparedBytes));
    if(expected.role!==role||expected.caseId!==s.binding.caseId||expected.runId!==s.binding.runId||expected.contractDigest!==s.descriptor.contractDigest||expected.requestedModelName!=="gpt-6-sol"||!validatePreparedLrcMethodUnitInput(parsed,expected))refuse("PREPARED_ROLE_BINDING_REFUSED");
    if(role==="CRITIC"){const actual=await this.read(join(this.root,s.ids[2]),"finite.json");if(!s.finiteDigest||durableDigest(actual)!==s.finiteDigest||!expected.finiteEvidence||durableJson(parseDurableBytes(actual,limits.finiteBytes),limits.finiteBytes).toString()!==durableJson(expected.finiteEvidence,limits.finiteBytes).toString()||expected.finiteSourcePins?.producerSourceSha256!==s.descriptor.sourcePins["src/modules/research-sandbox/math-lrc-method-unit.ts"]||expected.finiteSourcePins?.checkerSourceSha256!==s.descriptor.sourcePins["src/modules/research-sandbox/math-lrc-method-unit.ts"])refuse("PREPARED_FINITE_BINDING_REFUSED");}
    new TextDecoder("utf-8",{fatal:true}).decode(stdout);const dir=join(this.root,s.ids[i]);await this.create(dir,"prepared.json",Buffer.from(prepared));await this.create(dir,"stdout.bin",Buffer.from(stdout));
    const preparedByteDigest=durableDigest(prepared),roleInputDigest=parsed.inputDigest,b=durableJson({version:"LRC_ROLE_TRANSPORT_V2",bindingDigest:s.bindingDigest,role,preparedByteDigest,roleInputDigest,stdoutDigest:durableDigest(stdout)});
    await this.create(dir,"transport.json",b);s.preparations[role]=expected;return {roleInputDigest,preparedByteDigest,transportManifestDigest:durableDigest(b)};
  });}
  private async transportAnchors(s:State,r:LrcPostLedgerReceipt){for(let i=0;i<3;i++){
    const role=roles[i],dir=join(this.root,s.ids[i]),prepared=await this.read(dir,"prepared.json"),stdout=await this.read(dir,"stdout.bin"),manifest=await this.read(dir,"transport.json"),parsed=preparedLrcMethodUnitInputSchema.parse(parseDurableBytes(prepared,limits.preparedBytes)),preparation=s.preparations[role];
    const expected=durableJson({version:"LRC_ROLE_TRANSPORT_V2",bindingDigest:s.bindingDigest,role,preparedByteDigest:durableDigest(prepared),roleInputDigest:parsed.inputDigest,stdoutDigest:durableDigest(stdout)});
    if(!preparation||!validatePreparedLrcMethodUnitInput(parsed,preparation)||role!=="SOLVER"&&preparation.solverAttemptDigest!==r.solverAttemptDigest||durableDigest(prepared)!==r.preparedByteDigests[i]||parsed.inputDigest!==r.roleInputDigests[i]||durableDigest(manifest)!==r.transportManifestDigests[i]||!manifest.equals(expected))refuse("TRANSPORT_ANCHOR_REFUSED");
  }}
  private async finiteAnchors(s:State,r:LrcPreCriticReceipt){const bytes=await this.read(join(this.root,s.ids[2]),"finite.json");if(durableDigest(bytes)!==s.finiteDigest)refuse("FINITE_BYTES_MISMATCH");const f=parseDurableBytes(bytes,limits.finiteBytes) as Record<string,unknown>,b=f.binding as Record<string,unknown>,c=f.checker as Record<string,unknown>,p=f.producer as Record<string,unknown>;
    if(!b||!c||!p||f.status!=="CHECKED_FINITE"||f.predicateId!=="SHIFT_PHASE_PARTITION_AND_COMMON_SHIFT_FINITE_V1"||f.unitDigest!==s.descriptor.unitDigest||f.unitDigest!==r.unitDigest||f.seedDigest!==r.seedDigest||f.recordDigest!==r.finiteRecordDigest||f.inputDigest!==r.inputDigest||r.replayInputDigest!==r.inputDigest||f.certificateDigest!==r.certificateDigest||c.outputDigest!==r.originalResultDigest||b.caseId!==s.binding?.caseId||b.runId!==s.binding?.runId||b.reviewJobId!==s.binding?.critic.jobId||b.contractDigest!==s.descriptor.contractDigest||b.solverAttemptDigest!==r.solverAttemptDigest||b.adversaryReportDigest!==r.adversaryReportDigest||c.sourceSha256!==s.descriptor.sourcePins["src/modules/research-sandbox/math-lrc-method-unit.ts"]||p.sourceSha256!==s.descriptor.sourcePins["src/modules/research-sandbox/math-lrc-method-unit.ts"]||r.replayCheckerSourceDigest!==s.descriptor.sourcePins["src/modules/research-sandbox/math-lrc-shift-replay.ts"])refuse("FINITE_ANCHOR_REFUSED");}
  async writePreCriticReceipt(handle:LrcCaptureV2Handle,raw:unknown){return this.guarded(handle,"ACTIVE_CAPTURE",async s=>{durableJson(raw);const receipt=lrcPreCriticReceiptSchema.parse(raw);if(!s.binding||!s.finiteDigest||s.preDigest||receipt.descriptorDigest!==s.descriptorDigest||receipt.bindingDigest!==s.bindingDigest||receipt.finiteByteDigest!==s.finiteDigest||receipt.seedDigest!==s.descriptor.seedDigest||receipt.expiresAt>this.expiry(s)||receipt.createdAt>this.now()||receipt.expiresAt<=this.now())refuse("PRECRITIC_BINDING_REFUSED");await this.finiteAnchors(s,receipt);const bytes=durableJson(receipt);await this.create(join(this.root,s.ids[2]),"replay.json",bytes);s.preDigest=durableDigest(bytes);return s.preDigest;});}
  async readPreCriticReceipt(handle:LrcCaptureV2Handle){return this.guarded(handle,"ACTIVE_CAPTURE",async s=>{if(!s.preDigest)refuse("PRECRITIC_RECEIPT_MISSING");const bytes=await this.read(join(this.root,s.ids[2]),"replay.json");if(durableDigest(bytes)!==s.preDigest)refuse("RECEIPT_DRIFT");return {receipt:lrcPreCriticReceiptSchema.parse(parseDurableBytes(bytes,limits.controlBytes)),digest:s.preDigest};});}
  async writePostLedgerReceipt(handle:LrcCaptureV2Handle,raw:unknown){return this.guarded(handle,"POST_COMMIT",async s=>{durableJson(raw);const r=lrcPostLedgerReceiptSchema.parse(raw);if(!s.preDigest||s.postDigest||r.descriptorDigest!==s.descriptorDigest||r.bindingDigest!==s.bindingDigest||r.preCriticReceiptDigest!==s.preDigest||r.expiresAt>this.expiry(s)||r.createdAt>this.now()||r.expiresAt<=this.now())refuse("POSTLEDGER_BINDING_REFUSED");const pre=lrcPreCriticReceiptSchema.parse(parseDurableBytes(await this.read(join(this.root,s.ids[2]),"replay.json"),limits.controlBytes));if(r.expiresAt>pre.expiresAt||r.solverAttemptDigest!==pre.solverAttemptDigest||r.adversaryReportDigest!==pre.adversaryReportDigest||r.finalFiniteMetrics.originalOperations!==pre.metrics.originalOperations||r.finalFiniteMetrics.replayOperations!==pre.metrics.replayOperations||r.finalFiniteMetrics.originalElapsedMs!==pre.metrics.originalElapsedMs||r.finalFiniteMetrics.replayElapsedMs!==pre.metrics.replayElapsedMs||r.finalFiniteMetrics.aggregateElapsedMs<pre.metrics.aggregateElapsedMs)refuse("POSTLEDGER_BINDING_REFUSED");await this.finiteAnchors(s,pre);await this.transportAnchors(s,r);const b=durableJson(r);await this.create(join(this.root,s.ids[2]),"admission.json",b);s.postDigest=durableDigest(b);return s.postDigest;});}
  async commit(handle:LrcCaptureV2Handle){return this.guarded(handle,"POST_COMMIT",async s=>{if(!s.preDigest||!s.postDigest||s.sealed)refuse("COMMIT_REFUSED");const b=durableJson({version:"LRC_DURABLE_COMMIT_V2",descriptorDigest:s.descriptorDigest,bindingDigest:s.bindingDigest,preCriticReceiptDigest:s.preDigest,postLedgerReceiptDigest:s.postDigest});await this.create(join(this.root,s.ids[2]),"commit.json",b);s.sealed=true;return durableDigest(b);});}
  async readCommitted(handle:LrcCaptureV2Handle){return this.guarded(handle,"POST_COMMIT",async s=>{if(!s.sealed||!s.preDigest||!s.postDigest)refuse("COMMIT_MISSING");const dir=join(this.root,s.ids[2]),finite=await this.read(dir,"finite.json"),pb=await this.read(dir,"replay.json"),ab=await this.read(dir,"admission.json"),cb=await this.read(dir,"commit.json");
    if(durableDigest(finite)!==s.finiteDigest||durableDigest(pb)!==s.preDigest||durableDigest(ab)!==s.postDigest)refuse("RECEIPT_DRIFT");
    const expected=durableJson({version:"LRC_DURABLE_COMMIT_V2",descriptorDigest:s.descriptorDigest,bindingDigest:s.bindingDigest,preCriticReceiptDigest:s.preDigest,postLedgerReceiptDigest:s.postDigest});if(!cb.equals(expected))refuse("COMMIT_DRIFT");await this.transportAnchors(s,lrcPostLedgerReceiptSchema.parse(parseDurableBytes(ab,limits.controlBytes)));return {preCritic:lrcPreCriticReceiptSchema.parse(parseDurableBytes(pb,limits.controlBytes)),postLedger:lrcPostLedgerReceiptSchema.parse(parseDurableBytes(ab,limits.controlBytes)),commitDigest:durableDigest(cb)};});}
}
