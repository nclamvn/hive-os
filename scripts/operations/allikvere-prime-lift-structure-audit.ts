import { access,writeFile } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { canonicalJson } from "../../src/modules/execution-fabric/contracts";
import { PRIME_LIFT_RETAINED_PATH } from "../../src/modules/research-sandbox/math-lrc-prime-lift-structure";
import { runFreshPrimeLiftStructureReport } from "../../src/modules/research-sandbox/math-lrc-prime-lift-structure-replay";
async function main(){
  const args=process.argv.slice(2);if(args.length>1||(args.length===1&&args[0]!=="--write"))throw new Error("Usage: allikvere-prime-lift-structure-audit.ts [--write]");
  if(args[0]==="--write"){let exists=true;try{await access(join(process.cwd(),PRIME_LIFT_RETAINED_PATH));}catch(error:unknown){if((error as{code?:string}).code!=="ENOENT")throw error;exists=false;}if(exists)throw new Error(`EEXIST: create-only prime lift artifact ${PRIME_LIFT_RETAINED_PATH}`);}
  const report=await runFreshPrimeLiftStructureReport();if(args[0]==="--write")await writeFile(join(process.cwd(),PRIME_LIFT_RETAINED_PATH),`${canonicalJson(report)}\n`,{encoding:"utf8",flag:"wx",mode:0o600});
  process.stdout.write(`${JSON.stringify({status:report.status,counts:report.counts,roots:report.roots.map(r=>({input:r.input,counts:r.counts,deletionWitnesses:r.deletionWitnesses,fullGcdSubset:r.fullGcdSubset})),receipt:report.receipt,reportDigest:report.reportDigest,retained:args[0]==="--write"})}\n`);
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)main().catch((error:unknown)=>{process.stderr.write(`${error instanceof Error?error.message:"prime lift failed closed"}\n`);process.exitCode=1;});
