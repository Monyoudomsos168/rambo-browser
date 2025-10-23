.PHONY: all build-backend build-frontend build run-backend run-frontend clean test help

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
	@echo "  make help           - Show this help message"
