# Deploy Credit Hardar to Railway

## Step 1: Create GitHub Repository

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Credit Hardar - Complete Platform"

# Create repo on GitHub and push
git remote add origin https://github.com/yourusername/credit-hardar
git push -u origin main
```

## Step 2: Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Choose "Deploy from GitHub repo"
4. Select your Credit Hardar repository
5. Railway will automatically:
   - Detect your docker-compose.yml
   - Build all containers
   - Set up databases
   - Give you a public URL

## Step 3: Configure Environment

Railway will ask for environment variables. Use these:

```
POSTGRES_USER=hardaruser
POSTGRES_PASSWORD=secure_railway_password
POSTGRES_DB=credithardar
JWT_SECRET=railway_jwt_secret_for_production
FERNET_KEY=ZmDfcTF7_60GrrY167zsiPd67pEvs0aGOv2oasOM1Pg=
REDIS_URL=redis://redis:6379/0
CORS_ORIGINS=https://your-app.railway.app
```

## Step 4: Share with Partners

You'll get URLs like:
- **Website**: https://credit-hardar-production.up.railway.app
- **API**: https://credit-hardar-production.up.railway.app/docs

## Benefits:
- ✅ Free tier available
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Custom domains
- ✅ Auto-deploys from GitHub
