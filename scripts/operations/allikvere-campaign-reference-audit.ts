import { pathToFileURL } from "node:url";
import { sha256,canonicalJson } from "../../src/modules/execution-fabric/contracts";
import { digestMathPilotContract,resolveMathPilotContract } from "../../src/modules/research-sandbox/math-pilot";
import { LRC_CAMPAIGN_LIMITS,LRC_CAMPAIGN_REFERENCE_PATH,lrcCampaignFactsPrompt } from "../../src/modules/research-sandbox/math-lrc-campaign";
import { assertLrcCampaignReferenceOutputAbsent,retainLrcCampaignReferenceAudit,runLrcCampaignReference } from "../../src/modules/research-sandbox/math-lrc-campaign-reference";
async function main(){
  const started=performance.now(),remaining=()=>Math.floor(LRC_CAMPAIGN_LIMITS.importMs-(performance.now()-started)),args=process.argv.slice(2);if(args.length>1||(args.length===1&&args[0]!=="--write"))throw new Error("Usage: allikvere-campaign-reference-audit.ts [--write]");const permission={permission:true};if(args[0]==="--write")await assertLrcCampaignReferenceOutputAbsent(permission);
  const contract=resolveMathPilotContract({caseType:"LRC_CAMPAIGN",preset:"ALLIKVERE_P83_14_V1"});if(contract.version!==2)throw new Error("Campaign contract route drift");const evidence=await runLrcCampaignReference(contract.lrcCampaignScope,digestMathPilotContract(contract),permission,remaining());
  if(args[0]==="--write")await retainLrcCampaignReferenceAudit(evidence,permission,remaining());const elapsedMs=Math.ceil(performance.now()-started);if(remaining()<=0)throw new Error("Campaign reference audit original deadline exhausted");
  process.stdout.write(`${JSON.stringify({mode:evidence.admission.mode,freshFullCampaign:false,semanticReplayExecuted:false,files:evidence.admission.filesVerified,bytes:evidence.admission.bytesVerified,elapsedMs,rootContractDigest:evidence.rootContractDigest,scopeDigest:evidence.scopeDigest,factsDigest:evidence.factsDigest,evidenceDigest:evidence.evidenceDigest,factsBlockSha256:sha256(lrcCampaignFactsPrompt(evidence)),auditSha256:sha256(`${canonicalJson(evidence)}\n`),retained:args[0]==="--write",retainedPath:args[0]==="--write"?LRC_CAMPAIGN_REFERENCE_PATH:null})}\n`);
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)main().catch((error:unknown)=>{process.stderr.write(`${error instanceof Error?error.message:"Campaign reference refused"}\n`);process.exitCode=1;});
