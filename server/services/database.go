package services

import (
	"fmt"
	"os"
	"path/filepath"
	"time"

	"github.com/dgraph-io/badger/v4"
)

func NewBadgerDB() (*badger.DB, error) {
	// Create data directory with a timestamp to make it unique for each run
	timestamp := time.Now().Format("20060102150405")
	dataDir := filepath.Join(os.TempDir(), fmt.Sprintf("portfolio-backend-%s", timestamp))
	if err := os.MkdirAll(dataDir, 0755); err != nil {
		return nil, err
	}

	// Open Badger database
	opts := badger.DefaultOptions(dataDir)
	opts.Logger = nil // Disable default logging
	db, err := badger.Open(opts)
	if err != nil {
		return nil, err
	}

	return db, nil
}