import { z } from "zod";
import { canonicalJson,sha256 } from "@/modules/execution-fabric/contracts";

/** This module is compact/pure. No filesystem, verifier, worker or math-pilot import. */
export const LRC_CAMPAIGN_LIMITS=Object.freeze({importMs:10000,chunkBytes:65536,evidenceBytes:65536,factsBytes:32768,auditBytes:65536,files:42,totalBytes:53211840});
export const LRC_CAMPAIGN_REFERENCE_PATH="docs/research/lrc-allikvere-v2/retained-campaign-reference.json";
export const LRC_CAMPAIGN_SCOPE=Object.freeze({preset:"ALLIKVERE_P83_14_V1",claimId:"FINITE_I13_P83_224_EMPTY_AND_J13_P83_EMPTY",prime:83,movingSpeeds:13,totalRunners:14,thresholdDenominator:14,commonLevel:224,boundary:"STRICT_OPEN_BAD",multiplicity:"LABELLED_RETAINED",admissionMode:"RETAINED_REFERENCE_NOT_FRESH"} as const);
export const lrcCampaignScopeSchema=z.object({preset:z.literal(LRC_CAMPAIGN_SCOPE.preset),claimId:z.literal(LRC_CAMPAIGN_SCOPE.claimId),prime:z.literal(83),movingSpeeds:z.literal(13),totalRunners:z.literal(14),thresholdDenominator:z.literal(14),commonLevel:z.literal(224),boundary:z.literal("STRICT_OPEN_BAD"),multiplicity:z.literal("LABELLED_RETAINED"),admissionMode:z.literal("RETAINED_REFERENCE_NOT_FRESH")}).strict();
export type LrcCampaignScope=z.infer<typeof lrcCampaignScopeSchema>;
function freeze<T>(value:T):T{if(value&&typeof value==="object"){for(const v of Object.values(value))freeze(v);Object.freeze(value);}return value;}
/** Fixed host allowlist. It stops at the055 prerequisite SUMMARY, not recursively
 * at all paper premises or every transitive host runtime dependency. */
export const LRC_CAMPAIGN_FILES=freeze([
  {path:"docs/research/lrc-allikvere-v2/retained-prime-criterion-audit.json",bytes:24624,sha256:"3387eca4befe5d67845278c3120e65b098764a742af26f6e615b6da2512bf693"},
  {path:"docs/research/lrc-allikvere-v2/retained-p83-cascade.ancestors2.bin",bytes:52,sha256:"ece61da2bd3a3c447d919da64e6ece4d755a36bf14a0417c5cfe9f045d0b2998"},
  {path:"docs/research/lrc-allikvere-v2/retained-p83-cascade.json",bytes:4169,sha256:"0872e1bd95533fea3cfbdd2eab2834607283739c5796ef4c82e5636a57affbb1"},
  {path:"docs/research/lrc-allikvere-v2/retained-p83-cascade.level16.bin",bytes:832,sha256:"d4bad3d351eab949b4c5ecffee36c8b2b76c80f084e9555034a50878554684f5"},
  {path:"docs/research/lrc-allikvere-v2/retained-p83-cascade.level2.bin",bytes:12006280,sha256:"8dc02ad527df1f1d28c2f28c88629483a8c14849141aa2ecb18e4399398853c1"},
  {path:"docs/research/lrc-allikvere-v2/retained-p83-cascade.level32.bin",bytes:832,sha256:"de0402bad5e8e7c142476583d49743c7584f37d77640246667fa3079b6037aca"},
  {path:"docs/research/lrc-allikvere-v2/retained-p83-cascade.level4.bin",bytes:129740,sha256:"706bf573ee32319f36f769fb2c043c64960d1d2170c83892168626489877a8d0"},
  {path:"docs/research/lrc-allikvere-v2/retained-p83-cascade.level8.bin",bytes:1456,sha256:"0377aa5cf18cbe24b2bc755600970da53863a9046b1828e24eaefdf5735135ff"},
  {path:"docs/research/lrc-allikvere-v2/retained-p83-cascade.tree.bin",bytes:30729972,sha256:"bf5d9802fa7e02c606692eb6380c6aad0defe012b0cc71e9b0b74ddcdd18b760"},
  {path:"docs/research/lrc-allikvere-v2/retained-p83-covering-number.json",bytes:90365,sha256:"540adb5504a3c3b1ed9e277c304ccc20027711a0bbd29dd3d8f765c91cdd9d06"},
  {path:"docs/research/lrc-allikvere-v2/retained-p83-generation.cover12.bin",bytes:24504,sha256:"28cf550cc56516e49f91046090c02d55a9928020998ff8a585105fd35173b880"},
  {path:"docs/research/lrc-allikvere-v2/retained-p83-generation.cover13.bin",bytes:1506739,sha256:"3c2c2286a6a79895c6ba2d688be483861b3d03621d318b98c4e79f951f90c41f"},
  {path:"docs/research/lrc-allikvere-v2/retained-p83-generation.json",bytes:3812,sha256:"72d26052dd11ddc2c46ca5d08676975cefe398f701580a00e6499076ca2a08ef"},
  {path:"docs/research/lrc-allikvere-v2/retained-p83-generation.tree.bin",bytes:5030766,sha256:"0bd714c3fbf32365f972e7e9146d5d6da5736e339c5a0f60bd38fbac7630847c"},
  {path:"docs/research/lrc-allikvere-v2/retained-p83-terminal.json",bytes:6974,sha256:"f5e85bcad566519149f4a5267672b08bbb0f0064882a4585215d2280f4ab3230"},
  {path:"docs/research/lrc-allikvere-v2/retained-p83-terminal.tree.bin",bytes:3435440,sha256:"5742de80c612f2ab82ed7ccc4356e235c16d0dc21a0ee4e25ea6fb7161b61779"},
  {path:"docs/research/lrc-allikvere-v2/retained-prime-lift-structure.json",bytes:53773,sha256:"f5d4777b87b1a1dfd838de3336fa1dcdd98ee3cfad0cfb064d282eb8bbfa1a2d"},
  {path:"src/modules/research-sandbox/math-lrc-p83-covering-number.ts",bytes:7969,sha256:"0926eaabc5fc2b0eb71b764b4a849f625999c0b26b3591c1d05a3800e83c29f7"},
  {path:"src/modules/research-sandbox/math-lrc-p83-covering-number-replay.ts",bytes:3639,sha256:"c2501dc2566d36a6d084660a5dee9243253cecb9e2644861247bcbce82e84300"},
  {path:"scripts/operations/replay-lrc-p83-covering-number.py",bytes:3444,sha256:"30bac287e67182d564f10e4c04009e621150e26f266926298cb6f0b47cd41fba"},
  {path:"scripts/operations/allikvere-p83-covering-number-audit.ts",bytes:1353,sha256:"ebd269953bec814680bf889e5e9f83af816c0287c0f9c8d30fc7c0a9bf328eb6"},
  {path:"src/modules/research-sandbox/math-lrc-p83-generation.ts",bytes:13817,sha256:"244437bb3b35f289f04bbe371ee5285651b77624204ee5d570d42e337d43e1f0"},
  {path:"src/modules/research-sandbox/math-lrc-p83-generation-replay.ts",bytes:5376,sha256:"1d0a0ab0fdc93ba942a974fb2e1e32c6a9f70a20f11fa5a94478e6521eb749d9"},
  {path:"scripts/operations/replay-lrc-p83-generation.py",bytes:6597,sha256:"feb6a4affbb06e98440b391435454f9468d4bf50e93781bd38b7c83b72b0dae2"},
  {path:"scripts/operations/allikvere-p83-generation-audit.ts",bytes:1955,sha256:"1e3d8ad0f12e9e2e4ed4824f91652377a457f660450a42bee1cc7ebefa378ffb"},
  {path:"src/modules/research-sandbox/math-lrc-p83-cascade.ts",bytes:15182,sha256:"b10f814da06bfe08db00276ab474798f55a7d5e8b2c278c60e17755c9e6c0e49"},
  {path:"src/modules/research-sandbox/math-lrc-p83-cascade-replay.ts",bytes:5425,sha256:"b01fca513d6e12fb59ddfbef93102c5b6f0c4c8120bda7c799e1b535c4a68d3c"},
  {path:"scripts/operations/replay-lrc-p83-cascade.py",bytes:9255,sha256:"cd48f5c2138495fe66cb6527d3df923511c80059029b94907936986125046ded"},
  {path:"scripts/operations/allikvere-p83-cascade-audit.ts",bytes:1884,sha256:"87fa8877e5ab3a4598e3135f64364f2112c9703199593ff120e8e1995ce38cda"},
  {path:"src/modules/research-sandbox/math-lrc-p83-terminal.ts",bytes:14889,sha256:"f88e7fcd8434223a5f29baee6bc896e12d93105b17d0b68b9183b40bad6a5e11"},
  {path:"src/modules/research-sandbox/math-lrc-p83-terminal-replay.ts",bytes:5369,sha256:"f62b40df70e4f7cf07c98ca68677efc71149b34025d86cbff906154baec29de4"},
  {path:"scripts/operations/replay-lrc-p83-terminal.py",bytes:11178,sha256:"0f4f6ce3b17d4c1ac4e2ce5f65680138b29d948b94b1369bc127a37f883e7b97"},
  {path:"scripts/operations/allikvere-p83-terminal-audit.ts",bytes:1802,sha256:"2cee49963ad5f90da5628831f1e3640aed13bd2bc6f3c34bc8abe5b60492e478"},
  {path:"src/modules/research-sandbox/math-lrc-prime-lift-structure.ts",bytes:8282,sha256:"c9c2eb4ae0038cface6c8638d6f9034c171f06f6ac6f79db87ab8c008c16c5dc"},
  {path:"src/modules/research-sandbox/math-lrc-prime-lift-structure-replay.ts",bytes:5059,sha256:"4c2dbaf58f6e30635ce08514502372d16c0a183ab92b293ca0a2f77d9858c828"},
  {path:"scripts/operations/replay-lrc-prime-lift-structure.py",bytes:5568,sha256:"5fe551a89b279493bee97de0a35f88409c9855c714ba1ce1a025184e161c7027"},
  {path:"scripts/operations/allikvere-prime-lift-structure-audit.ts",bytes:1667,sha256:"71ef05508eaebdf6ed96e772049b1d44efc6d0cd9919a6ca06a4822cd12bc3ac"},
  {path:"docs/operations/LRC_CRITICAL_PRIME_LIFT_STRUCTURE_2026-10-04.md",bytes:5103,sha256:"be59e71f45af025bd563b574930bd9e4a630f1063b805ccf5ad19c5d709bd4b7"},
  {path:"docs/operations/LRC_P83_CASCADE_TERMINAL_BRIDGE_2026-10-03.md",bytes:8202,sha256:"6103dc205b6b3ddf93288d88fa028399fe08a97fba08876aa7b425734f0bbe1b"},
  {path:"docs/operations/LRC_P83_COMPLETE_COVERING_NUMBER_2026-10-03.md",bytes:5171,sha256:"6a2acfbccf960782892fd971f0a686ae31a9d685335e89def2a1e6f4c52a31ff"},
  {path:"docs/operations/LRC_P83_COMPLETE_GENERATION_2026-10-03.md",bytes:6080,sha256:"7c9bc8bcd3739d7a11a2e710d76b9cde7786b0981a874317db2abdcef92e0fe4"},
  {path:"docs/operations/LRC_P83_COMPLETE_TERMINAL_CERTIFICATE_2026-10-03.md",bytes:7244,sha256:"5221985e13a5684c5b017b3b249a5ce9875803951b290e1c02879147f284df05"},
] as const);
export const LRC_CAMPAIGN_MANIFEST_DIGEST=sha256(canonicalJson(LRC_CAMPAIGN_FILES));
export const LRC_CAMPAIGN_SCOPE_DIGEST=sha256(canonicalJson(LRC_CAMPAIGN_SCOPE));
export const LRC_CAMPAIGN_FACTS=freeze({
  domain:{movingSpeeds:13,totalRunners:14,prime:83,primeSet:"P13",primeSetSize:61,nonzeroRelativeVelocities:true,badPredicate:"14*d < modulus",equality:"GOOD",multiplicity:"LABELLED_RETAINED"},
  admission:{mode:"RETAINED_REFERENCE_NOT_FRESH",freshFullCampaign:false,localUnsigned:true,newSemanticReplay:false},
  stages:[{tip:"056",kind:"COMPLETE_COVERING_NUMBER",tau:12,roots:10,nodes:7172},{tip:"057",kind:"COMPLETE_GENERATION",canonical12:2042,irredundant13:41552,reducible13:74351,canonical13:115903,repeated13:24504,nodes:1939746},{tip:"058",kind:"COMPLETE_BINARY_CASCADE",levels:[1,2,4,8,16,32],survivors:[461780,4990,56,32,32],roots:582761,nodes:2330389,forces:6994519,partitionMassPerRoot:8192},{tip:"059",kind:"COMPLETE_TERMINAL_AND_224_BRIDGE",terminalLevel:14,cascadeLevel:32,commonLevel:224,nonComparableLevels:true,allBaseUnits:82,nodes:607854,forces:668179,domainMassPerRoot:96889010407,originalOmittedGcdModulus:14}],
  roots:[{ancestor:[1,2,3,4,5,6,7,8,9,10,11,12,13],gridCertifiedRegionMass:96889010402,gcdCertifiedRegionMass:5,gcdRegionGridOverlap:4},{ancestor:[1,2,3,4,5,6,7,8,9,10,11,13,24],gridCertifiedRegionMass:96889010401,gcdCertifiedRegionMass:6,gcdRegionGridOverlap:5}],
  finiteConclusion:{I:"I(13,83,224)=EMPTY",J:"J(13,83)=EMPTY",scope:"ONE_ACTUAL_PRIME_ONLY",basis:"RECORDED_LOCAL_ADMISSION_AND_REVIEWED_UNIVERSAL_BRIDGE",historicalRemainingFields:"OLD056_TO058_OPEN_SNAPSHOTS_NOT_CURRENT_CAMPAIGN_VERDICT"},
  supplement:{tip:"060",kind:"CONDITIONAL_CRITICAL_PRIME_LIFT",subsetOnly:true,replacesTerminal:false,reopensCompletedP83:false,assumptions:["PARENT_NO_GRID","EVERY_DELETION_GRID_AT_SAME_1_OVER_N","PRIME_Q_COPRIME_M"],countFormula:"1+n(q-1)",actualTuples:158,actualGridWitnesses:156,actualNoGrid:2,globalGcdProperPerRoot:79,distinctFromTerminalRegionMasses:true},
  assumptions:{sourceUrl:"https://arxiv.org/html/2609.02604v2",writtenBridge:"REVIEWED_NOT_FORMAL_PROOF",recordedSourceLowerCases:"SOURCE_REVIEWED_NOT_INDEPENDENTLY_REPRODUCED",manifestBoundary:"FIXED056_TO060_PLUS055_SUMMARY_REFERENCE_NOT_RECURSIVE_PAPER_CLOSURE",hostCodeAndStorageTrusted:true,hashIdentityNotMathematicalReplay:true},
  remaining:{otherP13Primes:60,lowerIndependentReproduction:"OPEN",globalLrc14:"OPEN",globalLrc15:"OPEN",applicationObligationsOpen:23,formal:"OPEN",externalAcademic:"OPEN",novelty:false,rootConclusions:["PARTIAL","INCONCLUSIVE"]},
} as const);
export const LRC_CAMPAIGN_FACTS_DIGEST=sha256(canonicalJson(LRC_CAMPAIGN_FACTS));
const hash=z.string().regex(/^[a-f0-9]{64}$/);
const timestamp=z.string().max(40).refine(v=>/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(v)&&!Number.isNaN(Date.parse(v))&&new Date(v).toISOString()===v);
const baseEvidenceSchema=z.object({version:z.literal(1),claimId:z.literal(LRC_CAMPAIGN_SCOPE.claimId),rootContractDigest:hash,scopeDigest:z.literal(LRC_CAMPAIGN_SCOPE_DIGEST),scope:lrcCampaignScopeSchema,factsDigest:z.literal(LRC_CAMPAIGN_FACTS_DIGEST),facts:z.custom<typeof LRC_CAMPAIGN_FACTS>(v=>{try{return canonicalJson(v)===canonicalJson(LRC_CAMPAIGN_FACTS);}catch{return false;}}),manifestDigest:z.literal(LRC_CAMPAIGN_MANIFEST_DIGEST),files:z.custom<typeof LRC_CAMPAIGN_FILES>(v=>{try{return canonicalJson(v)===canonicalJson(LRC_CAMPAIGN_FILES);}catch{return false;}}),admission:z.object({mode:z.literal("RETAINED_REFERENCE_NOT_FRESH"),method:z.literal("LOCAL_FIXED_FILE_IDENTITY_IMPORT_V1"),importedAt:timestamp,filesVerified:z.literal(42),bytesVerified:z.literal(53211840),freshFullCampaign:z.literal(false),localUnsigned:z.literal(true),semanticReplayExecuted:z.literal(false),externalAttestation:z.literal(false)}).strict(),evidenceDigest:hash}).strict();
export function digestLrcCampaignEvidence(raw:Omit<z.infer<typeof baseEvidenceSchema>,"evidenceDigest">):string{return sha256(canonicalJson(raw));}
export const lrcCampaignEvidenceSchema=baseEvidenceSchema.superRefine((value,ctx)=>{const {evidenceDigest,...body}=value;if(digestLrcCampaignEvidence(body)!==evidenceDigest)ctx.addIssue({code:"custom",message:"Campaign evidence digest mismatch"});});
export type LrcCampaignEvidence=z.infer<typeof lrcCampaignEvidenceSchema>;
/** Pure fixed-reference integrity ONLY; authenticity comes from host admission,
 * provider-injection refusal and immutable snapshots, NOT from this digest. */
export function validateRetainedLrcCampaignEvidence(raw:unknown,expectedScope:unknown,rootContractDigest:string):boolean{
  try{if(Buffer.byteLength(canonicalJson(raw))>LRC_CAMPAIGN_LIMITS.evidenceBytes||!lrcCampaignScopeSchema.safeParse(expectedScope).success)return false;const parsed=lrcCampaignEvidenceSchema.safeParse(raw);return parsed.success&&parsed.data.rootContractDigest===rootContractDigest&&hash.safeParse(rootContractDigest).success&&canonicalJson(parsed.data.scope)===canonicalJson(expectedScope);}catch{return false;}
}
export function createLrcCampaignReferenceEvidence(rootContractDigest:string,scope:unknown,importedAt:string):LrcCampaignEvidence{
  const validScope=lrcCampaignScopeSchema.parse(scope),body={version:1 as const,claimId:LRC_CAMPAIGN_SCOPE.claimId,rootContractDigest,scopeDigest:LRC_CAMPAIGN_SCOPE_DIGEST,scope:validScope,factsDigest:LRC_CAMPAIGN_FACTS_DIGEST,facts:cloneLrcCampaignValue(LRC_CAMPAIGN_FACTS),manifestDigest:LRC_CAMPAIGN_MANIFEST_DIGEST,files:cloneLrcCampaignValue(LRC_CAMPAIGN_FILES),admission:{mode:"RETAINED_REFERENCE_NOT_FRESH" as const,method:"LOCAL_FIXED_FILE_IDENTITY_IMPORT_V1" as const,importedAt,filesVerified:42 as const,bytesVerified:53211840 as const,freshFullCampaign:false as const,localUnsigned:true as const,semanticReplayExecuted:false as const,externalAttestation:false as const}};return lrcCampaignEvidenceSchema.parse({...body,evidenceDigest:digestLrcCampaignEvidence(body)});
}
export function lrcCampaignFactsPrompt(evidence:LrcCampaignEvidence):string{
  if(!validateRetainedLrcCampaignEvidence(evidence,evidence.scope,evidence.rootContractDigest))throw new Error("Invalid retained campaign facts");const text=`HOST_LRC_CAMPAIGN_FACTS_V1\n${canonicalJson(evidence)}`;if(Buffer.byteLength(text)>LRC_CAMPAIGN_LIMITS.factsBytes)throw new Error("Campaign facts limit");return text;
}
export function cloneLrcCampaignValue<T>(value:T):T{return JSON.parse(canonicalJson(value)) as T;}
export function snapshotLrcCampaignValue(value:unknown):Readonly<{canonical:string;digest:string}>{const canonical=canonicalJson(value);return Object.freeze({canonical,digest:sha256(canonical)});}
export function unchangedLrcCampaignSnapshot(value:unknown,snapshot:Readonly<{canonical:string;digest:string}>):boolean{try{const text=canonicalJson(value);return text===snapshot.canonical&&sha256(text)===snapshot.digest;}catch{return false;}}
