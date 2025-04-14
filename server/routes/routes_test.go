package routes

import (
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/dgraph-io/badger/v4"
	"github.com/gofiber/fiber/v2"
	"github.com/rick-learns/portfolio-backend/config"
	"github.com/stretchr/testify/assert"
	"go.uber.org/zap"
)

func setupTestApp() *fiber.App {
	// Create a minimal test config with mock dependencies
	logger, _ := zap.NewDevelopment()
	
	// We're not testing DB functionality, so a properly typed nil is needed here
	var mockDB *badger.DB = nil
	
	appConfig := &config.AppConfig{
		Logger: logger,
		DB:     mockDB,
	}
	
	return SetupRoutes(appConfig)
}

func TestHealthCheckEndpoint(t *testing.T) {
	// Arrange
	app := setupTestApp()
	
	// Act
	req := httptest.NewRequest(http.MethodGet, "/health", nil)
	resp, err := app.Test(req)
	
	// Assert
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, resp.StatusCode)
	
	// Test response body
	body, _ := io.ReadAll(resp.Body)
	var result map[string]interface{}
	json.Unmarshal(body, &result)
	
	assert.Contains(t, result, "status")
	assert.Equal(t, "🟢 Operational", result["status"])
	assert.Contains(t, result, "uptime")
}