#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_dir="$(cd "${script_dir}/../.." && pwd)"
image_tag="hiveos/lean-formal-replay:v4.10.0-0c332327"

docker build --pull=false --platform linux/amd64 \
  --file "${repo_dir}/docker/math-formal-replay/Dockerfile" \
  --tag "${image_tag}" "${repo_dir}/docker/math-formal-replay"

image_id="$(docker image inspect "${image_tag}" --format '{{.Id}}')"
case "${image_id}" in
  sha256:????????????????????????????????????????????????????????????????) ;;
  *) printf 'Unexpected replay image identity\n' >&2; exit 1 ;;
esac
printf 'MATH_FORMAL_REPLAY_IMAGE=%s\n' "${image_id}"
