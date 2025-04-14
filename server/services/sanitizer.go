package services

import (
	"regexp"
	"strings"
)

var (
	// Pattern to match HTML tags
	htmlTagPattern = regexp.MustCompile(`<[^>]*>`)
	
	// Pattern to match potentially dangerous attributes
	dangerousAttributePattern = regexp.MustCompile(`(?i)(on\w+|style|formaction|xlink:href)=["'][^"']*["']`)
	
	// Pattern to match JavaScript URLs
	jsURLPattern = regexp.MustCompile(`(?i)javascript:`)
	
	// Pattern to match data URLs
	dataURLPattern = regexp.MustCompile(`(?i)data:`)
)

// SanitizeHTML removes unsafe HTML from input strings
func SanitizeHTML(input string) string {
	if input == "" {
		return input
	}
	
	// Trim whitespace
	input = strings.TrimSpace(input)
	
	// Remove all HTML tags
	input = htmlTagPattern.ReplaceAllString(input, "")
	
	// Remove dangerous attributes (just in case a tag slipped through)
	input = dangerousAttributePattern.ReplaceAllString(input, "")
	
	// Remove JavaScript URLs
	input = jsURLPattern.ReplaceAllString(input, "invalid:")
	
	// Remove data URLs
	input = dataURLPattern.ReplaceAllString(input, "invalid:")
	
	// Replace potentially dangerous characters
	input = strings.ReplaceAll(input, "<", "&lt;")
	input = strings.ReplaceAll(input, ">", "&gt;")
	
	return input
}

// StripHTML removes all HTML tags from a string
func StripHTML(input string) string {
	return htmlTagPattern.ReplaceAllString(input, "")
}

// SanitizeFilename removes unsafe characters from filenames
func SanitizeFilename(filename string) string {
	// Replace potentially dangerous characters in filenames
	unsafe := []string{"/", "\\", ":", "*", "?", "\"", "<", ">", "|"}
	result := filename
	
	for _, char := range unsafe {
		result = strings.ReplaceAll(result, char, "_")
	}
	
	return result
}

// SanitizeJSON ensures a string is safe to use within JSON
func SanitizeJSON(input string) string {
	// Escape backslashes, quotes, and control characters
	replacer := strings.NewReplacer(
		"\\", "\\\\",
		"\"", "\\\"",
		"\n", "\\n",
		"\r", "\\r",
		"\t", "\\t",
		"\b", "\\b",
		"\f", "\\f",
	)
	
	return replacer.Replace(input)
}

// SanitizeEmail performs basic email validation and sanitization
func SanitizeEmail(email string) string {
	// Trim whitespace
	email = strings.TrimSpace(email)
	
	// Convert to lowercase
	email = strings.ToLower(email)
	
	// Remove any HTML
	email = StripHTML(email)
	
	return email
}