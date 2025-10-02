# Deploy Credit Hardar to Fly.io (FREE)

## Why Fly.io?
- ✅ **FREE tier** with generous limits
- ✅ **Full Docker Compose support** 
- ✅ **One deployment** for frontend + backend
- ✅ **Built-in PostgreSQL** (free)
- ✅ **Global edge locations**
- ✅ **Automatic HTTPS**

## Step 1: Install Fly CLI

### Windows:
```powershell
# Install via PowerShell
iwr https://fly.io/install.ps1 -useb | iex
```

### Alternative:
Download from: https://fly.io/docs/hands-on/install-flyctl/

## Step 2: Login and Setup

```bash
# Login to Fly.io
fly auth login

# Initialize your app (run from project root)
fly launch
```

**When prompted:**
- **App name**: `credit-hardar` (or whatever you prefer)
- **Region**: Choose closest to you
- **PostgreSQL**: Yes (select free tier)
- **Redis**: Yes (select free tier)

## Step 3: Configure for Credit Hardar

Fly will create a `fly.toml` file. Update it:

```toml
app = "credit-hardar"
primary_region = "iad"

[build]

[env]
  PORT = "8080"
  POSTGRES_USER = "hardaruser"
  POSTGRES_DB = "credithardar"
  JWT_SECRET = "fly_jwt_secret_change_in_production"
  FERNET_KEY = "ZmDfcTF7_60GrrY167zsiPd67pEvs0aGOv2oasOM1Pg="
  CORS_ORIGINS = "https://credit-hardar.fly.dev"

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0
  processes = ["app"]

[[http_service.checks]]
  grace_period = "10s"
  interval = "30s"
  method = "GET"
  timeout = "5s"
  path = "/healthz"

[[vm]]
  memory = "1gb"
  cpu_kind = "shared"
  cpus = 1

[processes]
  app = "uvicorn main:app --host 0.0.0.0 --port 8080"
  web = "npm start"
```

## Step 4: Create Dockerfile for Fly

Create `Dockerfile` in project root:

```dockerfile
# Multi-stage build for Credit Hardar
FROM node:20-alpine AS web-builder
WORKDIR /app/web
COPY apps/web/package*.json ./
RUN npm install
COPY apps/web/ ./
RUN npm run build

FROM python:3.11-slim AS api-builder
RUN apt-get update && apt-get install -y libmagic1 && rm -rf /var/lib/apt/lists/*
WORKDIR /app/api
COPY apps/api/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY apps/api/ ./

# Final stage
FROM python:3.11-slim
RUN apt-get update && apt-get install -y libmagic1 nginx && rm -rf /var/lib/apt/lists/*

# Copy API
WORKDIR /app
COPY --from=api-builder /app/api ./api
COPY --from=api-builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=api-builder /usr/local/bin /usr/local/bin

# Copy Web build
COPY --from=web-builder /app/web/.next ./web/.next
COPY --from=web-builder /app/web/public ./web/public
COPY --from=web-builder /app/web/package*.json ./web/
COPY --from=web-builder /app/web/next.config.js ./web/

# Install Node.js for serving web app
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt-get install -y nodejs

# Setup nginx for routing
COPY <<EOF /etc/nginx/sites-available/default
server {
    listen 8080;
    
    # API routes
    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
    
    location /docs {
        proxy_pass http://localhost:8000/docs;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
    
    location /healthz {
        proxy_pass http://localhost:8000/healthz;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
    
    # Frontend routes
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOF

# Startup script
COPY <<EOF /app/start.sh
#!/bin/bash
cd /app/api && uvicorn main:app --host 0.0.0.0 --port 8000 &
cd /app/web && npm start &
nginx -g "daemon off;"
EOF

RUN chmod +x /app/start.sh

EXPOSE 8080
CMD ["/app/start.sh"]
```

## Step 5: Deploy

```bash
# Deploy to Fly.io
fly deploy

# Check status
fly status

# View logs
fly logs
```

## Step 6: Share with Partners

You'll get a URL like:
**https://credit-hardar.fly.dev**

This single URL serves:
- **Homepage**: https://credit-hardar.fly.dev
- **API Docs**: https://credit-hardar.fly.dev/docs
- **Dashboard**: https://credit-hardar.fly.dev/dashboard

## Free Tier Limits:
- ✅ **3 shared-cpu-1x machines**
- ✅ **160GB outbound data transfer**
- ✅ **Free PostgreSQL** (3GB storage)
- ✅ **Automatic scaling** (scales to zero when not used)

## Commands to Remember:
```bash
fly deploy          # Deploy updates
fly open            # Open your app in browser
fly logs            # View application logs
fly ssh console     # SSH into your app
fly status          # Check app status
```
