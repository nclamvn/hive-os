import { access,writeFile } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { canonicalJson } from "../../src/modules/execution-fabric/contracts";
import { P83_GENERATION_PATHS,P83_GENERATION_RETAINED_PATH } from "../../src/modules/research-sandbox/math-lrc-p83-generation";
import { runFreshP83GenerationReport } from "../../src/modules/research-sandbox/math-lrc-p83-generation-replay";
async function main(){
  const args=process.argv.slice(2);if(args.length>1||(args.length===1&&args[0]!=="--write"))throw new Error("Usage: allikvere-p83-generation-audit.ts [--write]");
  if(args[0]==="--write")for(const path of [...Object.values(P83_GENERATION_PATHS),P83_GENERATION_RETAINED_PATH]){let exists=true;try{await access(join(process.cwd(),path));}catch(error:unknown){if((error as{code?:string}).code!=="ENOENT")throw error;exists=false;}if(exists)throw new Error(`EEXIST: create-only generation artifact ${path}`);}
  const {report,evidence}=await runFreshP83GenerationReport();
  if(args[0]==="--write"){
    // A partial write never has an accepted summary. Never overwrite partial
    // or frozen artifacts; summary is last, after all full semantic checks.
    for(const key of ["tree","cover12","cover13"] as const)await writeFile(join(process.cwd(),P83_GENERATION_PATHS[key]),evidence[key],{flag:"wx",mode:0o600});
    await writeFile(join(process.cwd(),P83_GENERATION_RETAINED_PATH),`${canonicalJson(report)}\n`,{encoding:"utf8",flag:"wx",mode:0o600});
  }
  process.stdout.write(`${JSON.stringify({status:report.status,counts:report.counts,datasets:report.datasets,receipt:report.receipt,reportDigest:report.reportDigest,retained:args[0]==="--write"})}\n`);
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)main().catch((error:unknown)=>{process.stderr.write(`${error instanceof Error?error.message:"p83 generation failed closed"}\n`);process.exitCode=1;});
