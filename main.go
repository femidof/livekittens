package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/joho/godotenv"
	auth "github.com/livekit/protocol/auth"
)

var ApiKey = ""
var ApiSecret = ""

type EndpointRequest struct {
	RoomName        string `json:"roomName"`
	ParticipantName string `json:"participantName"`
	Publishing      bool   `json:"publishing,omitempty"`
}

type EndpointResponse struct {
	Token      string `json:"token"`
	Identity   string `json:"identity"`
	CanPublish bool   `json:"can_publish"`
	Room       string `json:"room"`
}

func generateToken(apiKey string, apiSecret string, room string, identity string, canPublish bool) (string, error) {
	at := auth.NewAccessToken(apiKey, apiSecret)
	grant := &auth.VideoGrant{
		RoomJoin: true,
		Room:     room,
	}
	at.AddGrant(grant).
		SetIdentity(identity).
		SetValidFor(time.Hour)
	return at.ToJWT()
}

func tokenHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "*")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != "POST" && r.Method != "OPTIONS" {
		http.Error(w, "Unsupported method. Please check.", http.StatusNotFound)
		return
	}

	decoder := json.NewDecoder(r.Body)
	var request EndpointRequest
	err := decoder.Decode(&request)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	var canPub bool
	if request.Publishing {
		canPub = true
	} else {
		canPub = false
	}
	token, error := generateToken(ApiKey, ApiSecret, request.RoomName, request.ParticipantName, canPub)
	if error != nil {
		log.Fatal(error)
	}
	response := EndpointResponse{Token: token, Identity: request.ParticipantName, CanPublish: canPub, Room: request.RoomName}
	w.Header().Set("Content-Type", "application/json")
	fmt.Println(response)
	json.NewEncoder(w).Encode(response)
}

func main() {

	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Access environment variables
	ApiKey = os.Getenv("LIVEKIT_API_KEY")
	ApiSecret = os.Getenv("LIVEKIT_API_SECRET")

	http.HandleFunc("/token", tokenHandler)
	fmt.Printf("Starting server at port 8082\n")

	if err := http.ListenAndServe(":80", nil); err != nil {
		log.Fatal(err)
	}
}
