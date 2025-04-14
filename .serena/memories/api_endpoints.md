# API Endpoints

## Base URL
- Development: `http://localhost:8081`
- Production: `https://api.rick-learns.dev`

## Authentication
Currently, the portfolio API doesn't require authentication for public endpoints. Admin endpoints require authentication.

## Public Endpoints

### Health Check
- **GET** `/health`
- Returns server status and uptime
- No authentication required
- Response:
  ```json
  {
    "status": "🟢 Operational",
    "uptime": 1234567890
  }
  ```

### Contact Information
- **GET** `/api/v1/contact-info`
- Returns contact email for mailto links
- No authentication required
- Response:
  ```json
  {
    "email": "rick@rick-learns.dev",
    "subject_prefix": "[Portfolio Contact]"
  }
  ```

### Contact Message Submission
- **POST** `/api/v1/contact`
- Endpoint to submit contact form messages
- No authentication required
- Request Body:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Hello, I'd like to discuss a project."
  }
  ```
- Response:
  ```json
  {
    "success": true,
    "message": "Message received"
  }
  ```
- Error Response:
  ```json
  {
    "error": "🔴 Validation Error",
    "message": "Email is required"
  }
  ```

## Admin Endpoints

### Message Management
- **GET** `/api/v1/admin/messages`
- Lists all contact form submissions
- Requires admin authentication
- Response:
  ```json
  {
    "messages": [
      {
        "id": "msg_123",
        "name": "John Doe",
        "email": "john@example.com",
        "message": "Hello, I'd like to discuss a project.",
        "timestamp": "2025-04-13T12:34:56Z",
        "read": false
      }
    ]
  }
  ```

- **PUT** `/api/v1/admin/messages/:id`
- Update message status (e.g., mark as read)
- Requires admin authentication
- Request Body:
  ```json
  {
    "read": true
  }
  ```
- Response:
  ```json
  {
    "success": true,
    "message": "Status updated"
  }
  ```

- **DELETE** `/api/v1/admin/messages/:id`
- Delete a message
- Requires admin authentication
- Response:
  ```json
  {
    "success": true,
    "message": "Message deleted"
  }
  ```

## Rate Limiting
All endpoints are rate-limited to 100 requests per minute per IP address.

## Error Handling
All endpoints return consistent error responses:
```json
{
  "error": "🔴 Error Type",
  "message": "Human-readable error message",
  "trace": "Error details (only in development)"
}
```

## Status Codes
- **200**: Success
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **429**: Too Many Requests
- **500**: Internal Server Error