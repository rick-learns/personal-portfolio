package services

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/dgraph-io/badger/v4"
)

type MessageService struct {
	db *badger.DB
}

type ContactMessage struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Message   string    `json:"message"`
	Timestamp time.Time `json:"timestamp"`
	Read      bool      `json:"read"`
}

func NewMessageService(db *badger.DB) *MessageService {
	return &MessageService{
		db: db,
	}
}

// SaveMessage stores the contact form message in the database
func (s *MessageService) SaveMessage(data ContactFormData) error {
	if s.db == nil {
		return fmt.Errorf("database not initialized")
	}

	// Create a unique ID based on timestamp
	timestamp := time.Now()
	id := fmt.Sprintf("msg_%d", timestamp.UnixNano())

	// Create message object
	message := ContactMessage{
		ID:        id,
		Name:      data.Name,
		Email:     data.Email,
		Message:   data.Message,
		Timestamp: timestamp,
		Read:      false,
	}

	// Convert to JSON
	messageJSON, err := json.Marshal(message)
	if err != nil {
		return fmt.Errorf("failed to marshal message: %w", err)
	}

	// Store in database
	err = s.db.Update(func(txn *badger.Txn) error {
		return txn.Set([]byte(id), messageJSON)
	})
	if err != nil {
		return fmt.Errorf("failed to store message: %w", err)
	}

	return nil
}

// GetAllMessages retrieves all contact form messages
func (s *MessageService) GetAllMessages() ([]ContactMessage, error) {
	if s.db == nil {
		return nil, fmt.Errorf("database not initialized")
	}

	var messages []ContactMessage

	err := s.db.View(func(txn *badger.Txn) error {
		opts := badger.DefaultIteratorOptions
		opts.PrefetchSize = 10
		it := txn.NewIterator(opts)
		defer it.Close()

		prefix := []byte("msg_")
		for it.Seek(prefix); it.ValidForPrefix(prefix); it.Next() {
			item := it.Item()
			err := item.Value(func(v []byte) error {
				var message ContactMessage
				err := json.Unmarshal(v, &message)
				if err != nil {
					return err
				}
				messages = append(messages, message)
				return nil
			})
			if err != nil {
				return err
			}
		}
		return nil
	})

	if err != nil {
		return nil, fmt.Errorf("failed to retrieve messages: %w", err)
	}

	return messages, nil
}

// MarkAsRead marks a message as read
func (s *MessageService) MarkAsRead(id string) error {
	if s.db == nil {
		return fmt.Errorf("database not initialized")
	}

	return s.db.Update(func(txn *badger.Txn) error {
		item, err := txn.Get([]byte(id))
		if err != nil {
			return fmt.Errorf("message not found: %w", err)
		}

		var message ContactMessage
		err = item.Value(func(val []byte) error {
			return json.Unmarshal(val, &message)
		})
		if err != nil {
			return fmt.Errorf("failed to decode message: %w", err)
		}

		message.Read = true
		updatedJSON, err := json.Marshal(message)
		if err != nil {
			return fmt.Errorf("failed to marshal message: %w", err)
		}

		return txn.Set([]byte(id), updatedJSON)
	})
}