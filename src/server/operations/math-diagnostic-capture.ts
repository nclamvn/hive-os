import { constants } from "node:fs";
import { open,mkdir,lstat,realpath,readdir,unlink,rmdir } from "node:fs/promises";
import { dirname,join,resolve,parse } from "node:path";
import { randomUUID } from "node:crypto";
import { MATH_DIAGNOSTIC_LIMITS as limits,MATH_DIAGNOSTIC_ROOT,MathDiagnosticError,diagnosticDigest,diagnosticManifestSchema,sameDiagnosticBinding,
  type DiagnosticBinding,type DiagnosticManifest,type DiagnosticReason } from "@/modules/research-sandbox/math-transport-diagnostics";
import { requireDiagnosticGrant,type DiagnosticGrant } from "./math-diagnostic-auth";
import { observeMathTransportAccounting } from "@/modules/research-sandbox/math-transport-admission";

const captureId=/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
const allowed=new Set(["reservation.json","prepared.json","stdout.bin","finite.json","manifest.json"]);
const fileCaps:Record<string,number>={"reservation.json":limits.manifestBytes,"prepared.json":limits.preparedBytes,"stdout.bin":limits.stdoutBytes,"finite.json":limits.finiteBytes,"manifest.json":limits.manifestBytes};
export async function writeCompleteDiagnosticBytes(buffer:Buffer,io:{write:(buffer:Buffer,offset:number,length:number)=>Promise<{bytesWritten:number}>;sync:()=>Promise<void>}) {
  for(let offset=0;offset<buffer.length;) {
    const remaining=buffer.length-offset,{bytesWritten}=await io.write(buffer,offset,remaining);
    if(!Number.isSafeInteger(bytesWritten)||bytesWritten<=0||bytesWritten>remaining)throw new MathDiagnosticError("CAPTURE_WRITE_FAILED");
    offset+=bytesWritten;
  }
  try{await io.sync();}catch{throw new MathDiagnosticError("CAPTURE_SYNC_FAILED");}
}
export async function readBoundedDiagnosticBytes(cap:number,read:(buffer:Buffer)=>Promise<{bytesRead:number}>,check:()=>void) {
  if(!Number.isSafeInteger(cap)||cap<0||cap>limits.stdoutBytes)throw new MathDiagnosticError("CAPTURE_INTEGRITY_REFUSED");
  const chunks:Buffer[]=[];let length=0;
  for(;;){check();const buffer=Buffer.alloc(Math.min(65536,cap+1-length));const {bytesRead}=await read(buffer);
    if(!Number.isSafeInteger(bytesRead)||bytesRead<0||bytesRead>buffer.length)throw new MathDiagnosticError("CAPTURE_INTEGRITY_REFUSED");
    if(!bytesRead)break;length+=bytesRead;if(length>cap)throw new MathDiagnosticError("CAPTURE_INTEGRITY_REFUSED");chunks.push(buffer.subarray(0,bytesRead));}
  check();return Buffer.concat(chunks);
}
export interface DiagnosticCaptureHandle {readonly captureId:string}
interface State {binding:DiagnosticBinding;grant:DiagnosticGrant;manifest:DiagnosticManifest;dir:string;input:boolean;closed:boolean;retained:boolean;reservationBytes:number;chunks:Buffer[]}
export interface PreparedDiagnosticInput {stdin:string;schemaText:string;rendererVersion:string;[key:string]:unknown}

/** No initialization/import filesystem effects. Production root is fixed and separately permission-gated. */
export class MathDiagnosticCaptureStore {
  private readonly states=new WeakMap<DiagnosticCaptureHandle,State>();
  private readonly root:string;
  private readonly identities=new Map<string,{dev:number;ino:number}>();
  constructor(options:{mode:"fixture";fixtureRoot:string;now?:()=>number}|{mode:"production";filesystemApproved:boolean;now?:()=>number}) {
    if(options.mode==="fixture") {
      if(process.env.NODE_ENV!=="test" || !process.env.VITEST || !options.fixtureRoot || options.fixtureRoot===MATH_DIAGNOSTIC_ROOT)throw new MathDiagnosticError("ROOT_PERMISSION_UNAVAILABLE");
      this.root=resolve(options.fixtureRoot);
    } else {
      if(!options.filesystemApproved || !["development","test"].includes(process.env.NODE_ENV??""))throw new MathDiagnosticError("ROOT_PERMISSION_UNAVAILABLE");
      this.root=MATH_DIAGNOSTIC_ROOT;
    }
    this.now=options.now??Date.now;
  }
  private readonly now:()=>number;
  private async directory(path:string,privateMode=false) {
    const s=await lstat(path);
    if(!s.isDirectory()||s.isSymbolicLink()||await realpath(path)!==path)throw new MathDiagnosticError("PATH_IDENTITY_REFUSED");
    const pin=this.identities.get(path);
    if(pin&&(pin.dev!==s.dev||pin.ino!==s.ino))throw new MathDiagnosticError("PATH_IDENTITY_REFUSED");
    if(privateMode&&((s.mode&0o777)!==0o700||process.getuid&&s.uid!==process.getuid()))throw new MathDiagnosticError("PATH_IDENTITY_REFUSED");
    this.identities.set(path,{dev:s.dev,ino:s.ino});
    return s;
  }
  private async rootReady(create=true) {
    const segments:string[]=[];let path=this.root;
    while(path!==parse(path).root){segments.unshift(path);path=dirname(path);}
    for(const segment of segments) {
      if(segment===this.root&&create) {try{await mkdir(segment,{mode:0o700});}catch(e){if((e as NodeJS.ErrnoException).code!=="EEXIST")throw new MathDiagnosticError("ROOT_PERMISSION_UNAVAILABLE");}}
      const s=await this.directory(segment);
      if(segment===this.root && ((s.mode&0o777)!==0o700 || process.getuid && s.uid!==process.getuid()))throw new MathDiagnosticError("PATH_IDENTITY_REFUSED");
    }
  }
  private async chain(path:string) {
    await this.rootReady(false);let p=path;const below:string[]=[];
    while(p!==this.root){if(!p.startsWith(this.root+"/"))throw new MathDiagnosticError("PATH_IDENTITY_REFUSED");below.unshift(p);p=dirname(p);}
    for(const dir of below)await this.directory(dir,true);
  }
  private deadline(started:number){if(performance.now()-started>=limits.operationMs)throw new MathDiagnosticError("OPERATION_DEADLINE");}
  private async syncDirectory(path:string) {await this.chain(path);const h=await open(path,constants.O_RDONLY|constants.O_NOFOLLOW);try{const s=await h.stat(),pin=this.identities.get(path)!;if(s.dev!==pin.dev||s.ino!==pin.ino)throw new MathDiagnosticError("PATH_IDENTITY_REFUSED");await h.sync();await this.chain(path);}finally{await h.close();}}
  private async create(path:string,buffer:Buffer) {
    await this.chain(dirname(path));
    const h=await open(path,constants.O_CREAT|constants.O_EXCL|constants.O_WRONLY|constants.O_NOFOLLOW,0o600);
    try{const s=await h.stat();if(!s.isFile()||s.nlink!==1||(s.mode&0o777)!==0o600)throw new MathDiagnosticError("PATH_IDENTITY_REFUSED");
      await writeCompleteDiagnosticBytes(buffer,{write:(b,o,n)=>h.write(b,o,n,null),sync:()=>h.sync()});
      const after=await lstat(path);if(after.ino!==s.ino||after.dev!==s.dev||after.nlink!==1||after.isSymbolicLink())throw new MathDiagnosticError("PATH_IDENTITY_REFUSED");
      await this.chain(dirname(path));
    }finally{await h.close();}
    await this.syncDirectory(dirname(path));
  }
  private async read(dir:string,name:string,started=performance.now(),cap=fileCaps[name]) {
    this.deadline(started);await this.chain(dir);const path=join(dir,name),before=await lstat(path);
    if(!Number.isSafeInteger(cap)||!before.isFile()||before.isSymbolicLink()||before.nlink!==1||before.size>cap||(before.mode&0o777)!==0o600||process.getuid&&before.uid!==process.getuid())throw new MathDiagnosticError("CAPTURE_INTEGRITY_REFUSED");
    const h=await open(path,constants.O_RDONLY|constants.O_NOFOLLOW);
    try {const initial=await h.stat();if(initial.ino!==before.ino||initial.dev!==before.dev)throw new MathDiagnosticError("PATH_IDENTITY_REFUSED");
      const bytes=await readBoundedDiagnosticBytes(cap,b=>h.read(b,0,b.length,null),()=>this.deadline(started));const after=await h.stat(),atPath=await lstat(path);await this.chain(dir);this.deadline(started);
      if(bytes.length!==initial.size||after.mtimeMs!==initial.mtimeMs||after.ctimeMs!==initial.ctimeMs||atPath.ino!==initial.ino||atPath.dev!==initial.dev||atPath.nlink!==1||atPath.isSymbolicLink())throw new MathDiagnosticError("CAPTURE_INTEGRITY_REFUSED");
      return bytes;
    }finally{await h.close();}
  }
  private async locked<T>(work:(started:number)=>Promise<T>,checkAfter=true) {
    await this.rootReady();const path=join(this.root,"quota.lock");let h;
    try{h=await open(path,constants.O_CREAT|constants.O_EXCL|constants.O_WRONLY|constants.O_NOFOLLOW,0o600);}catch{throw new MathDiagnosticError("QUOTA_LOCK_UNAVAILABLE");}
    const initial=await h.stat();const started=performance.now();
    try{await h.sync();await this.chain(this.root);const result=await work(started);if(checkAfter)this.deadline(started);return result;}
    finally{await h.close();await this.chain(this.root);const current=await lstat(path);if(current.ino!==initial.ino||current.dev!==initial.dev||current.isSymbolicLink())throw new MathDiagnosticError("PATH_IDENTITY_REFUSED");await unlink(path);await this.syncDirectory(this.root);}
  }
  private async quota(started:number) {
    const names=await readdir(this.root);if(names.length>limits.captures+2)throw new MathDiagnosticError("QUOTA_EXHAUSTED");
    let count=0,bytes=0;
    for(const name of names) {
      if(name==="quota.lock")continue;
      this.deadline(started);
      if(name==="maintenance") {const dir=join(this.root,name);await this.chain(dir);const receipts=await readdir(dir);if(receipts.length>200)throw new MathDiagnosticError("QUOTA_EXHAUSTED");for(const receipt of receipts){this.deadline(started);if(!/^[a-f0-9-]{36}\.(intent|receipt)\.json$/.test(receipt))throw new MathDiagnosticError("PATH_IDENTITY_REFUSED");bytes+=(await this.read(dir,receipt,started,limits.manifestBytes)).length;}continue;}
      if(!captureId.test(name))throw new MathDiagnosticError("PATH_IDENTITY_REFUSED");
      const dir=join(this.root,name);await this.chain(dir);count++;
      const files=await readdir(dir);if(files.length>allowed.size)throw new MathDiagnosticError("PATH_IDENTITY_REFUSED");
      let actual=0,control=0;
      for(const file of files){this.deadline(started);if(!allowed.has(file))throw new MathDiagnosticError("PATH_IDENTITY_REFUSED");const s=await lstat(join(dir,file));if(!s.isFile()||s.isSymbolicLink()||s.nlink!==1||s.size>fileCaps[file]||(s.mode&0o777)!==0o600||process.getuid&&s.uid!==process.getuid())throw new MathDiagnosticError("PATH_IDENTITY_REFUSED");actual+=s.size;if(file==="reservation.json"||file==="manifest.json")control+=s.size;}if(control>limits.manifestBytes)throw new MathDiagnosticError("PATH_IDENTITY_REFUSED");await this.chain(dir);
      // Conservative abandoned slots remain fully charged, even with no reservation bytes.
      bytes+=Math.max(actual,limits.reserveBytes);
    }
    return {count,bytes};
  }
  async reserve(grant:DiagnosticGrant,binding:DiagnosticBinding,pins:{parserVersion:string;sourcePins:Record<string,string>}) {
    await requireDiagnosticGrant(grant,binding,"capture");
    return this.locked(async(started)=> {
      const id=binding.dispatchId,dir=join(this.root,id);
      if(await lstat(dir).then(()=>true,e=>{if((e as NodeJS.ErrnoException).code==="ENOENT")return false;throw e;}))throw new MathDiagnosticError("CAPTURE_ALREADY_EXISTS");
      const q=await this.quota(started);if(q.count>=limits.captures||q.bytes+limits.reserveBytes+limits.manifestBytes>limits.rootBytes)throw new MathDiagnosticError("QUOTA_EXHAUSTED");
      const now=this.now();
      const manifest=diagnosticManifestSchema.parse({version:"MATH_TRANSPORT_DIAGNOSTIC_V1",captureId:id,binding,createdAt:now,expiresAt:now+limits.replayAgeMs,
        stage:"RESERVED",completeness:"NOT_DISPATCHED",reason:null,rendererVersion:"UNPREPARED",...pins,preparedDigest:diagnosticDigest(""),stdinDigest:diagnosticDigest(""),schemaDigest:diagnosticDigest(""),stdoutDigest:diagnosticDigest(""),finiteDigest:null,preparedBytes:0,stdoutBytes:0,observedBytes:0,finiteBytes:0,accounting:{status:"UNAVAILABLE",threadId:null,usage:null}});
      const reservation=Buffer.from(JSON.stringify(manifest));if(reservation.length>limits.manifestBytes/2)throw new MathDiagnosticError("INPUT_SIZE_LIMIT");
      await mkdir(dir,{mode:0o700});await this.syncDirectory(this.root);await this.create(join(dir,"reservation.json"),reservation);
      const handle=Object.freeze({captureId:id});this.states.set(handle,{binding,grant,manifest,dir,input:false,closed:false,retained:false,reservationBytes:reservation.length,chunks:[]});return handle;
    });
  }
  private async state(handle:DiagnosticCaptureHandle) {
    const s=this.states.get(handle);if(!s||s.closed)throw new MathDiagnosticError("CAPTURE_ALREADY_EXISTS");await requireDiagnosticGrant(s.grant,s.binding,"capture");return s;
  }
  async prepared(handle:DiagnosticCaptureHandle,input:PreparedDiagnosticInput) {
    const s=await this.state(handle);const buffer=Buffer.from(JSON.stringify(input));
    if(buffer.length>limits.preparedBytes)throw new MathDiagnosticError("INPUT_SIZE_LIMIT");
    if(typeof input.stdin!=="string"||typeof input.schemaText!=="string"||typeof input.rendererVersion!=="string"||input.caseId!==s.binding.caseId||input.runId!==s.binding.runId||input.role!==s.binding.role)throw new MathDiagnosticError("INPUT_BINDING_MISMATCH");
    await this.create(join(s.dir,"prepared.json"),buffer);s.input=true;
    Object.assign(s.manifest,{stage:"INPUT_CAPTURED",rendererVersion:input.rendererVersion,preparedDigest:diagnosticDigest(buffer),preparedBytes:buffer.length,stdinDigest:diagnosticDigest(input.stdin),schemaDigest:diagnosticDigest(input.schemaText)});
  }
  async finite(handle:DiagnosticCaptureHandle,actual:unknown) {
    const s=await this.state(handle);if(s.binding.role!=="CRITIC")throw new MathDiagnosticError("INPUT_BINDING_MISMATCH");
    const buffer=Buffer.from(JSON.stringify(actual));if(buffer.length>limits.finiteBytes)throw new MathDiagnosticError("INPUT_SIZE_LIMIT");
    await this.create(join(s.dir,"finite.json"),buffer);s.manifest.finiteDigest=diagnosticDigest(buffer);s.manifest.finiteBytes=buffer.length;
  }
  async dispatched(handle:DiagnosticCaptureHandle) {const s=await this.state(handle);if(!s.input||s.manifest.stage!=="INPUT_CAPTURED")throw new MathDiagnosticError("INPUT_BINDING_MISMATCH");s.manifest.stage="DISPATCH_ATTEMPTED";}
  async chunk(handle:DiagnosticCaptureHandle,buffer:Buffer) {
    const s=await this.state(handle);if(s.manifest.stage!=="DISPATCH_ATTEMPTED")throw new MathDiagnosticError("INPUT_BINDING_MISMATCH");
    s.manifest.observedBytes+=buffer.length;
    const take=Math.min(buffer.length,limits.stdoutBytes-s.manifest.stdoutBytes);if(take>0)s.chunks.push(Buffer.from(buffer.subarray(0,take)));s.manifest.stdoutBytes+=take;
    if(s.manifest.observedBytes>limits.stdoutBytes){s.manifest.completeness="TRUNCATED";s.manifest.reason="STDOUT_LIMIT";throw new MathDiagnosticError("STDOUT_LIMIT");}
  }
  /** Durable raw boundary: must finish BEFORE parser admission is attempted. */
  async retainTransport(handle:DiagnosticCaptureHandle,outcome:{complete:boolean;reason:DiagnosticReason|null;observedStdoutBytes?:number}) {
    const s=await this.state(handle);if(s.retained)throw new MathDiagnosticError("CAPTURE_ALREADY_EXISTS");const bytes=Buffer.concat(s.chunks);
    if(outcome.observedStdoutBytes!==undefined){if(!Number.isSafeInteger(outcome.observedStdoutBytes)||outcome.observedStdoutBytes<s.manifest.observedBytes)throw new MathDiagnosticError("CAPTURE_INTEGRITY_REFUSED");s.manifest.observedBytes=outcome.observedStdoutBytes;}
    await this.create(join(s.dir,"stdout.bin"),bytes);s.manifest.stdoutDigest=diagnosticDigest(bytes);
    s.manifest.completeness=s.manifest.observedBytes>limits.stdoutBytes?"TRUNCATED":outcome.complete?"COMPLETE":s.manifest.stage==="DISPATCH_ATTEMPTED"?"INCOMPLETE":"NOT_DISPATCHED";
    s.manifest.reason=outcome.reason??s.manifest.reason;
    if(outcome.complete&&s.manifest.completeness==="COMPLETE")s.manifest.accounting=observeMathTransportAccounting(bytes);
    s.retained=true;s.chunks=[];s.manifest.stage="TRANSPORT_CLOSED";
    return bytes;
  }
  async close(handle:DiagnosticCaptureHandle,outcome:{complete:boolean;reason:DiagnosticReason|null;admitted?:boolean}) {
    let s=await this.state(handle);if(!s.retained)await this.retainTransport(handle,outcome);s=await this.state(handle);s.closed=true;
    s.manifest.reason=outcome.reason??s.manifest.reason;
    s.manifest.stage=outcome.admitted===true?"ADMISSION_ACCEPTED":outcome.reason?"ADMISSION_REJECTED":"TRANSPORT_CLOSED";
    const result=diagnosticManifestSchema.parse(s.manifest),buffer=Buffer.from(JSON.stringify(result));if(buffer.length+s.reservationBytes>limits.manifestBytes)throw new MathDiagnosticError("INPUT_SIZE_LIMIT");
    await this.create(join(s.dir,"manifest.json"),buffer);return Object.freeze(result);
  }
  async readCapture(grant:DiagnosticGrant,binding:DiagnosticBinding,id:string) {
    await requireDiagnosticGrant(grant,binding,"replay");if(!captureId.test(id))throw new MathDiagnosticError("PATH_IDENTITY_REFUSED");await this.rootReady(false);
    const dir=join(this.root,id),m=diagnosticManifestSchema.parse(JSON.parse((await this.read(dir,"manifest.json")).toString("utf8")));
    if(!sameDiagnosticBinding(m.binding,binding))throw new MathDiagnosticError("INPUT_BINDING_MISMATCH");
    if(this.now()<m.createdAt||this.now()>=m.expiresAt)throw new MathDiagnosticError("CAPTURE_EXPIRED");
    const prepared=await this.read(dir,"prepared.json"),stdout=await this.read(dir,"stdout.bin");
    if(diagnosticDigest(prepared)!==m.preparedDigest||diagnosticDigest(stdout)!==m.stdoutDigest||prepared.length!==m.preparedBytes||stdout.length!==m.stdoutBytes)throw new MathDiagnosticError("CAPTURE_INTEGRITY_REFUSED");
    if(m.finiteDigest){const finite=await this.read(dir,"finite.json");if(finite.length!==m.finiteBytes||diagnosticDigest(finite)!==m.finiteDigest)throw new MathDiagnosticError("CAPTURE_INTEGRITY_REFUSED");}
    const input=JSON.parse(prepared.toString("utf8")) as PreparedDiagnosticInput;
    if(diagnosticDigest(input.stdin)!==m.stdinDigest||diagnosticDigest(input.schemaText)!==m.schemaDigest||input.caseId!==binding.caseId||input.runId!==binding.runId||input.role!==binding.role)throw new MathDiagnosticError("INPUT_BINDING_MISMATCH");
    return {manifest:m,prepared:input,stdout};
  }
  async purge(grant:DiagnosticGrant,binding:DiagnosticBinding,ids:readonly string[]) {
    await requireDiagnosticGrant(grant,binding,"purge");if(!ids.length||ids.length>limits.purgeIds||new Set(ids).size!==ids.length||ids.some(id=>!captureId.test(id)))throw new MathDiagnosticError("PATH_IDENTITY_REFUSED");
    return this.locked(async(started)=> {
      const q=await this.quota(started);if(q.bytes+2*limits.manifestBytes>limits.rootBytes)throw new MathDiagnosticError("QUOTA_EXHAUSTED");
      const maintenance=join(this.root,"maintenance");try{await mkdir(maintenance,{mode:0o700});await this.syncDirectory(this.root);}catch(e){if((e as NodeJS.ErrnoException).code!=="EEXIST")throw e;}
      await this.chain(maintenance);if((await readdir(maintenance)).length>198)throw new MathDiagnosticError("QUOTA_EXHAUSTED");
      const plans:Array<{id:string;dir:string;files:Array<{name:string;bytes:number;dev:number;ino:number}>}>=[];let bytes=0;
      for(const id of ids){this.deadline(started);const dir=join(this.root,id);await this.chain(dir);const manifestName=(await readdir(dir)).includes("manifest.json")?"manifest.json":"reservation.json";
        const m=diagnosticManifestSchema.parse(JSON.parse((await this.read(dir,manifestName,started)).toString("utf8")));
        if(!sameDiagnosticBinding(m.binding,binding))throw new MathDiagnosticError("INPUT_BINDING_MISMATCH");
        const names=await readdir(dir),files:typeof plans[number]["files"]=[];for(const name of names){this.deadline(started);if(!allowed.has(name))throw new MathDiagnosticError("PATH_IDENTITY_REFUSED");const actual=await this.read(dir,name,started),stat=await lstat(join(dir,name));bytes+=actual.length;files.push({name,bytes:actual.length,dev:stat.dev,ino:stat.ino});}
        if(bytes>limits.purgeBytes)throw new MathDiagnosticError("INPUT_SIZE_LIMIT");plans.push({id,dir,files});}
      const operationId=randomUUID();
      // Bounded create-only intent is retained even if cleanup or final receipt fails.
      await this.create(join(maintenance,`${operationId}.intent.json`),Buffer.from(JSON.stringify({version:1,operationId,binding,captureIds:ids,maximumBytes:bytes,startedAt:this.now(),status:"PURGE_INTENT"})));
      const removed:string[]=[];let bytesRemoved=0,filesRemoved=0,reason:DiagnosticReason|null=null;
      try{for(const p of plans){this.deadline(started);await requireDiagnosticGrant(grant,binding,"purge");await this.chain(p.dir);
        for(const f of p.files){this.deadline(started);await this.chain(p.dir);const current=await lstat(join(p.dir,f.name));if(current.dev!==f.dev||current.ino!==f.ino||!current.isFile()||current.nlink!==1||current.isSymbolicLink())throw new MathDiagnosticError("PATH_IDENTITY_REFUSED");await unlink(join(p.dir,f.name));bytesRemoved+=f.bytes;filesRemoved++;await this.chain(p.dir);}
        this.deadline(started);await rmdir(p.dir);removed.push(p.id);await this.syncDirectory(this.root);}}
      catch(e){reason=e instanceof MathDiagnosticError?e.code:"MAINTENANCE_PARTIAL";}
      const result={version:1,operationId,status:reason?"MAINTENANCE_PARTIAL" as const:"PURGED" as const,captureIds:removed,bytesRemoved,filesRemoved,reason};
      // Final sync/receipt cleanup is cooperative and may finish after the action budget;
      // it never starts another deletion and never reports unconfirmed removal.
      await this.create(join(maintenance,`${operationId}.receipt.json`),Buffer.from(JSON.stringify(result)));
      return result;
    },false);
  }
}
