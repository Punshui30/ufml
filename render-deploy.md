# Deploy Credit Hardar to Render (FREE)

## Why Render?
- ✅ **Completely FREE** for personal projects
- ✅ **Docker support** (your containers work as-is)
- ✅ **Managed PostgreSQL** (free tier)
- ✅ **Automatic HTTPS**
- ✅ **Custom domains**

## Step 1: Prepare for Render

1. **Push to GitHub** (if not already done):
```bash
git init
git add .
git commit -m "Credit Hardar - Ready for Render"
git remote add origin https://github.com/yourusername/credit-hardar
git push -u origin main
```

2. **Create render.yaml** (Render deployment config):
```yaml
services:
  - type: web
    name: credit-hardar-web
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production

  - type: web
    name: credit-hardar-api
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
    
databases:
  - name: credit-hardar-db
    databaseName: credithardar
    user: hardaruser
```

## Step 2: Deploy to Render

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your Credit Hardar repo
5. Render automatically detects and deploys!

## Step 3: Share with Partners

You'll get a URL like:
**https://credit-hardar.onrender.com**

## Free Tier Limits:
- ✅ Unlimited bandwidth
- ✅ Custom domains
- ✅ Automatic SSL
- ⚠️ Sleeps after 15 min inactivity (wakes up automatically)
- ⚠️ 512MB RAM (fine for demos)
