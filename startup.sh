#!/bin/sh

# Generate the nginx.conf with PORT env or default to 80
cat > /etc/nginx/conf.d/default.conf <<EOF
server {
    listen ${PORT:-80};
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
EOF
