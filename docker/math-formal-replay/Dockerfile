# Local pilot only. The base image and checker source are pinned independently.
FROM leanprovercommunity/mathlib@sha256:e251cad58fa2b8010782259d7df19eda2529dfbc1dcd0d511d3412d62eee7e3f AS checker-build
ENV ELAN_TOOLCHAIN=stable
WORKDIR /home/lean
RUN git clone --depth 1 --branch v4.10.0 https://github.com/leanprover/lean4checker.git /home/lean/lean4checker \
    && cd /home/lean/lean4checker \
    && test "$(git rev-parse HEAD)" = "0c3323271991c2dfe75f8be7d21bf93886419736" \
    && lake build lean4checker

FROM leanprovercommunity/mathlib@sha256:e251cad58fa2b8010782259d7df19eda2529dfbc1dcd0d511d3412d62eee7e3f
LABEL org.hiveos.leanchecker.commit="0c3323271991c2dfe75f8be7d21bf93886419736" \
      org.hiveos.lean.version="4.10.0" \
      org.hiveos.replay.base="sha256:e251cad58fa2b8010782259d7df19eda2529dfbc1dcd0d511d3412d62eee7e3f"
COPY --from=checker-build /home/lean/lean4checker/.lake/build/bin/lean4checker /usr/local/bin/lean4checker
