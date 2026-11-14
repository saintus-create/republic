# ── Build stage ──────────────────────────────────────────────────────────────
FROM node:24-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy manifests first for layer caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/package.json

RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build agent + web app
RUN pnpm run build

# ── Runtime stage ─────────────────────────────────────────────────────────────
FROM node:24-alpine AS runner

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy built outputs
COPY --from=builder /app/.output        ./.output
COPY --from=builder /app/apps/web/dist  ./apps/web/dist
COPY --from=builder /app/node_modules   ./node_modules
COPY --from=builder /app/package.json   ./package.json

# Persistent volume for session state (workflow data)
VOLUME ["/app/.eve"]

# Agent port (eve) and web app port
EXPOSE 3000 4173

# Start both services — agent on 3000, web on 4173
CMD ["sh", "-c", "node .output/server/index.mjs & pnpm run start:web"]
