package game

import (
	"encoding/json"
	"testing"
)

func TestNewGameManager(t *testing.T) {
	gm := NewGameManager()
	if gm == nil {
		t.Fatal("NewGameManager returned nil")
	}
	if gm.players == nil {
		t.Fatal("players map not initialized")
	}
}

func TestAddPlayer(t *testing.T) {
	gm := NewGameManager()
	playerID := "test-player-1"

	gm.AddPlayer(playerID)

	if len(gm.players) != 1 {
		t.Errorf("Expected 1 player, got %d", len(gm.players))
	}

	player, exists := gm.players[playerID]
	if !exists {
		t.Fatal("Player not found in game manager")
	}

	if player.ID != playerID {
		t.Errorf("Expected player ID %s, got %s", playerID, player.ID)
	}

	if player.Health != 100 {
		t.Errorf("Expected health 100, got %d", player.Health)
	}

	if player.Score != 0 {
		t.Errorf("Expected score 0, got %d", player.Score)
	}
}

func TestRemovePlayer(t *testing.T) {
	gm := NewGameManager()
	playerID := "test-player-1"

	gm.AddPlayer(playerID)
	gm.RemovePlayer(playerID)

	if len(gm.players) != 0 {
		t.Errorf("Expected 0 players, got %d", len(gm.players))
	}
}

func TestProcessMoveMessage(t *testing.T) {
	gm := NewGameManager()
	playerID := "test-player-1"
	gm.AddPlayer(playerID)

	moveData := map[string]interface{}{
		"type": "move",
		"data": map[string]float64{
			"x": 150.5,
			"y": 200.3,
		},
	}

	msgBytes, err := json.Marshal(moveData)
	if err != nil {
		t.Fatalf("Failed to marshal message: %v", err)
	}

	gm.ProcessMessage(playerID, msgBytes)

	player := gm.players[playerID]
	if player.X != 150.5 {
		t.Errorf("Expected X position 150.5, got %f", player.X)
	}
	if player.Y != 200.3 {
		t.Errorf("Expected Y position 200.3, got %f", player.Y)
	}
}

func TestGetGameState(t *testing.T) {
	gm := NewGameManager()
	player1ID := "player-1"
	player2ID := "player-2"

	gm.AddPlayer(player1ID)
	gm.AddPlayer(player2ID)

	state := gm.GetGameState()

	if state == nil {
		t.Fatal("GetGameState returned nil")
	}

	if len(state.Players) != 2 {
		t.Errorf("Expected 2 players in state, got %d", len(state.Players))
	}

	if _, exists := state.Players[player1ID]; !exists {
		t.Error("Player 1 not found in game state")
	}

	if _, exists := state.Players[player2ID]; !exists {
		t.Error("Player 2 not found in game state")
	}
}

func TestConcurrentPlayerOperations(t *testing.T) {
	gm := NewGameManager()
	
	// Add players concurrently
	done := make(chan bool)
	for i := 0; i < 10; i++ {
		go func(id int) {
			playerID := string(rune('A' + id))
			gm.AddPlayer(playerID)
			done <- true
		}(i)
	}

	// Wait for all goroutines
	for i := 0; i < 10; i++ {
		<-done
	}

	if len(gm.players) != 10 {
		t.Errorf("Expected 10 players, got %d", len(gm.players))
	}
}
