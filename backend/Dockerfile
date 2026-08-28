# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root workspace and package manifests
COPY package*.json ./
COPY database/package*.json ./database/
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

RUN npm ci

# Copy database & backend source
COPY database ./database
COPY backend ./backend

# Build database package
WORKDIR /app/database
RUN npm run build

WORKDIR /app/backend
RUN npm run build

# Stage 2: Production Runtime
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 retech

# Copy dependencies and build outputs
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/database ./database
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/package.json ./package.json

USER retech
EXPOSE 5000

CMD ["node", "dist/index.js"]
