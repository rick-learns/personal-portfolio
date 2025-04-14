package main

import (
	"fmt"
	"log"
	"os"
	"strconv"

	"github.com/rick-learns/portfolio-backend/config"
	"github.com/rick-learns/portfolio-backend/routes"
	"github.com/rick-learns/portfolio-backend/services"
	"go.uber.org/zap"
)

func main() {
	// Initialize logger
	logger := services.NewLogger()
	defer logger.Sync()

	// Initialize database
	db, err := services.NewBadgerDB()
	if err != nil {
		logger.Fatal("Failed to initialize database", 
			zap.String("error", err.Error()),
		)
	}
	defer db.Close()

	// Create application configuration
	appConfig := config.NewAppConfig(logger, db)

	// Setup routes
	app := routes.SetupRoutes(appConfig)

	// Get port from environment or use default
	port := getPort()
	
	// Start server
	logger.Info("Server starting on port " + port)
	if err := app.Listen(port); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}

// getPort returns the port to use, either from the PORT environment variable
// or a default fallback port
func getPort() string {
	// First try the PORT environment variable (commonly used in hosting platforms)
	if envPort := os.Getenv("PORT"); envPort != "" {
		// Check if it's a valid number
		if _, err := strconv.Atoi(envPort); err == nil {
			return ":" + envPort
		}
	}
	
	// If we have a PORT in .env file, use that
	if envPort := os.Getenv("PORT"); envPort != "" {
		return ":" + envPort
	}
	
	// Find an available port starting from 8081 (since 8080 is in use)
	for port := 8081; port < 8100; port++ {
		portStr := fmt.Sprintf(":%d", port)
		fmt.Printf("Trying port %s...\n", portStr)
		return portStr // For simplicity, just return the first alternative port
	}
	
	// Fallback to 8081 if we couldn't find an available port
	return ":8081"
}