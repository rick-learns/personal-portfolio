package routes

import (
	"net"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/rick-learns/portfolio-backend/config"
	"github.com/rick-learns/portfolio-backend/services"
	"go.uber.org/zap"
)

// ContactRequest defines the structure for contact form submissions
type ContactRequest struct {
	Name    string `json:"name" validate:"required,min=2,max=50"`
	Email   string `json:"email" validate:"required,email"`
	Message string `json:"message" validate:"required,min=10,max=500"`
}

// ContactHandler manages the contact form submission endpoint
func ContactHandler(appConfig *config.AppConfig) fiber.Handler {
	validate := validator.New()
	messageService := services.NewMessageService(appConfig.DB)
	
	// Create a persistent rate limiter with 10 requests per day
	rateLimiter := services.NewPersistentRateLimiter(appConfig.DB, 10, 24*time.Hour)
	
	// Schedule periodic cleanup of expired rate limit entries
	go func() {
		ticker := time.NewTicker(1 * time.Hour)
		defer ticker.Stop()
		
		for range ticker.C {
			if err := rateLimiter.CleanupExpired(); err != nil {
				appConfig.Logger.Error("Failed to cleanup expired rate limit entries", 
					zap.Error(err),
				)
			}
		}
	}()

	return func(c *fiber.Ctx) error {
		// Parse request body
		var req ContactRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid request format",
			})
		}

		// Validate input
		if err := validate.Struct(req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Validation failed",
				"details": func() []string {
					var errors []string
					for _, e := range err.(validator.ValidationErrors) {
						errors = append(errors, e.Error())
					}
					return errors
				}(),
			})
		}

		// Get client IP
		ip, _, err := net.SplitHostPort(c.IP())
		if err != nil {
			ip = c.IP()
		}

		// Persistent rate limiting
		allowed, attempts, resetTime := rateLimiter.Allow(ip)
		if !allowed {
			appConfig.Logger.Warn("Rate limit exceeded", 
				zap.String("ip", ip),
				zap.String("email", req.Email),
				zap.Int("attempts", attempts),
				zap.Time("reset_time", resetTime),
			)
			
			// Calculate remaining time until rate limit reset
			remaining := time.Until(resetTime).Round(time.Minute)
			
			return c.Status(fiber.StatusTooManyRequests).JSON(fiber.Map{
				"error": "Daily contact limit exceeded. Please try again later or contact via LinkedIn.",
				"reset_in_minutes": int(remaining.Minutes()),
				"attempts": attempts,
				"max_attempts": 10,
				"alternative": fiber.Map{
					"platform": "LinkedIn",
					"url": "https://linkedin.com/in/rickykcohen",
				},
			})
		}

		// Add HTML sanitization for user input
		sanitizedName := services.SanitizeHTML(req.Name)
		sanitizedEmail := services.SanitizeHTML(req.Email)
		sanitizedMessage := services.SanitizeHTML(req.Message)

		// Save message to database
		err = messageService.SaveMessage(services.ContactFormData{
			Name:    sanitizedName,
			Email:   sanitizedEmail,
			Message: sanitizedMessage,
		})

		if err != nil {
			appConfig.Logger.Error("Failed to save message", 
				zap.Error(err),
				zap.String("email", sanitizedEmail),
			)
			
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to process your message. Please try again later.",
			})
		}

		// Log successful submission
		appConfig.Logger.Info("Contact form submission", 
			zap.String("name", sanitizedName),
			zap.String("email", sanitizedEmail),
			zap.Int("attempt", attempts),
		)

		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"message": "Thank you! Your message has been received and will be reviewed soon.",
			"remaining_attempts": 10 - attempts,
		})
	}
}