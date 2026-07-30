FROM node:24-bookworm-slim@sha256:6f7b03f7c2c8e2e784dcf9295400527b9b1270fd37b7e9a7285cf83b6951452d AS deps
WORKDIR /app
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates openssl \
  && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npm ci

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
RUN BETTER_AUTH_SECRET=build-only-placeholder-never-runtime npm run build

FROM node:24-bookworm-slim@sha256:6f7b03f7c2c8e2e784dcf9295400527b9b1270fd37b7e9a7285cf83b6951452d AS runner
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
