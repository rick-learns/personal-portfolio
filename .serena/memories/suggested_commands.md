# Suggested Commands for Development

## Project Setup and Development
```powershell
# Install dependencies
npm install

# Start development server
npm run dev

# Type checking
npm run check
```

## Build and Production
```powershell
# Build the project (client and server)
npm run build

# Start production server
npm run start
```

## Database Operations
```powershell
# Push database schema changes
npm run db:push
```

## Windows PowerShell Utility Commands
```powershell
# List files in directory
dir
dir /a  # Show hidden files

# Change directory
cd <directory_path>

# Go back one directory
cd ..

# Create a new directory
mkdir <directory_name>

# Remove a file
del <file_name>

# Remove a directory
rmdir <directory_name>

# Search content in files
Select-String -Path <path> -Pattern <pattern>

# Find files
Get-ChildItem -Path <path> -Filter <pattern> -Recurse

# Get file content
Get-Content <file_path>

# Git commands
git status
git add .
git commit -m "message"
git push
git pull
```

## Project Structure Navigation
```powershell
# Navigate to client source
cd client/src

# Navigate to server
cd server

# Navigate to shared code
cd shared

# Navigate to components
cd client/src/components
```