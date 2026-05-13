# ---- Stage 1: Build ----
FROM node:22-alpine AS builder

WORKDIR /app

# Copiar package files del monorepo
COPY package.json package-lock.json ./

# Instalar todas las dependencias (necesarias para el build de Nx)
RUN npm ci --ignore-scripts

# Copiar el monorepo completo
COPY . .

# Desactivar Nx Daemon en CI
ENV NX_DAEMON=false

# Build solo del api-gateway (Nx solo compila lo necesario)
RUN npx nx build users-service --prod --skip-nx-cache

# ---- Stage 2: Runtime ----
FROM node:22-alpine AS runner

WORKDIR /app

# Copiar solo el bundle generado por webpack
COPY --from=builder /app/apps/api-gateway/dist ./

EXPOSE 3000

CMD ["node", "main.js"]
