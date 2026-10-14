import type {LeanWorkbenchInputs} from "./lean-workbench-state";

/** Local convenience only. Never restore observations, execution or verified status. */
export const LEAN_DRAFT_LIFETIME_MS = 24 * 60 * 60 * 1000;
const MAX_SERIALIZED_LENGTH = 550_000;
const limits = {statement:12000, domainInput:8192, solver:32768, critic:8192, repair:32768} as const;
const adapters = ["NONE", "INTEGER_WITNESS", "FINITE_GRAPH", "POLYNOMIAL_IDENTITY", "RATIONAL_INTERVAL_FLOOR"];
export type LeanDraft = {version:1; savedAt:number; input:LeanWorkbenchInputs};
type StorageAccess = () => Pick<Storage, "getItem" | "setItem" | "removeItem">;
export function leanDraftKey(userId:string, workspaceId:string) {
  return `hive:lean-draft:v1:${encodeURIComponent(userId)}:${encodeURIComponent(workspaceId)}`;
}
export function parseLeanDraft(raw:string, now=Date.now()):LeanDraft|null {
  if(raw.length>MAX_SERIALIZED_LENGTH)return null;
  try {
    const value:unknown=JSON.parse(raw);
    if(!value||typeof value!=="object"||Array.isArray(value))return null;
    const draft=value as Record<string,unknown>;
    if(draft.version!==1||typeof draft.savedAt!=="number"||!Number.isFinite(draft.savedAt)||draft.savedAt>now||now-draft.savedAt>=LEAN_DRAFT_LIFETIME_MS)return null;
    if(!draft.input||typeof draft.input!=="object"||Array.isArray(draft.input))return null;
    const source=draft.input as Record<string,unknown>;
    if(typeof source.adapterId!=="string"||!adapters.includes(source.adapterId))return null;
    for(const [field,limit] of Object.entries(limits))if(typeof source[field]!=="string"||(source[field] as string).length>limit)return null;
    // Explicit allowlist: even a tampered storage item cannot carry a result back in.
    const input:LeanWorkbenchInputs={statement:source.statement as string,adapterId:source.adapterId as LeanWorkbenchInputs["adapterId"],domainInput:source.domainInput as string,solver:source.solver as string,critic:source.critic as string,repair:source.repair as string};
    return {version:1,savedAt:draft.savedAt,input};
  }catch{return null;}
}
export function readLeanDraft(storage:StorageAccess,key:string,now=Date.now()):{draft:LeanDraft|null;error:boolean} {
  try {
    const raw=storage().getItem(key);
    if(raw===null)return {draft:null,error:false};
    const draft=parseLeanDraft(raw,now);
    if(!draft)storage().removeItem(key);
    return {draft,error:!draft};
  }catch{return {draft:null,error:true};}
}
export function saveLeanDraft(storage:StorageAccess,key:string,input:LeanWorkbenchInputs,now=Date.now()):boolean {
  try {
    const draft=parseLeanDraft(JSON.stringify({version:1,savedAt:now,input}),now);
    if(!draft)return false;
    storage().setItem(key,JSON.stringify(draft));return true;
  }catch{return false;}
}
export function deleteLeanDraft(storage:StorageAccess,key:string):boolean {
  try {storage().removeItem(key);return true;}catch{return false;}
}
