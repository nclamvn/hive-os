import { describe, expect, it, vi } from "vitest";
import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { sha256 } from "@/modules/research-sandbox/integrity";
import { resolveMathPilotContract, digestMathPilotContract } from "@/modules/research-sandbox/math-pilot";
import { buildResearchMethodPacket, admitResearchMethodPacket, verifyResearchMethodPacketIntegrity } from "@/modules/research-sandbox/math-method-map";
import { normalizePublicationIdentity, observeSourceStatus, verifySourceStatusObservation } from "@/modules/research-sandbox/math-source-status";
import { fetchFixedPublicationStatus, STATUS_MAX_BYTES, STATUS_TIMEOUT_MS } from "@/modules/research-sandbox/adapters/math-source-status-fetch";

const now = new Date("2026-10-01T04:00:00.000Z");
const dossier = "a".repeat(64);
const root = resolveMathPilotContract({ caseType: "OPEN", statement: "For every integer n >= 2, prove 4/n = 1/x + 1/y + 1/z for positive integers x,y,z.",
  definitions: "All variables are positive integers; n is at least two.", assumptions: "Exact rational arithmetic is used.",
  successCriterion: "A universal proof or valid counterexample is needed.", falsificationCriterion: "An exactly verified counterexample refutes the claim.",
  exclusions: "Finite positive examples are not a universal proof." });
const rootDigest = digestMathPilotContract(root);
function page(id: string, version: number, withdrawal = false) {
  return `<html><head><title>[${id}] Current publication</title></head><body>
    ${withdrawal ? "<div class='withdrawal'>This paper has been withdrawn by its author</div>" : ""}
    <h1><span>Title:</span> A mathematical record</h1><table><tr><td>Subjects:</td><td>math.NT</td></tr>
    <tr><td>Cite as:</td><td>arXiv:${id}v${version}</td></tr></table>
    <h2>Submission history</h2>${Array.from({ length: version }, (_, index) => `<div>[v${index + 1}] Thu, 1 Oct 2026 00:00:00 UTC (12 KB)</div>`).join("")}
    <h2>Full-text links:</h2></body></html>`;
}
const loader = async (id: "1107.1010" | "1406.6307" | "2609.09204") => ({ body: page(id, id === "1107.1010" ? 6 : id === "2609.09204" ? 2 : 1, id === "2609.09204") });
function rehash(packet: Awaited<ReturnType<typeof buildResearchMethodPacket>>) {
  const { packetDigest: _digest, ...body } = packet;
  void _digest;
  return { ...body, packetDigest: sha256(canonicalJson(body)) };
}

describe("root-bound literature method packet", () => {
  it("captures a partial fixed corpus without converting publication status into proof", async () => {
    const packet = await buildResearchMethodPacket(root, dossier, { now, statusLoader: loader });
    expect(verifyResearchMethodPacketIntegrity(packet, rootDigest, dossier)).toBe(true);
    expect(admitResearchMethodPacket(packet, rootDigest, dossier, now)).toBe(true);
    expect(packet.sources.map((source) => source.status)).toEqual(["ACTIVE", "ACTIVE", "WITHDRAWN"]);
    expect(packet.methods).toHaveLength(6);
    expect(packet.methods.every((method) => method.premiseAuthority === false)).toBe(true);
    expect(packet.methods[0]?.applicability).toBe("HISTORICAL_OR_UNAVAILABLE_BACKGROUND");
    expect(packet.methods.at(-1)?.applicability).toBe("QUARANTINED_LEAD");
    expect(packet.methods[4]?.evidenceCeiling).toBe("UNVERIFIED_LEAD_NOT_PREMISE");
    expect(packet.methods.some((method) => method.toolNeeds.some((tool) => tool.status === "MISSING"))).toBe(true);
  });

  it("rejects digest mutations, root/dossier rebinding, and rehashed catalog promotions", async () => {
    const packet = await buildResearchMethodPacket(root, dossier, { now, statusLoader: loader });
    expect(verifyResearchMethodPacketIntegrity(packet, "b".repeat(64), dossier)).toBe(false);
    expect(verifyResearchMethodPacketIntegrity(packet, rootDigest, "c".repeat(64))).toBe(false);
    expect(verifyResearchMethodPacketIntegrity({ ...packet, packetDigest: "0".repeat(64) }, rootDigest, dossier)).toBe(false);
    const promoted = structuredClone(packet);
    promoted.methods[5]!.knownResults = "This withdrawn paper proves the conjecture.";
    const { methodContentDigest: _content, ...content } = promoted.methods[5]!;
    void _content;
    promoted.methods[5]!.methodContentDigest = sha256(canonicalJson(content));
    expect(verifyResearchMethodPacketIntegrity(rehash(promoted), rootDigest, dossier)).toBe(false);
    const healthy = structuredClone(packet);
    healthy.sources[2] = observeSourceStatus({ publicationId: "2609.09204", body: page("2609.09204", 1), observedAt: now.toISOString(), evaluatedAt: now.toISOString() });
    expect(healthy.sources[2].status).toBe("WITHDRAWN");
    healthy.sources[2].status = "ACTIVE";
    const { observationDigest: _observation, ...observation } = healthy.sources[2];
    void _observation;
    healthy.sources[2].observationDigest = sha256(canonicalJson(observation));
    expect(verifyResearchMethodPacketIntegrity(rehash(healthy), rootDigest, dossier)).toBe(false);
  });

  it("records failed collection and preserves known withdrawal without fabricating a current check", async () => {
    const packet = await buildResearchMethodPacket(root, dossier, { now, statusLoader: async () => { throw new Error("offline"); } });
    expect(packet.sources.map((source) => source.status)).toEqual(["UNAVAILABLE", "UNAVAILABLE", "WITHDRAWN"]);
    expect(packet.sources.every((source) => source.provenance === "UNAVAILABLE_NO_CURRENT_OBSERVATION")).toBe(true);
    expect(admitResearchMethodPacket(packet, rootDigest, dossier, now)).toBe(true);
    expect(packet.methods.every((method) => method.applicability !== "CURRENT_BACKGROUND")).toBe(true);
  });

  it("keeps historical integrity but rejects stale/future dispatch, including a future withdrawn observation", async () => {
    const packet = await buildResearchMethodPacket(root, dossier, { now, statusLoader: loader });
    expect(verifyResearchMethodPacketIntegrity(packet, rootDigest, dossier)).toBe(true);
    expect(admitResearchMethodPacket(packet, rootDigest, dossier, new Date(now.getTime() + 86_400_001))).toBe(false);
    expect(admitResearchMethodPacket(packet, rootDigest, dossier, new Date(now.getTime() - 1))).toBe(false);
    const stale = await buildResearchMethodPacket(root, dossier, { now, statusLoader: async (id) => ({ ...(await loader(id)), observedAt: new Date(now.getTime() - 86_400_001).toISOString() }) });
    expect(stale.sources[0]?.status).toBe("STALE");
    expect(stale.methods[1]?.applicability).toBe("HISTORICAL_OR_UNAVAILABLE_BACKGROUND");
    const future = await buildResearchMethodPacket(root, dossier, { now, statusLoader: async (id) => ({ ...(await loader(id)), observedAt: new Date(now.getTime() + 1).toISOString() }) });
    expect(future.sources[2]?.status).toBe("WITHDRAWN");
    expect(future.sources[2]?.freshness).toBe("FUTURE");
    expect(verifyResearchMethodPacketIntegrity(future, rootDigest, dossier)).toBe(true);
    expect(admitResearchMethodPacket(future, rootDigest, dossier, now)).toBe(false);
  });
});

describe("publication health boundaries", () => {
  it("normalizes all registered older/newer aliases for publication-wide quarantine, not fetching", () => {
    for (const alias of ["2609.09204", "arXiv:2609.09204v1", "https://arxiv.org/abs/2609.09204v2",
      "https://arxiv.org/html/2609.09204v1", "https://arxiv.org/pdf/2609.09204v1.pdf",
      "https://doi.org/10.48550/arXiv.2609.09204", "10.48550/arXiv.2609.09204",
      "http://arxiv.org/abs/2609.09204v1", "https://dx.doi.org/10.48550/arXiv.2609.09204",
      "https://doi.org/10.48550%2FarXiv.2609.09204", "https://arxiv.org/html/%32609.09204v1",
      "http://export.arxiv.org/pdf/2609.09204v1.pdf"]) expect(normalizePublicationIdentity(alias)).toBe("2609.09204");
    for (const alias of ["https://arxiv.org.evil.test/abs/2609.09204", "https://user@arxiv.org/abs/2609.09204", "https://arxiv.org:999/abs/2609.09204", "http://arxiv.org:444/abs/2609.09204", "https://arxiv.org/html/%zz2609.09204", "https://doi.org/10.48550%252FarXiv.2609.09204", "https://dx.doi.org.evil.test/10.48550/arXiv.2609.09204", "file:///2609.09204", "2609.09204v1evil"]) expect(normalizePublicationIdentity(alias)).toBeNull();
  });

  it("distinguishes selected superseded versions, malformed pages and unrelated withdrawal words", () => {
    const observe = (body: string, selectedVersion = 6) => observeSourceStatus({ publicationId: "1107.1010", body, selectedVersion, observedAt: now.toISOString(), evaluatedAt: now.toISOString() });
    expect(observe(page("1107.1010", 6), 2).status).toBe("SUPERSEDED");
    expect(observe(page("1107.1010", 6), 7).status).toBe("UNAVAILABLE");
    expect(observe("arXiv:1107.1010v6 hello").status).toBe("UNAVAILABLE");
    expect(observe(page("1406.6307", 1)).status).toBe("UNAVAILABLE");
    expect(observe(page("1107.1010", 6).replace("A mathematical record", "A discussion of withdrawn conjectures")).status).toBe("ACTIVE");
    expect(observe(page("1107.1010", 6, true)).status).toBe("WITHDRAWN");
    expect(observe(page("1107.1010", 6).replace("arXiv:1107.1010v6", "arXiv:1107.1010v5")).status).toBe("UNAVAILABLE");
    expect(observe(page("1107.1010", 6).replace("[v6]", "[v6] withdrawn [v6]")).status).toBe("UNAVAILABLE");
    const capture = observe(page("1107.1010", 6));
    expect(verifySourceStatusObservation(capture)).toBe(true);
    expect(verifySourceStatusObservation({ ...capture, contentDigest: "f".repeat(64) })).toBe(false);
  });
});

describe("fixed primary status fetcher", () => {
  it("fetches only exact server-owned HTTPS abstract URLs with redirect refusal", async () => {
    const fetcher = vi.fn(async () => new Response(page("1406.6307", 1), { headers: { "content-type": "text/html; charset=utf-8" } }));
    expect((await fetchFixedPublicationStatus("1406.6307", fetcher)).body).toContain("1406.6307");
    expect(fetcher).toHaveBeenCalledWith("https://arxiv.org/abs/1406.6307", expect.objectContaining({ redirect: "error", signal: expect.any(AbortSignal) }));
    await expect(fetchFixedPublicationStatus("https://127.0.0.1" as "1406.6307", fetcher)).rejects.toThrow("PUBLICATION_NOT_ALLOWLISTED");
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("rejects HTTP, redirects/final-host escape, unsupported media and oversized streaming bodies", async () => {
    for (const response of [new Response("failure", { status: 500 }), new Response("redirect", { status: 302, headers: { location: "http://127.0.0.1" } }),
      new Response("{}", { headers: { "content-type": "application/json" } }), new Response("x", { headers: { "content-type": "text/html", "content-length": String(STATUS_MAX_BYTES + 1) } }),
      new Response(new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array(STATUS_MAX_BYTES)); controller.enqueue(new Uint8Array(1)); controller.close(); } }), { headers: { "content-type": "text/html" } })]) {
      await expect(fetchFixedPublicationStatus("1406.6307", async () => response)).rejects.toThrow();
    }
    const redirected = new Response("x", { headers: { "content-type": "text/html" } });
    Object.defineProperty(redirected, "url", { value: "https://evil.test/abs/1406.6307" });
    await expect(fetchFixedPublicationStatus("1406.6307", async () => redirected)).rejects.toThrow("STATUS_HTTP_BOUNDARY");
  });

  it("enforces an absolute timeout even while a body stalls and cancels the reader", async () => {
    vi.useFakeTimers();
    const cancel = vi.fn();
    try {
      const response = new Response(new ReadableStream({ cancel }), { headers: { "content-type": "text/html" } });
      const pending = fetchFixedPublicationStatus("1406.6307", async () => response);
      const assertion = expect(pending).rejects.toThrow("STATUS_TIMEOUT");
      await vi.advanceTimersByTimeAsync(STATUS_TIMEOUT_MS + 1);
      await assertion;
      expect(cancel).toHaveBeenCalled();
    } finally { vi.useRealTimers(); }
  });
});
