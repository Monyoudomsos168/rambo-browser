# Rambo Browser Game

A multiplayer browser-based game built with TypeScript, Go, WebSocket, and Supabase.

## Architecture

- **Frontend**: TypeScript with HTML5 Canvas
- **Backend**: Go with WebSocket support
- **Multiplayer**: Real-time WebSocket communication
- **Database**: Supabase integration for persistent storage

## Project Structure

```
rambo-browser/
├── frontend/           # TypeScript frontend
│   ├── src/
│   │   ├── index.ts           # Main entry point
│   │   ├── game.ts            # Game logic
│   │   ├── websocket-client.ts # WebSocket client
│   │   ├── game-renderer.ts   # Canvas rendering
│   │   ├── input-handler.ts   # Input handling
│   │   └── index.html         # HTML template
│   ├── package.json
│   ├── tsconfig.json
│   └── webpack.config.js
├── backend/            # Go backend
│   ├── cmd/server/     # Server entry point
│   ├── internal/
│   │   ├── websocket/  # WebSocket hub and client
│   │   ├── game/       # Game state management
│   │   └── database/   # Supabase integration
│   └── go.mod
└── shared/             # Shared types and constants

```

## Getting Started

### Recommended: Using Docker (Easiest)

The simplest way to run the application is using Docker. See the [Docker Deployment](#docker-deployment) section below for detailed instructions.

**Quick start:**
```bash
git clone https://github.com/Monyoudomsos168/rambo-browser.git
cd rambo-browser
docker compose up -d
# Access at http://localhost:8080
```

### Alternative: Local Development Setup

If you prefer to run without Docker or need to develop the application:

### Prerequisites

- Node.js (v18 or higher)
- Go (v1.21 or higher)
- Make (optional, for using Makefile commands)
- Optional: Supabase account for database features

### Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/Monyoudomsos168/rambo-browser.git
   cd rambo-browser
   ```

2. Install dependencies:
   ```bash
   make install-deps
   ```

3. Build the application:
   ```bash
   make build
   ```

4. Run the backend server (in one terminal):
   ```bash
   make run-backend
   ```

5. Run the frontend dev server (in another terminal):
   ```bash
   make run-frontend
   ```

6. Open your browser and navigate to `http://localhost:3000`

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Go dependencies:
   ```bash
   go mod download
   ```

3. (Optional) Set up Supabase credentials:
   ```bash
   export SUPABASE_URL=your_supabase_url
   export SUPABASE_API_KEY=your_supabase_api_key
   ```

4. Build and run the server:
   ```bash
   go run cmd/server/main.go
   ```

   Or build the binary:
   ```bash
   go build -o bin/server cmd/server/main.go
   ./bin/server
   ```

The server will start on port 8080 (or the port specified in the `PORT` environment variable).

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. For development with hot reload:
   ```bash
   npm run dev
   ```
   This starts the webpack dev server on port 3000.

4. For production build:
   ```bash
   npm run build
   ```
   The built files will be in the `dist/` directory.

### Running the Complete Application

1. Start the backend server:
   ```bash
   cd backend
   go run cmd/server/main.go
   ```

2. In a separate terminal, start the frontend dev server:
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Game Controls

- **Movement**: WASD or Arrow Keys
- **Shoot**: Mouse Click

## Features

- Real-time multiplayer gameplay
- WebSocket-based communication
- Canvas-based rendering
- Player movement and shooting
- Health and score tracking
- Persistent storage with Supabase (optional)

## Development

### Frontend Development

The frontend is built with TypeScript and uses Webpack for bundling. Key files:

- `game.ts`: Main game loop and logic
- `websocket-client.ts`: WebSocket connection management
- `game-renderer.ts`: Canvas rendering engine
- `input-handler.ts`: Keyboard and mouse input handling

### Backend Development

The backend is written in Go and uses gorilla/websocket for WebSocket support. Key packages:

- `cmd/server`: HTTP server and routing
- `internal/websocket`: WebSocket hub and client management
- `internal/game`: Game state and player management
- `internal/database`: Supabase integration

### Type Checking

Run TypeScript type checking:
```bash
cd frontend
npm run type-check
```

## Supabase Setup (Optional)

To enable database features, create a Supabase project and set up the following table:

```sql
CREATE TABLE scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id TEXT NOT NULL,
  username TEXT NOT NULL,
  score INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

Then set the environment variables:
```bash
export SUPABASE_URL=https://your-project.supabase.co
export SUPABASE_API_KEY=your-api-key
```

## Docker Deployment

The easiest way to run Rambo Browser Game is using Docker. This method doesn't require installing Node.js or Go on your system.

> 📖 **For detailed Docker documentation, see [DOCKER.md](DOCKER.md)**

### Prerequisites for Docker

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)

### Quick Start with Docker

1. Clone the repository:
   ```bash
   git clone https://github.com/Monyoudomsos168/rambo-browser.git
   cd rambo-browser
   ```

2. (Optional) Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env file with your Supabase credentials if needed
   ```

3. Build and start the application:
   ```bash
   docker compose up -d
   ```
   Or using Make:
   ```bash
   make docker-up
   ```

4. Access the game at `http://localhost:8080`

5. To stop the application:
   ```bash
   docker compose down
   ```
   Or using Make:
   ```bash
   make docker-down
   ```

### Docker Development Mode

For development with hot-reload capabilities:

1. Start the development environment:
   ```bash
   docker compose -f docker-compose.dev.yml up
   ```
   Or using Make:
   ```bash
   make docker-dev-up
   ```

2. Access the application:
   - Frontend (with hot reload): `http://localhost:3000`
   - Backend API: `http://localhost:8080`

3. Make changes to the code - the application will automatically reload

4. Stop the development environment:
   ```bash
   docker compose -f docker-compose.dev.yml down
   ```
   Or using Make:
   ```bash
   make docker-dev-down
   ```

### Docker Commands Reference

| Command | Description |
|---------|-------------|
| `make docker-build` | Build Docker image |
| `make docker-up` | Start application (production mode) |
| `make docker-down` | Stop application |
| `make docker-logs` | View application logs |
| `make docker-dev-up` | Start in development mode with hot reload |
| `make docker-dev-down` | Stop development environment |

### Docker Environment Variables

Create a `.env` file in the project root to configure the application:

```bash
# Optional: Supabase configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_API_KEY=your-api-key-here
```

### Docker Troubleshooting

**Container won't start:**
```bash
# View logs
docker compose logs -f

# Rebuild containers
docker compose up --build
```

**Port already in use:**
```bash
# Change the port in docker-compose.yml
ports:
  - "8081:8080"  # Change 8080 to 8081 or any available port
```

**Clear everything and start fresh:**
```bash
docker compose down -v
docker compose up --build
```

## Local Development (Without Docker)

This is an active project. Features currently implemented:
- ✅ Real-time multiplayer WebSocket connection
- ✅ Player movement and rendering
- ✅ Canvas-based game display
- ✅ Supabase database integration (optional)
- ✅ Health and score tracking

Future enhancements:
- 🔄 Shooting mechanics
- 🔄 Collision detection
- 🔄 Power-ups and weapons
- 🔄 Game modes (team play, battle royale, etc.)
- 🔄 Leaderboard with Supabase

## License

MIT
