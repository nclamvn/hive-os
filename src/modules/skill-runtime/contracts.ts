import { createHash } from "node:crypto";

import type { AssuranceProfile } from "@prisma/client";
import { z } from "zod";

import { SkillRegistryError, SkillRegistryErrorCode } from "./errors";

const KEY = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
const TOKEN = /^[a-z][a-z0-9_]*$/;
const FAILURE_STATE = /^[A-Z][A-Z0-9_]*$/;
const SEMVER =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
const ASSURANCE_ORDER: readonly AssuranceProfile[] = [
  "QUICK",
  "PROFESSIONAL",
  "RESEARCH",
  "REGULATED",
];

const identitySchema = z
  .object({
    skillKey: z.string().trim().min(1).max(80).regex(KEY),
    displayName: z.string().trim().min(1).max(120),
    description: z.string().trim().min(1).max(2_000),
  })
  .strict();

const verifierSchema = z
  .object({
    kind: z.enum(["DETERMINISTIC", "HUMAN", "EXTERNAL"]),
    verifierKey: z.string().trim().min(1).max(120).regex(KEY),
  })
  .strict();

const resourceSchema = z
  .object({
    maxDurationSeconds: z.number().int().positive().max(86_400),
    maxMemoryMb: z.number().int().min(16).max(1_048_576),
    maxCostMinor: z.number().int().nonnegative().optional(),
    currency: z.string().regex(/^[A-Z]{3}$/).optional(),
  })
  .strict()
  .superRefine((value, ctx) => {
    if ((value.maxCostMinor === undefined) !== (value.currency === undefined)) {
      ctx.addIssue({
        code: "custom",
        message: "maxCostMinor and currency must be provided together",
      });
    }
  });

const contractSchema = z
  .object({
    semanticVersion: z.string().trim().regex(SEMVER),
    capabilities: z.array(z.string().regex(TOKEN)).min(1).max(64),
    inputSchema: z.unknown(),
    outputSchema: z.unknown(),
    requiredEvidence: z.array(z.string().regex(TOKEN)).min(1).max(64),
    failureStates: z.array(z.string().regex(FAILURE_STATE)).min(1).max(64),
    verifierBinding: verifierSchema,
    resourceEstimate: resourceSchema,
    assuranceCompatibility: z
      .array(z.enum(ASSURANCE_ORDER))
      .min(1)
      .max(ASSURANCE_ORDER.length),
  })
  .strict();

export interface SkillIdentityInput {
  skillKey: string;
  displayName: string;
  description: string;
}

export interface VerifierBinding {
  kind: "DETERMINISTIC" | "HUMAN" | "EXTERNAL";
  verifierKey: string;
}

export interface ResourceEstimate {
  maxDurationSeconds: number;
  maxMemoryMb: number;
  maxCostMinor?: number;
  currency?: string;
}

export interface SkillContractInput {
  semanticVersion: string;
  capabilities: string[];
  inputSchema: unknown;
  outputSchema: unknown;
  requiredEvidence: string[];
  failureStates: string[];
  verifierBinding: VerifierBinding;
  resourceEstimate: ResourceEstimate;
  assuranceCompatibility: AssuranceProfile[];
}

export type ContractJsonValue =
  | null
  | string
  | number
  | boolean
  | ContractJsonValue[]
  | ContractJsonObject;

export interface ContractJsonObject {
  [key: string]: ContractJsonValue;
}

export interface ValidatedSkillContract {
  semanticVersion: string;
  capabilities: string[];
  inputSchema: ContractJsonObject;
  outputSchema: ContractJsonObject;
  requiredEvidence: string[];
  failureStates: string[];
  verifierBinding: VerifierBinding;
  resourceEstimate: ResourceEstimate;
  assuranceCompatibility: AssuranceProfile[];
}

function invalid(message: string): never {
  throw new SkillRegistryError(
    SkillRegistryErrorCode.InvalidContract,
    message,
  );
}

function uniqueSorted(
  values: readonly string[],
  label: string,
): string[] {
  const unique = new Set(values);
  if (unique.size !== values.length) {
    invalid(`${label} must not contain duplicates`);
  }
  return [...unique].sort();
}

function normalizeJson(
  value: unknown,
  path: string,
): ContractJsonValue {
  if (value === null || typeof value === "string" || typeof value === "boolean") {
    return value;
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value)) invalid(`${path} contains a non-finite number`);
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((item, index) =>
      normalizeJson(item, `${path}[${index}]`),
    );
  }
  if (typeof value !== "object") {
    invalid(`${path} must contain JSON values only`);
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) {
    invalid(`${path} must be a plain JSON object`);
  }
  const normalized: ContractJsonObject = {};
  for (const key of Object.keys(value as Record<string, unknown>).sort()) {
    if (["__proto__", "constructor", "prototype"].includes(key)) {
      invalid(`${path} contains an unsafe key`);
    }
    normalized[key] = normalizeJson(
      (value as Record<string, unknown>)[key],
      `${path}.${key}`,
    );
  }
  return normalized;
}

function normalizeObjectSchema(
  value: unknown,
  label: string,
): ContractJsonObject {
  const normalized = normalizeJson(value, label);
  if (
    normalized === null ||
    Array.isArray(normalized) ||
    typeof normalized !== "object"
  ) {
    invalid(`${label} must be a JSON object`);
  }
  if (normalized.type !== "object") {
    invalid(`${label}.type must be "object"`);
  }
  return normalized;
}

export function validateSkillIdentity(
  input: SkillIdentityInput,
): SkillIdentityInput {
  const result = identitySchema.safeParse(input);
  if (!result.success) invalid("Skill identity is invalid");
  return result.data;
}

export function validateSkillContract(
  input: SkillContractInput,
): ValidatedSkillContract {
  const result = contractSchema.safeParse(input);
  if (!result.success) invalid("Skill contract shape is invalid");
  const parsed = result.data;
  const assurance = uniqueSorted(
    parsed.assuranceCompatibility,
    "assuranceCompatibility",
  ).sort(
    (a, b) =>
      ASSURANCE_ORDER.indexOf(a as AssuranceProfile) -
      ASSURANCE_ORDER.indexOf(b as AssuranceProfile),
  ) as AssuranceProfile[];

  return {
    semanticVersion: parsed.semanticVersion,
    capabilities: uniqueSorted(parsed.capabilities, "capabilities"),
    inputSchema: normalizeObjectSchema(parsed.inputSchema, "inputSchema"),
    outputSchema: normalizeObjectSchema(parsed.outputSchema, "outputSchema"),
    requiredEvidence: uniqueSorted(
      parsed.requiredEvidence,
      "requiredEvidence",
    ),
    failureStates: uniqueSorted(parsed.failureStates, "failureStates"),
    verifierBinding: parsed.verifierBinding,
    resourceEstimate: parsed.resourceEstimate,
    assuranceCompatibility: assurance,
  };
}

function canonicalJson(value: ContractJsonValue): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((item) => canonicalJson(item)).join(",")}]`;
  }
  return `{${Object.keys(value)
    .sort()
    .map(
      (key) =>
        `${JSON.stringify(key)}:${canonicalJson(value[key])}`,
    )
    .join(",")}}`;
}

export function hashSkillContract(
  skillKey: string,
  contract: ValidatedSkillContract,
): string {
  const payload = {
    skillKey,
    ...contract,
  } as unknown as ContractJsonObject;
  return createHash("sha256")
    .update(canonicalJson(payload), "utf8")
    .digest("hex");
}

export function isSkillCompatible(
  contract: Pick<
    ValidatedSkillContract,
    "capabilities" | "assuranceCompatibility"
  >,
  requiredCapabilities: readonly string[],
  assuranceProfile: AssuranceProfile,
): boolean {
  const available = new Set(contract.capabilities);
  return (
    contract.assuranceCompatibility.includes(assuranceProfile) &&
    requiredCapabilities.every((capability) => available.has(capability))
  );
}
