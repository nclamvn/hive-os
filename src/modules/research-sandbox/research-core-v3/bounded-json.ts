import { types } from "node:util";
import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";
import { ResearchCoreRefusal, type Json } from "./types";

export const digest = (value: unknown) => sha256(canonicalJson(value));
export function refuse(code: ConstructorParameters<typeof ResearchCoreRefusal>[0], message: string): never { throw new ResearchCoreRefusal(code, message); }

function rejectAmbiguousJson(source: string): void {
  const stack: (Set<string> | null)[] = [];
  // Lexically inspect already byte-bounded text before allocating the parsed
  // graph. Duplicate escaped-equivalent keys and excessive nesting are refused.
  for (let i = 0; i < source.length; i++) {
    const char = source[i];
    if (char === '"') {
      const start = i; i++;
      for (; i < source.length; i++) { if (source[i] === "\\") i++; else if (source[i] === '"') break; }
      if (i >= source.length) refuse("SCHEMA_REFUSED", "Unterminated JSON string");
      let next = i+1;
      while (next < source.length && /\s/.test(source[next])) next++;
      if (source[next] === ":") {
        let key: string;
        try { key = JSON.parse(source.slice(start,i+1)) as string; } catch { refuse("SCHEMA_REFUSED", "Invalid JSON key"); }
        const object = stack[stack.length-1];
        if (!object || object.has(key)) refuse("SCHEMA_REFUSED", "Duplicate or misplaced JSON key");
        if (object.size >= 256) refuse("RESOURCE_REFUSED", "Raw JSON key limit");
        object.add(key);
      }
    } else if (char === "{" || char === "[") {
      if (stack.length >= 20) refuse("RESOURCE_REFUSED", "Raw JSON nesting limit");
      stack.push(char === "{" ? new Set<string>() : null);
    } else if (char === "}" || char === "]") stack.pop();
  }
}

/** Bound intake before JSON.parse, canonicalization, schema materialization or hashing. */
export function boundedJson(value: unknown, maxBytes: number, maxArray = 256): Json {
  if (typeof value === "string") {
    if (value.length > maxBytes || Buffer.byteLength(value, "utf8") > maxBytes) refuse("RESOURCE_REFUSED", "JSON byte limit");
    rejectAmbiguousJson(value);
    try { value = JSON.parse(value); } catch { refuse("SCHEMA_REFUSED", "Invalid JSON"); }
  }
  let bytes = 0;
  let nodes = 0;
  const ancestors = new Set<object>();
  const charge = (n: number) => { bytes += n; if (bytes > maxBytes) refuse("RESOURCE_REFUSED", "JSON byte limit"); };
  const visit = (v: unknown, depth: number): void => {
    if (++nodes > 8192 || depth > 20) refuse("RESOURCE_REFUSED", "JSON structural limit");
    if (v === null || typeof v === "boolean") { charge(5); return; }
    if (typeof v === "string") {
      if (v.length > maxBytes) refuse("RESOURCE_REFUSED", "JSON string limit");
      // Conservative escaped-byte bound is intentional, including key/string delimiters.
      charge(6 * v.length + 2); return;
    }
    if (typeof v === "number") { if (!Number.isSafeInteger(v) || Object.is(v, -0)) refuse("SCHEMA_REFUSED", "Only safe JSON integers supported"); charge(24); return; }
    if (typeof v !== "object" || types.isProxy(v)) refuse("SCHEMA_REFUSED", "Only plain JSON data supported");
    if (ancestors.has(v)) refuse("SCHEMA_REFUSED", "Cyclic JSON");
    const array = Array.isArray(v);
    if (!array && Object.getPrototypeOf(v) !== Object.prototype && Object.getPrototypeOf(v) !== null) refuse("SCHEMA_REFUSED", "Non-plain object");
    if (array && (v as unknown[]).length > maxArray) refuse("RESOURCE_REFUSED", "Array dimension limit");
    const keys = Reflect.ownKeys(v);
    if (keys.length > maxArray + 1) refuse("RESOURCE_REFUSED", "Object key limit");
    ancestors.add(v); charge(2);
    if (array && keys.length !== (v as unknown[]).length + 1) refuse("SCHEMA_REFUSED", "Sparse or decorated array");
    for (const k of keys) {
      if (array && k === "length") continue;
      if (typeof k !== "string" || ["__proto__", "constructor", "prototype"].includes(k)) refuse("SCHEMA_REFUSED", "Unsupported JSON key");
      if (array && !/^(0|[1-9][0-9]*)$/.test(k)) refuse("SCHEMA_REFUSED", "Decorated array");
      const descriptor = Object.getOwnPropertyDescriptor(v, k)!;
      if (!descriptor.enumerable || !("value" in descriptor)) refuse("SCHEMA_REFUSED", "Getters/non-data descriptors are forbidden");
      charge(6 * k.length + 4); visit(descriptor.value, depth + 1);
    }
    ancestors.delete(v);
  };
  visit(value, 0);
  // Clone only after resource admission; never retain mutable caller-owned JSON.
  return JSON.parse(canonicalJson(value)) as Json;
}
export function frozen<T>(value: T): T {
  if (value && typeof value === "object") { for (const child of Object.values(value)) frozen(child); Object.freeze(value); }
  return value;
}
export function parseSchema<T>(schema: { parse(v: unknown): T }, value: unknown): T {
  try { return schema.parse(value); } catch (error) { if (error instanceof ResearchCoreRefusal) throw error; return refuse("SCHEMA_REFUSED", "Domain schema invalid"); }
}
export function exactInteger(value: string, bits: number): bigint {
  // Decimal length check comes before BigInt allocation, then exact bit bound.
  if (!/^(0|-?[1-9][0-9]*)$/.test(value)) refuse("SCHEMA_REFUSED", "Non-canonical integer");
  if (value.length > Math.ceil(bits * 0.302) + 2) refuse("RESOURCE_REFUSED", "Integer digit limit");
  const n = BigInt(value);
  if ((n < BigInt(0) ? -n : n).toString(2).length > bits) refuse("RESOURCE_REFUSED", "Integer bit limit");
  return n;
}
