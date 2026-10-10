import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { canonicalJson } from "../../src/modules/execution-fabric/contracts";
import { P83_COVERING_RETAINED_PATH } from "../../src/modules/research-sandbox/math-lrc-p83-covering-number";
import { runFreshP83CoveringNumberReport } from "../../src/modules/research-sandbox/math-lrc-p83-covering-number-replay";
async function main(){const args=process.argv.slice(2);if(args.length>1||(args.length===1&&args[0]!=="--write"))throw new Error("Usage: allikvere-p83-covering-number-audit.ts [--write]");const r=await runFreshP83CoveringNumberReport();if(args[0]==="--write")await writeFile(join(process.cwd(),P83_COVERING_RETAINED_PATH),`${canonicalJson(r)}\n`,{encoding:"utf8",flag:"wx",mode:0o600});process.stdout.write(`${JSON.stringify({status:r.status,stageVerdict:r.stageVerdict,fullPrimeVerdict:r.fullPrimeVerdict,totalNodes:r.certificate.totalNodes,roots:r.certificate.roots.map(x=>({triple:x.triple,nodes:x.nodeCount})),receipt:r.receipt,reportDigest:r.reportDigest,retained:args[0]==="--write"})}\n`);}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)main().catch((error:unknown)=>{process.stderr.write(`${error instanceof Error?error.message:"p83 collector failed closed"}\n`);process.exitCode=1;});
