# Nonlocal degree-four supports — exact path-mask obstruction

Status: FULL independent hand review ACCEPTED actual support-class rejection
and its wider-support limits; NO K6 certificate.
Same all-real G6>=40/31, TIP116 PUBLIC_DISCOVERY.
Activation2026-10-12 23:53:36UTC; hardstop2026-10-13 00:23:36UTC.
All predecessors frozen. Hand mathematics only, mathematical processes0.

## 1. Selected existing-wire architecture

The exact578-variable boundary graph is unchanged. Each ray uses the fixed
nine-comparator network whose first two disjoint comparisons are (0,3)
and (1,4). Completing the source-input permutations can make these compare
specified source pairs, without adding any variable, gate or inequality.
The two first-comparator LOWER min/max outputs are existing wires.

For i<k<j, the lower coverage heights on Rk or Lk from sources i and j
are positive-constant clips of Ak-Ai and Aj-Ak. Their minimum r_ikj is
zero whenever Aj-Ai<0: the two numerators cannot both be positive. This
holds on all ties, using LOWER outputs only, not ambiguous associated
upper routing. The maximum v_ikj is also an existing output.

All ten nonadjacent pairs can receive one such min/max mask by assigning
source slots to the first comparisons as follows:

    R2: (1,3) -> pair13;       L2: (1,4) -> pair14;
    R3: (1,5),(2,4) -> 15,24; L3: (1,6),(2,5) -> 16,25;
    R4: (2,6),(3,5) -> 26,35; L4: (3,6) -> 36;
    R5: (4,6) -> 46.

Pairs listed on the same ray have disjoint source inputs, so they fit
slots(0,3) and(1,4). Remaining inputs may occupy the other slots. This
is a semantics-preserving completion of an input permutation, not a
replacement sorting network or a new lifted architecture.

The specified expanded clip-parent support considered here contains the
five A, five flags, all clips of its OWN source pair (two or three), and
that pair's selected r,v. Quadratic-clip SOS rows remain AFFINE. Free SOS
and equation multiples retain total degree<=4; all other inequalities and
products remain the existing ones. This is a meaningful nonlocal expansion
but not the fully unrestricted support in all578 variables.

## 2. Pair13 negative-tail row normal form survives its new mask

On R2 the selected pair13 lower inputs are

    x=clip(A2-A1), y=clip((A3-A2)/2), r=min(x,y), v=max(x,y).

Suppose a certificate in the selected architecture exists. On the true
graph all equality terms vanish, all other terms are nonnegative, and G<=3;
thus each weighted SOS term is bounded above by53/31.

Write an affine row for a negative-tail generator of pair13 as

    u dot A + beta dot b + d + a dot tau13 + gamma*r + eta*v.

All clip, min and max wires are bounded. On a ray with A3-A1<0 growing
in magnitude, all three true pair13 clips and r are zero. Open-cone
boundedness therefore kills u, exactly as in the preceding recession proof.

Hold Delta1=A2-A1 in any positive finite interval while Delta2=A3-A2
tends to minus infinity, keeping the other three Delta signs fixed. Then
r=0 and v=clip(Delta1) can vary through(0,1), while the bad generator
diverges. The limiting affine row must vanish for every such v, forcing
eta=0. One can equivalently use the other mixed sign case, with positive
Delta2 finite and Delta1 tending to minus infinity.

The residual beta dot b+d vanishes for every negative sign pattern of
Delta1+Delta2. In particular zero and all five unit Boolean vertices
admit such a negative ray. Thus beta=0,d=0. Every negative-tail row has
the normal form

    a dot tau13 + gamma*r.

The added max output cannot change this. No positive-tail normal form is
needed below: the fake pair13 clips will all be zero, so g+ itself is zero.
The proof is unaffected by equation-multiplier degree or support because
those equations vanish on all true graph assignments.

## 3. Exact counter to the selected path-mask certificate class

Take an active cluster of labels1,3,5 and an isolated anchor cluster2,4,6:

    A1=T, A3=T+1/2, A5=T+1,
    A2=A4=A6=0, T=-100.

All clips are assigned their TRUE values except that all THREE pair13
clips are replaced by zero. All flags are true (1,0,1,0,1). All sorting
and union-max wires are evaluated as actual operations on the resulting
height bands, including any ties. Thus every graph equation is zero and
every generator except the modified pair13 clip margins is nonnegative.

For pair13, x=1,y=0, hence r=0,v=1. Section2 makes every weighted negative
margin zero despite its negative unweighted value. Every positive margin
is zero because its own tau=0. This is true for all three pair13 generators.
The remaining free SOS and weighted inequalities are nonnegative; arbitrary
equation multiples vanish pointwise.

The true configuration has G=35/12. Indeed cluster246 has three disjoint
triangles of total area3/2. For cluster135, pair13 and pair35 lens areas
are1/24 each, while pair15 has area1/60. The middle triangle contains the
entire outer-pair lens, so its triple area is also1/60. Its union area is
3/2-1/24-1/24=17/12. No cross-cluster intersection occurs for T=-100.

Suppressing pair13 changes only four covered-boundary rays. Coverage by
source5 leaves the following actually REMOVED portions:

    R1: [1/6,1/5],  L3: [1/6,1/4],
    R3: [1/4,1/2],  L1: [1/3,1/2].

The modified objective minus the true objective is therefore

    integral_[1/6,1/5] R1
    - integral_[1/6,1/4] L3
    + integral_[1/4,1/2] R3
    - integral_[1/3,1/2] L1
    = T/30 + 5/288.

Here R1=T,L3=T+1/2-3t,R3=T+1/2-2t,L1=T-t. Consequently

    G_fake = 35/12 -100/30 +5/288 = -115/288,
    P_fake = -115/288-40/31 = -15085/8928 <0.

Every permitted certificate right-hand term is nonnegative at this
assignment, whereas P_fake<0. This is a contradiction. It rejects the
specified SAMEPAIR-plus-ownpathmin/max architecture with arbitrary
equation multiples; no SDP or coefficient allocation for that class is
warranted. It is NOT a genuine clipped placement or a K6 counterexample.

## 4. Independent check of Main's simpler omission variant

Main independently used A1=T=-32,A3=T+1,A5=T+3/2, with A2=-100,A4=-200,
A6=0. Its selected mask has x=0,y=1, so r=0,v=1. All other clips are true.
The other three sources do not cover any cluster ray.

For t in[1/3,3/8] source5 covers both hidden pair13 endpoints, so suppression
has no effect. For[3/8,1/2] only L3 remains covered by5, so suppression
adds R1=T. For[1/2,1] neither pair endpoint is covered by5, so the added
length is R3-L1=1-t. Thus

    G_fake-G_true = T/8+1/8 = -31/8.

Since G_true<=3, G_fake<=-7/8<40/31. This literal hand check is independent
of the exact true-area calculation in section3 and proves the same scoped
certificate-class rejection. Adjacent true clip margins are used only as
NONNEGATIVE, not falsely asserted zero.

## 5. Wider support is not rejected or certified

Allowing a quadratic-clip multiplier row to contain unrelated coverage
wires or other pair clips invalidates section2's stated row normal form.
No complete full578-support normal form is proved here. In particular an
actual fixed-pair intersection mask may use nonadjacent coverage on another
source ray; a global prefix-union wire must not be silently identified with
the union of that fixed pair.

An early hypothetical first comparison(0,1) was NOT the frozen network;
that assumption is withdrawn. The exact network is retained above. An
associated upper output also cannot substitute for a fixed-pair intersection
on tied lower endpoints: the allowed upper-root routing permits either order.
The selected masks in section1 avoid that problem by using lower min outputs.

No global coefficient identity, wider-support obstruction, SOS completeness,
RIP/convergence or execution feasibility is established. Merely detecting
one earlier false assignment is not counted as a bound. K6 remains OPEN,
with zero new root closure. The current scoped mathematical attempt is
TERMINAL: no broader-support campaign, process or automatic successor is
continued or authorized by this completion.

## 6. Completion and observed times

Builder new mathematical derivation STOP was observed at 2026-10-13
00:03:41UTC, before the unchanged00:23:36 hardstop. Early stop follows
the reviewed specified-class rejection and lack of a complete wider-support
proof, not cap exhaustion. Subsequent work is literal review/recording only.

Builder FULL read of `NONLOCAL_D4_COMPLETION_20261013.md` completed at
observed00:03:55UTC: ACCEPT, no blocking error. Main's different exact cluster,
the true-area<=3 bound and scope limitations match section4. Main's own
STOP is reported as00:02:59UTC; these times are not conflated.

Independent critic FULL literal read of sections1–5 was reported at observed
00:03:51UTC onward: ACCEPT both exact counter variants, pair13 normal form,
removed-ray integral T/30+5/288, P arithmetic and narrow support limitation.
Its required terminal-wording clarification is applied here. Critic's own
new-derivation STOP is00:03:51UTC; later literal review is not new research.

Created only this one Builder note. No predecessor edit, mathematical
process, SDP/numerical trial, code, installation, new agent, infrastructure,
UI/API/DB/Git/build, scratch/copy/deletion: all ZERO. Nothing removed.
Vibecode Kit supplied only the minimal existing scope, completion and
independent-review workflow, not mathematical authority or K6 closure.
