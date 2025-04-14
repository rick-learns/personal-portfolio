# Rick Cohen | Portfolio

A sleek, terminal-inspired portfolio showcasing my work as a Quality Engineer & Diagnostic Tools Developer.

## Tech Stack

### Frontend
- React + TypeScript + Vite
- Tailwind CSS for styling
- shadcn UI components (based on Radix UI)
- Wouter for lightweight routing

### Backend
- Go (Golang) with Fiber framework
- BadgerDB for data storage
- Zap for structured logging
- JWT for authentication

## Project Structure

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

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Go 1.20+

### Development

Run the frontend:
```bash
npm run frontend
```

Run the backend (in a separate terminal):
```bash
npm run backend
```

### Building for Production

```bash
# Build both frontend and backend
npm run build

# Start the production server
npm run start
```

## Deployment

The application is deployed at [rick-learns.dev](https://rick-learns.dev) using:
- Ubuntu VPS
- Nginx for serving static content
- Cloudflare for DNS, CDN, and DDoS protection
- Let's Encrypt for SSL/TLS

## Features

- Terminal-inspired interface 
- Responsive design for all devices
- Interactive skills visualizations
- Project showcase with filtering
- Contact form with email integration

## Contributing

Have suggestions? Feel free to open an issue or submit a PR!

## License

MIT License