package main

import (
	"log"
	"net/http"
	"os"

	"github.com/Monyoudomsos168/rambo-browser/internal/game"
	"github.com/Monyoudomsos168/rambo-browser/internal/websocket"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Initialize game manager
	gameManager := game.NewGameManager()

	// Initialize WebSocket hub
	hub := websocket.NewHub(gameManager)
	go hub.Run()

	// HTTP routes
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		websocket.ServeWs(hub, w, r)
	})

	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})

	// Serve static files (frontend)
	// Support both local development and Docker deployment
	staticDir := os.Getenv("STATIC_DIR")
	if staticDir == "" {
		staticDir = "../frontend/dist"
	}
	fs := http.FileServer(http.Dir(staticDir))
	http.Handle("/", fs)

	log.Printf("Server starting on port %s", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
