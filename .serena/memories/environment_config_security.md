# Environment Configuration Security

## Overview
This project uses environment variables for configuration and sensitive credentials.

## Best Practices

### Managing .env Files
- **NEVER commit .env files with real secrets to the repository**
- Use `.env.example` as a template with placeholder values
- Each developer should maintain their own local `.env` file
- Production environments should have secured environment variables

### Environment Variables Used
- **RESEND_API_KEY**: API key for Resend email service
- **PORT**: Server port (default: 8080)
- **ENV**: Environment name (development, production)
- **ALLOWED_ORIGINS**: CORS allowed origins
- **MAX_REQUESTS_PER_IP**: Rate limiting configuration
- **EMAIL_SEND_LIMIT**: Maximum emails per period
- **LOG_LEVEL**: Logging verbosity

### Setup Instructions for New Developers
1. Copy `.env.example` to `.env`
   ```bash
   cp server/.env.example server/.env
   ```
2. Obtain necessary API keys and credentials
3. Fill in your `.env` file with actual values
4. Keep your `.env` file private

### Production Deployment
For production:
1. Set environment variables in the deployment platform
2. Never store production secrets in files
3. Rotate API keys periodically
4. Use different API keys for different environments

### Security Measures
- The `.gitignore` file includes patterns to prevent committing .env files
- If a secret is accidentally committed, consider it compromised and rotate it immediately
- Use environment-specific validation to ensure all required variables are set

## Recovering from Leaked Secrets
If credentials are accidentally leaked:
1. Revoke and rotate the compromised credentials immediately
2. Check for any unauthorized usage
3. Review Git history and consider using tools like BFG Repo-Cleaner to remove secrets from history
4. Notify team members as appropriate