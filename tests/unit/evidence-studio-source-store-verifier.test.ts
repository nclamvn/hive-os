import {afterEach,describe,expect,it,vi} from 'vitest';
import {chmodSync,linkSync,mkdtempSync,mkdirSync,readFileSync,rmSync,symlinkSync,writeFileSync} from 'node:fs';
import path from 'node:path';
import {INVENTORY_SEEDS} from '../../scripts/test/acquire-tip081-inventory.mjs';
import {canonicalManifest} from '../../scripts/test/runtime-tip081-manifest.mjs';
import {createInventorySourceStore,readInventorySourceStore,retireInventorySourceStore,openInventorySourceLease,readInventorySourceLease,readInventorySourceLeaseChunk,closeInventorySourceLease} from '../../scripts/test/store-tip081-inventory-source.mjs';
import {verifyInventorySourceLease,safeInventorySourceVerificationError} from '../../scripts/test/verify-tip081-inventory-source.mjs';

type Owner=ReturnType<typeof createInventorySourceStore>;
type Fixture={root:string;options:{mode:'SYNTHETIC';projectRoot:string;dependencyRoot:string}};
const roots:string[]=[],owners:Owner[]=[],file='.next-tip080/server/app/page.js';
function put(root:string,name:string,body:string|Buffer){const target=path.join(root,name);mkdirSync(path.dirname(target),{recursive:true,mode:0o700});writeFileSync(target,body,{mode:0o600});}
function fixture(body:string|Buffer='throw Error("NEVER_EVALUATE_LEASED_SOURCE");'):Fixture{
 const root=mkdtempSync('/private/tmp/hiveos-tip081-inventory-');roots.push(root);chmodSync(root,0o700);const projectRoot=path.join(root,'project'),dependencyRoot=path.join(root,'dependencies');mkdirSync(projectRoot,{mode:0o700});mkdirSync(dependencyRoot,{mode:0o700});mkdirSync(path.join(projectRoot,'.next-tip080/static'),{recursive:true,mode:0o700});mkdirSync(path.join(projectRoot,'public'),{mode:0o700});
 const rows:Record<string,string>={'package.json':'{"type":"commonjs"}','.next-tip080/package.json':'{"type":"commonjs"}','.next-tip080/server/pages-manifest.json':'{"/":"app/page.js"}','.next-tip080/server/app-paths-manifest.json':'{"/page":"app/page.js"}','.next-tip080/server/middleware-manifest.json':'{"version":3,"middleware":{},"functions":{},"sortedMiddleware":[]}','.next-tip080/server/functions-config-manifest.json':'{}','.next-tip080/routes-manifest.json':'{}','.next-tip080/app-path-routes-manifest.json':'{}','.next-tip080/server/app/page.js.nft.json':'{"version":1,"files":[]}','.next-tip080/next-server.js.nft.json':'{"version":1,"files":["../node_modules"]}'};
 for(const [name,bytes]of Object.entries(rows))put(projectRoot,name,bytes);put(projectRoot,file,body);put(projectRoot,'.next-tip080/required-server-files.json',JSON.stringify({version:1,appDir:projectRoot,relativeAppDir:'',config:{distDir:'.next-tip080',output:'standalone'},files:['.next-tip080/package.json'],ignore:[]}));for(const name of INVENTORY_SEEDS)put(dependencyRoot,name,name.endsWith('.json')?'{}':name.endsWith('.js')?'throw Error("NEVER_EVALUATE_DEPENDENCY");':'fixture-asset');return {root,options:{mode:'SYNTHETIC',projectRoot,dependencyRoot}};
}
function create(f:Fixture){const owner=createInventorySourceStore(f.options);owners.push(owner);return owner;}
function release(owner:Owner){retireInventorySourceStore(owner);const index=owners.indexOf(owner);if(index>=0)owners.splice(index,1);}
afterEach(()=>{vi.restoreAllMocks();for(const owner of owners.splice(0))try{retireInventorySourceStore(owner);}catch{/* Already retired by a negative control. */}for(const root of roots.splice(0)){if(!/^\/private\/tmp\/hiveos-tip081-inventory-[A-Za-z0-9]+$/.test(root))throw Error('cleanup refused');rmSync(root,{recursive:true,force:true});}});

describe('TIP081 independent metadata-store source lifetime verification',()=>{
 it('SV01 authentic lease has fresh selected-source proof, not current whole-universe closure',()=>{
  const f=fixture(),owner=create(f),lease=openInventorySourceLease(owner,file),receipt=verifyInventorySourceLease(owner,lease),store=readInventorySourceStore(owner);
  expect(receipt.status).toBe('VERIFIED_SOURCE_LEASE');expect(receipt.scope).toBe('CREATION_UNIVERSE_AND_FRESH_SELECTED_SOURCE');expect(receipt.creationFiles).toBe(store.creationRecord.files.length);expect(receipt.creationBodyBytes).toBe(store.creationRecord.files.reduce((n:number,row:{size:number})=>n+row.size,0));expect(receipt.graphStatus).toBe('ACQUIRED_GRAPH_UNRUN');expect(receipt.fullRuntimeClosure).toBe('NOT_ACCEPTED');expect(receipt.execution).toBe(false);expect(receipt.materialization).toBe(false);expect(Object.isFrozen(receipt)).toBe(true);closeInventorySourceLease(owner,lease);
 });
 it('SV02 clones and public metadata cannot mint owner or lease authority',()=>{
  const owner=create(fixture()),lease=openInventorySourceLease(owner,file),store=readInventorySourceStore(owner),descriptor=readInventorySourceLease(owner,lease);
  for(const forged of [{...owner},store,store.view])expect(()=>verifyInventorySourceLease(forged,lease)).toThrow('AUTHORITY_REFUSED');for(const forged of [{...lease},descriptor,structuredClone(descriptor)])expect(()=>verifyInventorySourceLease(owner,forged)).toThrow('AUTHORITY_REFUSED');
 });
 it('SV03 proxies and getter holders refuse without executing coercion or adoption hooks',()=>{
  const owner=create(fixture()),lease=openInventorySourceLease(owner,file);let touched=false;const getter={get view(){touched=true;return {};}};
  for(const forged of [getter,new Proxy(owner,{get(){touched=true;throw Error('trap');}})])expect(()=>verifyInventorySourceLease(forged,lease)).toThrow('AUTHORITY_REFUSED');expect(()=>verifyInventorySourceLease(owner,new Proxy(lease,{get(){touched=true;throw Error('trap');}}))).toThrow('AUTHORITY_REFUSED');expect(touched).toBe(false);expect(()=>Reflect.apply(verifyInventorySourceLease,null,[owner,lease,{}])).toThrow('AUTHORITY_REFUSED');
 });
 it('SV04 independent byte-state DFA counts BOM, astral and chunk-split scalar sequences',()=>{
  const text='a'.repeat(65535)+'😀é\uFEFF中',owner=create(fixture(text)),lease=openInventorySourceLease(owner,file),receipt=verifyInventorySourceLease(owner,lease);expect(receipt.utf16Units).toBe(65540);expect(receipt.decodedBytes).toBe(131080);expect(receipt.size).toBe(Buffer.byteLength(text));closeInventorySourceLease(owner,lease);
  release(owner);const other=create(fixture('\uFEFF😀')),next=openInventorySourceLease(other,file);expect(verifyInventorySourceLease(other,next).utf16Units).toBe(3);
 });
 it('SV05 private decoded-length metadata matches independently counted bytes and literal ledger',()=>{
  const owner=create(fixture('é😀')),lease=openInventorySourceLease(owner,file),store=readInventorySourceStore(owner),d=readInventorySourceLease(owner,lease),receipt=verifyInventorySourceLease(owner,lease);
  const m=Buffer.byteLength(canonicalManifest(store.creationRecord))+Buffer.byteLength(canonicalManifest(store.creationSnapshot))+Buffer.byteLength(canonicalManifest(store.creationReceipt)),control=8*m+4096*(store.creationRecord.files.length+store.creationRecord.directories.length)+65536+16384,base=m+3*m+control+131072+132096;
  expect(receipt.utf16Units).toBe(3);expect(d.textCodeUnits).toBe(3);expect(receipt.accounting.metadataBytes).toBe(m);expect(receipt.accounting.baseBytes).toBe(base);expect(receipt.accounting.reservedBytes).toBe(base+3*d.size);expect(receipt.accounting.exactReservedBytes).toBe(base+d.size+6);expect(receipt.accounting.sourceBufferBytes).toBe(d.size);
 });
 it('SV06 copied chunk ArrayBuffer mutations cannot alter private buffer, text or proofs',()=>{
  const owner=create(fixture('😀')),lease=openInventorySourceLease(owner,file),before=canonicalManifest(readInventorySourceStore(owner)),copy=readInventorySourceLeaseChunk(owner,lease,0,4);expect(copy.byteOffset).toBe(0);expect(copy.buffer.byteLength).toBe(4);new Uint8Array(copy.buffer).fill(0);expect(verifyInventorySourceLease(owner,lease).utf16Units).toBe(2);expect(canonicalManifest(readInventorySourceStore(owner))).toBe(before);expect(Object.hasOwn(readInventorySourceLease(owner,lease),'text')).toBe(false);expect(Object.hasOwn(readInventorySourceLease(owner,lease),'buffer')).toBe(false);
 });
 it('SV07 same-size source mutation after lease creation refuses fresh filesystem proof',()=>{
  const f=fixture('a'),owner=create(f),lease=openInventorySourceLease(owner,file);put(f.options.projectRoot,file,'b');expect(()=>verifyInventorySourceLease(owner,lease)).toThrow('FILESYSTEM_CHANGED');
 });
 it('SV08 post-lease symlink and hardlink replacements refuse without following aliases',()=>{
  const f=fixture('a'),owner=create(f),lease=openInventorySourceLease(owner,file),target=path.join(f.options.projectRoot,file);rmSync(target);put(f.options.projectRoot,'public/own.txt','a');symlinkSync(path.join(f.options.projectRoot,'public/own.txt'),target);expect(()=>verifyInventorySourceLease(owner,lease)).toThrow(/NONREGULAR_REFUSED/);release(owner);
  const g=fixture('a'),other=create(g),second=openInventorySourceLease(other,file),source=path.join(g.options.projectRoot,file);linkSync(source,path.join(g.options.projectRoot,'public/own.txt'));expect(()=>verifyInventorySourceLease(other,second)).toThrow(/HARDLINK_REFUSED/);
 });
 it('SV09 closed, retired and wrong-owner handles cannot reuse source authority',()=>{
  const first=create(fixture()),lease=openInventorySourceLease(first,file);closeInventorySourceLease(first,lease);expect(()=>verifyInventorySourceLease(first,lease)).toThrow('AUTHORITY_REFUSED');release(first);expect(()=>verifyInventorySourceLease(first,lease)).toThrow('AUTHORITY_REFUSED');const next=create(fixture());expect(()=>verifyInventorySourceLease(next,lease)).toThrow('AUTHORITY_REFUSED');
 });
 it('SV10 current unrelated tree mutation is not claimed as fresh whole-universe verification',()=>{
  const f=fixture(),owner=create(f),lease=openInventorySourceLease(owner,file);put(f.options.projectRoot,'public/new.txt','later untracked data');const receipt=verifyInventorySourceLease(owner,lease);expect(receipt.scope).toBe('CREATION_UNIVERSE_AND_FRESH_SELECTED_SOURCE');expect(receipt.limitations).toContain('Creation-universe proof is historical; only selected source freshly checked');expect(receipt.fullRuntimeClosure).toBe('NOT_ACCEPTED');
 });
 it('SV11 finite monotonic deadline and safe error projection never execute diagnostic getters',()=>{
  const owner=create(fixture()),lease=openInventorySourceLease(owner,file);let n=0;vi.spyOn(performance,'now').mockImplementation(()=>n++?Number.MAX_SAFE_INTEGER:0);expect(()=>verifyInventorySourceLease(owner,lease)).toThrow('TIME_REFUSED');vi.restoreAllMocks();let touched=false;const hostile={get code(){touched=true;return 'secret';},get details(){touched=true;return {};}};expect(safeInventorySourceVerificationError(hostile).code).toBe('TIP081_SOURCE_VERIFIER_REFUSED');expect(touched).toBe(false);
 });
 it('SV12 source bytes are never evaluated or mutated by independent verification',()=>{
  const key='tip081SourceStoreVerifierExecuted',body=`globalThis.${key}=true;throw Error('NEVER_EXECUTE');`,f=fixture(body),owner=create(f),lease=openInventorySourceLease(owner,file),before=readFileSync(path.join(f.options.projectRoot,file));verifyInventorySourceLease(owner,lease);expect(Reflect.has(globalThis,key)).toBe(false);expect(readFileSync(path.join(f.options.projectRoot,file)).equals(before)).toBe(true);
 });
});
