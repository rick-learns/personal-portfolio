# Project Architecture

## Overview
This personal portfolio is built with a clean separation between frontend and backend:

- Frontend: React single-page application
- Backend: Go API server
- Database: BadgerDB (embedded key-value store)

## Frontend Architecture
- Built with React, TypeScript, and Vite
- Component-based design following atomic design principles
- State management through React hooks and context
- Client-side routing with Wouter
- Tailwind CSS for styling with shadcn UI components

## Backend Architecture
- Go with Fiber web framework
- Clean architecture pattern:
  - Routes: Define API endpoints and handle HTTP requests
  - Services: Contain business logic
  - Config: Application configuration
- BadgerDB for data persistence
- Middleware for security, CORS, and rate limiting

## Communication
- Frontend communicates with backend via RESTful API
- JSON as the data exchange format
- Client-side rendering with API data fetching

## File Structure
```
/
├── client/             # Frontend React application
│   ├── src/
│   │   ├── components/ # UI components
│   │   ├── hooks/      # Custom React hooks
│   │   ├── lib/        # Utilities and data
│   │   └── pages/      # Page components
│   └── ...
├── server/             # Go backend service
│   ├── config/         # Application configuration
│   ├── routes/         # API routes and handlers
│   ├── services/       # Business logic and services
│   ├── tests/          # Test files
│   └── main.go         # Entry point
└── shared/             # Shared code between frontend and backend
```

## Design Patterns
- Container/Presentational pattern for React components
- Dependency Injection in Go services
- Middleware pattern for request processing
- Repository pattern for data access

## Key Design Decisions
1. Using Go instead of Node.js for backend to improve performance
2. BadgerDB as an embedded database for simplicity
3. Terminal-inspired UI for developer authenticity
4. Modular component design for maintainability
5. Responsive design using Tailwind CSS