FROM node:24-bookworm-slim@sha256:6f7b03f7c2c8e2e784dcf9295400527b9b1270fd37b7e9a7285cf83b6951452d AS deps
WORKDIR /app
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates openssl \
  && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npm ci

FROM deps AS migrator
ARG VCS_REF=unknown
LABEL org.opencontainers.image.revision=$VCS_REF
COPY scripts/db ./scripts/db
USER node
CMD ["npm", "run", "db:bootstrap"]

FROM node:24-bookworm-slim@sha256:6f7b03f7c2c8e2e784dcf9295400527b9b1270fd37b7e9a7285cf83b6951452d AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PHASE=phase-production-build
ENV DATABASE_URL=postgresql://build:build@localhost:5432/hiveos_build
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY next-env.d.ts next.config.ts postcss.config.mjs tsconfig.json ./
COPY prisma ./prisma
COPY public ./public
COPY scripts/build ./scripts/build
COPY src ./src
# Better Auth initializes while Next collects routes. This non-secret,
# build-scoped placeholder is never copied as runtime configuration.
# Cross-architecture release builders cannot execute Turbopack's native host
# binary reliably. Next.js 16 explicitly supports Webpack as the production
# build fallback; the resulting standalone runtime contract is unchanged.
RUN BETTER_AUTH_SECRET=build-only-placeholder-never-runtime npx next build --webpack \
  && node scripts/build/scrub-standalone-env.mjs \
  && node scripts/build/prepare-standalone-assets.mjs

FROM node:24-bookworm-slim@sha256:6f7b03f7c2c8e2e784dcf9295400527b9b1270fd37b7e9a7285cf83b6951452d AS runner
ARG VCS_REF=unknown
LABEL org.opencontainers.image.revision=$VCS_REF
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates openssl \
  && rm -rf /var/lib/apt/lists/* \
  && groupadd --gid 1001 hiveos \
  && useradd --uid 1001 --gid hiveos --create-home hiveos
COPY --from=builder --chown=hiveos:hiveos /app/public ./public
COPY --from=builder --chown=hiveos:hiveos /app/.next/standalone ./
COPY --from=builder --chown=hiveos:hiveos /app/.next/static ./.next/static
USER hiveos
EXPOSE 3000
CMD ["node", "server.js"]
