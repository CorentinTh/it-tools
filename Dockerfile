# ── Stage 1: Build the Vue frontend ──────────────────────────────────────────
FROM node:20-alpine AS build-stage

ENV NPM_CONFIG_LOGLEVEL=warn
ENV CI=true

WORKDIR /app

RUN npm install -g pnpm@9.11.0

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN NODE_OPTIONS=--max_old_space_size=4096 pnpm exec vite build

# ── Stage 2: Production image (nginx + API server) ───────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

# Install nginx alongside Node.js
RUN apk add --no-cache nginx

RUN npm install -g pnpm@9.11.0

# Copy package manifests and tsconfig for server
COPY package.json pnpm-lock.yaml tsconfig.server.json ./

# Install all deps (tsx is a devDep needed at runtime)
RUN pnpm install --frozen-lockfile

# Copy server source and the src/ files the server imports
COPY server/ ./server/
COPY src/ ./src/

# Copy built Vue frontend from build stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/http.d/default.conf

# Expose HTTP port
EXPOSE 80

ENV API_PORT=3001

# Start nginx + API server
CMD sh -c "nginx && pnpm api:start"
