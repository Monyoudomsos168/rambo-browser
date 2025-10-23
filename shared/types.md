# Shared Types Documentation

This document defines the shared types and message formats used between the frontend and backend.

## Message Types

### Client to Server Messages

#### Move Message
```json
{
  "type": "move",
  "data": {
    "x": 150.5,
    "y": 200.3
  }
}
```

#### Shoot Message
```json
{
  "type": "shoot",
  "data": {
    "targetX": 300.0,
    "targetY": 250.0
  }
}
```

#### Update Username Message
```json
{
  "type": "update_username",
  "data": {
    "username": "PlayerName"
  }
}
```

### Server to Client Messages

#### Game State Update
```json
{
  "type": "state_update",
  "data": {
    "players": {
      "player-id-1": {
        "id": "player-id-1",
        "x": 100.0,
        "y": 150.0,
        "health": 100,
        "score": 50,
        "username": "Player1"
      },
      "player-id-2": {
        "id": "player-id-2",
        "x": 200.0,
        "y": 250.0,
        "health": 80,
        "score": 30,
        "username": "Player2"
      }
    }
  }
}
```

## Data Types

### Player
- `id` (string): Unique player identifier (UUID)
- `x` (number): Player's X coordinate
- `y` (number): Player's Y coordinate
- `health` (number): Player's health (0-100)
- `score` (number): Player's score
- `username` (string): Player's display name

### GameState
- `players` (map[string]Player): Map of player IDs to Player objects

## WebSocket Connection

- **URL**: `ws://localhost:8080/ws` (development)
- **Protocol**: WebSocket (RFC 6455)
- **Message Format**: JSON

## HTTP Endpoints

### Health Check
- **URL**: `/health`
- **Method**: GET
- **Response**: `OK` (200)

### WebSocket Endpoint
- **URL**: `/ws`
- **Method**: GET (WebSocket upgrade)
- **Protocol**: WebSocket
