import { access,writeFile } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { canonicalJson } from "../../src/modules/execution-fabric/contracts";
import { P83_CASCADE_KEYS,P83_CASCADE_PATHS,P83_CASCADE_RETAINED_PATH } from "../../src/modules/research-sandbox/math-lrc-p83-cascade";
import { runFreshP83CascadeReport } from "../../src/modules/research-sandbox/math-lrc-p83-cascade-replay";
async function main(){
  const args=process.argv.slice(2);if(args.length>1||(args.length===1&&args[0]!=="--write"))throw new Error("Usage: allikvere-p83-cascade-audit.ts [--write]");
  if(args[0]==="--write")for(const path of [...Object.values(P83_CASCADE_PATHS),P83_CASCADE_RETAINED_PATH]){let exists=true;try{await access(join(process.cwd(),path));}catch(error:unknown){if((error as{code?:string}).code!=="ENOENT")throw error;exists=false;}if(exists)throw new Error(`EEXIST: create-only cascade artifact ${path}`);}
  const {report,evidence}=await runFreshP83CascadeReport();
  if(args[0]==="--write"){
    // Summary LAST; no accepted receipt for a partial write. Never overwrite.
    for(const key of P83_CASCADE_KEYS)await writeFile(join(process.cwd(),P83_CASCADE_PATHS[key]),evidence[key],{flag:"wx",mode:0o600});
    await writeFile(join(process.cwd(),P83_CASCADE_RETAINED_PATH),`${canonicalJson(report)}\n`,{encoding:"utf8",flag:"wx",mode:0o600});
  }
  process.stdout.write(`${JSON.stringify({status:report.status,counts:report.counts,stages:report.stages,ancestors:report.ancestors,datasets:report.datasets,receipt:report.receipt,reportDigest:report.reportDigest,retained:args[0]==="--write"})}\n`);
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)main().catch((error:unknown)=>{process.stderr.write(`${error instanceof Error?error.message:"p83 cascade failed closed"}\n`);process.exitCode=1;});
