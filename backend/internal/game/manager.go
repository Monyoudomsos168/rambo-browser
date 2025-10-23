package game

import (
	"encoding/json"
	"log"
	"sync"
)

// Player represents a player in the game
type Player struct {
	ID       string  `json:"id"`
	X        float64 `json:"x"`
	Y        float64 `json:"y"`
	Health   int     `json:"health"`
	Score    int     `json:"score"`
	Username string  `json:"username"`
}

// GameState represents the current state of the game
type GameState struct {
	Players map[string]*Player `json:"players"`
}

// Message represents a message from a client
type Message struct {
	Type string          `json:"type"`
	Data json.RawMessage `json:"data"`
}

// GameManager manages the game state and player interactions
type GameManager struct {
	mu      sync.RWMutex
	players map[string]*Player
}

// NewGameManager creates a new GameManager
func NewGameManager() *GameManager {
	return &GameManager{
		players: make(map[string]*Player),
	}
}

// AddPlayer adds a new player to the game
func (gm *GameManager) AddPlayer(id string) {
	gm.mu.Lock()
	defer gm.mu.Unlock()

	// Create username from ID, using first 8 chars if available
	username := "Player_" + id
	if len(id) > 8 {
		username = "Player_" + id[:8]
	}

	gm.players[id] = &Player{
		ID:       id,
		X:        100,
		Y:        100,
		Health:   100,
		Score:    0,
		Username: username,
	}

	log.Printf("Player %s joined the game", id)
}

// RemovePlayer removes a player from the game
func (gm *GameManager) RemovePlayer(id string) {
	gm.mu.Lock()
	defer gm.mu.Unlock()

	delete(gm.players, id)
	log.Printf("Player %s left the game", id)
}

// ProcessMessage processes a message from a player
func (gm *GameManager) ProcessMessage(playerID string, data []byte) {
	var msg Message
	if err := json.Unmarshal(data, &msg); err != nil {
		log.Printf("Error unmarshaling message: %v", err)
		return
	}

	gm.mu.Lock()
	defer gm.mu.Unlock()

	player, exists := gm.players[playerID]
	if !exists {
		return
	}

	switch msg.Type {
	case "move":
		var moveData struct {
			X float64 `json:"x"`
			Y float64 `json:"y"`
		}
		if err := json.Unmarshal(msg.Data, &moveData); err != nil {
			log.Printf("Error unmarshaling move data: %v", err)
			return
		}
		player.X = moveData.X
		player.Y = moveData.Y

	case "shoot":
		// Handle shooting logic here
		log.Printf("Player %s shot", playerID)

	case "update_username":
		var nameData struct {
			Username string `json:"username"`
		}
		if err := json.Unmarshal(msg.Data, &nameData); err != nil {
			log.Printf("Error unmarshaling username data: %v", err)
			return
		}
		player.Username = nameData.Username
	}
}

// GetGameState returns the current game state
func (gm *GameManager) GetGameState() *GameState {
	gm.mu.RLock()
	defer gm.mu.RUnlock()

	return &GameState{
		Players: gm.players,
	}
}
