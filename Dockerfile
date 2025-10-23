# Multi-stage Dockerfile for Rambo Browser Game
# This Dockerfile builds both the frontend and backend into a single container

# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Install all dependencies (including devDependencies needed for build)
RUN npm ci && npm cache clean --force

# Copy frontend source
COPY frontend/ ./

# Build frontend
RUN npm run build

# Stage 2: Build Backend
FROM golang:1.23-alpine AS backend-builder

WORKDIR /app/backend

# Copy backend source (includes vendor directory)
COPY backend/ ./

# Build the application using vendored dependencies
# Use GOTOOLCHAIN=local to use the container's Go version
ENV GOTOOLCHAIN=local
RUN CGO_ENABLED=0 GOOS=linux go build -mod=vendor -a -installsuffix cgo -o server ./cmd/server

# Stage 3: Final Runtime Image
FROM alpine:latest

WORKDIR /root/

# Copy the backend binary from builder
COPY --from=backend-builder /app/backend/server .

# Copy frontend dist files (will be served by Go server)
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

CMD ["./server"]
