# Rambo Browser Game - Architecture

## Overview

Rambo Browser Game is a real-time multiplayer browser game built with a modern tech stack. The architecture follows a client-server model with WebSocket-based real-time communication.

## Technology Stack

### Frontend
- **TypeScript**: Type-safe JavaScript for better development experience
- **HTML5 Canvas**: For game rendering
- **Webpack**: Module bundler and development server
- **WebSocket API**: For real-time client-server communication

### Backend
- **Go**: High-performance backend server
- **gorilla/websocket**: WebSocket implementation
- **google/uuid**: Unique player identification
- **net/http**: HTTP server and static file serving

### Database
- **Supabase**: PostgreSQL-based backend-as-a-service
- Stores player scores and game statistics

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Browser                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Frontend (TypeScript)                      │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐             │ │
│  │  │  Game.ts │  │ Renderer │  │  Input   │             │ │
│  │  │   Logic  │◄─┤  Canvas  │  │ Handler  │             │ │
│  │  └────┬─────┘  └──────────┘  └─────┬────┘             │ │
│  │       │                              │                  │ │
│  │       └──────────┬───────────────────┘                  │ │
│  │                  │                                      │ │
│  │          ┌───────▼────────┐                            │ │
│  │          │   WebSocket    │                            │ │
│  │          │     Client     │                            │ │
│  │          └───────┬────────┘                            │ │
│  └──────────────────┼─────────────────────────────────────┘ │
└────────────────────┼─────────────────────────────────────────┘
                     │ WebSocket (ws://)
                     │ JSON Messages
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend Server (Go)                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                   HTTP Server                         │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │  │
│  │  │   /ws    │  │  /health │  │    /     │           │  │
│  │  │WebSocket │  │ Endpoint │  │  Static  │           │  │
│  │  └────┬─────┘  └──────────┘  └──────────┘           │  │
│  └───────┼────────────────────────────────────────────────┘  │
│          │                                                    │
│  ┌───────▼────────┐                                          │
│  │  WebSocket Hub │                                          │
│  │  ┌──────────┐  │  ┌──────────────────┐                  │
│  │  │ Client 1 │  │  │   Game Manager   │                  │
│  │  ├──────────┤  │  │  ┌────────────┐  │                  │
│  │  │ Client 2 │◄─┼─►│  │   Player   │  │                  │
│  │  ├──────────┤  │  │  │   State    │  │                  │
│  │  │ Client N │  │  │  └────────────┘  │                  │
│  │  └──────────┘  │  └──────────────────┘                  │
│  └────────────────┘           │                             │
└────────────────────────────────┼─────────────────────────────┘
                                 │ HTTP REST API
                                 ▼
                      ┌──────────────────────┐
                      │      Supabase        │
                      │  (PostgreSQL DB)     │
                      │  ┌────────────────┐  │
                      │  │  scores table  │  │
                      │  └────────────────┘  │
                      └──────────────────────┘
```

## Component Details

### Frontend Components

#### 1. Game (`game.ts`)
- **Purpose**: Main game controller and loop
- **Responsibilities**:
  - Initialize WebSocket connection
  - Manage game state
  - Update game loop (60 FPS)
  - Handle user input and send to server
- **Key Methods**:
  - `start()`: Initialize and start game
  - `update(deltaTime)`: Game loop update
  - `stop()`: Clean up resources

#### 2. WebSocket Client (`websocket-client.ts`)
- **Purpose**: Manage WebSocket connection
- **Responsibilities**:
  - Establish WebSocket connection
  - Handle reconnection logic
  - Send/receive JSON messages
  - Emit events for game state updates
- **Key Methods**:
  - `connect()`: Establish connection
  - `send(type, data)`: Send message to server
  - `sendMove(x, y)`: Send player movement
  - `sendShoot(x, y)`: Send shoot action

#### 3. Game Renderer (`game-renderer.ts`)
- **Purpose**: Render game state to canvas
- **Responsibilities**:
  - Draw game grid
  - Render players
  - Draw health bars
  - Update display at 60 FPS
- **Key Methods**:
  - `render()`: Main render loop
  - `drawPlayer()`: Draw individual player
  - `startRenderLoop()`: Start animation loop

#### 4. Input Handler (`input-handler.ts`)
- **Purpose**: Capture user input
- **Responsibilities**:
  - Listen to keyboard events (WASD/Arrows)
  - Track mouse position and clicks
  - Normalize input values
- **Key Methods**:
  - `getInputState()`: Get current input state

### Backend Components

#### 1. HTTP Server (`cmd/server/main.go`)
- **Purpose**: Main server entry point
- **Responsibilities**:
  - Start HTTP server
  - Route WebSocket connections
  - Serve static frontend files
  - Health check endpoint
- **Endpoints**:
  - `GET /ws`: WebSocket upgrade
  - `GET /health`: Health check
  - `GET /*`: Static files

#### 2. WebSocket Hub (`internal/websocket/hub.go`)
- **Purpose**: Manage all WebSocket connections
- **Responsibilities**:
  - Register/unregister clients
  - Broadcast messages to all clients
  - Handle client lifecycle
- **Channels**:
  - `register`: New client connections
  - `unregister`: Client disconnections
  - `broadcast`: Messages to all clients

#### 3. WebSocket Client (`internal/websocket/client.go`)
- **Purpose**: Individual client connection
- **Responsibilities**:
  - Read messages from client
  - Write messages to client
  - Handle ping/pong for keepalive
- **Goroutines**:
  - `readPump()`: Read from WebSocket
  - `writePump()`: Write to WebSocket

#### 4. Game Manager (`internal/game/manager.go`)
- **Purpose**: Manage game state and logic
- **Responsibilities**:
  - Track all players
  - Process game actions
  - Update player positions
  - Handle game events
- **Key Methods**:
  - `AddPlayer(id)`: Add new player
  - `RemovePlayer(id)`: Remove player
  - `ProcessMessage(id, data)`: Handle game actions
  - `GetGameState()`: Get current state

#### 5. Database Client (`internal/database/supabase.go`)
- **Purpose**: Interface with Supabase database
- **Responsibilities**:
  - Save player scores
  - Retrieve leaderboard
  - Persist game data
- **Key Methods**:
  - `SaveScore(score)`: Save player score
  - `GetTopScores(limit)`: Get leaderboard

## Communication Protocol

### Message Format

All messages are JSON encoded with the following structure:

```json
{
  "type": "message_type",
  "data": { }
}
```

### Message Types

#### Client → Server

1. **move**: Player movement
   ```json
   {
     "type": "move",
     "data": { "x": 150.5, "y": 200.3 }
   }
   ```

2. **shoot**: Shooting action
   ```json
   {
     "type": "shoot",
     "data": { "targetX": 300, "targetY": 250 }
   }
   ```

3. **update_username**: Change username
   ```json
   {
     "type": "update_username",
     "data": { "username": "NewName" }
   }
   ```

#### Server → Client

1. **state_update**: Game state broadcast
   ```json
   {
     "type": "state_update",
     "data": {
       "players": {
         "uuid1": { "id": "uuid1", "x": 100, "y": 150, ... },
         "uuid2": { "id": "uuid2", "x": 200, "y": 250, ... }
       }
     }
   }
   ```

## Data Flow

### Player Join Flow

1. Player opens game in browser
2. Frontend establishes WebSocket connection to `/ws`
3. Server upgrades connection and generates UUID
4. Hub registers new client
5. GameManager adds player to game state
6. Server broadcasts updated state to all clients
7. Frontend renders updated game state

### Player Movement Flow

1. Player presses WASD/Arrow keys
2. InputHandler captures keypress
3. Game calculates new position
4. WebSocketClient sends move message
5. Server receives and validates movement
6. GameManager updates player position
7. Hub broadcasts state to all clients
8. All clients update their display

## Security Considerations

1. **Input Validation**: Server validates all player actions
2. **Rate Limiting**: Prevent spam/abuse (future enhancement)
3. **Origin Checking**: WebSocket CORS in production
4. **Secure WebSocket**: Use WSS in production
5. **Environment Variables**: Sensitive credentials in env vars

## Scalability

### Current Design
- Single server instance
- In-memory game state
- All clients on one hub

### Future Improvements
- Multiple server instances with load balancer
- Redis for shared game state
- Room/lobby system for game instances
- Database for persistent storage
- CDN for static assets

## Performance

### Frontend
- Canvas rendering at 60 FPS
- Game loop at 60 updates/second
- Optimistic UI updates for local player
- Minimal DOM manipulation

### Backend
- Goroutines for concurrent client handling
- Non-blocking message broadcasting
- Efficient JSON encoding/decoding
- Static file caching

## Development Workflow

1. **Local Development**:
   - Backend: `make run-backend`
   - Frontend: `make run-frontend` (hot reload)

2. **Production Build**:
   - `make build`
   - Deploy backend binary
   - Serve frontend from `/dist`

3. **Docker Deployment**:
   - `docker-compose up`
   - Single container with both services

## Testing Strategy

### Unit Tests
- Go: `go test ./...`
- TypeScript: (to be implemented)

### Integration Tests
- WebSocket connection tests
- Game state synchronization tests
- End-to-end gameplay tests

### Manual Testing
- Multiple browser windows
- Network latency simulation
- Load testing with multiple clients

## Monitoring

### Metrics to Track
- Active connections
- Message throughput
- Server response time
- Client FPS
- Error rates

### Logging
- Connection/disconnection events
- Player actions
- Error conditions
- Performance metrics
