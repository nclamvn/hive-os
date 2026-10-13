# COMPLETION REPORT — TIP116 continuation, 2026-10-12

**STATUS: PARTIAL — committed all-real K6 lower bound NOT CLOSED.**

## Kết luận / Vietnamese result

Đợt tiếp tục đã khép bằng chứng minh tay và phản biện riêng các lớp cực
tiểu ứng viên tự nhiên có cực đại thời điểm đóng khe ở vị trí trong
2, 3 hoặc 4. Các trường hợp hòa được xét trực tiếp, không suy ra bằng
giới hạn của trường hợp nghiêm ngặt. Đây là tiến triển về rút gọn cấu
trúc, **chưa phải chứng minh K6 toàn cục**.

Trong miền cực tiểu ứng viên thứ tự tự nhiên, khe dương, với các điều
kiện cần đã giữ từ các bước trước, các tập vị trí cực đại còn mở chính
xác là `{1}`, `{5}`, `{1,5}`. Ngoài miền này, cả 12 miền đảo thứ tự và
các mặt liên quan vẫn chưa được khép. Các tiền đề rút gọn cực tiểu,
biên và đạt cực tiểu phải được nối rõ vào một chứng minh toàn định lý;
đợt này không thay việc kiểm toàn chuỗi bằng kiểm các lớp phía trong.

Đích vẫn là mô hình hữu hạn sáu tam giác tịnh tiến:

    ALL real translations: F6 >= 20/93; G = 6 F6 >= 40/31.

Không phải giải giả thuyết Kakeya tổng quát, không phải chứng nhận một
kết quả mới trong tài liệu. Chứng chỉ cấu hình đạt cận trên cũ giữ nguyên.

## 1. Exact scope / model

Direct owner routing: “triển khai khép K6 triệt để”. Same R116-1..3;
no new TIP family, target, runtime grant or infrastructure. Hand-only
envelope started 01:10:02 UTC, hardstop 02:10:02 UTC, mathematical
subprocess grant zero. Frozen predecessor proofs and report are unchanged.

Scaled slice representation:

    p_j = 6 x_j, p_6 = 0, A_j = p_j + j,
    I_j(t) = [A_j-jt, A_j-(j-1)t], 0 <= t <= 1.

For natural apex order, `D_i=A_(i+1)-A_i>0`, `delta_i=1-D_i`.
Actual closure times, side envelopes, exposure flows and both complete
bottom hulls remain in the equations:

    D_i = 2 T_i + C_i,
    1 = alpha_i + beta_i + T_i + M_i,
    C_i = sum_j F_ij, M_j = sum_i F_ij, sum_i T_i = r.

`alpha` is the nonnegative decreasing isotonic projection of delta;
`beta` is its nonnegative increasing projection. Actual hull prefix/suffix
polars, pooled blocks and zero blocks are retained. At a retained actual
competing minimum, `2G=1+r`, `79/61<=r<=49/31`, and the existing bottom
and full-stationarity filters apply. These are necessary conditions for
actual minima, not constraints imposed on arbitrary translations.

Sharp anchor: `D_*=(25,11,34,11,25)/31`, `r_*=49/31`, `G_*=40/31`.
Previously accepted central calibration and nearest-even calibration
remain dependencies, not rewritten proofs.

## 2. Reviewed mathematical gain

All statements below are about the retained **actual competing minimum**
domain, not pointwise area bounds for arbitrary natural arrays.

| Global maximum set of T | Reviewed disposition |
| --- | --- |
| Any set containing adjacent indices | Excluded by actual hull polars and an exact negative variation; exceptional tight polars force r=5/3 outside the competing range |
| `{3}`, `{1,3}`, `{3,5}`, `{1,3,5}` | Frozen central proof, including its explicit zero-C3 endpoint-tie repair, reread by the critic; G>=40/31 |
| `{2}`, `{4}` | Complete right-subtree classification under strict root2, with reflection4; each class excluded or gives a higher calibrated floor |
| `{2,4}` | Exact nearest-even calibration, G>=22/17>40/31 |
| `{2,5}`, `{1,4}` | Original equal-global-root faces excluded using their actual means, clamps and polars |
| `{1}`, `{5}`, `{1,5}` | OPEN |

For strict global root2, right-subtree maxima have exactly seven possible
nonempty sets: `{3}`, `{4}`, `{5}`, `{3,4}`, `{3,5}`, `{4,5}`,
`{3,4,5}`. The prior unique-subroot4 proof is retained. This continuation
handles the other unique roots and every original tie. Critic §§12–14
check all tie cases and the full natural maximum-set coverage audit.

Farther donor flows were not discarded globally. Root2/right-subroot5
required separate exposure regimes, positive and clipped hull blocks,
coarsened hulls, and zero/active leaf clamps. Some genuine stationary
candidates have `r>49/31`; they are excluded by that necessary range,
not described as local minima without a proof.

Representative exact checks:

- Original right-subtree tie `{4,5}` has one surviving algebraic candidate
  `T=(19,38,14,30,30)/81`, `r=131/81>49/31`; remaining faces contradict
  their source order, positive-block means or actual zero-flow clamps.
- Original triple tie `{3,4,5}` has an active-leaf candidate
  `theta=7/25,tau=14/25,r=41/25>49/31`. A different candidate
  `theta=11/39,tau=24/39` fails its zero clamp `tau<=12/39`.
  The zero-alpha face uses no positive-alpha mean and has `r=7/3`.

Proof locations: Builder continuation §§2–14; Main continuation §§2–9;
Critic continuation §§8–14. The latter records acceptance, not just a
request for review. Main §10 supersedes the earlier pending-review labels.

## 3. Exact remaining closure obligations

### Natural endpoint roots

Derive a whole-class actual area lower bound or exclude all competing
minima with global maximum sets `{1}`, `{5}`, `{1,5}`, including original
ties, positive/zero hull faces and all actual farther donor regimes.

A necessary endpoint estimate was obtained:

    (11/5) T_1 + C_1 <= 1; hence T_1 <= 5/11,

with reflection5. This is **not** the required value estimate. It does
not yet couple all flows/hulls sufficiently to force `G>=40/31`.

### Twelve inverted continua

For a single adjacent inversion with apices `a>b`, freeze the other four
triangles as their entire union O. In co-moving coordinates define
`E=1-1_O`, `L(x)=integral E(x,t)dt`,
`P_+(x)=integral E(x+t,t)dt`, `P_-(x)=integral E(x-t,t)dt`, and
`S=P_++P_--L`. The exact finite swap has the retained correction:

    G_old-G_swap = integral_b^a S(x) dx - R_(a-b),
    0 <= R_u <= 3u^2/4.

An independent whole-class lower bound on this expression under all
actual-global-minimum filters is still missing. Individual placement
maximality gives an upper, not the needed lower, integral estimate.
Connected bottom coverage is by the UNION O, not necessarily a single
bridging triangle. The correction cannot be dropped.

If the two individual coverage-maximizer sets share a suitable common
apex, an exact small joint separation gives a descent. Their intersection
has **not** been proved. This conditional observation does not order all
global minimizers. No inverted continuum is certified by it.

### Whole theorem assembly

Retain and explicitly verify the predecessor minimum-attainment, apex
collision, positive-cut, bottom-component and boundary reductions when
assembling a global theorem. This continuation does not add an unproved
genericity or limiting assumption to bypass any of those steps.

## 4. Corrections preserved; rejected closing shortcuts

The working notes are chronological, not an error-free final manuscript.
The accepted claims use the following explicit replacements:

| Withdrawn step | Repair used |
| --- | --- |
| Main §5.3: positivity of alpha5 treated as a singleton despite coarsening | §5.4 uses the actual pooled alpha2345 mean |
| Main §6.1: positive-leaf equations recycled on zero-leaf face | §6.5 derives the zero face and rejects its failed clamp |
| Main §6.1: incorrect reduced mean `11x-2y=1` | §6.6 derives `13x-4y=2`, then checks the source regime |
| Main §6.4: invalid claimed negative exposure | §6.7 retains the below-target algebraic candidate but rejects it by actual hull polar `N4=207/2523>0` |
| Frozen-O connected bottom asserted to imply a single source bridge | Critic retains union coverage and withdraws the stronger assertion |

A universal nearest-only stationary reduction is false: an exact
farther-flow local minimum has `D=(12,12,30,12,12)/23`, `G=30/23`,
`r=37/23>49/31`. It is NOT a counterexample to the K6 floor; it prevents
discarding farther restorations without the competing-minimum filters.

The unrestricted full-prefix calibration has infeasible anchor flows.
Its nonnegative and nonpositive residual terms cannot be selectively
dropped. Neither that calibration nor the failed pointwise frozen-O
estimate closes the global obligation.

## 5. Verification / acceptance

**Verify: hand derivation and separate AI-agent criticism only.** Main
read the new Builder proofs and checked their actual means, flow regimes,
zero blocks and algebra. The critic independently checked the original
tie cases and reread the frozen central endpoint repair. This is not
Lean/kernel verification, executable replay or external expert review.

- R116-1: NOT CLOSED — the all-real mathematical target remains open.
- R116-2: scoped new proofs challenged and accepted as recorded; whole
  theorem review NOT AVAILABLE because that theorem has not been proved.
- R116-3: continuation ledger, corrections, remaining obligations and
  terminal checkpoint saved.

No finite tests, hashes or fraction of classified cases are closure evidence.
No mathematical subprocess, optimizer, LP, enumeration, sample or replay ran.

## 6. Files / execution ledger / deviations

Created/updated in the existing research workspace:

- CONTINUATION_SCOPE_20261012.md — direct routing and fixed envelope.
- MAIN_GLOBAL_COUPLING_20261012.md — hand proofs and correction ledger.
- BUILDER_REMAINING_NATURAL_20261012.md and BUILDER_COMPLETION_20261012.md.
- CRITIC_REMAINING_CLOSURE_20261012.md and CRITIC_COMPLETION_20261012.md.
- This new report; terminal checkpoint appended to active commitment and handoff.

Predecessor bytes and unrelated dirty work preserved. No application code,
UI, database, auth, API, Git write, build, install, project copy, Docker
operation or new infrastructure. No scratch/distDir created; nothing deleted.
Mathematical calls=0, mathematical seconds=0, failed mathematical starts=0.
Ordinary failed source lookups/patch contexts are recorded in each hand ledger.
No retries of a mathematical process or hidden compute were used.

Metadata checks only: the frozen predecessor report, Builder, Main and
Critic SHA-256 values match the continuation-scope pins. A Main fingerprint
lookup initially used the wrong critic filename; `rg --files` resolved
INDEPENDENT_STRUCTURAL_REVIEW.md before its successful check. Fingerprints
are provenance, not proof. Tracked `git diff --check` passed; a trailing
whitespace scan of all new notes/report returned no matches.

Vibecode Kit kept the work to one proof Builder, one hand critic and Main
review, with a structured partial completion. It did not authorize more
agents, infrastructure or replacement of the all-real mathematical target.

The critic read the entire clean report and accepted its scope wording;
the two editorial corrections requested in that read are applied here.

**Deviation from desired outcome:** the requested global closure was not
achieved. The scope/resource limits were kept; partial structural results
are not relabeled as success. STOP/PARTIAL; no automatic longer campaign,
new TIP, optimizer restart or resource escalation.

## English executive conclusion

K6 is still open. This continuation completes the reviewed classification
of retained natural-order actual competing minima whose closure-time
maximum set contains an interior cut. Original subtree and global ties
were handled explicitly, including zero hull blocks and contact clamps.
The exact natural endpoint sets `{1}`, `{5}`, `{1,5}` and all twelve
inverted continua remain uncertified. The next mathematical obligation is
an actual whole-class value/exclusion proof for those domains, not more
sampling, infrastructure or a narrower substitute milestone.
