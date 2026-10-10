import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { canonicalJson,sha256 } from "@/modules/execution-fabric/contracts";
import { validateRetainedPrefixKzReport } from "./math-lrc-prefix-kz";
import { validateRetainedShapeGeometryReport } from "./math-lrc-shape-geometry";
import { PRIME_CRITERION_LIMITS,PRIME_CRITERION_DEPENDENCIES,PRIME_CRITERION_PYTHON_SHA256,reconstructPrimeCriterionBody,primeCriterionRequest,primeCriterionReplayBytes,primeCriterionReportDigest,validateRetainedPrimeCriterionReport,type PrimeCriterionReport } from "./math-lrc-prime-criterion";
/** Explicit collector seam only. Immutable053/054 validation is a retained
 * reference check, NOT a new replay of their campaigns or lower archives. */
export async function runFreshPrimeCriterionReport(availableMs:number=PRIME_CRITERION_LIMITS.collectorMs):Promise<PrimeCriterionReport>{
  const started=performance.now();
  if(!["development","test"].includes(process.env.NODE_ENV??"")||(process.env.DEPLOYMENT_ENV&&!["development","test"].includes(process.env.DEPLOYMENT_ENV)))throw new Error("Prime criterion replay restricted to local development/test");
  if(!Number.isSafeInteger(availableMs)||availableMs<=0)throw new Error("Prime criterion collector deadline unavailable");
  const budget=Math.min(availableMs,PRIME_CRITERION_LIMITS.collectorMs);
  for(const [index,dependency]of PRIME_CRITERION_DEPENDENCIES.entries()){
    const bytes=await readFile(join(process.cwd(),dependency.path),"utf8");
    if(Buffer.byteLength(bytes)>PRIME_CRITERION_LIMITS.bytes||sha256(bytes)!==dependency.sha256||!(index===0?validateRetainedPrefixKzReport(JSON.parse(bytes)):validateRetainedShapeGeometryReport(JSON.parse(bytes))))throw new Error("Immutable prime criterion dependency drift");
  }
  const body=reconstructPrimeCriterionBody(),source=await readFile(join(process.cwd(),"scripts/operations/replay-lrc-prime-criterion.py"),"utf8");
  if(Buffer.byteLength(source)>PRIME_CRITERION_LIMITS.pythonBytes||sha256(source)!==PRIME_CRITERION_PYTHON_SHA256)throw new Error("Prime criterion replay source drift");
  const input=canonicalJson(primeCriterionRequest()),remaining=Math.min(PRIME_CRITERION_LIMITS.replayMs,Math.floor(budget-(performance.now()-started)));
  if(Buffer.byteLength(input)>PRIME_CRITERION_LIMITS.bytes||remaining<=0)throw new Error("Prime criterion replay deadline exhausted");
  const replayStart=performance.now();
  const stdout=await new Promise<string>((resolve,reject)=>{
    const child=execFile("python3",["-I","-S","-B","-c",source],{shell:false,timeout:remaining,killSignal:"SIGKILL",maxBuffer:PRIME_CRITERION_LIMITS.bytes,encoding:"utf8",env:{NODE_ENV:process.env.NODE_ENV,PATH:"/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin",LANG:"C.UTF-8",PYTHONDONTWRITEBYTECODE:"1"}},(error,output,stderr)=>{if(error||stderr.length||Buffer.byteLength(output)>PRIME_CRITERION_LIMITS.bytes)reject(new Error("Prime criterion independent replay failed closed"));else resolve(output);});
    child.stdin?.on("error",()=>reject(new Error("Prime criterion replay input unavailable")));if(!child.stdin){child.kill("SIGKILL");reject(new Error("Prime criterion replay input unavailable"));}else child.stdin.end(input);
  });
  const elapsedMs=Math.max(1,Math.ceil(performance.now()-replayStart));if(elapsedMs>remaining||stdout!==primeCriterionReplayBytes(body))throw new Error("Prime criterion independent replay mismatch");
  const unsigned={...body,generatedAt:new Date().toISOString(),receipt:{method:"LOCAL_UNSIGNED_FRESH_PYTHON_REPLAY" as const,sourceSha256:PRIME_CRITERION_PYTHON_SHA256,stdoutSha256:sha256(stdout),stdoutBytes:Buffer.byteLength(stdout),elapsedMs,externalAttestation:false as const}};
  const report:PrimeCriterionReport={...unsigned,reportDigest:primeCriterionReportDigest(unsigned)};if(!validateRetainedPrimeCriterionReport(report)||performance.now()-started>budget)throw new Error("Prime criterion final admission/deadline failed");return report;
}
