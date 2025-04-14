# Managing Environment Variables & Sensitive Information

This document explains how sensitive information like analytics IDs are managed in this project.

## Environment Variables Setup

### File Structure
- `.env.production.example` - Template for production variables (committed to Git)
- `.env.development.example` - Template for development variables (committed to Git)
- `.env.production` - Actual production variables (NOT committed to Git)
- `.env.development` - Actual development variables (NOT committed to Git)

### Key Variables
- `VITE_GA_MEASUREMENT_ID` - Google Analytics 4 ID (currently G-2WSTR230D3)
- `VITE_GTM_ID` - Google Tag Manager ID (not currently used)
- `VITE_SITE_URL` - Your site URL

## How It Works

1. **In Development:**
   - The `.env.development` file is used
   - Analytics are disabled by default (can be enabled with `VITE_ENABLE_ANALYTICS=true`)
   - You can see analytics debugging in the console if enabled

2. **In Production:**
   - The `.env.production` file is used
   - Analytics are always enabled
   - The build script checks for this file and creates it if missing

3. **In Git:**
   - The actual environment files are excluded via `.gitignore`
   - Only the example files are committed to Git
   - This keeps sensitive IDs out of the repository

## Deployment Process

During deployment, the build script:
1. Pulls the latest code from Git
2. Checks for the `.env.production` file
3. Creates it with your Google Analytics ID if missing
4. Builds the application using these environment variables

## Adding New Sensitive Information

If you need to add new sensitive information:
1. Add it to the `.env.*.example` files with placeholder values
2. Add it to your actual `.env.*` files with real values
3. Access it in your code via `import.meta.env.VITE_YOUR_VARIABLE`

## Security Considerations

- Never commit `.env.production` or `.env.development` to Git
- Always prefix environment variables with `VITE_` to expose them to the client
- Regularly rotate sensitive credentials/IDs
- Use example files to document what variables are needed

## Checking Current Setup

You can verify your current environment variables setup by:
1. Looking at the `.env.production` file on your server
2. Looking at the network requests in your browser to verify Google Analytics is loading
3. Using Google Analytics Debugger browser extension

For further assistance, refer to the Vite documentation on environment variables: 
https://vitejs.dev/guide/env-and-mode.html