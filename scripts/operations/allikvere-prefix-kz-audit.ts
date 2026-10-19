import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { canonicalJson } from "../../src/modules/execution-fabric/contracts";
import { PREFIX_KZ_RETAINED_PATH } from "../../src/modules/research-sandbox/math-lrc-prefix-kz";
import { runFreshPrefixKzReport } from "../../src/modules/research-sandbox/math-lrc-prefix-kz-replay";

async function main() {
  const args=process.argv.slice(2);if(args.length>1||(args.length===1&&args[0]!=="--write")) throw new Error("Usage: allikvere-prefix-kz-audit.ts [--write]");
  const report=await runFreshPrefixKzReport();
  if(args[0]==="--write") await writeFile(join(process.cwd(),PREFIX_KZ_RETAINED_PATH),`${canonicalJson(report)}\n`,{encoding:"utf8",flag:"wx",mode:0o600});
  process.stdout.write(`${JSON.stringify({status:report.status,globalVerdict:report.globalVerdict,targets:report.targets.map(t=>({movingSpeeds:t.movingSpeeds,prefixes:t.prefixes.length,blocks:t.blocks.length,...t.vertexAudit})),receipt:report.receipt,reportDigest:report.reportDigest,retained:args[0]==="--write"})}\n`);
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href) main().catch((error:unknown)=>{process.stderr.write(`${error instanceof Error?error.message:"Prefix/KZ collector failed closed"}\n`);process.exitCode=1;});
