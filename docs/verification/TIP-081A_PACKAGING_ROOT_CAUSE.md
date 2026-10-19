# TIP-081A — Packaging root-cause analysis and next design decision

2026-10-06. Deep investigation under Owner-approved repair-only routing. This
document does not grant an application build or prove full application packaging.
Previous four build failures, source epochs and scientific records are retained.

## Evidence and hypotheses

H1: a generic macOS permission problem. Rejected as the actionable explanation:
the precise generated dependency root is a symlink to the original installation,
and the purported output threadChild.js is the SAME device/inode and realpath as
its original source. Writes there are deliberately not permitted. No user chmod,
original dependency write grant or relaxed OS policy is appropriate.

H2: only a bare link should be excluded. Rejected as a complete repair: generated
build4 has57NFT inventories/3678references but only29unique regular dependency
files1158810bytes. The server NFT lacks next/package.json. Installed NFT resolves
the shadow dependency link to a target outside its base; that resolved closure
is omitted. Removing link metadata cannot restore omitted files. Next exclusion
paths also use contains:true and may match descendants; /* does not select the
separate literal next-server path. A broad ignore is unsafe.

H3: dependency INPUT visibility and OUTPUT physical identity both need correction.
Supported by the installed NFT/Next source and generated build metadata. NFT emits
the link, resolves its target and ignores paths outside its base. Next's copier
preserves absolute links and copies later regular files through them. Lexical
containment alone is insufficient. Original copy guards correctly prevented the
write-through, but previous package admission's TRUSTED_LINK branch was unsafe as
a self-contained deployment claim. The deep repair must refuse that branch.

These conclusions use read-only evidence. Tiny executed controls and their actual
outcomes belong in the subsequent completion report, not inferred from source.

## Why previous checks did not catch the whole defect

Compiler/module-identity and environment probes checked their specific stages,
not the tracing/copy/loading path. Successful compilation and page collection do
not establish complete output. The earlier trusted dependency link made shadow
compilation possible cheaply, but was wrongly assumed safe for deployment copying.
Allowing an output dependency link could also hide missing closure at runtime by
falling back to the original installation. Unit hashes of a sparse trace cannot
establish that the trace captured everything required.

There is a second acceptance trap: installed Next copyTracedFiles catches some
per-page/route errors and logs warnings, while final server-trace errors throw.
An exit-zero build must still fail admission if expected files are missing,
symlinked, escaped or byte-changed. Deployment verification needs both metadata
and actual isolated loading; neither is a mathematical result.

## Alternatives and scope

1. Link exclusion only: NOT acceptable. It fixes neither missing closure nor
   descendant-match/parent-propagation risks.
2. Full regular physical compiler snapshot: conceptually safest, but NOT within
   approved bounds. Exact installed SWC121773448bytes alone exceeds64MiB aggregate
   copy allowance; TypeScript9112572bytes exceeds8MiB individual source-copy limit.
   No full dependency traversal/copy or limit increase occurred. Hard links are
   not a substitute: independent paths could still share writable original inodes.
3. Two-stage private build/packaging: recommended DESIGN direction for confirmation,
   not yet product implementation. Build using pinned read-only compiler resources;
   independently derive a bounded complete runtime closure; materialize regular
   private package inputs/output; verify every declared file and load with original
   fallback denied. A shadow-only output/pipeline change is beyond the previous
   loader-only overlay contract and requires explicit routing.

Two-stage design requirements before an application build request:

- Preserve original config/source/installed deps. No installed Next patch, global
  fs monkey-patch, broad trace root or arbitrary history/env/artifact reads.
- Use installed, version-checked NFT APIs. If guarded readFile/stat/readlink
  callbacks virtualize the EXACT controlled dependency-root link, every mapped
  read must be relative, nofollow, bounded and within the original approved
  installed-dependency root. All other links/escapes/unknown imports refuse.
- Retain raw build NFT inventories/digests; supplementary closure is a separately
  labelled artifact, never a silent rewrite presented as original tracing output.
  Keep every admitted original regular reference. Omit only root link metadata,
  with complete runtime/application closure demonstrated separately.
- Include package metadata, assets/fonts, native runtime dependencies if needed,
  required-server-files manifest and generated pages/app/static output. Reject
  unresolved dynamic assets/warnings rather than pretend static tracing is complete.
- Enforce existing regular-output bytes/files budget and hashes; if the actual
  closure exceeds caps, STOP before copying/consuming an application-build slot.
- Preserve raw warning/failure evidence. Require physical containment and complete
  copy audit even when Next returns0. No trusted output links or original fallback.
- Keep actual model/worker/queue flags OFF and protected test environment unchanged.
  Full application's auth/browser/formatting still need conditional E2E later.

Installed Next16.2.11 supports both explicit NFT consumption (output guide) and
an adapters API (adapterPath/onBuildComplete). The API is a possible integration
seam, NOT automatically accepted: its own trace construction and pre-standalone
ordering must be checked. Selection between a two-stage packer and an adapter
should be made against source-bound completeness/security evidence, not merely
because either suppresses the current error.

## Bounded repair this turn

TIP-081A_PACKAGING_DEEP_REPAIR.md P1–P6 permits fail-closed source guards and tiny
actual NFT -> actual Next copy -> isolated module-load controls only. Tiny owned
fixtures cover transitive/scoped/nested JS/package metadata/JSON/asset copying;
they do not validate actual Next-server bootstrap, native runtime coverage or full
product closure. Main executes effects and independently reviews frozen source.

No new application build, compiler snapshot, server, browser/E2E, DB/auth write,
scientific/model/API/LRC/Git effect follows from this diagnostic. After bounded
repair acceptance, STOP for layout/resource design confirmation before implementing
the full materialization mechanism; then a fresh bounded build grant is separate.
