import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { canonicalJson } from "../../src/modules/execution-fabric/contracts";
import { SHAPE_GEOMETRY_RETAINED_PATH } from "../../src/modules/research-sandbox/math-lrc-shape-geometry";
import { runFreshShapeGeometryReport } from "../../src/modules/research-sandbox/math-lrc-shape-geometry-replay";
async function main(){
  const args=process.argv.slice(2);if(args.length>1||(args.length===1&&args[0]!=="--write"))throw new Error("Usage: allikvere-shape-geometry-audit.ts [--write]");
  const r=await runFreshShapeGeometryReport();if(args[0]==="--write")await writeFile(join(process.cwd(),SHAPE_GEOMETRY_RETAINED_PATH),`${canonicalJson(r)}\n`,{encoding:"utf8",flag:"wx",mode:0o600});
  process.stdout.write(`${JSON.stringify({status:r.status,globalVerdict:r.globalVerdict,targets:r.targets.map(t=>({movingSpeeds:t.movingSpeeds,rBound:t.shape.rBound,criticalBracket:t.shape.criticalBracket,kBranches:t.shape.kBranches.length,geometryControls:t.geometryControls.length,flag:t.flag.status})),receipt:r.receipt,reportDigest:r.reportDigest,retained:args[0]==="--write"})}\n`);
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)main().catch((error:unknown)=>{process.stderr.write(`${error instanceof Error?error.message:"Shape/geometry collector failed closed"}\n`);process.exitCode=1;});
