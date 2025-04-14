# Deployment Process

## Infrastructure
- **Server**: Ubuntu 22.04 LTS VPS
- **Web Server**: Nginx 1.18+
- **DNS & CDN**: Cloudflare
- **SSL/TLS**: Let's Encrypt via Certbot

## Environments
1. **Development**: Local environment
2. **Production**: Live website at rick-learns.dev

## Deployment Steps

### Initial Server Setup
1. Set up Ubuntu server with necessary security configuration
2. Install required dependencies:
   ```bash
   sudo apt update
   sudo apt install -y nginx golang-1.20 certbot python3-certbot-nginx
   ```
3. Configure firewall:
   ```bash
   sudo ufw allow 22
   sudo ufw allow 80
   sudo ufw allow 443
   sudo ufw enable
   ```

### Application Deployment

#### Frontend Deployment
1. Build the frontend on a local/CI machine:
   ```bash
   cd client
   npm ci
   npm run build
   ```
2. Copy the build files to the server:
   ```bash
   scp -r dist/* user@server:/var/www/rick-learns.dev/client/dist/
   ```

#### Backend Deployment
1. Build the Go binary on a local/CI machine or directly on the server:
   ```bash
   cd server
   go build -o portfolio-server main.go
   ```
2. Copy the binary to the server (if built locally):
   ```bash
   scp portfolio-server user@server:/var/www/rick-learns.dev/server/
   ```
3. Set up systemd service for the backend:
   ```
   [Unit]
   Description=Rick's Portfolio Backend
   After=network.target

   [Service]
   Type=simple
   User=www-data
   WorkingDirectory=/var/www/rick-learns.dev/server
   ExecStart=/var/www/rick-learns.dev/server/portfolio-server
   Restart=on-failure
   Environment=PORT=8081
   Environment=DB_PATH=/var/www/rick-learns.dev/data

   [Install]
   WantedBy=multi-user.target
   ```

### Nginx Configuration
1. Create Nginx configuration in `/etc/nginx/sites-available/rick-learns.dev.conf`:
   ```nginx
   # Frontend configuration
   server {
       listen 443 ssl http2;
       server_name rick-learns.dev www.rick-learns.dev;
       
       ssl_certificate /etc/letsencrypt/live/rick-learns.dev/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/rick-learns.dev/privkey.pem;
       
       root /var/www/rick-learns.dev/client/dist;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
       
       location /assets/ {
           try_files $uri =404;
           expires 30d;
       }
       
       # API proxy
       location /api/ {
           proxy_pass http://localhost:8081;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
       
       # Health check proxy
       location /health {
           proxy_pass http://localhost:8081/health;
       }
       
       error_log /var/log/nginx/rick-learns-dev-error.log;
       access_log /var/log/nginx/rick-learns-dev-access.log;
   }

   # HTTP to HTTPS redirect
   server {
       listen 80;
       server_name rick-learns.dev www.rick-learns.dev;
       return 301 https://$host$request_uri;
   }
   ```

2. Enable the site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/rick-learns.dev.conf /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

### SSL/TLS Setup
1. Obtain Let's Encrypt certificates:
   ```bash
   sudo certbot --nginx -d rick-learns.dev -d www.rick-learns.dev
   ```
2. Set up automatic renewal:
   ```bash
   sudo certbot renew --dry-run
   ```

### Database Setup
1. Create data directory:
   ```bash
   sudo mkdir -p /var/www/rick-learns.dev/data
   sudo chown www-data:www-data /var/www/rick-learns.dev/data
   ```

### Continuous Deployment
For updates:
1. Build new frontend and backend versions
2. Copy files to server
3. Restart the backend service:
   ```bash
   sudo systemctl restart portfolio-backend
   ```

## Rollback Procedure
If deployment fails:
1. Restore previous frontend build:
   ```bash
   sudo cp -r /var/www/rick-learns.dev/backup/dist/* /var/www/rick-learns.dev/client/dist/
   ```
2. Restore previous backend binary:
   ```bash
   sudo cp /var/www/rick-learns.dev/backup/portfolio-server /var/www/rick-learns.dev/server/
   sudo systemctl restart portfolio-backend
   ```

## Monitoring
- Nginx access and error logs
- Application logs
- Uptime monitoring via Cloudflare
- Periodic health checks

## Backup Strategy
1. Database backups daily to separate storage
2. Configuration backups after changes
3. Version control for code