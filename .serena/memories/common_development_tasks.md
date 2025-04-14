# Common Development Tasks

## Setting Up the Development Environment

1. **Clone the repository**
   ```bash
   git clone https://github.com/rick-learns/personal-portfolio.git
   cd personal-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development servers**
   ```bash
   # In one terminal - start frontend
   npm run frontend
   
   # In another terminal - start backend
   npm run backend
   ```

## Frontend Development Tasks

### Adding a New Component

1. **Create component file**
   Create a new file in `client/src/components/` with the appropriate name.
   ```tsx
   // Example: client/src/components/NewFeature.tsx
   import React from 'react';
   
   interface NewFeatureProps {
     title: string;
     description: string;
   }
   
   export function NewFeature({ title, description }: NewFeatureProps) {
     return (
       <div className="p-4 border rounded-md bg-card text-card-foreground">
         <h3 className="text-lg font-semibold">{title}</h3>
         <p className="mt-2">{description}</p>
       </div>
     );
   }
   ```

2. **Import and use the component**
   ```tsx
   import { NewFeature } from '../components/NewFeature';
   
   // Then in your JSX
   <NewFeature 
     title="Feature Title" 
     description="Feature description goes here."
   />
   ```

### Updating Portfolio Data

1. **Edit the data file**
   Update information in `client/src/lib/data.ts`:
   ```tsx
   // Example: Adding a new project
   export const projects = [
     // Existing projects...
     {
       title: "New Project",
       description: "Description of the new project",
       tags: ["React", "TypeScript", "Tailwind"],
       image: "/images/new-project.png",
       link: "https://github.com/rick-learns/new-project"
     }
   ];
   ```

### Adding a New Page

1. **Create page component**
   Create a new file in `client/src/pages/`:
   ```tsx
   // Example: client/src/pages/Blog.tsx
   import React from 'react';
   
   export function Blog() {
     return (
       <div className="container mx-auto py-8">
         <h1 className="text-3xl font-bold">Blog</h1>
         {/* Blog content */}
       </div>
     );
   }
   ```

2. **Add route in App.tsx**
   ```tsx
   import { Blog } from './pages/Blog';
   
   // In the Router component
   <Route path="/blog" component={Blog} />
   ```

## Backend Development Tasks

### Creating a New API Endpoint

1. **Define handler function**
   Create or update a handler in `server/routes/` directory:
   ```go
   // Example: Add to server/routes/blog_handler.go
   package routes

   import (
     "github.com/gofiber/fiber/v2"
     "github.com/rick-learns/portfolio-backend/config"
   )

   func GetBlogPosts(c *fiber.Ctx, appConfig *config.AppConfig) error {
     // Handler logic
     return c.JSON(fiber.Map{
       "posts": []fiber.Map{
         {"id": 1, "title": "First Post", "content": "Content here..."},
       },
     })
   }
   ```

2. **Register route in routes.go**
   ```go
   // Add to server/routes/routes.go in the SetupRoutes function
   v1.Get("/blog", func(c *fiber.Ctx) error {
     return GetBlogPosts(c, appConfig)
   })
   ```

### Adding a New Database Model

1. **Define model structure**
   ```go
   // Example: Add to server/services/blog_service.go
   package services

   import (
     "time"
   )

   type BlogPost struct {
     ID        string    `json:"id"`
     Title     string    `json:"title"`
     Content   string    `json:"content"`
     CreatedAt time.Time `json:"created_at"`
     UpdatedAt time.Time `json:"updated_at"`
   }
   ```

2. **Implement CRUD operations**
   ```go
   // Example: In server/services/blog_service.go
   
   // CreateBlogPost stores a new blog post
   func CreateBlogPost(db *badger.DB, post BlogPost) error {
     // Implementation
   }
   
   // GetBlogPost retrieves a blog post by ID
   func GetBlogPost(db *badger.DB, id string) (BlogPost, error) {
     // Implementation
   }
   
   // ListBlogPosts retrieves all blog posts
   func ListBlogPosts(db *badger.DB) ([]BlogPost, error) {
     // Implementation
   }
   ```

## Testing Tasks

### Writing a Frontend Test

```tsx
// Example: client/src/components/NewFeature.test.tsx
import { render, screen } from '@testing-library/react';
import { NewFeature } from './NewFeature';

describe('NewFeature', () => {
  it('renders the title and description', () => {
    render(<NewFeature title="Test Title" description="Test Description" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });
});
```

### Writing a Backend Test

```go
// Example: server/services/blog_service_test.go
package services

import (
  "testing"
  "github.com/stretchr/testify/assert"
)

func TestCreateBlogPost(t *testing.T) {
  // Setup test database
  db, cleanup := setupTestDB(t)
  defer cleanup()
  
  // Test implementation
  post := BlogPost{
    ID:      "post_1",
    Title:   "Test Post",
    Content: "Test Content",
  }
  
  err := CreateBlogPost(db, post)
  assert.NoError(t, err)
  
  // Verify post was created
  retrieved, err := GetBlogPost(db, "post_1")
  assert.NoError(t, err)
  assert.Equal(t, post.Title, retrieved.Title)
  assert.Equal(t, post.Content, retrieved.Content)
}
```

## Deployment Tasks

### Building for Production

```bash
# Build both frontend and backend
npm run build

# Or build them separately
npm run build:frontend
npm run build:backend
```

### Deploying Updates

1. **Build the project locally**
   ```bash
   npm run build
   ```

2. **Transfer frontend files to server**
   ```bash
   # Using scp
   scp -r client/dist/* user@server:/var/www/rick-learns.dev/client/dist/
   
   # Or using rsync
   rsync -avz client/dist/ user@server:/var/www/rick-learns.dev/client/dist/
   ```

3. **Transfer backend binary to server**
   ```bash
   scp server/portfolio-server user@server:/var/www/rick-learns.dev/server/
   ```

4. **Restart the backend service**
   ```bash
   ssh user@server "sudo systemctl restart portfolio-backend"
   ```

## Common Troubleshooting

### Frontend Issues

1. **Dependency conflicts**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules
   npm install
   ```

2. **Development server not starting**
   - Check for port conflicts
   - Ensure Vite is installed correctly

### Backend Issues

1. **Server fails to start**
   - Check port availability
   - Verify environment variables
   - Check logs: `tail -f /var/log/portfolio-backend.log`

2. **Database errors**
   - Verify BadgerDB path exists and is writable
   - Check disk space

3. **API errors**
   - Check Nginx proxy configuration
   - Verify CORS settings
   
### Permissions Issues

1. **File permission errors**
   ```bash
   # Set correct ownership
   sudo chown -R www-data:www-data /var/www/rick-learns.dev
   
   # Set correct permissions
   sudo chmod -R 755 /var/www/rick-learns.dev
   sudo chmod -R 700 /var/www/rick-learns.dev/data
   ```

## Performance Optimization

1. **Frontend optimization**
   - Analyze bundle size: `npm run analyze`
   - Lazy load components where appropriate
   - Optimize images with appropriate formats and sizes

2. **Backend optimization**
   - Use caching for frequently accessed data
   - Implement rate limiting for API endpoints
   - Consider database query optimizations