# Component Structure

## Component Hierarchy
```
App
├── Header
├── Pages
│   ├── Home
│   │   ├── HeroSection
│   │   ├── AboutSection
│   │   ├── SkillsSection
│   │   │   └── SkillBar
│   │   ├── ProjectsSection
│   │   │   └── ProjectCard
│   │   └── ContactSection
│   └── NotFound
└── Footer
```

## Key Components

### Layout Components
- **Header.tsx**: Navigation and theme toggle
- **Footer.tsx**: Footer with contact links and copyright
- **TerminalWindow.tsx**: Terminal-themed container for content

### Section Components
- **HeroSection.tsx**: Landing section with introduction
- **AboutSection.tsx**: Personal bio and background
- **SkillsSection.tsx**: Skills with visualization
- **ProjectsSection.tsx**: Portfolio project showcase
- **ContactSection.tsx**: Contact form and information

### UI Components
- Extensive collection of shadcn UI components in `/client/src/components/ui/`
- Custom components like **SkillBar.tsx** for specific UI needs
- **ProjectCard.tsx**: Card displaying project information

## Data Flow
1. Data is primarily stored in `/client/src/lib/data.ts`
2. Parent components pass data to children via props
3. Form data in ContactSection is sent to the backend API
4. Dynamic state managed with React hooks

## Component Props

### Common Props
- **className**: For style customization
- **children**: For component composition
- **variant**: For different visual styles
- **size**: For component sizing

### Specific Props
- **SkillBar**: `name`, `percentage`, `color`
- **ProjectCard**: `title`, `description`, `tags`, `image`, `link`
- **TerminalWindow**: `title`, `children`, `variant`

## Hooks Usage
- **useState**: Local component state
- **useEffect**: Side effects and lifecycle
- **useMobile**: Custom hook for responsive design
- **useToast**: For displaying notifications

## State Management
- Component state with useState for local UI state
- Context API for theme and global state
- TanStack Query for remote data fetching and caching

## Styling Approach
- Tailwind CSS utility classes for styling
- CSS variables for theme customization
- Class variance authority for component variants
- Terminal-inspired design system