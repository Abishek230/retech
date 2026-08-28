# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies based on root workspace
COPY package*.json ./
COPY database/package*.json ./database/
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

RUN npm ci

# Copy database & frontend source
COPY database ./database
COPY frontend ./frontend

WORKDIR /app/database
RUN npm run build

WORKDIR /app/frontend
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

# Stage 2: Production Standalone Runner
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/frontend/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/frontend/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/frontend/package.json ./package.json

USER nextjs
EXPOSE 3000

CMD ["npm", "start"]
