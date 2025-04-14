package config

import (
	"github.com/dgraph-io/badger/v4"
	"github.com/rick-learns/portfolio-backend/services"
	"go.uber.org/zap"
)

type AppConfig struct {
	Logger        *zap.Logger
	SecurityLogger *services.SecurityLogger
	DB            *badger.DB
}

func NewAppConfig(logger *zap.Logger, securityLogger *services.SecurityLogger, db *badger.DB) *AppConfig {
	return &AppConfig{
		Logger:        logger,
		SecurityLogger: securityLogger,
		DB:            db,
	}
}