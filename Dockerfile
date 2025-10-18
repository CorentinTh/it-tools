# build stage
FROM node:lts-alpine AS build-stage
# Set environment variables for non-interactive npm installs
ENV NPM_CONFIG_LOGLEVEL warn
ENV CI true

# Detect available memory and set NODE_OPTIONS with buffer of 128MB
RUN memory=$(awk '/MemTotal/{print $2}' /proc/meminfo); \
    memory=$((memory / 1024 / 1024)); \
    node_options="--max-old-space-size=$((memory - 128))"; \
    export NODE_OPTIONS="$node_options";

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm i --frozen-lockfile
COPY . .
RUN pnpm build

# production stage
FROM nginx:stable-alpine AS production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
