# TIP108C producer: correctness and bounded-effort qualification

Status: initial implementation/controls PASS; whole attempt NOT RUN and NOT
released. This is bounded-effort qualification, not a guaranteed theorem cost
or a claim that 32768 nodes suffice. R1 and global K6 remain OPEN.

## Coverage and core proof

The 34 retained necessary masks have sizes10/14/10. Every minimum-offset member
choice in each group is present: 10*8+14*9+10*8=286 charts. Tied minima may appear
in more than one chart; none are omitted. Gauge minL=0 and write minR=q. The four
nonanchor offsets are nonnegative coordinates, in label order after q. For an
actual configuration, q=maxL+d<=18/31+57/31=75/31 (the3+3 bound is smaller), and
every internal offset lies in[0,18/31]. Thus the closed outer boxes contain the
whole remaining domain without a symmetry or critical-label assumption.

S=maxu+maxv and d=q-maxu. Domain rejection uses only all-box bounds: lower S
above18/31, upper S at most18/61, upper d at most1, or lower d at least the retained
far-tail threshold. The last three are exclusions from the stated remaining
domain, not numerical replays of predecessor theorems. An unrejected empty box
may cost extra effort; it cannot create unsound acceptance. For accepted boxes,
S_upper=min(18/31,maxupperu+maxupperv) bounds every admissible point in the box.

For each actual point the common shift -q/2 preserves area. Interval arithmetic
gives shifted p_j in[lo_j,hi_j]. The core
[hi_j+j*y,lo_j+1+(j-1)*y], when nonempty, is inside every actual slice. Empty or
inverted intervals are removed at each event; their own width-zero event is
included, so no discontinuity is missed. Core union area is a lower bound.

Coordinate triples are integers over31*2^e. Let m=max e, den=31*2^m and H=2den.
All shifted p bounds have integer numerators P/H. At T=60H*y and W=60H*x the
endpoint laws have integer intercepts divisible by60 and slopes0..6. Every
crossing/death has integer T because each nonzero slope gap divides60. All66
endpoint pairs plus the two height boundaries give at most68 cuts. Between
cuts the core union length is affine and continuous, including interval deaths.
The producer trapezoid numerator divided by7200H^2 is therefore exact.

Acceptance uses the strict integer comparison

    core_numerator > 7200H*(H+S_upper_in_den_units).

It is exactly G_core>1+S_upper/2, hence D=2G-(2+S)>0 on every admissible point
of the box. An independent verifier uses its own midpoint-affine integration.
The producer does not import or read that implementation.

Every split is an exact dyadic midpoint of one coordinate, and both closed
children are retained. Their union is the parent; shared boundaries are harmless.
Every root is seeded before processing. The global queue is breadth-first, not
a walk through one chosen signature. Preorder chars0..4 are split axes, P is a
strict-positive core leaf, X an all-box domain exclusion, O an OPEN leaf. There
must be exactly one whole tree for each of the286 canonical roots and no missing
children/trailing subtrees. O makes the certificate INCOMPLETE_MUST_REFUSE.

## Bounded effort, state and output

The one conditional attempt has at most32768 processed nodes, tree depth48,
30s producer process cap and a29s computation stop reserving time for encoding.
All failures/stops are charged; no resume is implemented. Created nodes are at
most286+2*processed nodes on incomplete output. On COMPLETE output every created
node is processed and every tree symbol counts toward the32768 processed cap.

At depth48, H<=62*2^48. Endpoint integers are roughly64-bit and area products
roughly128-bit; Python exact integers suffice. Pending boxes contain only five
coordinate triples; processed boxes are dropped. A peak-RSS guard at124MiB stops
before the128MiB ceiling and leaves O frontier symbols intact. The compact trees
have at most65822 symbols under the node cap, plus286 small root records and
summary metadata. The directory cap is checked before writing16MiB; output is
create-only and restricted to this artifact directory.

The initial profile executed128 fixed arithmetic-only cells at path depth48
(coordinate exponents32+4*4) and promoted common precision48. There were37 event
cuts in each cell. Core time total0.012873495s, mean0.000100574s and
max0.000144292s. Multiplying that sampled maximum by32768 yields about4.73s;
allowing the68/37 event-count ratio suggests about8.7s for the core arithmetic.
This is a sensitivity estimate, not a worst-case runtime bound or a full leaf
count. Scaling boxes, queue/state accounting and serialization also consume time.
The hard effort limits protect the reserved allowance regardless of completion.
The independently authored checker still needs its own controls/profile and
reserved replay capacity before Main releases any whole attempt.

## Initial executed checks and ledger

1. `python3 -B artifacts/research/tip108c/core_producer.py controls --out
   artifacts/research/tip108c/BUILDER_PRODUCER_CONTROLS.json`: PASS. Internal
   elapsed0.019844958s; conservative charge1s of producer75s. The128-cell profile
   is inside this invocation, not an extra call. Both old independently authored
   exact area algorithms agree with the constant-core integration at the known
   diagnostic. Core death area1/8, wide empty area0, two toy positive leaves,
   missing-root/child/trailing/symbol negatives and286 OPEN frontier controls PASS.
   The known point is an arithmetic control only, not new scientific evidence.

2. Ordinary source syntax check using Python AST over shell stdin: PASS.
   Conservative charge1s of producer75s including process startup. No bytecode
   or compiled artifacts were created. This is developer validation, not a
   mathematical proof or another core profile.

Initial producer total conservative charge2s; zero failed mathematical runs,
no full producer attempt, no installs/compiles/builds/infrastructure. Main and
the checker own separate ledgers. Source reads, metadata and apply_patch edits
are not mathematical subprocesses.

Frozen initial source SHA256:
ed549d7f9b7f9da7a4fb5cd953a9de39a344faa19e7f9b37f26c7a4fce63e2d6.
Saved producer-controls SHA256:
8e99deaa4fde40b00def0852e810444e4129384ee093e8e66b51f1fa18c83d03.
Retained TIP098 exact helper unchanged SHA256:
26c3b41b3bb731d67247ef1033e94ba4e0dbb0b58aa662858bafe0603596cf55.

## Tiếng Việt

Đã kiểm đúng cấu trúc286 biểu đồ, lõi lát cắt hữu tỉ và giới hạn công sức của
một lần thử bị chặn. Đây không phải lời hứa chứng minh xong trong32768 nút.
Các phép kiểm ban đầu đạt, nhưng CHƯA chạy lần thử toàn miền. Cây thiếu bất kỳ
gốc/con nào hoặc còn ký hiệu O phải bị từ chối; không được tiếp tục cây chưa
hoàn chỉnh. Main chỉ cho chạy sau khi bộ kiểm độc lập đạt và giữ đủ ngân sách
kiểm lại. R1 và K6 toàn cục vẫn mở. Không đổi nguồn cũ hay thêm hạ tầng.

## Main exact-limit admission revision (before any whole attempt)

Main chose131072 processed nodes instead of the charter's TENTATIVE32768.
This changes only MAX_NODES and the resulting declared node limit; the30s
producer process cap, computation-time reserve, depth48,128MiB state and16MiB
artifact ceilings are unchanged. It avoids an unnecessarily early node stop
near the initial profile's few-second32768 estimate while retaining the hard
time/memory guards. It is neither a promise of completion nor an increase of
the120s aggregate/60min wall/target envelope.

All initial controls and source-hash history above are preserved. No repeated
producer controls/profile is requested for this constant-only revision; an
ordinary syntax check follows. COMPLETE still requires all286 roots and every
descendant checked, with encoded/created/processed counts equal and<=131072.
INCOMPLETE created nodes are<=286+2*processed<=262430 and all O frontier symbols
must be retained. The independent checker was directly notified to update its
own declared cap validation. This is not permission to produce yet; Main's
separate whole-attempt release remains required.

Revised ordinary AST syntax check: PASS, conservative charge1s (producer
initial/admission total now3s of75s). No new mathematical controls/profile.
Revised source SHA256:
eaeae641a11be368d5f0548b98351e27017ed7163231f9e5f434ca2a4850b3ff.
