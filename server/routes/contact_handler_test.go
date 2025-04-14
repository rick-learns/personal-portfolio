package routes

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/dgraph-io/badger/v4"
	"github.com/gofiber/fiber/v2"
	"github.com/rick-learns/portfolio-backend/config"
	"github.com/stretchr/testify/assert"
	"go.uber.org/zap"
)

func TestContactHandlerValidation(t *testing.T) {
	// Arrange
	logger, _ := zap.NewDevelopment()
	var mockDB *badger.DB = nil
	
	appConfig := &config.AppConfig{
		Logger: logger,
		DB:     mockDB,
	}
	
	app := fiber.New()
	app.Post("/contact", ContactHandler(appConfig))
	
	testCases := []struct {
		name           string
		payload        map[string]interface{}
		expectedStatus int
		expectError    bool
	}{
		{
			name: "Valid Request",
			payload: map[string]interface{}{
				"name":    "Test User",
				"email":   "test@example.com",
				"message": "This is a valid test message that meets the minimum length requirement.",
			},
			expectedStatus: fiber.StatusOK,
			expectError:    false,
		},
		{
			name: "Missing Name",
			payload: map[string]interface{}{
				"email":   "test@example.com",
				"message": "This is a test message.",
			},
			expectedStatus: fiber.StatusBadRequest,
			expectError:    true,
		},
		{
			name: "Invalid Email",
			payload: map[string]interface{}{
				"name":    "Test User",
				"email":   "not-an-email",
				"message": "This is a test message.",
			},
			expectedStatus: fiber.StatusBadRequest,
			expectError:    true,
		},
		{
			name: "Message Too Short",
			payload: map[string]interface{}{
				"name":    "Test User",
				"email":   "test@example.com",
				"message": "Too short",
			},
			expectedStatus: fiber.StatusBadRequest,
			expectError:    true,
		},
	}
	
	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			// Skip actual email sending tests in unit tests
			if tc.name == "Valid Request" {
				t.Skip("Skipping valid request test in unit tests to avoid sending real emails")
				return
			}
			
			// Convert payload to JSON
			payloadBytes, _ := json.Marshal(tc.payload)
			
			// Create request
			req := httptest.NewRequest(
				http.MethodPost,
				"/contact",
				bytes.NewReader(payloadBytes),
			)
			req.Header.Set("Content-Type", "application/json")
			
			// Send request
			resp, _ := app.Test(req)
			
			// Assert status code
			assert.Equal(t, tc.expectedStatus, resp.StatusCode)
			
			// Parse response
			var result map[string]interface{}
			json.NewDecoder(resp.Body).Decode(&result)
			
			// Verify response structure
			if tc.expectError {
				assert.Contains(t, result, "error")
			} else {
				assert.Contains(t, result, "message")
				assert.Equal(t, "Message sent successfully!", result["message"])
			}
		})
	}
}