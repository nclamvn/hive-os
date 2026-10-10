import { access,writeFile } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { canonicalJson } from "../../src/modules/execution-fabric/contracts";
import { P83_TERMINAL_RETAINED_PATH,P83_TERMINAL_TREE_PATH } from "../../src/modules/research-sandbox/math-lrc-p83-terminal";
import { runFreshP83TerminalReport } from "../../src/modules/research-sandbox/math-lrc-p83-terminal-replay";
async function main(){
  const args=process.argv.slice(2);if(args.length>1||(args.length===1&&args[0]!=="--write"))throw new Error("Usage: allikvere-p83-terminal-audit.ts [--write]");
  if(args[0]==="--write")for(const path of [P83_TERMINAL_TREE_PATH,P83_TERMINAL_RETAINED_PATH]){let exists=true;try{await access(join(process.cwd(),path));}catch(error:unknown){if((error as{code?:string}).code!=="ENOENT")throw error;exists=false;}if(exists)throw new Error(`EEXIST: create-only terminal artifact ${path}`);}
  const {report,evidence}=await runFreshP83TerminalReport();if(args[0]==="--write"){
    await writeFile(join(process.cwd(),P83_TERMINAL_TREE_PATH),evidence.tree,{flag:"wx",mode:0o600});
    // Accepted summary is LAST, never replacing old/partial/frozen evidence.
    await writeFile(join(process.cwd(),P83_TERMINAL_RETAINED_PATH),`${canonicalJson(report)}\n`,{encoding:"utf8",flag:"wx",mode:0o600});
  }
  process.stdout.write(`${JSON.stringify({status:report.status,counts:report.counts,roots:report.roots,datasets:report.datasets,receipt:report.receipt,reportDigest:report.reportDigest,retained:args[0]==="--write"})}\n`);
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)main().catch((error:unknown)=>{process.stderr.write(`${error instanceof Error?error.message:"p83 terminal failed closed"}\n`);process.exitCode=1;});
