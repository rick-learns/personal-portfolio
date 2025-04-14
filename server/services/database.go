package services

import (
	"os"
	"path/filepath"

	"github.com/dgraph-io/badger/v4"
)

func NewBadgerDB() (*badger.DB, error) {
	// Get database path from environment variable
	dbPath := os.Getenv("DB_PATH")
	
	// If not set, use a default path
	if dbPath == "" {
		// Use the temp directory for development, but with a fixed name
		// so data persists between restarts
		dbPath = filepath.Join(os.TempDir(), "portfolio-backend-db")
	}
	
	// Create data directory if it doesn't exist
	// Use 0700 permissions for better security (only owner can access)
	if err := os.MkdirAll(dbPath, 0700); err != nil {
		return nil, err
	}

	// Open Badger database with production-oriented options
	opts := badger.DefaultOptions(dbPath)
	opts.Logger = nil // Disable default logging
	
	// Additional production settings
	opts.SyncWrites = true     // More durable, at cost of some performance
	opts.NumVersionsToKeep = 1 // Save space by only keeping latest versions
	
	db, err := badger.Open(opts)
	if err != nil {
		return nil, err
	}

	return db, nil
}