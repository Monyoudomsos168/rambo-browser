# Docker Installation and Usage Guide

This guide provides comprehensive instructions for running Rambo Browser Game using Docker.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Docker Compose Modes](#docker-compose-modes)
- [Configuration](#configuration)
- [Common Tasks](#common-tasks)
- [Troubleshooting](#troubleshooting)
- [Architecture](#architecture)

## Prerequisites

### Install Docker

#### Linux
```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
# Log out and log back in for group changes to take effect

# Verify installation
docker --version
docker compose version
```

#### macOS
1. Download Docker Desktop from https://www.docker.com/products/docker-desktop
2. Install and start Docker Desktop
3. Verify installation:
```bash
docker --version
docker compose version
```

#### Windows
1. Download Docker Desktop from https://www.docker.com/products/docker-desktop
2. Install Docker Desktop
3. Enable WSL 2 if prompted
4. Verify installation in PowerShell:
```powershell
docker --version
docker compose version
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Monyoudomsos168/rambo-browser.git
cd rambo-browser
```

2. Build the frontend:
```bash
cd frontend
npm install
npm run build
cd ..
```

3. (Optional) Create environment configuration:
```bash
cp .env.example .env
```

Edit `.env` file if you want to use Supabase:
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_API_KEY=your-api-key-here
```

## Quick Start

### Production Mode

Run the application in production mode (optimized, no hot reload):

**Note**: Make sure the frontend is built first (see Installation section above).

```bash
# Using Docker Compose
docker compose up -d --build

# Or using Make (automatically checks and builds frontend if needed)
make docker-up
```

Access the game at: http://localhost:8080

To stop:
```bash
docker compose down
# Or
make docker-down
```

### Development Mode

Run the application in development mode (with hot reload):

```bash
# Using Docker Compose
docker compose -f docker-compose.dev.yml up

# Or using Make
make docker-dev-up
```

Access:
- Frontend (dev server with hot reload): http://localhost:3000
- Backend API: http://localhost:8080

To stop:
```bash
docker compose -f docker-compose.dev.yml down
# Or
make docker-dev-down
```

## Docker Compose Modes

### Dockerfile Options

The project includes two Dockerfile options:

1. **Dockerfile.simple** (Recommended): Uses pre-built frontend files. More reliable and faster.
   - Requires: `cd frontend && npm install && npm run build` before building Docker image
   - Default in docker-compose.yml

2. **Dockerfile**: Full multi-stage build that builds frontend inside Docker.
   - May encounter npm issues in some Docker/network environments
   - Useful if you want everything built in Docker without local Node.js

To use the full Dockerfile, edit `docker-compose.yml` and change:
```yaml
dockerfile: Dockerfile.simple
# to
dockerfile: Dockerfile
```

### Production Mode (`docker-compose.yml`)

**Features:**
- Single container with both frontend and backend
- Multi-stage build for optimal image size
- Frontend pre-built and served as static files
- Optimized for deployment
- Health checks enabled
- Auto-restart on failure

**When to use:**
- Deploying to production
- Testing the production build
- Running on a server
- Performance testing

### Development Mode (`docker-compose.dev.yml`)

**Features:**
- Separate containers for frontend and backend
- Source code mounted as volumes
- Hot reload for both frontend and backend
- Faster iteration during development
- Real-time code changes without rebuilding

**When to use:**
- Active development
- Testing new features
- Debugging
- Learning the codebase

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```bash
# Supabase Configuration (Optional)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_API_KEY=your-supabase-anon-key
```

### Port Configuration

Default ports:
- Production: `8080`
- Development Frontend: `3000`
- Development Backend: `8080`

To change ports, edit `docker-compose.yml` or `docker-compose.dev.yml`:

```yaml
services:
  app:
    ports:
      - "8081:8080"  # External:Internal
```

## Common Tasks

### View Logs

```bash
# All logs
docker compose logs -f

# Specific service (dev mode)
docker compose -f docker-compose.dev.yml logs -f frontend
docker compose -f docker-compose.dev.yml logs -f backend

# Last 100 lines
docker compose logs --tail=100
```

### Rebuild Containers

```bash
# Production
docker compose up --build

# Development
docker compose -f docker-compose.dev.yml up --build
```

### Execute Commands in Container

```bash
# Access container shell
docker compose exec app sh

# Run a command
docker compose exec app ls -la
```

### Clean Up

```bash
# Stop and remove containers
docker compose down

# Remove containers and volumes
docker compose down -v

# Remove all unused Docker resources
docker system prune -a
```

### Update Application

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker compose down
docker compose up --build -d
```

## Troubleshooting

### Container Won't Start

**Check logs:**
```bash
docker compose logs -f
```

**Common issues:**
1. Port already in use - change port in docker-compose.yml
2. Build errors - ensure Docker has enough memory (4GB+ recommended)
3. Permission issues - run `sudo usermod -aG docker $USER` on Linux

### Application Not Accessible

**Verify container is running:**
```bash
docker compose ps
```

**Check health status:**
```bash
docker compose ps
# Should show "healthy" status
```

**Test backend directly:**
```bash
curl http://localhost:8080/health
# Should return "OK"
```

### Frontend Not Loading

**In production mode:**
- Ensure frontend was built correctly
- Check logs: `docker compose logs -f`
- Rebuild: `docker compose up --build`

**In development mode:**
- Check frontend service: `docker compose -f docker-compose.dev.yml logs -f frontend`
- Verify webpack dev server started
- Try accessing directly: http://localhost:3000

### Hot Reload Not Working (Dev Mode)

**Verify volume mounts:**
```bash
docker compose -f docker-compose.dev.yml config
```

**Restart containers:**
```bash
docker compose -f docker-compose.dev.yml restart
```

### Slow Build Times

**Use Docker BuildKit:**
```bash
export DOCKER_BUILDKIT=1
docker compose build
```

**Clean build cache:**
```bash
docker builder prune
```

### Network Issues

**Reset network:**
```bash
docker compose down
docker network prune
docker compose up
```

### Permission Errors on Linux

**Add user to docker group:**
```bash
sudo usermod -aG docker $USER
newgrp docker
```

### Out of Disk Space

**Clean up Docker resources:**
```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove everything unused
docker system prune -a --volumes
```

## Architecture

### Production Image (Dockerfile)

```
┌─────────────────────────────────────┐
│  Stage 1: Frontend Builder          │
│  - Node.js 18 Alpine                │
│  - Install npm dependencies         │
│  - Build frontend (webpack)         │
│  - Output: /app/frontend/dist       │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  Stage 2: Backend Builder           │
│  - Go 1.21 Alpine                   │
│  - Download Go modules              │
│  - Build Go binary                  │
│  - Output: /app/backend/server      │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  Stage 3: Runtime                   │
│  - Alpine Linux (minimal)           │
│  - Copy backend binary              │
│  - Copy frontend dist files         │
│  - Final image: ~20-30MB            │
└─────────────────────────────────────┘
```

### Development Setup (docker-compose.dev.yml)

```
┌──────────────────┐         ┌──────────────────┐
│  Frontend        │         │  Backend         │
│  Container       │         │  Container       │
│                  │         │                  │
│  - Node 18       │         │  - Go 1.21       │
│  - Webpack Dev   │◄────────┤  - Hot Reload    │
│  - Port 3000     │  Proxy  │  - Port 8080     │
│  - Volume Mount  │         │  - Volume Mount  │
└──────────────────┘         └──────────────────┘
        │                            │
        └────────────────┬───────────┘
                         │
                    User Browser
                  http://localhost:3000
```

## Performance Optimization

### Image Size Optimization

The production image uses:
- Multi-stage builds to minimize final image size
- Alpine Linux base for minimal footprint
- Only runtime dependencies in final image
- `.dockerignore` to exclude unnecessary files

Current production image size: ~20-30MB

### Build Performance

- Use BuildKit for parallel layer building
- Mount cache directories for npm and Go modules
- Leverage Docker layer caching

### Runtime Performance

- Health checks for automatic restart
- Minimal base image (Alpine)
- Static file serving optimized in Go

## Security Considerations

1. **Don't commit `.env` file** - contains sensitive credentials
2. **Use secrets for production** - consider Docker secrets or external secret management
3. **Regular updates** - keep base images updated
4. **Scan images** - use `docker scan` to check for vulnerabilities
5. **Non-root user** - consider running as non-root user in production

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Go Docker Best Practices](https://docs.docker.com/language/golang/)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)

## Support

If you encounter issues not covered in this guide:

1. Check the [main README](README.md)
2. Search existing [GitHub Issues](https://github.com/Monyoudomsos168/rambo-browser/issues)
3. Create a new issue with:
   - Docker version (`docker --version`)
   - Docker Compose version (`docker compose version`)
   - Operating system
   - Complete error logs
   - Steps to reproduce
