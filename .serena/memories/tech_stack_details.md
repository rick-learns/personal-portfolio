# Tech Stack Details

## Frontend
- **React 18.3.1**: Core UI library
- **TypeScript 5.6.3**: Type safety and developer experience
- **Vite 5.4.14**: Fast build tool and dev server
- **Tailwind CSS 3.4.14**: Utility-first CSS framework
- **shadcn UI**: Component collection based on Radix UI
- **Wouter 3.3.5**: Lightweight routing library
- **TanStack React Query 5.60.5**: Data fetching and caching
- **Zod 3.23.8**: Schema validation
- **Recharts 2.13.0**: Data visualization
- **Lucide React 0.453.0**: Icon library

## Backend
- **Go 1.20+**: Programming language
- **Fiber**: Web framework for Go
- **BadgerDB v4**: Embedded key-value database
- **Zap**: Structured logging
- **JWT**: Authentication tokens

## Development Tools
- **ESLint & Prettier**: Code quality and formatting
- **Go testing package**: Unit and integration testing
- **npm**: Package management
- **Git**: Version control

## Build & Deployment
- **Nginx**: Web server
- **Ubuntu**: Server operating system
- **Cloudflare**: DNS, CDN, and security
- **Let's Encrypt**: SSL/TLS certificates

## Key Dependencies and Their Purposes

### Frontend
- **@radix-ui/**: UI primitives for accessible components
- **@tanstack/react-query**: Data fetching, caching, and state management
- **class-variance-authority**: Dynamic class composition
- **clsx & tailwind-merge**: CSS class management
- **react-hook-form**: Form state management
- **zod-validation-error**: Better error messages for validation

### Backend
- **github.com/gofiber/fiber/v2**: HTTP server framework
- **github.com/dgraph-io/badger/v4**: Key-value store
- **go.uber.org/zap**: Structured logging
- **github.com/gofiber/fiber/v2/middleware**: Security middleware

## Integration Points
1. React frontend calls Go API endpoints
2. Go backend interacts with BadgerDB
3. Frontend uses TanStack Query for API data caching
4. Tailwind integrates with shadcn UI components

## Version Compatibility
- Node.js 18.x or higher required
- Go 1.20+ required
- Modern browsers supported (Chrome, Firefox, Safari, Edge)