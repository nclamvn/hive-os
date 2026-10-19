import { describe, expect, it } from "vitest";

import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { mathCycleEventDigest, mathCycleLimitsSchema, mathCycleSteeringDigest, priorFiniteFindingFromTrace,
  type MathCycleEventPayload } from "@/modules/research-sandbox/math-cycle";
import { validateMathCycleTrace } from "@/modules/research-sandbox/math-cycle-kernel";
import { digestMathPilotContract, resolveMathPilotContract } from "@/modules/research-sandbox/math-pilot";
import { runStructuralCounterexampleReplay, validateStructuralCounterexampleReport } from
  "@/modules/research-sandbox/math-structural-counterexample";
import { runStructuralGateDossier, validateStructuralGateDossier } from
  "@/modules/research-sandbox/math-gate-dossier";
import { sha256 } from "@/modules/research-sandbox/integrity";
import { searchResidualPrime } from "@/modules/research-sandbox/math-certificates";

const root = resolveMathPilotContract({ caseType: "OPEN",
  statement: "For every prime p ≡ 1 (mod 840), does 4/p = 1/x + 1/y + 1/z hold?",
  definitions: "p is prime and x, y, z are strictly positive integers.",
  assumptions: "Exact arithmetic applies.", falsificationCriterion: "A counterexample would refute it.",
  successCriterion: "A proof or checked counterexample is required.",
  exclusions: "Finite evidence is not a universal proof." });

function chain(payloads: MathCycleEventPayload[]) {
  return payloads.reduce<Array<{ sequence: number; round: number; phase: string;
    payload: MathCycleEventPayload; previousDigest: string | null; digest: string }>>((events, payload) => {
    const previousDigest = events.at(-1)?.digest ?? null;
    events.push({ sequence: events.length + 1, round: payload.round, phase: payload.phase,
      payload, previousDigest, digest: mathCycleEventDigest(previousDigest, payload) });
    return events;
  }, []);
}

describe("in-cycle structural counterexample replay", () => {
  it("retains a bounded seven-call observed-token threshold", () => {
    expect(mathCycleLimitsSchema.parse({ maxRounds: 1, maxObservedTokens: 200_000 }).maxObservedTokens).toBe(200_000);
    expect(mathCycleLimitsSchema.safeParse({ maxRounds: 1, maxObservedTokens: 200_001 }).success).toBe(false);
  });
  it("replays a bounded A=11 exclusion independently before review", async () => {
    const candidate = { prime: 131_041, failedThroughA: 11 };
    const report = await runStructuralCounterexampleReplay(candidate);
    expect(report).toMatchObject({ status: "PASS", candidate,
      a3Square: true, a3NoPrime2Mod3: true, a7NoDivisor5Mod7: true,
      rows: [{ a: 3, admissiblePairs: 0 }, { a: 7, admissiblePairs: 0 }, { a: 11, admissiblePairs: 0 }] });
    expect(validateStructuralCounterexampleReport(candidate, report)).toBe(true);
    const attempted: MathCycleEventPayload = { phase: "ATTEMPTED", round: 1, contract: root,
      attempt: { providerName: "codex-local", modelName: "gpt-6-sol", threadId: "solver-1",
        attemptType: "COUNTEREXAMPLE_ATTEMPT", argument: "The A=11 lemma fails at p=131041.",
        candidateCounterexample: "p=131041", erdosStrausGateCounterexample: candidate,
        selfChecks: [], limitations: ["This does not refute the unrestricted conjecture."],
        usage: { inputTokens: 10, cachedInputTokens: 0, outputTokens: 10, reasoningOutputTokens: 0 } } };
    const replayed: MathCycleEventPayload = { phase: "COUNTEREXAMPLE_REPLAY", round: 1, candidate, report };
    expect(validateMathCycleTrace(chain([attempted, replayed]))?.at(-1)?.phase).toBe("COUNTEREXAMPLE_REPLAY");
    const falsifiedRows = report.rows.map((row) => row.a === 11 ? { ...row, admissiblePairs: 1 } : row);
    const forgedBody = { ...report, rows: falsifiedRows };
    const { reportDigest: _discarded, ...body } = forgedBody;
    expect(_discarded).toBe(report.reportDigest);
    const forgedReport = { ...forgedBody, reportDigest: sha256(canonicalJson(body)) };
    expect(validateStructuralCounterexampleReport(candidate, forgedReport)).toBe(false);
    expect(validateMathCycleTrace(chain([attempted, { ...replayed,
      report: forgedReport,
    }]))).toBeNull();
    const reviewed: MathCycleEventPayload = { phase: "REVIEWED", round: 1, role: "CRITIC",
      report: { role: "CRITIC", verdict: "INCONCLUSIVE", candidateConclusion: "PARTIAL",
        exactQuote: "The A=11 lemma fails", reasoning: "The stated implication still needs a scope check.",
        checks: ["Check the exact premises."], unresolvedGap: "The premise and conclusion need separate review.",
        threadId: "critic-1", usage: { inputTokens: 10, cachedInputTokens: 0,
          outputTokens: 10, reasoningOutputTokens: 0 } } };
    expect(validateMathCycleTrace(chain([attempted, reviewed]))).toBeNull();
    expect(validateMathCycleTrace(chain([attempted, replayed, reviewed]))?.at(-1)?.phase).toBe("REVIEWED");
    const withModel: MathCycleEventPayload = { ...reviewed, reviewerModel: {
      role: "CRITIC", providerName: "codex-local", identityEvidence: "REQUESTED_CLI_MODEL",
      requestedModelName: "gpt-6-astra", threadId: "critic-1",
    } };
    expect(validateMathCycleTrace(chain([attempted, replayed, withModel]))?.at(-1))
      .toMatchObject({ reviewerModel: { requestedModelName: "gpt-6-astra" } });
    expect(validateMathCycleTrace(chain([attempted, replayed, { ...withModel,
      reviewerModel: { ...withModel.reviewerModel!, threadId: "forged-thread" },
    }]))).toBeNull();
    expect(priorFiniteFindingFromTrace({ cycleId: "11735863-a80f-496e-b4b9-592d5ebed830",
      sourceLedgerDigest: "a".repeat(64), trace: [attempted, replayed, reviewed] }))
      .toMatchObject({ prime: 131_041, failedThroughA: 11, firstSuccessA: null,
        replayDigest: report.reportDigest, structuralFacts: { a3Square: true,
          a3NoPrime2Mod3: true, a7NoDivisor5Mod7: true } });
    const steering = { method: "HUMAN_STEERED_TWO_GATE_V1" as const,
      focus: "STRUCTURAL_LEMMA" as const, targetA: 23, note: "Replay the earlier failure first.",
      replayCandidate: candidate, approvedByUserId: "owner-1", approvedAt: "2026-09-29T00:00:00.000Z",
      rootContractDigest: digestMathPilotContract(root) };
    const seed: MathCycleEventPayload = { phase: "PRIOR_COUNTEREXAMPLE_REPLAY", round: 1, candidate, report };
    const steered: MathCycleEventPayload = { phase: "HUMAN_STEERED", round: 1,
      steering, steeringDigest: mathCycleSteeringDigest(steering) };
    expect(validateMathCycleTrace(chain([steered, seed]))?.at(-1)?.phase).toBe("PRIOR_COUNTEREXAMPLE_REPLAY");
    expect(validateMathCycleTrace(chain([seed]))).toBeNull();
    expect(priorFiniteFindingFromTrace({ cycleId: "11735863-a80f-496e-b4b9-592d5ebed830",
      sourceLedgerDigest: "b".repeat(64), trace: [seed] }))
      .toMatchObject({ prime: 131_041, failedThroughA: 11, structuralFacts: { a3Square: true } });
  });

  it("rejects a model candidate when its stated A gate actually has a witness", async () => {
    const candidate = { prime: 131_041, failedThroughA: 23 };
    const report = await runStructuralCounterexampleReplay(candidate);
    expect(report.status).toBe("FAIL");
    expect(report.mismatches).toContain("Candidate is not a residual prime or a declared A gate admits a witness");
    expect(validateStructuralCounterexampleReport(candidate, report)).toBe(true);
    expect((await runStructuralCounterexampleReplay({ prime: 10_050_601, failedThroughA: 11 })).status).toBe("FAIL");
  });

  it("seals the complete failed gate chain and exact target witness before planning", async () => {
    const candidate = { prime: 131_041, failedThroughA: 11 };
    const report = await runStructuralCounterexampleReplay(candidate);
    const dossier = await runStructuralGateDossier(candidate, 23);
    expect(dossier).not.toBeNull();
    expect(dossier).toMatchObject({ targetA: 23, firstSuccessA: 23,
      rows: [{ a: 3, admissiblePairs: 0 }, { a: 7, admissiblePairs: 0 },
        { a: 11, admissiblePairs: 0 }, { a: 15, admissiblePairs: 0 },
        { a: 19, admissiblePairs: 0 }],
      witness: { n: "131041", x: "32766" } });
    expect(validateStructuralGateDossier(dossier!)).toBe(true);
    expect(validateStructuralGateDossier({ ...dossier!, rows: dossier!.rows.map((row) =>
      row.a === 19 ? { ...row, admissiblePairs: 1 } : row) })).toBe(false);
    const steering = { method: "HUMAN_STEERED_TWO_GATE_V1" as const,
      focus: "STRUCTURAL_LEMMA" as const, targetA: 23, note: "Full gate chain",
      replayCandidate: candidate, approvedByUserId: "owner-1", approvedAt: "2026-09-29T00:00:00.000Z",
      rootContractDigest: digestMathPilotContract(root) };
    const steered: MathCycleEventPayload = { phase: "HUMAN_STEERED", round: 1,
      steering, steeringDigest: mathCycleSteeringDigest(steering) };
    const seed: MathCycleEventPayload = { phase: "PRIOR_COUNTEREXAMPLE_REPLAY", round: 1, candidate, report };
    const gate: MathCycleEventPayload = { phase: "PRIOR_GATE_DOSSIER", round: 1, dossier: dossier! };
    expect(validateMathCycleTrace(chain([steered, seed, gate]))?.at(-1)?.phase).toBe("PRIOR_GATE_DOSSIER");
    expect(validateMathCycleTrace(chain([steered, gate, seed]))).toBeNull();
    expect(validateMathCycleTrace(chain([steered, seed, { ...gate,
      dossier: { ...dossier!, firstSuccessA: 19 } }]))).toBeNull();
  });

  it("rejects the prior x15/x19 divisor conditional at an independently replayed prime", async () => {
    const prime = 4_037_881;
    const report = await runStructuralCounterexampleReplay({ prime, failedThroughA: 23 });
    expect(report.status).toBe("PASS");
    expect(report.rows.map((row) => row.admissiblePairs)).toEqual([0, 0, 0, 0, 0, 0]);
    const x15 = (prime + 15) / 4;
    const x19 = (prime + 19) / 4;
    expect(x15 % 739).toBe(0);
    expect(739 % 23).toBe(3);
    expect(x19 % 1_355).toBe(0);
    expect(1_355 % 23).toBe(21);
    expect(x19 % 23).not.toBe(0);
    expect(searchResidualPrime(prime, 27).firstA).toBe(27);
    expect(await runStructuralGateDossier({ prime, failedThroughA: 19 }, 23)).toBeNull();
  });
});
