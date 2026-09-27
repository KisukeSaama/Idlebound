# syntax=docker/dockerfile:1.7
# Build context: repository root (npm workspaces).
FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY packages/game/package.json packages/game/
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
RUN npm ci --workspace @idlebound/api --include-workspace-root --no-audit --no-fund

FROM deps AS build
COPY tsconfig.base.json ./
COPY packages/game packages/game
COPY apps/api apps/api
RUN npm run build -w @idlebound/api

# Final image: a single JavaScript file (dependencies included) + the SQL migrations.
FROM node:24-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build --chown=node:node /app/apps/api/dist ./
USER node
EXPOSE 8000
CMD ["node", "--enable-source-maps", "index.js"]
