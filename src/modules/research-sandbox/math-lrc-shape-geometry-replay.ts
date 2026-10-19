import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { canonicalJson,sha256 } from "@/modules/execution-fabric/contracts";
import { validateRetainedPrefixKzReport } from "./math-lrc-prefix-kz";
import { SHAPE_GEOMETRY_LIMITS,SHAPE_GEOMETRY_PREFIX_DEPENDENCY,SHAPE_GEOMETRY_PYTHON_SHA256,reconstructShapeGeometryBody,shapeGeometryRequest,shapeGeometryReplayBytes,shapeGeometryReportDigest,validateRetainedShapeGeometryReport,type ShapeGeometryReport } from "./math-lrc-shape-geometry";

/** Local collector only. Pure UI does NOT import this retained-reference or
 * subprocess seam. TIP053 reference validation is not a new053 replay. */
export async function runFreshShapeGeometryReport(availableMs:number=SHAPE_GEOMETRY_LIMITS.collectorMs):Promise<ShapeGeometryReport> {
  const started=performance.now();
  if(!["development","test"].includes(process.env.NODE_ENV??"")||(process.env.DEPLOYMENT_ENV&&!["development","test"].includes(process.env.DEPLOYMENT_ENV)))throw new Error("Shape/geometry replay restricted to local development/test");
  if(!Number.isSafeInteger(availableMs)||availableMs<=0)throw new Error("Shape/geometry collector deadline unavailable");
  const budget=Math.min(availableMs,SHAPE_GEOMETRY_LIMITS.collectorMs);
  const old=await readFile(join(process.cwd(),SHAPE_GEOMETRY_PREFIX_DEPENDENCY.reportPath),"utf8");
  if(Buffer.byteLength(old)>SHAPE_GEOMETRY_LIMITS.bytes||sha256(old)!==SHAPE_GEOMETRY_PREFIX_DEPENDENCY.reportSha256||!validateRetainedPrefixKzReport(JSON.parse(old)))throw new Error("Immutable TIP053 dependency drift");
  const body=reconstructShapeGeometryBody(),source=await readFile(join(process.cwd(),"scripts/operations/replay-lrc-shape-geometry.py"),"utf8");
  if(Buffer.byteLength(source)>SHAPE_GEOMETRY_LIMITS.pythonBytes||sha256(source)!==SHAPE_GEOMETRY_PYTHON_SHA256)throw new Error("Shape/geometry replay source drift");
  const input=canonicalJson(shapeGeometryRequest()),remaining=Math.min(SHAPE_GEOMETRY_LIMITS.replayMs,Math.floor(budget-(performance.now()-started)));
  if(Buffer.byteLength(input)>SHAPE_GEOMETRY_LIMITS.bytes||remaining<=0)throw new Error("Shape/geometry replay deadline exhausted");
  const replayStart=performance.now();
  const stdout=await new Promise<string>((resolve,reject)=>{
    const child=execFile("python3",["-I","-S","-B","-c",source],{shell:false,timeout:remaining,killSignal:"SIGKILL",maxBuffer:SHAPE_GEOMETRY_LIMITS.bytes,encoding:"utf8",env:{NODE_ENV:process.env.NODE_ENV,PATH:"/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin",LANG:"C.UTF-8",PYTHONDONTWRITEBYTECODE:"1"}},(error,output,stderr)=>{if(error||stderr.length||Buffer.byteLength(output)>SHAPE_GEOMETRY_LIMITS.bytes)reject(new Error("Shape/geometry independent replay failed closed"));else resolve(output);});
    child.stdin?.on("error",()=>reject(new Error("Shape/geometry replay input unavailable")));if(!child.stdin){child.kill("SIGKILL");reject(new Error("Shape/geometry replay input unavailable"));}else child.stdin.end(input);
  });
  const elapsedMs=Math.max(1,Math.ceil(performance.now()-replayStart));if(elapsedMs>remaining||stdout!==shapeGeometryReplayBytes(body))throw new Error("Shape/geometry independent replay mismatch");
  const unsigned={...body,generatedAt:new Date().toISOString(),receipt:{method:"LOCAL_UNSIGNED_FRESH_PYTHON_REPLAY" as const,sourceSha256:SHAPE_GEOMETRY_PYTHON_SHA256,stdoutSha256:sha256(stdout),stdoutBytes:Buffer.byteLength(stdout),elapsedMs,externalAttestation:false as const}};
  const report:ShapeGeometryReport={...unsigned,reportDigest:shapeGeometryReportDigest(unsigned)};if(!validateRetainedShapeGeometryReport(report)||performance.now()-started>budget)throw new Error("Shape/geometry final admission/deadline failed");return report;
}
