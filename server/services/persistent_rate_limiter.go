package services

import (
	"encoding/json"
	"fmt"
	"sync"
	"time"

	"github.com/dgraph-io/badger/v4"
)

// RateLimitEntry stores information about rate limiting for an IP
type RateLimitEntry struct {
	IP        string    `json:"ip"`
	Count     int       `json:"count"`
	ResetTime time.Time `json:"reset_time"`
}

// PersistentRateLimiter provides rate limiting with BadgerDB persistence
type PersistentRateLimiter struct {
	db          *badger.DB
	mutex       sync.Mutex
	maxRequests int
	window      time.Duration
}

// NewPersistentRateLimiter creates a new persistent rate limiter
func NewPersistentRateLimiter(db *badger.DB, maxRequests int, window time.Duration) *PersistentRateLimiter {
	return &PersistentRateLimiter{
		db:          db,
		maxRequests: maxRequests,
		window:      window,
	}
}

// Allow checks if a request from a specific IP is allowed
func (r *PersistentRateLimiter) Allow(ip string) (bool, int, time.Time) {
	r.mutex.Lock()
	defer r.mutex.Unlock()

	// Fetch current rate limit info for IP
	entry, err := r.getEntry(ip)
	if err != nil && err != badger.ErrKeyNotFound {
		// If there's an error (other than key not found), allow the request
		return true, 0, time.Time{}
	}

	// If entry doesn't exist or window has expired, create a new entry
	now := time.Now()
	if err == badger.ErrKeyNotFound || now.After(entry.ResetTime) {
		entry = &RateLimitEntry{
			IP:        ip,
			Count:     1,
			ResetTime: now.Add(r.window),
		}
		r.saveEntry(entry)
		return true, 1, entry.ResetTime
	}

	// Increment the counter
	entry.Count++
	
	// Check if limit exceeded
	if entry.Count > r.maxRequests {
		r.saveEntry(entry)
		return false, entry.Count, entry.ResetTime
	}

	// Update the entry and allow the request
	r.saveEntry(entry)
	return true, entry.Count, entry.ResetTime
}

// getEntry retrieves rate limit info for an IP
func (r *PersistentRateLimiter) getEntry(ip string) (*RateLimitEntry, error) {
	var entry RateLimitEntry
	
	err := r.db.View(func(txn *badger.Txn) error {
		key := []byte(fmt.Sprintf("ratelimit_%s", ip))
		item, err := txn.Get(key)
		if err != nil {
			return err
		}
		
		return item.Value(func(val []byte) error {
			return json.Unmarshal(val, &entry)
		})
	})
	
	if err != nil {
		return nil, err
	}
	
	return &entry, nil
}

// saveEntry saves rate limit info for an IP
func (r *PersistentRateLimiter) saveEntry(entry *RateLimitEntry) error {
	data, err := json.Marshal(entry)
	if err != nil {
		return err
	}
	
	return r.db.Update(func(txn *badger.Txn) error {
		key := []byte(fmt.Sprintf("ratelimit_%s", entry.IP))
		return txn.Set(key, data)
	})
}

// CleanupExpired removes expired rate limit entries
func (r *PersistentRateLimiter) CleanupExpired() error {
	now := time.Now()
	
	keysToDelete := make([][]byte, 0)
	
	// First collect keys to delete
	err := r.db.View(func(txn *badger.Txn) error {
		opts := badger.DefaultIteratorOptions
		opts.PrefetchSize = 10
		it := txn.NewIterator(opts)
		defer it.Close()
		
		prefix := []byte("ratelimit_")
		for it.Seek(prefix); it.ValidForPrefix(prefix); it.Next() {
			item := it.Item()
			
			var entry RateLimitEntry
			err := item.Value(func(val []byte) error {
				return json.Unmarshal(val, &entry)
			})
			
			if err != nil {
				continue
			}
			
			if now.After(entry.ResetTime) {
				keysToDelete = append(keysToDelete, item.KeyCopy(nil))
			}
		}
		return nil
	})
	
	if err != nil {
		return err
	}
	
	// Then delete them
	return r.db.Update(func(txn *badger.Txn) error {
		for _, key := range keysToDelete {
			if err := txn.Delete(key); err != nil {
				return err
			}
		}
		return nil
	})
}