# TIP-072O — independent mathematical and consequential review

Date: 2026-10-05. Role: independent reviewer, separate from both Builders.
Status: SCOPED_OFFLINE_REVIEW_PASS. No remaining P0/P1 finding was identified
in the frozen written argument or fixed offline implementation. This is not
Main's whole-repository acceptance, formal/literature acceptance or agent M1.

The full sealed TIP, final mathematical dossier, Core/CLI/Python, both new
test files and both final Builder reports were read. Vibecode Kit's separate
Builder/reviewer verification procedure was used. Only this new report was
authored by the reviewer; no peer file was edited.

## Mathematical challenges and resolution

The general lemma is sound as a LOWER guarantee: for integers d>=3,r>=2,q>0,
gcd(rq,d)=1 and eta=1/[d(r+1)], every real base time has a q/rq pair BAD union
of size at most one on its d common shifts. Each unit grid has spacing1/d;
the open BAD arc length2eta<1/d admits at most one grid point, including wrap.
If the two BAD indices differ, their rq-grid difference has norm>=1/d, but
circle triangle inequality and ||r*y||<=r*||y|| give a strict bound
<(r+1)eta=1/d. This contradiction requires neither rational density nor a
sampled approximation, and also applies at negative base times. Equality is
GOOD. Each additional unit speed forbids at most one index, leaving at least
d-e+1 good shifts for2<=e<=d. No general sharpness statement is inferred.

The unit premise is consequential on composite d: d6,r5,q2, base time0 gives
speeds2,10 both BAD at shifts0 and3. Neither speed is divisible by6, but neither
is a unit, so merely nondivisibility cannot replace gcd(rq,d)=1.

For the implemented d5/r2/e5 family q,2q,v,w,z, the proof therefore permits
THREE arbitrary unit extras and leaves at least one shift at1/15, beyond the
old independent-phase e<d condition. Normalization x=q*t0-m/5 with
m=floor(5*q*t0) is valid for every real base time; h=(m+q*j) mod5 permutes
the shifts and recovery is j=qInverse*(h-m) mod5. The archived representative
of a residue class does not establish this exact pair for all integer lifts:
the criterion must not prune a whole Allikvere branch without a separate
actual-tuple/family premise. The final dossier explicitly retains this limit.

Independent exact interval analysis confirmed the six roots0,1/30,1/15,2/15,
1/6,1/5 and all eleven cells. Pair BAD union is {0} below1/15, empty at1/15,
{2} strictly between1/15 and2/15, empty at2/15, and {4} above2/15. Both closed
diagnostic endpoints are present; no endpoint is replaced by an open sample.
Continuity and complete threshold roots justify constant predicates inside
each open cell. These facts support the written argument; finite representatives
alone do not prove its all-real quantifiers.

The upper witness [1,2,3,4,7] at base1/15 has five minima
[1/15,1/15,1/15,0,1/15]. Its full14-speed extension with nine divisible
speeds5*[1,2,4,5,7,8,10,11,13] has lower witness tau1/3 and all lower distances
1/3; its full minima are identical. This proves sharpness of the UNIFORM
discrete-shift family bound together with the lower theorem, not optimal
loneliness of a fixed tuple over all real times or a global LRC counterexample.

The lift is correctly conditional: nine divisible speeds5*w_i require
||tau*w_i||>=1/10, and t0=tau/5 preserves those coordinates under every j/5.
The result then supplies >=1/15 on all14 moving /15 total runners. Lower LRC9
is not reproved. There is no guaranteed strict slack from this bound, and1/15
does not certify the1/14 target for13 moving /14 total runners. The latter
limitation concerns the guarantee, not an assertion that every such tuple fails.

The rejected arbitrary-third upgrade [1,2,7] at1/10 has maximum shift minimum
1/10, not1/5. Harmonic1,2,4 can do better on the exception coordinates, but
the lower witness can bottleneck the all-coordinate bound. The six passive
routes correctly preserve the stronger applicable independent method for3/2,
5/2,5/3,5/4 and use PAIR for3/3,5/5 only with exact/unit premises. At e=d,
independent zero means NO_POSITIVE_GUARANTEE, not failure of LRC. This is a
fixed comparison table, not an exhaustive optimal strategy or runtime change.

## Independently executed exact calculations

A separate stdlib Fraction scratch calculation, importing no peer mathematical
helper, independently derived the physical shifts and all252 selected full
coordinates for eighteen fixtures. It verified distinct/unit exceptions,
explicit lower witness, carry/inverse/normalized phase, lowest physical good
shift and minima. There are ten minima1/10 and eight2/25, all above1/15;
none was forced equal to the guaranteed bound. The full positive minimum array
in sealed order is:

```text
1/10,2/25,2/25,2/25,1/10,2/25,1/10,1/10,1/10,2/25,2/25,2/25,
1/10,1/10,1/10,1/10,1/10,2/25
```

Five existing fixtures actually fail if the carry is omitted: indices8,10,11,
16,17 have wrong exception minima3/50,1/50,1/25,3/50,1/50 respectively. The
retained canonical first case is index8/q11: m1,inverse1,h1,correct j0 at1/50;
the omitted-carry j1 at11/50 makes speed77 distance3/50<1/15. This is a failed
coordinate, not merely changed metadata; omission need not fail every fixture.

The scratch calculation independently reconstructed all five full14 rows of
the sharp witness and residue alias [6,17,11,23,29]. The alias has a valid
lower minimum1/6 but full minima[0,1/30,1/30,1/30,1/30], disproving the
residue-only gate for this common-shift criterion, not global LRC. The
independent-phase zero obstruction lacks the exact doubled-phase relation;
it cannot be reused as a common-time counterexample.

An additional independently derived finite sanity check examined36 unit
classes with d3..12,r2..7, using784 exact critical points/open representatives.
No pair-union violation occurred. This is finite calibration ONLY; the written
triangle-inequality proof above remains the basis of the universal lemma.

## Frozen code, actual replay and adversarial controls

Core reconstructs the entire fixed bounded report, rather than trusting an
asserted verdict/hash. Its small fixed rational arithmetic makes exact integer
decisions; supplied decimals never enter mathematical arithmetic. Python uses
stdlib Fraction and independent threshold-root enumeration, with no Core/old
arithmetic import. CLI executes fresh inspected pinned Python bytes with
-I/-S/-B, shell:false, minimal external environment and bounded process IO,
then compares complete canonical content and pre/post source identities.
This is local byte/process consistency, not signed interpreter/host attestation.

The reviewer actually ran BOTH frozen selectors with all six execution flags
OFF: **231/231 PASS**, two files, start08:27:24 local, duration2.78s
(131 Core +100 Replay). Counts are not added to Builder or Main counts.

A separate actual isolated Python process produced ACCEPTED, exit0 and empty
stderr:29,251B stdout,6.945375ms,6,487 charged operations. Fresh Core passive
admission accepted the whole independent envelope, charging78,080 operations.
A separate actual full audit produced MATCH:

| Observation | Actual value |
| --- | ---: |
| Aggregate elapsed |96.448292ms |
| Aggregate charged operations |90,421 |
| Core / Python operations |53,564 /6,487 |
| Core / Python elapsed |9.157250ms /6.975042ms |
| Process wall time |69.375375ms |
| Complete audit JSON, without CLI newline |29,722B |
| Complete canonical evidence |29,162B |

Complete semantic digest:
`86731a54c988e4f22d3a793101f4faddaeb60e6a6ab8f4047db88df0e14d0255`.
Times/metric serialization bytes vary; these are observed runs, not promises.

Starting from the actual Python envelope, the reviewer separately made21
coherently REHASHED semantic corruptions: union, endpoint, equality BAD,
matrix, missing fixture, carry, exact pair, alias promotion, sharp maximum/full
matrix, inferior route, missing route premise, unsupported independent status,
14-total promotion, slack/global/authority promotion, lower assumption,
missing coordinate, third-upgrade and independent-phase promotion. All21
returned REPORT_REFUSED with null evidence. A separately inherited array
toJSON control also refused with zero hook invocations. These22 controls are
independent evidence, not additional Vitest cases.

Frozen suites additionally exercise complete reconstruction, detachment/deep
immutability, nonplain/accessor/symbol/hidden/sparse/cyclic input, component
bounds, source drift before/after process, process faults, flag refusals and
shared time/operation exhaustion. The limits remain32,768B/5s/2M chargedsteps/
256-bit components; no representation/cap change or evidence omission was
needed. Generated accepted evidence is detached immutable Core data. Every
fault gives null positive evidence. No scientific admission is granted.

## Reviewed immutable identities

| File | SHA-256 |
| --- | --- |
| Sealed TIP-072O |`e44326aacc687bdea50f68d6da7092eb44ac5ab1e31c367b0d8ad0ef5b6ba8f6` |
| Final written dossier |`e4604e64204303fc4810c24c24b25b8f0f8df0a2ee1a88d2d53a6d4f3efae569` |
| Core module |`57a414857a7ab458efeda92e8229d6308dd799d18c68a72bb4cbeb32213a0792` |
| Core test |`c5a2b01611c81ce1e001c51901cc992891feba1c32b6fb1d7d582fc92ea4ed84` |
| Python replay |`0129c863fcc092872d1cb34fcbf4b3f189ca3108cead6060e6185e0bd70087fd` |
| Audit CLI |`bd1605a7d77a2af6d1012e1e49e5ef48649304dafd9ad9ae50916e9dfe290ed0` |
| Replay test |`99188da02dbf92f726a7988a84b887dd0fc2948a2d8be68249fcc094e8016eab` |
| Core completion report |`d0ff56658c8687b09d98485f7396ba5e4935fe8ab14068de35fd6e0132c9623e` |
| Replay completion report |`cdeaa39b7d8168b8e1dcd05ea603b7e2279a69c9b0303ea376df6709a48ab3ed` |

## Acceptance and unresolved boundaries

O1–O5: PASS in this sealed fixed OFFLINE mathematical/diagnostic scope, based
on separate proof review, exact calculations, actual fresh reconstruction and
consequential hostile controls. O6: independent review is complete; Main owns
the46-suite historical regression, whole types/lint/build and preservation/
manifest-prefix audit. This report does not self-certify those later checks.

The milestone is a conditional five-exception structural extension, not a
proof of all LRC14/15, a novel published theorem, autonomous campaign or closed
agent E2E. Tuple optimum/global/formal/external/novelty remain NOT_ESTABLISHED;
agentLoop NOT_RUN; executionAuthority false. Production072B atomic current
binding/source closure, phased durable replay, human G2 and a fresh M1 remain
deferred. Historical failed/refuted assertions are not revived.

The reviewer performed no DB/session/provider/model/API/Codex-child/private-root/
job/case/M1/campaign/archive/schema/migration/envfile/install/UI/browser/Git/
billing/deployment action, and no old product/test/history/registry/ledger edit.
