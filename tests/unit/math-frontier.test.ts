import { describe, expect, it } from "vitest";

import { buildFrontierDossier, frontierGate, verifyFrontierDossier } from "@/modules/research-sandbox/math-frontier";
import { resolveMathPilotContract } from "@/modules/research-sandbox/math-pilot";
import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { sha256 } from "@/modules/research-sandbox/integrity";
import { mathCycleEventDigest } from "@/modules/research-sandbox/math-cycle";
import { validateMathCycleTrace } from "@/modules/research-sandbox/math-cycle-kernel";

const erdos = resolveMathPilotContract({ caseType: "OPEN",
  statement: "For every integer n >= 2, do there exist positive integers x, y, z such that 4/n = 1/x + 1/y + 1/z?",
  definitions: "n is an integer at least 2. x, y, z are strictly positive integers.",
  assumptions: "Ordinary integer and rational arithmetic applies.",
  falsificationCriterion: "A proven counterexample would refute the conjecture.",
  successCriterion: "A complete proof or a checked counterexample is required.",
  exclusions: "Finite examples are not a general proof." });
const successfulFetch: typeof fetch = async () => new Response(JSON.stringify({ message: { items: [
  { DOI: "10.1000/example", title: ["A related paper"], published: { "date-parts": [[2021]] } },
] } }), { status: 200, headers: { "content-type": "application/json" } });
const assessment = { sourceIds: ["erdos-straus-n-2-mod-3"], relevance: "RELEVANT" as const,
  quantifiers: "MATCH" as const, overlap: "NOT_SHOWN_IN_CAPTURED_SOURCES" as const,
  explanation: "The captured known class does not cover the proposed residual class." };

describe("math frontier dossier and novelty gate", () => {
  it("retains exact source spans and a digest while treating Crossref as discovery only", async () => {
    const dossier = await buildFrontierDossier(erdos, successfulFetch);
    expect(verifyFrontierDossier(dossier)).toBe(true);
    expect(dossier.sources).toHaveLength(3);
    expect(dossier.sources[0]?.content.slice(dossier.sources[0].startOffset, dossier.sources[0].endOffset))
      .toBe(dossier.sources[0]?.exactQuote);
    expect(dossier.discovery).toMatchObject({ status: "COMPLETE", candidates: [{ doi: "10.1000/example" }] });
    expect(dossier.discovery.candidates[0]?.canonicalUri).toContain("doi.org");
    expect(verifyFrontierDossier({ ...dossier, sources: [{ ...dossier.sources[0]!, content: "forged" }] })).toBe(false);
    expect(verifyFrontierDossier({ ...dossier, dossierDigest: "0".repeat(64) })).toBe(false);
    const corrupted = { ...dossier, sources: [{ ...dossier.sources[0]!, content: "forged" }] };
    const payload = { phase: "FRONTIER_DOSSIER" as const, round: 1, dossier: corrupted };
    expect(validateMathCycleTrace([{ sequence: 1, round: 1, phase: payload.phase, payload,
      previousDigest: null, digest: mathCycleEventDigest(null, payload) }])).toBeNull();
  });

  it("rejects a known class and never labels an unsolved residue novel", async () => {
    const dossier = await buildFrontierDossier(erdos, successfulFetch);
    expect(frontierGate({ root: erdos, task: "Prove every n≡5 (mod 12) has a decomposition", dossier }))
      .toMatchObject({ decision: "KNOWN" });
    const missingSourceContent = { coverage: dossier.coverage, sources: dossier.sources.slice(1), discovery: dossier.discovery };
    expect(frontierGate({ root: erdos, task: "Prove every n≡5 (mod 12) has a decomposition",
      dossier: { ...missingSourceContent, dossierDigest: sha256(canonicalJson(missingSourceContent)) } }))
      .toMatchObject({ decision: "HOLD" });
    expect(frontierGate({ root: erdos, task: "Investigate n≡1 (mod 24)", dossier,
      analyst: assessment, challenger: assessment })).toMatchObject({ decision: "RESEARCH_ONLY" });
    expect(frontierGate({ root: erdos, task: "Investigate n≡1 (mod 24)", dossier,
      analyst: { ...assessment, quantifiers: "NARROWER" },
      challenger: { ...assessment, quantifiers: "NARROWER" } })).toMatchObject({ decision: "RESEARCH_ONLY" });
    expect(frontierGate({ root: erdos, task: "Investigate n≡1 (mod 24)", dossier,
      analyst: assessment, challenger: { ...assessment, quantifiers: "UNCERTAIN" } }))
      .toMatchObject({ decision: "HOLD" });
    expect(frontierGate({ root: erdos, task: "Investigate n≡1 (mod 24)", dossier,
      analyst: assessment, challenger: { ...assessment, sourceIds: ["invented"] } }))
      .toMatchObject({ decision: "HOLD" });
    expect(frontierGate({ root: erdos, task: "Investigate n≡1 (mod 24)", dossier: {
      ...dossier, sources: [], dossierDigest: dossier.dossierDigest }, analyst: assessment, challenger: assessment }))
      .toMatchObject({ decision: "HOLD" });
  });

  it("holds on missing discovery, network failure, oversized or malformed responses", async () => {
    const generic = resolveMathPilotContract({ caseType: "OPEN",
      statement: "Does every admissible finite object satisfy property P?",
      definitions: "Admissible means a finite object satisfying axiom A.",
      assumptions: "Classical logic and finite combinatorics apply.",
      falsificationCriterion: "One admissible object without P refutes the statement.",
      successCriterion: "A general proof or checked counterexample is required.",
      exclusions: "Finite samples alone cannot establish the universal claim." });
    const noPrimary = await buildFrontierDossier(generic, successfulFetch);
    expect(noPrimary.sources).toEqual([]);
    expect(frontierGate({ root: generic, task: "Investigate objects of size at most four", dossier: noPrimary,
      analyst: assessment, challenger: assessment })).toMatchObject({ decision: "HOLD" });
    for (const fetcher of [
      (async () => { throw new Error("network unavailable"); }) as typeof fetch,
      (async () => new Response("x".repeat(256_001))) as typeof fetch,
      (async () => new Response("not JSON")) as typeof fetch,
    ]) {
      const dossier = await buildFrontierDossier(erdos, fetcher);
      expect(dossier.discovery.status).toBe("UNAVAILABLE");
      expect(frontierGate({ root: erdos, task: "Investigate n≡1 (mod 24)", dossier,
        analyst: assessment, challenger: assessment })).toMatchObject({ decision: "HOLD" });
    }
  });
});
