import { spawn } from "node:child_process";
import { z } from "zod";
import path from "node:path";
import { mkdtemp, writeFile, rm, realpath } from "node:fs/promises";
import { tmpdir } from "node:os";
import { createHash } from "node:crypto";
import { readShowcaseSource } from "./source";
import { ShowcaseRefusal, showcaseLimits, type Poly19ExactResult } from "./contracts";

const resultSchema = z.object({ status: z.enum(["VERIFIED_POLY19_CYCLOTOMIC_CONSTRUCTION", "REJECTED", "INCONCLUSIVE"]),
  reason: z.string().max(2000), scope: z.string().max(2000), assumptions: z.array(z.string().max(2000)).max(12), candidateSha256: z.string().regex(/^[a-f0-9]{64}$/).nullable(),
  measurements: z.object({ elapsedSeconds: z.number().finite().nonnegative().max(31), exactArithmeticOperations: z.number().int().nonnegative().max(2000001) }),
  officialScore: z.literal("NOT_ESTABLISHED"), formalProof: z.literal("NOT_ESTABLISHED"), factorIdentity: z.boolean().optional(),
  distinctS: z.boolean().optional(), nondegenerateQuadratics: z.boolean().optional(), irreducibleComponentsUnderLemma: z.number().int().optional(), nonlinearComponentsUnderLemma: z.number().int().optional(),
  computedValue: z.string().regex(/^-?[0-9]+$/).optional() }).strict();

/** Fixed script/executable; no candidate-selected code or path is executed. */
export async function runPoly19Python(script: "frontiermath_poly19_verifier.py" | "poly19_showcase_fault.py", certificate: string, signal: AbortSignal, deadlineAt: string, sourcePins:Record<string,string>): Promise<string> {
  if (Buffer.byteLength(certificate) > showcaseLimits.certificateBytes || signal.aborted || !Number.isFinite(Date.parse(deadlineAt)) || Date.parse(deadlineAt) <= Date.now()) return Promise.reject(new ShowcaseRefusal("RESOURCE", "Replay admission exhausted"));
  const sourcePath=`scripts/research/${script}`,source=await readShowcaseSource(sourcePath,65536);
  if(createHash("sha256").update(source).digest("hex")!==sourcePins[sourcePath])throw new ShowcaseRefusal("SOURCE","Exact replay source pin changed");
  const interpreter=await realpath("/opt/homebrew/bin/python3.14");
  if(!/^\/opt\/homebrew\/Cellar\/python@3\.14\/[^/]+\//.test(interpreter))throw new ShowcaseRefusal("SOURCE","Fixed reviewed Python profile unavailable");
  const directory=await mkdtemp(path.join(tmpdir(),"hiveos-poly19-replay-"));
  try {
    const file=path.join(directory,"replay.py");
    await writeFile(file,Buffer.concat([Buffer.from("import sys\nif sys.version_info[:2] != (3,14): raise SystemExit(2)\n"),source]),{flag:"wx",mode:0o600});
    if(signal.aborted || Date.now()>=Date.parse(deadlineAt))throw new ShowcaseRefusal("RESOURCE","Replay admission expired before process effect");
    return await new Promise((resolve, reject) => {
    // Python isolated mode disables user site, cwd imports and environment config.
    const child = spawn(interpreter, ["-I", "-S", "-B", file], { shell: false,cwd:directory, env: { NODE_ENV:"test",LANG: "C.UTF-8" }, stdio: ["pipe", "pipe", "pipe"] });
    let output = Buffer.alloc(0), stderrBytes = 0, refusal: ShowcaseRefusal | null = null;
    const stop = (message: string) => { refusal ??= new ShowcaseRefusal("RESOURCE", message); child.kill("SIGKILL"); };
    const abort = () => stop("Replay cancelled; retained START has unknown outcome"); signal.addEventListener("abort", abort, { once: true });
    const timer = setTimeout(() => stop("Replay host deadline"), Math.min(showcaseLimits.replayMilliseconds, Date.parse(deadlineAt) - Date.now()));
    const clear = () => { clearTimeout(timer); signal.removeEventListener("abort", abort); };
    child.stdout.on("data", (b: Buffer) => { if (output.length + b.length > 32768) stop("Replay output ceiling"); else output = Buffer.concat([output, b]); });
    child.stderr.on("data", (b: Buffer) => { stderrBytes += b.length; if (stderrBytes > 32768) stop("Replay error ceiling"); });
    child.stdin.on("error", () => stop("Replay input refused"));
    child.on("error", () => { clear(); reject(new ShowcaseRefusal("TRANSPORT", "Fixed Python unavailable")); });
    child.on("close", code => { clear(); if (refusal) reject(refusal); else if (![0, 2].includes(code ?? -1) || stderrBytes) reject(new ShowcaseRefusal("TRANSPORT", "Fixed replay process refused")); else resolve(output.toString("utf8")); });
    child.stdin.end(certificate); if (signal.aborted) abort();
    });
  }finally {await rm(directory,{recursive:true,force:true});}
}
/** Preserve unbounded Python integers by converting only its computedValue
 * numeric JSON token to a string before normal JSON parsing of result metadata. */
export function parsePoly19Replay(raw: string): Poly19ExactResult {
  if (Buffer.byteLength(raw) > 32768) throw new ShowcaseRefusal("RESOURCE", "Replay result ceiling");
  const quoted = raw.replace(/("computedValue"\s*:\s*)(-?[0-9]+)(?=\s*[,}])/g, '$1"$2"');
  const parsed = resultSchema.safeParse(JSON.parse(quoted));
  if (!parsed.success) throw new ShowcaseRefusal("INTEGRITY", "Pinned replay result schema refused"); return parsed.data;
}
export async function verifyPoly19Certificate(certificate: string, signal: AbortSignal, deadlineAt: string,sourcePins:Record<string,string>) {
  return parsePoly19Replay(await runPoly19Python("frontiermath_poly19_verifier.py", certificate, signal, deadlineAt,sourcePins));
}
export async function makePoly19Fault(certificate: string, signal: AbortSignal, deadlineAt: string,sourcePins:Record<string,string>) {
  const fault = await runPoly19Python("poly19_showcase_fault.py", certificate, signal, deadlineAt,sourcePins);
  if (Buffer.byteLength(fault) > showcaseLimits.certificateBytes) throw new ShowcaseRefusal("RESOURCE", "Synthetic fault ceiling"); return fault.trimEnd();
}
