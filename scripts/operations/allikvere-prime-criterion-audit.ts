import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { canonicalJson } from "../../src/modules/execution-fabric/contracts";
import { PRIME_CRITERION_RETAINED_PATH } from "../../src/modules/research-sandbox/math-lrc-prime-criterion";
import { runFreshPrimeCriterionReport } from "../../src/modules/research-sandbox/math-lrc-prime-criterion-replay";
async function main(){const args=process.argv.slice(2);if(args.length>1||(args.length===1&&args[0]!=="--write"))throw new Error("Usage: allikvere-prime-criterion-audit.ts [--write]");const r=await runFreshPrimeCriterionReport();if(args[0]==="--write")await writeFile(join(process.cwd(),PRIME_CRITERION_RETAINED_PATH),`${canonicalJson(r)}\n`,{encoding:"utf8",flag:"wx",mode:0o600});process.stdout.write(`${JSON.stringify({status:r.status,globalVerdict:r.globalVerdict,shiftAudits:r.shiftAudits.length,shiftCells:r.shiftCellCount,toyDomains:r.toyDomains,receipt:r.receipt,reportDigest:r.reportDigest,retained:args[0]==="--write"})}\n`);}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)main().catch((error:unknown)=>{process.stderr.write(`${error instanceof Error?error.message:"Prime criterion collector failed closed"}\n`);process.exitCode=1;});
