package tests

import (
	"os"
	"testing"

	"github.com/go-playground/validator/v10"
	"github.com/rick-learns/portfolio-backend/routes"
	"github.com/rick-learns/portfolio-backend/services"
	"github.com/stretchr/testify/assert"
)

func TestEmailService(t *testing.T) {
	// Set up test email service
	t.Run("NewEmailService", func(t *testing.T) {
		// Test without API key
		os.Unsetenv("RESEND_API_KEY")
		emailService := services.NewEmailService()
		assert.Nil(t, emailService, "Email service should be nil without API key")

		// Test with mock API key
		os.Setenv("RESEND_API_KEY", "test_api_key")
		emailService = services.NewEmailService()
		assert.NotNil(t, emailService, "Email service should be created with API key")
	})

	t.Run("SendContactEmail", func(t *testing.T) {
		// Skip this test in automated testing since it requires a real API key
		t.Skip("Skipping email sending test as it requires a valid Resend API key")
		
		// For manual testing with a real API key:
		// emailService := services.NewEmailService()
		// contactData := services.ContactFormData{
		//    Name:    "Test User",
		//    Email:   "test@example.com",
		//    Message: "Test message content",
		// }
		// err := emailService.SendContactEmail(contactData)
		// assert.NoError(t, err, "Sending contact email should not produce an error")
	})
}

func TestRateLimiter(t *testing.T) {
	t.Run("RateLimitCheck", func(t *testing.T) {
		// Create a new rate limiter for each test to avoid test interference
		rateLimiter := routes.NewRateLimiter()
		
		// Test IP-based rate limiting
		testIP := "192.168.1.1"
		
		// First 10 requests should be allowed
		for i := 0; i < 10; i++ {
			assert.True(t, rateLimiter.Allow(testIP), "First 10 requests should be allowed")
		}

		// Next request should be denied
		assert.False(t, rateLimiter.Allow(testIP), "11th request should be denied")
	})

	t.Run("MultipleIPRateLimiting", func(t *testing.T) {
		// Create a new rate limiter for this specific test
		rateLimiter := routes.NewRateLimiter()
		
		// Different IPs should have independent rate limits
		ip1 := "192.168.1.1"
		ip2 := "192.168.1.2"

		// Test that each IP can have up to 10 requests
		for i := 0; i < 10; i++ {
			assert.True(t, rateLimiter.Allow(ip1), "Requests for IP1 should be allowed")
			assert.True(t, rateLimiter.Allow(ip2), "Requests for IP2 should be allowed")
		}

		// 11th request for each IP should be denied
		assert.False(t, rateLimiter.Allow(ip1), "11th request for IP1 should be denied")
		assert.False(t, rateLimiter.Allow(ip2), "11th request for IP2 should be denied")
	})
}

func TestContactRequestValidation(t *testing.T) {
	t.Run("ValidRequest", func(t *testing.T) {
		validRequest := routes.ContactRequest{
			Name:    "John Doe",
			Email:   "john.doe@example.com",
			Message: "This is a valid test message for validation",
		}

		validate := validator.New()
		err := validate.Struct(validRequest)
		assert.NoError(t, err, "Valid request should pass validation")
	})

	t.Run("InvalidRequests", func(t *testing.T) {
		testCases := []struct {
			name    string
			request routes.ContactRequest
			hasError bool
		}{
			{
				name: "Short_Name",
				request: routes.ContactRequest{
					Name:    "A",
					Email:   "valid@example.com",
					Message: "Valid message that is long enough for the validation",
				},
				hasError: true,
			},
			{
				name: "Invalid_Email",
				request: routes.ContactRequest{
					Name:    "John Doe",
					Email:   "invalid-email",
					Message: "Valid message that is long enough for the validation",
				},
				hasError: true,
			},
			{
				name: "Short_Message",
				request: routes.ContactRequest{
					Name:    "John Doe",
					Email:   "john.doe@example.com",
					Message: "Short",
				},
				hasError: true,
			},
		}

		validate := validator.New()
		for _, tc := range testCases {
			t.Run(tc.name, func(t *testing.T) {
				err := validate.Struct(tc.request)
				if tc.hasError {
					assert.Error(t, err, "Request should fail validation")
				} else {
					assert.NoError(t, err, "Request should pass validation")
				}
			})
		}
	})
}