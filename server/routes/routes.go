package routes

import (
	"net"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/helmet"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/rick-learns/portfolio-backend/config"
	"github.com/rick-learns/portfolio-backend/services"
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

	// Enhanced Security Middleware
	app.Use(helmet.New(helmet.Config{
		ContentSecurityPolicy: "default-src 'self'; script-src 'self'; img-src 'self'; style-src 'self'; font-src 'self'; frame-ancestors 'none';",
		XSSProtection:         "1; mode=block",
		ContentTypeNosniff:    "nosniff",
		XFrameOptions:         "DENY",
		ReferrerPolicy:        "strict-origin-when-cross-origin",
		PermissionsPolicy:     "camera=(), microphone=(), geolocation=()",
		CrossOriginEmbedderPolicy: "require-corp",
		CrossOriginOpenerPolicy:   "same-origin",
		CrossOriginResourcePolicy: "same-origin",
		OriginAgentCluster:        "?1",
		StrictTransportSecurity:   "max-age=31536000; includeSubDomains; preload",
	}))

	// CORS Configuration with enhanced security
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "https://rickcohen.dev,https://rick-learns.dev,http://localhost:3000",
		AllowMethods:     "GET,POST,OPTIONS",
		AllowHeaders:     "Origin,Content-Type,Accept,X-CSRF-Token",
		AllowCredentials: true,
		MaxAge:           86400, // 24 hours
	}))

	// Enhanced Global Rate Limiter
	app.Use(limiter.New(limiter.Config{
		Max:        100,
		Expiration: 1 * time.Minute,
		KeyGenerator: func(c *fiber.Ctx) string {
			return c.IP()
		},
		LimitReached: func(c *fiber.Ctx) error {
			return c.Status(fiber.StatusTooManyRequests).JSON(fiber.Map{
				"error":   "Rate limit exceeded",
				"message": "Too many requests, please try again later",
			})
		},
		SkipFailedRequests:     false,
		SkipSuccessfulRequests: false,
	}))

	// Add CSRF Protection
	csrfService := services.NewCSRFService(appConfig.DB)
	csrfService.ApplyCSRFProtection(app)

	// API Routes
	v1 := app.Group("/api/v1")
	
	// Contact info endpoint - provides email for mailto links
	v1.Get("/contact-info", func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"email": "rick@rick-learns.dev",
			"subject_prefix": "[Portfolio Contact]",
		})
	})

	// Add the contact form handler if it exists
	contactHandler := ContactHandler(appConfig)
	if contactHandler != nil {
		v1.Post("/contact", contactHandler)
	}

	// Admin routes
	adminRouter := AdminHandler(appConfig)
	v1.Mount("/admin", adminRouter)

	// Email Authentication Check endpoint - For admin use only
	v1.Get("/email-auth-check", func(c *fiber.Ctx) error {
		// Get client IP for security logging
		ip, _, _ := net.SplitHostPort(c.IP())
		if ip == "" {
			ip = c.IP()
		}

		// Get domain from query param or use default
		domain := c.Query("domain")
		if domain == "" {
			domain = os.Getenv("EMAIL_DOMAIN")
			if domain == "" {
				domain = "rick-learns.dev" // Default domain
			}
		}

		// Log this security-sensitive operation
		appConfig.SecurityLogger.LogSecurityEvent(
			services.EventConfigChanged,
			services.SeverityInfo,
			"system",
			ip,
			map[string]interface{}{
				"action": "email_auth_check",
				"domain": domain,
			},
		)

		// Create email auth checker and check the domain
		checker := services.NewEmailAuthChecker()
		result, err := checker.CheckDomain(domain)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to check email authentication",
				"details": err.Error(),
			})
		}

		return c.JSON(result)
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