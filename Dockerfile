# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY . .
RUN npm install -g pnpm
RUN pnpm i --frozen-lockfile
RUN pnpm build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]