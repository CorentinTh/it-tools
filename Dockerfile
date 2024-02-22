# syntax = docker/dockerfile:latest

# build stage
FROM node:lts-alpine AS build-stage

# Set environment variables for non-interactive npm installs
ENV NPM_CONFIG_LOGLEVEL warn
ENV CI true

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm i --frozen-lockfile

COPY . .

RUN pnpm build

# production stage
FROM nginxinc/nginx-unprivileged:1.25.4-alpine AS production-stage

USER root

ARG UID=101
ARG GID=101

COPY --from=build-stage /app/dist /usr/share/nginx/html/
COPY --link --chmod=755 scripts/nginx/*.sh /docker-entrypoint.d/

RUN chown $UID:0 /usr/share/nginx/html/index.html

# COPY nginx.conf /etc/nginx/conf.d/default.conf
USER $UID

# Document what port is required
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
