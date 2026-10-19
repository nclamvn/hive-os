# P3 / P319 size feasibility — source-only, OPEN

2026-10-08 · SAME081D8 · unchanged P3 limits and acceptance.

Outcome: no feasible normal-producer 16384/16385 witness is established by this
review. A large-padding size construction is source-infeasible. A compact mixed
export construction has an exact conditional wire-size equation, but its normal
producer grammar-resource obligations remain OPEN; under the stated digit-width
vector it cannot complete VERIFIED within 20000 entries. Neither statement is
a global impossibility proof for P319. Two source families were considered, below
the six-family limit. Stop at these concrete obstructions / remaining uncertainty.

This author read named source/data and performed hand arithmetic only. No parser,
generator, imports, hashes, tests, scripts embedded in historical JSON, or other
measured effects were run. No runtime/fixture/tool code changed. This report is not
self-acceptance, an executable control, a fixture PASS, or an execution request.

## Source anchors and exact size convention

Producer overlay `scripts/test/private-summary-runtime-tip081-p3.mjs`:
`site` (near324), `enter`/`walk` (near359), `encodeSummary`516–563,
`metadata`568 onward, creator628 onward, analyzer675 onward. Generated tool TEXT
`scripts/test/generated/private-summary-tip081-p3.candidate.mjs`:
`__scalarTrivia`2441 onward, `parseTopLevel`3014 onward, `parseStatement`3074
onward, `parseExport`3864 onward, `parseExportSpecifiers`4007 onward.
Verifier lexical snippet `scripts/test/private-summary-verifier-tip081-p3.mjs`:
fixed work251, Node membership271, array membership287, predecode364.

Let d(x) be the number of decimal digits of nonnegative x, including d(0)=1.
The wire is fixed ASCII, so code-unit length equals byte length. For S>=1 export
sites, all NONE binding/CERTAIN/false/false/OPEN, empty-source loader NONE, the
exact record size is 140+d(start)+d(end). STATIC_LITERAL instead of NONE adds10.
No raw specifier/name text is serialized. Both hashes always contribute64 chars.

For K static-source exports among S export sites, exact wire length is:

`L = 625 + 141*S + 10*K + sum_coordinate_digits + d(U) + d(N) + d(G) + D`.

Here U is source UTF16 units, N reachable Node occurrences, G grammar attempts,
and D the sum of the14 historical ledger decimal widths. Derivation: fixed root,
ledger-key punctuation and seal overhead626; S site records140 each and S-1
separators. Ledger key/colon payload249 plus13 separators and closing brace1.
This is an encoder equation, not evidence that any input survives preceding guards.

The useful one-byte knob is source-derived: one pre-analyze observation M0→M1
changes summaryBytes90656 (5digits) to103520 (6digits), and scratchBytes6667640
to6654776 (both7digits). Other historical category values, parser counters and
total are unchanged. Thus the SAME successful producer source would attempt one
additional wire byte. No AST alteration or refund is involved; metadata12864 is
prepaid. This cannot rescue a source refused before encoder entry.

## Family 1 — empty exports with large leading whitespace: INFEASIBLE

Proposed syntax construction (notation only, not evaluated):

`" ".repeat(99622) + "export{}\n".repeat(103)` in MODULE mode.

U100549; S103; N104; A103 array slots; no bindings; AST Node depth2. The first42
export spans have five-digit coordinates; the remaining61 have six-digit
coordinates, so their digit sum1152. G104 is the straightforward root/export
factory-path expectation, not an observed attempt count. With D72, the equation
is `625+14523+1152+6+3+3+72=16384`; the M1 variant would add1 if reached.

This size-only construction is NOT a producer witness. Actual emitted
`__scalarTrivia`2441–2453 allocates guarded CONTROL argument vectors for __tick
(0 slots +metadata1), __char (2+metadata1), and __scalarSpace (1+metadata1) for
EVERY leading ASCII space: at least6 common grammar entries per space. Therefore
leading padding alone incurs at least597732 entries, plus257 owner startup
entries, against20000. ENTRY_REFUSED necessarily precedes exports/summary; other
guards might precede ENTRY_REFUSED. This lower bound does not need exact grammar
byte totals or bootstrap cost. The initial conditional size proposal is preserved
as a non-witness and its feasibility implication is explicitly withdrawn.

## Family 2 — compact empty / static-source exports: conditional, OPEN

Proposed literal construction, not executed or added to fixtures:

`"export{};".repeat(12) + "export * from \"m\";".repeat(11) + "export{};".repeat(83)`

Use MODULE, unchanged 64MiB /20000 entries /original TTL, M0 and M1 variants.
S106, K11, U1053. Expected AST is Program +106 export declarations +11 Literals:
N118, A106 (Program body indices; empty specifier arrays add0), names0, Node
depth3. G118 requires explicit closure of the unique Node-factory paths; no
attempt counter has been observed. Site enums are EXPORT/NONE/CERTAIN/false/
false/OPEN, with11 STATIC_LITERAL and95 NONE loaders.

For106 plain nine-byte empty exports the coordinate-digit sum is610. The first12
empty rows preserve all original sub100 transitions. Placing the11 eighteen-byte
static-source rows afterward adds99 source units. First100 rows end999; the final
six empty rows start999,1008,1017,1026,1035,1044 and end1008 through1053. Exactly11
coordinates cross1000. Thus coordinate sum621, and:

`L = 625+14946+110+621+4+3+3+D = 16312+D`.

If D72 and G118, L16384 exactly; M1 attempts16385. This construction avoids the
large-padding obstruction, but is only a conditional normal-syntax proposal.

### Producer resource obligations, NOT established successes

Two-pass work rule gives `304440+16336*118+480*106=2282968` bytes. Historical
producer entries are `8469+P_e`, where P_e is actual common parse entries.
Define the selected width vector W72 as:

`8,7,7,5,8,1,7,1,1,8,8,5,3,3`

in the exact14-field encoder order. Its sum is72, but D72 does NOT imply W72;
alternative width distributions summing72 remain OPEN. Under W72 require parse bytes P_b to be
seven digits and historical producer entries five digits. This means
`P_b>=1000000`, `P_e>=1531`; producer entry admission requires `P_e<=11531`.
The fixed per-node/key/read bounds and three-deep explicit traversal are compatible
with these shapes, but do not prove their common-parser byte/entry/frame/time
costs. No first guard is predicted beyond these necessary conditions.

Let T denote actual logical bootstrap/tool bytes AFTER initialization. Generated
static456794/workspace2415040 alone do NOT determine T: dynamic initializer
operations also contribute. No P3 bootstrap ran, and this review does not close
every initializer operation. Do not substitute a guessed T or predecessor
measurement for an actual source-derived P3 value. Creator base is `T+5748`;
wire-time total, if all preceding operations succeed, is `T+34212836+P_b`.
Thus cap requires `P_b<=32896028-T`. Initial creation requires
`T+32234308<=67108864`. These symbolic constraints replace an earlier exploratory
exact-total assumption; no exact nonparse total is asserted.

Remaining source obligations: G118 factory-path proof; exact P_b/P_e or bounds
that establish required decimal widths and all pre-encoder limits; actual T;
private parser-frame bound and original deadline feasibility. A decimal width
change changes L; it must not be fitted retrospectively to a produced wire.

### Complete VERIFIED is separately obstructed for this conditional variant

Verifier work bytes for this shape are at least
`304872+16336*118+480*106=2283400`, below2641208. That fact does not establish
replay success. The unchanged global entries do not reset on producer retirement.
Under W72, producer entries are >=10000. Same-source replay parses require
P_e>=1531 again. Independent two-pass extraction charges at least
`256+66*118+2*106+2*106=8468` entries. Incoming schema predecode charges
`28+10*106=1088` memberships. Sum >=21087>20000, ignoring other positive costs.
Therefore this W72 exact-size candidate cannot complete VERIFIED. This is a
selected-vector-specific obstruction, not impossibility for all compact-family
width distributions or a general argument over all six site taxonomy families.
An exact producer16384/+1 witness would address F1 codec boundary only; the
conditional W72 replay obstruction is separate operational information, not an
added F1 acceptance requirement or proof of producer impossibility. All other P3
obligations remain.

## Routing / scope

F1/P319 remains OPEN. Main reconciliation and independent non-own review are
required. No exhaustive site-family obstruction was established; no global
P319 impossibility is claimed. F2/P321 belongs to its separate author/report.
Preserve current code/artifact cuts, compile OFF, NOT_ISSUED tuples, all36 UNRUN,
accepted0/8, P2 history and real/root/callergraph/native/physical exclusions.

No additional effects are proposed by this report. Aggregate870882.767416/
900000ms; remaining29117.232584; P3 remaining21440.727166 within25000, unchanged.
No cap/schema/acceptance revision, new TIP/mode/grant, P4/P5 work or reset follows.
