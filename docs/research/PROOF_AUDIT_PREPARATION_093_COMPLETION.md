# TIP-093 — proof-audit preparation completion

Date: 2026-10-10, Asia/Ho_Chi_Minh. Authorized scope: preparation only.
Start01:00:52UTC; frozen-byte hashes computed01:14:19UTC, within40min envelope.
Status: P1–P4 COMPLETE at local-reference level. Mathematical A/B NOT_RUN.

## Delivered

- Input: `artifacts/research/tip093/reviewer-input.json`, eight self-contained
  dossiers with only id/target/proof. Each future arm receives one case alone.
- Key: `artifacts/research/tip093/gold.json`, four valid and four invalid
  submitted arguments. PA-01 has a true target but an invalid supplied proof.
  Exact references distinguish repair of a true goal from refutation of a false
  goal. No unresolved reference label admitted.
- Rules: `docs/research/PROOF_AUDIT_CALIBRATION_093.md`, common first prompt and
  strong self-checking baseline, conditional critic only, equal proposed resource
  allocations, failure retention and prospective scoring/stop criteria.
- Replay: `artifacts/research/tip093/verify.py`, a small standard-library tool,
  not a semantic grader or universal/formal theorem prover.
- Freeze: `artifacts/research/tip093/preparation.sha256`, four identified files.
  Hashes identify bytes, not mathematical correctness or confidentiality.

## Main mathematical review

Main inspected the full reviewer texts, full reference arguments and full replay
implementation. The coding Builder did not run an independent mathematical
review, benchmark arm or capability test. These are curator judgments, not an
external expert's certification.

| Case | Submitted proof / target | Admissible reference closure |
| --- | --- | --- |
| PA-01 | Invalid / true | Largest count does not imply largest shaded mass; disjoint unit-set witness. Same-goal repair chooses by mass. |
| PA-02 | Valid / true | Choose gamma after epsilon, use Q(gamma) at epsilon/2; exact ratio gives loss at most3epsilon/4 on unchanged admissible data. |
| PA-03 | Invalid / false | Half global mass need not preserve the maximizing interval. Explicit permitted multiset gives CF32 versus4, violating required16. |
| PA-04 | Valid / true | Fixed original thresholds and first-removal charges lose at most3/8 of mass, independent of deletion order. |
| PA-05 | Valid / true | Conditional rational inequality6569/102400<1/4. No geometric premise inferred. |
| PA-06 | Invalid / false | Induction gamma_n=2^-n gives no finite arrival. Samples alone cannot prove this all-n fact. |
| PA-07 | Invalid / false | Admissible parameters yield L=3203/2000>1/4; smaller delta_0 does not change L. |
| PA-08 | Valid / true | Mass-heavy class, subset upper-density bound, equal-volume rescaling and cancellation of N_j^p. No pruning needed. |

For PA-01, finite positive union volume follows from positive total shade mass
and containment in finitely many finite-volume sets. For PA-08 the positive
finite density follows from containment in K and the positive member volume;
real powers including p=0 are legitimate. PA-04 uses original counts, not a
moving threshold. PA-02 allows eta/delta_0 to depend on chosen gamma and needs
no uniformity in gamma. These details are part of the written justification,
not conclusions inferred from the fixtures.

## Actual validation

Main ran in the current checkout, with installed Python and no bytecode output:

    python3 -I -S -B -c 'from pathlib import Path; p=Path("artifacts/research/tip093/verify.py"); compile(p.read_text(), str(p), "exec"); print("SYNTAX_PASS")'
    python3 -I -S -B artifacts/research/tip093/verify.py
    python3 -I -S -B artifacts/research/tip093/verify.py --self-test

All exit0: syntax PASS; eight specific replay checks PASS; six negative controls
PASS with zero failures/errors. These are not16 independent mathematical tests
or duplicated additional evidence when Builder repeats the same commands.

The six controls reject a wrong verdict count, balanced label swap, changed
shade witness, changed interval density, mismatched gold ID and an input verdict
field. The replay derives the PA-03 density suprema by all561/496 endpoint pairs
of the fixed actual interval families, not by echoing the expected constants.
It checks PA-04 only on one weighted fixture/order, PA-06 only on65 terms and
PA-08 only on a p=1 coefficient fixture. Their universal written arguments remain
separate. See `docs/verification/TIP-093_REPLAY_BUILDER.md` for implementation
and CLI-refusal evidence. Main also ran
`shasum -a 256 -c artifacts/research/tip093/preparation.sha256`: exit0, all four
files OK. Tracking-document `git diff --check` exited0. Completion checkpoint
recorded01:18:20UTC, within the original preparation envelope.

## Honest limitations / decision

This is a small constructed structural calibration from visible prior motifs,
not blind FrontierMath, an externally validated benchmark, a random sample of
research mistakes, a new mathematical result or full Kakeya verification.
Some mistakes are conspicuous and writing can give cues. Cases share motifs;
independence, difficulty and generalization are not established. The curator
knows every answer. File separation is not access control; the verifier itself
contains answers and must NOT be a tool supplied to either mathematical arm.

No model superiority is measured. Human review effort is UNKNOWN. Proposed
48-request/90min A/B ceilings are not active authorization. Later dispatch needs
direct routing and any required precise payload consent. If both arms solve all
controls, report a ceiling/tie and stop, not replace cases to manufacture a win.

Scope stayed small: data, rules and one replay, no new product/runtime/gate,
UI, database/account/auth change, mathematical solver/critic, paid API, build,
install, Git or deployment. One skill-mandated coding Builder implemented the
replay; it was not a mathematical benchmark participant. Existing dirty work
and all predecessor evidence remain untouched outside the appended tracking.
No scratch copies, distDirs, dependencies or Docker images created; nothing
removed. STOP preparation here, no automatic A/B or research campaign.
