#!/bin/sh

set -eu

PORT="${PORT:-"8080"}"

# Create nginx conf with port variable
tee /etc/nginx/nginx.conf << 'EOF' >/dev/null
worker_processes  auto;

error_log  /var/log/nginx/error.log notice;
pid        /tmp/nginx.pid;

events {
    accept_mutex off;
    worker_connections  1024;
}

http {
    proxy_temp_path /tmp/proxy_temp;
    proxy_cache_path /tmp/mycache keys_zone=mycache:50m;
    client_body_temp_path /tmp/client_temp;
    fastcgi_temp_path /tmp/fastcgi_temp;
    uwsgi_temp_path /tmp/uwsgi_temp;
    scgi_temp_path /tmp/scgi_temp;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;
    include       /etc/nginx/conf.d/*.conf;
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    sendfile_max_chunk 512k;
    sendfile        on;
    tcp_nopush     on;
    keepalive_timeout  65;
    gzip  on;

    server {
        # add proxy caches
        listen       ${PORT};

        root /usr/share/nginx/html;
        index index.html;

        # Make site accessible from http://localhost/
        server_name _;

        error_page 404 /index.html;

        location /healthz {
            return 200;
        }
    }
}
EOF

# Apply port variable
sed -i s/'${PORT}'/${PORT}/g /etc/nginx/nginx.conf

echo ""
echo "#####################"
echo "Nginx running on port $PORT"
echo "#####################"
echo ""

exec "$@"