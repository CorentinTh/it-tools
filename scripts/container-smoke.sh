#!/bin/sh
set -eu

image=${1:-it-tools:smoke}
default_container="it-tools-smoke-default-$$"
arbitrary_container="it-tools-smoke-arbitrary-$$"

cleanup() {
  docker rm --force "$default_container" "$arbitrary_container" >/dev/null 2>&1 || true
}

trap cleanup EXIT INT TERM

fail() {
  echo "container-smoke: $*" >&2
  for failed_container in "$default_container" "$arbitrary_container"; do
    if docker inspect "$failed_container" >/dev/null 2>&1; then
      echo "container-smoke: logs for $failed_container" >&2
      docker logs "$failed_container" >&2 || true
    fi
  done
  exit 1
}

assert_contains() {
  haystack=$1
  needle=$2
  description=$3

  printf '%s' "$haystack" | grep -Fqi "$needle" || fail "$description (missing: $needle)"
}

assert_status() {
  base_url=$1
  path=$2
  expected=$3
  actual=$(curl -sS -o /dev/null -w '%{http_code}' "${base_url}${path}")

  [ "$actual" = "$expected" ] || fail "$path returned $actual, expected $expected"
}

wait_until_healthy() {
  container=$1
  attempt=0

  while [ "$attempt" -lt 30 ]; do
    state=$(docker inspect --format '{{.State.Status}}' "$container")
    health=$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{end}}' "$container")

    [ "$state" = running ] || {
      docker logs "$container" >&2
      fail "$container exited before becoming healthy"
    }

    if [ "$health" = healthy ]; then
      return
    fi

    attempt=$((attempt + 1))
    sleep 1
  done

  docker logs "$container" >&2
  fail "$container did not become healthy"
}

start_container() {
  container=$1
  host_port=$2
  internal_port=$3
  runtime_user=$4

  if [ -n "$runtime_user" ]; then
    docker run --detach \
      --name "$container" \
      --user "$runtime_user" \
      --read-only \
      --tmpfs /tmp:rw,noexec,nosuid,size=16m \
      --cap-drop=ALL \
      --health-interval=1s \
      --health-timeout=2s \
      --health-start-period=1s \
      --health-retries=10 \
      --env "NGINX_PORT=$internal_port" \
      --publish "127.0.0.1:${host_port}:${internal_port}" \
      "$image" >/dev/null
  else
    docker run --detach \
      --name "$container" \
      --read-only \
      --tmpfs /tmp:rw,noexec,nosuid,size=16m \
      --cap-drop=ALL \
      --health-interval=1s \
      --health-timeout=2s \
      --health-start-period=1s \
      --health-retries=10 \
      --env "NGINX_PORT=$internal_port" \
      --publish "127.0.0.1:${host_port}:${internal_port}" \
      "$image" >/dev/null
  fi

  wait_until_healthy "$container"
}

assert_runtime_identity() {
  container=$1
  expected_uid=$2
  actual_uid=$(docker exec "$container" id -u)

  [ "$actual_uid" = "$expected_uid" ] \
    || fail "$container runs as UID $actual_uid, expected $expected_uid"

  artifact_owner=$(docker exec "$container" stat -c '%u:%g' /usr/share/nginx/html/index.html)
  [ "$artifact_owner" = '0:0' ] \
    || fail "production artifact is owned by $artifact_owner, expected root:root"

  docker exec "$container" sh -c 'test ! -w /usr/share/nginx/html/index.html' \
    || fail 'runtime user can modify the production artifact'
  docker exec "$container" sh -c 'test ! -w /etc/nginx/nginx.conf' \
    || fail 'runtime user can modify nginx.conf'
}

verify_http_contract() {
  container=$1
  host_port=$2
  base_url="http://127.0.0.1:${host_port}"

  root_headers=$(curl -fsS -D - -o /dev/null "$base_url/")
  assert_contains "$root_headers" 'HTTP/1.1 200' 'root document status'
  assert_contains "$root_headers" 'Cache-Control: no-cache, no-store, must-revalidate' 'root document cache policy'
  assert_contains "$root_headers" 'X-Content-Type-Options: nosniff' 'nosniff security header'
  assert_contains "$root_headers" 'X-Frame-Options: DENY' 'frame security header'
  assert_contains "$root_headers" 'Referrer-Policy: no-referrer' 'referrer security header'

  assert_status "$base_url" '/healthz' 200
  assert_status "$base_url" '/text-diff' 200
  assert_status "$base_url" '/assets/not-present.js' 404
  assert_status "$base_url" '/workbox-deadbeef.js' 404
  assert_status "$base_url" '/missing-static-file.png' 404
  assert_status "$base_url" '/missing-static-file.map' 404
  assert_status "$base_url" '/missing-static-file.txt' 404
  assert_status "$base_url" '/missing-static-file.wasm' 404
  assert_status "$base_url" '/missing-static-file.xml' 404

  font_asset=$(docker exec "$container" find /usr/share/nginx/html/assets \
    -type f -name Standard.flf -print | head -n 1)
  [ -n "$font_asset" ] || fail 'unable to discover the local Figlet Standard font'
  font_url=${font_asset#/usr/share/nginx/html}
  font_headers=$(curl -fsS -H 'Accept-Encoding: gzip' -D - -o /dev/null \
    "$base_url$font_url")
  assert_contains "$font_headers" 'Cache-Control: public, max-age=31536000, immutable' 'local Figlet font cache policy'

  index_html=$(curl -fsS "$base_url/")
  shell_asset=$(printf '%s' "$index_html" | grep -Eo 'assets/index-[a-f0-9]{8,64}\.js' | head -n 1)
  [ -n "$shell_asset" ] || fail 'unable to discover the hashed shell asset'

  asset_headers=$(curl -fsS -H 'Accept-Encoding: gzip' -D - -o /dev/null "$base_url/$shell_asset")
  assert_contains "$asset_headers" 'Cache-Control: public, max-age=31536000, immutable' 'hashed asset cache policy'
  assert_contains "$asset_headers" 'Content-Encoding: gzip' 'hashed asset gzip delivery'

  service_worker=$(curl -fsS "$base_url/sw.js")
  workbox_module=$(printf '%s' "$service_worker" | grep -Eo 'workbox-[a-f0-9]{8,64}' | head -n 1)
  [ -n "$workbox_module" ] || fail 'unable to discover the Workbox runtime asset'
  workbox_asset="${workbox_module}.js"

  workbox_headers=$(curl -fsS -D - -o /dev/null "$base_url/$workbox_asset")
  assert_contains "$workbox_headers" 'Cache-Control: public, max-age=31536000, immutable' 'Workbox cache policy'

  privacy_probe="it-tools-private-query-$$"
  curl -fsS -H "Referer: https://example.test/$privacy_probe" "$base_url/?value=$privacy_probe" >/dev/null
  logs=$(docker logs "$container" 2>&1)
  case "$logs" in
    *"$privacy_probe"*) fail 'nginx access log exposed a query string or referrer' ;;
  esac
}

start_container "$default_container" 18080 8080 ''
assert_runtime_identity "$default_container" 101
verify_http_contract "$default_container" 18080
docker stop "$default_container" >/dev/null

start_container "$arbitrary_container" 18081 18081 '12345:12345'
assert_runtime_identity "$arbitrary_container" 12345
verify_http_contract "$arbitrary_container" 18081
docker stop "$arbitrary_container" >/dev/null

echo 'container-smoke: default and arbitrary-UID contracts passed'
