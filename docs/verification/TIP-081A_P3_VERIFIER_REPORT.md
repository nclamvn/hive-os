# P3 independently authored verifier — source-only handoff

Status: IMPLEMENTED DRAFT / UNRUN / INDEPENDENT REVIEW REQUIRED. No generator,
hash helper, import, parser, syntax/lint/type/unit check or protected input was
executed/read by this Builder. This report does not accept its own source.

New source: `scripts/test/private-summary-verifier-tip081-p3.mjs`, exporting only
constant lexical source text `PRIVATE_SUMMARY_VERIFIER_P3` for offline embedding.
The generated owner has private `__HIVE_P3_verifyWire(wire)`; there is no public
source/AST-taking export, arbitrary callback, path, hash or fault input.

## Independence and exact seam

The verifier independently implements closed child schemas, declaration pattern
propagation, complete two-pass per-edge traversal, syntax classification, stable
site ordering, ASCII decoder preflight, null-sanitization, manual serialization,
UTF16LE source identity, ASCII body seal and historical ledger algebra. It does
not call producer extraction/classification/ordering/decoder/hash/ledger helpers.

Shared COMMON_MODE dependencies are the privately embedded P2 grammar/allocator,
owner authentication/lifecycle, original clock, charge/escrow guards and captured
standard primitives. No independent grammar/allocator/physical theorem follows.

Internal hooks supplied by the lifecycle Builder: currentOwner, touch, abort,
consume(bucket,bytes,entries,nodes,category), replayStart/replayRetire. ReplayStart
returns a private record with ast/parseBytes/parseEntries/parseAttempts. Captures:
charCode, descriptor/setPrototype, Array/Uint8Array/Uint32Array/isArray/floor,
sliceAscii, decodeAscii/u8View and JSONParse. None is a caller
hook; the new deriver must inventory every capture and direct helper.

## Concrete policies / before-growth rows

- Global closed enum/key arrays require explicit module array/header/backing and
  literal-key costs in the new source inventory, not the old transformed-array
  assumption. No function-local SCRIPT/MODULE choice array remains.
- Verifier helper graph is acyclic. Each actual direct-helper frame can coexist
  at most once; sum its inventoried64+16*(locals+parameters) once. The old P2
  parser128-frame model is separate. DFS uses128 pre-reserved sixteen-slot frames,
  not128 function recursion and not an all-nodes catalogue.
- Fixed traversal/storage304440 = frames42088 + bindings151656 + sites110696.
  Extra private counts/result records160+144 are independently charged. Membership
  guard256 for frame policy, plus actual bindings/sites/node/array-slot memberships.
- Before each node occurrence/pass consume8168 and33 memberships: exact closed
  key-string/read envelope (32 keys/512 key units,40 descriptors each144). Each
  actual array slot consumes240+one membership before descriptor access:
 descriptor128+null-sanitize16+captured String numeric-key conversion96,
 normalized before the descriptor call. Per-stage
  visits combine both passes, ceiling200000; current ancestor cycles refuse.
- Binding capacity512 names/65536 code units is consumed before private name
  copies. Declared names conservatively AMBIGUOUS; undeclared means only no name in
  complete syntactic inventory, never ambient builtin authority. All sites OPEN.
- Preflight checks the entire primitive ASCII wire<=16384, exact keys/order/
  punctuation/enums/unsigned integers/hash64 before slice/JSON.parse/hash. Fixed
  schema depth4, max14 fields and≤512 sites is stricter than general decoder caps.
  Cursor96 is consumed before construction.
- Decoder3551608 includes value records2621440, index backing65640, strings32768,
 5150 descriptor/sanitize envelopes741600, object/array sanitization8240,
  numeric-key conversions512*96=49152 and duplicate/cursor scratch32768. Actual memberships
 28+10*siteCount are admitted before JSON.parse;8192 is a capacity, not an automatic
 8192-entry charge. All decoded objects/arrays/descriptors are null-sanitized.
- Identity and seal use independently authored pure numeric SHA-256. Each consumes
 4432: named workspace4096 for Uint32 state8/words64 and byte block64 plus their
 headers, hex backing64+header64, hex string160 and safe view48. The static64-word
 K array needs its own C01 header/backing row. Source code units are read numerically
 and streamed little-endian, including lone surrogates; ASCII body code units are
 independently read for the seal. No private text or source bytes reach native
 hash/update/digest methods. Padding uses an explicit high/low64-bit bit-length;
 current source-length cap makes that arithmetic exact. These new hash bodies
 require independent source/vector review, not author self-acceptance.
- Manual encoder reserves ASCII buffer16384+header64, cursor96, result string32800
  and view48; integers emit digits without native numeric-string allocation or
  concatenation chains. Expected model/ledger records192/288 are separate.
- VERIFY_CODEC remains the frozen3612704 capacity; source uses itemized smaller
 3610440 = decoder3551608 + preflight96 + two hashes8864 + encoder49392 +
 ledger288 + expected-record192. Its unused2264 stays charged and is never
 borrowed by VERIFY_WORK.
  VERIFY_WORK2641208 is a policy cap; exhaustion may precede theoretical visit/
  depth/site ceilings and must be reported as a conjunction, not relaxed.

## Independent historical ledger

Authenticated initial categories are checked against literal fixed conventions:
producerWork304440, summary0, replayReserved25165824, replayLive0,
scratch6758296, initialEntries257; initial base is authenticated source/tool/control
reservation. Historical producer work is recomputed from independently visited
replay counts as304440+16336*N+480*A, not the verifier's own allocation cost.
Historical entries257+commonReplayParseEntries+66*N+2*A+2*sites+uniqueBindings.
Summary90656+12864*M/scratch6667640-12864*M include actual producer-codec
consumption90656 from its unchanged92736 quota (unused2080 remains in scratch)
and authenticated metadata emission count M captured before summary
construction (0..32). Legal observations before analysis are thus retained;
observations after the historical wire do not alter this snapshot.
The metadata per-emission12864/max32 policy reserves411648; its added safe view48
accounts for the frozen1536 increase in initial scratch; the1024*96 numeric-key
conversion amendment adds98304 to VERIFY_WORK. No resource cap or
cross-bucket borrowing changed in this pre-effect codec amendment.
Historical total sums disjoint categories; peak equals the monotone total.
Producer parse bytes/attempts use separately parsed common-grammar deltas, explicitly
repeatability rather than independent allocator correctness. Wire totals/seals do
not authorize acceptance. Every compared site/status/span/count is reconstructed.

## Retirement and limits

Replay frames/binding slots are registered privately and cleared after traversal.
Before successful replayRetire the local returned parsed.ast alias is nulled and
site vectors cleared; finally also clears local replay aliases on failure. Owner
finally remains authoritative for expiry/resource/native failures and stale brand
retirement. ReplayRetire must clear state.ast/parser/replayRoot/frame/scope/binding
aliases and transfer categories without refund before VERIFIED metadata.

Known integration obligations, NOT self-CLEAR: source-derived actual helper/local
counts and new raw-array static rows; merged direct-call graph; exact escrow routing;
producer/verifier taxonomy agreement under independent review; complete enabled
grammar child-schema coverage; fixed normal/fault tuple and source review; all36
literal/adversarial controls and discriminating resource boundaries. Summary
equivalence is bounded syntactic replay only; semanticCoverage OPEN_COMMON_GRAMMAR_RISK,
allocatorCoverage COMMON_MODE, graph OPEN, predecessorOpen62, runtime NOT_ACCEPTED,
execution/materialization false. No P4/P5 or real-root authority is created.

## Pre-effect source repair history

The first draft used captured native hash contexts and chunk buffers. Main's
privacy review rejected that seam before any effect; it was replaced with the
independent pure-JS implementation described above. Back also identified outer
Member computed inheritance and MEMBER loader misclassification in the first
draft; the authored source now restricts inherited computed to CALL/NEW and uses
the outer Member's own computed flag. These were text-review findings, not test
failures. The safe ASCII view must use captured typed-array buffer/offset getters
and a captured Uint8Array constructor; species-sensitive subarray is not allowed.
The lifecycle Builder's decoder/bootstrap/cost repair remains an integration
review obligation until its exact final source is independently read.
