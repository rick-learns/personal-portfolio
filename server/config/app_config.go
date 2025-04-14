package config

import (
	"github.com/dgraph-io/badger/v4"
	"go.uber.org/zap"
)

type AppConfig struct {
	Logger *zap.Logger
	DB     *badger.DB
}

func NewAppConfig(logger *zap.Logger, db *badger.DB) *AppConfig {
	return &AppConfig{
		Logger: logger,
		DB:     db,
	}
}
