# ---- Stage 1: Build ----
FROM node:22 AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

ENV NX_DAEMON=false

RUN npx nx build users-service --prod --skip-nx-cache

# ---- Stage 2: Runtime ----
FROM node:22-alpine AS runner

WORKDIR /app

COPY --from=builder /app/apps/users-service/dist ./

EXPOSE 3000

CMD ["node", "main.js"]