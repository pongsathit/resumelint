# Docker Setup for ResumeLint

Complete guide for running ResumeLint with Docker. Supports both development (with hot-reload) and production environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Development Mode](#development-mode)
- [Production Mode](#production-mode)
- [Common Commands](#common-commands)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Architecture](#architecture)

---

## Prerequisites

- **Docker**: Version 20.10 or higher
- **Docker Compose**: Version 2.0 or higher

Check your versions:
```bash
docker --version
docker-compose --version
```

---

## Quick Start

### 1. Clone and Setup Environment

```bash
# Copy environment files
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 2. Start Development Environment

```bash
# Start all services with hot-reload
docker-compose up

# Or start in detached mode
docker-compose up -d
```

### 3. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health

### 4. Stop Services

```bash
# Stop containers
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

---

## Development Mode

Development mode includes hot-reload for both frontend and backend.

### Start Development

```bash
docker-compose up
```

**Features:**
- ✅ **Frontend HMR**: Vite Hot Module Replacement for instant UI updates
- ✅ **Backend Hot-Reload**: ts-node-dev automatically restarts on code changes
- ✅ **Volume Mounts**: Source code mounted as read-only volumes
- ✅ **Debug Friendly**: Full source maps and error messages

### How Hot-Reload Works

**Frontend:**
1. Edit files in `frontend/src/`
2. Vite detects changes instantly
3. Browser updates without full reload (< 100ms)

**Backend:**
1. Edit files in `backend/src/`
2. ts-node-dev detects changes
3. Server restarts automatically (~2-3 seconds)

### View Logs

```bash
# Follow all logs
docker-compose logs -f

# Frontend only
docker-compose logs -f frontend

# Backend only
docker-compose logs -f backend
```

### Execute Commands in Containers

```bash
# Run npm commands in backend
docker-compose exec backend npm run typecheck

# Run npm commands in frontend
docker-compose exec frontend npm run lint

# Open shell in backend
docker-compose exec backend sh

# Open shell in frontend
docker-compose exec frontend sh
```

---

## Production Mode

Production mode uses optimized builds with minimal image sizes.

### Build and Run Production

```bash
# Build and start production containers
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### Access Production Services

- **Frontend**: http://localhost (nginx on port 80)
- **Backend API**: http://localhost:3000

### Production Optimizations

**Frontend:**
- Static files served by nginx
- Gzip compression enabled
- Aggressive caching for assets
- SPA routing support
- Minimal image size (~40MB)

**Backend:**
- TypeScript compiled to JavaScript
- Only production dependencies
- Non-root user for security
- Health checks enabled
- Minimal image size (~120MB)

### Stop Production

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down
```

---

## Common Commands

### Build Commands

```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build backend
docker-compose build frontend

# Build with no cache
docker-compose build --no-cache

# Build production images
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build
```

### Container Management

```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# Restart services
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### Cleanup

```bash
# Remove containers and networks
docker-compose down

# Remove containers, networks, and volumes
docker-compose down -v

# Remove containers, networks, volumes, and images
docker-compose down -v --rmi local

# Prune all unused Docker resources
docker system prune -a --volumes
```

### Monitoring

```bash
# Check service status
docker-compose ps

# View resource usage
docker stats

# Inspect container
docker inspect resumelint-backend
docker inspect resumelint-frontend

# Check health status
docker-compose ps | grep healthy
```

---

## Configuration

### Environment Variables

#### Root `.env` (Docker Compose)
```env
COMPOSE_PROJECT_NAME=resumelint
NODE_ENV=development
BACKEND_PORT=3000
FRONTEND_PORT=5173
FRONTEND_PORT_PROD=80
```

#### Backend `.env`
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key-here
```

#### Frontend `.env`
```env
# For local development without Docker
VITE_API_URL=http://localhost:3000

# For Docker development (inside containers)
VITE_API_URL=http://backend:3000
```

### Port Configuration

Default ports:
- **Frontend Dev**: 5173
- **Frontend Prod**: 80
- **Backend**: 3000

To change ports, update `.env`:
```env
BACKEND_PORT=4000
FRONTEND_PORT=8080
FRONTEND_PORT_PROD=8000
```

Then restart:
```bash
docker-compose down && docker-compose up
```

---

## Troubleshooting

### Port Already in Use

**Problem:** `Error: port is already allocated`

**Solution:**
```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process (macOS/Linux)
kill -9 $(lsof -ti:3000)

# Or change port in .env
BACKEND_PORT=4000
```

### Hot-Reload Not Working

**Problem:** Code changes not reflecting

**Solutions:**

1. **Check volume mounts:**
   ```bash
   docker-compose ps
   docker inspect resumelint-frontend | grep Mounts -A 10
   ```

2. **Restart the service:**
   ```bash
   docker-compose restart frontend
   docker-compose restart backend
   ```

3. **Rebuild containers:**
   ```bash
   docker-compose down
   docker-compose up --build
   ```

### Container Health Check Failing

**Problem:** Backend shows unhealthy status

**Solutions:**

1. **Check backend logs:**
   ```bash
   docker-compose logs backend
   ```

2. **Test health endpoint manually:**
   ```bash
   docker-compose exec backend curl http://localhost:3000/health
   ```

3. **Restart with fresh build:**
   ```bash
   docker-compose down
   docker-compose up --build
   ```

### Permission Errors (macOS/Linux)

**Problem:** `EACCES: permission denied`

**Solutions:**

1. **Check file permissions:**
   ```bash
   ls -la frontend/src
   ls -la backend/src
   ```

2. **Fix permissions:**
   ```bash
   chmod -R 755 frontend/src
   chmod -R 755 backend/src
   ```

### Build Failures

**Problem:** Docker build fails

**Solutions:**

1. **Clear Docker cache:**
   ```bash
   docker-compose build --no-cache
   ```

2. **Check Dockerfile syntax:**
   ```bash
   docker build -f backend/Dockerfile backend
   docker build -f frontend/Dockerfile frontend
   ```

3. **Update Docker:**
   ```bash
   docker --version  # Should be 20.10+
   docker-compose --version  # Should be 2.0+
   ```

### Network Issues

**Problem:** Frontend can't reach backend

**Solutions:**

1. **Check network:**
   ```bash
   docker network ls
   docker network inspect resumelint-network
   ```

2. **Verify service names:**
   - Frontend should use `http://backend:3000`
   - Not `http://localhost:3000` inside containers

3. **Restart network:**
   ```bash
   docker-compose down
   docker network prune
   docker-compose up
   ```

### Out of Disk Space

**Problem:** `no space left on device`

**Solutions:**

```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Complete cleanup
docker system prune -a --volumes
```

---

## Architecture

### Service Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Host Machine                         │
│                                                          │
│  ┌────────────────────┐      ┌─────────────────────┐   │
│  │   Frontend         │      │   Backend           │   │
│  │                    │      │                     │   │
│  │   Development:     │      │   Development:      │   │
│  │   Port 5173        │◄────►│   Port 3000         │   │
│  │   Vite HMR         │      │   ts-node-dev       │   │
│  │                    │      │   Hot-reload        │   │
│  │   Production:      │      │                     │   │
│  │   Port 80          │      │   Production:       │   │
│  │   nginx            │      │   Compiled JS       │   │
│  └────────────────────┘      └─────────────────────┘   │
│           │                            │                │
│           └────────────┬───────────────┘                │
│                        │                                │
│              ┌─────────▼─────────┐                      │
│              │  Docker Network   │                      │
│              │  resumelint-      │                      │
│              │  network          │                      │
│              └───────────────────┘                      │
└─────────────────────────────────────────────────────────┘
```

### Volume Mounts (Development)

```
Host                          Container
────────────────────         ─────────────────
frontend/src/        ──────► /app/src/ (ro)
frontend/public/     ──────► /app/public/ (ro)
frontend/.env        ──────► /app/.env (ro)

backend/src/         ──────► /app/src/ (ro)
backend/.env         ──────► /app/.env (ro)
```

### Build Stages

**Backend Dockerfile:**
1. `base` - Install dependencies
2. `development` - Dev server with ts-node-dev
3. `builder` - Compile TypeScript
4. `production` - Minimal runtime with compiled JS

**Frontend Dockerfile:**
1. `base` - Install dependencies
2. `development` - Vite dev server
3. `builder` - Build static files
4. `production` - nginx serving static files

---

## Best Practices

### Development Workflow

1. **Start fresh each day:**
   ```bash
   docker-compose down
   docker-compose up
   ```

2. **Watch logs during development:**
   ```bash
   docker-compose logs -f
   ```

3. **Rebuild after dependency changes:**
   ```bash
   docker-compose down
   docker-compose build
   docker-compose up
   ```

### Security Tips

1. **Never commit `.env` files**
   - Always use `.env.example` as template
   - Add `.env` to `.gitignore`

2. **Use secrets for production**
   - Use Docker secrets or environment variable injection
   - Never hardcode credentials

3. **Keep images updated**
   ```bash
   docker-compose pull
   docker-compose build --pull
   ```

### Performance Tips

1. **Use BuildKit for faster builds:**
   ```bash
   export DOCKER_BUILDKIT=1
   export COMPOSE_DOCKER_CLI_BUILD=1
   ```

2. **Leverage layer caching:**
   - Dependencies rarely change → cached
   - Source code changes often → rebuilt

3. **Clean up regularly:**
   ```bash
   docker system prune -a --volumes
   ```

---

## Support

For issues or questions:
1. Check [Troubleshooting](#troubleshooting) section
2. Review container logs: `docker-compose logs`
3. Verify configuration files match examples
4. Ensure Docker and Docker Compose are up to date

---

## License

This Docker configuration is part of the ResumeLint project.
