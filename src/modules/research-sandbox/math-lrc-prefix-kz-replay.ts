import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";
import { PREFIX_KZ_LIMITS, PREFIX_KZ_PYTHON_SHA256, reconstructPrefixKzBody, prefixKzRequest, prefixKzReplayBytes, prefixKzReportDigest, validateRetainedPrefixKzReport, type PrefixKzReport } from "./math-lrc-prefix-kz";

/** Explicit local collector only; never imported by read-only UI GET. */
export async function runFreshPrefixKzReport(availableMs:number=PREFIX_KZ_LIMITS.collectorMs):Promise<PrefixKzReport> {
  const started=performance.now();
  if(!["development","test"].includes(process.env.NODE_ENV??"")||(process.env.DEPLOYMENT_ENV&&!["development","test"].includes(process.env.DEPLOYMENT_ENV))) throw new Error("Prefix/KZ replay restricted to local development/test");
  if(!Number.isSafeInteger(availableMs)||availableMs<=0) throw new Error("Prefix/KZ collector deadline unavailable");
  const budget=Math.min(availableMs,PREFIX_KZ_LIMITS.collectorMs),body=reconstructPrefixKzBody();
  const source=await readFile(join(process.cwd(),"scripts/operations/replay-lrc-prefix-kz.py"),"utf8");
  if(Buffer.byteLength(source)>PREFIX_KZ_LIMITS.pythonBytes||sha256(source)!==PREFIX_KZ_PYTHON_SHA256) throw new Error("Prefix/KZ replay source drift");
  const input=canonicalJson(prefixKzRequest()),remaining=Math.min(PREFIX_KZ_LIMITS.replayMs,Math.floor(budget-(performance.now()-started)));
  if(Buffer.byteLength(input)>PREFIX_KZ_LIMITS.bytes||remaining<=0) throw new Error("Prefix/KZ replay deadline exhausted");
  const replayStart=performance.now();
  const stdout=await new Promise<string>((resolve,reject)=>{
    const child=execFile("python3",["-I","-S","-B","-c",source],{shell:false,timeout:remaining,killSignal:"SIGKILL",maxBuffer:PREFIX_KZ_LIMITS.bytes,encoding:"utf8",env:{NODE_ENV:process.env.NODE_ENV,PATH:"/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin",LANG:"C.UTF-8",PYTHONDONTWRITEBYTECODE:"1"}},(error,output,stderr)=>{
      if(error||stderr.length||Buffer.byteLength(output)>PREFIX_KZ_LIMITS.bytes) reject(new Error("Prefix/KZ independent replay failed closed"));else resolve(output);
    });
    child.stdin?.on("error",()=>reject(new Error("Prefix/KZ replay input unavailable")));
    if(!child.stdin) {child.kill("SIGKILL");reject(new Error("Prefix/KZ replay input unavailable"));} else child.stdin.end(input);
  });
  const elapsedMs=Math.max(1,Math.ceil(performance.now()-replayStart));
  if(elapsedMs>remaining||stdout!==prefixKzReplayBytes(body)) throw new Error("Prefix/KZ independent replay mismatch");
  const unsigned={...body,generatedAt:new Date().toISOString(),receipt:{method:"LOCAL_UNSIGNED_FRESH_PYTHON_REPLAY" as const,sourceSha256:PREFIX_KZ_PYTHON_SHA256,stdoutSha256:sha256(stdout),stdoutBytes:Buffer.byteLength(stdout),elapsedMs,externalAttestation:false as const}};
  const report:PrefixKzReport={...unsigned,reportDigest:prefixKzReportDigest(unsigned)};
  if(!validateRetainedPrefixKzReport(report)||performance.now()-started>budget) throw new Error("Prefix/KZ final admission/deadline failed");
  return report;
}
