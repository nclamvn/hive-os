import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";
import { type LrcFiniteScope } from "./math-lrc-certificates";
import { PROPERNESS_LIMITS, PROPERNESS_PYTHON_SHA256, buildHostPropernessBody, buildRetainedPropernessBody,
  propernessRequest, propernessReplayBytes, propernessReportDigest, validateRetainedPropernessReport,
  type PropernessReport } from "./math-lrc-properness";

/** Only the trusted pre-solver/explicit CLI seam launches Python. The read-only
 * proof panel imports only the pure module, never this module or raw code. */
export async function runFreshPropernessReport(host?:{scope:LrcFiniteScope;rootContractDigest:string},availableMs:number=PROPERNESS_LIMITS.replayMs):Promise<PropernessReport> {
  const started=performance.now();
  if(!["development","test"].includes(process.env.NODE_ENV??"")||(process.env.DEPLOYMENT_ENV&&!["development","test"].includes(process.env.DEPLOYMENT_ENV))) throw new Error("Properness replay restricted to local development/test");
  if(!Number.isSafeInteger(availableMs)||availableMs<=0) throw new Error("Properness replay deadline unavailable");
  const budgetMs=Math.min(availableMs,PROPERNESS_LIMITS.replayMs);
  const body=host?buildHostPropernessBody(host.scope,host.rootContractDigest):buildRetainedPropernessBody();
  const source=await readFile(join(process.cwd(),"scripts/operations/replay-lrc-properness.py"),"utf8");
  if(Buffer.byteLength(source)>PROPERNESS_LIMITS.pythonBytes||sha256(source)!==PROPERNESS_PYTHON_SHA256) throw new Error("Properness replay source drift");
  const input=canonicalJson(propernessRequest(body,host?.scope??null));
  if(Buffer.byteLength(input)>PROPERNESS_LIMITS.bytes||performance.now()-started>=budgetMs) throw new Error("Properness replay input/deadline limit");
  const stdout=await new Promise<string>((resolve,reject)=>{
    const child=execFile("python3",["-I","-S","-B","-c",source],{shell:false,timeout:Math.max(1,Math.floor(budgetMs-(performance.now()-started))),killSignal:"SIGKILL",maxBuffer:PROPERNESS_LIMITS.bytes,encoding:"utf8",
      env:{NODE_ENV:process.env.NODE_ENV,PATH:"/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin",LANG:"C.UTF-8",PYTHONDONTWRITEBYTECODE:"1"}},(error,stdout,stderr)=>{
        if(error||stderr.length||Buffer.byteLength(stdout)>PROPERNESS_LIMITS.bytes) reject(new Error("Properness independent replay failed closed")); else resolve(stdout);
      });
    child.stdin?.on("error",()=>reject(new Error("Properness replay input unavailable")));
    if(!child.stdin) {child.kill("SIGKILL");reject(new Error("Properness replay input unavailable"));} else child.stdin.end(input);
  });
  const elapsedMs=Math.ceil(performance.now()-started);
  if(elapsedMs>budgetMs||stdout!==propernessReplayBytes(body)) throw new Error("Properness independent replay mismatch");
  const unsigned={...body,generatedAt:new Date().toISOString(),receipt:{method:"LOCAL_UNSIGNED_FRESH_PYTHON_REPLAY" as const,sourceSha256:PROPERNESS_PYTHON_SHA256,stdoutSha256:sha256(stdout),stdoutBytes:Buffer.byteLength(stdout),elapsedMs,externalAttestation:false as const}};
  const report:PropernessReport={...unsigned,reportDigest:propernessReportDigest(unsigned)};
  if(!validateRetainedPropernessReport(report,host)||performance.now()-started>=budgetMs) throw new Error("Properness replay final admission/deadline failed");
  return report;
}
