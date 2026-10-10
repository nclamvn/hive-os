# P2 actual private-allocation prerequisite — occurrence inventory

2026-10-07 · SAME081D8 engineering · source review candidate / checks UNRUN.

This inventories **only** `scripts/test/allocations-tip081-p2.mjs`, not an Acorn
adapter. Full P2 W2/W3/W5 supported-grammar closure is missing; parser admission
is OFF. The new code makes actual private objects, arrays, dictionaries and derived
strings, unlike P1's scalar cost probes. Fixed fixture scenarios do not parse
JavaScript and are not an alternative language or a supported-grammar certificate.

## Cost convention and trusted boundary

Use P1's literal logical costs: object header64, property16, dictionary row32,
array slot8, string header32 plus2×UTF16 units, resize attempt24. Actual node-shaped
record cost is P1 G05 `80+16×5=160`. Actual list record is `64+16×3=112`; actual
empty backing is G02 `88+8×(0+0)=88`. Resize is G02
`88+8×(oldCapacity+newCapacity)`, with both backings permanently in producer debit.
Capacity slots already reserved at construction need no second backing-byte debit
on filling/copying; occupied membership still increments the independent entry cap.

Every modeled payload-field overwrite/add/delete costs16 **before** its operation,
even when the field already existed or deletion removes it. This explicit monotone
logical convention accounts slot attempts, not native hidden-class/dictionary
transitions. Each array prototype removal is another16-byte mutation attempt.
Null-prototype object literal construction is covered by its declared header/schema
cost; it allocates no separate prototype object. Scope map insertion uses P1 G03
`96+2×keyUnits+32×1+8×1=136+2×keyUnits`, including a conservatively repeated key/
map-header reservation. Actual backing occupancy adds one further entry. Three
entries per enclosing scope represent dictionary row, dictionary value alias and
actual var-name list membership. These costs are deliberately logical, not an
assertion that V8 constructs exactly those native headers/rows.

Fixed control fields (clock, counters, phase/profile/rootKind/static tags) are
precharged by the owner schema. Updating these bounded scalars/literals does not
produce new payload/schema allocation; root payload replacement itself costs16.
No total-byte refund follows scope pop, default overwrite, deletion, alias loss,
root replacement, abandoned string attempt or disposal. There is no replay credit,
category transfer, issuer or P3 machinery in this module.

Module reservation65536 precedes binds/tables: P1's32768 function/bound-closure/
lexical envelope,16384 static literal/profile/export table envelope,8192 WeakMap/
11 two-field refusal records/status schema envelope and8192 fixed margin. This is
the fixed trusted artifact's logical startup, not a pre-loader physical guard.
Owner4096 covers21 fixed state properties, two-field handle and WeakMap row;
scratch8192 covers at most10 fixed nonrecursive helper frames at512 plus3072
margin; error4096 retains singleton refusal references. Base81920 plus4×source
UTF16 units reserves caller+private retained immutable payload conventions. It
does not claim primitive-source copying or OS memory reclamation. Observation1024
covers18 fixed scalar/literal output fields and no source/AST pointer.

Captured Array/String/Object/WeakMap/clock primitives and null-prototype private
records/backings prevent tested post-import inherited setter/constructor routes.
Trusted loading and invocation remain host assumptions. VM argument vectors,
native lookup/hash/string representation/interning/rope flattening, array/object
layout, hidden classes, native exceptions, loader/JIT/GC and physical RSS remain
OPEN. A slice/one-unit conversion is guarded logically before its synchronous
native call, but cannot be interrupted inside that call by a later checkpoint.
No real-source/native/host sandbox is certified. Caller invalid objects are
rejected before reflection/coercion; no callback/options/plugin interface exists.

## Exact new-source occurrence rows

Line spans below are inclusive in the current new kernel source. Original anchors
are zero-based UTF8 **function keyword** offsets from the pinned audit, and describe
intended future grammar use—not proof those original sites have been adapted.
Main pins the complete reviewed artifacts before any executable check.

| ID / new source span | Original family/anchor | Before-growth guard and real operation | Lifetime / control fixtures |
| --- | --- | --- | --- |
| A00 L7–53 | F01 initializer; F02 fixed options | Declared65536 before binds, WeakMap, refusal/status literals; immutable provenance data, adapter/inventory pins NOT_ISSUED | Fixed module lifetime; not live authority; P221/P225 |
| A01 L131–145 | F02 Parser12939 | `cap>=81920` and `text.length<=(cap-81920)/4` before state/handle/WeakMap/source retention | One active synthetic owner; original TTL; P203/P204/P215–P219/P230/P231 |
| A02 L149–152 | F04 Node78105 | guard160/node1 before actual five-field null-prototype record | Defaults and all attempted nodes permanently charged; P201/P202/P204/P228 |
| A03 L108–118 | F04 schema; F12 fixed owner bookkeeping | guard16 before payload field mutation/root replacement; fixed control literal rootKind precharged | No overwrite refund; P201/P202/P211/P212 |
| A04 L154–161 | F04 copyNode78782 | A02 constructs defaults; five separate schema calls before actual type/start/end/left/right assignments | Default fields not refunded; shallow aliases separately retained in debit; P201/P202/P228 |
| A05 L170–174 | F04 toAssignable43072 | Four separate schema calls before operator add/type overwrite/operator delete/root.right write | Deleted operator and replaced links keep charges; P201/P202/P226/P228 |
| A06 L177–185 | F05 list constructors; F07 expression lists73257 | guard112 list record, guard88 empty actual backing, A16 before prototype removal | Record/backing/private aliases; P205/P206/P224/P227 |
| A07 L187–198 | F05 TopLevel19125/Block28645; F07 Obj67895 | safe doubled capacity; G02 guard before actual new backing; precharged fill/copy slots; A16; separate schema calls before controller items/capacity writes | Both old and new backings charged, no reclaimed credit; P205/P206/P224/P227/P229 |
| A08 L200–203 | F05/F07 list pushes | guard entries1 before actual index write; backing already reserved; schema16 before length write | Every dense reference membership independently capped; P205/P206/P229 |
| A09 L210–215 | F04 Literal63627; F07 Template66659; F11 raw strings116216 | bounds validated; guard `64+2×(end-start)` before captured actual source slice | Derived raw/key strings private; P207/P208/P210–P214 |
| A10 L217–223 | F06 Scope76451/enterScope76571 | scope144/depth guard; three A06 lists; guard64 before actual null-prototype dictionary | Parent chain and all three arrays actual, no global node mirror; P207–P209 |
| A11 L225–232 | F06 declareName76765/checkPropClash51287 | guard `136+2×key.length`, entries2 before own map-row write; A08 additional var slot per enclosing scope | Aliased key re-reserved per row; all fanout slots charged; P207/P208/P209 |
| A12 L244–265 | F07 Template66659; F11 String116216/Escaped118510 | scalar ASCII fixture escape handling; guard34 before actual one-unit string; guard `64+2×(oldUnits+newUnits)` before actual concat | Every old/new/piece charge retained; restricted exercise NOT JS decoding semantics; P210/P211/P213 |
| A13 L269–274 / L301–302 | F07 tentative Paren64074/template paths | A09/A12; guard96 before actual private raw/cooked pair; A03 before retaining; second attempt constructs replacements without refund | Dropped first pair/string reservations remain; P210–P213 |
| A14 L276–288 | F12 fixed outputs | guard1024 before actual frozen18-field observation; original clock checked first | Scalars/literals only, never root/source/data pointers; P203/P220/P230 |
| A15 L60–76/L78–107/L311–320 | F08 deadlines/failures; F12 errors | Captured clock; scalar arithmetic/caps; fixed singleton refusal, field cleanup/WeakMap delete | Authenticated operational failure retires; malformed pre-auth metadata cannot revoke another owner; P214–P219/P221/P228–P231 |
| A16 L182–183/L194 | F04–F07 shared/inherited backing risks | schema16 before captured setPrototypeOf(null), before any array element write | Stops inherited numeric setter from receiving private values; captured constructor; P223/P227 |

Scalar/helper closure: `unsigned`, `plus`, `times`, `guard`, `timed`, `tick`,
`owner`, `schema`, `fail`, `abort`, `dispose` allocate no source-dependent object/
array/string beyond these rows. They use the predeclared bounded helper scratch.
All fixture loops are iterative and check every64 operations; every growth guard
also checks captured original time. No native Error/stack/source excerpt is built
on a module refusal. The runner/harness may format errors outside this claim.

## Private ownership, structural axes and missing grammar

Source and actual fixture root are private WeakMap state. Only same-instance opaque
handle identity is admitted; no source-derived string, node/list/map, callback or
arbitrary caller field inspection crosses the public interface. Replacing a root
can remove old references, but never lowers its reservation. There is no all-node
mirror or object catalogue. Synthetic module ownership is **not** cross-version/
process-global authority exclusion and cannot adopt old source-store handles.

`scopeDepth`/`maximumScopeDepth` measure the scope-parent fixture axis only. Repeated
shallow copies form a potentially deep right-link chain; no traversal occurs and
this kernel does **not** enforce AST-depth128 or full grammar/helper recursion.
Node/entry200000/20000 caps count actual attempted node allocations/memberships,
not a verified complete AST/site catalogue. None of these data-shape controls
establish supported syntax, semantic correctness, parser completeness, independent
replay, real issuer authority, graph closure or a mathematical result.

Unknown fixture names/count metadata are pre-auth API-schema errors: no source work
has been admitted, so someone else's owner remains live. Authenticated out-of-range
slices, unsupported ASCII cooking, byte/node/entry/scope/deadline failures retire
the owner. Parser entry authenticates then always refuses ALLOCATION_COVERAGE_OPEN.
Metadata claiming guard removal/completeness cannot turn it on. P222 is a forged-
metadata rejection control, **not** the required complete-grammar removed-guard
fixture; W4's full admission proof stays missing.

## Evidence status / remaining obligations

31 literal controls P201–P231 are supplied in one new exact fixture file/config,
`envDir:false`, setupFiles empty, no old test/app glob/oracle. Builder has executed
none. Source review and all effectful checks belong to Main within remaining
aggregate; first cuts/failures must be preserved. There is no accepted P2 adapter
hash or occurrence coverage tuple yet.

This is incremental implementation progress in W1/W2/W3/W4/W5, **not any full W1–W5
closure**. Full F01–F12 grammar adaptation, complete occurrence/body map, supported
semantics, actual helper/AST-depth control, deliberate real guard-removal admission
control and positive supported-grammar fixtures remain OPEN. Full P2 is PARTIAL /
NOT READY. Frozen Acorn/P1/v1/v2/history unchanged; authentic bridge/P3–P5, actual
source/build/E2E/math/Git not granted;62 predecessor OPEN unchanged.
