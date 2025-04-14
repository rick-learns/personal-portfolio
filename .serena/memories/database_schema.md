# Database Schema

## BadgerDB Overview
The personal portfolio uses BadgerDB, a key-value store, for persistence. Since BadgerDB is not a relational database, the schema is defined by the key structure and the serialized data format.

## Key Structure
Keys in BadgerDB follow a prefixed structure to organize different data types:

```
<prefix>:<id>
```

Where:
- `<prefix>` defines the data type/collection
- `<id>` is the unique identifier for the record

## Data Collections

### Contact Messages
- **Prefix**: `msg:`
- **Key Format**: `msg:<timestamp>_<random_id>`
- **Value Format**: JSON serialized message object
- **Example Key**: `msg:2025-04-13T12:34:56Z_abc123`
- **Example Value**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Hello, I'd like to discuss a project.",
    "timestamp": "2025-04-13T12:34:56Z",
    "read": false,
    "ip": "192.168.1.1" 
  }
  ```

### User Accounts (Admin)
- **Prefix**: `user:`
- **Key Format**: `user:<username>`
- **Value Format**: JSON serialized user object
- **Example Key**: `user:admin`
- **Example Value**:
  ```json
  {
    "username": "admin",
    "password_hash": "$2a$10$...", // bcrypt hash
    "role": "admin",
    "created_at": "2025-01-01T00:00:00Z",
    "last_login": "2025-04-13T12:34:56Z"
  }
  ```

### Session Tokens
- **Prefix**: `session:`
- **Key Format**: `session:<token>`
- **Value Format**: JSON serialized session object
- **Example Key**: `session:jwt_token_value`
- **Example Value**:
  ```json
  {
    "user": "admin",
    "expires_at": "2025-04-14T12:34:56Z",
    "created_at": "2025-04-13T12:34:56Z",
    "ip": "192.168.1.1"
  }
  ```

## Data Access Patterns

### Message Operations
1. **Create Message**:
   - Generate key with timestamp and random ID
   - Serialize message object to JSON
   - Store in BadgerDB

2. **List Messages**:
   - Iterate through keys with prefix `msg:`
   - Deserialize values
   - Apply any filtering or sorting in memory

3. **Get Message**:
   - Access directly by full key
   - Deserialize value

4. **Update Message**:
   - Access directly by full key
   - Read current value
   - Modify and serialize
   - Write back to same key

5. **Delete Message**:
   - Delete by full key

### User Operations
Similar patterns apply for user accounts and sessions.

## Transactions
BadgerDB supports ACID transactions that are used for operations requiring consistency:
- Creating user accounts
- Updating sensitive information
- Operations affecting multiple keys

## Indexing Strategy
BadgerDB doesn't have built-in secondary indices, so application-level indexing is implemented:

1. **Message Indexing**:
   - Time-based: The timestamp in the key enables chronological listing
   - Read Status: In-memory filtering for read/unread messages

2. **User Indexing**:
   - Username-based: Direct access by username in key

## Backup Strategy
BadgerDB data is backed up regularly with the following approach:
1. Use BadgerDB's built-in backup functionality
2. Store backups in a separate location
3. Implement automated backup scheduling