# ---- Stage 1: Build ----
FROM node:22 AS builder

WORKDIR /app

COPY package.json package-lock.json ./

# Use npm install instead of npm ci so that npm resolves
# platform-specific optional dependencies (e.g. @nx/nx-linux-x64-gnu)
# for the Linux build environment, even if the lockfile was
# generated on macOS.
RUN npm install

COPY . .

ENV NX_DAEMON=false

RUN npx nx build users-service --prod --skip-nx-cache

# ---- Stage 2: Runtime ----
FROM node:22-alpine AS runner

WORKDIR /app

COPY --from=builder /app/apps/users-service/dist ./

EXPOSE 3000

CMD ["node", "main.js"]