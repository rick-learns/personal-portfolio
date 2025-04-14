package routes

import (
	"crypto/subtle"
	"net"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/basicauth"
	"github.com/rick-learns/portfolio-backend/config"
	"github.com/rick-learns/portfolio-backend/services"
	"go.uber.org/zap"
)

// AdminHandler provides endpoints for administrative tasks
func AdminHandler(appConfig *config.AppConfig) fiber.Router {
	// Create a group with Basic Auth protection
	adminGroup := fiber.New().Group("/admin")

	// Add Basic Auth middleware
	adminGroup.Use(basicauth.New(basicauth.Config{
		Authorizer: func(username, password string) bool {
			// Get credentials from environment variables
			correctUsername := os.Getenv("ADMIN_USERNAME")
			correctPassword := os.Getenv("ADMIN_PASSWORD")
			
			// Fallback check (for development only)
			if correctUsername == "" || correctPassword == "" {
				appConfig.Logger.Warn("Admin credentials not properly configured in environment")
				return false
			}

			// Secure comparison to prevent timing attacks
			usernameMatch := subtle.ConstantTimeCompare([]byte(username), []byte(correctUsername)) == 1
			passwordMatch := subtle.ConstantTimeCompare([]byte(password), []byte(correctPassword)) == 1

			// Get client IP for logging
			ip := "unknown"
			if fiberCtx, ok := basicauth.FromContext(fiber.Ctx{}); ok {
				clientIP, _, _ := net.SplitHostPort(fiberCtx.IP())
				if clientIP != "" {
					ip = clientIP
				}
			}

			// Log authentication attempt
			if usernameMatch && passwordMatch {
				appConfig.SecurityLogger.LogAuthSuccess(username, ip, map[string]interface{}{
					"method": "basic_auth",
					"path": "/admin",
				})
			} else {
				appConfig.SecurityLogger.LogAuthFailure(username, ip, map[string]interface{}{
					"method": "basic_auth",
					"path": "/admin",
					"reason": "invalid_credentials",
				})
			}

			return usernameMatch && passwordMatch
		},
		Unauthorized: func(c *fiber.Ctx) error {
			// Get client IP for logging
			ip, _, _ := net.SplitHostPort(c.IP())
			if ip == "" {
				ip = c.IP()
			}

			// Log unauthorized access attempt
			appConfig.SecurityLogger.LogAuthFailure("unknown", ip, map[string]interface{}{
				"method": "basic_auth",
				"path": c.Path(),
				"reason": "unauthorized_access",
				"headers": c.GetReqHeaders(),
			})

			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Unauthorized access",
			})
		},
		ContextUsername: "username",
	}))

	// Create message service
	messageService := services.NewMessageService(appConfig.DB)

	// Get all messages
	adminGroup.Get("/messages", func(c *fiber.Ctx) error {
		// Get username and IP for logging
		username := c.Locals("username").(string)
		ip, _, _ := net.SplitHostPort(c.IP())
		if ip == "" {
			ip = c.IP()
		}

		messages, err := messageService.GetAllMessages()
		if err != nil {
			appConfig.Logger.Error("Failed to retrieve messages",
				zap.Error(err),
			)
			
			// Log error
			appConfig.SecurityLogger.LogAdminAction(username, ip, "view_messages", map[string]interface{}{
				"success": false,
				"error": err.Error(),
			})
			
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to retrieve messages",
			})
		}

		// Log successful access
		appConfig.SecurityLogger.LogAdminAction(username, ip, "view_messages", map[string]interface{}{
			"success": true,
			"count": len(messages),
		})

		return c.JSON(fiber.Map{
			"count":    len(messages),
			"messages": messages,
		})
	})

	// Mark message as read
	adminGroup.Put("/messages/:id/read", func(c *fiber.Ctx) error {
		id := c.Params("id")
		
		// Get username and IP for logging
		username := c.Locals("username").(string)
		ip, _, _ := net.SplitHostPort(c.IP())
		if ip == "" {
			ip = c.IP()
		}

		err := messageService.MarkAsRead(id)
		if err != nil {
			appConfig.Logger.Error("Failed to mark message as read",
				zap.Error(err),
				zap.String("id", id),
			)
			
			// Log error
			appConfig.SecurityLogger.LogAdminAction(username, ip, "mark_message_read", map[string]interface{}{
				"success": false,
				"message_id": id,
				"error": err.Error(),
			})
			
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to mark message as read",
			})
		}

		// Log successful action
		appConfig.SecurityLogger.LogAdminAction(username, ip, "mark_message_read", map[string]interface{}{
			"success": true,
			"message_id": id,
		})

		return c.JSON(fiber.Map{
			"success": true,
			"message": "Message marked as read",
		})
	})

	return adminGroup
}