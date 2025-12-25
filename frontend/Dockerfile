# ==============================================================================
# Multi-Stage Dockerfile for ResumeLint Frontend
# Supports both development (Vite HMR) and production (nginx) builds
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Base - Common dependencies for all stages
# ------------------------------------------------------------------------------
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# ------------------------------------------------------------------------------
# Stage 2: Development - Vite dev server with HMR
# ------------------------------------------------------------------------------
FROM base AS development

# Install all dependencies (including devDependencies)
RUN npm ci

# Copy source code and config files
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start Vite dev server with HMR
# --host 0.0.0.0 allows external access to the container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ------------------------------------------------------------------------------
# Stage 3: Builder - Build production static assets
# ------------------------------------------------------------------------------
FROM base AS builder

# Install all dependencies (needed for build)
RUN npm ci

# Copy source code
COPY . .

# Build production static files
RUN npm run build

# ------------------------------------------------------------------------------
# Stage 4: Production - Nginx serving static files
# ------------------------------------------------------------------------------
FROM nginx:alpine AS production

# Install curl for health checks
RUN apk add --no-cache curl

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built static files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Create non-root user for nginx
RUN addgroup -g 1001 -S nginx-runner && \
    adduser -S nginx-runner -u 1001 && \
    chown -R nginx-runner:nginx-runner /usr/share/nginx/html && \
    chown -R nginx-runner:nginx-runner /var/cache/nginx && \
    chown -R nginx-runner:nginx-runner /var/log/nginx && \
    chown -R nginx-runner:nginx-runner /etc/nginx/conf.d

# Create nginx pid directory with correct permissions
RUN touch /var/run/nginx.pid && \
    chown -R nginx-runner:nginx-runner /var/run/nginx.pid

# Switch to non-root user
USER nginx-runner

# Expose HTTP port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Start nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
