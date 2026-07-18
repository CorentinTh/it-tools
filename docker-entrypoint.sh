#!/bin/sh
set -eu

NGINX_PORT="${NGINX_PORT:-8080}"

case "$NGINX_PORT" in
  ''|*[!0-9]*)
    echo "NGINX_PORT must be an integer between 1024 and 65535" >&2
    exit 1
    ;;
esac

if [ "$NGINX_PORT" -lt 1024 ] || [ "$NGINX_PORT" -gt 65535 ]; then
  echo "NGINX_PORT must be an integer between 1024 and 65535" >&2
  exit 1
fi

export NGINX_PORT

config_dir=/tmp/it-tools-nginx
mkdir -p "$config_dir"
envsubst '${NGINX_PORT}' < /etc/nginx/templates/default.conf.template > "$config_dir/default.conf"

exec nginx -g 'daemon off;'
