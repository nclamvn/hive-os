import {createHash} from "node:crypto";
import {available,exportBridge,getBridgeView,BridgeRefusal} from "@/modules/permutation-bridge";
import {resolveWorkspaceContext,UnauthenticatedError,ForbiddenError,NotFoundError} from "@/modules/identity-workspace";
import {assertNoCredentialMaterial} from "@/modules/execution-fabric/contracts";
export const dynamic="force-dynamic";
const privateHeaders={"cache-control":"private, no-store","x-content-type-options":"nosniff"};
function scan(value:unknown):void {if(typeof value==="string"){assertNoCredentialMaterial(value);const shadow=value.replace(/\\u([a-f0-9]{4})/gi,(_,hex:string)=>String.fromCharCode(parseInt(hex,16))).replace(/\\+"/g,'"');assertNoCredentialMaterial(shadow);if(/"(?:api[_-]?key|password|database_url|authorization|cookies?|set-cookie|access[_-]?token|refresh[_-]?token|id[_-]?token)"\s*:/i.test(shadow))throw new BridgeRefusal("INPUT");}else if(Array.isArray(value))value.forEach(scan);else if(value&&typeof value==="object")for(const [key,v]of Object.entries(value)){if(/^(api[_-]?key|password|database_url|authorization|cookies?|set-cookie|access[_-]?token|refresh[_-]?token|id[_-]?token)$/i.test(key))throw new BridgeRefusal("INPUT");scan(v);}}
function privateDossierScan(body:string) {
  const parsed=JSON.parse(body);scan(parsed);
  if(!Array.isArray(parsed.originals)||parsed.originals.length>4)throw new BridgeRefusal("INTEGRITY");
  for(const original of parsed.originals) {
    if(!Number.isSafeInteger(original.bytes)||original.bytes<1||original.bytes>32768||typeof original.base64!=="string"||original.base64.length>43692||!/^[A-Za-z0-9+/]*={0,2}$/.test(original.base64))throw new BridgeRefusal("INTEGRITY");
    const bytes=Buffer.from(original.base64,"base64");if(bytes.length!==original.bytes||bytes.toString("base64")!==original.base64||createHash("sha256").update(bytes).digest("hex")!==original.digest)throw new BridgeRefusal("INTEGRITY");
    const text=bytes.toString("utf8"),shadow=text.replace(/\\u([a-f0-9]{4})/gi,(_,hex:string)=>String.fromCharCode(parseInt(hex,16)));
    assertNoCredentialMaterial(text);assertNoCredentialMaterial(shadow);
    if(/"(?:api[_-]?key|password|database_url|authorization|cookies?|set-cookie|access[_-]?token|refresh[_-]?token|id[_-]?token)"\s*:/i.test(shadow))throw new BridgeRefusal("INPUT");
    let value:unknown;try{value=JSON.parse(text);}catch{/* exact bytes remain unmodified */}scan(value);
  }
}
export async function GET(request:Request,{params}:{params:Promise<{workspaceSlug:string;runId:string}>}) {
  try {
    const {workspaceSlug,runId}=await params,format=new URL(request.url).searchParams.get("format")??"json";
    if(!/^[a-f0-9-]{36}$/.test(runId)||!["json","prompt"].includes(format))return Response.json({error:"INPUT_REFUSED"},{status:400,headers:privateHeaders});
    if(!available())return Response.json({error:"BRIDGE_UNAVAILABLE"},{status:503,headers:privateHeaders});
    const ctx=await resolveWorkspaceContext(request.headers,workspaceSlug);
    let body:string,type:string;
    if(format==="prompt") {
      const view=await getBridgeView(ctx,runId),p=view.currentPrompt;
      if(!p)return Response.json({error:"NO_CURRENT_PROMPT"},{status:409,headers:privateHeaders});
      if(Buffer.byteLength(p.text)>131072||createHash("sha256").update(p.text).digest("hex")!==p.digest)throw new BridgeRefusal("INTEGRITY");
      body=p.text;type="text/plain; charset=utf-8";
    } else {body=await exportBridge(ctx,runId);if(Buffer.byteLength(body)>1048576)throw new BridgeRefusal("RESOURCE");privateDossierScan(body);type="application/json; charset=utf-8";}
    assertNoCredentialMaterial(body);
    assertNoCredentialMaterial(body.replace(/\\u([a-f0-9]{4})/gi,(_,hex:string)=>String.fromCharCode(parseInt(hex,16))));
    return new Response(body,{headers:{...privateHeaders,"content-type":type,"x-content-sha256":createHash("sha256").update(body).digest("hex"),"content-disposition":`attachment; filename="permutation-${runId}.${format==="prompt"?"txt":"json"}"`}});
  }catch(e) {
    const status=e instanceof UnauthenticatedError?401:e instanceof ForbiddenError?403:e instanceof NotFoundError?404:e instanceof BridgeRefusal?e.code==="AUTHORITY"?403:e.code==="SOURCE"?503:e.code==="RESOURCE"?413:409:409;
    return Response.json({error:"BRIDGE_EXPORT_REFUSED"},{status,headers:privateHeaders});
  }
}
