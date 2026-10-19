import { z } from "zod";
import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";
import { boundedJson } from "../research-core-v3/bounded-json";
import { types } from "node:util";

export const evaluationDigest = (value: unknown) => sha256(canonicalJson(value));
export const arms = ["DIRECT_WITH_TOOLS", "METHOD_ASSISTED"] as const;
export type Arm = typeof arms[number];
export const digestSchema = z.string().regex(/^[a-f0-9]{64}$/);
export const identifierSchema = z.string().regex(/^[A-Za-z0-9][A-Za-z0-9._:-]{0,119}$/);
const count = (max: number) => z.number().int().nonnegative().max(max);
export const resourcesSchema = z.object({ calls: count(32), tokens: count(1000000), checkerOperations: count(20000000),
  computeMilliseconds: count(600000), readBytes: count(67108864), writeBytes: count(67108864) }).strict();
export const ceilingsSchema = z.object({ total: resourcesSchema, perCall: z.object({ tokens: count(120000), milliseconds: count(120000) }).strict(),
  wallMilliseconds: z.number().int().min(1).max(600000), maxRounds: z.number().int().min(1).max(8),
  postgrade: z.object({ actions: z.number().int().min(1).max(16), total: resourcesSchema }).strict() }).strict();
export const taskSchema = z.object({ id: identifierSchema, contract: z.unknown(), referenceDigest: digestSchema,
  exposure: z.literal("PUBLIC_ENGINEERING_CONTROL"), sourceExposureDigest: digestSchema, toolsetDigest: digestSchema }).strict();
export const studyBodySchema = z.object({ version: z.literal(3), id: identifierSchema,
  purpose: z.enum(["PUBLIC_PILOT_12", "ARCHITECTURE_TRANSFER"]), tasks: z.array(taskSchema).min(1).max(12),
  requestedProvider: z.literal("CONTROLLED_LOCAL"), requestedModel: identifierSchema, requestedModelVersion: identifierSchema.nullable(),
  seed: count(2147483647), ceilings: ceilingsSchema, evaluatorVersion: z.literal("EXACT_SCOPED_POSTGRADER_V3"),
  referenceSetDigest: digestSchema, ordering: z.literal("TASK_ORDER_ALTERNATING_FIRST_ARM"),
  promotion: z.literal("ZERO_FALSE_ACCEPT_AND_PLUS_TWO_ACCEPTED_OR_MINUS_25_PERCENT_MEDIAN_INTERVENTIONS_NO_ACCEPTED_LOSS"),
  liveExperiment: z.literal("NOT_RUN"), heldOut: z.literal(false),
  limits: z.literal("CONTROLLED_SOFTWARE_EVIDENCE_NOT_AI_SUPERIORITY_OR_REAL_USER_VALUE") }).strict();
export const studyPlanSchema = studyBodySchema.extend({ planDigest: digestSchema }).strict();
export type StudyPlan = z.infer<typeof studyPlanSchema>;
export class EvaluationRefusal extends Error {
  constructor(readonly code: "INTEGRITY" | "RESOURCE" | "AUTHORITY" | "UNSUPPORTED", message: string) { super(message); this.name = "EvaluationRefusal"; }
}
export function parseEvaluation<T>(schema: z.ZodType<T>, raw: unknown, bytes = 262144): T {
  return schema.parse(typeof raw === "string" ? boundedJson(raw, bytes, 512) : boundedObservation(raw, bytes, 512));
}
/** Non-scientific telemetry may contain finite fractional durations. This never
 * replaces the scientific integer-only parser or creates checker authority.
 * Object-only admission avoids ambiguous serialized duplicate keys entirely.
 */
export function boundedObservation(value: unknown, maxBytes: number, maxArray = 1024): unknown {
  let bytes=0,nodes=0;const ancestors=new Set<object>();
  const charge=(n:number)=>{bytes+=n;if(bytes>maxBytes)throw new EvaluationRefusal("RESOURCE","Observation byte bound");};
  const visit=(v:unknown,depth:number):void=>{
    if(++nodes>32768 || depth>20)throw new EvaluationRefusal("RESOURCE","Observation structural bound");
    if(v===null || typeof v==="boolean"){charge(5);return;}
    if(typeof v==="string"){if(v.length>maxBytes)throw new EvaluationRefusal("RESOURCE","Observation string bound");charge(6*v.length+2);return;}
    if(typeof v==="number"){if(!Number.isFinite(v)||Math.abs(v)>Number.MAX_SAFE_INTEGER||Object.is(v,-0))throw new EvaluationRefusal("INTEGRITY","Invalid finite observation number");charge(24);return;}
    if(typeof v!=="object"||types.isProxy(v)||ancestors.has(v))throw new EvaluationRefusal("INTEGRITY","Observation must be acyclic plain data");
    const array=Array.isArray(v);if(!array&&![Object.prototype,null].includes(Object.getPrototypeOf(v)))throw new EvaluationRefusal("INTEGRITY","Observation prototype");
    if(array&&(v as unknown[]).length>maxArray)throw new EvaluationRefusal("RESOURCE","Observation array bound");
    const keys=Reflect.ownKeys(v);if(keys.length>maxArray+1)throw new EvaluationRefusal("RESOURCE","Observation keys bound");
    if(array&&keys.length!==(v as unknown[]).length+1)throw new EvaluationRefusal("INTEGRITY","Observation sparse/decorated array");
    ancestors.add(v);charge(2);
    for(const key of keys){if(array&&key==="length")continue;if(typeof key!=="string"||["__proto__","prototype","constructor"].includes(key))throw new EvaluationRefusal("INTEGRITY","Observation key");
      const d=Object.getOwnPropertyDescriptor(v,key)!;if(!d.enumerable||!("value" in d))throw new EvaluationRefusal("INTEGRITY","Observation accessor");charge(6*key.length+4);visit(d.value,depth+1);}
    ancestors.delete(v);
  };
  visit(value,0);return JSON.parse(canonicalJson(value));
}
export type Measurement<T> = { status: "KNOWN"; value: T; provenance: string } | { status: "UNKNOWN" | "UNDEFINED"; value: null; reason: string };
export const known = <T>(value: T, provenance: string): Measurement<T> => ({ status: "KNOWN", value, provenance });
export const unknown = <T>(reason: string): Measurement<T> => ({ status: "UNKNOWN", value: null, reason });
export const undefinedMetric = <T>(reason: string): Measurement<T> => ({ status: "UNDEFINED", value: null, reason });
export function ratio(numerator: number, denominator: number): Measurement<number> {
  return denominator === 0 ? undefinedMetric("ZERO_DENOMINATOR") : known(numerator / denominator, "RETAINED_INTENTION_TO_TEST_DENOMINATOR");
}
