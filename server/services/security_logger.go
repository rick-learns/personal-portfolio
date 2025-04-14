package services

import (
	"os"
	"time"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

// SecurityEventType defines types of security events
type SecurityEventType string

// Security event types
const (
	EventAuthSuccess      SecurityEventType = "auth_success"
	EventAuthFailure      SecurityEventType = "auth_failure"
	EventRateLimitExceeded SecurityEventType = "rate_limit_exceeded"
	EventCSRFFailure      SecurityEventType = "csrf_failure"
	EventContactSubmitted SecurityEventType = "contact_submitted"
	EventConfigChanged    SecurityEventType = "config_changed"
	EventDBAccess         SecurityEventType = "db_access"
	EventAdminAction      SecurityEventType = "admin_action"
)

// SecurityEventSeverity defines severity levels for security events
type SecurityEventSeverity string

// Security event severity levels
const (
	SeverityInfo     SecurityEventSeverity = "info"
	SeverityWarning  SecurityEventSeverity = "warning"
	SeverityCritical SecurityEventSeverity = "critical"
)

// SecurityLogger provides enhanced logging for security events
type SecurityLogger struct {
	logger *zap.Logger
	// Secondary log file specifically for security events
	securityLogFile string
}

// NewSecurityLogger creates a new security logger
func NewSecurityLogger() (*SecurityLogger, error) {
	// Get log level from environment or default to info
	logLevel := os.Getenv("SECURITY_LOG_LEVEL")
	if logLevel == "" {
		logLevel = "info"
	}

	// Get log file path from environment or use default
	securityLogFile := os.Getenv("SECURITY_LOG_FILE")
	if securityLogFile == "" {
		securityLogFile = "security_events.log"
	}

	// Create encoder configuration
	encoderConfig := zap.NewProductionEncoderConfig()
	encoderConfig.TimeKey = "timestamp"
	encoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder
	encoderConfig.StacktraceKey = "stacktrace"

	// Create level parser
	var level zapcore.Level
	switch logLevel {
	case "debug":
		level = zap.DebugLevel
	case "info":
		level = zap.InfoLevel
	case "warn":
		level = zap.WarnLevel
	case "error":
		level = zap.ErrorLevel
	default:
		level = zap.InfoLevel
	}

	// Create file core
	fileEncoder := zapcore.NewJSONEncoder(encoderConfig)
	logFile, err := os.OpenFile(securityLogFile, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		return nil, err
	}

	fileCore := zapcore.NewCore(
		fileEncoder,
		zapcore.AddSync(logFile),
		level,
	)

	// Create console core for terminal output
	consoleEncoder := zapcore.NewConsoleEncoder(encoderConfig)
	consoleCore := zapcore.NewCore(
		consoleEncoder,
		zapcore.AddSync(os.Stdout),
		level,
	)

	// Combine cores
	core := zapcore.NewTee(fileCore, consoleCore)
	logger := zap.New(core, zap.AddCaller(), zap.AddStacktrace(zap.ErrorLevel))

	return &SecurityLogger{
		logger:          logger,
		securityLogFile: securityLogFile,
	}, nil
}

// LogSecurityEvent logs a security event with standardized fields
func (s *SecurityLogger) LogSecurityEvent(
	eventType SecurityEventType,
	severity SecurityEventSeverity,
	userID string,
	ip string,
	details map[string]interface{},
) {
	fields := []zap.Field{
		zap.String("event_type", string(eventType)),
		zap.String("severity", string(severity)),
		zap.String("category", "security"),
		zap.String("user_id", userID),
		zap.String("ip_address", ip),
		zap.Time("timestamp", time.Now().UTC()),
	}

	// Add any additional details
	for k, v := range details {
		fields = append(fields, zap.Any(k, v))
	}

	// Log based on severity
	switch severity {
	case SeverityCritical:
		s.logger.Error("SECURITY_EVENT", fields...)
	case SeverityWarning:
		s.logger.Warn("SECURITY_EVENT", fields...)
	default:
		s.logger.Info("SECURITY_EVENT", fields...)
	}
}

// LogAuthSuccess logs a successful authentication
func (s *SecurityLogger) LogAuthSuccess(userID, ip string, details map[string]interface{}) {
	s.LogSecurityEvent(EventAuthSuccess, SeverityInfo, userID, ip, details)
}

// LogAuthFailure logs a failed authentication attempt
func (s *SecurityLogger) LogAuthFailure(userID, ip string, details map[string]interface{}) {
	s.LogSecurityEvent(EventAuthFailure, SeverityWarning, userID, ip, details)
}

// LogRateLimitExceeded logs a rate limit exceeded event
func (s *SecurityLogger) LogRateLimitExceeded(ip string, details map[string]interface{}) {
	s.LogSecurityEvent(EventRateLimitExceeded, SeverityWarning, "", ip, details)
}

// LogCSRFFailure logs a CSRF token validation failure
func (s *SecurityLogger) LogCSRFFailure(ip string, details map[string]interface{}) {
	s.LogSecurityEvent(EventCSRFFailure, SeverityWarning, "", ip, details)
}

// LogContactSubmitted logs a contact form submission
func (s *SecurityLogger) LogContactSubmitted(ip string, details map[string]interface{}) {
	s.LogSecurityEvent(EventContactSubmitted, SeverityInfo, "", ip, details)
}

// LogAdminAction logs an administrative action
func (s *SecurityLogger) LogAdminAction(userID, ip string, action string, details map[string]interface{}) {
	if details == nil {
		details = make(map[string]interface{})
	}
	details["action"] = action
	s.LogSecurityEvent(EventAdminAction, SeverityInfo, userID, ip, details)
}

// Close properly closes the logger
func (s *SecurityLogger) Close() error {
	return s.logger.Sync()
}