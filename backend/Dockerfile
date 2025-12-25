# ==============================================================================
# Multi-Stage Dockerfile for ResumeLint Backend
# Supports both development (with hot-reload) and production builds
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Base - Common dependencies for all stages
# ------------------------------------------------------------------------------
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    curl \
    tini

# Copy package files
COPY package*.json ./

# ------------------------------------------------------------------------------
# Stage 2: Development - Hot reload with ts-node-dev
# ------------------------------------------------------------------------------
FROM base AS development

# Install all dependencies (including devDependencies)
RUN npm ci

# Copy source code
COPY . .

# Expose backend port
EXPOSE 3000

# Use tini to handle signals properly
ENTRYPOINT ["/sbin/tini", "--"]

# Start development server with hot-reload
CMD ["npm", "run", "dev"]

# ------------------------------------------------------------------------------
# Stage 3: Builder - Compile TypeScript for production
# ------------------------------------------------------------------------------
FROM base AS builder

# Install all dependencies (needed for build)
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

# ------------------------------------------------------------------------------
# Stage 4: Production - Minimal runtime image
# ------------------------------------------------------------------------------
FROM node:20-alpine AS production

# Set working directory
WORKDIR /app

# Install only curl for health checks
RUN apk add --no-cache curl tini

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Copy built JavaScript from builder stage
COPY --from=builder /app/dist ./dist

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership to non-root user
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose backend port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Use tini to handle signals properly
ENTRYPOINT ["/sbin/tini", "--"]

# Start production server
CMD ["node", "dist/server.js"]
