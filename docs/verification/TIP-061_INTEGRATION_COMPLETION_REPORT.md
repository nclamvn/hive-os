# TIP-061 Integration Completion Report

STATUS: DONE — owned additive Integration implementation and focused checks.
Main acceptance, independent challenge, full regression and build are separate.
This is phases A/B only, not authorization or evidence of live activation C.

Approved Blueprint SHA256
4fc1ae0955c0bddcf0b5f665fe1da5e9a21a814e507dfe3bee2ed59332e9057d.
Sealed TIP SHA256
94e5bf0ddd576483ffac62f54d07ebdbea34c22726efcc04b199470c32d5efd6.
Read AGENTS, current handoff, full approved Blueprint/TIP, Vibecode Kit and
installed Next environment guide before code. No UI design or rendering edits.

## Requirement coverage

| Requirement | Integration implementation and evidence |
|---|---|
| R1 | Legacy v1 shape and absent optional fields remain unchanged. Old calibration/benchmark/finite-ledger focused tests pass; pure old bytes remain canonical. Historical full regression and 145 old-file baseline audit belong to Main. |
| R2 | Public strict selector accepts only LRC_CAMPAIGN/ALLIKVERE_P83_14_V1, not evidence/code/files. Contract v2 OPEN requires fixed scope, refuses finite field presence; v1 refuses campaign field presence. Binding checks the entire fixed contract, not just a self-consistent digest. |
| R3 | Shared Core facts serializer used verbatim in solver and each reviewer. Actual adapter methods exercised with EventEmitter transport stubs capture identical bytes across three fresh contexts, separate requested model names, no peer-review output sharing and no irrelevant Erdős mandates. |
| R4 | Host-only optional campaign envelope is excluded from model output schema. Worker accepts it only from explicit fixed importer, validates before fence, attaches after provider-field refusal; all provider-authored fields are refused even correctly hashed. |
| R5 | Fixed importer is Core-owned. Integration imports actual fixed42/53211840-byte dependency set in focused tests and binds its output to fixed contract. No claim of fresh semantic tree replay. |
| R6 | Independently canonicalized original and defensive snapshots before/after callbacks; clone graph deeply frozen before dispatch. Input/clone mutation on return or throw refuses. Guarded critic mutation stops adversary and retention. Request/case replacement, context reuse, mixed domain and coherent provider injection tests pass. |
| R7 | Default-OFF local capability in server env and example. Request creation checks before command/DB authority. Worker admits before model fence and rechecks case before retention. Review kernel requires a per-role seam before its fence, checks each role and retention, with existing tenant/lease/accounting mechanics preserved. Static wiring only, no DB worker execution. |
| R8 | Pure oracle/recorded review guards use compact fixed evidence and digests; no importer/Python/full replay/model/job during passive validation. Explicit campaign refusal at Erdős cycle root. No UI import/runtime added. |
| R9 | Exact prospective ledger5 requires four campaign refs, true campaign validity, distinct ordered contexts and per-role model provenance; forbids finite/exact/legacy fields and conclusions other than PARTIAL/INCONCLUSIVE. Read guard refuses downgrade, missing/drifted references, different research/attempt/root digest and mixed evidence. |
| R10 | Quantified tests below separate actual hash import, mocked transports, deterministic stub orchestration and static worker checks. Live/DB/browser categories remain NOT_RUN. |

Contract digest stays
94b678f4bb862c4c46db5f2a754df86fd3a1486fa05c8bc31509aa177c105b1e.
Scope/facts/manifest contents are Core-owned and unchanged. Contract constant
and fixed scope frozen after parsing without any canonical byte change.

## New seams and exact safety boundaries

`math-lrc-campaign-integration.ts`: pure fixed-body binding, explicit local
capability, independent snapshots/deep-frozen cloned views, provider-origin
field refusal and canonical four-field ledger reference.

`math-lrc-campaign-offline.ts`: no-DB deterministic orchestration with explicit
fence, solver, per-role reviewer and minimal retention callbacks. It admits
before fence, binds case/research/attempt identity, checks after every callback,
revalidates ledger via passive read guard before invoking retention. Positive
test returns ledger5 AI_REVIEWED/PARTIAL, never a global supported theorem.

Existing solver adapter now checks campaign statement/scope/first query against
fixed preset before CLI. Existing reviewer bundle refuses campaign bypass;
campaign dispatch requires the individually guarded per-role seam. Solver,
critic and adversary consume the exact same facts block, but different role
instructions and fresh contexts; no independent-model or human identity claim.

Attempt schema keeps optional campaign envelope to preserve all historical
absent-field digests. Contextual campaign admission enforces mutual exclusion
of finite/exact/Erdős fields, including explicitly present undefined/null
fields. All campaign consumers check binding before accepting or reviewing.
Ledger5 policy rejects old fields even when explicitly undefined. Ledger1–4
retain their previously absent fields and historical validation branches.

Worker alreadyComplete campaign branch requires valid attempt digest and fixed
binding; noncampaign branches reject any raw campaign field even when the
attempt otherwise fails schema parsing. Worker loads fixed lineage itself,
never arbitrary saved audit JSON. Public selector is fixed and provider cannot
author envelope. Worker and review retention re-read current case/body/digests.

Deep-freezing prevents temporary mutate-then-restore of the supplied view.
Independent snapshots detect retained/end-state original alias mutation;
they are NOT external transcript attestation or detection of every arbitrary
trusted-adapter closure side effect. A trusted adapter can ignore supplied data;
three stub contexts do not establish model independence or mathematical truth.
The one-prime result is recorded local unsigned admission, not a new execution.
Other60 P13 primes, global14/15, lower independent reproduction, all23
application obligations and formal/external acceptance remain OPEN.

## Tests, types and lint

Final owned two new suites32/32 PASS; last combined new2+old3 run52/52 PASS
1.20s at08:11:43 local2026-10-04. The historical adjacent suites are
math-agent-review, math-pilot and math-lrc-agent-gate (20 old tests). Final whole
`npx tsc --noEmit --pretty false` exits0 after final hardening. Scoped ESLint
all14 edited/new TS files exits0 errors/warnings. Main owns final whole suite,
whole lint/build and frozen manifest acceptance.

Actual positive import: two new test files each call the real fixed importer
once, explicit local permission, checks all42 files and53211840 bytes. This is
streamed identity validation only. No producer/full verifier/Python re-executed.
Timestamp-dependent evidence digest legitimately varies, fixed facts unchanged.

26 integration tests: positive complete stub workflow; missing/wrong-root/fresh/
wrong-scope/wrong-facts admission before zero fence/solver/reviewer/retention;
missing per-role seam; coherent provider injection; four frozen graph mutations;
original alias mutation on throw; critic abort before adversary; case replacement;
context reuse; ledger downgrade/coherent wrong refs/research substitution; mixed
oracle fields; public preset-only; old canonical absence; changed fixed prose;
default-OFF/staging/production; three wrong solver brief variants; bundle bypass;
static pre-fence/retention/cycle and env-example checks.

6 adapter tests: real adapter method calls with ONLY EventEmitter spawn stubs;
identical fact bytes and requested models/context identities; coherent provider
injection refused; OFF/production/missing evidence zero spawn; reviewer absent
and mixed evidence zero spawn. There are no real CLI/model calls in these tests.

Last two hardenings before freeze: fixed contract/scope Object.freeze (same root
digest), worker noncampaign raw campaign-field refusal even on malformed attempt.
Earlier test failures were missing test-only env secret, undefined parameter
default expectation and provider constructor typing; fixed test fixtures and
final tests/types pass, not claimed as product runtime successes.

## Frozen owned files SHA256

| File | SHA256 |
|---|---|
| src/modules/research-sandbox/math-lrc-campaign-integration.ts | 1c4d9b689dd92ee88d21f4c4e100cda0fe489930e6514c05c88ab96406d4ee0f |
| src/modules/research-sandbox/math-lrc-campaign-offline.ts | 506bde5c94c97e8fa8feaece492e4d02481fd3ab7854f9a31852c8c77b95302a |
| src/modules/research-sandbox/contracts.ts | 25a001c2368bf9f0e385abaff9524d3055f4033dc51eab91517630c4b0f27beb |
| src/modules/research-sandbox/math-pilot.ts | ebd2b70043a86057acb8d40446ea7133ef356a20536d883d3697d579ae28b9b8 |
| src/modules/research-sandbox/agent-review.ts | 9b35c9d1bbfc7a09d0dec7fab4d9a4462ce41cb6e7a010aa9d51cc63a9d83fce |
| src/modules/research-sandbox/agent-review-kernel.ts | 9bdffe7b3c14b36640568f06183ffbba4fd3e63d3f870983d872454d090e6252 |
| src/modules/research-sandbox/worker.ts | 7683359b8439cf354fb534de1b5fc404d1b532439faf8152a3e9e00b8691c253 |
| src/modules/research-sandbox/kernel.ts | 93fdce09e6b8be2f367f5fd49d4555b3278456ed08eb8d068eb7c79c725556af |
| src/modules/research-sandbox/math-cycle-kernel.ts | 028335050c1f9469bbe34914571acf83201136a157518ac67b8fcecf70547437 |
| src/modules/research-sandbox/adapters/codex-local-math.ts | 642700023f3ead3cf5a7b83d90c47a464a6bb67fa23005f12e6c9509f6fde4c3 |
| src/modules/research-sandbox/adapters/codex-local-review.ts | ab9f75a89013e2c283992fb1930e4bf823dfaf6bbbbce45d312e8389909207dd |
| src/server/env.ts | f5d6e5258d8bb4628d85397d5682afb95ad18c1cfc5b8950e0925cc340f4e68c |
| tests/unit/math-lrc-campaign-integration.test.ts | fdc0acf9dc778686cda2d9802949013cb1b1ecd6691ccfa6a493fd805b74d15c |
| tests/unit/math-lrc-campaign-adapters.test.ts | 5bae781b1c43df0bf6c061a4ef5f8eb87ea8c29606b13777abe5ed723dc3987c |
| .env.example | 00441a0dc30f986e1a88c157f5afcf32308c320b40a88affc88f4626ee8fda3c |

## Deviations / NOT_RUN / handoff

No architectural expansion. Per-role reviewer seam and deep-freeze are approved
implementation detail strengthening the before-each-role requirement. No old
056–060 source/report/artifact/test/pin edits. No UI/DB/API model/worker/newcase/
migration/server/build/browser/Python/fresh replay/author code/install/billing/
deployment/Git commit/push by Integration. Real three-model E2E, DB transaction
integration, production operation and browser observation NOT_RUN. Main owns
build/server and full regression; phase C needs separate human authorization.

Use this report only alongside CoreCompletion, IndependentReview and MainVerify.
It neither closes global LRC nor certifies the full project as100% complete.
