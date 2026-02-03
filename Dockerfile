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

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Copy backend package files and install production dependencies
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install --production

# Copy backend source code
COPY backend/ .

# Copy built frontend from frontend-builder stage
COPY --from=frontend-builder /app/dist ../dist

# Expose the port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Run the application
CMD ["npm", "start"]
