package services

import (
	"fmt"
	"os"

	"github.com/resend/resend-go/v2"
)

type EmailService struct {
	client *resend.Client
	apiKey string
}

type ContactFormData struct {
	Name    string
	Email   string
	Message string
}

func NewEmailService() *EmailService {
	resendApiKey := os.Getenv("RESEND_API_KEY")
	if resendApiKey == "" {
		// Instead of returning nil, return a service that knows it has no API key
		return &EmailService{
			client: nil,
			apiKey: "",
		}
	}

	return &EmailService{
		client: resend.NewClient(resendApiKey),
		apiKey: resendApiKey,
	}
}

func (s *EmailService) SendContactEmail(data ContactFormData) error {
	// Check if we have a valid API key and client
	if s.apiKey == "" {
		return fmt.Errorf("email service not configured: missing API key")
	}
	
	if s.client == nil {
		return fmt.Errorf("email client not initialized")
	}

	params := &resend.SendEmailRequest{
		From:    "rick@rick-learns.dev",
		To:      []string{"rickykcohen@gmail.com"},
		Subject: fmt.Sprintf("Portfolio Contact: Message from %s", data.Name),
		Text:    fmt.Sprintf("Name: %s\nEmail: %s\n\nMessage:\n%s", data.Name, data.Email, data.Message),
	}

	_, err := s.client.Emails.Send(params)
	if err != nil {
		return fmt.Errorf("failed to send email: %w", err)
	}
	
	return nil
}