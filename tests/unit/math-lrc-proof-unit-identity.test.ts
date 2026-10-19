import { describe, expect, it, vi } from "vitest";
import { importLrcProofUnitIdentity } from "@/modules/research-sandbox/math-lrc-proof-unit-identity";
import { MATH_LRC_CAMPAIGN_CONTRACT, digestMathPilotContract } from "@/modules/research-sandbox/math-pilot";
import { createLrcCampaignReferenceEvidence, digestLrcCampaignEvidence } from "@/modules/research-sandbox/math-lrc-campaign";
const evidence = () => createLrcCampaignReferenceEvidence(digestMathPilotContract(MATH_LRC_CAMPAIGN_CONTRACT),
  MATH_LRC_CAMPAIGN_CONTRACT.lrcCampaignScope, "2026-10-04T00:00:00.000Z");
describe("TIP064 identity-only bounded import (injected, no file IO)", () => {
  it("reuses exact oldv2 identity scope/root without retaining root/evidence or fresh semantics", async () => {
    const read = vi.fn(async () => evidence());
    const admission = await importLrcProofUnitIdentity({ readReference: read });
    expect(read).toHaveBeenCalledWith(MATH_LRC_CAMPAIGN_CONTRACT.lrcCampaignScope,
      digestMathPilotContract(MATH_LRC_CAMPAIGN_CONTRACT), { permission: true }, 10_000);
    expect(admission).toMatchObject({ filesVerified: 42, bytesVerified: 53_211_840,
      mode: "RETAINED_IDENTITY_ONLY_NOT_FRESH", semanticReplayExecuted: false, externalAttestation: false });
    expect(admission).not.toHaveProperty("rootContractDigest"); expect(admission).not.toHaveProperty("evidenceDigest");
    expect(Object.isFrozen(admission)).toBe(true);
  });
  it.each([0, -1, 10_001, 0.5, Number.NaN, null])("invalid/expanded deadline %s refuses before import", async availableMs => {
    const read = vi.fn(async () => evidence());
    await expect(importLrcProofUnitIdentity({ readReference: read, availableMs: availableMs as number })).rejects.toThrow("cap refused");
    expect(read).not.toHaveBeenCalled();
  });
  it.each(["manifestDigest", "files", "rootContractDigest"])("even rehashed %s mutation refuses", async key => {
    const raw = JSON.parse(JSON.stringify(evidence())); raw[key] = key === "files" ? [] : "f".repeat(64);
    const { evidenceDigest: ignored, ...body } = raw; void ignored;
    raw.evidenceDigest = digestLrcCampaignEvidence(body);
    await expect(importLrcProofUnitIdentity({ readReference: async () => raw })).rejects.toThrow();
  });
  it("changed byte admission and failed importer cannot be promoted", async () => {
    const raw = JSON.parse(JSON.stringify(evidence())); raw.admission.bytesVerified--;
    await expect(importLrcProofUnitIdentity({ readReference: async () => raw })).rejects.toThrow();
    await expect(importLrcProofUnitIdentity({ readReference: async () => { throw new Error("identity drift"); } })).rejects.toThrow("identity drift");
  });
  it("expired cooperative deadline refuses returned identity", async () => {
    vi.spyOn(performance, "now").mockReturnValueOnce(0).mockReturnValueOnce(100);
    try { await expect(importLrcProofUnitIdentity({ availableMs: 100, readReference: async () => evidence() })).rejects.toThrow("deadline exhausted"); }
    finally { vi.restoreAllMocks(); }
  });
});
