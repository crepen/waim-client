ARG NODE_VERSION=24.11.1
FROM node:${NODE_VERSION}-slim AS base

WORKDIR /app

FROM base AS prepare

RUN yarn global add turbo
COPY . .
RUN turbo prune @waim/client --docker

FROM base AS builder

COPY --from=prepare /app/out/json/ .

ARG CREPEN_NPM_AUTH_IDENT

ENV CREPEN_NPM_AUTH_IDENT=${CREPEN_NPM_AUTH_IDENT}

RUN echo "Check IDENT: $CREPEN_NPM_AUTH_IDENT"

RUN yarn install

COPY --from=prepare /app/out/full/ .

RUN yarn turbo build

FROM node:${NODE_VERSION}-alpine AS runner

RUN apk --no-cache add curl

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

ENV HOSTNAME=0.0.0.0
ENV PORT=3000


CMD ["node" ,"apps/web/server.js"]