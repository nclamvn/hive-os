import {createHash} from "node:crypto";
import {performance} from "node:perf_hooks";
import {resolve} from "node:path";
import {pathToFileURL} from "node:url";
import {checkPermutationFinal} from "../../src/modules/permutation-bridge/checker";
import {digest,task} from "../../src/modules/permutation-bridge/contracts";

export const knownPublicFloor="499999999972";

/** Synthetic known-answer arithmetic replay; no live bridge/source authority. */
export async function replayEngineeringCandidate(floor=knownPublicFloor) {
  const bytes=new TextEncoder().encode(JSON.stringify({
    proof:"SYNTHETIC ENGINEERING REPLAY of a known public answer; not a fresh solution or reviewed proof.",
    certificate:{version:1,kind:"EXPECTED_INVERSE_DESCENT_FLOOR",n:"1000000000000",floor},
  }));
  const result=await checkPermutationFinal(bytes,{
    runId:"00000000-0000-4000-8000-000000000082",
    finalDigest:createHash("sha256").update(bytes).digest("hex"),
    sourceBundleDigest:createHash("sha256").update("SYNTHETIC_ENGINEERING_BINDING_NOT_SOURCE_AUTHORITY").digest("hex"),
    taskDigest:digest(task),
  });
  return {label:"SYNTHETIC_KNOWN_PUBLIC_ENGINEERING_REPLAY",freshSolverResult:false,noveltyEstablished:false,authorityGranted:false,result};
}

if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href) {
  const started=performance.now();
  const observation=await replayEngineeringCandidate();
  console.log(JSON.stringify(observation,null,2));
  console.log(`research:replay ${(performance.now()-started).toFixed(1)}ms`);
  if(observation.result.status!=="SUPPORTED_UNDER_LEMMA_ARITHMETIC")process.exitCode=1;
  else console.log("research:replay COMPLETE SYNTHETIC floor=499999999972 arithmetic-only");
}
