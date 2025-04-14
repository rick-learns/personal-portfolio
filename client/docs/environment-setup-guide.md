# Environment Setup Guide

This guide explains how to configure environment variables for your portfolio project.

## Environment Files

The project uses three main environment files:

1. `.env.development` - Used during local development
2. `.env.production` - Used for production builds
3. `.env.local` - (Optional) Local overrides that aren't committed to Git

## Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_GA_MEASUREMENT_ID` | Google Analytics 4 Measurement ID | `G-XXXXXXXXXX` |
| `VITE_GTM_ID` | Google Tag Manager container ID | `GTM-XXXXXXX` |
| `VITE_SITE_URL` | Your website URL | `https://rick-learns.dev` |
| `VITE_ENABLE_ANALYTICS` | Enable analytics in development (optional) | `true` or `false` |

## Setting Up for Development

1. Copy `.env.development` to `.env.local` if you want to override any values
2. For testing analytics locally, set `VITE_ENABLE_ANALYTICS=true` in `.env.local`

## Setting Up for Production

1. Update `.env.production` with your actual production values
2. These values will be used automatically during the build process

## Security Considerations

- Never commit real credentials to Git
- The `.env.local` file is already in `.gitignore`
- For extra security, you can leave placeholders in the committed `.env.production` file and set real values during the deployment process

## Usage in Code

Environment variables are accessible in your code via:

```typescript
// Direct access
const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;

// Via config helper
import { config } from '@/lib/config';
const siteUrl = config.site.url;
```

## Adding New Environment Variables

When adding new environment variables:

1. Add them to all environment files (`.env.development` and `.env.production`)
2. Prefix them with `VITE_` to make them available to the client-side code
3. Add them to the `config.ts` file for centralized access