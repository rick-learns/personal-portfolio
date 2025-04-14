package routes

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/helmet"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/rick-learns/portfolio-backend/config"
)

func SetupRoutes(appConfig *config.AppConfig) *fiber.App {
	app := fiber.New(fiber.Config{
		AppName: "Rick Cohen Portfolio Backend",
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			// Terminal-themed error response
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "🔴 Unexpected Error",
				"message": "An unexpected error occurred. Please try again.",
				"trace": err.Error(),
			})
		},
	})

	// Security Middleware
	app.Use(helmet.New(helmet.Config{
		ReferrerPolicy: "strict-origin-when-cross-origin",
		ContentSecurityPolicy: "default-src 'self'; script-src 'self' 'unsafe-inline'",
	}))

	// CORS Configuration
	app.Use(cors.New(cors.Config{
		AllowOrigins: "https://rickcohen.dev,https://rick-learns.dev,http://localhost:3000",
		AllowMethods: "GET,POST,OPTIONS",
		AllowHeaders: "Origin,Content-Type,Accept",
	}))

	// Global Rate Limiter
	app.Use(limiter.New(limiter.Config{
		Max:        100,
		Expiration: 1 * time.Minute,
		KeyGenerator: func(c *fiber.Ctx) string {
			return c.IP()
		},
	}))

	// API Routes - No contact handler needed for mailto approach
	v1 := app.Group("/api/v1")
	
	// Contact info endpoint - provides email for mailto links
	v1.Get("/contact-info", func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"email": "rick@rick-learns.dev",
			"subject_prefix": "[Portfolio Contact]",
		})
	})

	// Health Check
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"status": "🟢 Operational",
			"uptime": time.Now().Unix(),
		})
	})

	return app
}