# Code Style and Conventions

## TypeScript
- Uses strict TypeScript configuration
- Types are defined for data structures in the application
- Component props are typed

## React Components
- Functional components with TypeScript
- Component files use PascalCase naming (e.g., `HeroSection.tsx`)
- Components are organized by their function in the portfolio

## CSS/Styling
- Tailwind CSS is used for styling
- Custom theme configuration in theme.json and tailwind.config.ts
- UI components from shadcn/ui library (based on Radix UI)

## File Structure
- Pages in `/client/src/pages`
- Components in `/client/src/components`
- Utility functions and data in `/client/src/lib`
- Custom hooks in `/client/src/hooks`

## Import Aliases
- `@/` for client source code
- `@shared/` for shared code
- `@assets/` for static assets

## Data Organization
- Data is centralized in data.ts with typed exports
- Clear separation of data from presentation components