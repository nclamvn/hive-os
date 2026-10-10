// Main-only fixed postcheck preservation. No inherited driver evaluation.
import {pathToFileURL} from "node:url";
import {performance} from "node:perf_hooks";
import {P3_HAND_SOURCE_NAMES, P3_ARTIFACT_NAMES, p3ToolDigest, p3FixedRead,
  p3CreateOnly, p3PredecessorPins, p3CheckPredecessors} from "./capture-private-summary-tip081-p3.mjs";

export function preserveP3ReviewedSources() {
  if (arguments.length !== 0) throw new Error("P3_PRESERVE_ARITY");
  const started = performance.now(), predecessor = p3CheckPredecessors(p3PredecessorPins());
  const capture = JSON.parse(p3FixedRead("docs/verification/TIP-081A_P3_CHECKED_SOURCE_CUT.json").toString("utf8"));
  const names = [...P3_HAND_SOURCE_NAMES, ...P3_ARTIFACT_NAMES], rows = [];
  if (!Array.isArray(capture.cuts) || capture.cuts.length !== names.length) throw new Error("P3_CHECKED_CUT_COUNT");
  for (let i = 0; i < names.length; i++) {
    const pin = capture.cuts[i];
    if (pin.path !== names[i] || !Number.isSafeInteger(pin.bytes) || pin.bytes < 1 || typeof pin.sha256 !== "string") throw new Error("P3_CHECKED_CUT_DOMAIN");
    const bytes = p3FixedRead(names[i]), sha256 = p3ToolDigest(bytes);
    if (bytes.length !== pin.bytes || sha256 !== pin.sha256) throw new Error("P3_CHECKED_SOURCE_DRIFT");
    rows.push({path: names[i], bytes: bytes.length, sha256, match: true});
  }
  const result = {purpose: "TIP081_P3_NAMED_PRESERVATION", predecessor, rows, predecessorCount: 36,
    allMatched: true, wholeRepositoryVerified: false, wholeGraphVerified: false,
    installedParserImported: false, actualRootRead: false, milliseconds: performance.now() - started};
  p3CreateOnly("docs/verification/TIP-081A_P3_AFTER_PINS.json", JSON.stringify(result));
  return result;
}
if (process.argv.length === 2 && import.meta.url === pathToFileURL(process.argv[1]).href) console.log(JSON.stringify(preserveP3ReviewedSources()));
