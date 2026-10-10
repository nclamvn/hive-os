import { createHash } from "node:crypto";
import { constants } from "node:fs";
import { lstat,open,realpath } from "node:fs/promises";
import { dirname,isAbsolute,join,relative,resolve,sep } from "node:path";
import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { LRC_CAMPAIGN_FILES,LRC_CAMPAIGN_LIMITS,LRC_CAMPAIGN_REFERENCE_PATH,createLrcCampaignReferenceEvidence,lrcCampaignScopeSchema,validateRetainedLrcCampaignEvidence,type LrcCampaignEvidence,type LrcCampaignScope } from "./math-lrc-campaign";

/** Fixed-path reference integrity import. NEVER invokes a verifier, Python,
 * model, authorcode or worker. Calling requires explicit trusted permission. */
function local(permission:Readonly<{permission:boolean}>){if(!permission||permission.permission!==true||Object.keys(permission).join()!=="permission"||!["development","test"].includes(process.env.NODE_ENV??"")||(process.env.DEPLOYMENT_ENV&&!["development","test"].includes(process.env.DEPLOYMENT_ENV)))throw new Error("Campaign reference import requires explicit local permission");}
async function fixedPath(path:string,check:()=>void){
  // Local-only runtime references are deliberately NOT deployment tracing inputs.
  // Next's own fs/path calls use this annotation; runtime guards remain mandatory.
  check();const root=resolve(/* turbopackIgnore: true */ process.cwd());if(await realpath(/* turbopackIgnore: true */ root)!==root)throw new Error("Campaign root symlink refused");const rootStat=await lstat(/* turbopackIgnore: true */ root);if(rootStat.isSymbolicLink()||!rootStat.isDirectory())throw new Error("Campaign root path refused");
  if(isAbsolute(path)||path.split("/").some(x=>!x||x==="."||x==="..")||path.includes("\\"))throw new Error("Campaign fixed path refused");const full=join(/* turbopackIgnore: true */ root,path),rel=relative(root,full);if(rel.startsWith(`..${sep}`)||isAbsolute(rel))throw new Error("Campaign path escape");
  let current=root;for(const segment of path.split("/").slice(0,-1)){current=join(/* turbopackIgnore: true */ current,segment);check();const stat=await lstat(/* turbopackIgnore: true */ current);if(stat.isSymbolicLink()||!stat.isDirectory())throw new Error("Campaign ancestor symlink/path refused");}check();return full;
}
export async function runLrcCampaignReference(scope:LrcCampaignScope,rootContractDigest:string,permission:Readonly<{permission:boolean}>,availableMs:number=LRC_CAMPAIGN_LIMITS.importMs):Promise<LrcCampaignEvidence>{
  const started=performance.now();local(permission);if(!Number.isSafeInteger(availableMs)||availableMs<=0)throw new Error("Campaign reference deadline unavailable");const budget=Math.min(availableMs,LRC_CAMPAIGN_LIMITS.importMs),check=()=>{if(performance.now()-started>=budget)throw new Error("Campaign reference deadline exhausted");};check();const parsedScope=lrcCampaignScopeSchema.parse(scope);
  // Reject malformed binding BEFORE any file IO. This factory is not authenticity.
  createLrcCampaignReferenceEvidence(rootContractDigest,parsedScope,new Date().toISOString());
  if(LRC_CAMPAIGN_FILES.length!==LRC_CAMPAIGN_LIMITS.files||LRC_CAMPAIGN_FILES.reduce((n,f)=>n+f.bytes,0)!==LRC_CAMPAIGN_LIMITS.totalBytes)throw new Error("Campaign fixed manifest cap mismatch");let total=0;const buffer=Buffer.alloc(LRC_CAMPAIGN_LIMITS.chunkBytes);
  for(const file of LRC_CAMPAIGN_FILES){
    check();const path=await fixedPath(file.path,check),before=await lstat(/* turbopackIgnore: true */ path);if(before.isSymbolicLink()||!before.isFile()||before.size!==file.bytes||total+before.size>LRC_CAMPAIGN_LIMITS.totalBytes||await realpath(/* turbopackIgnore: true */ path)!==path)throw new Error("Campaign reference file size/path drift");
    const handle=await open(/* turbopackIgnore: true */ path,constants.O_RDONLY|constants.O_NOFOLLOW);try{
      check();const initial=await handle.stat();if(!initial.isFile()||initial.size!==file.bytes||initial.ino!==before.ino||initial.dev!==before.dev)throw new Error("Campaign reference open identity drift");const hash=createHash("sha256");let bytes=0;
      for(;;){check();const {bytesRead}=await handle.read(buffer,0,Math.min(buffer.length,file.bytes-bytes+1),bytes);check();if(!bytesRead)break;bytes+=bytesRead;if(bytes>file.bytes)throw new Error("Campaign reference per-file cap");hash.update(buffer.subarray(0,bytesRead));}
      const after=await handle.stat(),pathAfter=await lstat(/* turbopackIgnore: true */ path);check();if(bytes!==file.bytes||hash.digest("hex")!==file.sha256||after.size!==initial.size||after.mtimeMs!==initial.mtimeMs||after.ctimeMs!==initial.ctimeMs||pathAfter.isSymbolicLink()||pathAfter.ino!==initial.ino||pathAfter.dev!==initial.dev||await realpath(/* turbopackIgnore: true */ path)!==path)throw new Error("Campaign reference fixed identity drift");total+=bytes;
    }finally{await handle.close();}check();
  }
  if(total!==LRC_CAMPAIGN_LIMITS.totalBytes)throw new Error("Campaign reference incomplete fixed file set");const evidence=createLrcCampaignReferenceEvidence(rootContractDigest,parsedScope,new Date().toISOString());if(!validateRetainedLrcCampaignEvidence(evidence,parsedScope,rootContractDigest))throw new Error("Campaign reference final binding refused");check();return evidence;
}
/** Optional fixed create-only audit; it is NOT an authenticated future dispatch
 * receipt. Worker admission imports the fixed lineage, never this arbitrary JSON. */
export async function assertLrcCampaignReferenceOutputAbsent(permission:Readonly<{permission:boolean}>){local(permission);const path=await fixedPath(LRC_CAMPAIGN_REFERENCE_PATH,()=>undefined);try{await lstat(/* turbopackIgnore: true */ path);}catch(error:unknown){if((error as{code?:string}).code==="ENOENT")return;throw error;}throw new Error("EEXIST: create-only campaign reference audit");}
export async function retainLrcCampaignReferenceAudit(evidence:LrcCampaignEvidence,permission:Readonly<{permission:boolean}>,availableMs:number=LRC_CAMPAIGN_LIMITS.importMs){
  const start=performance.now();local(permission);if(!Number.isSafeInteger(availableMs)||availableMs<=0)throw new Error("Campaign audit deadline unavailable");const budget=Math.min(availableMs,LRC_CAMPAIGN_LIMITS.importMs),check=()=>{if(performance.now()-start>=budget)throw new Error("Campaign audit deadline exhausted");};check();if(!validateRetainedLrcCampaignEvidence(evidence,evidence.scope,evidence.rootContractDigest))throw new Error("Campaign audit evidence refused");const text=`${canonicalJson(evidence)}\n`;if(Buffer.byteLength(text)>LRC_CAMPAIGN_LIMITS.auditBytes)throw new Error("Campaign audit byte cap");const path=await fixedPath(LRC_CAMPAIGN_REFERENCE_PATH,check);const handle=await open(/* turbopackIgnore: true */ path,constants.O_WRONLY|constants.O_CREAT|constants.O_EXCL|constants.O_NOFOLLOW,0o600);try{check();await handle.writeFile(text,"utf8");check();await handle.sync();check();}finally{await handle.close();}check();
  // The saved data is a scoped local unsigned reference, not fresh execution.
  if(dirname(path)!==join(/* turbopackIgnore: true */ resolve(/* turbopackIgnore: true */ process.cwd()),"docs/research/lrc-allikvere-v2"))throw new Error("Campaign audit output path refused");
}
