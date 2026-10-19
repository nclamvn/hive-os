# TIP-086 — public FrontierMath method comparison

2026-10-09 · FRONTIERMATH_PUBLIC_METHOD_COMPARISON_086 · METHOD_EVALUATION.
Direct Owner routing: “tốt chuyển qua đo lợi thế phương pháp theo đề xuất với
nguồn frontiermath”. Supersedes the closed UI target for this bounded evaluation,
not the old unaccepted p139/R3 charters. Predecessor TIP-085 SHA256:
`c06ac45c2974d6b80d395045e5ab9350bd94dd9dd31c43a32fa7f78602fe49b1`.

## One output and frozen cases

One small public comparative pilot, all outcomes retained. Source:
https://epoch.ai/frontiermath/tiers-1-4/benchmark-problems#tier-2 .
Cases frozen before solver dispatch, in this order:

1. PERM: recursively transform a distinct-letter word by F(LmR)=F(L)F(R)m,
   m its maximum. For a uniform permutation on n=10^12 letters, determine the
   floor of the expected inverse descents of the transformed permutation.
2. POLY: construct an odd monic real degree-19 polynomial, linear term -19,
   whose equality curve in P1×P1 has at least three complex irreducible
   components not all linear, and evaluate it at 19.
3. PADIC: a0=0,a1=1,a2=2,a3=3, and
   an=198130309625 a(n-1)+354973292077 a(n-2)
      -427761277677 a(n-3)+370639957 a(n-4).
   The source describes integer values for all integer indices. Determine the
   least prime p≡4 (mod7) allowing a continuous extension to Zp. Scrutinize the
   statement as written; if a premise fails, disclose it rather than silently
   replacing the problem. A conditional interpretation must be explicitly named.

Main already saw published answers/solutions and earlier PERM/POLY checks.
Fresh solver contexts receive only these paraphrased statements and equal common
instructions; no repository history, checker, official solution or answer given.
Training exposure cannot be excluded. NOT blind, novel or official FrontierMath.

## Arms and resource envelope

A: direct solve → self-check → finalize, same fresh context, three requests.
B: fresh solve → separate-context critique → original solver repair/finalize,
three requests total. Reviewer gets B draft and the same statements, not A or
official answers. Same inherited model/settings, no override or model-selection
claim. No claim of different-model independence. No judging feedback before freeze.

Each request asks ≤2400 words; same limit for both arms. Each arm gets ≤3 optional
read-only Python stdlib computations total, ≤60s each/≤180s aggregate; no web,
repo reads/writes, external math packages, paid API or recursive delegation.
These are instruction-enforced restrictions, not a hostile-code sandbox.
Ten active wall minutes per arm, ≤35min overall including shared assessment;
deadline 08:02:00 UTC (15:02 Asia/Saigon). Tools/results in chat retained.
Equal allocated requests/tool/time caps, NOT token-matched: actual reasoning
token usage and backend model identity are unavailable. Real timing and observed
tool use reported separately. Stop on cap/essential feasibility issue, do not
replace a failed problem or spend residual budgets on another target.

## Frozen assessment before any answer

Shared assessor gets anonymized final submissions, statements and rubric, without
arm identities/intermediate drafts or source answers. Main sees sources and
performs mathematical review plus exact arithmetic outside the solver contexts.
Existing developer checks reused where relevant; finite tests never certify a
universal argument. No new checker framework or source-grant mechanism.

Each case has four dimensions, 0 absent/wrong, 1 partial, 2 supported:
- R: requested output with required qualifiers (including malformed-premise
  diagnosis if applicable); matching a known answer alone is at most R=1.
- P: complete relevant argument: all-n PERM structure/count; POLY actual
  nonlinear irreducible components/projective interpretation (no unnecessary
  uniqueness requirement); PADIC continuity and exclusion of smaller relevant
  primes, mode cancellations/exceptional primes and negative indices accounted.
- V: reproducible arithmetic or exact certificate where used, not model votes
  or unqualified floating-point output; written exact derivations are admissible.
- S: faithful problem/scope, actual tools/exposure disclosed, essential gaps
  explicitly admitted rather than hidden. No novelty/formal/official-score claim.

Primary outcomes per case: SUPPORTED_AS_STATED, SUPPORTED_CONDITIONAL_INTERPRETATION,
INCOMPLETE, INCORRECT, or STATEMENT_DEFECT_IDENTIFIED. Rubric scores descriptive,
not a substitute for proof. No overall superiority threshold manufactured after
results; with three exposed cases and one run, general advantage remains
NOT_ESTABLISHED even if B wins locally. Critic discovery/repair recorded verbatim.

## Acceptance and stop

E1 fixed source/statements/rubric/envelope before dispatch.
E2 all A/B requests and actual outcomes retained, protocol deviations explicit.
E3 shared non-own mathematical assessment + Main exact verification scoped.
E4 paired table including failures, resource observability and inconclusive ties.
E5 single completion with truthful product boundary: Codex-assisted method
pilot, not authenticated HIVE application agent-loop acceptance.

No new product code/UI/build/install/infrastructure, database/session effects,
Git mutation, protected old artifacts, R3 restart or campaign. Keep existing
LRC UI/server. Contractor uses Vibecode minimally: this TIP + one completion;
ordinary mathematical work delegated, no blueprint/report stack. Stop at result.
