# Complete retained-label classification (hand arithmetic, not execution)

This table covers all34 necessary LEFT masks retained by the predecessor
endpoint/connectivity exclusions: ten size2, fourteen size3, ten size4.
It does not enumerate or cover geometry cells. Every proposed closed row uses
a uniform inequality for ALL offsets/ties in that label class. New lemmas await
independent challenge; the table is not a declaration that R1 is closed.

Masks denote label sets, not integers. The RIGHT mask is the complement in
123456. Reflection sends LEFT L to `{7-j:j in RIGHT}`, reversing BOTH labels
and side order. Each reflected consequence below is explicitly listed.

Method keys:

- P: exact two-label floor `83/62-1/(r+1)-2C_L`.
- T: basic three-three floor `1855/1922-2C_L`.
- Q34: strengthened proper4 + exactpair + other-group gap3 residue.
- Q36: strengthened proper4 + exactgap3 pair; no gap residue required.
- G145: three-group gap residual addition.
- E45,E46,E256: isolated-outer-triangle proofs.
- C356: coupled four-triangle cap proof.
- OPEN: no target-reaching universal calibration has been obtained.

| LEFT | RIGHT | C_L | Method | Uniform defect floor |
|---|---|---:|---|---:|
|23|1456|1/6|P|47/93|
|24|1356|1/6|P|125/186|
|25|1346|19/60|P|847/1860|
|26|1345|7/15|P|191/930|
|34|1256|1/2|Q34|35/3844|
|35|1246|29/60|P|6/155|
|36|1245|37/60|Q36|7033/317130|
|45|1236|49/60|E45|47415/234484|
|46|1235|47/60|E46|824/20181|
|56|1234|11/10|OPEN|not proved|
|125|346|1/6|T|3643/5766|
|126|345|1/3|T|1721/5766|
|134|256|1/6|T|3643/5766|
|135|246|1/6|T|3643/5766|
|136|245|19/60|T|4783/14415|
|145|236|1/2|G145|51/961|
|234|156|1/3|T|1721/5766|
|235|146|19/60|T|4783/14415|
|236|145|7/15|T|917/28830|
|246|135|7/15|T|917/28830|
|256|134|47/60|E256|1345/26908|
|346|125|47/60|E256 reflected|1345/26908|
|356|124|14/15|C356|820/181629|
|456|123|19/15|OPEN|not proved|
|1236|45|1/6|P reflected23|47/93|
|1246|35|1/6|P reflected24|125/186|
|1256|34|1/2|Q34 reflected|35/3844|
|1346|25|19/60|P reflected25|847/1860|
|1356|24|29/60|P reflected35|6/155|
|1456|23|49/60|E45 reflected|47415/234484|
|2346|15|7/15|P reflected26|191/930|
|2356|14|37/60|Q36 reflected|7033/317130|
|2456|13|47/60|E46 reflected|824/20181|
|3456|12|11/10|OPEN|not proved|

Thus the proposed hand inequalities address31 rows and leave THREE LEFT masks:
56,3456,456. The first two are reflected copies, but no symmetry-based omission
of continuous geometry is made. The target still quantifies every remaining
offset configuration in these masks. This table was first written by hand;
subsequently ONE authorized exact finite-label arithmetic check ran in TIP108D,
with output BUILDER_LABEL_CRITERIA.json. It confirms34 rows and31 proposed
exclusions, leaving56,456,3456. It verifies arithmetic, not geometric lemmas.

## Q34 and Q36 parameter minima

For pair gap r, let `g_r(a)` be its exact minimum area for range a. Write

    2g_r(a)+a=2-1/(r+1)+T_r(a).

For r1, `T1(a)=3a^2/2` until a1/3 and `T1(a)=a-1/6` thereafter.
With b=S-a and S<=18/31,

    min_a[T1(a)+b^2/2]>=3S^2/8.

On a<=1/3 this follows by square completion with minimizing aS/4. On a>=1/3,
the derivative of `a-1/6+(S-a)^2/2` is `1-S+a>0`; its endpoint value is
no smaller than the unrestricted first-region minimum. The gap3 in R1256
adds `169/3844` to D. At S18/31,

    1-2S+3S^2/8+169/3844=35/3844>0.

For r3 the whole allowed a range is below r/(r+2)=3/5, so

    T3(a)=a/2+5a^2/12,
    min_a[T3(a)+(S-a)^2/2]
       =S^2/2-3(S-1/2)_+^2/11.

The latter holds by completing the square, with boundary a0 for S<=1/2.
The resulting defect floor decreases with S throughout0<=S<=18/31. At the
upper endpoint it is

    9/4-2S-37/30+S^2/2-3(S-1/2)^2/11=7033/317130>0.

No further gap residue is needed in Q36. These are analytic parameter minima,
not numerical searches or stationary samples.

## Record correction / Đính chính

An earlier message incorrectly named the reflected open mask as1234. The correct
LEFT mask is3456; RIGHT is12. That was an exposition error before this hand table,
not a hidden execution error. R1/global K6 remain OPEN pending the continuous
critical classes and independent challenge of the new proper-group proofs.
