# Portfolio Backend

This is a Go-based backend server for my personal portfolio website. It handles contact form submissions and provides a clean API for the frontend to interact with.

## Features

- Contact form handling with validation
- Rate limiting to prevent abuse
- Email sending via Resend API
- Secure configuration with proper headers
- Health check endpoint
- Built with modern Go practices

## Technology Stack

- Go 1.21
- Fiber web framework
- BadgerDB for persistence
- Zap for logging
- Docker for containerization

## API Endpoints

- `GET /health` - Health check endpoint
- `POST /api/v1/contact` - Contact form submission

## Development

To run locally:

```bash
go run main.go
```

To build:

```bash
go build -o portfolio-server
```

## Docker

Build the Docker image:

```bash
docker build -t portfolio-backend .
```

Run the Docker container:

```bash
docker run -p 8080:8080 -e RESEND_API_KEY=your_key_here portfolio-backend
```

## Environment Variables

- `RESEND_API_KEY` - API key for the Resend email service
- `PORT` - Server port (default: 8080)
- `ENV` - Environment (development/production)
