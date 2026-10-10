import { randomUUID } from "node:crypto";
import { ShowcaseRefusal, type ShowcaseRole, type ShowcaseTransportPermit } from "./contracts";

type Binding = { runId: string; role: ShowcaseRole; deadlineAt: string; authorityEpoch: string };
const permits = new WeakMap<ShowcaseTransportPermit, Binding & { used: boolean }>();
/** Host namespace capability, not cryptographic human attestation. Only the
 * worker issues this after authenticated durable authority/source checks. */
export function issueShowcaseTransportPermit(binding: Binding): ShowcaseTransportPermit {
  if (!/^[A-Za-z0-9._:-]{1,200}$/.test(binding.runId) || !/^[A-Za-z0-9._:-]{1,200}$/.test(binding.authorityEpoch) || !["ATTEMPT", "CRITIC", "FINAL", "POSTREVIEW"].includes(binding.role) || !Number.isFinite(Date.parse(binding.deadlineAt)) || Date.parse(binding.deadlineAt) <= Date.now()) throw new ShowcaseRefusal("AUTHORITY", "Role authority expired or malformed");
  const permit = Object.freeze({ showcase: true as const }); permits.set(permit, { ...binding, used: false }); return permit;
}
export function requireShowcaseTransportPermit(permit: ShowcaseTransportPermit, expected: { runId: string; role: ShowcaseRole; deadlineAt: string }) {
  const held = permits.get(permit);
  if (!held || held.used || held.runId !== expected.runId || held.role !== expected.role || held.deadlineAt !== expected.deadlineAt || !Number.isFinite(Date.parse(held.deadlineAt)) || Date.parse(held.deadlineAt) <= Date.now()) throw new ShowcaseRefusal("AUTHORITY", "Unadmitted transport capability");
  held.used = true;
}
// A live authority mint is deliberately absent in this release: containment is
// BLOCKED_UNESTABLISHED. A future independently approved release must replace
// this refusal, not promote a caller flag or an old study grant.
export function requireNativeShowcaseAuthority(): never { throw new ShowcaseRefusal("CONTAINMENT", "CONTAINMENT_UNESTABLISHED"); }
export const newShowcaseEpoch = () => randomUUID();
