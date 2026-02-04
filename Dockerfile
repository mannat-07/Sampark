# Multi-stage build for production

# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Copy frontend package files
COPY package*.json ./
COPY bun.lockb ./

# Install frontend dependencies
RUN npm install

# Copy frontend source code
COPY . .

# Build frontend with empty API_URL to use relative paths
ENV VITE_API_URL=""
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Copy backend package files and install production dependencies
COPY backend/package*.json ./backend/
WORKDIR /app/backend

# Install all dependencies (including tsx which is needed to run TypeScript)
RUN npm install

# Copy backend source code
COPY backend/ .

# Generate Prisma Client
RUN npx prisma generate

# Copy built frontend from frontend-builder stage
COPY --from=frontend-builder /app/dist ../dist

# Expose the port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

# Run the application
CMD ["npm", "start"]
