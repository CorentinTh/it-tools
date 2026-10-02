# build stage
FROM node:lts-alpine AS build-stage
# Set environment variables for non-interactive npm installs
ENV NPM_CONFIG_LOGLEVEL warn
ENV CI true
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
# Pin pnpm to the version from packageManager and skip lifecycle scripts
# (none are needed for the web build; Sonar S6505/S8543).
RUN npm install --global --ignore-scripts pnpm@9.11.0 && pnpm install --frozen-lockfile --ignore-scripts
COPY . .

# Base path the app is served from (must start and end with '/'), e.g. '/tools/'
# for https://example.com/tools/. See README self-hosting section.
ARG BASE_URL=/
ENV BASE_URL=${BASE_URL}
RUN pnpm build

# production stage
FROM nginx:stable-alpine AS production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
