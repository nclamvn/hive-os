# TIP-071 BRIDGE independent cross-review

Reviewer: BRIDGE builder, reviewing CHECKER and STORE read-only after their final product freeze. Date: 2026-10-04, Asia/Ho_Chi_Minh.

Result: **0 remaining P0/P1 findings identified in the offline fixture scope.** This is a source-level peer review, not Contractor acceptance, production security certification, mathematical novelty, or live M1/E2E acceptance. No frozen product was edited during this review.

## Reviewed product fingerprints

The following SHA-256 values were read from the actual shared-workspace bytes, rather than accepted only from peer messages:

```text
f3db6c7aeda285d9d32506b0d36a23830c4c0e21092926339dd7fe77373ea6b4 src/modules/research-sandbox/math-lrc-shift-replay.ts
aa32e8cb90d6470460c8b37083109b814c7fd968b77817a9275300e97538c9c4 src/modules/research-sandbox/math-lrc-durable-replay.ts
29897c95057f9c09e48e9534052b0b072d15049d81a84b5b260ab5e84b590286 src/server/operations/math-diagnostic-capture-v2.ts
47406316d7c81217aec7d3773b9e4d65567814feab54b7ad1cba819f22e6ffa2 src/server/operations/math-method-unit-durable-replay.ts
```

The first three files were the independently reviewed CHECKER/STORE products. The fourth pins the already-frozen BRIDGE integration context; this reviewer does not claim independent review of their own implementation.

## Mathematical and budget review

The independent checker reconstructs phase boundaries using its own exact integer arithmetic. For a unit multiplier, the roots of the strict bad-phase condition occur on the `15*d` lattice; open-cell representatives use the `30*d` lattice. It checks every boundary and adjacent open interval, including the cyclic wrap, rather than sampling only proposed witnesses. Equality at `1/15` and `14/15` is GOOD, consistent with the strict inequality. Tuple masks, complement masks, cardinalities and the common-shift witness are recomputed independently before accepting the certificate/result digest.

The arithmetic reconstruction does not call the original producer, consumer or phase helper. An old result type import is not a second implementation. Input descriptors, JSON shape/size/depth, rational components and intermediate arithmetic are bounded before positive acceptance. Unsupported scope is not upgraded to proof. The admitted finite scopes remain `d=3,e=2` and `d=5,e=2..4`; an exact one-survivor result does not become a claim of at least two survivors or a global LRC theorem.

The checker consumes the host's remaining operation/time budget rather than resetting the full budget. Actual checker elapsed time and charged operations are returned. The BRIDGE context subtracts the original producer/consumer operations before independent replay, retains two actual calls, and uses one outer finite clock across original work, durable finite IO, replay and pre-critic receipt/readback. The post-ledger metrics retain the same operation/checker-time totals and cannot lower the pre-critic elapsed observation or exceed the approved ceiling. The pre-critic serialization does not falsely predict its own final fsync timestamp. This remains a cooperative bounded deadline, not an OS-level preemption or sandbox guarantee.

## Prepared lineage and durable evidence review

Full prepared records are checked against the existing strict schema and renderer validation, immutable case/run/contract/role context, expected solver attempt and critic finite evidence. The old semantic payload `inputDigest` is preserved as `roleInputDigest`; `preparedByteDigest` separately hashes the full prepared file. These two values are not conflated or retroactively substituted in ledger v7. The three transport manifests bind the actual prepared/stdout files and both prepared digest forms; post-ledger readback checks actual retained files rather than accepting self-declared transport hashes alone.

The named original producer/checker source path and the named independent-checker source path are compared explicitly. Matching a hash under an unrelated key does not satisfy the anchor. The existing method preset and finite predicate remain explicitly mapped; they are not incorrectly treated as identical enum strings.

The pre-critic receipt binds finite bytes, input/certificate/result, source pin, seed/unit and original attempt/adversary anchors without referring to the later ledger. The separate post-ledger receipt refers to that pre-critic digest and the final scoped ledger/review/dossier/worker/transport anchors. A final create-only commit marker is required before committed readback. Receipt expiry cannot extend the earliest original descriptor/claim expiry or renew the pre-critic lease.

Store construction and process-local opaque handles are fixture-only. Production construction refuses before private-root IO. The STORE rechecks the injected fixture authority fence before and after underlying asynchronous IO, including opened-file acquisition, and closes an acquired handle when post-open authorization fails. It checks ownership, mode, ancestor identities, no-follow opens, link counts and immutable byte hashes. Failures quarantine the process-local capture; unknown/partial outcomes retain their evidence rather than minting admission or automatically recovering.

## Reservation and quota review

The three role slots are allocated together under one create-only quota lock. The spent intent is recomputed from descriptor digest plus approved nonce. Existing V2 reservations must agree on the descriptor, exact three unique slot IDs and role-to-directory assignments across a complete three-role group. Duplicated, reordered/aliased, incomplete or unknown reservation history stops allocation rather than being counted as a fresh safe intent.

The single 100-slot/128-MiB root quota counts legacy V1 and V2 history conservatively. The slot reservation stays 1,146,880 bytes; prepared/stdout/finite limits remain 49,152/1,048,576/32,768 bytes. All control files within a slot share one 16,384-byte allowance, not a new allowance for every receipt. Expired or partial history does not free quota automatically. With these exact limits, valid 100-slot history cannot independently exhaust the larger 128-MiB byte ceiling; no fabricated oversized positive test is claimed. Unknown maintenance layouts stop new allocation pending authenticated integration.

## Evidence and limitations

Source and relevant adversarial test cases were inspected read-only. The CHECKER owner reports 79/79 passing owned tests; the final STORE completion report records 58/58 passing owned tests and owned lint exit 0. Those peer-owned suite counts are attributed evidence, not a claim that this reviewer reran their selectors. This review made no DB/model/network/browser/server/install/Git call and ran no actual private-root or campaign workflow.

The remaining production obligations are intentional scope boundaries, not waived requirements: TIP-072 must supply actual authenticated actor/tenant/command/outbox/lease/source/root fencing, real role transport retention and current-agent integration. Fixture callbacks, synthetic source pins and process-local expected preparations do not certify that production ingress. TIP-073 requires a separate approved actual M1 before a campaign. All reviewed positive outputs remain `FINITE_ONLY`, `dispatchAllowed=false`, `proofClosure=false`, and global/real-time/formal/external/novelty `NOT_ESTABLISHED`.
