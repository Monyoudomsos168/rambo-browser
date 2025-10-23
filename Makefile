.PHONY: all build-backend build-frontend build run-backend run-frontend clean test help docker-build docker-up docker-down docker-logs docker-dev-up docker-dev-down

# Default target
all: build

# Build both backend and frontend
build: build-backend build-frontend

# Build backend
build-backend:
	@echo "Building backend..."
	cd backend && go build -o bin/server ./cmd/server

# Build frontend
build-frontend:
	@echo "Building frontend..."
	cd frontend && npm run build

# Run backend server
run-backend:
	@echo "Starting backend server..."
	cd backend && go run cmd/server/main.go

# Run frontend dev server
run-frontend:
	@echo "Starting frontend dev server..."
	cd frontend && npm run dev

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	rm -rf backend/bin
	rm -rf frontend/dist

# Run tests
test:
	@echo "Running Go tests..."
	cd backend && go test ./...

# Install dependencies
install-deps:
	@echo "Installing backend dependencies..."
	cd backend && go mod download
	@echo "Installing frontend dependencies..."
	cd frontend && npm install

# Format code
fmt:
	@echo "Formatting Go code..."
	cd backend && go fmt ./...

# Help
help:
	@echo "Available targets:"
	@echo "  make build          - Build both backend and frontend"
	@echo "  make build-backend  - Build backend only"
	@echo "  make build-frontend - Build frontend only"
	@echo "  make run-backend    - Run backend server"
	@echo "  make run-frontend   - Run frontend dev server"
	@echo "  make clean          - Clean build artifacts"
	@echo "  make test           - Run tests"
	@echo "  make install-deps   - Install all dependencies"
	@echo "  make fmt            - Format Go code"
	@echo ""
	@echo "Docker targets:"
	@echo "  make docker-build   - Build Docker image"
	@echo "  make docker-up      - Start application in Docker (production mode)"
	@echo "  make docker-down    - Stop Docker containers"
	@echo "  make docker-logs    - View Docker container logs"
	@echo "  make docker-dev-up  - Start application in Docker (development mode with hot reload)"
	@echo "  make docker-dev-down - Stop Docker development containers"
	@echo "  make help           - Show this help message"

# Docker targets
docker-build:
	@echo "Building frontend first..."
	cd frontend && npm install && npm run build
	@echo "Building Docker image..."
	docker build -f Dockerfile.simple -t rambo-browser:latest .

docker-up:
	@echo "Building frontend if needed..."
	@if [ ! -d "frontend/dist" ]; then \
		echo "Frontend not built. Building now..."; \
		cd frontend && npm install && npm run build; \
	fi
	@echo "Starting application with Docker Compose..."
	docker compose up -d --build
	@echo "Application is running at http://localhost:8080"

docker-down:
	@echo "Stopping Docker containers..."
	docker compose down

docker-logs:
	@echo "Viewing Docker logs..."
	docker compose logs -f

docker-dev-up:
	@echo "Starting application in development mode with Docker Compose..."
	docker compose -f docker-compose.dev.yml up -d
	@echo "Frontend dev server: http://localhost:3000"
	@echo "Backend server: http://localhost:8080"

docker-dev-down:
	@echo "Stopping Docker development containers..."
	docker compose -f docker-compose.dev.yml down
