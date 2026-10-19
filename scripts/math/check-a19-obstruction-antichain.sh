#!/usr/bin/env bash
set -euo pipefail

task_repo_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)"
task_checker_image="sha256:c542cece2ffa8b9c0dde9855e80fa8af5041504d888548e240b5dc65a838600a"
task_expected_provenance="0c3323271991c2dfe75f8be7d21bf93886419736|4.10.0|sha256:e251cad58fa2b8010782259d7df19eda2529dfbc1dcd0d511d3412d62eee7e3f"
task_actual_provenance="$(docker image inspect --format '{{index .Config.Labels "org.hiveos.leanchecker.commit"}}|{{index .Config.Labels "org.hiveos.lean.version"}}|{{index .Config.Labels "org.hiveos.replay.base"}}' "$task_checker_image")"
if [[ "$task_actual_provenance" != "$task_expected_provenance" ]]; then
  printf 'A19 checker provenance mismatch\n' >&2
  exit 1
fi

docker run --rm --pull never --platform linux/amd64 \
  --network none --read-only --cap-drop ALL --security-opt no-new-privileges:true \
  --pids-limit 64 --memory 1g --memory-swap 1g --cpus 1 --user 1000:1000 \
  --tmpfs /tmp:rw,noexec,nosuid,nodev,size=16m,mode=1777 \
  --tmpfs /work:rw,nosuid,nodev,size=64m,mode=1777 \
  --mount "type=bind,src=$task_repo_dir/scripts/math/formal,dst=/certificate,readonly" \
  --entrypoint timeout "$task_checker_image" 180 sh -lc '
set -eu
cp /certificate/a19_obstruction_antichain.lean /work/A19.lean
cd /work
lean -o A19.olean A19.lean
LEAN_PATH=/work /usr/local/bin/lean4checker --fresh A19
printf "HIVEOS_A19_FRESH_REPLAY_OK\n"
'
