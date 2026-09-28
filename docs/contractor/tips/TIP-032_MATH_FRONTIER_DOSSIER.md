# TIP-032: Knowledge-frontier dossier and source gate

## HEADER

- TIP-ID: TIP-032
- Project: HIVE OS local Math Pilot
- Module: Research Sandbox / controlled mathematics cycle
- Depends on: TIP-030 and TIP-031
- Priority: P0 for honest autonomous research

## CONTEXT

The first live Erdős–Straus cycle spent four Codex calls on `n ≡ 5 (mod 12)`, a known class. TIP-031 added a small deterministic prior-art catalog, but model memory and a partial catalog do not establish literature novelty. The existing cycle, worker, append-only event chain and authenticated Math Pilot dossier are reused. The working tree already contains ongoing local product work and is not reset or pushed.

## TASK

Insert a source-and-scope decision before a controlled round dispatches its solver. Retain an inspectable source dossier and two distinct-context assessments. Keep experimental progress separate from claims of novel mathematics.

## SPECIFICATIONS

1. A problem-scoped, versioned primary-passage corpus captures canonical URI, author, title, year, exact retained excerpt, offsets, SHA-256 digest and explicit source scope. The initial corpus is restricted to three Erdős–Straus congruence facts. It is a digest of the **retained normalized passage**, not a digest of the full publisher page or proof of its present online state.
2. Crossref `/works` performs bounded bibliographic discovery (five records, seven-second deadline, 256 KiB response limit, fixed host). A hit is a lead only: not a theorem statement, primary-source snapshot, proof, or novelty certificate. Network failure is represented as `UNAVAILABLE`, never as an empty proof of novelty. The query contains the mathematical statement; this local pilot must not be used for confidential problems without an external-discovery policy.
3. A fresh SOURCE_ANALYST and SOURCE_CHALLENGER session review captured passages, relevance, quantifiers and known-result overlap. Both receive explicit instructions to treat source text as untrusted. Distinct session identity, model usage and the exact dossier digest are retained.
4. The deterministic gate returns `KNOWN`, `HOLD`, or `RESEARCH_ONLY`. A known congruence is blocked before solver; corrupt or absent sources, unavailable discovery and agent disagreement hold. `RESEARCH_ONLY` permits bounded exploration but never asserts novelty or theorem acceptance.
5. New rounds reserve at most seven model calls: planner, two source agents, task verifier, solver, critic and adversary. The existing observed-token/deadline checks remain between calls; they are not hard USD controls. Old five-call cycles and their immutable events remain readable.
6. The Math Pilot dossier exposes sources, passages, digests, discovery status, both source assessments, and gate decision. Historical rounds without this gate are labeled accordingly.

## ACCEPTANCE CRITERIA

| ID | Given / when | Then |
| --- | --- | --- |
| AC-01 | A task targets `n ≡ 5 (mod 12)` | It is `KNOWN` from the retained `n ≡ 2 (mod 3)` source and no solver runs. |
| AC-02 | A task targets `n ≡ 1 (mod 24)` | It is never labeled novel; with valid sources, discovery and two matching assessments, only `RESEARCH_ONLY` is possible. |
| AC-03 | Source content, quote offset or dossier digest is corrupt | The gate holds, and the trace does not accept the corrupt dossier. |
| AC-04 | A primary passage is missing, discovery fails or source agents disagree | The gate is `HOLD`; no solver dispatch. |
| AC-05 | A normal bounded round is accepted | The event chain retains source dossier, two assessments, gate, task verification, attempt and reviews under the seven-call ceiling. |
| AC-06 | A pre-TIP-032 cycle is read | Its historical chain remains unchanged and readable, with no fabricated frontier result. |

## CONSTRAINTS

- Local-only; no paid provider API, billing change, Git push, PR or deployment.
- No claim of complete literature coverage or independent proof certification.
- No automatic retry after an ambiguous Codex call.
- Full-text scholarly retrieval, source-version refresh, broader mathematics corpora and proof-kernel checking are follow-on work, not silently implied by this bounded TIP.

## COMPLETION REPORT — TIP-032

**STATUS:** DONE for the bounded local implementation; live fresh-round certification is deferred.

**FILES CHANGED:** Created `math-frontier.ts`, its unit tests, this TIP, the local DB constraint migration and a Verify Report. Modified cycle schema/kernel/adapter/worker, Math Pilot page, integration test, readiness command, runbook, handoff and current manifest.

**TEST RESULTS:** 6/6 bounded acceptance criteria pass. Full unit 234/234 and integration 176/176; typecheck/lint pass; local migration/readiness and authenticated UI inspection pass. Production build and fresh live seven-call round were not run; see the Verify Report.

**ISSUES DISCOVERED:** The existing first live cycle's task was already known, and the initial literature corpus covers only a small number of Erdős–Straus results. Crossref metadata cannot close that coverage gap. No mathematical novelty or proof acceptance is claimed.

**DEVIATIONS FROM SPEC:** No general primary full-text crawler is claimed. Crossref metadata can identify leads but cannot authorize a mathematical novelty claim. Source passage corpus remains problem-specific until a separately tested primary-source intake is available.

**SUGGESTIONS FOR CHỦ THẦU:** Next, build licensed/allowlisted primary full-text retrieval with fresh version capture and a source-to-formal-statement mapping, then run a new root case through a complete real seven-call round and separately verify executable proof obligations.
