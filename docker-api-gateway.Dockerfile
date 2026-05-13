FROM node:22 AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

RUN npm install --no-save @nx/nx-linux-x64-gnu@22.7.1

ARG CACHEBUST=1

COPY . .

RUN cp nx.ci.json nx.json

ENV NX_DAEMON=false
ENV NX_DISABLE_DB=true

RUN npx nx build @mi-app/shared --skip-nx-cache
RUN npx nx build api-gateway --prod --skip-nx-cache

FROM node:22-alpine AS runner

WORKDIR /app

COPY --from=builder /app/apps/api-gateway/dist ./

EXPOSE 3000

CMD ["node", "main.js"]