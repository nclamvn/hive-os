# Known-answer mathematics benchmark — IMO 1988 Q6

## Result

An authenticated browser submission on the local Mathematics Pilot workspace produced a complete Vieta-jumping/descent proof of the stated theorem. The two fresh, role-separated AI reviews both supported the proof and reported no unresolved gap. A separate step-by-step audit below found no invalid inference. This is evidence that the local solver/reviewer workflow can handle this **one known, difficult Olympiad theorem**; it is not evidence of new mathematical discovery or a general proof-checking capability.

The product did **not** pass a first-class benchmark acceptance gate. Its only configurable case type is `OPEN`, so this known-answer exercise was stored as `OPEN` despite the sealed assumption saying explicitly that it is a benchmark. Consequently the generic oracle recorded `PARTIAL` and the UI displayed “Open mathematics has no known-answer oracle.” That classification is a product limitation, not a defect in this particular proof.

## Reproducible local trace

- Workspace: `mathematics-pilot-lab-156de0`; mission: `31943653-4a30-462a-af11-ecd99f9ebfa2`.
- Case: `35c0037e-d5da-4cf0-9372-46957b4f61cd`; research run: `14db417b-db5d-4a27-abb2-ceee6fde9fa4`.
- Sealed contract SHA-256: `5da72f53c952abda07d44670154343a8248e5bd0b2f6a107fd438845d50864f0`.
- Model: local subscription-backed `codex-local / gpt-6-sol`; no paid API key was supplied to the worker. The reference proof and source identity were withheld from the solver and both reviewing roles.
- Model-authored attempt SHA-256: `4695c6e82b353bb2b3e8ebfe0ca270430f31715cf1fff5acbe6ac82becd61076`; attempt type `PROOF_ATTEMPT`; recorded solver usage 15,930 input / 1,300 output Codex-session tokens.
- Review ledger SHA-256: `54bd1b89e737103a5e097cf0a2d85fc25cda68c0e57f6ec94c9f610476dd86cf`; `CRITIC` and `ADVERSARY` both `SUPPORTS`, both candidate conclusion `SUPPORTED_ARGUMENT`, both unresolved gap `null`. The ledger disposition is `AI_REVIEWED`, but its generic `OPEN` conclusion is `PARTIAL`.
- Browser evidence: [review screenshot](../../artifacts/math-pilot-imo1988q6-review-2026-09-29.png). The retained run remains `AWAITING_REVIEW` in the separate human lane; do not call it human-approved.

## Independent audit of the retained argument

Suppose a positive-integer solution with nonsquare positive quotient $k$ exists. Select one minimizing $a+b$, and by symmetry put $a\le b$. As a positive nonsquare integer, $k\ge2$. Define $c=ka-b\in\mathbb Z$. From $a^2+b^2=k(ab+1)$, one gets $bc=a^2-k$.

If $c=0$, then $k=a^2$, contrary to the choice of $k$. If $c<0$, integrality gives $b=ka-c\ge ka+1>k$, but $b(-c)=k-a^2<k$; since $-c\ge1$, this is impossible. Hence $c>0$.

The integer polynomial $P(t)=t^2-kat+a^2-k$ has roots $b,c$, and $P(a)=(2-k)a^2-k<0$. Since $a\le b$, the factorization $P(a)=(a-b)(a-c)<0$ forces $c<a<b$. The identity $P(c)=0$ gives $a^2+c^2=k(ac+1)$. Thus $(a,c)$ is another positive-integer solution with the same nonsquare $k$ and smaller sum, a contradiction. Every admissible quotient is therefore a square. The proof explicitly covers integrality, positivity, strict descent and the nonsquare boundary; it does not rely on finite sampling.

An independent finite sanity check enumerated all $1\le a,b\le500$: 21 admissible ordered pairs, no nonsquare quotient. This check is **not** a proof. After the model attempt was retained, the theorem was compared to the independently formalized statement in [mathlib](https://leanprover-community.github.io/mathlib4_docs/Archive/Imo/Imo1988Q6.html); the [official IMO 1988 problem page](https://www.imo-official.org/problems/1988/) confirms the source. Mathlib formalizes the theorem, not this exact generated proof text; this comparison is not a formal replay of the model's steps.

## Method finding and next gate

This trial confirms browser intake, sealed contract, queued local execution, persisted attempt, separate AI-role reviews and a visible audit trail. The two review roles use fresh contexts of the **same model family**, so their agreement is not independent-model or human verification. The solver adapter still contains Erdős–Straus-specific optional output fields and instructions even for an unrelated theorem. The generic frontier/cycle apparatus is tailored to the prior open problem and is not a suitable continuation mechanism for this solved benchmark.

The subsequent implementation adds a distinct `BENCHMARK_PROOF` lane with a review-only holdout reference, a theorem-specific rubric, and fail-closed classification for challenged or mismatched attempts. Do not change this historical `OPEN` ledger in place or relabel its `PARTIAL` disposition retrospectively. A new benchmark run must create a new sealed case and compare false-accept as well as true-accept behavior. Independent executable replay of the generated proof, or formal proof checking, is still an open gate; do not infer it from the known reference theorem.

Implementation verification on 2026-09-29: 268 unit tests, 176 integration tests, typecheck and production build passed. The authenticated local browser renders the new benchmark section; dispatch remains disabled in that server process, so **no new browser-submitted benchmark case is claimed**. An opt-in `scripts/operations/math-pilot-benchmark-negative-control.ts` fed a deliberately invalid finite-enumeration argument to the two local subscription-backed reviewer contexts. Both returned `CHALLENGES` and identified the missing general reduction; this one false-accept control passed. It is not a proof of a low false-accept rate across other flawed arguments.
