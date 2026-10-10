// Source-reviewed fixed check batch. Main owns reservation and actual execution.
// Hard child deadlines + POSIX process-group kill include a Vitest fork worker.
import {spawn} from "node:child_process";
import {pathToFileURL} from "node:url";
import {performance} from "node:perf_hooks";
import {captureP3CheckedSources, p3CreateOnly} from "./capture-private-summary-tip081-p3.mjs";

const ROOT = "/Users/os/hiveos/";
const NEW_JS = ["scripts/test/derive-private-summary-tip081-p3.mjs", "scripts/test/private-summary-runtime-tip081-p3.mjs",
  "scripts/test/private-summary-verifier-tip081-p3.mjs", "scripts/test/admit-private-summary-tip081-p3.mjs",
  "scripts/test/capture-private-summary-tip081-p3.mjs", "scripts/test/check-private-summary-tip081-p3.mjs",
  "scripts/test/preserve-private-summary-tip081-p3.mjs"];
const SYNTAX = 'import {SourceTextModule} from "node:vm";import {readFileSync} from "node:fs";' +
  'const paths=' + JSON.stringify([...NEW_JS, "scripts/test/generated/private-summary-tip081-p3.candidate.mjs",
    "scripts/test/generated/private-summary-tip081-p3.alias-fault.candidate.mjs"]) + ';' +
  'for(const p of paths){const source=readFileSync("/Users/os/hiveos/"+p,"utf8");' +
  'if(source.length>2228288)throw Error("TOOL_SOURCE_CAP");new SourceTextModule(source,{identifier:p});}' +
  'console.log(JSON.stringify({purpose:"P3_TOOL_SYNTAX_ONLY",checked:paths.length,evaluated:0}));';
const COMMANDS = [
  {name: "syntax", timeout: 1000, args: ["--max-old-space-size=256", "--experimental-vm-modules", "--input-type=module", "-e", SYNTAX]},
  {name: "lint", timeout: 1500, args: ["--max-old-space-size=256", "node_modules/eslint/bin/eslint.js", ...NEW_JS,
    "tests/unit/private-summary-tip081-p3.test.ts", "vitest-tip081-p3.config.ts"]},
  {name: "types", timeout: 1500, args: ["--max-old-space-size=256", "node_modules/typescript/bin/tsc", "--project", "tsconfig-tip081-p3.json", "--pretty", "false"]},
  {name: "unit", timeout: 8000, args: ["--max-old-space-size=256", "node_modules/vitest/vitest.mjs", "run",
    "--config", "vitest-tip081-p3.config.ts", "--maxWorkers=1", "--reporter=json"]},
];
function command(run) {
  return new Promise(resolve => {
    const started = performance.now(), out = [], err = [];
    let total = 0, stopped = false, reason = null;
    const child = spawn(process.execPath, run.args, {cwd: ROOT, detached: true,
      env: {PATH: "/usr/bin:/bin:/usr/sbin:/sbin", NODE_ENV: "test", NO_COLOR: "1"}, stdio: ["ignore", "pipe", "pipe"]});
    function kill(why) {
      if (stopped) return;
      stopped = true; reason = why;
      if (child.pid) { try { process.kill(-child.pid, "SIGKILL"); } catch { /* already exited */ } }
    }
    const timer = setTimeout(() => kill("HARD_TIMEOUT"), run.timeout);
    function collect(buffer, list) {
      if (buffer.length > 1048576 - total) { kill("OUTPUT_CAP"); return; }
      total += buffer.length; list.push(buffer);
    }
    child.stdout.on("data", b => collect(b, out)); child.stderr.on("data", b => collect(b, err));
    child.on("error", () => kill("SPAWN_ERROR"));
    child.on("close", (code, signal) => {
      clearTimeout(timer);
      resolve({name: run.name, args: run.args, timeout: run.timeout, code, signal, reason,
        stdout: Buffer.concat(out).toString("utf8"), stderr: Buffer.concat(err).toString("utf8"),
        milliseconds: performance.now() - started});
    });
  });
}
export async function checkP3ReviewedSources() {
  if (arguments.length !== 0) throw new Error("P3_CHECK_ARITY");
  const started = performance.now(), capture = captureP3CheckedSources(), rows = [];
  for (const run of COMMANDS) {
    const result = await command(run); rows.push(result);
    // Do not import/run an artifact after syntax/source-tool failure.
    if (result.code !== 0 || result.reason !== null) break;
  }
  const result = {purpose: "TIP081_P3_FIRST_FOCUSED_CHECK", capture, rows,
    hardChildTimeoutSum: 12000, wrapperAndChildAllowancesUpper: 6000,
    allowanceBreakdown: {wrapper: 1000, syntax: 1000, lint: 1000, types: 1000, unit: 1000, unitForkWorker: 1000},
    allCommandsPassed: rows.length === 4 && rows.every(r => r.code === 0 && r.reason === null),
    acceptance: "NOT_READY_OPEN_NAMED_VARIATIONS", knownOpen: ["P319.PRODUCER_EXACT_16384_ACCEPTED", "P321.TRAVERSAL_DEPTH_128_129_DISCRIMINATOR"],
    oldSuitesRun: false, applicationChecked: false, realSourceRead: false, milliseconds: performance.now() - started};
  p3CreateOnly("docs/verification/TIP-081A_P3_FIRST_CHECK.json", JSON.stringify(result));
  return result;
}
if (process.argv.length === 2 && import.meta.url === pathToFileURL(process.argv[1]).href) console.log(JSON.stringify(await checkP3ReviewedSources()));
