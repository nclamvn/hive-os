import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";
import { validateRetainedPrimeCriterionReport } from "./math-lrc-prime-criterion";
import { P83_COVERING_DEPENDENCY,P83_COVERING_LIMITS,P83_COVERING_PYTHON_SHA256,p83CoveringReplayBytes,p83CoveringReportDigest,p83CoveringRequest,reconstructP83CoveringNumberBody,validateRetainedP83CoveringNumberReport,type P83CoveringNumberReport } from "./math-lrc-p83-covering-number";

/** Explicit collector only;055 is a retained reference, not a fresh replay. */
export async function runFreshP83CoveringNumberReport(availableMs:number=P83_COVERING_LIMITS.collectorMs):Promise<P83CoveringNumberReport>{
  const started=performance.now();
  if(!["development","test"].includes(process.env.NODE_ENV??"")||(process.env.DEPLOYMENT_ENV&&!["development","test"].includes(process.env.DEPLOYMENT_ENV)))throw new Error("p83 replay restricted to local development/test");
  if(!Number.isSafeInteger(availableMs)||availableMs<=0)throw new Error("p83 collector deadline unavailable");
  const budget=Math.min(availableMs,P83_COVERING_LIMITS.collectorMs);
  const dependency=await readFile(join(process.cwd(),P83_COVERING_DEPENDENCY.path),"utf8");
  if(Buffer.byteLength(dependency)>P83_COVERING_LIMITS.bytes||sha256(dependency)!==P83_COVERING_DEPENDENCY.sha256||!validateRetainedPrimeCriterionReport(JSON.parse(dependency)))throw new Error("p83 immutable dependency drift");
  const source=await readFile(join(process.cwd(),"scripts/operations/replay-lrc-p83-covering-number.py"),"utf8");
  if(Buffer.byteLength(source)>P83_COVERING_LIMITS.pythonBytes||sha256(source)!==P83_COVERING_PYTHON_SHA256)throw new Error("p83 replay source drift");
  const body=reconstructP83CoveringNumberBody(),input=canonicalJson(p83CoveringRequest()),remaining=Math.min(P83_COVERING_LIMITS.replayMs,Math.floor(budget-(performance.now()-started)));
  if(Buffer.byteLength(input)>P83_COVERING_LIMITS.bytes||remaining<=0)throw new Error("p83 deadline exhausted");
  const replayStart=performance.now();
  const stdout=await new Promise<string>((resolve,reject)=>{
    const child=execFile("python3",["-I","-S","-B","-c",source],{shell:false,timeout:remaining,killSignal:"SIGKILL",maxBuffer:P83_COVERING_LIMITS.bytes,encoding:"utf8",env:{NODE_ENV:process.env.NODE_ENV,PATH:"/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin",LANG:"C.UTF-8",PYTHONDONTWRITEBYTECODE:"1"}},(error,output,stderr)=>{if(error||stderr.length||Buffer.byteLength(output)>P83_COVERING_LIMITS.bytes)reject(new Error("p83 independent replay failed closed"));else resolve(output);});
    child.stdin?.on("error",()=>reject(new Error("p83 replay input unavailable")));if(!child.stdin){child.kill("SIGKILL");reject(new Error("p83 replay input unavailable"));}else child.stdin.end(input);
  });
  const elapsedMs=Math.max(1,Math.ceil(performance.now()-replayStart));if(elapsedMs>remaining||stdout!==p83CoveringReplayBytes(body))throw new Error("p83 independent replay mismatch");
  const unsigned={...body,generatedAt:new Date().toISOString(),receipt:{method:"LOCAL_UNSIGNED_FRESH_PYTHON_REPLAY" as const,sourceSha256:P83_COVERING_PYTHON_SHA256,stdoutSha256:sha256(stdout),stdoutBytes:Buffer.byteLength(stdout),elapsedMs,externalAttestation:false as const}};
  const report:P83CoveringNumberReport={...unsigned,reportDigest:p83CoveringReportDigest(unsigned)};if(!validateRetainedP83CoveringNumberReport(report)||performance.now()-started>budget)throw new Error("p83 final admission/deadline failed");return report;
}
