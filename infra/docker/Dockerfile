FROM node:24.22.1-bookworm-slim AS build
WORKDIR /app
RUN npm install --global pnpm@11.25.0
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @kord/api build
ARG EXPO_PUBLIC_API_URL
ENV EXPO_PUBLIC_API_URL=$EXPO_PUBLIC_API_URL
RUN pnpm --filter @kord/client build

FROM node:24.22.1-bookworm-slim AS api
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/apps/api ./apps/api
USER node
WORKDIR /app/apps/api
EXPOSE 3000
CMD ["node", "dist/index.js"]

FROM caddy:2.10.2-alpine AS web
COPY infra/caddy/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/apps/client/dist /srv
