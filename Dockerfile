# build stage
FROM node:lts-alpine AS build-stage
WORKDIR /app
COPY . .
RUN npm install -g pnpm
RUN pnpm i --frozen-lockfile
RUN pnpm build

# production stage
FROM nginx:stable-alpine AS production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY startup.sh /docker-entrypoint.d/startup.sh
ENV PORT 80
EXPOSE ${PORT}
CMD ["nginx", "-g", "daemon off;"]
