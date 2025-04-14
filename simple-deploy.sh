#!/bin/sh
# simple-deploy.sh - Simplified deployment script for Rick's Portfolio
# Usage: sudo sh simple-deploy.sh [version]

# Set variables
REPO_DIR="/var/www/rick-learns.dev"
CLIENT_DIR="$REPO_DIR/client"
DIST_DIR="$CLIENT_DIR/dist"
VERSION_FILE="$CLIENT_DIR/src/version.js"
BRANCH="main"
WEB_USER="www-data"
LOG_FILE="$REPO_DIR/deploy-$(date +%Y%m%d-%H%M%S).log"

# Handle version input
NEW_VERSION="$1"
if [ -z "$NEW_VERSION" ]; then
  echo "Error: Please provide a version number (e.g., 1.0.3)"
  exit 1
fi

# Build date
BUILD_DATE=$(date +"%Y-%m-%d %H:%M:%S")

# Log function
log() {
  echo "$(date +"%Y-%m-%d %H:%M:%S") - $1" | tee -a "$LOG_FILE"
}

# Start deployment
log "Starting deployment process"
log "Repository: $REPO_DIR"
log "Branch: $BRANCH"
log "Setting version to: $NEW_VERSION"

# Navigate to repository directory
cd "$REPO_DIR" || { log "Could not navigate to $REPO_DIR"; exit 1; }

# Backup current site
BACKUP_DIR="$REPO_DIR/backups/$(date +%Y%m%d-%H%M%S)"
log "Creating backup at $BACKUP_DIR"
mkdir -p "$BACKUP_DIR"
if [ -d "$DIST_DIR" ]; then
  cp -R "$DIST_DIR" "$BACKUP_DIR/" || log "Warning: Backup failed, continuing anyway"
fi

# Pull latest changes
log "Fetching latest code from repository"
git fetch origin || { log "Git fetch failed"; exit 1; }
git reset --hard origin/$BRANCH || { log "Git reset failed"; exit 1; }
COMMIT_HASH=$(git rev-parse --short HEAD)

# Update version file
log "Updating version information"
cat > "$VERSION_FILE" << EOF
/**
 * Application version information
 * Automatically updated during build process
 * Last updated: $BUILD_DATE
 */
export const version = {
  number: '$NEW_VERSION',
  buildDate: '$BUILD_DATE',
  commitHash: '$COMMIT_HASH',
  environment: process.env.NODE_ENV || 'development'
};

export default version;
EOF

log "Updated version file with new version: $NEW_VERSION (commit: $COMMIT_HASH)"

# Fix PATH for npm
export PATH=$PATH:/usr/bin:/usr/local/bin:/home/rick/.nvm/versions/node/*/bin
export NVM_DIR="/home/rick/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# Install dependencies and build
log "Installing dependencies"
cd "$CLIENT_DIR" || { log "Could not navigate to $CLIENT_DIR"; exit 1; }

# Fix permissions for node_modules and dist
log "Setting correct permissions"
if [ -d "$DIST_DIR" ]; then
  rm -rf "$DIST_DIR" || { log "Could not remove old dist directory"; exit 1; }
fi

# Find npm and node
NPM_PATH=$(which npm 2>/dev/null)
if [ -z "$NPM_PATH" ]; then
  # Try common locations
  for DIR in /usr/bin /usr/local/bin /home/rick/.nvm/versions/node/*/bin; do
    if [ -x "$DIR/npm" ]; then
      NPM_PATH="$DIR/npm"
      break
    fi
  done
fi

if [ -z "$NPM_PATH" ]; then
  log "npm command not found. Please install npm or provide the correct path."
  exit 1
fi

# Install dependencies
log "Running npm ci using $NPM_PATH"
$NPM_PATH ci || { log "npm ci failed"; exit 1; }

# Create version display file
mkdir -p "$CLIENT_DIR/public"
cat > "$CLIENT_DIR/public/version.txt" << EOF
Rick Cohen Portfolio
Version: $NEW_VERSION
Build date: $BUILD_DATE
Commit: $COMMIT_HASH
Environment: production
EOF

# Build the project
log "Building project"
$NPM_PATH run build || { log "Build failed"; exit 1; }

# Set correct permissions for web server
log "Setting permissions for web server"
chown -R $(whoami):$WEB_USER "$DIST_DIR"
chmod -R 755 "$DIST_DIR"

# Check Nginx configuration
log "Testing Nginx configuration"
nginx -t || { log "Nginx configuration test failed"; exit 1; }

# Reload Nginx
log "Reloading Nginx"
systemctl reload nginx || { log "Failed to reload Nginx"; exit 1; }

# Deployment complete
log "Deployment completed successfully!"
log "Site is now live at https://rick-learns.dev"

# Print summary
log "----------------------------"
log "Deployment summary:"
log "Version: $NEW_VERSION"
log "Commit hash: $COMMIT_HASH"
log "Deployment time: $BUILD_DATE"
log "----------------------------"
