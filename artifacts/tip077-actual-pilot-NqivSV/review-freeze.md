# TIP-077 postgrading projection freeze

All six final submissions were verified before the first reviewer prompt.
First grader request19 started2026-10-05T16:32:09.652089Z.
No solver has seen references or another arm's outputs.

Independent reviewer1: prepare-review.py
SHAe1fe8ae29ae060a0a195be14a6223531102d70ef0cf1f9632dfb580392bf950b.
Main read all151lines; AST/four fake controls passed before use.

Reference-aided reviewer2: prepare-review-reference.py
SHA01b3a0f5891c93db6c410e0c7ae79f94aaa246fd63bbab94f125a5f49d195c30.
Main read all109lines; AST/three fake controls passed before use.
Original X/Y proof bytes remain untouched; no prior verdict is provided.

Official shortlist acquired after all six seals, before graders:
https://www.imo-official.org/assets/documents/problems/2024/IMO2024SL.pdf
Notes use A1, N4 and C7 only; they aid comparison, not substitute for proof audit.
Reference pins:
- p1-reference.txt:2e1b1c73bc3314369e3b34592f282a3add414be1c2531eb2b529e9ba62883e81
- p2-reference.txt:0819b5903d9c9e04794f8a79ef058114d55f7d131a76ea1ff364834293d88fd5
- p3-reference.txt:bee3a03e404beb93ed18605ead305de362e4f43df39570564b498e3a6c750af4

Mapping fixed before grading: P1X=METHOD,Y=DIRECT; P2X=DIRECT,Y=METHOD;
P3X=METHOD,Y=DIRECT. Prose self-identification is not redacted.
Reviewer requests19/20,21/22,23/24. Each pair480s from its first dispatch,
all setup/transfer/waiting included; no time refresh. Both reviews share
4command slots/120s tool time/512KiB retained trace; each proof/review<=32KiB.
Disagreement/refusal remains inconclusive. No post-verdict repair.
