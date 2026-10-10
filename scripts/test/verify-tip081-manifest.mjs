// Source-only contracts. Never resolve/import/evaluate any inventory target.
import {createHash} from "node:crypto";
import {types,isDeepStrictEqual} from "node:util";
import path from "node:path";
import {isBuiltin} from "node:module";
import {readManifestSnapshot,loadManifestParser,canonicalManifest,manifestDigest,manifestPath} from "./runtime-tip081-manifest.mjs";

export const LAUNCHER_UTILS_DIGEST="df5d27cf5100a99ad07e627158880d172617a2c28006a3488c3856995d30bc5e";
export const MANIFEST_BASE_BUNDLE_DIGEST="844f824ecdd755205e748ec562b487caf4aca1f02302af28f6bc35add528ac0f";
const sha=value=>createHash("sha256").update(value).digest("hex");
const lexical=(a,b)=>a<b?-1:a>b?1:0;
function refuse(code){throw new Error(code);}
function rethrowToolRefusal(error){if(typeof error?.message==="string"&&/^TIP081_MANIFEST_(?:TOOL|TIME|RESOURCE|PARSE_OPTIONS)/.test(error.message))throw error;}
function plain(value){return value!==null&&typeof value==="object"&&!types.isProxy(value)&&Object.getPrototypeOf(value)===Object.prototype;}
function deepFreeze(value){if(value&&typeof value==="object"){for(const item of Object.values(value))deepFreeze(item);Object.freeze(value);}return value;}
function ownRecord(value,required,optional=[]){
  if(!plain(value))refuse("TIP081_MANIFEST_DATA_REFUSED");const names=Reflect.ownKeys(value),allowed=new Set([...required,...optional]);
  if(names.some(k=>typeof k!=="string"||!allowed.has(k))||required.some(k=>!Object.hasOwn(value,k)))refuse("TIP081_MANIFEST_DATA_REFUSED");
  for(const name of names){const d=Object.getOwnPropertyDescriptor(value,name);if(!d?.enumerable||!("value" in d))refuse("TIP081_MANIFEST_ACCESSOR_REFUSED");}return value;
}
function boundedBytes(value,maximum){
  if(types.isProxy(value)||!Buffer.isBuffer(value)||Object.getPrototypeOf(value)!==Buffer.prototype||["length","byteLength","buffer","byteOffset","valueOf","toString","toJSON",Symbol.toPrimitive,Symbol.iterator].some(key=>Object.hasOwn(value,key)))refuse("TIP081_MANIFEST_BYTES_REFUSED");
  if(value.length<1||value.length>maximum)refuse("TIP081_MANIFEST_BYTES_REFUSED");
  // Integer-indexed Buffer elements cannot be accessors. Do not allocate a
  // descriptor for every byte; unused extra properties are never consumed.
  return Buffer.from(value);
}
const dangerousKey=/^(?:__proto__|constructor|prototype|password|secret|api[_-]?key|authorization|cookie|cookies|set-cookie|access[_-]?token|refresh[_-]?token|id[_-]?token|database[_-]?url|DATABASE_MIGRATION_URL|BETTER_AUTH_SECRET)$/i;
function safeJsonData(value,{secrets=false,maxNodes=20000,maxDepth=24,maxBytes=1048576}={}){
  let nodes=0,bytes=0;const active=new Set();
  const visit=(v,depth)=>{
    if(++nodes>maxNodes||depth>maxDepth)refuse("TIP081_MANIFEST_DATA_CAP");
    if(v===null||typeof v==="boolean")return;
    if(typeof v==="number"){if(!Number.isFinite(v)||Object.is(v,-0))refuse("TIP081_MANIFEST_NUMBER_REFUSED");return;}
    if(typeof v==="string"){
      bytes+=Buffer.byteLength(v);if(bytes>maxBytes)refuse("TIP081_MANIFEST_DATA_CAP");
      if(secrets&&/(?:postgres(?:ql)?:\/\/|[a-z][a-z0-9+.-]*:\/\/[^/\s@]+@|BEGIN [A-Z ]*PRIVATE KEY|Bearer\s+[A-Za-z0-9._-]+|\bsk-[A-Za-z0-9_-]{12,}|\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)/i.test(v))refuse("TIP081_LAUNCHER_CREDENTIAL_REFUSED");return;
    }
    if(!v||typeof v!=="object"||types.isProxy(v)||active.has(v))refuse("TIP081_MANIFEST_DATA_REFUSED");
    const array=Array.isArray(v);if(array?Object.getPrototypeOf(v)!==Array.prototype:!plain(v))refuse("TIP081_MANIFEST_DATA_REFUSED");
    active.add(v);const keys=Reflect.ownKeys(v);if(keys.length>maxNodes+1)refuse("TIP081_MANIFEST_DATA_CAP");
    if(array&&keys.length!==v.length+1)refuse("TIP081_MANIFEST_ARRAY_REFUSED");
    for(const key of keys){
      if(array&&key==="length")continue;
      if(typeof key!=="string"||["__proto__","constructor","prototype"].includes(key)||secrets&&(dangerousKey.test(key)||/(?:secret|token|pass|key|database[_-]?url|authorization|cookie)/i.test(key)))refuse("TIP081_MANIFEST_KEY_REFUSED");
      bytes+=Buffer.byteLength(key);if(bytes>maxBytes)refuse("TIP081_MANIFEST_DATA_CAP");
      if(array&&!/^(?:0|[1-9][0-9]*)$/.test(key))refuse("TIP081_MANIFEST_ARRAY_REFUSED");
      const descriptor=Object.getOwnPropertyDescriptor(v,key);if(!descriptor?.enumerable||!("value" in descriptor))refuse("TIP081_MANIFEST_ACCESSOR_REFUSED");visit(descriptor.value,depth+1);
    }active.delete(v);
  };visit(value,0);return value;
}
function parseJson(bytes,maximum=1048576,secrets=false){
  const source=new TextDecoder("utf-8",{fatal:true,ignoreBOM:true}).decode(boundedBytes(bytes,maximum));
  if(source.startsWith("\uFEFF"))refuse("TIP081_MANIFEST_JSON_REFUSED");
  const stack=[];for(let i=0;i<source.length;i++){
    if(source[i]==='"'){
      const start=i;for(i++;i<source.length;i++){if(source[i]==="\\")i++;else if(source[i]==='"')break;}if(i>=source.length)refuse("TIP081_MANIFEST_JSON_REFUSED");let next=i+1;while(/\s/.test(source[next]??""))next++;
      if(source[next]===":"){const key=JSON.parse(source.slice(start,i+1)),set=stack.at(-1);if(!set||set.has(key))refuse("TIP081_MANIFEST_JSON_REFUSED");set.add(key);}
    }else if(source[i]==="{"||source[i]==="["){if(stack.length>=(secrets?24:128))refuse("TIP081_MANIFEST_JSON_CAP");stack.push(source[i]==="{"?new Set():null);}else if(source[i]==="}"||source[i]==="]")stack.pop();
  }
  let parsed;try{parsed=JSON.parse(source);}catch{refuse("TIP081_MANIFEST_JSON_REFUSED");}return safeJsonData(parsed,{secrets,maxNodes:secrets?20000:1000000,maxDepth:secrets?24:128,maxBytes:secrets?1048576:67108864});
}

function independentResolution(files,importer,specifier,mode){
  const packageRows=new Map(),misses=new Set(),conditions=["node",mode,"default"];
  const result=(status,target=null,reason=null)=>({importer,mode,specifier:typeof specifier==="string"?specifier:null,status,target,packageFiles:[...packageRows.values()].sort((a,b)=>lexical(a.path,b.path)),conditions,absentCandidates:[...misses].sort(),reason});
  const unresolved=reason=>result("UNRESOLVED",null,reason);
  function invalid(code){throw new Error(code);}
  function exists(file){manifestPath(file);if(files.has(file))return true;misses.add(file);return false;}
  function packageAt(file){
    if(!files.has(file))return null;
    let value;try{value=parseJson(files.get(file),67108864);}catch{invalid("UNSUPPORTED_PACKAGE_METADATA");}
    if(!plain(value)||Object.hasOwn(value,"type")&&!["commonjs","module"].includes(value.type))invalid("UNSUPPORTED_PACKAGE_METADATA");
    packageRows.set(file,{path:file,digest:sha(files.get(file))});return value;
  }
  function fileTarget(file){return exists(file)?file:null;}
  function commonJsTarget(base,trail=[]){
    if(trail.length>8)invalid("UNSUPPORTED_RESOLUTION");
    for(const file of [base,`${base}.js`,`${base}.json`,`${base}.node`])if(exists(file))return file;
    const metadataPath=`${base}/package.json`,pkg=packageAt(metadataPath);if(!pkg)misses.add(metadataPath);
    if(pkg&&Object.hasOwn(pkg,"main")){
      if(typeof pkg.main!=="string"||!pkg.main||/[#%?\\\u0000-\u0020\u007f]/.test(pkg.main)||path.posix.isAbsolute(pkg.main)||(pkg.main.startsWith("./")?pkg.main.slice(2):pkg.main).split("/").some(p=>!p||p==="."||p===".."||p==="node_modules"))invalid("UNSUPPORTED_PACKAGE_METADATA");
      const main=path.posix.join(base,pkg.main);if(main!==base){const target=commonJsTarget(main,[...trail,base]);if(target)return target;}
    }
    for(const suffix of [".js",".json",".node"]){const file=`${base}/index${suffix}`;if(exists(file))return file;}return null;
  }
  function conditional(value,unsupported){
    if(value===null||typeof value==="string")return value;
    if(!plain(value))invalid(unsupported);const keys=Object.keys(value);
    if(keys.some(key=>!["node","import","require","default"].includes(key)))invalid(unsupported);
    // Validate each visited object. Known opposite-mode branches are skipped;
    // their contents are neither traversed nor certified as supported.
    for(const key of keys){if(!conditions.includes(key))continue;const selected=conditional(value[key],unsupported);if(selected!==undefined)return selected;}return undefined;
  }
  function packageScope(){
    let directory=path.posix.dirname(importer);
    for(;;){if(path.posix.basename(directory)==="node_modules")return null;const file=directory==="."?"package.json":`${directory}/package.json`,pkg=packageAt(file);if(pkg)return {directory,file,pkg};misses.add(file);if(directory===".")return null;directory=path.posix.dirname(directory);}
  }
  function exportTarget(root,value,unsupported){
    const selected=conditional(value,unsupported);if(selected===null||selected===undefined)return unresolved("EXPORTS_BLOCKED");
    if(!selected.startsWith("./")||/[#%?\\\u0000-\u0020\u007f]/.test(selected)||selected.slice(2).split("/").some(p=>!p||p==="."||p===".."||p==="node_modules"))return unresolved(unsupported);
    const target=fileTarget(path.posix.join(root,selected));return target?result("RESOLVED",target):unresolved("TARGET_NOT_FOUND");
  }
  try{
    if(typeof specifier!=="string"||!specifier||specifier.length>2048||/[\\\u0000-\u0020\u007f%?]/.test(specifier)||specifier.lastIndexOf("#")>0)return unresolved(specifier===null?"DYNAMIC_SPECIFIER":"INVALID_SPECIFIER");
    if(isBuiltin(specifier))return result("BUILTIN");
    if(specifier.startsWith("node:")||path.posix.isAbsolute(specifier))return unresolved("INVALID_SPECIFIER");
    if(specifier==="#"||specifier.startsWith("#/"))return unresolved("INVALID_SPECIFIER");
    const relative=specifier==="."||specifier===".."||specifier.startsWith("./")||specifier.startsWith("../");
    if(specifier.startsWith(".")&&!relative)return unresolved("INVALID_SPECIFIER");
    if(relative){
      const file=path.posix.normalize(path.posix.join(path.posix.dirname(importer),specifier));if(file==="."||file==="..")return unresolved("UNSUPPORTED_RESOLUTION");const target=mode==="import"?fileTarget(file):commonJsTarget(file);
      return target?result("RESOLVED",target):unresolved("TARGET_NOT_FOUND");
    }
    const scope=packageScope();
    if(specifier.startsWith("#")){
      const mappings=scope?.pkg.imports;
      if(!plain(mappings)||Object.keys(mappings).some(k=>!k.startsWith("#")||k.includes("*")))return unresolved("UNSUPPORTED_IMPORTS");
      if(!Object.hasOwn(mappings,specifier))return unresolved("EXPORTS_BLOCKED");
      return exportTarget(scope.directory,mappings[specifier],"UNSUPPORTED_IMPORTS");
    }
    const parts=specifier.split("/"),scoped=parts[0].startsWith("@"),count=scoped?2:1,name=parts.slice(0,count).join("/"),subpath=parts.slice(count).join("/");
    if(!name||scoped&&parts.length<2||parts.some(p=>!p||p==="."||p===".."||p.includes(":")))return unresolved("INVALID_SPECIFIER");
    if(scope?.pkg.name===name&&scope.pkg.exports!==undefined)return unresolved("UNSUPPORTED_SELF_REFERENCE");
    let location=null,pkg=null,directory=path.posix.dirname(importer);
    for(;;){
      if(path.posix.basename(directory)!=="node_modules"){
        const candidate=path.posix.join(directory==="."?"":directory,"node_modules",name),packageFile=`${candidate}/package.json`,record=packageAt(packageFile);
        if(record||[...files.keys()].some(file=>file===candidate||file.startsWith(`${candidate}/`))){location=candidate;pkg=record;break;}misses.add(packageFile);
      }
      if(directory===".")break;directory=path.posix.dirname(directory);
    }
    if(location===null)return unresolved("PACKAGE_NOT_FOUND");
    if(pkg&&Object.hasOwn(pkg,"exports")){
      let selected=pkg.exports;const key=subpath?`./${subpath}`:".";
      if(plain(selected)){
        const keys=Object.keys(selected),subpaths=keys.some(k=>k.startsWith("."));
        if(keys.some(k=>k.includes("*"))||subpaths&&keys.some(k=>!k.startsWith(".")))return unresolved("UNSUPPORTED_EXPORTS");
        if(subpaths){if(!Object.hasOwn(selected,key))return unresolved("EXPORTS_BLOCKED");selected=selected[key];}else if(subpath)return unresolved("EXPORTS_BLOCKED");
      }else if(subpath)return unresolved("EXPORTS_BLOCKED");
      return exportTarget(location,selected,"UNSUPPORTED_EXPORTS");
    }
    const base=subpath?path.posix.join(location,subpath):location;
    if(mode==="import"&&!subpath)return unresolved("UNSUPPORTED_RESOLUTION");
    const target=mode==="import"?fileTarget(base):commonJsTarget(base);return target?result("RESOLVED",target):unresolved("TARGET_NOT_FOUND");
  }catch(error){
    const code=error?.code??error?.message;
    return unresolved(typeof code==="string"&&code.startsWith("TIP081_MANIFEST_PATH")?"FORBIDDEN_PATH":typeof code==="string"&&code.startsWith("UNSUPPORTED_")?code:"UNSUPPORTED_RESOLUTION");
  }
}

function nativeKind(file){if(/\.(?:js|cjs|mjs)$/.test(file))return "javascript";if(file.endsWith(".json"))return "json";if(/\.(?:node|dylib|dll|so(?:\.[0-9]+)*)$/.test(file))return "native";if(/\.(?:ts|tsx|jsx|py|sh|exe)$/.test(file))return "unsupported";return "asset";}
const makeObligation=(file,start,end,code,siteId=null)=>({id:`${file}:${start}:${end}:${code}`,file,start,end,code,siteId});
function syntaxNodes(tree,account){
  const branchTypes=new Set(["IfStatement","ConditionalExpression","LogicalExpression","TryStatement","SwitchStatement","SwitchCase","ForStatement","ForInStatement","ForOfStatement","WhileStatement","DoWhileStatement"]);
  const nodes=[],pending=[{node:tree,parent:null,key:null,conditional:false}];
  while(pending.length){
    const current=pending.pop(),node=current.node;if(!node||typeof node!=="object"||typeof node.type!=="string")continue;
    if(++account.nodes>200000||performance.now()-account.started>120000)refuse("TIP081_MANIFEST_VERIFY_RESOURCE_REFUSED");nodes.push(current);
    for(const key of Object.keys(node)){
      const conditional=current.conditional||branchTypes.has(node.type),item=node[key];if(Array.isArray(item)){for(let i=item.length-1;i>=0;i--)pending.push({node:item[i],parent:node,key,conditional});}
      else if(item&&typeof item==="object"&&typeof item.type==="string")pending.push({node:item,parent:node,key,conditional});
    }
  }return nodes;
}
function propertyName(member){if(member?.type!=="MemberExpression")return null;return member.computed?member.property?.type==="Literal"&&typeof member.property.value==="string"?member.property.value:null:member.property?.name??null;}
function identifierNames(pattern,names){
  if(!pattern||typeof pattern!=="object")return;
  if(pattern.type==="Identifier"){names.add(pattern.name);return;}
  if(pattern.type==="AssignmentPattern"){identifierNames(pattern.left,names);return;}
  if(pattern.type==="RestElement"){identifierNames(pattern.argument,names);return;}
  if(pattern.type==="ArrayPattern")for(const item of pattern.elements)identifierNames(item,names);
  if(pattern.type==="ObjectPattern")for(const item of pattern.properties)identifierNames(item.type==="RestElement"?item.argument:item.value,names);
}
function analyzeIndependently(files,file,account){
  const bytes=files.get(file),kind=nativeKind(file),digest=sha(bytes),sites=[],obligations=[];
  const analysis={file,digest,format:kind,offsetEncoding:kind==="javascript"?"UTF16_CODE_UNITS":"BYTE_OFFSETS",sourceType:null,sites,obligations};
  const fileOpen=code=>obligations.push(makeObligation(file,0,bytes.length,code));
  if(kind==="native"){fileOpen("NATIVE_COVERAGE_OPEN");return analysis;}
  if(kind==="unsupported"){fileOpen("UNSUPPORTED_FORMAT");return analysis;}
  if(kind==="asset"){fileOpen("ASSET_COVERAGE_OPEN");return analysis;}
  if(kind==="json"){try{parseJson(bytes,67108864);}catch{fileOpen("PARSE_ERROR");}return analysis;}
  let text;try{text=new TextDecoder("utf-8",{fatal:true,ignoreBOM:true}).decode(bytes);}catch{fileOpen("PARSE_ERROR");return analysis;}
  let sourceType=file.endsWith(".mjs")?"module":file.endsWith(".cjs")?"script":null,modeOpen=false;
  if(sourceType===null){
    let directory=path.posix.dirname(file),found=false;
    for(;;){if(path.posix.basename(directory)==="node_modules")break;const packageFile=directory==="."?"package.json":`${directory}/package.json`;if(files.has(packageFile)){found=true;try{const metadata=parseJson(files.get(packageFile),67108864);if(plain(metadata)&&metadata.type==="module")sourceType="module";else if(plain(metadata)&&metadata.type==="commonjs")sourceType="script";else modeOpen=true;}catch{modeOpen=true;obligations.push(makeObligation(file,0,text.length,"UNSUPPORTED_PACKAGE_METADATA"));}break;}if(directory===".")break;directory=path.posix.dirname(directory);}
    if(!found)modeOpen=true;
  }
  if(modeOpen)obligations.push(makeObligation(file,0,text.length,"SOURCE_MODE_OPEN"));
  let tree;const parser=loadManifestParser();
  try{tree=parser.parse(text,{sourceType:sourceType??"script"});sourceType=sourceType??"script";}catch(error){
    rethrowToolRefusal(error);if(modeOpen)try{tree=parser.parse(text,{sourceType:"module"});sourceType="module";}catch(fallbackError){rethrowToolRefusal(fallbackError);/* syntax remains explicit OPEN */}
  }
  analysis.sourceType=tree?sourceType:null;if(!tree){obligations.push(makeObligation(file,0,text.length,"PARSE_ERROR"));return analysis;}
  const nodes=syntaxNodes(tree,account),bindings=new Set();
  for(const {node}of nodes){
    if(node.type==="VariableDeclarator")identifierNames(node.id,bindings);
    if(["FunctionDeclaration","FunctionExpression","ArrowFunctionExpression"].includes(node.type)){identifierNames(node.id,bindings);for(const p of node.params)identifierNames(p,bindings);}
    if(["ClassDeclaration","ClassExpression"].includes(node.type))identifierNames(node.id,bindings);
    if(node.type==="CatchClause")identifierNames(node.param,bindings);
    if(node.type==="ImportDeclaration")for(const s of node.specifiers)identifierNames(s.local,bindings);
    if(node.type==="AssignmentExpression")identifierNames(node.left,bindings);
  }
  const directBuiltin=sourceType==="script"&&!modeOpen&&!bindings.has("require")&&!nodes.some(({node})=>node.type==="WithStatement");
  const siteIds=new Set();
  const add=(node,siteKind,mode=null,argument=null,binding="not-applicable",extra=[])=>{
    const literal=argument?.type==="Literal"&&typeof argument.value==="string",expression=mode?literal?"literal":"dynamic":"none",specifier=mode&&literal?argument.value:null;
    const site={id:`${file}:${node.start}:${node.end}:${siteKind}`,file,start:node.start,end:node.end,kind:siteKind,mode,specifier,expression,sourceDigest:digest,binding};if(siteIds.has(site.id))return null;if(files.size+account.sites+1>20000)refuse("TIP081_MANIFEST_VERIFY_RESOURCE_REFUSED");account.sites++;siteIds.add(site.id);sites.push(site);
    for(const code of extra)obligations.push(makeObligation(file,node.start,node.end,code,site.id));
    if(binding==="unproven")obligations.push(makeObligation(file,node.start,node.end,"LOADER_BINDING_OPEN",site.id));
    if(mode&&!literal)obligations.push(makeObligation(file,node.start,node.end,"DYNAMIC_SPECIFIER",site.id));return site;
  };
  for(const {node,parent,key,conditional}of nodes){
    let site=null;
    if(node.type==="WithStatement")site=add(node,"with-scope",null,null,"not-applicable",["DYNAMIC_SCOPE_OPEN"]);
    else if(node.type==="ImportDeclaration")site=add(node,"import","import",node.source,"not-applicable",node.attributes?.length||node.options?["IMPORT_ATTRIBUTES_OPEN"]:[]);
    else if(node.type==="ExportNamedDeclaration"&&node.source||node.type==="ExportAllDeclaration")site=add(node,"export","import",node.source,"not-applicable",node.attributes?.length||node.options?["IMPORT_ATTRIBUTES_OPEN"]:[]);
    else if(node.type==="ImportExpression")site=add(node,"import-expression","import",node.source,"not-applicable",[...node.options?["IMPORT_ATTRIBUTES_OPEN"]:[],...node.optional?["OPTIONAL_CALL_OPEN"]:[]]);
    else if(node.type==="TaggedTemplateExpression")site=add(node,"unknown-tagged-template",null,null,"not-applicable",["UNKNOWN_TAGGED_TEMPLATE_OPEN"]);
    else if(node.type==="CallExpression"||node.type==="NewExpression"){
      const callee=node.callee,identifier=callee?.type==="Identifier"?callee.name:null,object=callee?.type==="MemberExpression"&&callee.object?.type==="Identifier"?callee.object.name:null,member=propertyName(callee),extra=[];
      if(node.optional||callee?.optional)extra.push("OPTIONAL_CALL_OPEN");
      const signatureOpen=node.arguments.length!==1||node.arguments.some(a=>a.type==="SpreadElement");
      if(identifier==="eval")site=add(node,"eval",null,null,"not-applicable",[...extra,"EVAL_OPEN"]);
      else if(identifier==="Function")site=add(node,"function",null,null,"not-applicable",[...extra,"FUNCTION_OPEN"]);
      else if(node.type==="NewExpression")site=add(node,"unknown-new",null,null,"not-applicable",[...extra,"UNKNOWN_NEW"]);
      else if(identifier==="require")site=add(node,"require","require",node.arguments[0],directBuiltin?"builtin":"unproven",[...extra,...signatureOpen?["CALL_SIGNATURE_OPEN"]:[]]);
      else if(node.type==="CallExpression"&&object==="require"&&member==="resolve"&&!callee.computed)site=add(node,"require-resolve","require",node.arguments[0],directBuiltin?"builtin":"unproven",[...extra,...signatureOpen?["CALL_SIGNATURE_OPEN"]:[]]);
      else if(node.type==="CallExpression"&&(identifier==="__webpack_require__"||["require","module","__webpack_require__"].includes(object)))site=add(node,"computed-loader","require",node.arguments[0],"unproven",[...extra,"COMPUTED_LOADER_OPEN",...signatureOpen?["CALL_SIGNATURE_OPEN"]:[]]);
      else if(["fs","fsp","fsPromises"].includes(object))site=add(node,"filesystem-call",null,null,"not-applicable",[...extra,"FILESYSTEM_ASSET_OPEN"]);
      else if(object==="process"&&member==="dlopen")site=add(node,"native-loader",null,null,"not-applicable",[...extra,"NATIVE_LOADER_OPEN"]);
      else site=add(node,node.type==="NewExpression"?"unknown-new":"unknown-call",null,null,"not-applicable",[...extra,node.type==="NewExpression"?"UNKNOWN_NEW":"UNKNOWN_CALL"]);
    }else if(node.type==="MemberExpression"&&["require","module","__webpack_require__"].includes(node.object?.type==="Identifier"?node.object.name:null)&&!(["CallExpression","NewExpression"].includes(parent?.type)&&key==="callee"))site=add(node,"computed-loader","require",null,"unproven",["COMPUTED_LOADER_OPEN"]);
    else if(node.type==="Identifier"&&["require","__webpack_require__"].includes(node.name)&&!(["CallExpression","NewExpression"].includes(parent?.type)&&key==="callee")&&!(parent?.type==="MemberExpression"&&key==="object"))site=add(node,"loader-reference",null,null,"unproven",["LOADER_REFERENCE_OPEN"]);
    if(site?.mode&&conditional)obligations.push(makeObligation(file,node.start,node.end,"CONDITIONAL_BRANCH_OPEN",site.id));
  }
  sites.sort((a,b)=>a.start-b.start||a.end-b.end||lexical(a.kind,b.kind));obligations.sort((a,b)=>lexical(a.id,b.id));return analysis;
}

/** Reconstruct every supplied file and source site, not a producer self-comparison. */
export function verifyManifestCandidate(snapshot,candidate){
  safeJsonData(candidate,{maxNodes:1000000,maxDepth:128,maxBytes:67108864});
  ownRecord(candidate,["version","purpose","snapshotDigest","profile","epoch","entries","files","analyses","edges","obligations","status","fullRuntimeClosure","digest"]);
  const {files,metadata}=readManifestSnapshot(snapshot),started=performance.now(),account={started,nodes:0,sites:0};
  if(metadata.baseBundleDigest!==MANIFEST_BASE_BUNDLE_DIGEST)refuse("TIP081_MANIFEST_BASE_REFUSED");
  const rows=[...files].sort(([a],[b])=>lexical(a,b)).map(([file,bytes])=>{manifestPath(file);return {path:file,size:bytes.length,digest:sha(bytes),kind:nativeKind(file)};});
  if(!isDeepStrictEqual(rows,metadata.files))refuse("TIP081_MANIFEST_SNAPSHOT_BYTES_REFUSED");
  const analyses=rows.map(row=>analyzeIndependently(files,row.path,account)),edges=[],obligations=analyses.flatMap(a=>a.obligations);let siteCount=0;
  for(const analysis of analyses)for(const site of analysis.sites){
    if(++siteCount+files.size>20000||performance.now()-started>120000)refuse("TIP081_MANIFEST_VERIFY_RESOURCE_REFUSED");
    if(!site.mode)continue;
    const codes=analysis.obligations.filter(o=>o.siteId===site.id).map(o=>o.code),forcing=["LOADER_BINDING_OPEN","OPTIONAL_CALL_OPEN","CALL_SIGNATURE_OPEN","IMPORT_ATTRIBUTES_OPEN"].find(code=>codes.includes(code));
    const edge=forcing?{importer:site.file,mode:site.mode,specifier:site.specifier,status:"UNRESOLVED",target:null,packageFiles:[],conditions:["node",site.mode,"default"],absentCandidates:[],reason:forcing}:independentResolution(files,site.file,site.specifier,site.mode);
    edges.push({siteId:site.id,...edge});if(edge.status==="UNRESOLVED")obligations.push(makeObligation(site.file,site.start,site.end,"UNRESOLVED_EDGE",site.id));
  }
  edges.sort((a,b)=>lexical(a.siteId,b.siteId));obligations.sort((a,b)=>lexical(a.id,b.id));
  const body={version:1,purpose:"TIP081_DATA_ONLY_MANIFEST",snapshotDigest:metadata.digest,profile:metadata.profile,epoch:metadata.epoch,entries:metadata.entries,files:rows,analyses,edges,obligations,status:"CANDIDATE",fullRuntimeClosure:"NOT_ACCEPTED"};
  const expected={...body,digest:manifestDigest(body)};
  const inputBytes=[...files.values()].reduce((n,b)=>n+b.length,0),metadataBytes=Buffer.byteLength(canonicalManifest(metadata)),candidateBytes=Buffer.byteLength(canonicalManifest(expected));if(inputBytes+metadataBytes+candidateBytes>67108864)refuse("TIP081_MANIFEST_VERIFY_RESOURCE_REFUSED");
  if(!isDeepStrictEqual(candidate,expected))refuse("TIP081_MANIFEST_INDEPENDENT_MISMATCH");
  const receipt={version:1,purpose:"TIP081_INDEPENDENT_MANIFEST_VERIFICATION",status:"STATIC_GRAPH_VERIFIED",scope:"SUPPLIED_INVENTORY_ONLY",offsetSemantics:"JS_UTF16_CODE_UNITS_OTHER_BYTES",snapshotDigest:metadata.digest,candidateDigest:expected.digest,verifiedFiles:rows.length,verifiedSites:siteCount,verifiedEdges:edges.length,openObligations:obligations,fullRuntimeClosure:"NOT_ACCEPTED",materializationAllowed:false,executionAllowed:false,sharedAssumptions:["Pinned Acorn syntax parser", "Immutable snapshot read accessor", "Canonical JSON and path grammar", "Only node/import/require/default keys in visited condition objects; skipped opposite-mode branch contents are not certified"],independentChecks:["Own AST traversal and loader/site inventory", "Own data-only package and condition resolution", "Exact ordered graph and obligation comparison"]};
  const complete={...receipt,digest:manifestDigest(receipt)};
  if(inputBytes+metadataBytes+candidateBytes+Buffer.byteLength(canonicalManifest(complete))>67108864||performance.now()-started>120000)refuse("TIP081_MANIFEST_VERIFY_RESOURCE_REFUSED");
  deepFreeze(complete);if(performance.now()-started>120000)refuse("TIP081_MANIFEST_VERIFY_RESOURCE_REFUSED");return complete;
}

const launcherBody=serialized=>`\n\nconst dir = path.join(__dirname)\n\nprocess.env.NODE_ENV = 'production'\nprocess.chdir(__dirname)\n\nconst currentPort = parseInt(process.env.PORT, 10) || 3000\nconst hostname = process.env.HOSTNAME || '0.0.0.0'\n\nlet keepAliveTimeout = parseInt(process.env.KEEP_ALIVE_TIMEOUT, 10)\nconst nextConfig = ${serialized}\n\nprocess.env.__NEXT_PRIVATE_STANDALONE_CONFIG = JSON.stringify(nextConfig)\n\nrequire('next')\nconst { startServer } = require('next/dist/server/lib/start-server')\n\nif (\n  Number.isNaN(keepAliveTimeout) ||\n  !Number.isFinite(keepAliveTimeout) ||\n  keepAliveTimeout < 0\n) {\n  keepAliveTimeout = undefined\n}\n\nstartServer({\n  dir,\n  isDev: false,\n  config: nextConfig,\n  hostname,\n  port: currentPort,\n  allowRetry: false,\n  keepAliveTimeout,\n}).catch((err) => {\n  console.error(err);\n  process.exit(1);\n});`;
const esmHeader="performance.mark('next-start');\nimport path from 'node:path'\nimport { fileURLToPath } from 'node:url'\nimport module from 'node:module'\nconst require = module.createRequire(import.meta.url)\nconst __dirname = fileURLToPath(new URL('.', import.meta.url))\n";
const cjsHeader="const path = require('path')";

/** Integrity-bound source generation only. Caller assertions never earn admission. */
export function buildLauncherContract(input){
  const started=performance.now();
  ownRecord(input,["utilsBytes","configBytes","packageJsonBytes","distDir","binding"]);
  const utils=boundedBytes(input.utilsBytes,262144),configBytes=boundedBytes(input.configBytes,262144),packageBytes=boundedBytes(input.packageJsonBytes,65536);
  if(sha(utils)!==LAUNCHER_UTILS_DIGEST||input.distDir!==".next-tip080")refuse("TIP081_LAUNCHER_SOURCE_REFUSED");
  ownRecord(input.binding,["sourceBundleDigest","configDigest","reviewDigest","epochDigest"]);safeJsonData(input.binding);
  if(input.binding.sourceBundleDigest!==MANIFEST_BASE_BUNDLE_DIGEST||input.binding.configDigest!==sha(configBytes)||![input.binding.reviewDigest,input.binding.epochDigest].every(v=>typeof v==="string"&&/^[a-f0-9]{64}$/.test(v)))refuse("TIP081_LAUNCHER_BINDING_REFUSED");
  const config=parseJson(configBytes,262144,true),pkg=parseJson(packageBytes,65536,true);
  if(!plain(config)||!plain(pkg)||Object.hasOwn(config,"webpack")||Object.hasOwn(config,"outputFileTracingRoot")&&typeof config.outputFileTracingRoot!=="string"||pkg.type!==undefined&&!["commonjs","module"].includes(pkg.type))refuse("TIP081_LAUNCHER_CONFIG_REFUSED");
  if(Object.hasOwn(config,"distDir")&&config.distDir!==input.distDir)refuse("TIP081_LAUNCHER_CONFIG_REFUSED");
  for(const field of ["env","serverRuntimeConfig","publicRuntimeConfig"])if(Object.hasOwn(config,field)&&(!plain(config[field])||Reflect.ownKeys(config[field]).length))refuse("TIP081_LAUNCHER_ENV_REFUSED");
  // Same relocation rule as copyTracedFiles: ./ + relative(dir, distDir).
  const relocated={...config,distDir:`./${input.distDir}`},serialized=JSON.stringify(relocated),moduleType=pkg.type==="module",source=(moduleType?esmHeader:cjsHeader)+launcherBody(serialized);
  const original=utils.toString("utf8"),templateStart=original.indexOf("await _fs.promises.writeFile(serverOutputPath, `${moduleType ? "),templateEnd=original.indexOf("`);\n}\nfunction isReservedPage",templateStart);
  if(templateStart<0||templateEnd<templateStart)refuse("TIP081_LAUNCHER_TEMPLATE_REFUSED");const template=original.slice(templateStart,templateEnd+3);
  // Full CJS/ESM envelope and body parity, not a substrings-only acceptance.
  const expectedTemplate="await _fs.promises.writeFile(serverOutputPath, `${moduleType ? `"+esmHeader+"` : `"+cjsHeader+"`}"+launcherBody("${JSON.stringify(nextConfig)}")+"`);";
  if(template!==expectedTemplate)refuse("TIP081_LAUNCHER_TEMPLATE_REFUSED");
  const seeds=moduleType?[{specifier:"node:path",mode:"import",builtin:true},{specifier:"node:url",mode:"import",builtin:true},{specifier:"node:module",mode:"import",builtin:true}]:[{specifier:"path",mode:"require",builtin:true}];
  seeds.push({specifier:"next",mode:"require",builtin:false},{specifier:"next/dist/server/lib/start-server",mode:"require",builtin:false});
  const tree=loadManifestParser().parse(source,{sourceType:moduleType?"module":"script"}),observed=[];const pending=[tree];
  while(pending.length){const node=pending.pop();if(!node||typeof node!=="object")continue;if(node.type==="ImportDeclaration")observed.push({specifier:node.source.value,mode:"import",builtin:true});if(node.type==="CallExpression"&&node.callee?.type==="Identifier"&&node.callee.name==="require"&&node.arguments?.length===1&&node.arguments[0].type==="Literal"&&typeof node.arguments[0].value==="string")observed.push({specifier:node.arguments[0].value,mode:"require",builtin:node.arguments[0].value==="path"});for(const item of Object.values(node))if(Array.isArray(item))pending.push(...item);else if(item&&typeof item==="object")pending.push(item);}
  const ordered=list=>list.map(v=>canonicalManifest(v)).sort();if(!isDeepStrictEqual(ordered(observed),ordered(seeds)))refuse("TIP081_LAUNCHER_SEED_REFUSED");
  const result={version:1,purpose:"TIP081_SOURCE_DERIVED_LAUNCHER_CONTRACT",status:"GENERATED_CONTRACT_UNADMITTED",scope:"SOURCE_CONTRACT_ONLY",reviewedConfigAuthority:"NOT_ESTABLISHED",fullRuntimeClosure:"NOT_ACCEPTED",materializationAllowed:false,executionAllowed:false,applicationBuilds:0,executed:false,
    source,sourceDigest:sha(source),utilsDigest:sha(utils),templateDigest:sha(template),configDigest:sha(configBytes),packageDigest:sha(packageBytes),serializedConfigDigest:sha(serialized),binding:{...input.binding},moduleType:moduleType?"ESM":"CJS",distDir:`./${input.distDir}`,cwd:"LAUNCHER_DIRECTORY",nodeEnv:"production",isDev:false,allowRetry:false,keepAliveBehavior:"parseInt; invalid/nonfinite/negative becomes undefined",seeds};
  const complete={...result,digest:manifestDigest(result)};
  if(utils.length+configBytes.length+packageBytes.length+Buffer.byteLength(template)+Buffer.byteLength(canonicalManifest(input.binding))+Buffer.byteLength(canonicalManifest(complete))>67108864)refuse("TIP081_LAUNCHER_RESOURCE_REFUSED");
  deepFreeze(complete);if(performance.now()-started>120000)refuse("TIP081_LAUNCHER_RESOURCE_REFUSED");return complete;
}
