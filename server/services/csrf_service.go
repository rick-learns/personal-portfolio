package services

import (
	"crypto/rand"
	"crypto/subtle"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"sync"
	"time"

	"github.com/dgraph-io/badger/v4"
	"github.com/gofiber/fiber/v2"
)

// CSRFToken represents a CSRF token
type CSRFToken struct {
	Token     string    `json:"token"`
	ExpiresAt time.Time `json:"expires_at"`
}

// CSRFService handles CSRF token generation and validation
type CSRFService struct {
	db        *badger.DB
	mutex     sync.Mutex
	cookieName string
	headerName string
	expiration time.Duration
}

// NewCSRFService creates a new CSRF service
func NewCSRFService(db *badger.DB) *CSRFService {
	return &CSRFService{
		db:         db,
		cookieName: "csrf_token",
		headerName: "X-CSRF-Token",
		expiration: 24 * time.Hour, // Tokens are valid for 24 hours
	}
}

// GenerateToken creates a new CSRF token
func (s *CSRFService) GenerateToken() (string, error) {
	s.mutex.Lock()
	defer s.mutex.Unlock()
	
	// Generate random token
	b := make([]byte, 32)
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}
	
	token := base64.StdEncoding.EncodeToString(b)
	
	// Create token object
	csrfToken := CSRFToken{
		Token:     token,
		ExpiresAt: time.Now().Add(s.expiration),
	}
	
	// Convert to JSON
	tokenJSON, err := json.Marshal(csrfToken)
	if err != nil {
		return "", err
	}
	
	// Store in database
	err = s.db.Update(func(txn *badger.Txn) error {
		key := []byte("csrf_" + token)
		return txn.Set(key, tokenJSON)
	})
	if err != nil {
		return "", err
	}
	
	return token, nil
}

// ValidateToken checks if a token is valid
func (s *CSRFService) ValidateToken(token string) (bool, error) {
	if token == "" {
		return false, errors.New("empty token")
	}
	
	var csrfToken CSRFToken
	
	err := s.db.View(func(txn *badger.Txn) error {
		key := []byte("csrf_" + token)
		item, err := txn.Get(key)
		if err != nil {
			return err
		}
		
		return item.Value(func(val []byte) error {
			return json.Unmarshal(val, &csrfToken)
		})
	})
	
	if err != nil {
		return false, err
	}
	
	// Check if token is expired
	if time.Now().After(csrfToken.ExpiresAt) {
		return false, errors.New("token expired")
	}
	
	return true, nil
}

// DeleteToken removes a token from the database
func (s *CSRFService) DeleteToken(token string) error {
	return s.db.Update(func(txn *badger.Txn) error {
		key := []byte("csrf_" + token)
		return txn.Delete(key)
	})
}

// CSRF middleware for Fiber
func (s *CSRFService) Middleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Skip preflight requests
		if c.Method() == http.MethodOptions {
			return c.Next()
		}
		
		// Skip GET and HEAD requests as they should not mutate state
		if c.Method() == http.MethodGet || c.Method() == http.MethodHead {
			// For GET requests, generate a token and set it in cookie
			token, err := s.GenerateToken()
			if err != nil {
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
					"error": "Failed to generate CSRF token",
				})
			}
			
			// Set cookie
			c.Cookie(&fiber.Cookie{
				Name:     s.cookieName,
				Value:    token,
				Expires:  time.Now().Add(s.expiration),
				HTTPOnly: true,
				Secure:   c.Protocol() == "https",
				SameSite: "Strict",
			})
			
			// Add token to response header for JavaScript clients
			c.Set(s.headerName, token)
			
			return c.Next()
		}
		
		// For other methods (POST, PUT, DELETE, etc.)
		// Get token from header
		token := c.Get(s.headerName)
		
		// If not in header, try getting from form
		if token == "" {
			token = c.FormValue("csrf_token")
		}
		
		// Validate token
		valid, err := s.ValidateToken(token)
		if err != nil || !valid {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error": "Invalid or missing CSRF token",
			})
		}
		
		return c.Next()
	}
}

// ApplyCSRFProtection adds CSRF protection to a specific route or group
func (s *CSRFService) ApplyCSRFProtection(app *fiber.App) {
	// Apply CSRF middleware to all routes
	app.Use(s.Middleware())
	
	// Endpoint to get a new CSRF token
	app.Get("/csrf-token", func(c *fiber.Ctx) error {
		token, err := s.GenerateToken()
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to generate CSRF token",
			})
		}
		
		// Set cookie
		c.Cookie(&fiber.Cookie{
			Name:     s.cookieName,
			Value:    token,
			Expires:  time.Now().Add(s.expiration),
			HTTPOnly: true,
			Secure:   c.Protocol() == "https",
			SameSite: "Strict",
		})
		
		return c.JSON(fiber.Map{
			"token": token,
		})
	})
}