# TIP-081A P2 scalar grammar replacement bodies — Builder handoff

Status: implementation templates written; UNRUN; independent source review and
emitted-adapter review required. This is not full P2 closure, parser admission,
occurrence-level enforcement evidence, or a P3 grant. No parser, generator,
helper, test, syntax/lint/type check, hash or actual-root operation was executed
by this Builder.

The new file is `scripts/test/scalar-grammar-bodies-tip081-p2.mjs`. Its exports
are offline source strings and fixed metadata only, not a public source/AST API.
The adapter remains private and disabled until the Contractor's existing gates
are satisfied. P1 and the accepted allocation-kernel predecessor are unchanged.

## Original anchors and new source spans

Original anchors below are zero-based UTF-8 **byte offsets of the function
keyword**, not UTF-16 positions or assignment-prefix offsets. They refer to the
fixed Acorn 8.14.0 text at `node_modules/next/dist/compiled/acorn/acorn.js` and the
Contractor-owned textual index. The index is not an AST or completeness proof.
New spans are one-based lines in the template library, not emitted-adapter
offsets. The generator must issue its own original-to-derived site map.

| Original helper | Original anchor | New body lines | Required parameters |
| --- | ---: | --- | --- |
| strictDirective | 16344 | 123–167 | start |
| canInsertSemicolon | 17203 | 170–171 | none |
| isLet | 19615 | 174–185 | context |
| isAsyncFunction | 20120 | 188–198 | none |
| skipSpace | 107152 | 201–202 | none |
| readCodePoint | 115894 | 205–227 | none |
| readEscapedChar | 118510 | 230–268 | inTemplate |
| readWord1 | 119824 | 271–298 | none |
| readRadixNumber | 114492 | 301–310 | radix |
| readNumber | 114907 | 313–340 | startsWithDot |

Shared lexical helpers occupy lines 5–118. Parameter names in
`SCALAR_GRAMMAR_PARAMETER_NAMES` are mandatory: replacing a minified original
body without replacing/alpha-mapping its parameters leaves free, incorrect
references. Original parameters cannot be assumed to have the descriptive names.

## Agreed private interface and transformation obligations

The fixed profile is ECMA2024 (15), Script or Module through separate fixed
entries. Locations, ranges, callbacks, caller program and offset options remain
false/null. The original parser `this` shape and token table `m` are retained.

Runtime hooks supplied by the lead Builder:

- `__char(text,index)`: captured scalar read with clock check; NaN at EOF.
- `__slice(text,start,end)` and `__concat(a,b)`: primitive strings only,
  before-growth derived-string accounting.
- `__codePoint(n)`: finite valid 0..0x10ffff encoding, including lone surrogate
  code points for string-literal semantics. Identifier ASCII restrictions are
  separate and must not narrow ordinary string values.
- `__tick()` and `__refuse(fixedCode)`: guarded clock and fixed private refusal.
- `__number(text,radix)`: captured bounded conversion after grammar validation;
  decimal radix 10 uses the full normalized spelling with fractional/exponent
  components, not parseInt. Legacy-octal radix 8 conversion preserves the
  original branch. Scratch is guarded before conversion; at most 1024 raw
  spelling code units. Legitimate literal overflow may yield Infinity.

The generator must transform **all** helper and body source, including private
`__scalarPeekWord` result objects, `this.pos`/`containsEsc` writes, ordinary calls,
loops, and string operations. Runtime hooks alone are exempt because their
guards reside in the separately reviewed runtime. No blanket helper exemption
is allowed. Static constant metadata is offline data, not source-derived work.

Retained dependencies include transformed original `readInt` (anchor 113427),
`readHexChar` (119677), `finishToken`, `isContextual`, `invalidStringToken` and
token/context dispatch. `readInt` must retain separator validation and iterative
radix rounding, and its character reads, loops, diagnostics and writes must be
guarded. Radix literals now return that original iterative value; reconverting
a long digit sequence can change rounding and is deliberately not done.

`invalidStringToken` is not interchangeable with `raise`: in a template element
it throws the original fixed sentinel caught by `tryReadTemplateToken`, allowing
the original invalid-template fallback and cooked:null for tagged templates.
The transform must preserve this flow. Fixed diagnostic messages do not license
source concatenation or unguarded exception construction in downstream code.

## Semantics and explicit boundaries

Trivia handles ECMA whitespace and CR/LF/LS/PS, line and block comments, absolute
offset-zero hashbang, Script-only HTML open comments, and Script-only HTML close
comments when the **actual last-token-end to current-position gap** contains a
line break (or lastTokenEnd is zero). It does not use arbitrary-offset P1 trivia
classification. Ineligible `a-- > b` and Module HTML operators remain grammar
tokens. Source-span ceilings must keep the packed `end*2 + lineFlag` integer safe.

Identifiers are raw/escaped ASCII only, with `containsEsc` retained. Known Unicode
whitespace/line terminators end an ASCII identifier normally. Other raw Unicode
identifier material or escapes decoding above ASCII are explicitly unsupported;
this is not a Unicode-identifier completeness claim. Escaped next words do not
become unescaped contextual/keyword tokens. Full grammar must still reject
escaped keywords where the original grammar requires that rejection.

Strict-directive lookahead returns false for quoted expression continuations,
including token-bound `in` and `instanceof`; it never scans past such an earlier
expression to discover a later directive. LF followed by ++/-- ends the earlier
statement; LF followed by a single +/− continues it. Raw quote spelling alone
controls strict directives: escapes do not manufacture `use strict`.
EOF raw-strict recognition and word-operator continuations deliberately repair
the stock heuristic; therefore blanket byte-for-byte semantic equivalence to
that heuristic is not claimed. The full parser still validates quoted prefixes,
escape syntax and subsequent statements.

BigInt suffixes are refused before spelling slice/native BigInt conversion.
Decimal and radix numeric source spans above 1024 code units are explicitly
unsupported, not budget-refused and not full-number-language acceptance.
Original numeric separator and leading-zero syntax remains the dependency of
readInt. Native RegExp/BigInt, full Unicode identifier machinery, other original
native string/regex helpers, constructor setup and the whole grammar's resource
map remain outside the authority of this file.

## Literal controls to integrate independently — all UNRUN

These are hand-derived expected controls, not installed-parser output and not
proof of whole grammar. The lead may integrate them into private adapter fixture
checks after independent review. Escapes below denote literal input characters
when appropriate; fixture authors must distinguish raw backslashes from actual
line terminators and assert the decoded private token value/containsEsc.

| Literal control | Expected observation |
| --- | --- |
| `"use strict"` at EOF | strictDirective true (declared stock-heuristic repair) |
| `"use strict";` | strictDirective true |
| `"use\\x20strict";` | strictDirective false; cooked string alone is not a directive |
| `"x"; "use strict";` | strictDirective true |
| `"x"\nin obj; "use strict";` | strictDirective false; no later-directive rescue |
| `"use strict"\ninstanceof X` | strictDirective false |
| `"use strict"\ninside` | strictDirective true; `inside` is not operator `in` |
| `"use strict"\n+foo` / `"use strict"\n++foo` | false / true |
| `async /*c*/ function f(){}` | isAsyncFunction true |
| `async /*\n*/ function f(){}` | isAsyncFunction false |
| raw `async` followed by escaped `\\u0066unction` | isAsyncFunction false; grammar owns later keyword error |
| `let x` / `let in` / `let instanceof` with no statement context | isLet true / false / false |
| ASCII `x` followed by actual NBSP | readWord1 yields x and leaves NBSP for trivia |
| raw `\\u0061bc` | private word abc, containsEsc true |
| raw `a\\u0062c` | private word abc, containsEsc true |
| raw `\\u0030x` identifier start | fixed syntax refusal |
| raw `\\u00e9` identifier | UNSUPPORTED_BOUNDED_SYNTAX |
| `0xff`, `0b101`, `0o77`, `1_000`, `.5`, `1.25e+2` | number values 255, 5, 63, 1000, 0.5, 125 |
| `1__0`, `0x_1`, `1e` | original readInt/number syntax refusal |
| `1n`, `0xffn` | unsupported before native BigInt conversion/spelling allocation |
| string escape raw `\\377` / raw `\\400` in sloppy string | U+00ff / U+0020 followed by literal 0 |
| raw `\\0` in strict string / raw `\\08` in strict string | NUL / invalidStringToken |
| string escape raw `\\u{1f600}` / raw `\\uD800` | surrogate pair / lone surrogate retained |
| invalid raw `\\xZ1` in tagged template | original sentinel/fallback preserves cooked:null; no global syntax refusal substitution |
| Script `a-- > b` with same-line token gap | HTML close comment not consumed |
| Script `x\n/*c*/-->tail\nz`, trivia at offset 1,lastTokenEnd 1 | trivia ends offset 15 at z; two comments |
| same source, arbitrary trivia start 7,lastTokenEnd 7 | `-->` not consumed; no borrowed line-boundary authority |
| Module `<!--x` / Module `-->x` | no HTML-comment consumption |

The original-body table, these finite controls, and future passing checks cannot
replace the required complete occurrence-level map, semantic derivation,
before-growth resource argument, independent emitted-source review or the
Contractor's admission decision.

## Appended integrated-evidence checkpoint

The preceding UNRUN status and literal table are the preserved authoring cut,
not a claim that Main never subsequently exercised the integrated derivative.
Main/Back independently source-reviewed this library, its transformed shared
helpers/parameter substitutions, complete emitted regions and the actual V6
runtime integration. The original template library remains frozen and was never
imported, generated, checked or tested by its Builder.

Main then source-issued the exact checked synthetic tuple and recorded63/63
positive production controls PASS in the first109-control grammar batch; total
108/109 PASS. Its lone P2G107 failure was a structural-depth fixture's expected
refusal category, not a change to scalar-source semantics: actual conservative
ENTRY refusal legitimately occurred first. A fixed plain-call diagnostic
preserved the same domination. No unsupported branch, cap or decoder was relaxed.

The subsequent fixed hybrid diagnostic used only ordinary `!`, ASCII identifier,
empty calls and a semicolon through the same guarded scanner and grammar.
31 prefixes +94 calls analyzed successfully (128 attempted nodes,19216 internal
entries,40573726 logical bytes);32 prefixes +94 calls refused depth and disposed
the owner. Evidence is Main's
`docs/verification/TIP-081A_P2_HYBRID_AST_DEPTH_DIAGNOSTIC.json`.
Structural depth128/129 is separately source-derived, not a public AST/depth
measurement or a scalar template equivalence proof.

Only the P2G107 expectation/boundary-control cut is now being corrected under
Main's explicit route; its final109-control rerun is pending. Historical UNRUN
tables and first failures remain unchanged. This checkpoint does not declare
full P2 acceptance, whole-JavaScript equivalence, native/RSS closure, a benchmark
score, a mathematical breakthrough or a P3/real-source grant.

### Appended Main final fixture result

Main reports **109/109 PASS, one file**, retained in
`docs/verification/TIP-081A_P2_GRAMMAR_FINAL_CHECK.json`; final test30762 bytes,
Main-captured SHA-256
`2bd64e91080980920246513ca2ec5da5ee3f889e6dfac8e48e88085054996744`.
The previously pending P2G107 cut now retains exact member ENTRY refusal plus
the source-reviewed31/32-prefix94-call boundary controls. Runtime, caps, profile,
frozen scalar library and checked artifacts remain unchanged. Focused types exit0
and final fixture/two-helper/Vitest lint0 errors/0 warnings are Main-reported.
Earlier UNRUN, first failure and pending checkpoints remain historical evidence.

Builder performed documentary append only, no execution/hash/check. Main's final
post-pin verification and P2 acceptance decision are still pending;109 finite
controls do not establish deep AST equivalence, native/RSS closure, mathematical
results or authority to enter P3 or a real-source lane.

### Appended final post-pin/accounting checkpoint

Main reports36/36 post-check pins match (20 frozen +16 current artifacts), with
evidence in `docs/verification/TIP-081A_P2_GRAMMAR_AFTER_PINS.json`.
Final Main cumulative867323.494582/900000ms leaves32676.505418ms, without reset
or resource increase. Back reports no W1–W5 code/control blocker for the scoped
synthetic engineering cut. Main's authoritative `GRAMMAR_COMPLETION` report and
ACTIVE/handoff acceptance append are being written separately for scoped full
P2 engineering6/6; preserved prior pending paragraphs describe historical cuts.
This Builder append is not that acceptance/routing authority and adds no
native/RSS/formal/math/P3/real-source claim. No scalar source, code, helper, test
or artifact was changed and no Builder effect/hash/check was performed.
