import {spawnSync} from 'node:child_process';
import {performance} from 'node:perf_hooks';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

/** @typedef {{status:number|null, signal?:string|null, error?:Error, stdout?:string|null, stderr?:string|null}} StageResult */
/** @typedef {(file:string,args:string[],options:import('node:child_process').SpawnSyncOptionsWithStringEncoding)=>StageResult} Run */

/** Trusted developer tooling, not a sandbox or execution-authority API.
 * @param {{run?:Run,clock?:()=>number,report?:(text:string)=>void}} options
 */
export function runResearchChecks({run=spawnSync,clock=()=>performance.now(),report=console.log}={}) {
  const started=clock();
  const stages=[
    {name:'syntax',args:['--check','scripts/research/check.mjs']},
    {name:'types',args:['node_modules/typescript/bin/tsc','--project','tsconfig.research.json','--pretty','false']},
    {name:'tests',args:['node_modules/vitest/vitest.mjs','run','--config','vitest.research.config.ts']},
    {name:'replay',args:['--import','tsx','scripts/research/replay.mts']},
    {name:'lean',args:['--import','tsx','scripts/research/lean.mts']},
  ];
  for(const stage of stages) {
    const remaining=Math.floor(120000-(clock()-started));
    if(remaining<=0) {report(`${stage.name}: STOP overall 120s deadline`);return 1;}
    const before=clock();
    const cli=stage.name==='replay'||stage.name==='lean';
    const result=run(process.execPath,stage.args,{encoding:'utf8',stdio:cli?'pipe':'inherit',maxBuffer:1048576,timeout:remaining,killSignal:'SIGKILL'});
    if(cli) {if(result.stdout)report(result.stdout);if(result.stderr)report(result.stderr);}
    const observed=stage.name==='lean'?Boolean(result.stdout?.includes('research:lean COMPLETE SYNTHETIC 5 scenarios primary-first')&&result.stdout.includes('"label": "SYNTHETIC_LEAN_EXECUTION_REPLAY"')):stage.name!=='replay'||Boolean(result.stdout?.includes('research:replay COMPLETE SYNTHETIC floor=499999999972 arithmetic-only')
      &&result.stdout.includes('"label": "SYNTHETIC_KNOWN_PUBLIC_ENGINEERING_REPLAY"')
      &&result.stdout.includes('"status": "SUPPORTED_UNDER_LEMMA_ARITHMETIC"')
      &&result.stdout.includes('"derivedFloor": "499999999972"'));
    report(`${stage.name}: ${result.error||result.signal||result.status!==0||!observed?'FAIL':'PASS'} ${(clock()-before).toFixed(1)}ms`);
    if(clock()-started>120000) {report('STOP overall 120s deadline exceeded');return 1;}
    if(result.error) {report(result.error.message);return 1;}
    if(result.signal||result.status!==0)return result.status&&result.status>0?result.status:1;
    if(!observed) {
      report(`${stage.name}: FAIL missing completed CLI observation`);return 1;
    }
  }
  report(`research:check complete ${(clock()-started).toFixed(1)}ms (focused developer slice only)`);
  return 0;
}

if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href)process.exitCode=runResearchChecks();
