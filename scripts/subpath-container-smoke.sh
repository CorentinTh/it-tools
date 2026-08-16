#!/bin/sh
set -eu

image=${1:-it-tools:subpath-smoke}
container="it-tools-subpath-smoke-$$"

cleanup() {
  docker rm --force "$container" >/dev/null 2>&1 || true
}

trap cleanup EXIT INT TERM

docker run --detach \
  --name "$container" \
  --read-only \
  --tmpfs /tmp:rw,noexec,nosuid,size=16m \
  --cap-drop=ALL \
  --publish 127.0.0.1:18082:8080 \
  "$image" >/dev/null

attempt=0
until curl -fsS http://127.0.0.1:18082/healthz >/dev/null; do
  attempt=$((attempt + 1))
  if [ "$attempt" -ge 30 ]; then
    docker logs "$container" >&2 || true
    echo 'subpath-container-smoke: container did not become ready' >&2
    exit 1
  fi
  sleep 1
done

node scripts/reverse-proxy-smoke.mjs http://127.0.0.1:18082 18083 /it-tools/
