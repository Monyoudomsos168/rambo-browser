package database

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

// SupabaseClient represents a client for interacting with Supabase
type SupabaseClient struct {
	URL    string
	APIKey string
	client *http.Client
}

// NewSupabaseClient creates a new Supabase client
func NewSupabaseClient() *SupabaseClient {
	return &SupabaseClient{
		URL:    os.Getenv("SUPABASE_URL"),
		APIKey: os.Getenv("SUPABASE_API_KEY"),
		client: &http.Client{},
	}
}

// PlayerScore represents a player's score record in the database
type PlayerScore struct {
	ID        string `json:"id,omitempty"`
	PlayerID  string `json:"player_id"`
	Username  string `json:"username"`
	Score     int    `json:"score"`
	CreatedAt string `json:"created_at,omitempty"`
}

// SaveScore saves a player's score to the database
func (s *SupabaseClient) SaveScore(score *PlayerScore) error {
	if s.URL == "" || s.APIKey == "" {
		return fmt.Errorf("Supabase credentials not configured")
	}

	data, err := json.Marshal(score)
	if err != nil {
		return err
	}

	req, err := http.NewRequest("POST", s.URL+"/rest/v1/scores", bytes.NewBuffer(data))
	if err != nil {
		return err
	}

	req.Header.Set("apikey", s.APIKey)
	req.Header.Set("Authorization", "Bearer "+s.APIKey)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Prefer", "return=representation")

	resp, err := s.client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated && resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("failed to save score: %s", string(body))
	}

	return nil
}

// GetTopScores retrieves the top scores from the database
func (s *SupabaseClient) GetTopScores(limit int) ([]PlayerScore, error) {
	if s.URL == "" || s.APIKey == "" {
		return nil, fmt.Errorf("Supabase credentials not configured")
	}

	req, err := http.NewRequest("GET", fmt.Sprintf("%s/rest/v1/scores?order=score.desc&limit=%d", s.URL, limit), nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("apikey", s.APIKey)
	req.Header.Set("Authorization", "Bearer "+s.APIKey)

	resp, err := s.client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("failed to get scores: %s", string(body))
	}

	var scores []PlayerScore
	if err := json.NewDecoder(resp.Body).Decode(&scores); err != nil {
		return nil, err
	}

	return scores, nil
}
