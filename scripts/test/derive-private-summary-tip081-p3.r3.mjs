// SOURCE_ONLY R3 fixed offline deriver. No target import/eval, outputs or process.
import {openSync, fstatSync, readSync, closeSync, constants, Stats} from "node:fs";
import {Buffer} from "node:buffer";
import {createHash, Hash} from "node:crypto";
import {TextDecoder} from "node:util";

/** @typedef {import('typescript').Node} Node */
/** @typedef {import('typescript').SourceFile} Tree */
/** @typedef {import('typescript').FunctionDeclaration & {body:import('typescript').Block,name:import('typescript').Identifier}} Declaration */
/** @typedef {{path:string, maximum:number, bytes:number|null, sha256:string|null}} Input */
/** @typedef {{start:number,end:number,kind:string,bytes:number,name?:string,formula?:string,operands?:Record<string,unknown>}} CostRow */
/** @typedef {{start:number,end:number,kind:string,operand:string|null,parent:number|null,children:number[],inertBody:boolean}} BootstrapShape */
/** @typedef {{start:number,end:number,call:string,site:number,argumentSpans:{start:number,end:number,kind:string}[],parent:number|null,children:number[]}} BootstrapCall */
/** @typedef {{start:number,end:number,replacement:string,kind:string}} Edit */
/** @typedef {{name:string,start:number,end:number,parameters:number,locals:number,nested:number,nestedExpressions:number,bindings:{name:string,start:number,end:number,role:string}[],bytes:number,domain:string,calls:string[]}} FrameRow */
/** @typedef {{staticBytes:number,workspaceBytes:number,startup:CostRow[],frames:FrameRow[],edges:{from:string,to:string,kind:string,start:number}[],sourceRows:{start:number,end:number,kind:string}[]}} Census */
/** @typedef {{candidate:string,inventory:string,profile:string}} Artifacts */
/** @typedef {{normal:Artifacts,aliasFault:Artifacts,boundaryKernel:Artifacts,review:Record<string,unknown>}} Result */

const ROOT="/Users/os/hiveos/";
const INPUTS=Object.freeze({
  candidate:{path:"scripts/test/generated/private-grammar-tip081-p2.checked.candidate.mjs",maximum:2228288,bytes:931985,sha256:"114334cd56f1edd181acf27e89fda40d6fca9c96e6f1a311532f346f43ae62ef"},
  inventory:{path:"scripts/test/generated/private-grammar-tip081-p2.checked.inventory.json",maximum:16777216,bytes:5710072,sha256:"41cfffe1f86a1499a490345ca059a54ace1f33d75bf77f8c8093fe19db3843e9"},
  profile:{path:"scripts/test/generated/private-grammar-tip081-p2.checked.profile.json",maximum:65536,bytes:2491,sha256:"9bc54a3542094a08a3d45fbf5b66c2feb8ffde72de4ca6efedfeac57ed6f47b8"},
  producer:{path:"scripts/test/private-summary-runtime-tip081-p3.r3.mjs",maximum:131072,bytes:null,sha256:null},
  verifier:{path:"scripts/test/private-summary-verifier-tip081-p3.r3.mjs",maximum:131072,bytes:null,sha256:null},
  kernel:{path:"scripts/test/private-summary-kernel-tip081-p3.r3.mjs",maximum:131072,bytes:null,sha256:null},
  tsLib:{path:"node_modules/typescript/lib/typescript.js",maximum:16777216,bytes:9112572,sha256:"3ae902c92cc44dace175c0e69e13a4b0899f6983c6121d76b9ab8dd5795e7675"},
  tsPackage:{path:"node_modules/typescript/package.json",maximum:65536,bytes:3620,sha256:"822ef7ca6452205657b6288b066481ecf508bfbf43455d715cf7d3ec457561e6"}
});
const cApply=Reflect.apply,cDescriptor=Object.getOwnPropertyDescriptor,cProto=Object.setPrototypeOf;
const cKeys=Object.keys,cHasOwn=Object.hasOwn,cSafe=Number.isSafeInteger,cIs=Object.is,cFreeze=Object.freeze;
const cOpen=openSync,cStat=fstatSync,cRead=readSync,cClose=closeSync;
const cIsFile=Stats.prototype.isFile,cAlloc=Buffer.alloc,cByteLength=Buffer.byteLength;
const cHash=createHash,cHashUpdate=Hash.prototype.update,cHashDigest=Hash.prototype.digest;
const decoder=new TextDecoder("utf-8",{fatal:true,ignoreBOM:true});
const cDecode=TextDecoder.prototype.decode,cParse=JSON.parse;
const cArray=Array.isArray,cChar=String.prototype.charCodeAt,cSlice=String.prototype.slice;
const cNumberString=Number.prototype.toString,cFinite=Number.isFinite,cCeil=Math.ceil;
/** @type {typeof import('typescript')} */ let TS;
const PREFIX="__HIVE_P2_",SEAM="\nfunction __HIVE_P2_initialize() ";
const PRELUDE="const __HIVE_P2_RUNTIME_STATIC_BYTES=377040;\nconst __HIVE_P2_RUNTIME_WORKSPACE_BYTES=2757504;\n";
const ALIAS_CLEAR="state.producerRoot = null; // P3_ALIAS_CLEAR";
const ALIAS_RETAIN="state.producerRoot = state.producerRoot; // P3_ALIAS_FAULT_RETAIN";
const FAMILIES=cFreeze(["NODE_SCHEMA","ARRAY_BACKING","DERIVED_STRING","CALL_FRAME","BOOKKEEPING"]);
const REMOVED=cFreeze(["createSyntheticGrammarFixtureP2","analyzeSyntheticGrammarFixtureP2","observeSyntheticGrammarFixtureP2","retireSyntheticGrammarFixtureP2","__HIVE_P2_observe"]);
const DOMAINS=cFreeze(["TIP081_P3_SYNTHETIC_ONLY","TIP081_P3_ALIAS_FAULT_TEST_ONLY","TIP081_P3_BOUNDARY_KERNEL_UNIT_ONLY"]);
const P3_APIS=cFreeze(["createSyntheticSummaryP3","analyzeSyntheticSummaryP3","retireProducerSummaryP3","verifySyntheticSummaryP3","observeSyntheticSummaryP3","retireSyntheticSummaryP3"]);
const SHARED=cFreeze(["__HIVE_P3_encodeSummary","__HIVE_P3_put","__HIVE_P3_raw","__HIVE_P3_string","__HIVE_P3_unsigned",
  "__HIVE_P3_field","__HIVE_P3_rotate","__HIVE_P3_ledgerField","__HIVE_P3_sha256",
  "__HIVE_P3_pGuardChild","__HIVE_P3_guardEntries","__HIVE_P3_vU","__HIVE_P3_vGuardChild","__HIVE_P3_vSha256","__HIVE_P3_vShaBlock"]);

/** @param {string} code @returns {never} */
function stopR3(code){throw new Error(code);}
/** @param {number} n @param {number} maximum @returns {number} */
function boundedR3(n,maximum){if(!cSafe(n)||n<0||cIs(n,-0)||n>maximum)stopR3("R3_TOOL_INTEGER_CAP");return n;}
/** @param {number} a @param {number} b @returns {number} */
function addR3(a,b){boundedR3(a,67108864);boundedR3(b,67108864);if(b>67108864-a)stopR3("R3_TOOL_COST_CAP");return a+b;}
/** @param {Uint8Array|string} bytes @returns {string} */
function hashToolBytesR3(bytes){
  if((typeof bytes==="string"?cByteLength(bytes):bytes.byteLength)>16777216)stopR3("R3_TOOL_HASH_CAP");
  let hash=null;
  try{hash=cHash("sha256");cApply(cHashUpdate,hash,[bytes]);return cApply(cHashDigest,hash,["hex"]);}
  finally{hash=null;}
}
/** @param {keyof typeof INPUTS} id @returns {Buffer} */
function readFixedSourceR3(id){
  const input=INPUTS[id];if(!input)stopR3("R3_TOOL_INPUT_ID");
  let fd=null,before=null,after=null,bytes=null,probe=null,first,failed=false,offset=0,n,reads=0,maximumReads=0;
  try{
    try{
      fd=cOpen(ROOT+input.path,constants.O_RDONLY|constants.O_NOFOLLOW);before=cStat(fd);
      if(!cApply(cIsFile,before,[])||!cSafe(before.size)||before.size<1||before.size>input.maximum||input.bytes!==null&&before.size!==input.bytes)stopR3("R3_TOOL_SIZE_DRIFT");
      maximumReads=cCeil(before.size/32768)+1;bytes=cAlloc(before.size);
      while(offset<bytes.length){if(++reads>maximumReads)stopR3("R3_TOOL_READ_CALL_CAP");n=cRead(fd,bytes,offset,Math.min(32768,bytes.length-offset),offset);
        if(!cSafe(n)||n<=0||n>Math.min(32768,bytes.length-offset))stopR3("R3_TOOL_READ_PROGRESS");offset+=n;}
      probe=cAlloc(1);n=cRead(fd,probe,0,1,bytes.length);if(n!==0)stopR3("R3_TOOL_EOF_DRIFT");
      after=cStat(fd);if(before.dev!==after.dev||before.ino!==after.ino||before.size!==after.size||before.mtimeMs!==after.mtimeMs||before.ctimeMs!==after.ctimeMs)stopR3("R3_TOOL_FD_DRIFT");
      if(input.sha256!==null&&hashToolBytesR3(bytes)!==input.sha256)stopR3("R3_TOOL_PIN_DRIFT");
      return bytes;
    }catch(error){first=error;failed=true;throw error;}
    finally{try{if(fd!==null)cClose(fd);}catch(closeError){if(!failed)throw closeError;throw first;}}
  }finally{fd=null;before=null;after=null;bytes=null;probe=null;}
}
/** @param {Uint8Array} bytes @returns {string} */
function decodeFixedUtf8R3(bytes){return cApply(cDecode,decoder,[bytes]);}
/** @param {string} text @param {string} label @returns {Tree} */
function parseDerivationTextR3(text,label){
  if(cByteLength(text)>2228288)stopR3("R3_TOOL_SOURCE_CAP");
  const tree=TS.createSourceFile(label,text,TS.ScriptTarget.ESNext,true,TS.ScriptKind.JS);
  // TS parser diagnostics are TOOL evidence only; never target execution.
  const diagnostics=/** @type {Tree & {parseDiagnostics:readonly import('typescript').Diagnostic[]}} */(tree).parseDiagnostics;
  if(diagnostics.length)stopR3("R3_TOOL_SOURCE_SYNTAX");return tree;
}
/** @param {string} text @param {string} seam @returns {number} */
function uniqueSpanR3(text,seam){const at=text.indexOf(seam);if(at<0||text.indexOf(seam,at+seam.length)>=0)stopR3("R3_TOOL_SEAM_DRIFT");return at;}
/** @param {Node} node @returns {boolean} */
function functionKindR3(node){return TS.isFunctionDeclaration(node)||TS.isFunctionExpression(node)||TS.isArrowFunction(node)||TS.isMethodDeclaration(node)||TS.isGetAccessor(node)||TS.isSetAccessor(node)||TS.isConstructorDeclaration(node);}
/** Main L2: comma spine nodes remain visited/counted; only non-comma structural
 * descent consumes the512 TOOL depth. No target expression evaluation.
 * @param {Node} node @param {number} depth @returns {number} */
function childDepthR3(node,depth){return TS.isBinaryExpression(node)&&node.operatorToken.kind===TS.SyntaxKind.CommaToken?depth:depth+1;}
/** @param {Node} root @param {(node:Node,depth:number)=>boolean|void} visitor @returns {void} */
function walkR3(root,visitor){
  /** @type {{node:Node,depth:number}[]} */const stack=[{node:root,depth:0}];let count=0;
  while(stack.length){const item=stack.pop();if(!item)stopR3("R3_TOOL_STACK");if(++count>1000000||item.depth>512)stopR3("R3_TOOL_AST_CAP");
    if(visitor(item.node,item.depth)===false)continue;
    /** @type {Node[]} */const children=[];TS.forEachChild(item.node,child=>{if(children.length>=1000000)stopR3("R3_TOOL_AST_CAP");children.push(child);});
    for(let i=children.length-1;i>=0;i--){if(stack.length>=1000000)stopR3("R3_TOOL_AST_CAP");stack.push({node:children[i],depth:childDepthR3(item.node,item.depth)});}
  }
}
/** @param {Node} node @returns {string} */
function nameR3(node){if(TS.isIdentifier(node)||TS.isStringLiteral(node)||TS.isNumericLiteral(node))return node.text;stopR3("R3_TOOL_KEY_KIND");}
/** @param {Node} node @param {Tree} tree @returns {string} */
function textR3(node,tree){return node.getText(tree);}
/** @param {Node} node @param {string} target @returns {import('typescript').CallExpression} */
function callR3(node,target){if(!TS.isCallExpression(node)||!TS.isIdentifier(node.expression)||node.expression.text!==target)stopR3("R3_TOOL_CALL_SHAPE");return node;}
/** @param {Node} node @returns {number} */
function numericR3(node){if(!TS.isNumericLiteral(node))stopR3("R3_TOOL_NUMERIC_LITERAL");return boundedR3(Number(node.text),67108864);}
/** @param {Node} node @returns {string} */
function literalR3(node){if(!TS.isStringLiteral(node))stopR3("R3_TOOL_STRING_LITERAL");return node.text;}
/** @param {string} template @returns {string} */
function unwrapVerifierR3(template){
  const tree=parseDerivationTextR3(template,"fixed-verifier-r3.mjs");let found=null;
  for(const statement of tree.statements){if(!TS.isVariableStatement(statement))continue;
    for(const declaration of statement.declarationList.declarations){if(!TS.isIdentifier(declaration.name)||declaration.name.text!=="PRIVATE_SUMMARY_VERIFIER_P3_R3")continue;
      const init=declaration.initializer;if(found!==null||!init||!TS.isTaggedTemplateExpression(init)||init.tag.getText(tree)!=="String.raw"||!TS.isNoSubstitutionTemplateLiteral(init.template))stopR3("R3_TOOL_VERIFIER_TEMPLATE");
      found=init.template.getText(tree).slice(1,-1);if(found.includes("\\`"))stopR3("R3_TOOL_VERIFIER_ESCAPE");}}
  if(found===null)stopR3("R3_TOOL_VERIFIER_MISSING");return found;
}
/** @param {string} owner @param {string} first @returns {number} */
function reserveFamilyR3(owner,first){
  if(owner===PREFIX+"meta"&&first==="224")return 4;
  if(owner===PREFIX+"reserveObject")return 0;
  if(owner===PREFIX+"ownObject"&&first==="16")return 4;
  if(owner===PREFIX+"reserveArray")return 1;
  if(owner===PREFIX+"ownArray"&&first==="16")return 4;
  if(owner===PREFIX+"reserveFunction"&&first==="192")return 3;
  if(owner===PREFIX+"registerFunction"&&["176","128","16"].includes(first))return 4;
  if(owner===PREFIX+"frame")return 3;
  if(owner===PREFIX+"construct"&&first==="80")return 0;
  if(["get","defineData","hasProperty","indexOf"].includes(owner.slice(PREFIX.length))&&["128","16"].includes(first))return 4;
  if(owner===PREFIX+"set"){if(first==="16")return 0;if(first==="128"||first==="0")return 4;if(first.startsWith("__HIVE_P2_plus(88,"))return 1;}
  if(owner===PREFIX+"remove"&&first==="16")return 0;
  if(["primitiveString","concat","primitive","slice","codePoint","number","keys"].includes(owner.slice(PREFIX.length)))return 2;
  if(owner===PREFIX+"native"&&first==="128")return 4;
  stopR3("R3_TOOL_RESERVE_FAMILY");
}
/** @param {import('typescript').CallExpression} node @param {Tree} tree @param {string} owner @returns {Edit} */
function reserveEditR3(node,tree,owner){
  const args=node.arguments.map(arg=>textR3(arg,tree));if(args.length<1||args.length>3)stopR3("R3_TOOL_RESERVE_ARITY");
  const n=args[1]??"0",e=args[2]??"0";let replacement;
  if(owner===PREFIX+"set"&&args[0]==="__HIVE_P2_plus(72, __HIVE_P2_product(keyString.length, 2))")replacement="(__HIVE_P2_reserve(72,"+n+","+e+",0),__HIVE_P2_reserve(__HIVE_P2_product(keyString.length,2),0,0,2))";
  else if(owner===PREFIX+"native"&&args[0]==="__HIVE_P2_plus(88, __HIVE_P2_product(names[i].length, 2))")replacement="(__HIVE_P2_reserve(88,"+n+","+e+",0),__HIVE_P2_reserve(__HIVE_P2_product(names[i].length,2),0,0,2))";
  else replacement="__HIVE_P2_reserve("+args.join(",")+(args.length<2?",0":"")+(args.length<3?",0":"")+","+reserveFamilyR3(owner,args[0])+")";
  return{start:node.getStart(tree),end:node.end,replacement,kind:"INHERITED_CLOSED_RESERVE"};
}
/** @param {string} source @param {Edit[]} edits @returns {string} */
function applySourceEditsR3(source,edits){
  if(edits.length>20000)stopR3("R3_TOOL_EDIT_CAP");edits.sort((a,b)=>a.start-b.start);
  let at=0,result="";
  for(const edit of edits){if(!cSafe(edit.start)||!cSafe(edit.end)||edit.start<at||edit.end<edit.start||edit.end>source.length)stopR3("R3_TOOL_EDIT_OVERLAP");result=appendSourceR3(appendSourceR3(result,source.slice(at,edit.start)),edit.replacement);at=edit.end;}
  return appendSourceR3(result,source.slice(at));
}
/** Both operands are already bounded source text; cap BEFORE concatenation.
 * @param {string} left @param {string} right @returns {string} */
function appendSourceR3(left,right){if(cByteLength(left)>2228288-cByteLength(right))stopR3("R3_TOOL_SOURCE_CAP");return left+right;}
/** @param {string} source @returns {{result:string,edits:Edit[]}} */
function replaceInheritedRuntimeR3(source){
  const tree=parseDerivationTextR3(source,"fixed-p2-prefix.mjs");/** @type {Edit[]} */const edits=[];const removed=new Set();let reserve=0,dispose=0;
  for(const statement of tree.statements){if(!TS.isFunctionDeclaration(statement)||!statement.name)continue;const owner=statement.name.text;
    if(REMOVED.includes(owner)){removed.add(owner);edits.push({start:statement.getStart(tree),end:statement.end,replacement:"",kind:"REMOVE_P2_API"});continue;}
    if(owner===PREFIX+"reserve"){reserve++;edits.push({start:statement.getStart(tree),end:statement.end,replacement:"function __HIVE_P2_reserve(bytes,nodes=0,entries=0,family){return __HIVE_P3_commonReserve(bytes,nodes,entries,family);}",kind:"P3_RESERVE_BRIDGE"});continue;}
    if(owner===PREFIX+"dispose"){dispose++;edits.push({start:statement.getStart(tree),end:statement.end,replacement:"function __HIVE_P2_dispose(){return __HIVE_P3_dispose();}",kind:"P3_DISPOSE_BRIDGE"});continue;}
    walkR3(statement,node=>{if(node!==statement&&functionKindR3(node))stopR3("R3_TOOL_NESTED_RUNTIME");if(TS.isCallExpression(node)&&TS.isIdentifier(node.expression)&&node.expression.text===PREFIX+"reserve")edits.push(reserveEditR3(node,tree,owner));});}
  if(reserve!==1||dispose!==1||removed.size!==REMOVED.length)stopR3("R3_TOOL_RUNTIME_SEAMS");
  return{result:applySourceEditsR3(source,edits),edits};
}

/** @param {Node} node @param {string} role @param {FrameRow} sink @returns {void} */
function collectBindingRowsR3(node,role,sink){
  if(TS.isIdentifier(node)){sink.bindings.push({name:node.text,start:node.getStart(),end:node.end,role});if(role==="PARAMETER")sink.parameters++;else sink.locals++;return;}
  if(TS.isObjectBindingPattern(node)||TS.isArrayBindingPattern(node)){for(const element of node.elements){if(TS.isOmittedExpression(element))continue;if(!TS.isBindingElement(element))stopR3("R3_TOOL_BINDING_KIND");collectBindingRowsR3(element.name,role,sink);}return;}
  stopR3("R3_TOOL_BINDING_KIND");
}
/** @param {import('typescript').FunctionDeclaration|import('typescript').FunctionExpression} fn @param {Tree} tree @param {string} domain @returns {FrameRow} */
function frameShapeR3(fn,tree,domain){
  if(!fn.body)stopR3("R3_TOOL_FUNCTION_BODY");
  /** @type {FrameRow} */const row={name:fn.name?.text??"ANONYMOUS_SOURCE_SPAN:"+fn.getStart(tree)+":"+fn.end,start:fn.getStart(tree),end:fn.end,parameters:0,locals:0,nested:0,nestedExpressions:0,bindings:[],bytes:0,domain,calls:[]};
  /** @type {FrameRow} */const typed=row;
  for(const param of fn.parameters)collectBindingRowsR3(param.name,"PARAMETER",typed);
  walkR3(fn.body,node=>{if(functionKindR3(node)){if(TS.isFunctionDeclaration(node))typed.nested++;else typed.nestedExpressions++;return false;}
    if(TS.isVariableDeclaration(node))collectBindingRowsR3(node.name,"LOCAL",typed);
    if(TS.isCatchClause(node)&&node.variableDeclaration){collectBindingRowsR3(node.variableDeclaration.name,"CATCH",typed);return false;}});
  // Catch body declarations need their own walk; the catch binder is not counted
  // again as a VariableDeclaration container or collapsed by repeated spelling.
  walkR3(fn.body,node=>{if(functionKindR3(node))return false;if(TS.isCatchClause(node)){walkCatchBodyR3(node.block,typed);return false;}});
  typed.bytes=64+16*(typed.parameters+typed.locals);return typed;
}
/** @param {Node} block @param {FrameRow} row @returns {void} */
function walkCatchBodyR3(block,row){walkR3(block,node=>{if(functionKindR3(node)){if(TS.isFunctionDeclaration(node))row.nested++;else row.nestedExpressions++;return false;}if(TS.isCatchClause(node)){if(node.variableDeclaration)collectBindingRowsR3(node.variableDeclaration.name,"CATCH",row);walkCatchBodyR3(node.block,row);return false;}if(TS.isVariableDeclaration(node))collectBindingRowsR3(node.name,"LOCAL",row);});}
/** @param {Node} node @returns {string[]} */
function ownFieldsR3(node){if(!TS.isObjectLiteralExpression(node))stopR3("R3_TOOL_OBJECT_KIND");const keys=[];
  for(const property of node.properties){if(TS.isSpreadAssignment(property)||!property.name||TS.isComputedPropertyName(property.name))stopR3("R3_TOOL_OBJECT_OPEN");const key=nameR3(property.name);
    if(key==="__proto__"){if(!TS.isPropertyAssignment(property)||property.initializer.kind!==TS.SyntaxKind.NullKeyword)stopR3("R3_TOOL_PROTOTYPE_OPEN");continue;}
    if(keys.includes(key))stopR3("R3_TOOL_DUPLICATE_KEY");keys.push(key);}return keys;}
/** @param {Tree} tree @param {number} runtimeEnd @param {string} domain @returns {Census} */
function collectSourceRowsR3(tree,runtimeEnd,domain){
  /** @type {Census} */const result={staticBytes:32,workspaceBytes:0,startup:[],frames:[],edges:[],sourceRows:[]};
  result.startup.push({start:0,end:0,kind:"C00_TWO_NUMERIC_BINDINGS",bytes:32});
  /** @param {Node} node @param {string} kind @param {number} bytes */
  function site(node,kind,bytes){if(result.startup.length>=20000)stopR3("R3_TOOL_STARTUP_ROWS");result.staticBytes=addR3(result.staticBytes,bytes);result.startup.push({start:node.getStart(tree),end:node.end,kind,bytes});}
  // Function depth is carried explicitly, not inferred from getStart ranges.
  /** @type {{node:Node,functionDepth:number,depth:number}[]} */const stack=[{node:tree,functionDepth:0,depth:0}];let count=0;
  while(stack.length){const item=stack.pop();if(!item)stopR3("R3_TOOL_STACK");const node=item.node,root=item.functionDepth===0;
    if(++count>1000000||item.depth>512)stopR3("R3_TOOL_AST_CAP");
    if(result.sourceRows.length>=20000&& (TS.isCallExpression(node)||TS.isNewExpression(node)||functionKindR3(node)))stopR3("R3_TOOL_SOURCE_ROWS");
    if(TS.isStringLiteral(node))site(node,"C01_LITERAL_STRING",32+2*node.text.length);
    if((TS.isPropertyAssignment(node)||TS.isShorthandPropertyAssignment(node))&&node.name&&!TS.isComputedPropertyName(node.name))site(node.name,"C01_PROPERTY_KEY",32+2*nameR3(node.name).length);
    if(root&&TS.isFunctionDeclaration(node)){site(node,"C01_FUNCTION_PROTOTYPE",192);
      if(node.getStart(tree)<runtimeEnd){const row=frameShapeR3(node,tree,domain==="TIP081_P3_BOUNDARY_KERNEL_UNIT_ONLY"?"KERNEL":node.name?.text.startsWith(PREFIX)?"INHERITED_P2":"NEW_P3");if(row.nested||row.nestedExpressions)stopR3("R3_TOOL_DIRECT_HELPER_NESTING");result.frames.push(row);}}
    if(root&&TS.isVariableDeclaration(node)&&!(TS.isIdentifier(node.name)&&[PREFIX+"RUNTIME_STATIC_BYTES",PREFIX+"RUNTIME_WORKSPACE_BYTES"].includes(node.name.text))){const sink=/** @type {FrameRow} */({bindings:[],parameters:0,locals:0});collectBindingRowsR3(node.name,"LOCAL",sink);for(const binding of sink.bindings)site(node,"C01_BINDING:"+binding.name,16);}
    if(root&&TS.isImportDeclaration(node)&&node.importClause){const clause=node.importClause;
      if(clause.name)site(clause.name,"C01_IMPORT_BINDING",16);if(clause.namedBindings){if(TS.isNamespaceImport(clause.namedBindings))site(clause.namedBindings.name,"C01_IMPORT_BINDING",16);else for(const element of clause.namedBindings.elements)site(element.name,"C01_IMPORT_BINDING",16);}}
    if(root&&TS.isObjectLiteralExpression(node)){const fields=ownFieldsR3(node);site(node,"C01_OBJECT_SCHEMA",64+16*fields.length);if(node.properties.length!==fields.length)site(node,"C01_NULL_PROTOTYPE_SYNTAX",16);}
    if(root&&TS.isArrayLiteralExpression(node)){if(node.elements.some(element=>TS.isSpreadElement(element)||TS.isOmittedExpression(element)))stopR3("R3_TOOL_ARRAY_OPEN");site(node,"C01_ARRAY_BACKING",88+8*node.elements.length);}
    if(root&&TS.isCallExpression(node)&&TS.isPropertyAccessExpression(node.expression)&&node.expression.name.text==="bind")site(node,"C01_CAPTURED_BOUND_FUNCTION",96);
    if(root&&TS.isNewExpression(node)){if(!TS.isIdentifier(node.expression))stopR3("R3_TOOL_STATIC_NEW");
      if(node.expression.text==="WeakMap"&&(!node.arguments||node.arguments.length===0))site(node,"C01_WEAK_HEADER",96);
      else if(node.expression.text==="__HIVE_P3_TextDecoder"&&node.arguments?.length===2&&literalR3(node.arguments[0])==="utf-8"&&ownFieldsR3(node.arguments[1]).join(",")==="fatal,ignoreBOM")site(node,"C01_DECODER_CONTEXT",4096);
      else stopR3("R3_TOOL_STATIC_NEW");}
    if(root&&TS.isCallExpression(node)&&TS.isIdentifier(node.expression)&&node.expression.text==="__HIVE_P2_setPrototype"&&node.arguments.length===2&&TS.isIdentifier(node.arguments[0])&&["__HIVE_P3_unitRootKeys","__HIVE_P3_unitCaseKeys","__HIVE_P3_unitRegistry"].includes(node.arguments[0].text))site(node,"C01_KERNEL_BARE_TABLE_SANITIZER",16);
    if(TS.isCallExpression(node)||TS.isNewExpression(node)||functionKindR3(node))result.sourceRows.push({start:node.getStart(tree),end:node.end,kind:TS.SyntaxKind[node.kind]});
    /** @type {Node[]} */const children=[];TS.forEachChild(node,child=>{if(children.length>=1000000)stopR3("R3_TOOL_AST_CAP");children.push(child);});
    for(let i=children.length-1;i>=0;i--){if(stack.length>=1000000)stopR3("R3_TOOL_AST_CAP");stack.push({node:children[i],functionDepth:item.functionDepth+(functionKindR3(node)?1:0),depth:childDepthR3(node,item.depth)});}
  }
  for(const row of result.frames)result.workspaceBytes=addR3(result.workspaceBytes,row.bytes*(row.domain==="INHERITED_P2"?258:1));
  return result;
}

/** @param {Tree} tree @param {Census} census @param {number} runtimeEnd @returns {void} */
function collectDirectEdgesR3(tree,census,runtimeEnd){
  const globals=new Set(),aliases=new Map();
  for(const statement of tree.statements){if(TS.isFunctionDeclaration(statement)&&statement.name)globals.add(statement.name.text);
    if(TS.isVariableStatement(statement))for(const d of statement.declarationList.declarations){if(!TS.isIdentifier(d.name))stopR3("R3_TOOL_MODULE_BINDING");globals.add(d.name.text);if(d.initializer&&TS.isIdentifier(d.initializer))aliases.set(d.name.text,d.initializer.text);}
    if(TS.isImportDeclaration(statement)&&statement.importClause?.namedBindings&&TS.isNamedImports(statement.importClause.namedBindings))for(const e of statement.importClause.namedBindings.elements)globals.add(e.name.text);}
  for(const frame of census.frames){const fn=tree.statements.find(s=>TS.isFunctionDeclaration(s)&&s.name?.text===frame.name);if(!fn||!TS.isFunctionDeclaration(fn)||!fn.body)stopR3("R3_TOOL_GRAPH_FUNCTION");
    const local=new Set(frame.bindings.map(binding=>binding.name));
    walkR3(fn.body,node=>{if(functionKindR3(node))stopR3("R3_TOOL_HELPER_CALLBACK");if(!TS.isCallExpression(node)&&!TS.isNewExpression(node))return;
      let to,kind;
      if(TS.isIdentifier(node.expression)){to=node.expression.text;kind=TS.isNewExpression(node)?"NATIVE_CONSTRUCTOR":"DIRECT_OR_CAPTURED";
        if(local.has(to))stopR3("R3_TOOL_CALLER_CALLBACK");if(!globals.has(to)&&to!=="Array"&&to!=="Uint8Array"&&to!=="Uint32Array")stopR3("R3_TOOL_GLOBAL_CALL_OPEN");
        const seen=new Set();while(aliases.has(to)){if(seen.has(to))stopR3("R3_TOOL_ALIAS_CYCLE");seen.add(to);to=aliases.get(to);if(typeof to!=="string")stopR3("R3_TOOL_ALIAS_TARGET");}}
      else{to=node.expression.getText(tree);kind="FIXED_NATIVE_MEMBER";
        // Product snippets have no caller-selected property-call dispatch. The
        // only retained inherited dynamic dispatch is separately bounded P2.
        if(frame.domain!=="INHERITED_P2")stopR3("R3_TOOL_NEW_MEMBER_CALL_OPEN");}
      if(census.edges.length>=65536)stopR3("R3_TOOL_GRAPH_CAP");census.edges.push({from:frame.name,to,kind,start:node.getStart(tree)});
      if(census.frames.some(row=>row.name===to)&&!frame.calls.includes(to))frame.calls.push(to);});}
  if(census.frames.length>4096||runtimeEnd>tree.end)stopR3("R3_TOOL_GRAPH_CAP");
}
/** @param {Census} census @param {string} domain @returns {void} */
function validateGraphR3(census,domain){
  const rows=new Map(census.frames.map(row=>[row.name,row])),colors=new Map();
  /** @param {string} name @param {number} depth */
  function visit(name,depth){if(depth>512)stopR3("R3_TOOL_GRAPH_DEPTH");const row=rows.get(name);if(!row)stopR3("R3_TOOL_GRAPH_TARGET");
    if(row.domain==="INHERITED_P2")return;
    if(colors.get(name)===1)stopR3("R3_TOOL_NEW_HELPER_CYCLE");if(colors.get(name)===2)return;colors.set(name,1);
    for(const target of row.calls){const child=rows.get(target);if(child&&child.domain!=="INHERITED_P2")visit(target,depth+1);}colors.set(name,2);}
  for(const row of census.frames)visit(row.name,0);
  if(domain===DOMAINS[2]&&census.frames.some(row=>row.name==="__HIVE_P3_parse"||row.name==="__HIVE_P2_initialize"))stopR3("R3_TOOL_KERNEL_PARSER");
  // Cross-boundary edges are emitted for mandatory non-own source review. This
  // check certifies no direct NEW cycle, not parser/native/indirect independence.
}
/** @param {Tree} tree @param {string} name @returns {Declaration} */
function declarationR3(tree,name){const hits=tree.statements.filter(s=>TS.isFunctionDeclaration(s)&&s.name?.text===name);if(hits.length!==1||!TS.isFunctionDeclaration(hits[0])||!hits[0].body||!hits[0].name)stopR3("R3_TOOL_NAMED_BODY");return /** @type {Declaration} */(hits[0]);}
/** @param {Tree} tree @param {string} name @returns {Node} */
function variableR3(tree,name){let found=null;
  for(const s of tree.statements)if(TS.isVariableStatement(s))for(const d of s.declarationList.declarations)if(TS.isIdentifier(d.name)&&d.name.text===name){if(found!==null||!d.initializer)stopR3("R3_TOOL_VARIABLE");found=d.initializer;}
  if(found===null)stopR3("R3_TOOL_VARIABLE");return found;
}
/** @param {Tree} tree @param {string} functionName @param {string} variableName @returns {Node} */
function bodyVariableR3(tree,functionName,variableName){const fn=declarationR3(tree,functionName);let found=null;
  walkR3(fn.body,node=>{if(functionKindR3(node))return false;if(TS.isVariableDeclaration(node)&&TS.isIdentifier(node.name)&&node.name.text===variableName){if(found!==null||!node.initializer)stopR3("R3_TOOL_CONTROL_VARIABLE");found=node.initializer;}});
  if(found===null)stopR3("R3_TOOL_CONTROL_VARIABLE");return found;
}
/** @param {Node} node @returns {Node} */
function freezeArgumentR3(node){if(TS.isCallExpression(node)&&TS.isIdentifier(node.expression)&&node.expression.text==="__HIVE_P2_freeze"&&node.arguments.length===1)return node.arguments[0];return node;}
/** @param {Tree} tree @param {string} domain @returns {Record<string,unknown>} */
function controlSchemasR3(tree,domain){
  const exports=tree.statements.filter(s=>TS.isFunctionDeclaration(s)&&s.modifiers?.some(m=>m.kind===TS.SyntaxKind.ExportKeyword));
  if(domain===DOMAINS[2]){
    if(exports.length!==1||!TS.isFunctionDeclaration(exports[0])||exports[0].name?.text!=="runFixedBoundaryCasesP3"||exports[0].parameters.length!==0)stopR3("R3_TOOL_KERNEL_API");
    const registry=variableR3(tree,"__HIVE_P3_unitRegistry");if(!TS.isArrayLiteralExpression(registry)||registry.elements.length!==20)stopR3("R3_TOOL_KERNEL_REGISTRY");
    const cases=registry.elements.map(node=>{const fields=ownFieldsR3(node);if(!TS.isObjectLiteralExpression(node))stopR3("R3_TOOL_KERNEL_ROW");const id=node.properties.find(p=>TS.isPropertyAssignment(p)&&nameR3(p.name)==="caseId");if(!id||!TS.isPropertyAssignment(id))stopR3("R3_TOOL_KERNEL_ROW");return{caseId:literalR3(id.initializer),fields};});
    if(new Set(cases.map(row=>row.caseId)).size!==20)stopR3("R3_TOOL_KERNEL_DUPLICATE");
    return{soleExport:"runFixedBoundaryCasesP3",arity:0,cases,rootKeys:textR3(variableR3(tree,"__HIVE_P3_unitRootKeys"),tree),caseKeys:textR3(variableR3(tree,"__HIVE_P3_unitCaseKeys"),tree),actualVsModel:"DISTINCT",oneShot:true};
  }
  if(exports.length!==6)stopR3("R3_TOOL_NORMAL_API");for(let i=0;i<exports.length;i++){const fn=exports[i];if(!TS.isFunctionDeclaration(fn)||fn.name?.text!==P3_APIS[i]||fn.parameters.length!==[4,1,1,2,1,1][i])stopR3("R3_TOOL_NORMAL_API");}
  const owner=ownFieldsR3(bodyVariableR3(tree,"createSyntheticSummaryP3","state"));
  const handle=ownFieldsR3(freezeArgumentR3(bodyVariableR3(tree,"createSyntheticSummaryP3","handle")));
  const metadata=ownFieldsR3(bodyVariableR3(tree,"__HIVE_P3_metadata","metadata"));
  /** @type {string[]|null} */let frame=null;walkR3(declarationR3(tree,"__HIVE_P3_frame").body,node=>{if(TS.isReturnStatement(node)&&node.expression){if(frame!==null)stopR3("R3_TOOL_FRAME_RETURN");frame=ownFieldsR3(node.expression);}});
  if(owner.length!==71||numericR3(variableR3(tree,"__HIVE_P3_OWNER_FIELDS"))!==71||handle.length!==2||metadata.length!==27||!frame||frame.length!==16)stopR3("R3_TOOL_CONTROL_FIELDS");
  return{owner,handle,metadata,frame,ownerBytes:1200,handleBytes:96,metadataBytes:496,frameBytes:320,apis:P3_APIS,arities:[4,1,1,2,1,1]};
}
/** @param {Tree} producer @param {Tree} verifier @param {Tree} kernel @returns {Record<string,unknown>[]} */
function bindSharedBodiesR3(producer,verifier,kernel){const rows=[];
  for(const name of SHARED){const source=name.startsWith("__HIVE_P3_v")?verifier:producer;const a=declarationR3(source,name),b=declarationR3(kernel,name);
    if(!a.body||!b.body||a.parameters.map(p=>p.getText(source)).join(",")!==b.parameters.map(p=>p.getText(kernel)).join(",")||a.body.getText(source)!==b.body.getText(kernel))stopR3("R3_TOOL_SHARED_BODY_DRIFT");
    rows.push({name,arity:a.parameters.length,sourceStart:a.getStart(source),sourceEnd:a.end,kernelStart:b.getStart(kernel),kernelEnd:b.end,comparison:"EXACT_BODY_TEXT_AND_PARAMETERS"});}
  return rows;
}

// Bootstrap arithmetic: these are the accepted section10 SOURCE-SPECIFIC rules.
// No expression evaluator/object simulation or invocation of a target function.
/** @param {number} c @returns {number} */function arrayCostR3(c){return boundedR3(328+8*c,67108864);}
/** @param {number} f @returns {number} */function objectCostR3(f){return boundedR3(304+16*f,67108864);}
/** @param {number} a @param {number} b @returns {number} */function concatCostR3(a,b){return boundedR3(64+4*a+2*b,67108864);}
/** @param {string} raw @returns {number} */function regexCostR3(raw){if(raw[0]!=="/")stopR3("R3_TOOL_REGEX_LITERAL");const closing=raw.lastIndexOf("/");if(closing<1)stopR3("R3_TOOL_REGEX_LITERAL");return boundedR3(496+2*(closing-1+raw.length-closing-1),67108864);}
/** @param {string} value @returns {number} */function wordsCostR3(value){let count=0,sum=0;for(let at=0;at<value.length;at++)if(value.charCodeAt(at)===32){count++;sum=addR3(sum,at);}return boundedR3(2064+10*value.length+194*count+8*sum,67108864);}
/** @param {Node} node @returns {import('typescript').ObjectLiteralExpression} */
function guardedObjectR3(node){if(TS.isParenthesizedExpression(node))return guardedObjectR3(node.expression);
  if(TS.isBinaryExpression(node)&&node.operatorToken.kind===TS.SyntaxKind.CommaToken)return guardedObjectR3(node.right);
  const own=callR3(node,PREFIX+"ownObject");if(own.arguments.length!==4||!TS.isObjectLiteralExpression(own.arguments[0]))stopR3("R3_TOOL_GUARDED_OBJECT");const value=own.arguments[0];if(ownFieldsR3(value).length!==numericR3(own.arguments[2]))stopR3("R3_TOOL_OBJECT_CAPACITY");
  const pair=own.parent;if(!pair||!TS.isBinaryExpression(pair)||pair.operatorToken.kind!==TS.SyntaxKind.CommaToken||pair.right!==own)stopR3("R3_TOOL_OBJECT_RESERVE_PAIR");
  const reserve=callR3(pair.left,PREFIX+"reserveObject");arityR3(reserve,2);
  if(numericR3(reserve.arguments[0])!==value.properties.length||numericR3(reserve.arguments[1])!==numericR3(own.arguments[1]))stopR3("R3_TOOL_OBJECT_RESERVE_PAIR");return value;
}
/** @param {Node} node @returns {import('typescript').ArrayLiteralExpression} */
function guardedArrayR3(node){if(TS.isParenthesizedExpression(node))return guardedArrayR3(node.expression);
  if(TS.isBinaryExpression(node)&&node.operatorToken.kind===TS.SyntaxKind.CommaToken)return guardedArrayR3(node.right);
  const own=callR3(node,PREFIX+"ownArray");if(own.arguments.length!==3||!TS.isArrayLiteralExpression(own.arguments[0])||literalR3(own.arguments[2])!=="CONTROL_ARRAY")stopR3("R3_TOOL_GUARDED_ARRAY");
  const pair=own.parent;if(!pair||!TS.isBinaryExpression(pair)||pair.operatorToken.kind!==TS.SyntaxKind.CommaToken||pair.right!==own)stopR3("R3_TOOL_ARRAY_RESERVE_PAIR");
  const reserve=callR3(pair.left,PREFIX+"reserveArray");arityR3(reserve,2);
  if(numericR3(reserve.arguments[0])!==own.arguments[0].elements.length||numericR3(reserve.arguments[1])!==numericR3(own.arguments[1]))stopR3("R3_TOOL_ARRAY_RESERVE_PAIR");return own.arguments[0];
}
/** @param {Declaration} init @param {string} name @returns {Node} */
function initializerVariableR3(init,name){if(!init.body)stopR3("R3_TOOL_INIT_BODY");let found=null;
  for(const s of init.body.statements)if(TS.isVariableStatement(s))for(const d of s.declarationList.declarations)if(TS.isIdentifier(d.name)&&d.name.text===name){if(found!==null||!d.initializer)stopR3("R3_TOOL_INIT_VARIABLE");found=d.initializer;}
  if(found===null)stopR3("R3_TOOL_INIT_VARIABLE");return found;
}
/** @param {Node} node @param {string} target @returns {import('typescript').CallExpression} */
function findCallR3(node,target){let found=null;walkR3(node,item=>{if(functionKindR3(item))return false;if(TS.isCallExpression(item)&&TS.isIdentifier(item.expression)&&item.expression.text===target){if(found!==null)stopR3("R3_TOOL_UNIQUE_CALL");found=item;}});if(found===null)stopR3("R3_TOOL_UNIQUE_CALL");return found;}
/** @param {Declaration} init @param {string} name @returns {string} */
function initLiteralR3(init,name){return literalR3(initializerVariableR3(init,name));}
/** @param {Node} node @returns {string} */
function suffixLiteralR3(node){const call=callR3(node,PREFIX+"binary");if(call.arguments.length!==4||literalR3(call.arguments[0])!=="+")stopR3("R3_TOOL_LITERAL_RECIPE");return literalR3(call.arguments[2]);}
/** @param {Node} node @param {number} expected @returns {void} */
function arityR3(node,expected){if(!TS.isCallExpression(node)||node.arguments.length!==expected)stopR3("R3_TOOL_ARITY_SHAPE");}

/** Bind activated module-level registrations and explicit producer bootstrap,
 * separately from the immutable grammar initializer membership.
 * @param {Tree} tree @returns {Record<string,unknown>[]} */
function bootstrapRegistrationsR3(tree){
  const expected=["charCode","charAt","slice","indexOf","push","pop","call","create","keys","fromCharCode","substring","substr","test","exec","replace","split","hasOwn","objectTag","defineProperties","scalarString","staticHasOwn","isArray","floor","min","max"];
  const hooks=["__char","__slice","__concat","__codePoint","__tick","__refuse","__number",PREFIX+"initialize"];
  /** @type {Record<string,unknown>[]} */const rows=[];let natives=0,ordinary=0,explicit=0,amount=0;
  for(const statement of tree.statements){if(!TS.isExpressionStatement(statement))continue;
    walkR3(statement,node=>{if(functionKindR3(node))return false;if(!TS.isCallExpression(node)||!TS.isIdentifier(node.expression))return;
      if(node.expression.text===PREFIX+"registerNative"){
        arityR3(node,2);if(literalR3(node.arguments[1])!==expected[natives]||!TS.isIdentifier(node.arguments[0]))stopR3("R3_TOOL_NATIVE_REGISTRATION_ORDER");
        rows.push({start:node.getStart(tree),end:node.end,kind:"NATIVE_REGISTER",name:expected[natives],binding:node.arguments[0].text,formula:"176+224",bytes:400});natives++;
      }else if(node.expression.text===PREFIX+"registerFunction"){
        arityR3(node,5);if(!TS.isIdentifier(node.arguments[0])||node.arguments[0].text!==hooks[ordinary])stopR3("R3_TOOL_HOOK_REGISTRATION_ORDER");
        rows.push({start:node.getStart(tree),end:node.end,kind:"HOOK_REGISTER",name:hooks[ordinary],locals:numericR3(node.arguments[1]),parameters:numericR3(node.arguments[2]),nested:numericR3(node.arguments[3]),siteText:textR3(node.arguments[4],tree),formula:"176+224+512",bytes:912});ordinary++;
      }else if(node.expression.text==="__HIVE_P3_commonReserve"){
        arityR3(node,4);const bytes=numericR3(node.arguments[0]);if(![16,128].includes(bytes)||numericR3(node.arguments[1])!==0||numericR3(node.arguments[2])!==0||numericR3(node.arguments[3])!==4)stopR3("R3_TOOL_EXPLICIT_BOOTSTRAP");
        amount+=bytes;explicit++;rows.push({start:node.getStart(tree),end:node.end,kind:"EXPLICIT_PRODUCER_BOOTSTRAP",bytes,formula:"literal before native descriptor/sanitize"});
      }
    });
  }
  if(natives!==25||ordinary!==8||explicit!==8||amount!==464)stopR3("R3_TOOL_BOOTSTRAP_REGISTRATION_SET");return rows;
}

/** Complete ordered source membership, not an interpreter. A function body is
 * an explicit inert leaf; its activation is bound separately by the closed
 * TokenType/TokContext/binop/kw/BUILD recipes. Commas are never elided.
 * @param {Declaration} init @param {Tree} tree
 * @returns {{shapeChunks:BootstrapShape[][],shapeCount:number,chunkCapacity:number,roots:number[],calls:BootstrapCall[]}} */
function bootstrapMembershipR3(init,tree){
  /** @type {BootstrapShape[]} */const shapes=[];
  /** @type {number[]} */const roots=[];
  /** @type {BootstrapCall[]} */const calls=[];
  /** @type {{node:Node,parent:number|null,callParent:number|null,depth:number}[]} */const stack=[];
  const sites=new Map([["reserveFunction",0],["registerFunction",4],["reserveArray",1],["ownArray",1],["reserveObject",1],["ownObject",1],["maximumChildDepth",2],["checkArrayDepth",1],["binary",3],["get",2],["set",3],["construct",2],["invoke",3],["toolRegex",1],["tick",0]]);
  const arities=new Map([["reserveFunction",1],["registerFunction",5],["reserveArray",2],["ownArray",3],["reserveObject",2],["ownObject",4],["maximumChildDepth",3],["checkArrayDepth",2],["binary",4],["get",3],["set",4],["construct",3],["invoke",4],["toolRegex",2],["tick",1]]);
  const activated=new Set(["binop","kw","buildUnicodeData"]);
  for(let i=init.body.statements.length-1;i>=0;i--){if(stack.length>=1000000)stopR3("R3_TOOL_AST_CAP");stack.push({node:init.body.statements[i],parent:null,callParent:null,depth:0});}
  while(stack.length){const item=stack.pop();if(!item)stopR3("R3_TOOL_STACK");const node=item.node;
    if(shapes.length>=1000000||item.depth>512)stopR3("R3_TOOL_BOOTSTRAP_SHAPES");
    if(TS.isNewExpression(node)||TS.isSpreadElement(node)||TS.isSpreadAssignment(node)||TS.isWhileStatement(node)||TS.isDoStatement(node)||TS.isForInStatement(node)||TS.isForOfStatement(node)||TS.isTryStatement(node)||TS.isThrowStatement(node))stopR3("R3_TOOL_BOOTSTRAP_SYNTAX");
    const inertBody=functionKindR3(node);const index=shapes.length;
    const operand=TS.isIdentifier(node)||TS.isStringLiteral(node)||TS.isNumericLiteral(node)?node.text:TS.isBinaryExpression(node)?TS.tokenToString(node.operatorToken.kind)??null:TS.isPrefixUnaryExpression(node)||TS.isPostfixUnaryExpression(node)?TS.tokenToString(node.operator)??null:TS.isFunctionDeclaration(node)||TS.isFunctionExpression(node)?node.name?.text??"ANONYMOUS":null;
    shapes.push({start:node.getStart(tree),end:node.end,kind:TS.SyntaxKind[node.kind],operand,parent:item.parent,children:[],inertBody});
    if(item.parent===null)roots.push(index);else shapes[item.parent].children.push(index);
    let callParent=item.callParent;
    if(TS.isCallExpression(node)){
      if(!TS.isIdentifier(node.expression)||!node.expression.text.startsWith(PREFIX))stopR3("R3_TOOL_BOOTSTRAP_CALL");
      const family=node.expression.text.slice(PREFIX.length),siteAt=sites.get(family),arity=arities.get(family);
      if(siteAt===undefined||arity===undefined||!(node.arguments.length===arity||(family==="reserveArray"||family==="ownArray")&&node.arguments.length===arity+1)||calls.length>=20000)stopR3("R3_TOOL_BOOTSTRAP_CALL");
      const site=numericR3(node.arguments[siteAt]);
      if(family==="invoke"&&TS.isIdentifier(node.arguments[0])&&!activated.has(node.arguments[0].text)&&!node.arguments[0].text.startsWith("__HIVE_P2_temp0_"))stopR3("R3_TOOL_BOOTSTRAP_ACTIVATION");
      const callIndex=calls.length;
      calls.push({start:node.getStart(tree),end:node.end,call:node.expression.text,site,
        argumentSpans:node.arguments.map(arg=>({start:arg.getStart(tree),end:arg.end,kind:TS.SyntaxKind[arg.kind]})),parent:item.callParent,children:[]});
      if(item.callParent!==null)calls[item.callParent].children.push(callIndex);callParent=callIndex;
    }
    if(inertBody)continue;
    /** @type {Node[]} */const children=[];TS.forEachChild(node,child=>{if(children.length>=1000000)stopR3("R3_TOOL_AST_CAP");children.push(child);});
    if(stack.length+children.length>1000000)stopR3("R3_TOOL_AST_CAP");
    for(let i=children.length-1;i>=0;i--)stack.push({node:children[i],parent:index,callParent,depth:childDepthR3(node,item.depth)});
  }
  // Fixed chunks avoid coupling complete syntax membership to the20k source
  // CALL-row/serialized-array ceiling. Global parent/child indexes remain
  // unchanged; no syntax node is removed. Maximum489 chunks under1M visits.
  /** @type {BootstrapShape[][]} */const shapeChunks=[];
  for(let at=0;at<shapes.length;at+=2048){if(shapeChunks.length>=489)stopR3("R3_TOOL_BOOTSTRAP_SHAPES");shapeChunks.push(shapes.slice(at,at+2048));}
  return{shapeChunks,shapeCount:shapes.length,chunkCapacity:2048,roots,calls};
}
/** Recognize each of the77 ordered constructor/helper vectors and compute TT
 * from its actual a/x/z operands. Shared keyword writes carry state ONLY as a
 * fixed syntax recipe (first u/f use), not a generic value evaluator.
 * @param {import('typescript').ObjectLiteralExpression} table @param {Tree} tree
 * @returns {{bytes:number,ttBytes:number,rows:Record<string,unknown>[]}} */
function tokenTableRecipeR3(table,tree){
  /** @type {Record<string,unknown>[]} */const rows=[];
  let bytes=objectCostR3(77),ttBytes=0,direct=0,binops=0,keywords=0,sharedU=false,sharedF=false;
  for(const property of table.properties){if(!TS.isPropertyAssignment(property))stopR3("R3_TOOL_TOKEN_PROPERTY");
    const call=property.initializer;if(!TS.isCallExpression(call)||!TS.isIdentifier(call.expression))stopR3("R3_TOOL_TOKEN_CALL");
    const construct=call.expression.text===PREFIX+"construct";
    if(!construct&&call.expression.text!==PREFIX+"invoke")stopR3("R3_TOOL_TOKEN_CALL");arityR3(call,construct?3:4);
    const target=call.arguments[0];if(!TS.isIdentifier(target)||!(construct?target.text==="l":["binop","kw"].includes(target.text)))stopR3("R3_TOOL_TOKEN_TARGET");
    const vector=guardedArrayR3(call.arguments[construct?1:2]),a=vector.elements.length;
    if(a<1||a>2)stopR3("R3_TOOL_TOKEN_VECTOR");const label=literalR3(vector.elements[0]);
    let x=0,z=0,extra=arrayCostR3(a),options="DEFAULT",sharedFresh=false;
    /** @type {string[]} */let optionKeys=[];
    if(target.text==="binop"){
      if(a!==2)stopR3("R3_TOOL_BINOP_VECTOR");numericR3(vector.elements[1]);x=2;extra+=128+objectCostR3(2)+arrayCostR3(2);options="BINOP_FIXED";binops++;
    }else{
      if(a===2){const opt=vector.elements[1];
        if(TS.isIdentifier(opt)){if(!["u","f"].includes(opt.text))stopR3("R3_TOOL_TOKEN_SHARED_OPTIONS");x=1;options=opt.text;optionKeys=[opt.text==="u"?"beforeExpr":"startsExpr"];
          if(target.text==="kw"){sharedFresh=opt.text==="u"?!sharedU:!sharedF;if(opt.text==="u")sharedU=true;else sharedF=true;}}
        else{const object=guardedObjectR3(opt);optionKeys=ownFieldsR3(object);options="INLINE";x=optionKeys.length;extra+=objectCostR3(x);}
      }
      if(target.text==="kw"){
        keywords++;if(a===1)extra+=objectCostR3(0);extra+=a===1?208:224;
        extra+=options==="u"||options==="f"?(sharedFresh?486:416):486;
        extra+=arrayCostR3(2)+472+2*label.length;x++;
      }else{direct++;z=a===1?1:0;}
    }
    const tt=6778+16*(target.text==="l"?a:2)+16*x+304*z;
    ttBytes+=tt;bytes=addR3(bytes,extra+tt);
    rows.push({start:property.getStart(tree),end:property.end,key:nameR3(property.name),target:target.text,site:numericR3(call.arguments[construct?2:3]),
      vectorStart:vector.getStart(tree),vectorEnd:vector.end,label,labelUnits:label.length,a:target.text==="l"?a:2,x,z,options,optionKeys,sharedFresh,
      formula:"TT=6778+16*a+16*x+304*z;external=caller+explicit-options+helper+keyword-writes+dictionary",ttBytes:tt,externalBytes:extra,bytes:tt+extra});
  }
  if(direct!==30||binops!==12||keywords!==35||rows.length!==77||ttBytes!==528706)stopR3("R3_TOOL_TOKEN_RECIPE_DRIFT");
  return{bytes,ttBytes,rows};
}

/** @param {Tree} tree @param {string} domain @returns {{bytes:number,rows:CostRow[],occurrences:BootstrapCall[],membership:ReturnType<typeof bootstrapMembershipR3>|null,tokenRecipe:ReturnType<typeof tokenTableRecipeR3>|null,registrations:Record<string,unknown>[]}} */
function bootstrapScheduleR3(tree,domain){
  /** @type {CostRow[]} */const rows=[];let total=0;
  /** @type {BootstrapCall[]} */let occurrences=[];
  /** @param {Node} node @param {string} kind @param {number} bytes @param {string} [formula] @param {Record<string,unknown>} [operands] */
  function debit(node,kind,bytes,formula=kind,operands={}){total=addR3(total,bytes);rows.push({start:node.getStart(tree),end:node.end,kind,bytes,formula,operands});}
  if(domain===DOMAINS[2]){let explicit=0;
    for(const statement of tree.statements)if(TS.isExpressionStatement(statement)){walkR3(statement,node=>{if(TS.isCallExpression(node)&&TS.isIdentifier(node.expression)&&node.expression.text==="__HIVE_P3_commonReserve"){arityR3(node,4);const amount=numericR3(node.arguments[0]);if(![16,128].includes(amount)||numericR3(node.arguments[1])!==0||numericR3(node.arguments[2])!==0||numericR3(node.arguments[3])!==4)stopR3("R3_TOOL_KERNEL_BOOTSTRAP");debit(node,"KERNEL_EXPLICIT_BOOTSTRAP",amount);explicit++;}});}
    if(explicit!==9||total!==480)stopR3("R3_TOOL_KERNEL_BOOTSTRAP");return{bytes:total,rows,occurrences,membership:null,tokenRecipe:null,registrations:[]};}
  const init=declarationR3(tree,PREFIX+"initialize");if(!init.body)stopR3("R3_TOOL_INIT_BODY");
  const initializationShape=frameShapeR3(init,tree,"GUARDED_BOOTSTRAP_FRAME");
  const initializerRegistration=tree.statements.find(s=>TS.isExpressionStatement(s)&&TS.isCallExpression(s.expression)&&TS.isIdentifier(s.expression.expression)&&s.expression.expression.text===PREFIX+"registerFunction"&&TS.isIdentifier(s.expression.arguments[0])&&s.expression.arguments[0].text===PREFIX+"initialize");
  if(!initializerRegistration||!TS.isExpressionStatement(initializerRegistration))stopR3("R3_TOOL_INITIALIZER_REGISTRATION");
  const registration=callR3(initializerRegistration.expression,PREFIX+"registerFunction");
  if(registration.arguments.length!==5||numericR3(registration.arguments[1])!==initializationShape.locals||numericR3(registration.arguments[2])!==initializationShape.parameters||numericR3(registration.arguments[3])!==50||initializationShape.locals!==1632||initializationShape.parameters!==0)stopR3("R3_TOOL_INITIALIZER_FRAME_DRIFT");
  const registrations=bootstrapRegistrationsR3(tree),membership=bootstrapMembershipR3(init,tree);occurrences=membership.calls;
  for(const [name,capacity] of [["t",318],["i",598]]){
    if(typeof name!=="string"||typeof capacity!=="number")stopR3("R3_TOOL_NUMERIC_ARRAY_RECIPE");
    const value=initializerVariableR3(init,name),reserve=findCallR3(value,PREFIX+"reserveArray"),own=findCallR3(value,PREFIX+"ownArray");
    if(reserve.arguments.length!==3||numericR3(reserve.arguments[0])!==capacity||numericR3(reserve.arguments[2])!==capacity||own.arguments.length!==4||!TS.isArrayLiteralExpression(own.arguments[0])||own.arguments[0].elements.length!==capacity||numericR3(reserve.arguments[1])!==numericR3(own.arguments[1])||literalR3(own.arguments[2])!=="ARRAY")stopR3("R3_TOOL_NUMERIC_ARRAY_RECIPE");
  }
  if(ownFieldsR3(guardedObjectR3(initializerVariableR3(init,"a"))).length!==5)stopR3("R3_TOOL_SCALAR_TABLE_RECIPE");
  debit(init,"CLOSED_PREFIX_THROUGH_H",110314,
    "25*400+464+8*912+A(0)+26176+50*192+50*912+A(318)+A(598)+O(5)+112+776+828+240+526",
    {nativeRegistrations:25,nativeRegistrationBytes:400,explicitBootstrapBytes:464,hookRegistrations:8,ordinaryRegistrationBytes:912,
      initializerLocals:initializationShape.locals,initializerParameters:initializationShape.parameters,hoisted:50,initializerFrame:26176,
      numericArrayCapacities:[318,598],scalarObjectFields:5,regexpPatternUnits:15,regexpFlagUnits:0});
  const R=initLiteralR3(init,"r").length,U=initLiteralR3(init,"s").length;
  debit(initializerVariableR3(init,"p"),"UNICODE_START_DESCRIPTOR",842+6*R,"842+6*R",{R});
  debit(initializerVariableR3(init,"c"),"UNICODE_CONTINUE_DESCRIPTOR",910+10*R+6*U,"910+10*R+6*U",{R,U});
  // All fresh function expressions in root initializers/method installs. The
  // two intrinsic fallbacks are NOT activated. Their registration is excluded.
  let expressions=0,hoisted=0;const expressionSites=new Set();
  for(const statement of init.body.statements){if(TS.isFunctionDeclaration(statement))continue;
    walkR3(statement,node=>{if(TS.isFunctionExpression(node)){
        const parent=node.parent;if(!parent||!TS.isCallExpression(parent)||!TS.isIdentifier(parent.expression)||parent.expression.text!==PREFIX+"registerFunction"||parent.arguments[0]!==node||parent.arguments.length!==5)stopR3("R3_TOOL_FUNCTION_REGISTER_PAIR");
        const site=numericR3(parent.arguments[4]);if(expressionSites.has(site))stopR3("R3_TOOL_FUNCTION_SITE_DUPLICATE");expressionSites.add(site);
        const shape=frameShapeR3(node,tree,"BOOTSTRAP_FUNCTION_BODY_INERT");
        if(numericR3(parent.arguments[1])!==shape.locals||numericR3(parent.arguments[2])!==shape.parameters||numericR3(parent.arguments[3])!==shape.nested)stopR3("R3_TOOL_FUNCTION_REGISTER_METADATA");
        const pair=parent.parent;if(!pair||!TS.isBinaryExpression(pair)||pair.operatorToken.kind!==TS.SyntaxKind.CommaToken||pair.right!==parent)stopR3("R3_TOOL_FUNCTION_RESERVE_PAIR");
        const guard=callR3(pair.left,PREFIX+"reserveFunction");arityR3(guard,1);if(numericR3(guard.arguments[0])!==site)stopR3("R3_TOOL_FUNCTION_RESERVE_SITE");
        if([382,386].includes(site))return false;
        debit(node,"GUARDED_FUNCTION_CREATION_AND_REGISTRATION",1104,"192+176+224+512",{site,locals:shape.locals,parameters:shape.parameters,guardedNestedHoists:shape.nested,inertNestedExpressionForms:shape.nestedExpressions,
          guardStart:guard.getStart(tree),guardEnd:guard.end,registerStart:parent.getStart(tree),registerEnd:parent.end,bodyDisposition:"INERT_EXCEPT_CLOSED_ACTIVATIONS"});expressions++;return false;}
      if(TS.isCallExpression(node)&&TS.isIdentifier(node.expression)&&node.expression.text===PREFIX+"registerFunction"&&TS.isIdentifier(node.arguments[0]))hoisted++;});}
  if(hoisted!==50||expressions===0||expressionSites.size!==expressions+2)stopR3("R3_TOOL_BOOTSTRAP_FUNCTION_SET");
  // Source property vector is immutable/pinned; counters below verify every
  // declared table value target/arity, rather than evaluating TokenType.
  const m=guardedObjectR3(initializerVariableR3(init,"m"));if(m.properties.length!==77)stopR3("R3_TOOL_TOKEN_TABLE");
  const tokenRecipe=tokenTableRecipeR3(m,tree);
  if(ownFieldsR3(guardedObjectR3(initializerVariableR3(init,"u"))).join(",")!=="beforeExpr"||ownFieldsR3(guardedObjectR3(initializerVariableR3(init,"f"))).join(",")!=="startsExpr"||ownFieldsR3(guardedObjectR3(initializerVariableR3(init,"d"))).length!==0)stopR3("R3_TOOL_SHARED_OPTIONS_RECIPE");
  debit(initializerVariableR3(init,"u"),"SHARED_OPTIONS_AND_KEYWORD_MAP",2*objectCostR3(1)+objectCostR3(0),"2*O(1)+O(0)",{sharedFields:["beforeExpr","startsExpr"],keywordFields:0});
  debit(m,"COMPLETE_TOKEN_TABLE",tokenRecipe.bytes,"O(77)+sum77(TT(a,x,z)+external)",{rows:tokenRecipe.rows.length,ttBytes:tokenRecipe.ttBytes});
  for(const name of ["g","x","y","E","X"]){const call=callR3(initializerVariableR3(init,name),PREFIX+"toolRegex");debit(call,"FIXED_REGEX_DESCRIPTOR:"+name,regexCostR3(literalR3(call.arguments[0])));}
  debit(initializerVariableR3(init,"v"),"LINE_REGEX_COPY_DESCRIPTOR",712);
  debit(initializerVariableR3(init,"w"),"INTRINSIC_NULL_OBJECT_CREATE",720);
  const defaults=guardedObjectR3(initializerVariableR3(init,"P")),getterTable=guardedObjectR3(initializerVariableR3(init,"Q"));
  if(defaults.properties.length!==19||getterTable.properties.length!==9)stopR3("R3_TOOL_DEFAULT_GETTER_TABLE");
  for(const property of getterTable.properties)if(!TS.isPropertyAssignment(property)||ownFieldsR3(guardedObjectR3(property.initializer)).join(",")!=="get")stopR3("R3_TOOL_GETTER_DESCRIPTOR_TABLE");
  debit(defaults,"DEFAULT_OPTIONS",objectCostR3(19),"O(19)",{fields:ownFieldsR3(defaults)});
  debit(getterTable,"GETTER_DECLARATION_OBJECTS",objectCostR3(9)+9*objectCostR3(1),"O(9)+9*O(1)",{fields:ownFieldsR3(getterTable),descriptorField:"get"});
  // Function creations were charged above; install writes and outer descriptor
  // gets only. Object/TokenType bodies are never traversed by this installer sum.
  const aliases=new Set(["Y","$","ae","he","pe","le","ue","me","Me","We"]);
  let installWrites=0,contextWrites=0,getterWrites=0;
  for(const statement of init.body.statements){if(TS.isFunctionDeclaration(statement))continue;
    walkR3(statement,node=>{if(functionKindR3(node))return false;
      if(TS.isCallExpression(node)&&TS.isIdentifier(node.expression)&&node.expression.text===PREFIX+"get"){
        const key=node.arguments[1];if(!key||!TS.isStringLiteral(key))return;
        if(key.text==="prototype"&&TS.isIdentifier(node.arguments[0])&&["K","I","Fe","Ue"].includes(node.arguments[0].text))debit(node,"BOOTSTRAP_PROTOTYPE_READ",144);
        else if(TS.isIdentifier(node.arguments[0])&&["Q","m","le"].includes(node.arguments[0].text))debit(node,"BOOTSTRAP_INSTALL_DATA_READ",144);}
      if(!TS.isCallExpression(node)||!TS.isIdentifier(node.expression)||node.expression.text!==PREFIX+"set")return;
      // Root setters use a preceding temp assignment key or a direct literal.
      const key=resolveInstallerKeyR3(node,statement,tree);
      if(key===null)stopR3("R3_TOOL_INSTALLER_KEY");
      if(key==="updateContext"){debit(node,"EXISTING_TOKEN_CONTEXT_WRITE",416,"16+128+128+16+128",{key,site:numericR3(node.arguments[3])});contextWrites++;}
      else{debit(node,"FRESH_INSTALLER_WRITE",472+2*key.length,"472+2*keyUnits",{key,keyUnits:key.length,site:numericR3(node.arguments[3])});installWrites++;if(key==="get")getterWrites++;}});
  }
  if(contextWrites!==12||getterWrites!==9||installWrites===0||aliases.size!==10)stopR3("R3_TOOL_INSTALLER_SET");
  // defineProperties has its own caller vector, read, names backing and native
  // descriptor expansion. Its K.prototype read already occurs in the row above.
  const define=init.body.statements.find(s=>s.getText(tree).includes('"defineProperties", 725'));
  if(!define)stopR3("R3_TOOL_DEFINE_PROPERTIES");debit(define,"NATIVE_DEFINE_PROPERTIES_EXCLUDING_PROTO_READ",9872-144);
  debit(initializerVariableR3(init,"J"),"LOOP_SWITCH_MARKERS",2*objectCostR3(1));
  debit(initializerVariableR3(init,"te"),"UNUSED_IMPORT_EMPTY_ARRAY",328);
  debit(initializerVariableR3(init,"ce"),"UNUSED_NEW_EMPTY_ARRAY",328);
  // oe's callback function was included in the expression sum above.
  debit(initializerVariableR3(init,"oe"),"TOK_CONTEXT_TABLE_EXCLUDING_CALLBACK_FUNCTION",36820-1104);
  const ve=initLiteralR3(init,"ve"),Ee=initLiteralR3(init,"Ee"),Ie=initLiteralR3(init,"Ie"),ge=initLiteralR3(init,"ge"),Ce=initLiteralR3(init,"Ce");
  const xe=ve+suffixLiteralR3(initializerVariableR3(init,"xe")),be=xe+suffixLiteralR3(initializerVariableR3(init,"be"));
  const Ae=Ie+suffixLiteralR3(initializerVariableR3(init,"Ae")),Pe=Ae+suffixLiteralR3(initializerVariableR3(init,"Pe"));
  const Ne=Pe+suffixLiteralR3(initializerVariableR3(init,"Ne")),Te=Ne+suffixLiteralR3(initializerVariableR3(init,"Te")),Ve=Te+" "+ge;
  const concatRows=[[ve,xe.slice(ve.length)],[xe,be.slice(xe.length)],[Ie,Ae.slice(Ie.length)],[Ae,Pe.slice(Ae.length)],[Pe,Ne.slice(Pe.length)],[Ne,Te.slice(Ne.length)],[Te," "],[Te+" ",ge]];
  const concatAnchors=["xe","be","Ae","Pe","Ne","Te","Ve","Ve"];
  for(let i=0;i<concatRows.length;i++){const pair=concatRows[i];debit(initializerVariableR3(init,concatAnchors[i]),"FIXED_UNICODE_LITERAL_CONCAT",concatCostR3(pair[0].length,pair[1].length),"64+4*leftUnits+2*rightUnits",{recipeIndex:i,leftUnits:pair[0].length,rightUnits:pair[1].length});}
  debit(initializerVariableR3(init,"Se"),"UNICODE_TABLE_STORAGE",3*objectCostR3(6)+objectCostR3(0));
  const binary=[ve,xe,xe,be,be,be],strings=["","","","","",Ce],scripts=[Ie,Ae,Pe,Ne,Te,Ve];
  const loops=init.body.statements.filter(TS.isForStatement);if(loops.length!==1||!loops[0].getText(tree).includes("buildUnicodeData"))stopR3("R3_TOOL_UNICODE_LOOP");
  let loopCost=376+1008;/** @type {Record<string,unknown>[]} */const buildRows=[];
  for(let i=0;i<6;i++){const b=binary[i],digitUnits=i===0?1:2;
    const wordTexts=[b+" "+Ee,strings[i],Ee,scripts[i]];
    const wordRows=wordTexts.map(value=>{let spaces=0,positionSum=0;for(let q=0;q<value.length;q++)if(cApply(cChar,value,[q])===32){spaces++;positionSum=addR3(positionSum,q);}return{units:value.length,spaces,positionSum,formula:"2064+10*n+194*m+8*sum(q)",bytes:wordsCostR3(value)};});
    const amount=240+336+7336+2*digitUnits+concatCostR3(b.length,1)+concatCostR3(b.length+1,Ee.length)+wordRows.reduce((sum,row)=>addR3(sum,row.bytes),0);
    loopCost=addR3(loopCost,amount);buildRows.push({ordinal:i,version:i+9,digitUnits,binaryUnits:b.length,stringUnits:strings[i].length,scriptUnits:scripts[i].length,
      wordRows,formula:"240+A(1)+7336+2*digitUnits+C(B,1)+C(B+1,Ee)+sum4W",bytes:amount});}
  debit(loops[0],"ALL_SIX_UNICODE_BUILDS_24_WORD_REGEX_CALLS",loopCost,"A(6)+7*144+sum6BUILD",{buildRows,loopBounds:[9,15],loopIterations:6});
  debit(initializerVariableR3(init,"ze"),"PRIVATE_TEMPLATE_SENTINEL",304);
  // These are grouped logical rows, not a target-evaluation trace. Their closed
  // rules retain before/after-child phases in the reviewed source schema. Every
  // debit is nonnegative: checking final S+W+B also bounds every finer prefix.
  const first=rows.shift();rows.sort((a,b)=>a.end-b.end||a.start-b.start);if(first)rows.unshift(first);
  // Every grouped rule can be navigated back to all ordered source call rows
  // beneath its span; every root syntax node remains in membership, including
  // zero-debit scalars, dormant fallbacks and inert declarations. Overlap here
  // is a NAVIGATION edge, not a second cost debit or an allocator proof.
  for(const row of rows){if(!row.operands)row.operands={};row.operands.sourceCallStarts=occurrences.filter(call=>call.start>=row.start&&call.end<=row.end).map(call=>call.start);}
  return{bytes:total,rows,occurrences,membership,tokenRecipe,registrations};
}
/** @param {import('typescript').CallExpression} call @param {Node} statement @param {Tree} tree @returns {string|null} */
function resolveInstallerKeyR3(call,statement,tree){const key=call.arguments[1];if(TS.isStringLiteral(key))return key.text;if(!TS.isIdentifier(key))return null;let value=null;
  walkR3(statement,node=>{if(functionKindR3(node))return false;if(TS.isBinaryExpression(node)&&node.operatorToken.kind===TS.SyntaxKind.EqualsToken&&TS.isIdentifier(node.left)&&node.left.text===key.text){if(value!==null||!TS.isStringLiteral(node.right))stopR3("R3_TOOL_INSTALLER_KEY_ALIAS");value=node.right.text;}});
  if(value!==null&&statement.getStart(tree)>call.getStart(tree))stopR3("R3_TOOL_INSTALLER_ORDER");return value;
}

/** @param {unknown} value @returns {unknown} */
function sanitizeJsonR3(value){
  /** @type {{value:unknown,depth:number}[]} */const stack=[{value,depth:0}];let count=0;
  while(stack.length){const item=stack.pop();if(!item)stopR3("R3_TOOL_JSON_STACK");if(++count>1000000||item.depth>128)stopR3("R3_TOOL_JSON_CAP");
    if(item.value===null||typeof item.value!=="object"){if(typeof item.value==="string"&&cByteLength(item.value)>16777216)stopR3("R3_TOOL_JSON_STRING_CAP");if(typeof item.value!=="string"&&typeof item.value!=="boolean"&&typeof item.value!=="number"&&item.value!==null)stopR3("R3_TOOL_JSON_VALUE");continue;}
    cProto(item.value,null);const keys=cKeys(item.value);if(keys.length>20000)stopR3("R3_TOOL_JSON_KEYS");
    if(stack.length+keys.length>1000000)stopR3("R3_TOOL_JSON_CAP");
    for(const key of keys){const descriptor=cDescriptor(item.value,key);if(!descriptor)stopR3("R3_TOOL_JSON_DESCRIPTOR");cProto(descriptor,null);if(descriptor.get||descriptor.set)stopR3("R3_TOOL_JSON_ACCESSOR");stack.push({value:descriptor.value,depth:item.depth+1});}
  }return value;
}
/** @param {string} text @returns {Record<string,unknown>} */
function parseFixedJsonR3(text){const value=sanitizeJsonR3(cParse(text));if(!value||typeof value!=="object"||cArray(value))stopR3("R3_TOOL_JSON_ROOT");return /** @type {Record<string,unknown>} */(value);}
/** @typedef {{text:string,bytes:number,limit:number}} Encoder */
/** @param {Encoder} state @param {string} chunk @returns {void} */
function emitJsonR3(state,chunk){const bytes=cByteLength(chunk);if(bytes>state.limit-state.bytes)stopR3("R3_TOOL_OUTPUT_CAP");state.bytes+=bytes;state.text+=chunk;}
/** Bounded scalar escape writer, no JSON.stringify/object hooks/species.
 * @param {Encoder} state @param {string} text @returns {void} */
function quoteJsonR3(state,text){
  if(text.length>16777216)stopR3("R3_TOOL_JSON_STRING_CAP");emitJsonR3(state,'"');
  for(let i=0;i<text.length;i++){const code=cApply(cChar,text,[i]);
    if(code===34)emitJsonR3(state,'\\"');else if(code===92)emitJsonR3(state,'\\\\');
    else if(code===8)emitJsonR3(state,"\\b");else if(code===9)emitJsonR3(state,"\\t");else if(code===10)emitJsonR3(state,"\\n");else if(code===12)emitJsonR3(state,"\\f");else if(code===13)emitJsonR3(state,"\\r");
    else if(code<32||code>=55296&&code<=57343&&!(code<=56319&&i+1<text.length&&cApply(cChar,text,[i+1])>=56320&&cApply(cChar,text,[i+1])<=57343)){
      const hex=cApply(cNumberString,code,[16]);emitJsonR3(state,"\\u"+"0000".slice(hex.length)+hex);
    }else if(code>=55296&&code<=56319){emitJsonR3(state,cApply(cSlice,text,[i,i+2]));i++;}
    else emitJsonR3(state,cApply(cSlice,text,[i,i+1]));
  }emitJsonR3(state,'"');
}
/** @param {object} value @param {string} key @returns {unknown} */
function ownJsonDataR3(value,key){const descriptor=cDescriptor(value,key);if(!descriptor)stopR3("R3_TOOL_JSON_DESCRIPTOR");cProto(descriptor,null);if(descriptor.get||descriptor.set||!cHasOwn(descriptor,"value"))stopR3("R3_TOOL_JSON_ACCESSOR");return descriptor.value;}
/** Streaming bounded fixed-graph encoder: originals (including frozen arrays)
 * are never mutated. Only fresh reflection descriptors are null-sanitized.
 * Native JSON.parse remains input-only and every output growth is prechecked.
 * @param {unknown} value @param {number} maximum @returns {string} */
function serializeR3(value,maximum){
  /** @type {Encoder} */const state={text:"",bytes:0,limit:boundedR3(maximum,16777216)};
  /** @type {{kind:string,value:unknown,depth:number}[]} */const stack=[{kind:"VALUE",value,depth:0}];
  const active=new Set();let visits=0;
  while(stack.length){const item=stack.pop();if(!item)stopR3("R3_TOOL_JSON_STACK");if(item.depth>128||++visits>1000000)stopR3("R3_TOOL_JSON_CAP");
    if(item.kind==="RAW"){if(typeof item.value!=="string")stopR3("R3_TOOL_JSON_TOKEN");emitJsonR3(state,item.value);continue;}
    if(item.kind==="KEY"){if(typeof item.value!=="string")stopR3("R3_TOOL_JSON_KEY");quoteJsonR3(state,item.value);continue;}
    if(item.kind==="END"){active.delete(item.value);emitJsonR3(state,cArray(item.value)?"]":"}");continue;}
    if(item.value===null){emitJsonR3(state,"null");continue;}
    if(typeof item.value==="string"){quoteJsonR3(state,item.value);continue;}
    if(typeof item.value==="boolean"){emitJsonR3(state,item.value?"true":"false");continue;}
    if(typeof item.value==="number"){if(!cFinite(item.value))stopR3("R3_TOOL_JSON_NUMBER");emitJsonR3(state,cApply(cNumberString,item.value,[]));continue;}
    if(typeof item.value!=="object")stopR3("R3_TOOL_JSON_VALUE");if(active.has(item.value))stopR3("R3_TOOL_JSON_CYCLE");active.add(item.value);
    const array=cArray(item.value);const keys=array?null:cKeys(item.value);
    const length=array?ownJsonDataR3(item.value,"length"):keys?.length;
    if(typeof length!=="number"||!cSafe(length)||length<0||length>(array?20000:128)||stack.length+length*4+1>1000000)stopR3("R3_TOOL_JSON_KEYS");
    emitJsonR3(state,array?"[":"{");stack.push({kind:"END",value:item.value,depth:item.depth});
    for(let i=length-1;i>=0;i--){const key=array?cApply(cNumberString,i,[]):keys?.[i];if(typeof key!=="string")stopR3("R3_TOOL_JSON_KEY");
      stack.push({kind:"VALUE",value:ownJsonDataR3(item.value,key),depth:item.depth+1});
      if(!array){stack.push({kind:"RAW",value:":",depth:item.depth});stack.push({kind:"KEY",value:key,depth:item.depth});}
      if(i)stack.push({kind:"RAW",value:",",depth:item.depth});}
  }return state.text;
}
/** @param {string} source @param {number} runtimeEnd @param {string} domain @returns {{census:Census,bootstrap:ReturnType<typeof bootstrapScheduleR3>,finalToolBytes:number,tree:Tree,controls:Record<string,unknown>}} */
function censusDomainR3(source,runtimeEnd,domain){
  const tree=parseDerivationTextR3(source,"fixed-"+domain+".mjs");const census=collectSourceRowsR3(tree,runtimeEnd,domain);
  collectDirectEdgesR3(tree,census,runtimeEnd);validateGraphR3(census,domain);
  const controls=controlSchemasR3(tree,domain),bootstrap=bootstrapScheduleR3(tree,domain);
  const finalToolBytes=addR3(addR3(census.staticBytes,census.workspaceBytes),bootstrap.bytes);
  if(finalToolBytes>(domain===DOMAINS[2]?66797576:33262238))stopR3("R3_TOOL_FIXED_FIT_THRESHOLD");
  return{census,bootstrap,finalToolBytes,tree,controls};
}
/** @param {Census} census @returns {string} */
function makePreludeR3(census){return"const __HIVE_P2_RUNTIME_STATIC_BYTES="+census.staticBytes+";\nconst __HIVE_P2_RUNTIME_WORKSPACE_BYTES="+census.workspaceBytes+";\n";}
/** @param {string} source @param {string} domain @returns {string} */
function compileFlagEditR3(source,domain){const literal=domain===DOMAINS[2]?"const __HIVE_P3_KERNEL_RELEASED = false;":"const __HIVE_P3_COVERAGE_RELEASED = false;";const at=uniqueSpanR3(source,literal);const replacement=literal.replace("false","true ");if(replacement.length!==literal.length)stopR3("R3_TOOL_COMPILE_SPAN");return source.slice(0,at)+replacement+source.slice(at+literal.length);}
/** @param {string} source @param {ReturnType<typeof censusDomainR3>} info @param {string} domain @param {Record<string,unknown>} lineage @returns {Artifacts} */
function makeDomainArtifactsR3(source,info,domain,lineage){
  const candidate=compileFlagEditR3(source,domain);if(cByteLength(candidate)>2228288)stopR3("R3_TOOL_CANDIDATE_CAP");
  const inventory={version:3,purpose:"TIP081_P3_R3_INERT_DERIVATION_INVENTORY",domain,authority:"NOT_ISSUED",checks:"UNRUN",realParserDisabled:true,
    candidateHash:hashToolBytesR3(candidate),candidateBytes:cByteLength(candidate),staticBytes:info.census.staticBytes,workspaceBytes:info.census.workspaceBytes,
    guardedBootstrapBytes:info.bootstrap.bytes,toolBytes:info.finalToolBytes,startup:info.census.startup,frames:info.census.frames,edges:info.census.edges,
    sourceRows:info.census.sourceRows,bootstrap:info.bootstrap,controlSchemas:info.controls,lineage,
    newHelperCycle:"NONE_DIRECT",indirectReentryReview:"MANDATORY_NON_OWN",emittedSourceReview:"REQUIRED",commonGrammarAllocationRisk:"OPEN",fullRuntimeClosure:"NOT_ACCEPTED",execution:false,targetEvaluation:false};
  const profile={version:3,purpose:"TIP081_P3_R3_SYNTHETIC_PROFILE",domain,authority:"NOT_ISSUED",checks:"UNRUN",realParserDisabled:true,
    profile:"P3_ECMA15_FIXED19_COMMON_GRAMMAR",toolBytes:info.finalToolBytes,byteLimit:67108864,summaryByteLimit:16384,entries:20000,depth:128,nodes:200000,
    sites:512,ttlMaximum:120000,optionsByProfile:domain===DOMAINS[2]?null:lineage.optionsByProfile,
    scope:domain===DOMAINS[2]?"UNIT_ONLY":"SYNTHETIC_ONLY",parserImported:false,targetExecution:false,execution:false,materialization:false,
    fullP3Accepted:false,fullRuntimeClosure:"NOT_ACCEPTED",graphStatus:"OPEN",predecessorOpen:62,allocatorCoverage:"COMMON_MODE",commonGrammarAllocationRisk:"OPEN",
    compileSourceReviewedOnly:true,candidateHash:inventory.candidateHash};
  return{candidate,inventory:serializeR3(inventory,16777216),profile:serializeR3(profile,65536)};
}

/** Fixed serial inert composition. Arity0; no output writes/import of target.
 * @returns {Promise<Result>} */
export async function derivePrivateSummaryP3R3(){
  if(arguments.length!==0)stopR3("R3_TOOL_ARITY");
  let candidateBytes=null,inventoryBytes=null,profileBytes=null,producerBytes=null,verifierBytes=null,kernelBytes=null,tsLib=null,tsPackage=null;
  let candidate="",producer="",verifier="",kernel="",normal="",alias="",suffix="",prefix="";
  let oldMap=null,oldProfile=null,producerTree=null,verifierTree=null,kernelTree=null,normalInfo=null,aliasInfo=null,kernelInfo=null;
  try{
    // All source bytes are captured by the parent BEFORE this module import.
    // Recheck fixed SAME-FD bytes here; no .env/root/project/config resolution.
    tsLib=readFixedSourceR3("tsLib");tsPackage=readFixedSourceR3("tsPackage");
    const packageData=parseFixedJsonR3(decodeFixedUtf8R3(tsPackage));if(packageData.version!=="5.9.3")stopR3("R3_TOOL_TYPESCRIPT_VERSION");
    const compiler=/** @type {{default:typeof import('typescript')}} */(await import(/** @type {string} */("file:///Users/os/hiveos/node_modules/typescript/lib/typescript.js")));TS=compiler.default;
    if(TS.version!=="5.9.3")stopR3("R3_TOOL_TYPESCRIPT_VERSION");tsLib=null;tsPackage=null;
    candidateBytes=readFixedSourceR3("candidate");inventoryBytes=readFixedSourceR3("inventory");profileBytes=readFixedSourceR3("profile");
    producerBytes=readFixedSourceR3("producer");verifierBytes=readFixedSourceR3("verifier");kernelBytes=readFixedSourceR3("kernel");
    candidate=decodeFixedUtf8R3(candidateBytes);producer=decodeFixedUtf8R3(producerBytes);verifier=unwrapVerifierR3(decodeFixedUtf8R3(verifierBytes));kernel=decodeFixedUtf8R3(kernelBytes);
    oldMap=parseFixedJsonR3(decodeFixedUtf8R3(inventoryBytes));oldProfile=parseFixedJsonR3(decodeFixedUtf8R3(profileBytes));
    if(!Array.isArray(oldMap.rows)||oldMap.rows.length!==7274||!oldProfile.optionsByProfile)stopR3("R3_TOOL_PREDECESSOR_MAP");
    if(!candidate.startsWith(PRELUDE))stopR3("R3_TOOL_PREDECESSOR_PRELUDE");const seam=uniqueSpanR3(candidate,SEAM);suffix=candidate.slice(seam);
    const replaced=replaceInheritedRuntimeR3(candidate.slice(PRELUDE.length,seam));
    producerTree=parseDerivationTextR3(producer,"fixed-producer-r3.mjs");verifierTree=parseDerivationTextR3(verifier,"fixed-verifier-body-r3.mjs");kernelTree=parseDerivationTextR3(kernel,"fixed-kernel-r3.mjs");
    const sharedBodies=bindSharedBodiesR3(producerTree,verifierTree,kernelTree);
    prefix=appendSourceR3(appendSourceR3(appendSourceR3(appendSourceR3(replaced.result,"\n"),producer),"\n"),verifier);uniqueSpanR3(prefix,ALIAS_CLEAR);
    normal=appendSourceR3(prefix,suffix);normalInfo=censusDomainR3(normal,prefix.length,DOMAINS[0]);
    const normalPrelude=makePreludeR3(normalInfo.census);normal=appendSourceR3(normalPrelude,normal);
    normalInfo=censusDomainR3(normal,normalPrelude.length+prefix.length,DOMAINS[0]);
    const aliasPrefix=prefix.replace(ALIAS_CLEAR,ALIAS_RETAIN);alias=appendSourceR3(aliasPrefix,suffix);aliasInfo=censusDomainR3(alias,aliasPrefix.length,DOMAINS[1]);
    const aliasPrelude=makePreludeR3(aliasInfo.census);alias=appendSourceR3(aliasPrelude,alias);
    aliasInfo=censusDomainR3(alias,aliasPrelude.length+aliasPrefix.length,DOMAINS[1]);
    kernelInfo=censusDomainR3(kernel,kernel.length,DOMAINS[2]);const kernelPrelude=makePreludeR3(kernelInfo.census);kernel=appendSourceR3(kernelPrelude,kernel);
    kernelInfo=censusDomainR3(kernel,kernel.length,DOMAINS[2]);
    const normalStart=normalPrelude.length+prefix.length,aliasStart=aliasPrelude.length+aliasPrefix.length;
    if(normal.slice(normalStart)!==suffix||alias.slice(aliasStart)!==suffix)stopR3("R3_TOOL_SUFFIX_TEXT_DRIFT");
    if(hashToolBytesR3(normal.slice(normalStart))!==hashToolBytesR3(suffix)||hashToolBytesR3(alias.slice(aliasStart))!==hashToolBytesR3(suffix))stopR3("R3_TOOL_SUFFIX_BYTE_DRIFT");
    const lineage={parent:INPUTS.candidate,parentInventory:INPUTS.inventory,parentProfile:INPUTS.profile,
      oldGrammarUtf16Start:seam,normalGrammarUtf16Start:normalStart,aliasGrammarUtf16Start:aliasStart,grammarSuffixBytes:cByteLength(suffix),
      grammarSuffixHash:hashToolBytesR3(suffix),byteIdenticalGrammarSuffix:true,immutableParentRows:7274,optionsByProfile:oldProfile.optionsByProfile,
      inputSources:{producer:{bytes:producerBytes.length,sha256:hashToolBytesR3(producerBytes)},verifier:{bytes:verifierBytes.length,sha256:hashToolBytesR3(verifierBytes)},kernel:{bytes:kernelBytes.length,sha256:hashToolBytesR3(kernelBytes)}},
      runtimeEdits:replaced.edits,sharedBodies,sourceCostReview:"REQUIRED_BEFORE_B",actualTFrom:"SOURCE_CENSUS_PLUS_CLOSED_BOOTSTRAP",checks:"UNRUN"};
    const result={normal:makeDomainArtifactsR3(normal,normalInfo,DOMAINS[0],lineage),aliasFault:makeDomainArtifactsR3(alias,aliasInfo,DOMAINS[1],lineage),
      boundaryKernel:makeDomainArtifactsR3(kernel,kernelInfo,DOMAINS[2],{sharedBodies,parserImported:false,targetExecution:false,normalGrammarAbsent:true}),
      review:{domains:DOMAINS,soleExport:"derivePrivateSummaryP3R3",arity:0,sourceOnly:true,checks:"UNRUN",targetEvaluation:false,
        normalToolBytes:normalInfo.finalToolBytes,aliasToolBytes:aliasInfo.finalToolBytes,kernelToolBytes:kernelInfo.finalToolBytes,
        faultMutation:{original:ALIAS_CLEAR,replacement:ALIAS_RETAIN,normalUtf16Start:normal.indexOf(ALIAS_CLEAR),bytesDelta:cByteLength(ALIAS_RETAIN)-cByteLength(ALIAS_CLEAR)},
        suffixComparison:"BYTE_IDENTICAL",outputGroups:3,outputArtifacts:9,authority:"NOT_ISSUED"}};
    if(cByteLength(serializeR3(result.review,65536))>65536)stopR3("R3_TOOL_REVIEW_CAP");
    return result;
  }finally{
    candidateBytes=null;inventoryBytes=null;profileBytes=null;producerBytes=null;verifierBytes=null;kernelBytes=null;tsLib=null;tsPackage=null;
    candidate="";producer="";verifier="";kernel="";normal="";alias="";suffix="";prefix="";
    oldMap=null;oldProfile=null;producerTree=null;verifierTree=null;kernelTree=null;normalInfo=null;aliasInfo=null;kernelInfo=null;
  }
}
