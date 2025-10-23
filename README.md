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

### Prerequisites

- Node.js (v18 or higher)
- Go (v1.21 or higher)
- Optional: Supabase account for database features

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

## License

MIT
