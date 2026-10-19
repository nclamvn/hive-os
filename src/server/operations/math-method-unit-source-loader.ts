import {constants} from "node:fs";
import {open,lstat,realpath} from "node:fs/promises";
import {join} from "node:path";
import {diagnosticDigest,MathDiagnosticError} from "@/modules/research-sandbox/math-transport-diagnostics";
import {MATH_METHOD_UNIT_FROZEN_SOURCES,MATH_METHOD_UNIT_SOURCE_FILES,frozenMethodUnitFiniteSourcePins,frozenMethodUnitDiagnosticSourcePins} from "@/modules/research-sandbox/math-method-unit-source-registry";
import {readBoundedDiagnosticBytes} from "./math-diagnostic-capture";

/** Fixed reviewed registry only. Never caller-selected executable paths. No import effects. */
export async function verifyInstalledMethodUnitSources() {
  const root="/Users/os/hiveos",started=performance.now();
  if(!frozenMethodUnitDiagnosticSourcePins()||MATH_METHOD_UNIT_SOURCE_FILES.length>42)throw new MathDiagnosticError("SOURCE_PIN_DRIFT");
  for(const relative of MATH_METHOD_UNIT_SOURCE_FILES) {
    const sha=MATH_METHOD_UNIT_FROZEN_SOURCES[relative];
    const path=join(root,relative);if(await realpath(path)!==path)throw new MathDiagnosticError("PATH_IDENTITY_REFUSED");
    const before=await lstat(path);if(!before.isFile()||before.isSymbolicLink()||before.nlink!==1)throw new MathDiagnosticError("PATH_IDENTITY_REFUSED");
    const h=await open(path,constants.O_RDONLY|constants.O_NOFOLLOW);
    try{const initial=await h.stat();if(initial.ino!==before.ino||initial.dev!==before.dev)throw new MathDiagnosticError("SOURCE_PIN_DRIFT");
      const bytes=await readBoundedDiagnosticBytes(524288,b=>h.read(b,0,b.length,null),()=>{if(performance.now()-started>=5000)throw new MathDiagnosticError("OPERATION_DEADLINE");});
      const after=await h.stat(),atPath=await lstat(path);if(diagnosticDigest(bytes)!==sha||initial.mtimeMs!==after.mtimeMs||initial.ctimeMs!==after.ctimeMs||initial.ino!==atPath.ino||initial.dev!==atPath.dev)throw new MathDiagnosticError("SOURCE_PIN_DRIFT");
    }finally{await h.close();}
  }
  return {sourcePins:frozenMethodUnitDiagnosticSourcePins()!,finiteSourcePins:frozenMethodUnitFiniteSourcePins()!};
}
