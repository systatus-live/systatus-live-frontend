FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 angular

COPY --from=builder --chown=angular:nodejs /app/dist/systatus-live-frontend ./dist/systatus-live-frontend

USER angular

EXPOSE 4000

CMD ["node", "dist/systatus-live-frontend/server/server.mjs"]
