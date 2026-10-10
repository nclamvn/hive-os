# Completion report — TIP-093 replay Builder

STATUS: DONE for delegated P4 replay implementation only. Main owns mathematical
reference review, scoring protocol and final corpus freeze. No independent
mathematical referee or benchmark arm was run.

## Files changed

- Created `artifacts/research/tip093/verify.py`: standard-library fixed finite and
  rational replay with six in-file negative controls; no default file writes.
- Created this report. Input/gold, product code, UI, auth, config, tracking docs,
  existing attempts and predecessor evidence were not edited by this Builder.

## Executed validation

All commands ran in `/Users/os/hiveos` using installed `python3`; no install,
build, API, Codex CLI, mathematical agent/model solving or model scoring.

1. `python3 -B -c 'from pathlib import Path; p = Path("artifacts/research/tip093/verify.py"); compile(p.read_text(), str(p), "exec"); print("SYNTAX_PASS")'`
   — exit0, `SYNTAX_PASS`; ordinary Python syntax executed without pycache writes.
2. `python3 -B artifacts/research/tip093/verify.py`
   — exit0, JSON `PASS`, eight case-specific replay checks.
3. `python3 -B artifacts/research/tip093/verify.py --self-test`
   — exit0, six distinct negative unittest controls PASS, zero failures/errors.
   Repeated after final shape-check adjustment, exit0, stdout1329 bytes,
   stderr0 bytes (subprocess measured); repeats are not additional test cases.
4. `python3 -B artifacts/research/tip093/verify.py --unknown`
   — expected exit1; failure evidence: `{"status":"REFUSED","error":"usage: verify.py [--self-test]"}`.

No unexpected implementation/test failure occurred. Six controls reject changed
verdict count, balanced label swap, mutated shade data, mutated interval density,
gold ID mismatch and input verdict leakage. CLI usage refusal is a separate
interface check, not a seventh mathematical/control test.

## Actual replay results

Dataset checks require exactly eight ordered distinct IDs, only `id,target,proof`
fields in reviewer input, matched gold IDs, 4VALID/4INVALID_PROOF, and the invalid
PA-01 proof with TRUE target. Per-case expected verdict/truth checks also reject
a balanced label swap. Written argument/scope fields must be present. This is
schema/reference consistency, not semantic proof adjudication or confidentiality.

| Case | Freshly derived finite/rational evidence |
| --- | --- |
| PA-01 | Fixed unit-set shade witness: total107/100, selected mass7/100<107/200, selected density1/100<107/1600. All stored witness fields compared. |
| PA-02 | Affine exponent coefficient differences -3 and -1/2; epsilon-normalized loss ceiling3/4 and slack1/4. |
| PA-03 | Construct m16 family from h1/64; enumerate561 G and496 H endpoint pairs. D(G)=16,D(H)=1, CF(G)=32,CF(H)=4; retained mass exactly1/2, required CF(H)=16. All stored constants compared. |
| PA-04 | One fixed five-edge weighted fixture/order: original42/5, retained8, first-removal charges1/5,1/10,1/10;6 deletions. Fixed thresholds, retention, stopping and charge conservation checked. |
| PA-05 | Exact bound6569/102400<1/4; four-times ratio6569/25600. Stored certificate compared. |
| PA-06 | First65 exact halving values from1 through1/18446744073709551616; recurrence and positivity checked. Stored witness premises compared. CORROBORATION ONLY. |
| PA-07 | Every rational premise met; H=2001/10000,L=3203/2000>1/4. All stored witness constants compared. |
| PA-08 | Fixed p1 coefficient fixture N8,Nj1,CFtotal2,CFj8; cardinality-rescaled upper16 cancels to CFtotal*N16. |

PA-03 endpoint enumeration is exhaustive for the actual fixed labeled interval
multisets: any nonempty contained subfamily has a tight endpoint hull, and
shrinking a test interval to that hull cannot reduce counted density. It is not
a finite approximation to a three-dimensional tube theorem.

## Limits / deviations / suggestions

Universal labels belong to complete written reference arguments, not this
script. PA-04 checks one fixture/order, not all weighted graphs/orders; PA-06's
written induction owns the all-finite-n refutation; PA-08 does not check arbitrary
real p or universal measurable-family geometry. Arithmetic does not certify
geometric loss hypotheses, a formal/Lean proof, full Kakeya, novelty, model
capability or method advantage. No confidence-based grading was used.

No scope deviation or unresolved replay mismatch. Frozen-content hashes and
actual review of all reference proofs remain Main's responsibility. No scratch
copies, dependencies, build folders or Docker images created; nothing removed.
STOP after this delegated preparation. No A/B or model execution authority added.
