import "server-only";
import {readFile} from "node:fs/promises";
import {createHash} from "node:crypto";
import {resolve} from "node:path";

// A fixed local presentation package, not an execution registry or upload seam.
export const kakeyaFiles = [
  {id:"review",path:"docs/research/KAKEYA_K5_EXTERNAL_REVIEW_101.md",sha:"6fa13efbb43dfbfeaa7e616b41f9a175f25f1551866455d78a744eb0dc9a5ebb"},
  {id:"proof",path:"docs/research/KAKEYA_K5_CLOSURE_101_REPORT.md",sha:"8aa3eb90345f776e0428b5fb5a5f4ce444135de5efca8ba46a5d02c5257f3796"},
  {id:"outside",path:"docs/research/KAKEYA_RESIDUAL_STRUCTURAL_100_REPORT.md",sha:"41720452fe5eb3b7c6c264ef5cc7e37853cf0dd2991fd79203f11bd449b7b01e"},
  {id:"cover",path:"artifacts/research/tip101/MAIN_FULL_SHAPE_COVER.json",sha:"3097a3df15e02f5d299811bc9edbaab453211fdffd1559aedfa50b7e40a78c4a"},
  {id:"volume",path:"artifacts/research/tip101/MAIN_FULL_SHAPE_VERIFICATION.json",sha:"53a9117c71a0645974249c18acde6efc7006603084ab2e20e82222eb16674fe2"},
  {id:"stationary",path:"artifacts/research/tip101/MAIN_FULL_STATIONARY_CERTIFICATE.json",sha:"95d41c6565ccd683bab2376463b402fa3f7170b99bf3daa881c3b15b0878707c"},
  {id:"acceptance",path:"artifacts/research/tip101/MAIN_INDEPENDENT_STATIONARY_VERIFICATION.json",sha:"6b8468c50770066ba31075ac8741bce59529a1b0eaf99a5f87eafcd517b91fca"},
  {id:"coverage-checker",path:"artifacts/research/tip101/coverage_check.py",sha:"e8405e97671f20cda9dc82e0c836eb9fd5f4fac3d6b6f3e4ff4cad4bf2bd1ab3"},
  {id:"acceptance-checker",path:"artifacts/research/tip101/acceptance_check.py",sha:"2e864c581397ee904efcc328f587fa833e52bc2ca4cb8594547fd161d016c801"},
  {id:"walls",path:"artifacts/research/tip101/shape_walls.py",sha:"b7dc6f82542bbafe345ecae974fee72b89982845ceb4d066e7e9b8c57bb91ec5"},
  {id:"cover-producer",path:"artifacts/research/tip101/coverage.cpp",sha:"d4cb94198571c5d2970fe0d32190e9cb30c9cf785562ad1c527812d008912ef6"},
  {id:"stationary-producer",path:"artifacts/research/tip101/stationary.py",sha:"be967dae8fb6df29681657824ca3802ca647b7d4ad1852a8fb02fabad70bd5d2"},
  {id:"triple-certificate",path:"artifacts/research/tip100/ALL_60_CERTIFICATES.json",sha:"47ee0f513f1a5d105477bfb59395d1d905c2b9185aeb78fa38066464b639dab6"},
  {id:"triple-checker",path:"artifacts/research/tip100/triple_bounds.py",sha:"95694cfe9b4c9d159f8c4c8c60462590446d298ae0566970c9e84dea6d98d93b"},
] as const;

export async function readKakeyaFile(id:string) {
  const file=kakeyaFiles.find(item=>item.id===id);
  if(!file)throw new Error("K5_FILE_UNAVAILABLE");
  const bytes=await readFile(resolve(process.cwd(),file.path));
  if(createHash("sha256").update(bytes).digest("hex")!==file.sha)throw new Error("K5_FILE_CHANGED");
  return {file,bytes};
}

export type KakeyaPackage={available:boolean;files:{id:string;name:string;sha:string;bytes:number}[];singular:{cell:number;pair:number[];constant:string;kind:"closed"|"strict";inequality_index:number}[]};

function summaryRecord(value:unknown):Record<string,unknown> {
  if(value===null||typeof value!=="object"||Array.isArray(value))throw new Error("K5_SUMMARY_MISMATCH");
  return value as Record<string,unknown>;
}
function lengthIs(value:unknown,length:number):boolean {
  return Array.isArray(value)&&value.length===length;
}
function integerIn(value:unknown,min:number,max:number):value is number {
  return typeof value==="number"&&Number.isSafeInteger(value)&&value>=min&&value<=max;
}

// Validate only the retained presentation projection. This is schema inspection,
// not a mathematical replay or a substitute for the preceding SHA-256 checks.
export function parseKakeyaSummary(coverValue:unknown,volumeValue:unknown,stationaryValue:unknown,acceptanceValue:unknown):KakeyaPackage["singular"] {
  const cover=summaryRecord(coverValue),volume=summaryRecord(volumeValue),stationary=summaryRecord(stationaryValue),acceptance=summaryRecord(acceptanceValue);
  const s=summaryRecord(acceptance.stats),stationaryStats=summaryRecord(stationary.stats);
  if(cover.status!=="COMPLETE_COVER"||cover.pending_planes!==0||cover.processed_planes!==42||cover.cell_count!==2632||!lengthIs(cover.vertices,1527)||
    volume.status!=="EXACT_COMPLETE_SHAPE_COVER_VERIFIED"||volume.cells!==2632||volume.facets!==13182||volume.volume!=="1/6"||!lengthIs(volume.cell_volumes,2632)||
    stationary.status!=="ALL_FULL_GRADIENT_STATIONARY_CASES_CERTIFIED"||stationaryStats.pairs!==8658||stationary.distinct_polynomials!==667||acceptance.distinct_polynomials!==667||
    acceptance.status!=="INDEPENDENT_FINITE_STATIONARY_CERTIFICATE_VERIFIED"||s.cells!==2632||s.energy_polynomials_rederived!==2632||s.pairs!==8658||s.safe!==3998||s.unique_below_infeasible!==4436||s.singular_below_infeasible_constant!==94||s.inconsistent!==130||
    !Array.isArray(acceptance.singular_constant_exclusions)||acceptance.singular_constant_exclusions.length!==94)throw new Error("K5_SUMMARY_MISMATCH");
  const singular=acceptance.singular_constant_exclusions.map((value:unknown)=>{
    const row=summaryRecord(value),pair=row.pair;
    if(!integerIn(row.cell,0,2631)||!integerIn(row.inequality_index,0,Number.MAX_SAFE_INTEGER)||!Array.isArray(pair)||pair.length!==2||
      !integerIn(pair[0],1,5)||!integerIn(pair[1],1,5)||pair[0]>=pair[1]||
      !(row.kind==="closed"&&row.constant==="-2"||row.kind==="strict"&&row.constant==="0"))throw new Error("K5_SUMMARY_MISMATCH");
    return {cell:row.cell,pair:[pair[0],pair[1]],constant:row.constant as string,kind:row.kind as "closed"|"strict",inequality_index:row.inequality_index};
  });
  if(singular.filter(row=>row.kind==="closed").length!==80||singular.filter(row=>row.kind==="strict").length!==14)throw new Error("K5_SUMMARY_MISMATCH");
  return singular;
}

export async function loadKakeyaPackage():Promise<KakeyaPackage> {
  try {
    const entries=await Promise.all(kakeyaFiles.map(file=>readKakeyaFile(file.id)));
    const json=(id:string):unknown=>{
      const entry=entries.find(e=>e.file.id===id);
      if(!entry)throw new Error("K5_SUMMARY_MISMATCH");
      return JSON.parse(entry.bytes.toString("utf8")) as unknown;
    };
    const singular=parseKakeyaSummary(json("cover"),json("volume"),json("stationary"),json("acceptance"));
    return {available:true,files:entries.map(e=>({id:e.file.id,name:e.file.path.split("/").pop()!,sha:e.file.sha,bytes:e.bytes.length})),singular};
  } catch {
    // Integrity inspection is not mathematical replay. Never promote absent/stale records.
    return {available:false,files:[],singular:[]};
  }
}
