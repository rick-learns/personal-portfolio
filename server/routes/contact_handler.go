package routes

import (
	"net"
	"sync"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/rick-learns/portfolio-backend/config"
	"github.com/rick-learns/portfolio-backend/services"
	"go.uber.org/zap"
	"golang.org/x/time/rate"
)

// ContactRequest defines the structure for contact form submissions
type ContactRequest struct {
	Name    string `json:"name" validate:"required,min=2,max=50"`
	Email   string `json:"email" validate:"required,email"`
	Message string `json:"message" validate:"required,min=10,max=500"`
}

// RateLimiter manages rate limiting for requests
type RateLimiter struct {
	visitors map[string]*rate.Limiter
	mu       sync.Mutex
}

// NewRateLimiter creates a new rate limiter
func NewRateLimiter() *RateLimiter {
	return &RateLimiter{
		visitors: make(map[string]*rate.Limiter),
	}
}

// Allow checks if a request from a specific IP is allowed
func (r *RateLimiter) Allow(ip string) bool {
	r.mu.Lock()
	defer r.mu.Unlock()

	limiter, exists := r.visitors[ip]
	if !exists {
		limiter = rate.NewLimiter(rate.Every(24*time.Hour), 10)
		r.visitors[ip] = limiter
	}

	return limiter.Allow()
}

// ContactHandler manages the contact form submission endpoint
func ContactHandler(appConfig *config.AppConfig) fiber.Handler {
	validate := validator.New()
	messageService := services.NewMessageService(appConfig.DB)
	rateLimiter := NewRateLimiter()

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

		// Rate limiting
		if !rateLimiter.Allow(ip) {
			appConfig.Logger.Warn("Rate limit exceeded", 
				zap.String("ip", ip),
				zap.String("email", req.Email),
			)
			return c.Status(fiber.StatusTooManyRequests).JSON(fiber.Map{
				"error": "Daily contact limit exceeded. Please try again tomorrow or contact via LinkedIn.",
				"alternative": fiber.Map{
					"platform": "LinkedIn",
					"url": "https://linkedin.com/in/rickykcohen",
				},
			})
		}

		// Save message to database
		err = messageService.SaveMessage(services.ContactFormData{
			Name:    req.Name,
			Email:   req.Email,
			Message: req.Message,
		})

		if err != nil {
			appConfig.Logger.Error("Failed to save message", 
				zap.Error(err),
				zap.String("email", req.Email),
			)
			
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to process your message. Please try again later.",
			})
		}

		// Log successful submission
		appConfig.Logger.Info("Contact form submission", 
			zap.String("name", req.Name),
			zap.String("email", req.Email),
		)

		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"message": "Thank you! Your message has been received and will be reviewed soon.",
		})
	}
}