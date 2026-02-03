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

# Build frontend (creates dist/ folder)
RUN npm run build

# Stage 2: Build Backend
FROM node:20-alpine AS backend-builder

WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./backend/

# Install backend dependencies
WORKDIR /app/backend
RUN npm install

# Copy backend source code
COPY backend/ .

# Build backend TypeScript
RUN npm run build:server

# Stage 3: Production
FROM node:20-alpine

WORKDIR /app

# Copy backend package files and install production dependencies only
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install --production

# Copy built backend from builder stage
COPY --from=backend-builder /app/backend/dist ./dist

# Copy built frontend from frontend-builder stage
COPY --from=frontend-builder /app/dist ../dist

# Copy backend source files needed at runtime
COPY backend/prisma ./prisma
COPY backend/.env* ./

# Expose the port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Run the application
CMD ["npm", "start"]
