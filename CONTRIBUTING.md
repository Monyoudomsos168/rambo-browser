# Contributing to Rambo Browser Game

Thank you for your interest in contributing to the Rambo Browser Game!

## Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/rambo-browser.git
   cd rambo-browser
   ```
3. Install dependencies:
   ```bash
   make install-deps
   ```

## Making Changes

### Backend (Go)

1. Make your changes in the `backend/` directory
2. Format your code:
   ```bash
   make fmt
   ```
3. Build and test:
   ```bash
   make build-backend
   make test
   ```

### Frontend (TypeScript)

1. Make your changes in the `frontend/src/` directory
2. Type check your code:
   ```bash
   cd frontend && npm run type-check
   ```
3. Build:
   ```bash
   make build-frontend
   ```

## Code Style

- **Go**: Follow standard Go conventions (use `gofmt`)
- **TypeScript**: Use strict mode, follow TypeScript best practices
- **Commits**: Write clear, descriptive commit messages

## Testing

- Run backend tests: `cd backend && go test ./...`
- Manual testing: Start both backend and frontend servers and test gameplay

## Submitting Changes

1. Create a new branch: `git checkout -b feature/your-feature-name`
2. Make your changes and commit them
3. Push to your fork: `git push origin feature/your-feature-name`
4. Open a Pull Request

## Questions?

Feel free to open an issue if you have any questions or need help!
