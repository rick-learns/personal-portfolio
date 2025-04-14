#!/bin/bash
# build.sh - Deployment script for Rick's Portfolio
# Usage: ./build.sh [version]
# Examples:
#   ./build.sh                  # Auto-increments patch version
#   ./build.sh 1.2.3            # Sets specific version
#   ./build.sh major            # Increments major version
#   ./build.sh minor            # Increments minor version
#   ./build.sh patch            # Increments patch version (same as no argument)

# Set variables
REPO_DIR="/var/www/rick-learns.dev"
CLIENT_DIR="$REPO_DIR/client"
DIST_DIR="$CLIENT_DIR/dist"
VERSION_FILE="$CLIENT_DIR/src/version.js"
ENV_PROD_FILE="$CLIENT_DIR/.env.production"
BRANCH="main"
WEB_USER="www-data"
LOG_FILE="$REPO_DIR/deploy-$(date +%Y%m%d-%H%M%S).log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to log messages
log() {
  echo -e "$(date +"%Y-%m-%d %H:%M:%S") - $1" | tee -a "$LOG_FILE"
}

# Error handling function
handle_error() {
  log "${RED}ERROR: $1${NC}"
  exit 1
}

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then
  handle_error "Please run as root or with sudo"
fi

# Get current version from version.js file
if [ -f "$VERSION_FILE" ]; then
  CURRENT_VERSION=$(grep "number:" "$VERSION_FILE" | sed -E "s/.*number: '([^']+)'.*/\1/")
  log "Current version from file: $CURRENT_VERSION"
else
  CURRENT_VERSION="0.0.0"
  log "${YELLOW}Version file not found, defaulting to $CURRENT_VERSION${NC}"
fi

# Parse current version
MAJOR=$(echo $CURRENT_VERSION | cut -d. -f1)
MINOR=$(echo $CURRENT_VERSION | cut -d. -f2)
PATCH=$(echo $CURRENT_VERSION | cut -d. -f3)

# Handle version argument
if [ -z "$1" ]; then
  # No argument, increment patch version
  NEW_PATCH=$((PATCH + 1))
  NEW_VERSION="$MAJOR.$MINOR.$NEW_PATCH"
  VERSION_TYPE="patch"
elif [ "$1" = "major" ]; then
  # Increment major version, reset minor and patch
  NEW_MAJOR=$((MAJOR + 1))
  NEW_VERSION="$NEW_MAJOR.0.0"
  VERSION_TYPE="major"
elif [ "$1" = "minor" ]; then
  # Increment minor version, reset patch
  NEW_MINOR=$((MINOR + 1))
  NEW_VERSION="$MAJOR.$NEW_MINOR.0"
  VERSION_TYPE="minor"
elif [ "$1" = "patch" ]; then
  # Increment patch version
  NEW_PATCH=$((PATCH + 1))
  NEW_VERSION="$MAJOR.$MINOR.$NEW_PATCH"
  VERSION_TYPE="patch"
else
  # Use the provided version string
  NEW_VERSION="$1"
  VERSION_TYPE="custom"
  
  # Validate version format
  if ! [[ $NEW_VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    handle_error "Invalid version format. Must be in format X.Y.Z (e.g., 1.2.3)"
  fi
fi

# Build date
BUILD_DATE=$(date +"%Y-%m-%d %H:%M:%S")

# Start deployment
log "${GREEN}Starting deployment process${NC}"
log "Repository: $REPO_DIR"
log "Branch: $BRANCH"
log "Current version: $CURRENT_VERSION"
log "New version: $NEW_VERSION (${VERSION_TYPE} update)"

# Navigate to repository directory
cd "$REPO_DIR" || handle_error "Could not navigate to $REPO_DIR"

# Backup current site (optional)
BACKUP_DIR="$REPO_DIR/backups/$(date +%Y%m%d-%H%M%S)"
log "${YELLOW}Creating backup at $BACKUP_DIR${NC}"
mkdir -p "$BACKUP_DIR"
if [ -d "$DIST_DIR" ]; then
  cp -R "$DIST_DIR" "$BACKUP_DIR/" || log "${YELLOW}Warning: Backup failed, continuing anyway${NC}"
fi

# Reset any local changes and pull from git
log "${GREEN}Fetching latest code from repository${NC}"
git fetch origin || handle_error "Git fetch failed"

# Check if there are any new changes
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse origin/$BRANCH)
COMMIT_HASH=$(git rev-parse --short HEAD)

if [ "$LOCAL" = "$REMOTE" ]; then
  log "${YELLOW}No changes detected. Local is up to date with origin/$BRANCH.${NC}"
  read -p "Continue with build anyway? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    log "Deployment cancelled by user"
    exit 0
  fi
fi

# Pull latest changes
log "Pulling latest changes from origin/$BRANCH"
git reset --hard origin/$BRANCH || handle_error "Git reset failed"
COMMIT_HASH=$(git rev-parse --short HEAD)

# Update version file
log "${GREEN}Updating version information${NC}"
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

# Check for environment variables file or create it
if [ ! -f "$ENV_PROD_FILE" ]; then
  log "${YELLOW}Production environment file not found. Creating from template...${NC}"
  cat > "$ENV_PROD_FILE" << EOF
# Production environment variables
VITE_GA_MEASUREMENT_ID=G-2WSTR230D3
VITE_GTM_ID=
VITE_SITE_URL=https://rick-learns.dev
EOF
  log "Created .env.production file with default values. Please update with correct values if needed."
else
  log "Using existing .env.production file."
fi

# Install dependencies and build
log "${GREEN}Installing dependencies${NC}"
cd "$CLIENT_DIR" || handle_error "Could not navigate to $CLIENT_DIR"

# Fix permissions for node_modules and dist
log "Setting correct permissions"
chown -R $(whoami):$(whoami) "$CLIENT_DIR/node_modules" 2>/dev/null || true
if [ -d "$DIST_DIR" ]; then
  rm -rf "$DIST_DIR" || handle_error "Could not remove old dist directory"
fi

# Install dependencies
log "Running npm ci"
npm ci || handle_error "npm ci failed"

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
log "${GREEN}Building project${NC}"
npm run build || handle_error "Build failed"

# Set correct permissions for web server
log "Setting permissions for web server"
chown -R $(whoami):$WEB_USER "$DIST_DIR"
chmod -R 755 "$DIST_DIR"

# Check Nginx configuration
log "${GREEN}Testing Nginx configuration${NC}"
nginx -t || handle_error "Nginx configuration test failed"

# Reload Nginx
log "Reloading Nginx"
systemctl reload nginx || handle_error "Failed to reload Nginx"

# Deployment complete
log "${GREEN}Deployment completed successfully!${NC}"
log "Site is now live at https://rick-learns.dev"

# Print some useful information
log "----------------------------"
log "Deployment summary:"
log "Version: ${BLUE}$NEW_VERSION${NC} (${YELLOW}${VERSION_TYPE}${NC} update from $CURRENT_VERSION)"
log "Commit hash: $COMMIT_HASH"
log "Commit message: $(git log -1 --pretty=%B)"
log "Deployment time: $BUILD_DATE"
log "Analytics ID: G-2WSTR230D3"
log "----------------------------"

exit 0