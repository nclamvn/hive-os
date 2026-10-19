import {afterEach,describe,expect,it,vi} from 'vitest';
import {chmodSync,mkdtempSync,mkdirSync,rmSync,writeFileSync} from 'node:fs';
import path from 'node:path';
import {acquireInventory,INVENTORY_SEEDS,readInventorySnapshotChunk} from '../../scripts/test/acquire-tip081-inventory.mjs';
import {preflightInventoryGraph} from '../../scripts/test/consume-tip081-inventory-graph.mjs';
import {verifyInventory} from '../../scripts/test/verify-tip081-inventory.mjs';
import {measureInventoryUtf8,verifyInventoryGraphPreflight,safeInventoryGraphVerificationError} from '../../scripts/test/verify-tip081-inventory-graph.mjs';
import {canonicalManifest,manifestDigest} from '../../scripts/test/runtime-tip081-manifest.mjs';

type Fixture={root:string;options:{mode:'SYNTHETIC';projectRoot:string;dependencyRoot:string}};
type Source={path:string;size:number;digest:string;utf16Units:number;decodedBytes:number;sourceOnlyBytes:number;conservativeBytes:number};
type Plan={version:number;purpose:string;mode:string;inventoryDigest:string;snapshotDigest:string;profile:object;epoch:object;entries:string[];files:Array<{path:string;size:number;digest:string;kind:string;entry:boolean;role:string|null;execution:boolean}>;projectInputPolicy:object;sources:Source[];accounting:Record<string,number>;decision:{status:string;stage:string;reason:string|null;path:string|null};graphStatus:string;fullRuntimeClosure:string;execution:boolean;materialization:boolean;digest:string};
const roots:string[]=[],sourcePath='.next-tip080/server/app/page.js';
function put(root:string,file:string,body:string|Buffer){const target=path.join(root,file);mkdirSync(path.dirname(target),{recursive:true,mode:0o700});writeFileSync(target,body,{mode:0o600});}
function fixture(body:string|Buffer='throw Error("NEVER_EXECUTE_GRAPH_SOURCE");'):Fixture{
 const root=mkdtempSync('/private/tmp/hiveos-tip081-inventory-');roots.push(root);chmodSync(root,0o700);const projectRoot=path.join(root,'project'),dependencyRoot=path.join(root,'dependencies');mkdirSync(projectRoot,{mode:0o700});mkdirSync(dependencyRoot,{mode:0o700});
 mkdirSync(path.join(projectRoot,'.next-tip080/static'),{recursive:true,mode:0o700});mkdirSync(path.join(projectRoot,'public'),{mode:0o700});
 const data:Record<string,string>={'package.json':'{"type":"commonjs"}','.next-tip080/package.json':'{"type":"commonjs"}', '.next-tip080/server/pages-manifest.json':'{"/":"app/page.js"}', '.next-tip080/server/app-paths-manifest.json':'{"/page":"app/page.js"}', '.next-tip080/server/middleware-manifest.json':'{"version":3,"middleware":{},"functions":{},"sortedMiddleware":[]}', '.next-tip080/server/functions-config-manifest.json':'{}','.next-tip080/routes-manifest.json':'{}','.next-tip080/app-path-routes-manifest.json':'{}','.next-tip080/server/app/page.js.nft.json':'{"version":1,"files":[]}','.next-tip080/next-server.js.nft.json':'{"version":1,"files":["../node_modules"]}'};
 for(const [file,bytes]of Object.entries(data))put(projectRoot,file,bytes);put(projectRoot,sourcePath,body);put(projectRoot,'.next-tip080/required-server-files.json',JSON.stringify({version:1,appDir:projectRoot,relativeAppDir:'',config:{distDir:'.next-tip080',output:'standalone'},files:['.next-tip080/package.json'],ignore:[]}));
 for(const file of INVENTORY_SEEDS)put(dependencyRoot,file,file.endsWith('.json')?'{}':file.endsWith('.js')?'throw Error("NEVER_EXECUTE_DEPENDENCY");':'fixture-data');
 return {root,options:{mode:'SYNTHETIC',projectRoot,dependencyRoot}};
}
function clone(value:unknown):Plan{return JSON.parse(canonicalManifest(value)) as Plan;}
function rehash(plan:Plan){const {digest:old,...body}=plan;void old;return {...body,digest:manifestDigest(body)};}
afterEach(()=>{vi.restoreAllMocks();for(const root of roots.splice(0)){if(!/^\/private\/tmp\/hiveos-tip081-inventory-[A-Za-z0-9]+$/.test(root))throw Error('cleanup refused');rmSync(root,{recursive:true,force:true});}});

describe('TIP081 independent authenticated graph source preflight',()=>{
 it('GV01 independently verifies every acquired file and JS source without graph promotion',()=>{
  const f=fixture(),a=acquireInventory(f.options);expect(verifyInventory(a).status).toBe('VERIFIED_DECLARED_UNIVERSE_OPEN');const plan=preflightInventoryGraph(a),receipt=verifyInventoryGraphPreflight(a,plan);
  expect(receipt.status).toBe('VERIFIED_GRAPH_PREFLIGHT');expect(receipt.verifiedFiles).toBe(a.record.files.length);expect(receipt.verifiedSources).toBe(a.snapshot.files.filter((r:{kind:string})=>r.kind==='javascript').length);expect(receipt.preflightStatus).toBe('PREFLIGHT_ADMITTED');expect(receipt.graphStatus).toBe('ACQUIRED_GRAPH_UNRUN');expect(receipt.fullRuntimeClosure).toBe('NOT_ACCEPTED');expect(receipt.execution).toBe(false);expect(receipt.materialization).toBe(false);expect(Object.isFrozen(receipt)).toBe(true);
 });
 it('GV02 refuses cloned acquisition and proxy/getter plans without callbacks',()=>{
  const a=acquireInventory(fixture().options),plan=preflightInventoryGraph(a);let touched=false;const getter={get purpose(){touched=true;return 'forged';}};
  expect(()=>verifyInventoryGraphPreflight({...a},plan)).toThrow('AUTHORITY_REFUSED');expect(()=>verifyInventoryGraphPreflight(new Proxy(a,{get(){touched=true;throw Error('trap');}}),plan)).toThrow('AUTHORITY_REFUSED');for(const bad of [getter,new Proxy(plan,{get(){touched=true;throw Error('trap');}})])expect(()=>verifyInventoryGraphPreflight(a,bad)).toThrow('PLAN_REFUSED');expect(touched).toBe(false);
 });
 it('GV03 coherent rehashed counts and byte reservations cannot forge independent results',()=>{
  const a=acquireInventory(fixture().options),plan=preflightInventoryGraph(a);
  for(const mutate of [(p:Plan)=>{p.sources[0].utf16Units++;},(p:Plan)=>{p.sources[0].digest='0'.repeat(64);},(p:Plan)=>{p.accounting.bodyBytes--;},(p:Plan)=>{p.accounting.verificationAllowanceBytes++;},(p:Plan)=>{p.decision.status='PREFLIGHT_REFUSED';p.decision.reason='SOURCE_ONLY_BOUND';}]){const p=clone(plan);mutate(p);expect(()=>verifyInventoryGraphPreflight(a,rehash(p))).toThrow('PLAN_MISMATCH');}
 });
 it('GV04 removed data rows, JS sources, entries and policy are never a full-union proof',()=>{
  const a=acquireInventory(fixture().options),plan=preflightInventoryGraph(a);
  for(const mutate of [(p:Plan)=>{p.files.pop();},(p:Plan)=>{p.sources.pop();},(p:Plan)=>{p.entries.pop();},(p:Plan)=>{p.projectInputPolicy={};},(p:Plan)=>{p.files.reverse();}]){const p=clone(plan);mutate(p);expect(()=>verifyInventoryGraphPreflight(a,rehash(p))).toThrow('PLAN_MISMATCH');}
 });
 it('GV05 scalar DFA independently counts BOM, multibyte and astral UTF16 units',()=>{
  const text='\uFEFFaé中😀𐀀',a=acquireInventory(fixture(text).options),row=measureInventoryUtf8(a,sourcePath);expect(row.utf16Units).toBe(8);expect(row.size).toBe(Buffer.byteLength(text));expect(row.decodedBytes).toBe(16);expect(verifyInventoryGraphPreflight(a,preflightInventoryGraph(a)).verifiedFiles).toBe(a.record.files.length);
 });
 it('GV06 a scalar split at 64KiB preserves exact count and independent hash',()=>{
  const text='a'.repeat(65535)+'😀é',a=acquireInventory(fixture(text).options);expect(measureInventoryUtf8(a,sourcePath).utf16Units).toBe(65538);expect(verifyInventoryGraphPreflight(a,preflightInventoryGraph(a)).preflightStatus).toBe('PREFLIGHT_ADMITTED');
 });
 it('GV07 overlong, surrogate, out-of-range, truncated and stray UTF8 refuse before assembly',()=>{
  for(const bytes of [[192,128],[224,128,128],[237,160,128],[244,144,128,128],[245,128,128,128],[240,159],[128]]){const a=acquireInventory(fixture(Buffer.from(bytes)).options);expect(()=>measureInventoryUtf8(a,sourcePath)).toThrow('UTF8_REFUSED');expect(()=>preflightInventoryGraph(a)).toThrow(/UTF8/);}
 });
 it('GV08 prior filesystem verification detects drift before retaining a graph plan',()=>{
  const f=fixture(),a=acquireInventory(f.options);put(f.options.projectRoot,sourcePath,'changed-source');expect(()=>verifyInventory(a)).toThrow(/TIP081_INVENTORY_VERIFIER_/);
 });
 it('GV09 chunk mutation cannot corrupt counting, retained metadata or source ownership',()=>{
  const a=acquireInventory(fixture('😀').options),before=canonicalManifest(a),chunk=readInventorySnapshotChunk(a,sourcePath,0,4);new Uint8Array(chunk.buffer).fill(0);expect(measureInventoryUtf8(a,sourcePath).utf16Units).toBe(2);expect(canonicalManifest(a)).toBe(before);expect(verifyInventoryGraphPreflight(a,preflightInventoryGraph(a)).graphStatus).toBe('ACQUIRED_GRAPH_UNRUN');
 });
 it('GV10 exact source-only minimum is distinct from the conservative caller reservation',()=>{
  const a=acquireInventory(fixture('a'.repeat(1000)).options),plan=preflightInventoryGraph(a);for(const row of plan.sources){expect(row.sourceOnlyBytes).toBe(plan.accounting.bodyBytes+row.decodedBytes);expect(row.conservativeBytes).toBe(plan.accounting.baseBytes+row.decodedBytes);expect(row.conservativeBytes).toBeGreaterThan(row.sourceOnlyBytes);}expect(plan.accounting.baseBytes).toBe(plan.accounting.bodyBytes+plan.accounting.inputMetadataBytes+plan.accounting.canonicalScratchBytes+plan.accounting.planAllowanceBytes+plan.accounting.verificationAllowanceBytes+plan.accounting.streamTemporaryBytes);
 });
 it('GV11 unsafe plan schema, oversized retained strings and extra arguments refuse',()=>{
  const a=acquireInventory(fixture().options),plan=preflightInventoryGraph(a),p=clone(plan);expect(()=>verifyInventoryGraphPreflight(a,{...p,extra:'claim'})).toThrow('PLAN_REFUSED');expect(()=>verifyInventoryGraphPreflight(a,{...p,purpose:'a'.repeat(1000000)})).toThrow('PLAN_CAP_REFUSED');expect(()=>Reflect.apply(verifyInventoryGraphPreflight,null,[a,plan,{}])).toThrow('AUTHORITY_REFUSED');expect(()=>measureInventoryUtf8(a,'package.json')).toThrow('SOURCE_REFUSED');
  let deep:unknown=null;for(let i=0;i<200;i++)deep={child:deep};expect(()=>verifyInventoryGraphPreflight(a,{...p,decision:deep})).toThrow('PLAN_REFUSED');expect(()=>verifyInventoryGraphPreflight(a,{...p,sources:Array(20001).fill(null)})).toThrow('PLAN_REFUSED');
  // Each list is individually below20k; cumulative keys exceed20k. An earlier
  // byte admission refusal is also safe and must not be bypassed for this test.
  expect(()=>verifyInventoryGraphPreflight(a,{...p,decision:{parent:Array(10050).fill(null),child:{keys:Array(10050).fill(null)}}})).toThrow(/TIP081_GRAPH_VERIFIER_PLAN_(?:CAP_)?REFUSED/);
 });
 it('GV12 deadline and safe diagnostics refuse without executing diagnostic getters',()=>{
  const a=acquireInventory(fixture().options);let calls=0;vi.spyOn(performance,'now').mockImplementation(()=>calls++?Number.MAX_SAFE_INTEGER:0);expect(()=>measureInventoryUtf8(a,sourcePath)).toThrow('TIME_REFUSED');let touched=false;const error={get code(){touched=true;return 'secret';},get details(){touched=true;return {};}};expect(safeInventoryGraphVerificationError(error).code).toBe('TIP081_GRAPH_VERIFIER_REFUSED');expect(touched).toBe(false);
 });
 it('GV13 independent source minimum exceeds tiny cap while producer stops at its earlier control gate',()=>{
  const a=acquireInventory(fixture(Buffer.alloc(360000,97)).options),source=measureInventoryUtf8(a,sourcePath);
  const bodyBytes=a.record.files.reduce((sum:number,row:{size:number})=>sum+row.size,0);expect(bodyBytes+2*source.utf16Units).toBeGreaterThan(1048576);
  let plan:unknown,error:unknown;try{plan=preflightInventoryGraph(a);}catch(caught){error=caught;}
  expect(plan).toBeUndefined();expect(error).toHaveProperty('code','TIP081_GRAPH_PREFLIGHT_CONTROL_CAP');expect(error).toHaveProperty('details.stage','BEFORE_PLAN_ROWS');
  const details=(error as {details:{baseBytes:number;limit:number}}).details;expect(details.limit).toBe(1048576);expect(details.baseBytes).toBeGreaterThan(details.limit);
 });
 it('GV14 conservative-only tiny refusal is not mislabeled as an unavoidable source minimum',()=>{
  const a=acquireInventory(fixture(Buffer.alloc(230000,97)).options),plan=preflightInventoryGraph(a),receipt=verifyInventoryGraphPreflight(a,plan);
  expect(plan.decision.status).toBe('PREFLIGHT_REFUSED');expect(plan.decision.reason).toBe('CONSERVATIVE_ADMISSION');expect(plan.accounting.maxSourceOnlyBytes).toBeLessThanOrEqual(plan.accounting.limit);expect(plan.accounting.maxConservativeBytes).toBeGreaterThan(plan.accounting.limit);expect(receipt.decision).toEqual(plan.decision);expect(receipt.fullRuntimeClosure).toBe('NOT_ACCEPTED');
 });
});
