package routes

import (
	"crypto/subtle"

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
			// Secure comparison to prevent timing attacks
			correctUsername := "admin"
			correctPassword := "abc123" // You should change this and store it securely

			usernameMatch := subtle.ConstantTimeCompare([]byte(username), []byte(correctUsername)) == 1
			passwordMatch := subtle.ConstantTimeCompare([]byte(password), []byte(correctPassword)) == 1

			return usernameMatch && passwordMatch
		},
		Unauthorized: func(c *fiber.Ctx) error {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Unauthorized access",
			})
		},
	}))

	// Create message service
	messageService := services.NewMessageService(appConfig.DB)

	// Get all messages
	adminGroup.Get("/messages", func(c *fiber.Ctx) error {
		messages, err := messageService.GetAllMessages()
		if err != nil {
			appConfig.Logger.Error("Failed to retrieve messages",
				zap.Error(err),
			)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to retrieve messages",
			})
		}

		return c.JSON(fiber.Map{
			"count":    len(messages),
			"messages": messages,
		})
	})

	// Mark message as read
	adminGroup.Put("/messages/:id/read", func(c *fiber.Ctx) error {
		id := c.Params("id")

		err := messageService.MarkAsRead(id)
		if err != nil {
			appConfig.Logger.Error("Failed to mark message as read",
				zap.Error(err),
				zap.String("id", id),
			)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to mark message as read",
			})
		}

		return c.JSON(fiber.Map{
			"success": true,
			"message": "Message marked as read",
		})
	})

	return adminGroup
}
